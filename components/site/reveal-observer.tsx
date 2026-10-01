"use client";

import { useEffect } from "react";

/** One observer for every [data-reveal] element on the page. */
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.reveal = "in";
          io.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
