import { ArrowUpRight, Github, Lock } from "lucide-react";
import { featuredProjects, projects, type Project } from "@/lib/projects";
import { SectionHead } from "@/components/site/section-head";
import { ProjectVisual } from "@/components/site/project-visual";
import { TransitionLink } from "@/components/site/transition-link";

/** One listing: four featured chapters, then the remaining projects once. */
export function Projects() {
  const others = projects.filter((p) => !p.featured);
  return (
    <section id="projects" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <SectionHead
        n="02"
        label="Projects"
        aside="Built independently, outside my job. I own the problem, the product decisions, the architecture and the tests, and I build with AI-assisted development."
      >
        Products I&apos;ve <span className="italic">shipped</span> on my own time.
      </SectionHead>

      <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
        {featuredProjects.map((project, i) => (
          <Chapter key={project.slug} project={project} index={i} />
        ))}
      </div>

      <div className="mt-24 md:mt-32">
        <h3 className="label text-mute" data-reveal>
          More projects
        </h3>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--line)] sm:grid-cols-2">
          {others.map((project) => (
            <li key={project.slug} data-vt-card className="bg-paper">
              <TransitionLink href={`/projects/${project.slug}`} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-paper-2 md:p-8">
                <span className="flex items-baseline justify-between gap-4">
                  <span data-vt="title" className="font-serif text-3xl tracking-tight">
                    {project.title}
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
                </span>
                <span className="text-[15px] leading-6 text-ink-2">{project.tagline}</span>
                <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[13px] text-mute">
                  <span>{project.status}</span>
                  <span aria-hidden>·</span>
                  <span className="flex items-center gap-1">
                    {project.repo ? <Github className="size-3.5" aria-hidden /> : <Lock className="size-3.5" aria-hidden />}
                    {project.repo ? "Open source" : "Private repo"}
                  </span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Chapter({ project, index }: { project: Project; index: number }) {
  return (
    <article data-vt-card className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12" aria-labelledby={`f-${project.slug}`}>
      <div className="lg:col-span-5 lg:pt-4">
        <p className="label flex items-center gap-3 text-mute" data-reveal>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px flex-1 bg-[var(--line)]" />
          <span>{project.status}</span>
        </p>
        <h3 id={`f-${project.slug}`} data-vt="title" className="mt-5 font-serif text-[clamp(44px,5vw,72px)] leading-[0.92] tracking-[-0.02em]" data-reveal>
          {project.title}
        </h3>
        <p className="mt-4 text-lg leading-relaxed" data-reveal>
          {project.tagline}
        </p>
        <dl className="mt-6 space-y-4 border-t hairline pt-6 text-[15px] leading-6" data-reveal>
          <div>
            <dt className="label text-mute">Problem</dt>
            <dd className="mt-1 text-ink-2">{project.problem}</dd>
          </div>
          <div>
            <dt className="label text-mute">My role</dt>
            <dd className="mt-1 text-ink-2">{project.role}</dd>
          </div>
        </dl>
        {project.facts.length ? (
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4" data-reveal>
            {project.facts.map((f) => (
              <div key={f.label} className="max-w-[11rem]">
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-serif text-4xl tracking-tight">{f.value}</span>
                  <span className="mt-1 block text-[13px] leading-5 text-mute">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" data-reveal>
          <TransitionLink href={`/projects/${project.slug}`} className="btn btn-ink">
            Read the case study <ArrowUpRight className="size-4" aria-hidden />
          </TransitionLink>
          {project.demo ? (
            <TransitionLink href={`/projects/${project.slug}#demo`} className="link-draw text-[15px]">
              {project.demo === "crm-workflow" ? "Walk through the workflow" : "Try the sandbox demo"}
            </TransitionLink>
          ) : null}
        </div>
      </div>
      <div className="rounded-[20px] lg:col-span-7" data-vt="media" data-reveal>
        <ProjectVisual project={project} sizes="(max-width: 1024px) 100vw, 58vw" />
      </div>
    </article>
  );
}
