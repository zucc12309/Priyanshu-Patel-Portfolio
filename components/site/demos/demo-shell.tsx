import type { ReactNode } from "react";

/** Dark "device" frame shared by the interactive project demos. */
export function DemoShell({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[460px] flex-col overflow-hidden rounded-[inherit] bg-obsidian text-paper">
      <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-5 py-3">
        <p className="flex items-center gap-2 font-mono text-[11px] text-paper/70">
          <span className="live-dot" aria-hidden /> {title}
        </p>
        <p className="hidden font-mono text-[10px] uppercase tracking-wider text-paper/45 sm:block">interactive</p>
      </div>
      <div className="flex-1 p-5 sm:p-6">{children}</div>
      <p className="border-t border-paper/10 px-5 py-2.5 text-[11px] leading-4 text-paper/50">{note}</p>
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: readonly T[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-paper/10 p-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`h-8 rounded-full px-3.5 font-mono text-[11px] capitalize transition-colors ${value === o ? "bg-paper text-ink" : "text-paper/70 hover:text-paper"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
