import { certifications, recognition, skills, tools } from "@/lib/data";
import { SectionHead } from "@/components/site/section-head";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHead n="04" label="Skills" aside="Analysis rigour from the day job, build skills from shipping my own products.">
          The <span className="italic">toolkit.</span>
        </SectionHead>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s, i) => (
            <div key={s.group} className="bg-paper p-6 md:p-8" data-reveal>
              <p className="font-mono text-[11px] text-mute">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 font-serif text-3xl tracking-tight">{s.group}</h3>
              <ul className="mt-5 space-y-2 text-[15px]">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 overflow-hidden border-y hairline py-6" aria-label="Tools I use">
        <ul className="marquee font-serif text-[clamp(36px,5vw,64px)] italic leading-none motion-reduce:flex-wrap">
          {[...tools, ...tools].map((t, i) => (
            <li key={`${t}-${i}`} aria-hidden={i >= tools.length} className="flex items-center gap-10 pr-10">
              {t}
              <span className="text-signal not-italic">✳</span>
            </li>
          ))}
        </ul>
      </div>

      <div id="recognition" className="mx-auto mt-24 grid max-w-[1440px] gap-12 px-5 sm:px-8 md:grid-cols-2 lg:px-12">
        <div data-reveal>
          <p className="label text-mute">(06) Recognition</p>
          <ul className="mt-6 space-y-8">
            {recognition.map((r) => (
              <li key={r.title}>
                <p className="font-serif text-5xl tracking-tight">{r.title}</p>
                <p className="mt-2 text-[15px]">{r.org}</p>
                {r.note ? <p className="mt-1 text-[14px] text-mute">{r.note}</p> : null}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <p className="label text-mute">Education & certifications</p>
          <ul className="mt-6 divide-y hairline border-y hairline">
            <li className="py-4">
              <p className="text-[17px]">MBA / PGDM — Finance</p>
              <p className="text-[14px] text-mute">MPSTME, Mumbai · 2025 · 3.56 / 4.00</p>
            </li>
            <li className="py-4">
              <p className="text-[17px]">B.Tech — Computer Science & Engineering</p>
              <p className="text-[14px] text-mute">MPSTME, Mumbai · 2025 · 3.56 / 4.00</p>
            </li>
            {certifications.map((c) => (
              <li key={c} className="py-3 text-[15px]">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
