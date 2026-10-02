"use client";

import { useEffect, useMemo, useState } from "react";
import { explainRetrieval, memoryRouterModes, runMemoryRouterDemo, simulatedBaseline, type MemoryRouterMode } from "@/lib/memory-router-demo";
import { DemoShell, Segmented } from "@/components/site/demos/demo-shell";

const prompts = [
  { label: "Draft a PRD", text: "Draft a PRD for an AI workflow automation feature in a CRM." },
  { label: "Agent architecture", text: "Build a product architecture for an agent that manages subscriptions and reminders." },
  { label: "Explain routing", text: "Explain how Memory Router should optimize context before routing to a model." },
];

const stages = ["Retrieval", "Memory selection", "Context assembly", "Routing"] as const;
type Stage = (typeof stages)[number];

export function MemoryRouterDemo() {
  const [prompt, setPrompt] = useState(prompts[0].text);
  const [mode, setMode] = useState<MemoryRouterMode>("hybrid");
  const [stage, setStage] = useState<Stage>("Retrieval");
  const [run, setRun] = useState(0);
  const [reached, setReached] = useState(stages.length - 1);

  const result = useMemo(() => (prompt.trim() ? runMemoryRouterDemo(prompt, mode) : null), [prompt, mode]);
  const retrieval = useMemo(() => explainRetrieval(prompt), [prompt]);

  // "Run" walks the prompt through each stage; reduced motion shows the end state at once.
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReached(stages.length - 1);
      return;
    }
    setReached(0);
    setStage("Retrieval");
    const ids = stages.slice(1).map((s, i) =>
      window.setTimeout(() => {
        setReached(i + 1);
        setStage(s);
      }, (i + 1) * 650),
    );
    return () => ids.forEach(clearTimeout);
  }, [run]);

  const t = result?.tokenSavings;
  const baseline = simulatedBaseline.chatHistoryTokens + simulatedBaseline.workingMemoryTokens;

  return (
    <DemoShell
      title="memory-router build-context"
      note={`Runs Memory Router's sandbox adapter in your browser against six sample memories — nothing is stored or sent. Savings are an estimate against a simulated ${baseline.toLocaleString()}-token chat history plus working memory.`}
    >
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setPrompt(p.text);
              setRun((r) => r + 1);
            }}
            className={`h-8 rounded-full border px-3 text-[12px] transition-colors ${prompt === p.text ? "border-signal bg-signal text-white" : "border-paper/20 text-paper/80 hover:border-paper"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <label htmlFor="mr-prompt" className="mt-4 block text-[12px] text-paper/60">
        Sandbox prompt
      </label>
      <textarea
        id="mr-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value.slice(0, 400))}
        rows={2}
        className="mt-1 w-full resize-none rounded-xl bg-paper/[0.06] p-3 font-mono text-[13px] leading-6 text-paper outline-none ring-1 ring-paper/10 focus:ring-signal"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Segmented label="Routing mode" value={mode} options={memoryRouterModes} onChange={setMode} />
        <button type="button" onClick={() => setRun((r) => r + 1)} disabled={!prompt.trim()} className="btn h-10 bg-paper px-4 text-[13px] text-ink hover:bg-signal hover:text-white disabled:opacity-40">
          Run through the pipeline
        </button>
      </div>

      {/* Stage track */}
      <div role="tablist" aria-label="Pipeline stages" className="mt-6 grid grid-cols-2 gap-1 sm:grid-cols-4">
        {stages.map((s, i) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={stage === s}
            aria-controls="mr-stage"
            disabled={i > reached}
            onClick={() => setStage(s)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] transition-colors ${stage === s ? "bg-paper text-ink" : i <= reached ? "bg-paper/10 text-paper/85 hover:bg-paper/15" : "bg-paper/[0.04] text-paper/35"}`}
          >
            <span className="font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
            {s}
          </button>
        ))}
      </div>

      <div id="mr-stage" role="tabpanel" aria-live="polite" className="mt-4 min-h-[220px] rounded-xl bg-paper/[0.04] p-4">
        {stage === "Retrieval" ? (
          <div>
            <p className="text-[13px] text-paper/70">Prompt words are matched against each sandbox memory&apos;s concepts and scored. Memories at 32% or more are candidates.</p>
            <ul className="mt-3 space-y-2">
              {retrieval.candidates.map((c) => (
                <li key={c.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-[12px]">
                  <span className={c.relevance >= 0.32 ? "text-paper" : "text-paper/40"}>
                    {c.domain} · {c.task}
                    {c.matched.length ? <span className="text-paper/50"> — matched “{c.matched.join("”, “")}”</span> : null}
                  </span>
                  <span className="font-mono tabular-nums text-paper/70">{Math.round(c.relevance * 100)}%</span>
                  <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-paper/10">
                    <span className={`block h-full rounded-full ${c.selected ? "bg-signal" : "bg-paper/30"}`} style={{ width: `${c.relevance * 100}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {stage === "Memory selection" ? (
          <div>
            <p className="text-[13px] text-paper/70">The top three candidates are kept; everything else stays out of the prompt.</p>
            <ul className="mt-3 space-y-3">
              {retrieval.candidates
                .filter((c) => c.selected)
                .map((c) => (
                  <li key={c.id} className="rounded-lg border border-paper/10 p-3">
                    <p className="text-[13px] text-paper">“{c.memory}”</p>
                    <p className="mt-1 font-mono text-[11px] text-paper/55">
                      why: {c.matched.length ? `matched ${c.matched.join(", ")}` : "no direct word match — kept on stored confidence"} · relevance {Math.round(c.relevance * 100)}%
                    </p>
                  </li>
                ))}
              {!retrieval.candidates.some((c) => c.selected) ? <li className="text-[13px] text-paper/60">No memory cleared the threshold — the prompt is sent lean.</li> : null}
            </ul>
          </div>
        ) : null}

        {stage === "Context assembly" && result && t ? (
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-[13px] text-paper/70">Selected memories, a short summary and your prompt become one compact context.</p>
              <p className="font-mono text-[12px]">
                ~{t.originalTokens.toLocaleString()} → ~{t.optimizedTokens.toLocaleString()} tokens <span className="text-signal">(est. −{t.savedPercent}%)</span>
              </p>
            </div>
            <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 font-mono text-[11px] leading-5 text-paper/80">{result.optimizedPrompt}</pre>
          </div>
        ) : null}

        {stage === "Routing" && result ? (
          <div>
            <p className="font-serif text-3xl">{result.route.selectedProvider}</p>
            <p className="mt-2 text-[13px] text-paper/75">{result.route.reason}</p>
            <p className="mt-3 font-mono text-[11px] text-paper/50">simulated latency ≈ {result.route.latencyEstimateMs} ms · no real provider is called</p>
          </div>
        ) : null}
      </div>
    </DemoShell>
  );
}
