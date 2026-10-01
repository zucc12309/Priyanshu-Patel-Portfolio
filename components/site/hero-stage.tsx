"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { impact, profile } from "@/lib/data";
import { useBlockField } from "@/components/three/use-block-field";
import { LocalTime } from "@/components/site/local-time";
import { SplitWords } from "@/components/site/split-words";

/**
 * Hero + Impact share one sticky WebGL stage. Scrolling from the hero into the
 * impact panel rebuilds the "PP" model into four bars, one per metric; HTML
 * labels are pinned to the projected bar tops every frame.
 */
export function HeroStage() {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { fieldRef, ready } = useBlockField(canvasRef, wrapRef, {
    theme: "plaster",
    shape: "monogram",
    onFrame: (anchors) => {
      anchors.forEach((a, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        el.style.transform = `translate3d(${a.x}px, ${a.y}px, 0) translate(-50%, -100%)`;
        el.style.opacity = String(a.visible);
      });
    },
  });

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current;
      const field = fieldRef.current;
      if (!wrap || !field) return;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      field.setProgress(total > 0 ? -rect.top / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fieldRef, ready]);

  return (
    <section ref={wrapRef} aria-label="Introduction and impact" className="relative">
      {/* Sticky 3D stage */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />
        {/* Paper fades keep the copy legible over the model */}
        <div className="absolute inset-y-0 left-0 hidden w-[46%] bg-gradient-to-r from-paper via-paper/80 to-transparent md:block" />
        <div className="absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-paper via-paper/85 to-transparent md:hidden" />
        {impact.map((m, i) => (
          <div
            key={m.label}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 hidden opacity-0 will-change-transform md:block"
          >
            <div className="flex flex-col items-center">
              <span className="whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] text-paper">
                {String(i + 1).padStart(2, "0")} · {m.value}
              </span>
              <span className="h-5 w-px bg-ink/60" />
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Screen 1 — hero */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-5 pb-8 pt-[calc(96px+var(--safe-top))] sm:px-8 md:pt-32 lg:px-12">
        <p className="label fade-up text-mute" style={{ animationDelay: "100ms" }}>
          Portfolio · Bengaluru · {new Date().getFullYear()}
        </p>
        <h1 className="mt-6 font-serif text-[clamp(64px,13vw,184px)] leading-[0.86] tracking-[-0.035em]">
          <SplitWords text={profile.first} delay={150} />
          <br />
          <span className="italic">
            <SplitWords text={profile.last} delay={260} />
          </span>
        </h1>
        <div className="mt-8 max-w-[34rem] md:mt-10">
          <p className="fade-up font-mono text-[12px] uppercase tracking-[0.14em]" style={{ animationDelay: "450ms" }}>
            Business Analyst <span className="text-signal">→</span> Product & AI
          </p>
          <p className="fade-up mt-4 text-[17px] leading-[1.6] text-ink-2 sm:text-lg" style={{ animationDelay: "550ms" }}>
            {profile.intro}
          </p>
          <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "650ms" }}>
            <a href="#work" className="btn btn-ink">
              See selected work <ArrowDown className="size-4" aria-hidden />
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-ghost bg-paper/80 backdrop-blur-sm">
              Résumé <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>

        <dl className="fade-up mt-auto grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border-t hairline bg-paper/85 p-4 text-[13px] backdrop-blur-sm sm:grid-cols-4 md:rounded-none md:bg-transparent md:p-0 md:pt-5 md:backdrop-blur-0" style={{ animationDelay: "800ms" }}>
          <div>
            <dt className="label text-mute">Now</dt>
            <dd className="mt-1">{profile.company}</dd>
          </div>
          <div>
            <dt className="label text-mute">Local time</dt>
            <dd className="mt-1 tabular-nums">
              <LocalTime />
            </dd>
          </div>
          <div>
            <dt className="label text-mute">Status</dt>
            <dd className="mt-1 flex items-center gap-2">
              <span className="live-dot" aria-hidden /> Open to Product / AI roles
            </dd>
          </div>
          <div className="hidden sm:block">
            <dt className="label text-mute">Scroll</dt>
            <dd className="mt-1 text-mute">The model rebuilds into impact ↓</dd>
          </div>
        </dl>
      </div>

      {/* Screen 2 — impact */}
      <div id="impact" className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-12 sm:px-8 md:justify-center lg:px-12">
        <div className="max-w-[30rem] rounded-2xl bg-paper/90 p-5 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-0">
          <p className="label text-mute">(01) Impact</p>
          <h2 className="mt-3 font-serif text-[clamp(40px,5.5vw,72px)] leading-[0.95] tracking-[-0.02em]">
            Numbers from <span className="italic">the day job.</span>
          </h2>
          <ol className="mt-8 divide-y hairline border-y hairline">
            {impact.map((m, i) => (
              <li key={m.label} className="grid grid-cols-[2.5rem_1fr] gap-x-3 py-4">
                <span className="font-mono text-[11px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className={`font-serif text-4xl tracking-tight ${i === 0 ? "text-signal" : ""}`}>{m.value}</span>
                    <span className="text-[15px] font-medium">{m.label}</span>
                  </p>
                  <p className="mt-1 text-[14px] leading-6 text-mute">{m.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
