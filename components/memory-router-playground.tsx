"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, CheckCircle2, Loader2, Lock, Play, RotateCcw, Shield, Sparkles, Terminal, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MemoryRouterDemoResponse, MemoryRouterMode, memoryRouterModes } from "@/lib/memory-router-demo";
import { cn } from "@/lib/utils";

const starterPrompts = [
  "Draft a PRD for an AI workflow automation feature in a CRM.",
  "Build a product architecture for an agent that manages subscriptions and reminders.",
  "Explain how Memory Router should optimize context before routing to a model.",
];

export function MemoryRouterPlayground() {
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [mode, setMode] = useState<MemoryRouterMode>("hybrid");
  const [result, setResult] = useState<MemoryRouterDemoResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const terminalCommand = useMemo(() => `memory-router build-context "${prompt || "your prompt"}" --mode ${mode}`, [mode, prompt]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/memory-router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error ?? "Memory Router demo failed.");
      }

      setResult(json);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/projects/memory-router" className="inline-flex items-center gap-2 text-sm text-white/58 transition hover:text-white">
          <ArrowLeft className="size-4" /> Back to Memory Router
        </Link>

        <section className="grid gap-10 py-12 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-2 text-sm text-cyan">
              <Sparkles className="size-4" /> Live Demo Mode
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-white md:text-6xl">Memory Router Playground</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/62">
              Try a Vercel-safe simulation of Memory Router’s context optimization, memory retrieval, and routing output.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <SafetyPill icon={Lock} label="No private user data stored" />
              <SafetyPill icon={Shield} label="Demo memory is sandboxed" />
              <SafetyPill icon={Brain} label="No local memories accessed" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[8px] border border-line bg-[#05070b] shadow-card"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400/80" />
                <span className="size-3 rounded-full bg-amber/80" />
                <span className="size-3 rounded-full bg-mint/80" />
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Terminal className="size-4" /> sandbox-terminal
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-5">
              <div>
                <label className="mb-3 block text-sm font-medium text-white">Mode selector</label>
                <div className="grid grid-cols-3 gap-2">
                  {memoryRouterModes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMode(item)}
                      className={cn(
                        "h-10 rounded-[8px] border text-sm font-medium capitalize transition",
                        mode === item ? "border-cyan/45 bg-cyan/15 text-white" : "border-white/10 bg-white/[0.04] text-white/52 hover:text-white",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="memory-router-prompt" className="mb-3 block text-sm font-medium text-white">
                  User prompt
                </label>
                <textarea
                  id="memory-router-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  maxLength={2000}
                  className="min-h-36 w-full resize-y rounded-[8px] border border-white/10 bg-black/35 p-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-cyan/45"
                  placeholder="Ask Memory Router to optimize context for a task..."
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/36">
                  <span>{prompt.length}/2000 characters</span>
                  <span>Prompts are processed in-memory for this request only.</span>
                </div>
              </div>

              <div className="rounded-[8px] border border-white/10 bg-black/35 p-4 font-mono text-xs leading-6 text-cyan">
                <span className="text-white/36">$ </span>
                {terminalCommand}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-cyan/40 bg-cyan/15 px-4 text-sm font-medium text-white transition hover:bg-cyan/20 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                  Run Memory Router
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrompt(starterPrompts[0]);
                    setMode("hybrid");
                    setResult(null);
                    setError("");
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-white/12 bg-white/[0.055] px-4 text-sm text-white/66 transition hover:text-white"
                >
                  <RotateCcw className="size-4" /> Reset
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        <section className="grid gap-6 pb-10 lg:grid-cols-[.38fr_.62fr]">
          <div className="grid gap-6">
            <Panel title="Demo adapter" icon={Shield}>
              <p className="leading-7 text-white/58">
                This public playground uses a sandbox adapter that mimics the current CLI response shape. It does not execute the Memory Router CLI on Vercel.
              </p>
            </Panel>
            <Panel title="Example prompts" icon={Zap}>
              <div className="grid gap-2">
                {starterPrompts.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setPrompt(example)}
                    className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3 text-left text-sm leading-6 text-white/60 transition hover:border-cyan/35 hover:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid gap-6">
            {error ? (
              <div className="rounded-[8px] border border-red-400/30 bg-red-400/10 p-5 text-sm text-red-100">{error}</div>
            ) : null}
            <ResultView result={result} isLoading={isLoading} />
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultView({ result, isLoading }: { result: MemoryRouterDemoResponse | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Panel title="Routing request" icon={Loader2}>
        <div className="space-y-3">
          {["Scoring sandbox memory", "Building optimized context", "Estimating token savings"].map((line) => (
            <div key={line} className="flex items-center gap-3 text-sm text-white/58">
              <Loader2 className="size-4 animate-spin text-cyan" /> {line}
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (!result) {
    return (
      <Panel title="Output" icon={Terminal}>
        <p className="leading-7 text-white/58">Run the playground to see context summary, optimized prompt, relevant memory, and token savings.</p>
      </Panel>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Selected route" value={result.route.selectedProvider} />
        <Metric label="Token savings estimate" value={`${result.tokenSavings.savedPercent}%`} />
        <Metric label="Optimized tokens" value={String(result.tokenSavings.optimizedTokens)} />
      </div>

      <Panel title="Context summary" icon={Brain}>
        <p className="leading-7 text-white/62">{result.contextSummary}</p>
        <div className="mt-4 rounded-[8px] border border-white/10 bg-black/25 p-4 text-sm text-white/54">
          <span className="text-cyan">Route reason:</span> {result.route.reason}
        </div>
      </Panel>

      <Panel title="Relevant memory used" icon={CheckCircle2}>
        <div className="grid gap-3">
          {result.relevantMemoryUsed.map((memory) => (
            <div key={memory.id} className="rounded-[8px] border border-white/10 bg-black/25 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-cyan/25 bg-cyan/10 px-2 py-1 text-cyan">{memory.domain}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-white/46">{memory.task}</span>
                <span className="text-white/34">relevance {memory.relevance}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/62">{memory.memory}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Optimized prompt output" icon={Terminal}>
        <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-[8px] border border-white/10 bg-black/35 p-4 font-mono text-xs leading-6 text-white/68">
          {result.optimizedPrompt}
        </pre>
      </Panel>
    </>
  );
}

function SafetyPill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="rounded-[8px] border border-line bg-white/[0.045] p-4">
      <Icon className="mb-3 size-5 text-mint" />
      <p className="text-sm font-medium leading-6 text-white">{label}</p>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section className="rounded-[8px] border border-line bg-white/[0.045] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
        <Icon className="size-4 text-cyan" /> {title}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-line bg-white/[0.045] p-5">
      <p className="text-xs tracking-[0.12em] text-white/34">{label}</p>
      <p className="mt-3 break-words text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
