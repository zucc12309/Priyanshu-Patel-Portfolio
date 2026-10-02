import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, Github, Lock, Play } from "lucide-react";
import { ProjectVisual } from "@/components/site/project-visual";
import { RevealObserver } from "@/components/site/reveal-observer";
import { TransitionLink } from "@/components/site/transition-link";
import { MemoryRouterDemo } from "@/components/site/demos/memory-router-demo";
import { RideCompareDemo } from "@/components/site/demos/ridecompare-demo";
import { LifePilotDemo } from "@/components/site/demos/lifepilot-demo";
import { CrmWorkflow } from "@/components/site/demos/crm-workflow";
import { profile } from "@/lib/data";
import { getProject, projects, type Project } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const image = project.screens?.[0]?.src ?? "/projects/memory-router.png";
  return {
    title: project.title,
    description: project.tagline,
    openGraph: { title: `${project.title} | Priyanshu Patel`, description: project.tagline, images: [image] },
  };
}

const demoCopy: Record<NonNullable<Project["demo"]>, { title: string; intro: string }> = {
  "memory-router": {
    title: "Follow a prompt through the router",
    intro: "Pick a sample prompt and run it through retrieval, memory selection, context assembly and routing. Each stage shows what Memory Router decided and why.",
  },
  ridecompare: {
    title: "Rank rides by what matters to you",
    intro: "Move the priority between price and waiting time and watch the ranking change. The phone screen is the real app; the ranking uses sample fares.",
  },
  lifepilot: {
    title: "Watch the agent ask before it spends",
    intro: "The agent proposes an order, checks it against your spending limit and only then asks for approval. Approve or reject — both stay in this sandbox.",
  },
  "crm-workflow": {
    title: "How the workflow runs",
    intro: "From a CRM export in an inbox to a briefing in stakeholders' email — the trigger, transformations, integrations and outcomes, mapped to the nodes in the workflow image at the top of this page.",
  },
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const gallery = (project.screens ?? []).filter((s) => s.kind === "phone").slice(3);
  // Number sections in order, skipping ones a project doesn't have.
  let count = 4;
  const num = (present: unknown) => (present ? String(++count).padStart(2, "0") : "");
  const n = {
    demo: num(project.demo),
    architecture: num(true),
    gallery: num(gallery.length),
    next: num(project.roadmap),
    learned: num(project.learnings),
  };

  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 bg-paper/85 pt-[var(--safe-top)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <TransitionLink href="/#projects" className="flex items-center gap-2 text-[14px]">
            <ArrowLeft className="size-4" aria-hidden /> <span className="link-draw">All projects</span>
          </TransitionLink>
          <Link href="/" className="font-serif text-[22px] leading-none tracking-tight">
            Priyanshu <span className="italic">Patel</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 sm:px-8 md:pt-36 lg:px-12">
        {/* Title */}
        <p className="label fade-up text-mute">
          Project {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {project.type} · {project.status}
        </p>
        <h1 className="fade-up mt-4 font-serif text-[clamp(52px,9vw,136px)] leading-[0.9] tracking-[-0.035em]" style={{ animationDelay: "60ms", viewTransitionName: "vt-title" }}>
          {project.title}
          {project.subtitle ? <span className="block text-[0.3em] italic leading-tight text-mute">{project.subtitle}</span> : null}
        </h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <p className="fade-up text-xl leading-relaxed lg:col-span-7" style={{ animationDelay: "120ms" }}>
            {project.tagline}
          </p>
          <div className="fade-up flex flex-wrap content-start gap-3 lg:col-span-5 lg:justify-end" style={{ animationDelay: "160ms" }}>
            {project.demo ? (
              <a href="#demo" className="btn btn-ink">
                <Play className="size-4" aria-hidden /> {project.demo === "crm-workflow" ? "See the workflow" : "Try the demo"}
              </a>
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
          </div>
        </div>

        {/* Real visual */}
        <div className="fade-up mt-12 rounded-[24px]" style={{ animationDelay: "200ms", viewTransitionName: "vt-media" }}>
          <ProjectVisual project={project} sizes="(max-width: 1440px) 100vw, 1340px" priority />
        </div>

        {project.facts.length ? (
          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-y hairline py-8">
            {project.facts.map((f) => (
              <div key={f.label} className="max-w-[14rem]" data-reveal>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-serif text-5xl tracking-tight">{f.value}</span>
                  <span className="mt-1 block text-[14px] leading-5 text-mute">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* Story */}
        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-28" data-reveal>
              <div>
                <h2 className="label text-mute">My role</h2>
                <p className="mt-3 text-[16px] leading-7">{project.role}</p>
              </div>
              <div>
                <h2 className="label text-mute">Stack</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li key={s} className="rounded-full bg-paper-2 px-3 py-1 font-mono text-[12px]">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              {project.caseStudy ? (
                <a href={project.caseStudy} className="flex items-center gap-2 text-[14px]">
                  <FileText className="size-4" aria-hidden /> <span className="link-draw">Long-form case study</span>
                </a>
              ) : null}
            </div>
          </aside>

          <div className="space-y-14 lg:col-span-8">
            <Block n="01" title="The problem">
              <p className="font-serif text-3xl leading-snug md:text-4xl">{project.problem}</p>
            </Block>
            <Block n="02" title="My approach">
              <p className="text-lg leading-8 text-ink-2">{project.solution}</p>
            </Block>
            <Block n="03" title="Implemented" note="What exists in the product today.">
              <List items={project.built} />
            </Block>
            <Block n="04" title="Product decisions">
              <List items={project.decisions} />
            </Block>
          </div>
        </div>

        {/* Demo / workflow */}
        {project.demo ? (
          <section id="demo" className="mt-20 scroll-mt-24" aria-labelledby="demo-title">
            <div className="max-w-3xl" data-reveal>
              <p className="label text-mute">
                <span className="text-signal">{n.demo}</span> {project.demo === "crm-workflow" ? "Workflow" : "Sandbox demo"}
              </p>
              <h2 id="demo-title" className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">
                {demoCopy[project.demo].title}
              </h2>
              <p className="mt-3 text-[16px] leading-7 text-ink-2">{demoCopy[project.demo].intro}</p>
            </div>
            <div className="mt-8">
              {project.demo === "memory-router" ? <MemoryRouterDemo /> : null}
              {project.demo === "ridecompare" ? <RideCompareDemo /> : null}
              {project.demo === "lifepilot" ? <LifePilotDemo /> : null}
              {project.demo === "crm-workflow" ? <CrmWorkflow /> : null}
            </div>
          </section>
        ) : null}

        <div className="mt-20 grid gap-14 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-8 lg:col-start-5">
            <Block n={n.architecture} title="Architecture">
              <ol className="grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--line)] sm:grid-cols-2">
                {project.architecture.map((node, i) => (
                  <li key={node} className="flex items-center gap-4 bg-paper p-5">
                    <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[15px]">{node}</span>
                  </li>
                ))}
              </ol>
            </Block>

            {gallery.length ? (
              <Block n={n.gallery} title="More screens" note={project.screenNote}>
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {gallery.map((s) => (
                    <li key={s.src}>
                      <figure className="m-0">
                        <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 640px) 50vw, 260px" className="h-auto w-full" />
                        <figcaption className="mt-1 text-center text-[12px] text-mute">{s.caption}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </Block>
            ) : null}

            {project.roadmap ? (
              <Block n={n.next} title="Next — not built yet" note="Plans, not shipped features.">
                <List items={project.roadmap} muted />
              </Block>
            ) : null}

            {project.learnings ? (
              <Block n={n.learned} title="What I learned">
                <List items={project.learnings} />
              </Block>
            ) : null}
          </div>
        </div>

        <div className="mt-24 grid gap-6 border-t border-ink pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <TransitionLink href={`/projects/${next.slug}`} className="group block">
            <p className="label text-mute">Next project</p>
            <p className="mt-3 flex items-center gap-6 font-serif text-[clamp(40px,7vw,104px)] leading-none tracking-[-0.03em]">
              <span className="transition-transform duration-500 ease-out group-hover:translate-x-3">{next.title}</span>
              <ArrowRight className="size-9 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-2 md:size-14" aria-hidden />
            </p>
          </TransitionLink>
          <p className="flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
            <a href={profile.resume} target="_blank" rel="noreferrer" className="link-draw">
              Résumé (PDF)
            </a>
            <a href={`mailto:${profile.email}`} className="link-draw">
              {profile.email}
            </a>
          </p>
        </div>
      </main>
      <RevealObserver />
    </div>
  );
}

function Block({ n, title, note, children }: { n: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section data-reveal>
      <h2 className="label flex flex-wrap items-baseline gap-x-3 text-mute">
        <span className="text-signal">{n}</span> {title}
        {note ? <span className="normal-case tracking-normal text-mute/80">— {note}</span> : null}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function List({ items, muted = false }: { items: string[]; muted?: boolean }) {
  return (
    <ul className="divide-y hairline border-y hairline">
      {items.map((item) => (
        <li key={item} className={`flex gap-4 py-4 text-[17px] leading-7 ${muted ? "text-ink-2" : ""}`}>
          <span className={`mt-3 size-1.5 shrink-0 rounded-full ${muted ? "border border-ink/50" : "bg-signal"}`} aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}
