import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

/**
 * Small, self-contained 3D scenes — one per featured project — that show how
 * each product works. They share one stage (lights, shadow catcher, camera,
 * pointer parallax) and expose anchor points so HTML labels can be pinned.
 */

export type SceneLabel = { id: string; text: string; x: number; y: number; visible: number; accent?: boolean };
export type SceneKind = "memory-router" | "lifepilot" | "ridecompare";

const PLASTER = new Color("#F3EFE7");
const SHADE = new Color("#D9D2C5");
const SIGNAL = new Color("#FF4D12");
const INK = new Color("#2A2926");

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mat = (color: Color, rough = 0.9) => new MeshStandardMaterial({ color: color.clone(), roughness: rough, metalness: 0 });

type Anchor = { id: string; text: string; pos: Vector3; visible?: number; accent?: boolean };

interface Content {
  update(t: number, dt: number): void;
  click(): void;
  anchors(): Anchor[];
}

/* ------------------------------------------------------------------------ */
/* Memory Router — memories stream from a palace into a router, compressed, */
/* then out to the provider it picks.                                       */
/* ------------------------------------------------------------------------ */

function memoryRouter(root: Group): Content {
  const COLS = 6;
  const ROWS = 5;
  const palaceCount = COLS * ROWS;
  const palace = new InstancedMesh(new BoxGeometry(0.8, 1, 0.8).translate(0, 0.5, 0), mat(PLASTER), palaceCount);
  palace.castShadow = palace.receiveShadow = true;
  const heights: number[] = [];
  const cells: Vector3[] = [];
  const m = new Matrix4();
  for (let i = 0; i < COLS; i++)
    for (let j = 0; j < ROWS; j++) {
      const k = i * ROWS + j;
      const h = 0.4 + ((i * 7 + j * 13) % 5) * 0.35;
      heights.push(h);
      const p = new Vector3(-8 + i * 1.05, 0, -2.1 + j * 1.05);
      cells.push(p);
      m.makeScale(1, h, 1).setPosition(p);
      palace.setMatrixAt(k, m);
      palace.setColorAt(k, PLASTER);
    }
  root.add(palace);

  const router = new Group();
  const ring = new Mesh(new TorusGeometry(1.5, 0.28, 16, 48), mat(INK, 0.5));
  ring.castShadow = true;
  const core = new Mesh(new BoxGeometry(1, 1, 1), mat(SIGNAL, 0.6));
  core.castShadow = true;
  router.add(ring, core);
  router.position.set(0.5, 2.6, 0);
  const plinth = new Mesh(new CylinderGeometry(1.2, 1.4, 1.6, 32).translate(0, 0.8, 0), mat(PLASTER));
  plinth.castShadow = plinth.receiveShadow = true;
  plinth.position.set(0.5, 0, 0);
  root.add(router, plinth);

  const providers = ["Ollama", "OpenAI", "Anthropic", "Gemini"].map((name, i) => {
    const pad = new Mesh(new BoxGeometry(1.6, 0.5, 1.6).translate(0, 0.25, 0), mat(PLASTER));
    pad.castShadow = pad.receiveShadow = true;
    pad.position.set(7, 0, -3.6 + i * 2.4);
    root.add(pad);
    return { name, pad, glow: 0 };
  });

  const N = 48;
  const bits = new InstancedMesh(new BoxGeometry(0.32, 0.32, 0.32), mat(SIGNAL, 0.6), N);
  bits.castShadow = true;
  root.add(bits);
  type Bit = { from: Vector3; to: Vector3; via: Vector3; t: number; speed: number; alive: boolean; out: boolean };
  const pool: Bit[] = Array.from({ length: N }, () => ({ from: new Vector3(), to: new Vector3(), via: new Vector3(), t: 0, speed: 1, alive: false, out: false }));
  const lit = new Float32Array(palaceCount);
  let target = 0;
  let nextBatch = 0.4;
  let pendingOut = 0;
  let outTimer = 0;
  const routerPos = router.position.clone();
  const tmp = new Vector3();
  const q = new Quaternion();
  const one = new Vector3(1, 1, 1);
  const hidden = new Matrix4().makeScale(0, 0, 0);

  const spawn = (from: Vector3, to: Vector3, out: boolean) => {
    const b = pool.find((p) => !p.alive);
    if (!b) return;
    b.from.copy(from);
    b.to.copy(to);
    b.via.copy(from).add(to).multiplyScalar(0.5).setY(Math.max(from.y, to.y) + 2.4);
    b.t = 0;
    b.speed = out ? 1.1 : 0.7 + Math.random() * 0.25;
    b.alive = true;
    b.out = out;
  };

  const batch = () => {
    target = (target + 1 + Math.floor(Math.random() * 3)) % providers.length;
    const picks = new Set<number>();
    while (picks.size < 5) picks.add(Math.floor(Math.random() * palaceCount));
    picks.forEach((k) => {
      lit[k] = 1;
      for (let n = 0; n < 3; n++) {
        tmp.copy(cells[k]).setY(heights[k] + 0.3);
        spawn(tmp.clone(), routerPos, false);
      }
    });
    // Compression: ~15 memories in, 3 compact chunks out.
    pendingOut = 3;
    outTimer = 1.5;
  };

  return {
    update(t, dt) {
      nextBatch -= dt;
      if (nextBatch <= 0) {
        batch();
        nextBatch = 3.6;
      }
      if (pendingOut > 0) {
        outTimer -= dt;
        if (outTimer <= 0) {
          spawn(routerPos, providers[target].pad.position.clone().setY(0.7), true);
          pendingOut -= 1;
          outTimer = 0.18;
        }
      }
      ring.rotation.y = t * 0.8;
      ring.rotation.x = Math.sin(t * 0.6) * 0.3;
      core.rotation.set(t * 0.7, t * 1.1, 0);
      const pulse = pool.some((p) => p.alive && !p.out && p.t > 0.9) ? 1.15 : 1;
      core.scale.lerp(tmp.set(pulse, pulse, pulse), 0.2);

      pool.forEach((b, i) => {
        if (!b.alive) {
          bits.setMatrixAt(i, hidden);
          return;
        }
        b.t += dt * b.speed;
        if (b.t >= 1) {
          b.alive = false;
          if (b.out) providers[target].glow = 1;
          bits.setMatrixAt(i, hidden);
          return;
        }
        const u = b.t;
        // quadratic bezier
        tmp
          .copy(b.from)
          .multiplyScalar((1 - u) * (1 - u))
          .addScaledVector(b.via, 2 * (1 - u) * u)
          .addScaledVector(b.to, u * u);
        const s = b.out ? 1.5 : 1;
        m.compose(tmp, q, one.clone().multiplyScalar(s));
        bits.setMatrixAt(i, m);
      });
      bits.instanceMatrix.needsUpdate = true;

      for (let k = 0; k < palaceCount; k++) {
        lit[k] = Math.max(0, lit[k] - dt * 0.5);
        palace.setColorAt(k, PLASTER.clone().lerp(SIGNAL, lit[k]));
      }
      if (palace.instanceColor) palace.instanceColor.needsUpdate = true;
      providers.forEach((p, i) => {
        p.glow = Math.max(i === target ? 0.25 : 0, p.glow - dt * 0.6);
        (p.pad.material as MeshStandardMaterial).color.copy(PLASTER).lerp(SIGNAL, p.glow);
        p.pad.scale.y = 1 + p.glow * 0.8;
      });
    },
    click() {
      nextBatch = 0;
    },
    anchors() {
      return [
        { id: "palace", text: "Local memory", pos: new Vector3(-6.4, 2.4, 2.6) },
        { id: "router", text: "Router · −80–90% tokens", pos: new Vector3(0.5, 4.8, 0), accent: true },
        ...providers.map((p, i) => ({ id: p.name, text: p.name, pos: p.pad.position.clone().setY(1.5), accent: i === target })),
      ];
    },
  };
}

