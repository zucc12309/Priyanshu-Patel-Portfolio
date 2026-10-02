"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { DemoShell } from "@/components/site/demos/demo-shell";

// Sample fares and waiting times — not live provider data.
const rides = [
  { name: "Rapido", type: "Auto", fare: 116, wait: 8 },
  { name: "Namma Yatri", type: "Auto", fare: 124, wait: 6 },
  { name: "Ola", type: "Mini", fare: 148, wait: 5 },
  { name: "Uber", type: "Go", fare: 168, wait: 3 },
];

export function RideCompareDemo() {
  // 0 = only price matters, 100 = only waiting time matters.
  const [priority, setPriority] = useState(30);
  const ranked = useMemo(() => {
    const fares = rides.map((r) => r.fare);
    const waits = rides.map((r) => r.wait);
    const norm = (v: number, arr: number[]) => (v - Math.min(...arr)) / (Math.max(...arr) - Math.min(...arr) || 1);
    const w = priority / 100;
    return rides
      .map((r) => ({ ...r, score: (1 - w) * norm(r.fare, fares) + w * norm(r.wait, waits) }))
      .sort((a, b) => a.score - b.score);
  }, [priority]);
  const cheapest = Math.min(...rides.map((r) => r.fare));
  const fastest = Math.min(...rides.map((r) => r.wait));
  const best = ranked[0];

  return (
    <DemoShell
      title="ridecompare · rank rides"
      note="Sample fares and waiting times, not live prices. The shipped app compares estimates and flags the cheapest and fastest ride; the price-vs-wait weighting is a demo of how ranking could adapt to what you care about."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,240px)_1fr] md:items-start">
        <figure className="m-0 mx-auto w-full max-w-[240px]">
          <Image src="/projects/ridecompare/phoneframe-3.png" alt="RideCompare's real compare-fares screen" width={550} height={1014} sizes="240px" className="h-auto w-full" />
          <figcaption className="mt-1 text-center text-[11px] text-paper/50">The real app screen (mock data)</figcaption>
        </figure>

        <div>
          <label htmlFor="rc-priority" className="block text-[13px] text-paper/80">
            What matters more to you?
          </label>
          <input id="rc-priority" type="range" min={0} max={100} value={priority} onChange={(e) => setPriority(Number(e.target.value))} className="mt-3 w-full accent-[#FF4D12]" aria-valuetext={`${100 - priority}% price, ${priority}% waiting time`} />
          <div className="mt-1 flex justify-between font-mono text-[11px] text-paper/60">
            <span>Price {100 - priority}%</span>
            <span>Waiting time {priority}%</span>
          </div>

          <ol className="mt-6 space-y-2" aria-live="polite" aria-label="Rides ranked for your priority">
            {ranked.map((r, i) => (
              <li key={r.name} className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl px-4 py-3 transition-colors duration-300 ${i === 0 ? "bg-signal text-white" : "bg-paper/[0.06]"}`}>
                <span>
                  <span className="text-[15px] font-medium">{r.name}</span> <span className={i === 0 ? "text-white/80" : "text-paper/55"}>· {r.type}</span>
                  <span className="mt-0.5 flex gap-2 font-mono text-[10px] uppercase tracking-wider">
                    {r.fare === cheapest ? <span>Cheapest</span> : null}
                    {r.wait === fastest ? <span>Fastest</span> : null}
                  </span>
                </span>
                <span className="font-mono text-[15px] tabular-nums">₹{r.fare}</span>
                <span className={`w-14 text-right font-mono text-[13px] tabular-nums ${i === 0 ? "text-white/90" : "text-paper/70"}`}>{r.wait} min</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[13px] text-paper/75" role="status">
            Best match: <strong className="font-medium text-paper">{best.name}</strong> — ₹{best.fare - cheapest} more than the cheapest, {best.wait - fastest} min longer than the fastest.
          </p>
        </div>
      </div>
    </DemoShell>
  );
}
