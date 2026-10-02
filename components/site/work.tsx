import { Award } from "lucide-react";
import { certifications, impact, recognition, timeline, work } from "@/lib/data";
import { SectionHead } from "@/components/site/section-head";

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <SectionHead n="01" label="Work" aside={work.context}>
        Where the <span className="italic">rules</span> meet the <span className="italic">rollout.</span>
      </SectionHead>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div data-reveal>
          <p className="label text-mute">{work.period}</p>
          <h3 className="mt-3 font-serif text-5xl leading-none tracking-tight md:text-6xl">{work.company}</h3>
          <p className="mt-3 text-lg">{work.title}</p>
          <p className="mt-1 text-[15px] text-mute">{work.location} · Group Life products</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] text-paper">
            <Award className="size-4 text-signal" aria-hidden /> Tech Titan Award
          </p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Areas I work on">
            {work.capabilities.map((c) => (
              <li key={c} className="rounded-full border hairline px-3 py-1 text-[13px]">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--line)] sm:grid-cols-2">
          <div className="bg-paper p-6 md:p-8" data-reveal>
            <h4 className="label text-mute">What I do</h4>
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
            <h4 className="label text-paper/60">Outcomes</h4>
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

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y hairline py-8 md:grid-cols-4" data-reveal>
        {impact.map((m, i) => (
          <div key={m.label}>
            <dt className="text-[15px] font-medium">{m.label}</dt>
            <dd className="mt-1">
              <span className={`block font-serif text-5xl tracking-tight ${i === 0 ? "text-signal" : ""}`}>{m.value}</span>
              <span className="mt-1 block text-[13px] leading-5 text-mute">{m.detail}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div data-reveal>
          <h3 className="label text-mute">Timeline</h3>
          <ol className="mt-4 border-t hairline">
            {timeline.map((t) => (
              <li key={t.title} className="grid gap-1 border-b hairline py-4 sm:grid-cols-[6rem_1fr] sm:gap-6">
                <span className="font-mono text-[13px] text-mute">{t.year}</span>
                <span>
                  <span className="block text-[16px]">{t.title}</span>
                  {t.note ? <span className="block text-[14px] text-mute">{t.note}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div data-reveal>
          <h3 className="label text-mute">Recognition & certifications</h3>
          <ul className="mt-4 space-y-3 border-t hairline pt-4">
            {recognition.map((r) => (
              <li key={r.title}>
                <span className="block font-serif text-2xl">{r.title}</span>
                <span className="block text-[14px] text-mute">{r.org}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-1.5 text-[14px] text-ink-2">
            {certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
