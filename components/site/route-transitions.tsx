"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { notifyRouteCommitted } from "@/lib/view-transition";

/**
 * Resolves the page view transition once the new route has committed.
 * (Called directly — rendering is paused during a transition update, so a
 * requestAnimationFrame here would only fire after the failsafe timeout.)
 */
export function RouteTransitions() {
  const pathname = usePathname();
  useEffect(() => {
    notifyRouteCommitted();
  }, [pathname]);
  return null;
}