/* ------------------------------------------------------------------------ */
/* LifePilot — the decision loop as a track; the order waits at the         */
/* approval gate until you click (or a moment passes).                      */
/* ------------------------------------------------------------------------ */

function lifePilot(root: Group): Content {
  const stages = ["Context", "Memory", "Reason", "Propose", "Approve", "Execute", "Remember"];
  const R = 5.2;
  const angle = (i: number) => -Math.PI / 2 + (i / stages.length) * Math.PI * 2;
  const nodes = stages.map((_, i) => {
    const node = new Mesh(new BoxGeometry(1.3, 1, 1.3).translate(0, 0.5, 0), mat(PLASTER));
    node.castShadow = node.receiveShadow = true;
    node.position.set(Math.cos(angle(i)) * R, 0, Math.sin(angle(i)) * R);
    node.scale.y = 0.6;
    root.add(node);
    return node;
  });
  const track = new Mesh(new TorusGeometry(R, 0.08, 8, 96), mat(SHADE));
  track.rotation.x = Math.PI / 2;
  track.position.y = 0.05;
  root.add(track);

  // Gate at "Approve": two slabs that slide apart.
  const gi = stages.indexOf("Approve");
  const ga = angle(gi) - 0.32;
  const gatePos = new Vector3(Math.cos(ga) * R, 0, Math.sin(ga) * R);
  const gate = new Group();
  gate.position.copy(gatePos);
  gate.rotation.y = -ga;
  const slabA = new Mesh(new BoxGeometry(0.25, 1.6, 0.8).translate(0, 0.8, 0), mat(INK, 0.5));
  const slabB = slabA.clone();
  slabA.castShadow = slabB.castShadow = true;
  gate.add(slabA, slabB);
  root.add(gate);

  const token = new Mesh(new BoxGeometry(0.7, 0.7, 0.7), mat(SIGNAL, 0.6));
  token.castShadow = true;
  root.add(token);

  // Memory column in the centre grows with each completed loop.
  const memory: Mesh[] = [];
  const memGeo = new BoxGeometry(1.4, 0.4, 1.4);
  for (let i = 0; i < 6; i++) {
    const b = new Mesh(memGeo, mat(i === 0 ? PLASTER : PLASTER));
    b.castShadow = b.receiveShadow = true;
    b.position.set(0, 0.2 + i * 0.42, 0);
    b.scale.setScalar(i < 2 ? 1 : 0.0001);
    root.add(b);
    memory.push(b);
  }
  let memCount = 2;

  let theta = angle(0);
  let waiting = false;
  let waitTime = 0;
  let open = 0;
  let approved = false;
  let loops = 0;

  return {
    update(t, dt) {
      const gateTheta = ga - 0.25;
      if (!approved && !waiting && theta < gateTheta && theta + dt * 1.1 >= gateTheta) {
        waiting = true;
        waitTime = 0;
      }
      if (waiting) {
        waitTime += dt;
        if (waitTime > 3.2) {
          waiting = false;
          approved = true;
        }
      } else {
        theta += dt * 1.1;
      }
      open += ((approved ? 1 : 0) - open) * (1 - Math.exp(-dt * 8));
      slabA.position.z = -0.2 - open * 0.9;
      slabB.position.z = 0.2 + open * 0.9;

      if (theta > angle(0) + Math.PI * 2) {
        theta -= Math.PI * 2;
        approved = false;
        loops += 1;
        if (memCount < memory.length) memCount += 1;
        else memCount = 2;
      }
      token.position.set(Math.cos(theta) * R, 0.6 + Math.abs(Math.sin(t * 6)) * (waiting ? 0 : 0.15), Math.sin(theta) * R);
      token.rotation.y = -theta;

      nodes.forEach((n, i) => {
        const d = Math.abs(Math.atan2(Math.sin(theta - angle(i)), Math.cos(theta - angle(i))));
        const active = 1 - smooth(0.1, 0.6, d);
        n.scale.y += (0.6 + active * 1.4 - n.scale.y) * (1 - Math.exp(-dt * 10));
        (n.material as MeshStandardMaterial).color.copy(PLASTER).lerp(SIGNAL, active * 0.85);
      });
      memory.forEach((b, i) => {
        const s = i < memCount ? 1 : 0.0001;
        b.scale.setScalar(b.scale.x + (s - b.scale.x) * (1 - Math.exp(-dt * 6)));
        (b.material as MeshStandardMaterial).color.copy(i === memCount - 1 ? PLASTER.clone().lerp(SIGNAL, 0.35) : PLASTER);
      });
      void loops;
    },
    click() {
      if (waiting) {
        waiting = false;
        approved = true;
      }
    },
    anchors() {
      return [
        ...stages.map((s, i) => ({ id: s, text: s, pos: nodes[i].position.clone().setY(1.9), accent: s === "Approve" })),
        { id: "tap", text: "Waiting for your tap", pos: gatePos.clone().setY(3.4), visible: waiting ? 1 : 0, accent: true },
        { id: "mem", text: "Saved preferences", pos: new Vector3(0, 1.2, 1.2) },
      ];
    },
  };
}

