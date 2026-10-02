"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { DemoShell } from "@/components/site/demos/demo-shell";

const scenarios = {
  groceries: {
    label: "Weekly groceries",
    ask: "Do my usual Sunday grocery run",
    reasons: ["You order groceries on Sundays", "Vegetarian household of three", "You prefer toned milk and brown bread"],
    items: [
      ["Toned milk 1L × 4", 236],
      ["Brown bread", 55],
      ["Paneer 400g", 190],
      ["Seasonal vegetables", 320],
      ["Basmati rice 5kg", 545],
    ],
  },
  dinner: {
    label: "Dinner for four",
    ask: "Order dinner, friends are coming over",
    reasons: ["Your usual spot is South Indian", "No onion or garlic on Tuesdays", "You keep weekday spend low"],
    items: [
      ["Thali × 4", 960],
      ["Filter coffee × 4", 240],
      ["Gulab jamun", 140],
    ],
  },
} as const;

type Key = keyof typeof scenarios;
const FEES = 49; // delivery + platform fee, only known once the cart is built
const steps = ["Propose", "Check limit", "Ask for approval", "Outcome"];

export function LifePilotDemo() {
  const [key, setKey] = useState<Key>("groceries");
  const [limit, setLimit] = useState(1500);
  const [decision, setDecision] = useState<null | "approved" | "rejected">(null);
  const s = scenarios[key];
  const subtotal = s.items.reduce((sum, [, p]) => sum + p, 0);
  const total = subtotal + FEES;
  const withinLimit = total <= limit;
  const current = decision ? 3 : 2;

  return (
    <DemoShell
      title="lifepilot · approval loop"
      note="Sandbox with sample items and prices. Approve and Reject only change this page — no order is placed and nothing is sent anywhere. In LifePilot itself the same checks run before the Swiggy MCP checkout tool is ever called."
    >
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(scenarios) as Key[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setKey(k);
              setDecision(null);
            }}
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

      <ol className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-4" aria-label="Steps">
        {steps.map((name, i) => (
          <li key={name} aria-current={i === current ? "step" : undefined} className={`rounded-full py-1.5 text-center font-mono text-[10px] ${i <= current ? "bg-paper text-ink" : "bg-paper/10 text-paper/45"}`}>
            {String(i + 1).padStart(2, "0")} {name}
          </li>
        ))}
      </ol>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {/* 1 — proposal */}
        <section className="rounded-xl bg-paper/[0.05] p-4" aria-labelledby="lp-1">
          <h4 id="lp-1" className="font-mono text-[10px] uppercase tracking-wider text-paper/50">
            01 · The agent proposes
          </h4>
          <ul className="mt-3 space-y-1 text-[12px]">
            {s.items.map(([n, p]) => (
              <li key={n} className="flex justify-between gap-2">
                <span className="text-paper/80">{n}</span>
                <span className="font-mono">₹{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] uppercase tracking-wider text-paper/45">Why</p>
          <ul className="mt-1 space-y-0.5 text-[12px] text-paper/70">
            {s.reasons.map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </section>

        {/* 2 — limit check */}
        <section className="rounded-xl bg-paper/[0.05] p-4" aria-labelledby="lp-2">
          <h4 id="lp-2" className="font-mono text-[10px] uppercase tracking-wider text-paper/50">
            02 · Spending limit
          </h4>
          <label className="mt-3 block text-[12px] text-paper/75">
            <span className="flex justify-between">
              Your limit <span className="font-mono text-paper">₹{limit}</span>
            </span>
            <input
              type="range"
              min={300}
              max={3000}
              step={50}
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setDecision(null);
              }}
              className="mt-2 w-full accent-[#FF4D12]"
            />
          </label>
          <dl className="mt-3 space-y-1 font-mono text-[12px]">
            <div className="flex justify-between">
              <dt className="text-paper/60">Items</dt>
              <dd>₹{subtotal}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-paper/60">Fees (from the cart)</dt>
              <dd>₹{FEES}</dd>
            </div>
            <div className="flex justify-between border-t border-paper/10 pt-1">
              <dt>Total</dt>
              <dd>₹{total}</dd>
            </div>
          </dl>
          <p role="status" className={`mt-3 rounded-lg px-3 py-2 text-[12px] ${withinLimit ? "bg-[#1fbf5b]/15 text-[#7ee2a4]" : "bg-signal/15 text-[#ff9b78]"}`}>
            {withinLimit ? `Within limit — ₹${limit - total} to spare` : `Over limit by ₹${total - limit} — blocked before approval`}
          </p>
        </section>

        {/* 3 — approval + 4 outcome */}
        <section className="rounded-xl bg-paper/[0.05] p-4" aria-labelledby="lp-3">
          <h4 id="lp-3" className="font-mono text-[10px] uppercase tracking-wider text-paper/50">
            03 · Your approval
          </h4>
          {withinLimit ? (
            <>
              <p className="mt-3 text-[13px] text-paper/80">Order {s.items.length} items for ₹{total}?</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => setDecision("approved")} className="btn h-10 flex-1 bg-paper px-3 text-[13px] text-ink hover:bg-signal hover:text-white">
                  <Check className="size-4" aria-hidden /> Approve
                </button>
                <button type="button" onClick={() => setDecision("rejected")} className="btn h-10 flex-1 border border-paper/25 px-3 text-[13px]">
                  <X className="size-4" aria-hidden /> Reject
                </button>
              </div>
            </>
          ) : (
            <p className="mt-3 text-[13px] text-paper/70">Nothing to approve. The agent can&apos;t ask for a purchase that breaks your limit — raise the limit or change the request.</p>
          )}
          {decision ? (
            <div role="status" className="fade-up mt-4 border-t border-paper/10 pt-3" style={{ animationDuration: "300ms" }}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-paper/50">04 · Outcome (sandboxed)</p>
              <p className="mt-2 text-[13px]">
                {decision === "approved"
                  ? "Approved. In this sandbox nothing is ordered — LifePilot would now re-check the cart total and only then call checkout."
                  : "Rejected. Nothing is executed; LifePilot would note the skip so it suggests differently next time."}
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </DemoShell>
  );
}
