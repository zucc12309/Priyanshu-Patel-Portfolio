import Image from "next/image";
import type { Project } from "@/lib/projects";

/** Real screenshot when one exists, otherwise a designed trace of the product loop. */
export function ProjectMedia({ project, sizes, priority = false }: { project: Project; sizes: string; priority?: boolean }) {
  if (project.image) {
    return (
      <div className="relative aspect-[16/11] overflow-hidden rounded-[inherit] bg-ink">
        <Image src={project.image} alt={`${project.title} — product screenshot`} fill sizes={sizes} priority={priority} className="object-cover object-left-top" />
      </div>
    );
  }
  return (
    <div className="relative flex aspect-[16/11] flex-col justify-between overflow-hidden rounded-[inherit] bg-obsidian p-6 font-mono text-[13px] text-paper/85 sm:p-8">
      <div className="flex items-center justify-between text-[11px] text-paper/50">
        <span>~/{project.slug}</span>
        <span>{project.status}</span>
      </div>
      <ol className="space-y-2">
        {project.flows.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span className="text-signal">{String(i + 1).padStart(2, "0")}</span>
            <span className="h-px w-6 bg-paper/25" aria-hidden />
            {step}
          </li>
        ))}
      </ol>
      <p className="text-[11px] text-paper/50">{project.stack.slice(0, 4).join(" · ")}</p>
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-signal/25 blur-3xl" />
    </div>
  );
}