/* ------------------------------------------------------------------------ */
/* RideCompare — four fare columns compete; the cheapest wins the trip.     */
/* ------------------------------------------------------------------------ */

function rideCompare(root: Group): Content {
  const names = ["Namma Yatri", "Rapido", "Ola", "Uber"];
  const cols = names.map((name, i) => {
    const col = new Mesh(new BoxGeometry(1.5, 1, 1.5).translate(0, 0.5, 0), mat(PLASTER));
    col.castShadow = col.receiveShadow = true;
    col.position.set(-4.5 + i * 3, 0, -2.5);
    root.add(col);
    return { name, col, target: 4, fare: 300 };
  });
  const crown = new Mesh(new OctahedronGeometry(0.45), mat(SIGNAL, 0.5));
  crown.castShadow = true;
  root.add(crown);

  // Road + trip
  const road = new Mesh(new BoxGeometry(12, 0.06, 1.2), mat(SHADE));
  road.position.set(0, 0.03, 3);
  road.receiveShadow = true;
  root.add(road);
  const pinGeo = new CylinderGeometry(0.35, 0.35, 1.2, 20).translate(0, 0.6, 0);
  const pickup = new Mesh(pinGeo, mat(INK, 0.5));
  const drop = new Mesh(pinGeo, mat(INK, 0.5));
  pickup.position.set(-6, 0, 3);
  drop.position.set(6, 0, 3);
  pickup.castShadow = drop.castShadow = true;
  root.add(pickup, drop);
  const car = new Mesh(new BoxGeometry(1.1, 0.55, 0.7).translate(0, 0.28, 0), mat(SIGNAL, 0.6));
  car.castShadow = true;
  root.add(car);

  let trip = 0;
  let winner = 0;
  let km = 8;
  let night = false;
  const reroll = () => {
    km = 3 + Math.round(Math.random() * 20);
    night = Math.random() > 0.6;
    // Same sample slab logic as the interactive demo (illustrative, not live prices).
    const cfg = [
      [30, 2, 15, 15, 1.5],
      [35, 1, 13, 15, 1.15],
      [45, 1, 14, 17, 1.25],
      [50, 1, 14, 18, 1.2],
    ];
    cols.forEach((c, i) => {
      const [base, free, r1, r2, nm] = cfg[i];
      const billable = Math.max(0, km - free);
      const fare = base + Math.min(billable, 6) * r1 + Math.max(0, billable - 6) * r2;
      c.fare = Math.round(fare * (night ? nm : 1));
    });
    const max = Math.max(...cols.map((c) => c.fare));
    cols.forEach((c) => (c.target = 1 + (c.fare / max) * 5));
    winner = cols.reduce((best, c, i) => (c.fare < cols[best].fare ? i : best), 0);
    trip = 0;
  };
  reroll();

  return {
    update(t, dt) {
      trip += dt * 0.28;
      if (trip > 1.25) reroll();
      cols.forEach((c, i) => {
        const jitter = Math.sin(t * 2.2 + i * 1.7) * 0.08; // live estimates wobble
        c.col.scale.y += (c.target + jitter - c.col.scale.y) * (1 - Math.exp(-dt * 4));
        (c.col.material as MeshStandardMaterial).color.copy(i === winner ? SIGNAL : PLASTER);
      });
      const w = cols[winner].col;
      crown.position.set(w.position.x, w.scale.y + 0.9 + Math.sin(t * 3) * 0.15, w.position.z);
      crown.rotation.y = t * 1.6;
      const u = Math.min(1, trip);
      car.position.set(-6 + u * 12, 0.06, 3);
      car.rotation.y = 0;
    },
    click() {
      reroll();
    },
    anchors() {
      return [
        ...cols.map((c, i) => ({ id: c.name, text: `${c.name} · ₹${c.fare}`, pos: c.col.position.clone().setY(-0.2).add(new Vector3(0, 0, 1.2)), accent: i === winner })),
        { id: "trip", text: `${km} km · ${night ? "night" : "day"}`, pos: new Vector3(0, 1.4, 3) },
      ];
    },
  };
}

