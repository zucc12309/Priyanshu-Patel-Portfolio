"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Github, Lock, Plus } from "lucide-react";
import { featuredProjects, projects, type Project } from "@/lib/projects";
import { SectionHead } from "@/components/site/section-head";
import { TiltCard } from "@/components/site/tilt-card";
import { ProjectMedia } from "@/components/site/project-media";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 py-24 sm:px-8 md:py-36 lg:px-12">
      <SectionHead
        n="03"
        label="Projects"
        aside="Built independently, outside work. I own the problem, the product decisions, the architecture and the tests — and I build with AI-assisted development."
      >
        Things I <span className="italic">shipped</span> on my own time.
      </SectionHead>

      <div className="mt-16 space-y-24 md:mt-24 md:space-y-36">
        {featuredProjects.map((project, i) => (
          <Feature key={project.slug} project={project} index={i} />
        ))}
      </div>

      <ProjectIndex />
    </section>
  );
}

function Feature({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12" aria-labelledby={`f-${project.slug}`}>
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`} data-reveal>
        <TiltCard className="rounded-[20px] shadow-[0_40px_80px_-30px_rgba(18,18,17,0.45)]">
          <ProjectMedia project={project} sizes="(max-width: 1024px) 100vw, 58vw" />
        </TiltCard>
      </div>
      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <p className="label flex items-center gap-3 text-mute" data-reveal>
          <span>{String(index + 1).padStart(2, "0")} / Featured</span>
          <span className="h-px flex-1 bg-[var(--line)]" />
          <span>{project.categories.join(" · ")}</span>
        </p>
        <h3 id={`f-${project.slug}`} className="mt-5 font-serif text-[clamp(44px,5vw,76px)] leading-[0.92] tracking-[-0.02em]" data-reveal>
          {project.title}
        </h3>
        <p className="mt-5 text-lg leading-relaxed" data-reveal>
          {project.tagline}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t hairline pt-6" data-reveal>
          {project.metrics.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span className="block font-serif text-4xl tracking-tight">{m.value}</span>
                <span className="mt-1 block text-[13px] text-mute">{m.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3" data-reveal>
          <Link href={`/projects/${project.slug}`} className="btn btn-ink">
            Read the case <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          {project.live ? (
            <Link href={project.live.href} className="btn btn-ghost">
              {project.live.label}
            </Link>
          ) : null}
          {project.repo ? (
            <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn-ghost" aria-label={`${project.title} on GitHub (opens in new tab)`}>
              <Github className="size-4" aria-hidden /> Code
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ProjectIndex() {
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<Project | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, t: 0 });

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const dx = e.clientX - last.current.x;
      last.current = { x: e.clientX, t: performance.now() };
      el.style.setProperty("--x", `${e.clientX + 24}px`);
      el.style.setProperty("--y", `${e.clientY - 120}px`);
      el.style.setProperty("--r", `${Math.max(-8, Math.min(8, dx * 0.4))}deg`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="mt-28 md:mt-40">
      <div className="flex items-end justify-between gap-4" data-reveal>
        <h3 className="font-serif text-4xl tracking-tight md:text-5xl">
          Full <span className="italic">index</span>
        </h3>
        <p className="label text-mute">{projects.length} projects · tap to expand</p>
      </div>
      <ul className="mt-6 border-t border-ink" onPointerLeave={() => setHover(null)}>
        {projects.map((project, i) => {
          const expanded = open === project.slug;
          return (
            <li key={project.slug} className="border-b hairline">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`p-${project.slug}`}
                onClick={() => setOpen(expanded ? null : project.slug)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHover(project)}
                className="group grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-x-4 py-5 text-left md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1fr)_9rem_2rem] md:py-7"
              >
                <span className="font-mono text-[12px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-[28px] leading-none tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[40px]">
                  {project.title}
                  {project.featured ? <span className="ml-2 align-top font-mono text-[11px] text-signal">★</span> : null}
                </span>
                <span className="hidden text-[14px] text-mute md:block">{project.categories.join(" · ")}</span>
                <span className="hidden items-center gap-1.5 text-[13px] text-mute md:flex">
                  {project.repo ? <Github className="size-3.5" aria-hidden /> : <Lock className="size-3.5" aria-hidden />}
                  {project.repo ? "Open source" : "Private"}
                </span>
                <span className={`grid size-8 place-items-center rounded-full border hairline transition-all duration-300 ${expanded ? "rotate-45 bg-ink text-paper" : "group-hover:bg-ink group-hover:text-paper"}`}>
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
              <div id={`p-${project.slug}`} role="region" aria-label={`${project.title} details`} className={`grid transition-[grid-template-rows] duration-500 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  {expanded ? <Details project={project} /> : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Cursor-following preview (desktop) */}
      <div ref={previewRef} aria-hidden className={`cursor-preview hidden overflow-hidden rounded-xl shadow-2xl lg:block ${hover && !open ? "opacity-100 [scale:1]" : "opacity-0 [scale:0.9]"}`}>
        {hover ? <ProjectMedia project={hover} sizes="360px" /> : null}
      </div>
    </div>
  );
}

function Details({ project }: { project: Project }) {
  return (
    <div className="fade-up grid gap-8 pb-10 pt-2 md:grid-cols-12 md:pl-[4rem]" style={{ animationDuration: "500ms" }}>
      <div className="md:col-span-5">
        <p className="text-lg leading-relaxed">{project.tagline}</p>
        <p className="label mt-6 text-mute">Problem</p>
        <p className="mt-2 text-[15px] leading-7 text-ink-2">{project.problem}</p>
        <p className="label mt-6 text-mute">My role</p>
        <p className="mt-2 text-[15px] leading-7 text-ink-2">{project.role}</p>
      </div>
      <div className="md:col-span-4">
        <p className="label text-mute">What I built</p>
        <ul className="mt-3 space-y-2.5">
          {project.built.map((b) => (
            <li key={b} className="flex gap-3 text-[15px] leading-6">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-3">
        <p className="label text-mute">Impact / scale</p>
        <dl className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-1">
          {project.metrics.slice(0, 3).map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span className="font-serif text-3xl">{m.value}</span>
                <span className="block text-[13px] text-mute">{m.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={`/projects/${project.slug}`} className="btn btn-ink h-10 px-4 text-[13px]">
            Full case <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
          {project.repo ? (
            <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn-ghost h-10 px-4 text-[13px]">
              GitHub
            </a>
          ) : null}
        </div>
      </div>
      <ul className="flex flex-wrap gap-2 md:col-span-12" aria-label="Stack">
        {project.stack.map((s) => (
          <li key={s} className="rounded-full bg-paper-2 px-3 py-1 font-mono text-[12px]">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
