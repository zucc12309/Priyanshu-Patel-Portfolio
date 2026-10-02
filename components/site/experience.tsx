"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { notifyRouteCommitted } from "@/lib/view-transition";
import { initSound, playSound, soundEnabled } from "@/lib/sound";

/**
 * Site-wide experience layer: resolves view transitions when a route commits,
 * plays soft click sounds (if enabled), and draws the custom cursor.
 */
export function Experience() {
  const pathname = usePathname();

  // The new route has committed to the DOM: let the view transition animate.
  // (Not via requestAnimationFrame — rendering is paused during a transition update.)
  useEffect(() => {
    notifyRouteCommitted();
  }, [pathname]);

  useEffect(() => {
    initSound();
    const onClick = (e: MouseEvent) => {
      if (!soundEnabled()) return;
      const el = (e.target as HTMLElement).closest("a, button, [role='button'], [role='tab'], [role='radio'], [role='switch']");
      if (el && !el.closest("[data-sound='none']")) playSound("click");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <Cursor />;
}

const INTERACTIVE = "a, button, [role='button'], [role='tab'], [role='radio'], [role='switch'], [role='option'], summary, label[for], select";

function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;
    let shown = false;

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const setState = (target: Element | null) => {
      const r = ring.current;
      if (!r) return;
      const text = target?.closest("input, textarea, [contenteditable='true']");
      const hot = target?.closest(INTERACTIVE);
      let hint = target?.closest<HTMLElement>("[data-cursor]") ?? null;
      // A link or button inside a hinted area (e.g. the draggable hero) wins over the area's hint.
      if (hint && hot && hint !== hot && hint.contains(hot)) hint = null;
      r.dataset.state = text ? "text" : hint ? "label" : hot ? "hover" : "idle";
      if (label.current) label.current.textContent = hint?.dataset.cursor === "click" ? "Click" : hint?.dataset.cursor === "drag" ? "Drag" : hint?.dataset.cursor ?? "";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        root.dataset.cursorShown = "1";
      }
      setState(e.target as Element);
    };
    const onDown = () => ring.current?.setAttribute("data-pressed", "1");
    const onUp = () => ring.current?.removeAttribute("data-pressed");
    const onLeave = () => {
      shown = false;
      delete root.dataset.cursorShown;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      delete root.dataset.cursorShown;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ring} className="cursor-ring" data-state="idle">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
