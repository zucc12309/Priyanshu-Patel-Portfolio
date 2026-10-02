import type { ReactNode } from "react";

export function SectionHead({ n, label, children, aside }: { n: string; label: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <header className="grid gap-6 border-t hairline pt-6 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="label text-mute" data-reveal>
          ({n}) {label}
        </p>
        <h2 className="mt-4 max-w-[16ch] font-serif text-[clamp(44px,7.2vw,112px)] leading-[0.9] tracking-[-0.03em]" data-reveal>
          {children}
        </h2>
      </div>
      {aside ? (
        <div className="max-w-sm text-[15px] leading-7 text-mute md:pb-3" data-reveal>
          {aside}
        </div>
      ) : null}
    </header>
  );
}
