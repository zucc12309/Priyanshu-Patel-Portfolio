import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PointLight,
  Raycaster,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { maxWordLength, rasterizeWord } from "@/lib/pixel-font";

/**
 * A field of extruded blocks — an "architectural model" that can morph between
 * shapes. Heights are driven per-instance on the CPU (≈1k instances), which is
 * cheap and keeps the code small: one InstancedMesh, one draw call.
 *
 *  - "monogram": the letters PP raised out of a gently breathing terrain
 *  - "bars":     four columns — the impact metrics
 *  - "wave":     a continuous swell (used in the dark contact section)
 *
 * A pointer creates a ripple and tints nearby blocks with the signal colour.
 */

export type FieldTheme = "plaster" | "obsidian";

export type FieldOptions = {
  theme: FieldTheme;
  /** Primary shape; "monogram" morphs to "bars" with progress. */
  shape: "monogram" | "wave";
  compact: boolean;
  reducedMotion: boolean;
  onFrame?: (anchors: { x: number; y: number; visible: number }[]) => void;
};

const SIGNAL = new Color("#FF4D12");

const themes = {
  plaster: { base: new Color("#F3EFE7"), low: new Color("#DCD5C9"), shadow: 0.16 },
  obsidian: { base: new Color("#232220"), low: new Color("#151514"), shadow: 0.5 },
};

