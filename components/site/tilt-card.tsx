"use client";

import type { PointerEvent, ReactNode } from "react";
import { useRef } from "react";

/** CSS 3D tilt with a moving highlight. Pointer-fine devices only; static elsewhere. */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="[perspective:1200px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className={`group relative transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] motion-reduce:[transform:none] ${className}`}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,255,255,0.35),transparent_45%)] group-hover:opacity-100"
        />
      </div>
    </div>
  );
}
