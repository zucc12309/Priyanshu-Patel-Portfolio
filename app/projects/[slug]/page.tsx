import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, Download, ExternalLink, FolderOpen, Github, Lock, Play, Sparkles } from "lucide-react";
import { ArchitectureDiagram, ScreenshotGallery, WorkflowVisualization } from "@/components/project-simulators";
import { Reveal } from "@/components/reveal";
import { getProject, projects } from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

type WindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Priyanshu Patel`,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const projectIndex = projects.findIndex((item) => item.slug === project.slug) + 1;

  return (
    <main className="retro-scanlines min-h-screen px-3 py-3 pb-20 font-mono text-[13px] text-retro-text sm:px-5 sm:py-5">
      <div className="mx-auto grid max-w-[1600px] gap-5">
        <Link href="/#projects" className="retro-button inline-flex h-10 w-fit items-center gap-2 px-4 text-xs uppercase">
          <ArrowLeft className="size-4" /> Back to projects
        </Link>

        <RetroWindow title="project.exe">
          <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
            <aside className="border-b border-retro-text/10 p-4 lg:border-b-0 lg:border-r">
              <Prompt command="project_detail" />
              <div className="mt-8 space-y-2 uppercase">
                {["Overview", "Features", "Tech Stack", "Demo", "Gallery", "Source Code"].map((item, index) => (
                  <a
                    key={item}
                    href={index === 0 ? "#overview" : index === 4 ? "#gallery" : "#details"}
                    className={`flex h-10 items-center gap-3 border px-3 text-xs transition ${
                      index === 0 ? "border-retro-green/40 bg-retro-green/8 text-retro-green" : "border-transparent text-retro-text/50 hover:border-retro-green/20 hover:text-retro-text"
                    }`}
                  >
                    {index === 0 ? <FolderOpen className="size-3.5 text-retro-green" /> : <Code2 className="size-3.5 text-accent-purple/60" />}
                    {item}
                  </a>
                ))}
              </div>
            </aside>

            <section id="overview" className="grid gap-8 p-5 md:p-8 xl:grid-cols-[1fr_.95fr]">
              <Reveal>
                <div className="flex items-center justify-between gap-3 text-retro-text/40">
                  <Prompt command={project.slug} />
                  <span className="text-xs">{String(projectIndex).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
                </div>
                <h1 className="pixel-heading mt-8 text-4xl font-black leading-tight md:text-5xl">{project.title}</h1>
                <p className="mt-3 text-sm uppercase tracking-[0.14em] text-retro-amber">
                  {project.type} · {project.status}
                </p>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-retro-text/65">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.repo ? (
                    <Link href={project.repo} className="retro-button inline-flex h-10 items-center gap-2 px-4 text-xs uppercase">
                      <Github className="size-4" /> View Code
                    </Link>
                  ) : (
                    <span className="retro-button inline-flex h-10 items-center gap-2 px-4 text-xs uppercase text-retro-text/40">
                      <Lock className="size-4" /> Private Repository
                    </span>
                  )}
                  {project.live ? (
                    <Link href={project.live} className="retro-button inline-flex h-10 items-center gap-2 border-retro-green/40 bg-retro-green/8 px-4 text-xs uppercase text-retro-green">
                      <ExternalLink className="size-4" /> Live Demo
                    </Link>
                  ) : null}
                  {project.slug === "memory-router" ? (
                    <Link href="/projects/memory-router/playground" className="retro-button inline-flex h-10 items-center gap-2 border-retro-green/40 bg-retro-green/8 px-4 text-xs uppercase text-retro-green">
                      <Play className="size-4" /> Try Playground
                    </Link>
                  ) : null}
                  <Link href={project.caseStudy} className="retro-button inline-flex h-10 items-center gap-2 px-4 text-xs uppercase">
                    <Download className="size-4" /> Case Study
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="retro-panel p-4">
                  <div className="relative aspect-[16/10] overflow-hidden border border-retro-text/10 bg-black">
                    <Image src={project.image} alt={`${project.title} cover`} fill sizes="(max-width: 1280px) 100vw, 640px" className="object-cover opacity-85" priority />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    {project.stack.slice(0, 6).map((tech) => (
                      <span key={tech} className="border border-retro-text/10 bg-black/40 px-2 py-1.5 text-[11px] text-retro-text/55">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </section>
          </div>
        </RetroWindow>

        <RetroWindow title="case-study.exe">
          <GridSection items={[
            ["Problem", project.sections.problem],
            ["Solution", project.sections.solution],
            ["Business Impact", project.impact.join(" ")],
            ["Learnings", project.learnings.join(" ")],
          ]} />
        </RetroWindow>

        <RetroWindow title="architecture.exe">
          <div className="p-5">
            <Prompt command="architecture_overview" />
            <div className="mt-5">
              <ArchitectureDiagram project={project} />
            </div>
          </div>
        </RetroWindow>

        <RetroWindow title="gallery.exe">
          <div id="gallery" className="p-5">
            <Prompt command="screenshots_and_system_view" />
            <div className="mt-5">
              <ScreenshotGallery project={project} />
            </div>
          </div>
        </RetroWindow>

        <RetroWindow title="flow.exe">
          <div className="p-5">
            <Prompt command="user_flow" />
            <div className="mt-5">
              <WorkflowVisualization flows={project.flows} accent={project.accent} />
            </div>
          </div>
        </RetroWindow>

        <section id="details" className="grid gap-5 lg:grid-cols-3">
          <RetroWindow title="features.exe">
            <ListCard title="Key Features" items={project.features} />
          </RetroWindow>
          <RetroWindow title="decisions.exe">
            <ListCard title="Technical Decisions" items={project.sections.decisions} />
          </RetroWindow>
          <RetroWindow title="roadmap.exe">
            <ListCard title="Future Roadmap" items={project.sections.roadmap} />
          </RetroWindow>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <RetroWindow title="stack.exe">
            <ListCard title="Tech Stack" items={project.stack} />
          </RetroWindow>
          <RetroWindow title="challenges.exe">
            <ListCard title="Challenges" items={project.challenges} />
          </RetroWindow>
          <RetroWindow title="learning.exe">
            <ListCard title="What I Learned" items={project.learnings} />
          </RetroWindow>
        </section>

        <Link href="/#projects" className="retro-button inline-flex h-10 w-fit items-center gap-2 px-4 text-xs uppercase">
          More projects <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}

function RetroWindow({ title, children, className }: WindowProps) {
  return (
    <section className={`retro-window overflow-hidden ${className ?? ""}`}>
      <div className="retro-titlebar flex h-8 items-center justify-between px-3 text-xs">
        <span>{title}</span>
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-red-400/70" />
          <span className="size-3 rounded-full bg-retro-amber/70" />
          <span className="size-3 rounded-full bg-retro-green/70" />
        </div>
      </div>
      {children}
    </section>
  );
}

function Prompt({ command }: { command: string }) {
  return (
    <p className="retro-terminal text-sm">
      <span className="text-retro-text/40">$</span> {command}
    </p>
  );
}

function GridSection({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-5 p-5 md:grid-cols-2">
      {items.map(([label, value]) => (
        <Reveal key={label} className="retro-panel p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-retro-green">{label}</p>
          <p className="mt-3 text-sm leading-7 text-retro-text/60">{value}</p>
        </Reveal>
      ))}
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal className="p-5">
      <h3 className="text-lg font-bold text-accent-purple">{title}</h3>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-xs leading-5 text-retro-text/55">
            <Sparkles className="mt-0.5 size-3 shrink-0 text-retro-green" />
            {item}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
