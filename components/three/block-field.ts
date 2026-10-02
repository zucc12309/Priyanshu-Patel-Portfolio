import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Quaternion,
  Raycaster,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

/**
 * The signature sculpture: an architectural model of plaster blocks.
 *
 *  progress 0 — scattered inputs: blocks jittered, rotated, at noisy heights,
 *               with a few signal-orange inputs among them.
 *  progress 1 — an organised system in three districts, left to right:
 *               Analysis (columns sorted by height), Requirements (even,
 *               terraced specification layers) and AI products (towers).
 *
 * Progress follows the page scroll (it never hijacks it). The pointer adds a
 * gentle ripple; nothing about the sculpture is required to use the site.
 */

export type DistrictAnchor = { id: "analysis" | "requirements" | "products"; x: number; y: number; visible: number };

export type FieldOptions = {
  compact: boolean;
  reducedMotion: boolean;
  onFrame?: (anchors: DistrictAnchor[]) => void;
};

const PLASTER = new Color("#F3EFE7");
const LOW = new Color("#DCD5C9");
const SIGNAL = new Color("#FF4D12");

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Deterministic pseudo-random so the "scatter" is the same on every visit.
const rand = (k: number, salt: number) => {
  const x = Math.sin(k * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export class BlockField {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private mesh: InstancedMesh;
  private nx: number;
  private nz: number;
  private count: number;
  private grid: Float32Array; // organised x,z
  private scatter: Float32Array; // dx, dz, rotation, height, signal
  private organised: Float32Array; // height, accent
  private heights: Float32Array;
  private tint: Float32Array;
  private matrix = new Matrix4();
  private quat = new Quaternion();
  private up = new Vector3(0, 1, 0);
  private pos = new Vector3();
  private scl = new Vector3();
  private color = new Color();
  private raycaster = new Raycaster();
  private ground = new Plane(new Vector3(0, 1, 0), 0);
  private pointerNdc = new Vector2();
  private pointerWorld = new Vector3(999, 0, 999);
  private pointerTarget = new Vector3(999, 0, 999);
  private hit = new Vector3();
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
  private districtCentres: { id: DistrictAnchor["id"]; pos: Vector3 }[] = [];
  private projected = new Vector3();

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: FieldOptions,
  ) {
    this.nx = opts.compact ? 27 : 45;
    this.nz = opts.compact ? 16 : 24;
    this.count = this.nx * this.nz;

    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.compact ? 1.5 : 1.75));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.camera = new PerspectiveCamera(24, 1, 1, 400);

    // One lamp and a soft sky.
    this.scene.add(new HemisphereLight(0xffffff, 0xb8b0a2, 1.6));
    const sun = new DirectionalLight(0xffffff, 2.4);
    sun.position.set(-16, 26, 12);
    sun.castShadow = true;
    const size = opts.compact ? 512 : 1024;
    sun.shadow.mapSize.set(size, size);
    const s = Math.max(this.nx, this.nz) * 0.75;
    Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 80 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    this.scene.add(sun);

    const floor = new Mesh(new PlaneGeometry(200, 200), new ShadowMaterial({ opacity: 0.16 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.001;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const geometry = new BoxGeometry(0.84, 1, 0.84);
    geometry.translate(0, 0.5, 0);
    this.mesh = new InstancedMesh(geometry, new MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0 }), this.count);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    this.grid = new Float32Array(this.count * 2);
    this.scatter = new Float32Array(this.count * 5);
    this.organised = new Float32Array(this.count * 2);
    this.heights = new Float32Array(this.count);
    this.tint = new Float32Array(this.count);
    this.build();

    this.born = performance.now();
    this.resize();
  }

  /** Precompute both states for every block. */
  private build() {
    const { nx, nz } = this;
    // Three districts with one-block paths between them.
    const w = Math.floor((nx - 2) / 3);
    const bounds = [
      { id: "analysis" as const, x0: 0, x1: w },
      { id: "requirements" as const, x0: w + 1, x1: 2 * w + 1 },
      { id: "products" as const, x0: 2 * w + 2, x1: nx },
    ];

    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < nz; j++) {
        const k = i * nz + j;
        this.grid[k * 2] = i - (nx - 1) / 2;
        this.grid[k * 2 + 1] = j - (nz - 1) / 2;

        // Scattered inputs.
        this.scatter[k * 5] = (rand(k, 1) - 0.5) * 0.9;
        this.scatter[k * 5 + 1] = (rand(k, 2) - 0.5) * 0.9;
        this.scatter[k * 5 + 2] = (rand(k, 3) - 0.5) * 1.4;
        this.scatter[k * 5 + 3] = 0.12 + Math.pow(rand(k, 4), 3) * 2.7;
        this.scatter[k * 5 + 4] = rand(k, 5) > 0.95 ? 1 : 0;

        // Organised system.
        const d = bounds.findIndex((b) => i >= b.x0 && i < b.x1);
        const edge = j === 0 || j === nz - 1;
        let h = 0.05;
        let accent = 0;
        if (d === 0) {
          // Analysis: rows of columns, sorted short → tall across the district.
          const t = (i - bounds[0].x0) / Math.max(1, bounds[0].x1 - bounds[0].x0 - 1);
          const row = Math.floor(j / 4) % 2 === 0;
          h = edge ? 0.15 : row ? 0.4 + t * 2.6 : 0.15;
        } else if (d === 1) {
          // Requirements: even terraces — each band of rows one step higher.
          h = edge ? 0.15 : 0.35 + Math.floor((j / nz) * 4) * 0.32;
        } else if (d === 2) {
          // AI products: towers on a plinth, assembled from the inputs.
          const lx = i - bounds[2].x0;
          const tower = lx % 5 >= 1 && lx % 5 <= 3 && j % 7 >= 2 && j % 7 <= 4;
          h = tower ? 2.6 + rand(Math.floor(lx / 5) * 13 + Math.floor(j / 7), 6) * 1.8 : 0.25;
          accent = tower ? 1 : 0;
        }
        this.organised[k * 2] = h;
        this.organised[k * 2 + 1] = accent;
      }
    }

    this.districtCentres = bounds.map((b, n) => ({
      id: b.id,
      pos: new Vector3((b.x0 + b.x1 - 1) / 2 - (nx - 1) / 2, n === 0 ? 3.4 : n === 1 ? 2.0 : 4.8, (nz - 1) / 2 - 1),
    }));
  }

  setProgress(p: number) {
    this.progress = Math.min(1, Math.max(0, p));
    if (!this.running) this.frame(performance.now());
  }

  setPointer(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerNdc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const hit = this.raycaster.ray.intersectPlane(this.ground, this.hit);
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
    const portrait = this.camera.aspect < 0.9;
    const span = Math.max(this.nx, this.nz * 1.2);
    this.camBase.set(0.42, 0.72, 0.85).normalize().multiplyScalar(portrait ? span * 2.7 : span * 1.85);
    this.camera.position.copy(this.camBase);
    this.camera.lookAt(0, 0.8, 0);
    this.applyViewOffset(0);
    this.camera.updateProjectionMatrix();
    if (!this.running) this.frame(performance.now());
  }

  /** Desktop: the model sits right of the copy. Portrait: below it, rising as it organises. */
  private applyViewOffset(mix: number) {
    const portrait = this.camera.aspect < 0.9;
    const ox = portrait ? 0 : -this.width * (0.2 + 0.04 * mix);
    const oy = portrait ? -this.height * (0.34 - 0.42 * mix) : 0;
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
    const build = reduced ? 1 : smooth(0, 1.1, (now - this.born) / 1000);

    this.progressSmooth += (this.progress - this.progressSmooth) * (reduced ? 1 : 1 - Math.exp(-dt * 6));
    const mix = smooth(0.1, 0.8, this.progressSmooth);

    this.pointerWorld.lerp(this.pointerTarget, 1 - Math.exp(-dt * 10));
    const ripple = this.pointerActive && !reduced;
    const ease = reduced ? 1 : 1 - Math.exp(-dt * 7);

    for (let k = 0; k < this.count; k++) {
      const gx = this.grid[k * 2];
      const gz = this.grid[k * 2 + 1];
      // The organising sweep travels left → right through the districts.
      const m = smooth(0, 1, mix * 1.6 - ((gx + this.nx / 2) / this.nx) * 0.6);
      const s = 1 - m;

      const breathe = reduced ? 0 : Math.sin(gx * 0.35 + t * 0.9) * Math.cos(gz * 0.45 + t * 0.7) * 0.18 * s;
      let target = this.scatter[k * 5 + 3] * s + this.organised[k * 2] * m + breathe;
      let accent = this.scatter[k * 5 + 4] * s + this.organised[k * 2 + 1] * m;

      if (ripple) {
        const dx = gx - this.pointerWorld.x;
        const dz = gz - this.pointerWorld.z;
        const bump = Math.exp(-(dx * dx + dz * dz) / 7) * 0.9;
        target += bump;
        accent = Math.max(accent, bump * 0.35);
      }

      target = Math.max(0.03, target * smooth(0, 1, build * 1.6 - ((gx + this.nx / 2) / this.nx) * 0.6));
      this.heights[k] += (target - this.heights[k]) * ease;
      this.tint[k] += (accent - this.tint[k]) * ease;

      this.pos.set(gx + this.scatter[k * 5] * s, 0, gz + this.scatter[k * 5 + 1] * s);
      this.quat.setFromAxisAngle(this.up, this.scatter[k * 5 + 2] * s);
      this.scl.set(1, this.heights[k], 1);
      this.matrix.compose(this.pos, this.quat, this.scl);
      this.mesh.setMatrixAt(k, this.matrix);

      this.color.copy(LOW).lerp(PLASTER, Math.min(1, this.heights[k] / 1.4));
      this.color.lerp(SIGNAL, Math.min(1, this.tint[k]));
      this.mesh.setColorAt(k, this.color);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;

    const px = this.pointerActive && !reduced ? this.pointerNdc.x : 0;
    const py = this.pointerActive && !reduced ? this.pointerNdc.y : 0;
    const zoom = 1 + 0.34 * mix;
    this.camera.position.set(this.camBase.x * zoom + px * 1.4, this.camBase.y * zoom + py * 1.0, this.camBase.z * zoom);
    this.camera.lookAt(0, 0.8 + mix * 0.6, 0);
    this.applyViewOffset(mix);
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);

    if (this.opts.onFrame) {
      const visible = smooth(0.7, 0.95, mix);
      this.opts.onFrame(
        this.districtCentres.map((d) => {
          this.projected.copy(d.pos).project(this.camera);
          return { id: d.id, x: (this.projected.x * 0.5 + 0.5) * this.width, y: (-this.projected.y * 0.5 + 0.5) * this.height, visible };
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
