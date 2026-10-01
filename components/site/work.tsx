import { Award } from "lucide-react";
import { timeline, work } from "@/lib/data";
import { SectionHead } from "@/components/site/section-head";

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 py-24 sm:px-8 md:py-36 lg:px-12">
      <SectionHead n="02" label="Work" aside={work.context}>
        Where the <span className="italic">rules</span> meet the <span className="italic">rollout.</span>
      </SectionHead>

      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div data-reveal>
          <p className="label text-mute">{work.period}</p>
          <h3 className="mt-3 font-serif text-5xl leading-none tracking-tight md:text-6xl">{work.company}</h3>
          <p className="mt-3 text-lg">{work.title}</p>
          <p className="mt-1 text-[15px] text-mute">{work.location} · Group Life products</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] text-paper">
            <Award className="size-4 text-signal" aria-hidden /> Tech Titan Award
          </p>
          <p className="mt-8 max-w-md font-serif text-2xl leading-snug">{work.headline}</p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Capabilities">
            {work.capabilities.map((c) => (
              <li key={c} className="rounded-full border hairline px-3 py-1 text-[13px]">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--line)] sm:grid-cols-2">
          <div className="bg-paper p-6 md:p-8" data-reveal>
            <p className="label text-mute">Approach</p>
            <ol className="mt-5 space-y-4">
              {work.approach.map((a, i) => (
                <li key={a} className="grid grid-cols-[1.75rem_1fr] text-[15px] leading-6">
                  <span className="font-mono text-[11px] leading-6 text-mute">{String(i + 1).padStart(2, "0")}</span>
                  {a}
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-ink p-6 text-paper md:p-8" data-reveal>
            <p className="label text-paper/60">Outcomes</p>
            <ul className="mt-5 space-y-4">
              {work.outcomes.map((o) => (
                <li key={o} className="grid grid-cols-[1.75rem_1fr] text-[15px] leading-6">
                  <span className="text-signal" aria-hidden>
                    ↗
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-20" data-reveal>
        <p className="label text-mute">Timeline</p>
        <ol className="mt-4 border-t hairline">
          {timeline.map((t) => (
            <li key={t.title} className="grid gap-1 border-b hairline py-5 sm:grid-cols-[8rem_1fr_1fr] sm:gap-6">
              <span className="font-mono text-[13px] text-mute">{t.year}</span>
              <span className="text-[17px]">{t.title}</span>
              <span className="text-[14px] text-mute">{t.note}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