/* ------------------------------------------------------------------------ */

const builders: Record<SceneKind, (root: Group) => Content> = {
  "memory-router": memoryRouter,
  lifepilot: lifePilot,
  ridecompare: rideCompare,
};

export class ProjectScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(30, 1, 0.5, 200);
  private root = new Group();
  private content: Content;
  private raf = 0;
  private running = false;
  private last = 0;
  private time = 0;
  private width = 1;
  private height = 1;
  private px = 0;
  private py = 0;
  private camBase = new Vector3(11, 11, 15);
  private v = new Vector3();
  private fit: number;
  private lookY: number;

  constructor(
    private canvas: HTMLCanvasElement,
    kind: SceneKind,
    private opts: { reducedMotion: boolean; onLabels: (labels: SceneLabel[]) => void },
  ) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.scene.add(new HemisphereLight(0xffffff, 0xb8b0a2, 1.6));
    const sun = new DirectionalLight(0xffffff, 2.3);
    sun.position.set(-10, 20, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 60 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    this.scene.add(sun);
    const floor = new Mesh(new PlaneGeometry(120, 120), new ShadowMaterial({ opacity: 0.14 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor, this.root);

    this.content = builders[kind](this.root);
    // Per-scene framing so every element sits inside the card.
    const framing: Record<SceneKind, [number, number]> = { "memory-router": [1.28, 1.2], lifepilot: [1.0, 0.6], ridecompare: [1.32, 2.2] };
    [this.fit, this.lookY] = framing[kind];
    this.resize();
  }

  setPointer(nx: number, ny: number) {
    this.px = nx;
    this.py = ny;
  }

  click() {
    this.content.click();
    if (!this.running) this.frame(performance.now());
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    const narrow = this.camera.aspect < 1.1 ? 1.35 : 1;
    this.camBase.set(11, 11, 15).multiplyScalar(this.fit * narrow);
    this.camera.updateProjectionMatrix();
    if (!this.running) this.frame(performance.now());
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
    const dt = Math.min(0.05, (now - this.last) / 1000 || 0.016);
    this.last = now;
    // Reduced motion: advance slowly so the scene still reads, without constant movement.
    const step = this.opts.reducedMotion ? dt * 0.25 : dt;
    this.time += step;
    this.content.update(this.time, step);

    this.camera.position.set(this.camBase.x + this.px * 2.2, this.camBase.y + this.py * 1.4, this.camBase.z);
    this.camera.lookAt(0, this.lookY, 0);
    this.renderer.render(this.scene, this.camera);

    this.opts.onLabels(
      this.content.anchors().map((a) => {
        this.v.copy(a.pos).project(this.camera);
        return {
          id: a.id,
          text: a.text,
          x: (this.v.x * 0.5 + 0.5) * this.width,
          y: (-this.v.y * 0.5 + 0.5) * this.height,
          visible: a.visible ?? 1,
          accent: a.accent,
        };
      }),
    );
  }

  dispose() {
    this.stop();
    this.scene.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const m = mesh.material as MeshStandardMaterial | undefined;
      if (m && "dispose" in m) m.dispose();
    });
    this.renderer.dispose();
  }
}
