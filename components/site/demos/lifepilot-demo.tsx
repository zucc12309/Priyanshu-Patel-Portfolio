"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { DemoShell } from "@/components/site/demos/demo-shell";

const scenarios = {
  groceries: {
    label: "Weekly groceries",
    ask: "Do my usual Sunday grocery run",
    memory: ["Vegetarian household of 3", "Orders groceries on Sundays", "Prefers toned milk, brown bread"],
    items: [
      ["Toned milk 1L × 4", 236],
      ["Brown bread", 55],
      ["Paneer 400g", 190],
      ["Seasonal vegetables", 320],
      ["Basmati rice 5kg", 545],
    ],
  },
  dinner: {
    label: "Dinner for 4",
    ask: "Order dinner, friends are coming over",
    memory: ["No onion-garlic on Tuesdays", "Usual spot: South Indian", "Budget-conscious on weekdays"],
    items: [
      ["Thali × 4", 960],
      ["Filter coffee × 4", 240],
      ["Gulab jamun", 140],
    ],
  },
} as const;

type Key = keyof typeof scenarios;
const FEE = 49; // platform + delivery, known only after update_cart → get_cart
const steps = ["Context", "Memory", "Reasoning", "Proposal", "Approval"];

export function LifePilotDemo() {
  const [key, setKey] = useState<Key>("groceries");
  const [cap, setCap] = useState(1500);
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState<null | { ok: boolean; lines: string[] }>(null);
  const [badReply, setBadReply] = useState(false);
  const s = scenarios[key];
  const subtotal = useMemo(() => s.items.reduce((sum, [, p]) => sum + p, 0), [s]);

  // Walk the decision loop whenever the request changes.
  useEffect(() => {
    setOutcome(null);
    setStep(0);
    const ids = [1, 2, 3, 4].map((n) => window.setTimeout(() => setStep(n), n * 280));
    return () => ids.forEach(clearTimeout);
  }, [key]);

  const confirm = () => {
    const lines = [`cap check (pre): ₹${subtotal} ≤ ₹${cap} ${subtotal <= cap ? "✓" : "✗"}`];
    if (subtotal > cap) {
      setOutcome({ ok: false, lines: [...lines, "blocked before touching the cart — nothing charged"] });
      return;
    }
    const total = subtotal + FEE;
    lines.push("update_cart → get_cart (authoritative total incl. fees)", `cap check (post): ₹${total} ≤ ₹${cap} ${total <= cap ? "✓" : "✗"}`);
    if (total > cap) setOutcome({ ok: false, lines: [...lines, "clear_cart — fees pushed it over budget, nothing charged"] });
    else setOutcome({ ok: true, lines: [...lines, "demo mode: order simulated · memory updated"] });
  };

  return (
    <DemoShell title="lifepilot · approval loop" note="Simulation of LifePilot's approval and guardrail logic with sample items. No real orders.">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(scenarios) as Key[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKey(k)}
            aria-pressed={key === k}
            className={`h-8 rounded-full border px-3 text-[12px] transition-colors ${key === k ? "border-signal bg-signal text-white" : "border-paper/20 text-paper/80 hover:border-paper"}`}
          >
            {scenarios[k].label}
          </button>
        ))}
      </div>
      <p className="mt-3 rounded-xl bg-paper/[0.06] px-3 py-2 text-[13px]">
        <span className="text-paper/50">you →</span> “{s.ask}”
      </p>

      <ol className="mt-4 flex gap-1" aria-label="Decision loop">
        {steps.map((name, i) => (
          <li key={name} className={`flex-1 rounded-full py-1 text-center font-mono text-[10px] transition-colors duration-300 ${i <= step ? "bg-paper text-ink" : "bg-paper/10 text-paper/40"}`}>
            {name}
          </li>
        ))}
      </ol>

      <div className={`mt-4 grid gap-4 transition-opacity duration-300 sm:grid-cols-2 ${step >= 3 ? "opacity-100" : "opacity-30"}`}>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-paper/50">Why — from memory</p>
          <ul className="mt-2 space-y-1 text-[12px] text-paper/75">
            {s.memory.map((m) => (
              <li key={m}>· {m}</li>
            ))}
          </ul>
          <label className="mt-4 block text-[12px] text-paper/70">
            <span className="flex justify-between">
              Spend cap <span className="font-mono text-paper">₹{cap}</span>
            </span>
            <input type="range" min={300} max={3000} step={50} value={cap} onChange={(e) => { setCap(Number(e.target.value)); setOutcome(null); }} className="mt-1 w-full accent-[#FF4D12]" />
          </label>
        </div>
        <div className="rounded-xl bg-paper/[0.06] p-3">
          <ul className="space-y-1 text-[12px]">
            {s.items.map(([n, p]) => (
              <li key={n} className="flex justify-between gap-2">
                <span className="text-paper/80">{n}</span>
                <span className="font-mono">₹{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex justify-between border-t border-paper/10 pt-2 text-[13px]">
            Subtotal <span className="font-mono">₹{subtotal}</span>
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" disabled={step < 4} onClick={confirm} className="btn h-9 flex-1 bg-paper px-3 text-[12px] text-ink hover:bg-signal hover:text-white disabled:opacity-40">
              <Check className="size-3.5" aria-hidden /> Confirm
            </button>
            <button type="button" disabled={step < 4} onClick={() => setOutcome({ ok: true, lines: ["skipped — nothing executed", "memory: skip noted for next time"] })} className="btn h-9 flex-1 border border-paper/25 px-3 text-[12px] disabled:opacity-40">
              <X className="size-3.5" aria-hidden /> Skip
            </button>
          </div>
        </div>
      </div>

      {outcome ? (
        <div role="status" className={`fade-up mt-4 rounded-xl px-3 py-2 font-mono text-[11px] leading-5 ${outcome.ok ? "bg-[#1fbf5b]/15 text-[#7ee2a4]" : "bg-signal/15 text-[#ff9b78]"}`}>
          {outcome.lines.map((l) => (
            <p key={l}>› {l}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-4 border-t border-paper/10 pt-3">
        <label className="flex items-center gap-2 text-[12px] text-paper/70">
          <input type="checkbox" checked={badReply} onChange={(e) => setBadReply(e.target.checked)} className="accent-[#FF4D12]" />
          Simulate a misbehaving model reply
        </label>
        {badReply ? (
          <div className="fade-up mt-2 space-y-1 font-mono text-[11px] leading-5">
            <p className="text-paper/50 line-through">“Done! Your order has been placed ✅ Pay here: http://pay.example/xyz token=sk-live-…”</p>
            <p className="flex items-start gap-1.5 text-[#7ee2a4]">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden /> “Here&apos;s a proposed cart — tap Confirm to order.” (false claim, URL and secret stripped)
            </p>
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}
