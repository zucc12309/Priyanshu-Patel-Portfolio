"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import type { BlockField, FieldOptions } from "@/components/three/block-field";

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Mounts a BlockField on `canvasRef` once the page is idle, renders only while
 * `watchRef` is on screen and the tab is visible, and forwards pointer input.
 */
export function useBlockField(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  watchRef: RefObject<HTMLElement | null>,
  options: Omit<FieldOptions, "compact" | "reducedMotion">,
) {
  const fieldRef = useRef<BlockField | null>(null);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const optsRef = useRef(options);

  useEffect(() => {
    optsRef.current = options;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const watch = watchRef.current;
    if (!canvas || !watch) return;
    if (!webglAvailable()) {
      setSupported(false);
      return;
    }

    let disposed = false;
    let visible = false;
    let field: BlockField | null = null;
    const cleanups: (() => void)[] = [];

    const sync = () => {
      if (!field) return;
      if (visible && document.visibilityState === "visible") field.start();
      else field.stop();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(watch);
    cleanups.push(() => io.disconnect());

    const boot = async () => {
      const { BlockField } = await import("@/components/three/block-field");
      if (disposed) return;
      try {
      field = new BlockField(canvas, {
        ...optsRef.current,
        onFrame: (anchors) => optsRef.current.onFrame?.(anchors),
        compact: window.matchMedia("(max-width: 767px)").matches,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
      } catch {
        setSupported(false);
        return;
      }
      fieldRef.current = field;
      setReady(true);
      sync();

      const ro = new ResizeObserver(() => field?.resize());
      ro.observe(canvas.parentElement ?? canvas);
      const onVis = () => sync();
      const onMove = (e: PointerEvent) => field?.setPointer(e.clientX, e.clientY);
      const onLeave = () => field?.clearPointer();
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      });
    };

    // Let the text paint first; the model builds itself in right after.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (idle) idle(() => void boot(), { timeout: 600 });
    else window.setTimeout(() => void boot(), 120);

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      field?.dispose();
      fieldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { fieldRef, ready, supported };
}
