"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectScene, SceneKind, SceneLabel } from "@/components/three/project-scenes";
import { playSound } from "@/lib/sound";

const hints: Record<SceneKind, string> = {
  "memory-router": "Click to send a new query",
  lifepilot: "Click to approve the order",
  ridecompare: "Click for a new trip",
};

const captions: Record<SceneKind, string> = {
  "memory-router": "Relevant memories light up, stream into the router, leave compressed, and go to the provider it picks.",
  lifepilot: "An order travels the decision loop and stops at the approval gate — nothing executes without your tap.",
  ridecompare: "Four providers' fares compete for each trip; the cheapest wins. Sample pricing, not live fares.",
};

export function ProjectSceneView({ kind }: { kind: SceneKind }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ProjectScene | null>(null);
  const labelRefs = useRef(new Map<string, HTMLSpanElement>());
  const [ids, setIds] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    let disposed = false;
    let visible = false;
    let scene: ProjectScene | null = null;
    let knownIds = "";

    const onLabels = (labels: SceneLabel[]) => {
      const key = labels.map((l) => l.id).join("|");
      if (key !== knownIds) {
        knownIds = key;
        setIds(labels.map((l) => l.id));
      }
      const boxWidth = box.clientWidth;
      labels.forEach((l) => {
        const el = labelRefs.current.get(l.id);
        if (!el) return;
        // Keep labels fully inside the card.
        const half = el.offsetWidth / 2 + 6;
        const x = Math.min(Math.max(l.x, half), boxWidth - half);
        el.style.transform = `translate3d(${x}px, ${l.y}px, 0) translate(-50%, -100%)`;
        el.style.opacity = String(l.visible);
        if (el.textContent !== l.text) el.textContent = l.text;
        el.dataset.accent = l.accent ? "1" : "0";
      });
    };

    const sync = () => {
      if (!scene) return;
      if (visible && document.visibilityState === "visible") scene.start();
      else scene.stop();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !scene && !disposed) void boot();
      sync();
    }, { rootMargin: "200px" });
    io.observe(box);

    const boot = async () => {
      try {
        const { ProjectScene } = await import("@/components/three/project-scenes");
        if (disposed) return;
        scene = new ProjectScene(canvas, kind, { reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches, onLabels });
        sceneRef.current = scene;
        setReady(true);
        sync();
      } catch {
        setFailed(true);
      }
    };

    const ro = new ResizeObserver(() => scene?.resize());
    ro.observe(box);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [kind]);

  if (failed) return null;

  return (
    <figure className="m-0">
      <div
        ref={boxRef}
        data-cursor="click"
        role="button"
        tabIndex={0}
        aria-label={`${hints[kind]}. ${captions[kind]}`}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          sceneRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
        }}
        onPointerLeave={() => sceneRef.current?.setPointer(0, 0)}
        onClick={() => {
          sceneRef.current?.click();
          playSound("thump");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            sceneRef.current?.click();
          }
        }}
        className="relative aspect-[16/11] cursor-pointer select-none overflow-hidden rounded-[inherit] bg-paper-2"
      >
        <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`} />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {ids.map((id) => (
            <span
              key={id}
              ref={(el) => {
                if (el) labelRefs.current.set(id, el);
                else labelRefs.current.delete(id);
              }}
              className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-paper/90 px-2 py-0.5 font-mono text-[10px] text-ink shadow-sm transition-opacity duration-300 data-[accent='1']:bg-ink data-[accent='1']:text-paper sm:text-[11px]"
            />
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/85 px-3 py-1 font-mono text-[11px] text-paper">{hints[kind]}</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-5 text-mute">{captions[kind]}</figcaption>
    </figure>
  );
}
