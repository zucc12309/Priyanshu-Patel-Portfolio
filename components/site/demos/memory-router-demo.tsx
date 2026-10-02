"use client";

import { useMemo, useState } from "react";
import { memoryRouterModes, runMemoryRouterDemo, type MemoryRouterMode } from "@/lib/memory-router-demo";
import { DemoShell, Segmented } from "@/components/site/demos/demo-shell";

const prompts = [
  { label: "Draft a PRD", text: "Draft a PRD for an AI workflow automation feature in a CRM." },
  { label: "Agent architecture", text: "Build a product architecture for an agent that manages subscriptions and reminders." },
  { label: "Explain routing", text: "Explain how Memory Router should optimize context before routing to a model." },
];

export function MemoryRouterDemo() {
  const [prompt, setPrompt] = useState(prompts[0].text);
  const [mode, setMode] = useState<MemoryRouterMode>("hybrid");
  const result = useMemo(() => (prompt.trim() ? runMemoryRouterDemo(prompt, mode) : null), [prompt, mode]);
  const t = result?.tokenSavings;
  const ratio = t && t.originalTokens ? t.optimizedTokens / t.originalTokens : 1;

  return (
    <DemoShell title="memory-router build-context" note="Runs Memory Router's sandboxed demo adapter in your browser — sandbox memories only, nothing stored or sent.">
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setPrompt(p.text)}
            className={`h-8 rounded-full border px-3 text-[12px] transition-colors ${prompt === p.text ? "border-signal bg-signal text-white" : "border-paper/20 text-paper/80 hover:border-paper"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <label htmlFor="mr-prompt" className="sr-only">
        Prompt
      </label>
      <textarea
        id="mr-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value.slice(0, 400))}
        rows={2}
        className="mt-3 w-full resize-none rounded-xl bg-paper/[0.06] p-3 font-mono text-[13px] leading-6 text-paper outline-none ring-1 ring-paper/10 focus:ring-signal"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Segmented label="Routing mode" value={mode} options={memoryRouterModes} onChange={setMode} />
        {result ? <p className="font-mono text-[11px] text-paper/60">→ {result.route.selectedProvider} · ~{result.route.latencyEstimateMs}ms</p> : null}
      </div>

      {result && t ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-3" aria-label="Token comparison">
            <Bar label="Full history" value={t.originalTokens} width={1} tone="bg-paper/25" />
            <Bar label="Optimised prompt" value={t.optimizedTokens} width={Math.max(0.04, ratio)} tone="bg-signal" />
          </div>
          <p className="text-right" aria-live="polite">
            <span className="block font-serif text-6xl leading-none tracking-tight">−{t.savedPercent}%</span>
            <span className="text-[12px] text-paper/60">input tokens</span>
          </p>
          <div className="sm:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-paper/50">Memories retrieved</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {result.relevantMemoryUsed.length ? (
                result.relevantMemoryUsed.map((m) => (
                  <li key={m.id} className="rounded-full bg-paper/10 px-3 py-1 text-[12px]">
                    {m.domain} · {m.task} <span className="text-signal">{Math.round(m.relevance * 100)}%</span>
                  </li>
                ))
              ) : (
                <li className="text-[12px] text-paper/60">No strong match — prompt sent lean.</li>
              )}
            </ul>
            <p className="mt-3 text-[12px] leading-5 text-paper/60">{result.route.reason}</p>
          </div>
        </div>
      ) : null}
    </DemoShell>
  );
}

function Bar({ label, value, width, tone }: { label: string; value: number; width: number; tone: string }) {
  return (
    <div>
      <div className="flex justify-between text-[12px] text-paper/70">
        <span>{label}</span>
        <span className="font-mono tabular-nums">{value.toLocaleString()} tok</span>
      </div>
      <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-paper/[0.06]">
        <div className={`h-full rounded-full ${tone} transition-[width] duration-700 ease-out`} style={{ width: `${width * 100}%` }} />
      </div>
    </div>
  );
}
