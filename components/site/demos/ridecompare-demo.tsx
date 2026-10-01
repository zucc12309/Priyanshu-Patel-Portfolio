"use client";

import { useMemo, useState } from "react";
import { DemoShell, Segmented } from "@/components/site/demos/demo-shell";

// Sample slab configuration to illustrate how the fare engine works — not live provider prices.
const providers = [
  { name: "Namma Yatri", base: 30, freeKm: 2, slabs: [[8, 15], [Infinity, 15]], night: 1.5 },
  { name: "Rapido", base: 35, freeKm: 1, slabs: [[6, 13], [Infinity, 15]], night: 1.15 },
  { name: "Ola", base: 45, freeKm: 1, slabs: [[6, 14], [Infinity, 17]], night: 1.25 },
  { name: "Uber", base: 50, freeKm: 1, slabs: [[6, 14], [Infinity, 18]], night: 1.2 },
] as const;

function fare(p: (typeof providers)[number], km: number, night: boolean) {
  let remaining = Math.max(0, km - p.freeKm);
  let covered = p.freeKm;
  let total = p.base;
  for (const [upto, rate] of p.slabs) {
    const span = Math.min(remaining, upto - covered);
    if (span <= 0) continue;
    total += span * rate;
    remaining -= span;
    covered += span;
  }
  return Math.round(total * (night ? p.night : 1));
}

export function RideCompareDemo() {
  const [km, setKm] = useState(8);
  const [time, setTime] = useState<"day" | "night">("day");
  const [opened, setOpened] = useState<string | null>(null);

  const ranked = useMemo(
    () => providers.map((p) => ({ name: p.name, price: fare(p, km, time === "night") })).sort((a, b) => a.price - b.price),
    [km, time],
  );
  const max = ranked[ranked.length - 1].price;
  const saving = max - ranked[0].price;

  return (
    <DemoShell title="ridecompare /estimate" note="Sample slab pricing to show how the fare engine ranks rides — not live provider prices.">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="flex justify-between text-[12px] text-paper/70">
            <span>Trip distance</span>
            <span className="font-mono tabular-nums text-paper">{km} km</span>
          </span>
          <input type="range" min={1} max={30} value={km} onChange={(e) => { setKm(Number(e.target.value)); setOpened(null); }} className="mt-2 w-full accent-[#FF4D12]" />
        </label>
        <Segmented label="Time of day" value={time} options={["day", "night"] as const} onChange={(v) => { setTime(v); setOpened(null); }} />
      </div>

      <ol className="mt-6 space-y-3" aria-live="polite">
        {ranked.map((r, i) => (
          <li key={r.name} className="grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-3">
            <span className={`text-[14px] ${i === 0 ? "font-medium text-paper" : "text-paper/70"}`}>{r.name}</span>
            <div className="h-7 overflow-hidden rounded-lg bg-paper/[0.06]">
              <div className={`flex h-full items-center rounded-lg px-2 font-mono text-[10px] transition-[width] duration-500 ease-out ${i === 0 ? "bg-signal text-white" : "bg-paper/20 text-paper/80"}`} style={{ width: `${(r.price / max) * 100}%` }}>
                {i === 0 ? "BEST" : ""}
              </div>
            </div>
            <span className="text-right font-mono text-[14px] tabular-nums">₹{r.price}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-4">
        <p className="text-[14px]">
          Save <span className="font-serif text-3xl text-signal">₹{saving}</span> vs the priciest option
        </p>
        <button type="button" onClick={() => setOpened(ranked[0].name)} className="btn h-10 bg-paper px-4 text-[13px] text-ink hover:bg-signal hover:text-white">
          Book {ranked[0].name}
        </button>
      </div>
      {opened ? (
        <p className="fade-up mt-3 font-mono text-[12px] text-paper/70" role="status">
          → would open {opened} with pickup and drop pre-filled, and log the shown fare to compare with what you actually pay.
        </p>
      ) : null}
    </DemoShell>
  );
}