// Bars: relative heights for ₹1,500 Cr, −40%, −30%, +18% (visual, not to scale).
const BAR_HEIGHTS = [6.2, 4.6, 3.6, 2.6];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export class BlockField {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private mesh: InstancedMesh;
  private nx: number;
  private nz: number;
  private count: number;
  private heights: Float32Array;
  private tint: Float32Array;
  private monogram: Float32Array;
  private bars: Float32Array;
  private barIndex: Int8Array;
  private positions: Float32Array;
  private matrix = new Matrix4();
  private color = new Color();
  private raycaster = new Raycaster();
  private ground = new Plane(new Vector3(0, 1, 0), 0);
  private pointerNdc = new Vector2(0, 0);
  private pointerWorld = new Vector3(999, 0, 999);
  private pointerTarget = new Vector3(999, 0, 999);
  private pointerActive = false;
  private progress = 0;
  private progressSmooth = 0;
  private raf = 0;
  private running = false;
  private last = 0;
  private time = 0;
  private born = 0;
  private width = 1;
  private height = 1;
  private camBase = new Vector3();
  private barAnchors: Vector3[] = [];
  private projected = new Vector3();
  private opts: FieldOptions;
  private group = new Group();
  private rotation = 0;
  private rotationVel = 0;
  private dragging = false;
  private lastInteraction = 0;
  private pulses: { x: number; z: number; t0: number }[] = [];
  private local = new Vector3();

  constructor(private canvas: HTMLCanvasElement, opts: FieldOptions) {
    this.opts = opts;
    this.nx = opts.compact ? 26 : 44;
    this.nz = opts.compact ? 18 : 26;
    this.count = this.nx * this.nz;

    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.compact ? 1.5 : 1.75));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = opts.theme === "plaster" ? 1.05 : 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.camera = new PerspectiveCamera(24, 1, 1, 400);

    // Lights
    if (opts.theme === "plaster") {
      this.scene.add(new HemisphereLight(0xffffff, 0xb8b0a2, 1.6));
    } else {
      this.scene.add(new HemisphereLight(0x8a8780, 0x0b0b0a, 0.9));
      const rim = new PointLight(0xff4d12, 60, 60, 1.6);
      rim.position.set(-14, 6, -10);
      this.scene.add(rim);
    }
    const sun = new DirectionalLight(0xffffff, opts.theme === "plaster" ? 2.4 : 2.0);
    sun.position.set(-16, 26, 12);
    sun.castShadow = true;
    const size = opts.compact ? 512 : 1024;
    sun.shadow.mapSize.set(size, size);
    const s = Math.max(this.nx, this.nz) * 0.75;
    Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 80 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    this.scene.add(sun);

    // Shadow catcher
    const floor = new Mesh(new PlaneGeometry(200, 200), new ShadowMaterial({ opacity: themes[opts.theme].shadow }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.001;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Blocks
    const geometry = new BoxGeometry(0.84, 1, 0.84);
    geometry.translate(0, 0.5, 0);
    const material = new MeshStandardMaterial({
      color: 0xffffff,
      roughness: opts.theme === "plaster" ? 0.92 : 0.45,
      metalness: opts.theme === "plaster" ? 0 : 0.25,
    });
    this.mesh = new InstancedMesh(geometry, material, this.count);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.group.add(this.mesh);
    this.scene.add(this.group);

    this.heights = new Float32Array(this.count);
    this.tint = new Float32Array(this.count);
    this.positions = new Float32Array(this.count * 2);
    for (let i = 0; i < this.nx; i++) {
      for (let j = 0; j < this.nz; j++) {
        const k = i * this.nz + j;
        this.positions[k * 2] = i - (this.nx - 1) / 2;
        this.positions[k * 2 + 1] = j - (this.nz - 1) / 2;
        this.mesh.setColorAt(k, themes[opts.theme].base);
      }
    }

    this.monogram = this.buildMonogram();
    const { heights, index, anchors } = this.buildBars();
    this.bars = heights;
    this.barIndex = index;
    this.barAnchors = anchors;

    this.born = performance.now();
    this.resize();
  }

  /** Rasterise "PP" onto the grid with the pixel font. */
  private buildMonogram() {
    if (this.opts.shape !== "monogram") return new Float32Array(this.count);
    return rasterizeWord("PP", this.nx, this.nz);
  }

  get maxChars() {
    return maxWordLength(this.nx);
  }

  /** Reshape the raised letters; an empty string restores the monogram. */
  setText(word: string) {
    this.monogram = rasterizeWord(word || "PP", this.nx, this.nz);
    if (!this.opts.reducedMotion) this.pulses.push({ x: 0, z: 0, t0: this.time });
    if (!this.running) this.frame(performance.now());
    this.lastInteraction = performance.now();
  }

  /** Converts a screen point to grid-local coordinates on the floor. */
  private toLocal(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerNdc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const hit = this.raycaster.ray.intersectPlane(this.ground, this.local);
    return hit ? this.group.worldToLocal(hit) : null;
  }

  /** Sends a shockwave out from a screen point. */
  pulse(clientX: number, clientY: number) {
    if (this.opts.reducedMotion) return;
    const p = this.toLocal(clientX, clientY);
    if (!p) return;
    if (this.pulses.length > 5) this.pulses.shift();
    this.pulses.push({ x: p.x, z: p.z, t0: this.time });
    this.lastInteraction = performance.now();
  }

  beginDrag() {
    this.dragging = true;
    this.rotationVel = 0;
  }

  /** Rotate by a horizontal pixel delta while dragging. */
  dragBy(dx: number) {
    const delta = dx * 0.006;
    this.rotation += delta;
    this.rotationVel = delta * 60;
    this.lastInteraction = performance.now();
  }

  endDrag() {
    this.dragging = false;
  }

  private buildBars() {
    const heights = new Float32Array(this.count);
    const index = new Int8Array(this.count).fill(-1);
    const anchors: Vector3[] = [];
    const bw = Math.max(3, Math.round(this.nx / 8));
    const bd = Math.max(3, Math.round(this.nz / 3.2));
    const gap = Math.round(bw * 0.9);
    const total = 4 * bw + 3 * gap;
    const startX = Math.floor((this.nx - total) / 2);
    const startZ = Math.floor((this.nz - bd) / 2);
    for (let b = 0; b < 4; b++) {
      const x0 = startX + b * (bw + gap);
      for (let i = x0; i < x0 + bw; i++) {
        for (let j = startZ; j < startZ + bd; j++) {
          const k = i * this.nz + j;
          heights[k] = BAR_HEIGHTS[b];
          index[k] = b;
        }
      }
      anchors.push(new Vector3(x0 + (bw - 1) / 2 - (this.nx - 1) / 2, BAR_HEIGHTS[b] + 0.6, startZ + (bd - 1) / 2 - (this.nz - 1) / 2));
    }
    return { heights, index, anchors };
  }

  setProgress(p: number) {
    this.progress = Math.min(1, Math.max(0, p));
  }

  setPointer(clientX: number, clientY: number) {
    const hit = this.toLocal(clientX, clientY);
    if (hit) {
      this.pointerTarget.copy(hit);
      if (!this.pointerActive) this.pointerWorld.copy(hit);
      this.pointerActive = true;
    }
  }

  clearPointer() {
    this.pointerActive = false;
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;

    // Fit the grid: wider screens keep the model on the right of the text.
    const portrait = this.camera.aspect < 0.9;
    const span = Math.max(this.nx, this.nz * 1.2);
    const dist = portrait ? span * 2.9 : span * 1.85;
    this.camBase.set(0.42, 0.72, 0.85).normalize().multiplyScalar(dist);
    this.camera.position.copy(this.camBase);
    this.camera.lookAt(0, 0, 0);
    this.applyViewOffset(0);
    this.camera.updateProjectionMatrix();
    if (!this.running) this.frame(performance.now());
  }

  /** Shifts the projected scene so it sits beside / below the copy. */
  private applyViewOffset(mix: number) {
    const portrait = this.camera.aspect < 0.9;
    let ox = 0;
    let oy = 0;
    if (this.opts.shape === "monogram") {
      if (portrait) oy = -this.height * (0.3 - 0.42 * mix);
      else ox = -this.width * (0.2 - 0.07 * mix);
    } else if (!portrait) {
      ox = -this.width * 0.12;
    }
    this.camera.setViewOffset(this.width, this.height, ox, oy, this.width, this.height);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.frame(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private frame(now: number) {
    const reduced = this.opts.reducedMotion;
    const dt = Math.min(0.05, (now - this.last) / 1000 || 0.016);
    this.last = now;
    if (!reduced) this.time += dt;
    const t = this.time;
    const intro = reduced ? 1 : smooth(0, 1.6, (now - this.born) / 1000);

    this.progressSmooth += (this.progress - this.progressSmooth) * (reduced ? 1 : 1 - Math.exp(-dt * 6));
    const mix = this.opts.shape === "monogram" ? smooth(0.15, 0.85, this.progressSmooth) : 0;

    // Pointer follows with a little lag; the ripple fades when idle.
    this.pointerWorld.lerp(this.pointerTarget, 1 - Math.exp(-dt * 10));
    const rippleAmp = this.pointerActive && !reduced ? 1 : 0;

    // Drag-to-rotate with inertia; drifts home after a few idle seconds.
    if (!this.dragging) {
      this.rotation += this.rotationVel * dt;
      this.rotationVel *= Math.exp(-dt * 3.5);
      if (now - this.lastInteraction > 4000) this.rotation += (0 - this.rotation) * (1 - Math.exp(-dt * 1.2));
    }
    this.group.rotation.y = this.rotation;
    this.pulses = this.pulses.filter((p) => t - p.t0 < 2.6);

    const theme = themes[this.opts.theme];
    const ease = reduced ? 1 : 1 - Math.exp(-dt * 7);

    for (let k = 0; k < this.count; k++) {
      const x = this.positions[k * 2];
      const z = this.positions[k * 2 + 1];

      // Staggered build-in from left to right.
      const build = smooth(0, 1, intro * 1.6 - ((x + this.nx / 2) / this.nx) * 0.6);

      let target: number;
      let accent = 0;
      if (this.opts.shape === "wave") {
        const w = Math.sin(x * 0.42 + t * 1.1) * Math.cos(z * 0.38 + t * 0.8) * 0.5 + 0.5;
        target = 0.3 + 2.4 * w * w;
        accent = smooth(0.82, 1, w) * 0.85;
      } else {
        const breathe = Math.sin(x * 0.35 + t * 0.9) * Math.cos(z * 0.45 + t * 0.7) * 0.5 + 0.5;
        const terrain = 0.25 + breathe * 0.55;
        const m = this.monogram[k];
        const mono = terrain + m * 2.4;
        // Stagger the morph by column so the change sweeps across the model.
        const morph = smooth(0, 1, mix * 1.5 - ((x + this.nx / 2) / this.nx) * 0.5);
        const barH = this.barIndex[k] >= 0 ? this.bars[k] : 0.12 + breathe * 0.12;
        target = mono + (barH - mono) * morph;
        accent = m * (1 - morph) + (this.barIndex[k] === 0 ? morph : 0);
      }

      if (rippleAmp) {
        const dx = x - this.pointerWorld.x;
        const dz = z - this.pointerWorld.z;
        const d2 = dx * dx + dz * dz;
        const bump = Math.exp(-d2 / 7) * (1.4 + Math.sin(Math.sqrt(d2) * 1.4 - t * 6) * 0.35);
        target += bump;
        accent = Math.max(accent, Math.min(1, bump * 0.6));
      }

      for (const p of this.pulses) {
        const age = t - p.t0;
        const d = Math.hypot(x - p.x, z - p.z);
        const front = d - age * 15;
        const wave = Math.exp(-(front * front) / 4) * 2.6 * Math.exp(-age * 1.3);
        target += wave;
        accent = Math.max(accent, Math.min(1, wave * 0.5));
      }

      target *= build;
      this.heights[k] += (target - this.heights[k]) * ease;
      this.tint[k] += (accent - this.tint[k]) * ease;

      const h = Math.max(0.02, this.heights[k]);
      this.matrix.makeScale(1, h, 1);
      this.matrix.setPosition(x, 0, z);
      this.mesh.setMatrixAt(k, this.matrix);

      // Lower blocks read darker, like a model under a single lamp.
      this.color.copy(theme.low).lerp(theme.base, Math.min(1, h / 1.6));
      this.color.lerp(SIGNAL, this.tint[k]);
      this.mesh.setColorAt(k, this.color);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;

    // Pull back as the bars rise so all four fit; gentle pointer parallax.
    const px = this.pointerActive && !reduced ? this.pointerNdc.x : 0;
    const py = this.pointerActive && !reduced ? this.pointerNdc.y : 0;
    const zoom = 1 + 0.16 * mix;
    this.camera.position.set(this.camBase.x * zoom + px * 1.6, this.camBase.y * zoom + py * 1.2, this.camBase.z * zoom);
    this.camera.lookAt(0, 0.8 + mix * 1.2, 0);
    this.applyViewOffset(mix);
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);

    if (this.opts.onFrame) {
      this.opts.onFrame(
        this.barAnchors.map((a) => {
          this.projected.copy(a);
          this.group.localToWorld(this.projected).project(this.camera);
          return {
            x: (this.projected.x * 0.5 + 0.5) * this.width,
            y: (-this.projected.y * 0.5 + 0.5) * this.height,
            visible: smooth(0.75, 1, mix),
          };
        }),
      );
    }
  }

  dispose() {
    this.stop();
    this.mesh.geometry.dispose();
    (this.mesh.material as MeshStandardMaterial).dispose();
    this.renderer.dispose();
  }
}
