import type { Metadata } from "next";
import Link from "next/link";
import { TransitionLink } from "@/components/site/transition-link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, Github, Lock, Play } from "lucide-react";
import { ProjectMedia } from "@/components/site/project-media";
import { TiltCard } from "@/components/site/tilt-card";
import { RevealObserver } from "@/components/site/reveal-observer";
import { getProject, projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: { title: `${project.title} | Priyanshu Patel`, description: project.tagline, images: [project.image ?? "/projects/memory-router.png"] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="grain min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 bg-paper/80 pt-[var(--safe-top)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <TransitionLink href="/#projects" className="flex items-center gap-2 text-[14px]">
            <ArrowLeft className="size-4" aria-hidden /> <span className="link-draw">All projects</span>
          </TransitionLink>
          <Link href="/" className="font-serif text-[22px] leading-none tracking-tight">
            Priyanshu <span className="italic">Patel</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 sm:px-8 md:pt-40 lg:px-12">
        <p className="label fade-up text-mute">
          Project {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {project.type} · {project.categories.join(" · ")}
        </p>
        <h1 className="fade-up mt-5 font-serif text-[clamp(56px,10vw,152px)] leading-[0.88] tracking-[-0.035em]" style={{ animationDelay: "80ms", viewTransitionName: "vt-title" }}>
          {project.title}
          {project.subtitle ? <span className="block text-[0.32em] italic leading-tight text-mute">{project.subtitle}</span> : null}
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <p className="fade-up text-xl leading-relaxed lg:col-span-7" style={{ animationDelay: "160ms" }}>
            {project.tagline}
          </p>
          <div className="fade-up flex flex-wrap content-start gap-3 lg:col-span-5 lg:justify-end" style={{ animationDelay: "220ms" }}>
            {project.live ? (
              <Link href={project.live.href} className="btn btn-ink">
                <Play className="size-4" aria-hidden /> {project.live.label}
              </Link>
            ) : null}
            {project.repo ? (
              <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <Github className="size-4" aria-hidden /> Code <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ) : (
              <span className="btn btn-ghost cursor-default text-mute">
                <Lock className="size-4" aria-hidden /> Private repo
              </span>
            )}
            {project.caseStudy ? (
              <a href={project.caseStudy} className="btn btn-ghost">
                <FileText className="size-4" aria-hidden /> Case study
              </a>
            ) : null}
          </div>
        </div>

        <div className="fade-up mt-14 rounded-[24px]" style={{ animationDelay: "280ms", viewTransitionName: "vt-media" }}>
          <TiltCard className="rounded-[24px] shadow-[0_50px_100px_-40px_rgba(18,18,17,0.5)]">
            <ProjectMedia project={project} sizes="(max-width: 1440px) 100vw, 1340px" priority />
          </TiltCard>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-y hairline py-10 md:grid-cols-4">
          {project.metrics.map((m) => (
            <div key={m.label} data-reveal>
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span className="block font-serif text-5xl tracking-tight md:text-6xl">{m.value}</span>
                <span className="mt-2 block text-[14px] text-mute">{m.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28" data-reveal>
              <p className="label text-mute">My role</p>
              <p className="mt-3 text-[17px] leading-7">{project.role}</p>
              <p className="label mt-8 text-mute">Stack</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s} className="rounded-full bg-paper-2 px-3 py-1 font-mono text-[12px]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="space-y-16 lg:col-span-8">
            <Block n="01" title="The problem">
              <p className="font-serif text-3xl leading-snug md:text-4xl">{project.problem}</p>
            </Block>
            <Block n="02" title="The approach">
              <p className="text-lg leading-8 text-ink-2">{project.solution}</p>
            </Block>
            <Block n="03" title="What I built">
              <List items={project.built} />
            </Block>
            <Block n="04" title="Key product decisions">
              <List items={project.decisions} />
            </Block>
            <Block n="05" title="Architecture">
              <ol className="grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--line)] sm:grid-cols-2">
                {project.architecture.map((node, i) => (
                  <li key={node} className="flex items-center gap-4 bg-paper p-5">
                    <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[15px]">{node}</span>
                  </li>
                ))}
              </ol>
            </Block>
            <Block n="06" title="User flow">
              <ol className="flex flex-wrap items-center gap-2 text-[14px]">
                {project.flows.map((f, i) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="rounded-full border hairline px-3 py-1.5">{f}</span>
                    {i < project.flows.length - 1 ? <ArrowRight className="size-3.5 text-mute" aria-hidden /> : null}
                  </li>
                ))}
              </ol>
            </Block>
            {project.learnings ? (
              <Block n="07" title="What I learned">
                <List items={project.learnings} />
              </Block>
            ) : null}
          </div>
        </div>

        <TransitionLink href={`/projects/${next.slug}`} className="group mt-28 block border-t border-ink pt-8">
          <p className="label text-mute">Next project</p>
          <p className="mt-3 flex items-center justify-between gap-6 font-serif text-[clamp(44px,8vw,120px)] leading-none tracking-[-0.03em]">
            <span className="transition-transform duration-500 ease-out group-hover:translate-x-3">{next.title}</span>
            <ArrowRight className="size-10 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-2 md:size-16" aria-hidden />
          </p>
        </TransitionLink>
      </main>
      <RevealObserver />
    </div>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section data-reveal>
      <h2 className="label flex items-center gap-3 text-mute">
        <span className="text-signal">{n}</span> {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="divide-y hairline border-y hairline">
      {items.map((item) => (
        <li key={item} className="flex gap-4 py-4 text-[17px] leading-7">
          <span className="mt-3 size-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}
