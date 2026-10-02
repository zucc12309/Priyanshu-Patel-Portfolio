"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { approach, profile } from "@/lib/data";
import { useBlockField } from "@/components/three/use-block-field";
import { LocalTime } from "@/components/site/local-time";
import { SplitWords } from "@/components/site/split-words";

/**
 * Hero + "How I work" share one sticky sculpture. Scrolling from the hero into
 * the approach section organises the scattered blocks into three districts —
 * Analysis, Requirements, AI products — whose labels are pinned to the model.
 * The sculpture is never needed to navigate; without WebGL a still image of the
 * organised model takes its place.
 */
export function HeroStage() {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { fieldRef, ready, supported } = useBlockField(canvasRef, wrapRef, {
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
    <section ref={wrapRef} aria-label="Introduction and how I work" className="relative">
      {/* Sticky sculpture (decorative — the copy carries every fact) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`} />
          {!supported ? (
            <div className="absolute inset-x-0 bottom-0 top-[45%] md:left-[38%] md:top-0">
              <Image src="/sculpture-organised.webp" alt="" fill sizes="(max-width: 768px) 100vw, 62vw" className="object-contain object-center" />
            </div>
          ) : null}
          <div className="absolute inset-y-0 left-0 hidden w-[46%] bg-gradient-to-r from-paper via-paper/80 to-transparent md:block" />
          <div className="absolute inset-x-0 top-0 h-[66%] bg-gradient-to-b from-paper via-paper/90 to-transparent md:hidden" />
          {approach.map((step, i) => (
            <div
              key={step.id}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 hidden opacity-0 will-change-transform md:block"
            >
              <div className="flex flex-col items-center">
                <span className="whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] text-paper">
                  {String(i + 1).padStart(2, "0")} · {step.title}
                </span>
                <span className="h-5 w-px bg-ink/60" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen 1 — who I am */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-5 pb-8 pt-[calc(96px+var(--safe-top))] sm:px-8 md:pt-32 lg:px-12">
        <p className="label fade-up text-mute" style={{ animationDelay: "60ms" }}>
          {profile.location}
        </p>
        <h1 className="mt-5 font-serif text-[clamp(60px,12vw,172px)] leading-[0.86] tracking-[-0.035em]">
          <SplitWords text={profile.first} delay={80} />
          <br />
          <span className="italic">
            <SplitWords text={profile.last} delay={160} />
          </span>
        </h1>
        <div className="mt-7 max-w-[34rem] md:mt-9">
          <p className="fade-up font-mono text-[12px] uppercase tracking-[0.14em]" style={{ animationDelay: "240ms" }}>
            Business Analyst <span className="text-signal">·</span> AI Product Builder
          </p>
          <p className="fade-up mt-4 text-[17px] leading-[1.6] text-ink-2 sm:text-lg" style={{ animationDelay: "300ms" }}>
            {profile.intro}
          </p>
          <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "360ms" }}>
            <a href="#projects" className="btn btn-ink">
              See projects <ArrowDown className="size-4" aria-hidden />
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-ghost bg-paper/80">
              Résumé (PDF) <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-ghost bg-paper/80">
              <Mail className="size-4" aria-hidden /> Email
            </a>
          </div>
        </div>

        <dl className="fade-up mt-auto grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl bg-paper/85 p-4 text-[13px] sm:grid-cols-3 md:rounded-none md:border-t md:hairline md:bg-transparent md:p-0 md:pt-5" style={{ animationDelay: "420ms" }}>
          <div>
            <dt className="label text-mute">Now</dt>
            <dd className="mt-1">
              {profile.title}, {profile.company}
            </dd>
          </div>
          <div>
            <dt className="label text-mute">Looking for</dt>
            <dd className="mt-1 flex items-center gap-2">
              <span className="live-dot" aria-hidden /> Product / AI product roles
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="label text-mute">Local time</dt>
            <dd className="mt-1 tabular-nums">
              <LocalTime />
            </dd>
          </div>
        </dl>
      </div>

      {/* Screen 2 — how I work (the sculpture organises as you arrive) */}
      <div id="approach" className="relative mx-auto flex min-h-[100svh] max-w-[1440px] scroll-mt-16 flex-col justify-end px-5 pb-12 sm:px-8 md:justify-center lg:px-12">
        <div className="max-w-[32rem] rounded-2xl bg-paper/90 p-5 md:bg-transparent md:p-0">
          <p className="label text-mute">How I work</p>
          <h2 className="mt-3 font-serif text-[clamp(38px,5vw,64px)] leading-[0.98] tracking-[-0.02em]">
            From scattered inputs to an <span className="italic">organised system.</span>
          </h2>
          <ol className="mt-8 divide-y hairline border-y hairline">
            {approach.map((step, i) => (
              <li key={step.id} className="grid grid-cols-[2.25rem_1fr] gap-x-3 py-4">
                <span className="font-mono text-[11px] leading-7 text-mute">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-serif text-[26px] leading-tight">{step.title}</h3>
                  <p className="mt-1 text-[15px] leading-6 text-ink-2">{step.text}</p>
                  <p className="mt-2 font-mono text-[11px] leading-5 text-mute">{step.capabilities.join(" · ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
