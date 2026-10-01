"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { assistantKB, assistantSuggestions } from "@/lib/data";
import { SectionHead } from "@/components/site/section-head";

type Msg = { id: number; role: "user" | "bot"; lines: string[]; source?: string };

function answer(q: string): Omit<Msg, "id"> {
  const hit = assistantKB.find((k) => k.match.test(q));
  if (hit) return { role: "bot", lines: hit.answer, source: hit.source };
  return {
    role: "bot",
    lines: ["I only answer from this portfolio, and I don't have that one.", "Try asking about impact, experience, Memory Router, skills, education or how to get in touch."],
  };
}

export function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, role: "bot", lines: ["Hi — I'm a small assistant that answers questions about Priyanshu using only what's on this site. What would you like to know?"] },
  ]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const id = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { id: id.current++, role: "user", lines: [text] }]);
    setValue("");
    setTyping(true);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { id: id.current++, ...answer(text) }]);
      setTyping(false);
    }, 550);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(value);
  };

  return (
    <section id="ask" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 py-24 sm:px-8 md:py-36 lg:px-12">
      <SectionHead
        n="05"
        label="Ask"
        aside="Rule-based and honest: it matches your question against this portfolio's content and cites the section it used. No LLM, no data stored."
      >
        Ask the <span className="italic">portfolio.</span>
      </SectionHead>

      <div className="mt-14 overflow-hidden rounded-3xl bg-ink text-paper" data-reveal>
        <div className="flex items-center justify-between border-b border-paper/10 px-5 py-4 sm:px-8">
          <p className="flex items-center gap-2 text-[13px]">
            <span className="live-dot" aria-hidden /> Portfolio assistant
          </p>
          <p className="font-mono text-[11px] text-paper/50">answers cite their source</p>
        </div>
        <div ref={logRef} role="log" aria-live="polite" aria-label="Conversation" className="h-[420px] space-y-5 overflow-y-auto px-5 py-6 sm:px-8">
          {msgs.map((m) => (
            <div key={m.id} className={`fade-up flex ${m.role === "user" ? "justify-end" : ""}`} style={{ animationDuration: "400ms" }}>
              <div className={`max-w-[85%] text-[15px] leading-7 ${m.role === "user" ? "rounded-2xl rounded-br-sm bg-signal px-4 py-2.5 text-white" : ""}`}>
                {m.lines.map((l, i) => (
                  <p key={i} className={m.role === "bot" && i > 0 ? "text-paper/80" : ""}>
                    {l}
                  </p>
                ))}
                {m.source ? <p className="mt-2 font-mono text-[11px] text-paper/45">source → {m.source}</p> : null}
              </div>
            </div>
          ))}
          {typing ? (
            <p className="flex gap-1 text-paper/50" aria-label="Assistant is typing">
              <span className="caret">●</span>
              <span className="caret" style={{ animationDelay: "150ms" }}>
                ●
              </span>
              <span className="caret" style={{ animationDelay: "300ms" }}>
                ●
              </span>
            </p>
          ) : null}
        </div>
        <div className="border-t border-paper/10 p-4 sm:p-6">
          <div className="mb-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">
            {assistantSuggestions.map((s) => (
              <button key={s} type="button" onClick={() => ask(s)} className="shrink-0 rounded-full border border-paper/20 px-3 py-1.5 text-[13px] text-paper/80 transition-colors hover:border-paper hover:text-paper">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 rounded-full bg-paper/10 py-1.5 pl-5 pr-1.5">
            <label htmlFor="ask-input" className="sr-only">
              Ask a question about Priyanshu
            </label>
            <input
              id="ask-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask anything about Priyanshu…"
              className="h-10 min-w-0 flex-1 bg-transparent text-base text-paper outline-none placeholder:text-paper/45"
              autoComplete="off"
              enterKeyHint="send"
            />
            <button type="submit" disabled={!value.trim() || typing} aria-label="Send question" className="grid size-10 shrink-0 place-items-center rounded-full bg-signal text-white transition-opacity disabled:opacity-40">
              <ArrowUp className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
