import Image from "next/image";
import type { Project } from "@/lib/projects";

/**
 * Real screenshots only, shown at their own proportions on a quiet surface.
 * Projects without public screenshots show their execution path instead.
 */
export function ProjectVisual({ project, sizes, priority = false, phones = 3 }: { project: Project; sizes: string; priority?: boolean; phones?: number }) {
  const screens = project.screens ?? [];
  const phoneScreens = screens.filter((s) => s.kind === "phone");
  const desktop = screens.find((s) => s.kind === "desktop");

  if (phoneScreens.length) {
    return (
      <figure className="m-0">
        <div className="rounded-2xl bg-paper-2 px-3 pt-6 sm:px-6">
          <div className="mx-auto grid max-w-[860px] grid-cols-3 items-end gap-2 sm:gap-4">
          {phoneScreens.slice(0, phones).map((s, i) => (
            <Image key={s.src} src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 900px) 33vw, 290px" priority={priority && i === 0} className="h-auto w-full" />
          ))}
          </div>
        </div>
        {project.screenNote ? <figcaption className="mt-2 text-[12px] text-mute">{project.screenNote}</figcaption> : null}
      </figure>
    );
  }

  if (desktop) {
    return (
      <figure className="m-0">
        <div className="overflow-hidden rounded-2xl bg-obsidian">
          <Image src={desktop.src} alt={desktop.alt} width={desktop.width} height={desktop.height} sizes={sizes} priority={priority} className="h-auto w-full" />
        </div>
        <figcaption className="mt-2 text-[12px] text-mute">{project.screenNote ?? desktop.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="m-0">
      <ExecutionPath steps={project.flows} />
      {project.screenNote ? <figcaption className="mt-2 text-[12px] text-mute">{project.screenNote}</figcaption> : null}
    </figure>
  );
}

/** A connected node path (n8n-style) for products without public screenshots. */
export function ExecutionPath({ steps }: { steps: string[] }) {
  return (
    <ol className="relative grid gap-3 rounded-2xl bg-obsidian p-6 text-paper sm:grid-cols-2 sm:p-8" aria-label="Execution path">
      {steps.map((step, i) => (
        <li key={step} className="relative flex items-center gap-3 rounded-xl border border-paper/15 bg-paper/[0.04] px-4 py-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-paper/10 font-mono text-[11px] text-signal">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-[14px]">{step}</span>
        </li>
      ))}
    </ol>
  );
}
