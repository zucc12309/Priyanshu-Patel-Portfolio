import type { ReactNode } from "react";

/** Dark "sandbox" frame shared by the case-study demos. */
export function DemoShell({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[20px] bg-obsidian text-paper">
      <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-5 py-3">
        <p className="font-mono text-[12px] text-paper/75">{title}</p>
        <p className="rounded-full border border-paper/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper/60">Sandbox · sample data</p>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
      <p className="border-t border-paper/10 px-5 py-3 text-[12px] leading-5 text-paper/55">{note}</p>
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange, label, format }: { value: T; options: readonly T[]; onChange: (v: T) => void; label: string; format?: (v: T) => string }) {
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
          {format ? format(o) : o}
        </button>
      ))}
    </div>
  );
}
