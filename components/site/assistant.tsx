"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, X } from "lucide-react";
import { assistantKB, assistantSuggestions } from "@/lib/data";

type Msg = { id: number; role: "user" | "bot"; lines: string[]; source?: string };

function answer(q: string): Omit<Msg, "id"> {
  const hit = assistantKB.find((k) => k.match.test(q));
  if (hit) return { role: "bot", lines: hit.answer, source: hit.source };
  return {
    role: "bot",
    lines: ["I only answer from this portfolio, and I don't have that one.", "Try asking about impact, experience, a project, education or how to get in touch."],
  };
}

/** Optional utility: a rule-based assistant in a side panel, opened from the nav. */
export function AskPanel({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, role: "bot", lines: ["Ask about Priyanshu's work. I answer only from this site's content and cite the section I used — no LLM, nothing stored."] },
  ]);
  const [value, setValue] = useState("");
  const id = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("button, input");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [msgs]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setMsgs((m) => [...m, { id: id.current++, role: "user", lines: [text] }, { id: id.current++, ...answer(text) }]);
    setValue("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(value);
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-ink/25" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ask about my work"
        className="fade-up flex h-full w-full flex-col bg-ink pb-[var(--safe-bottom)] pt-[var(--safe-top)] text-paper sm:max-w-md"
        style={{ animationDuration: "300ms" }}
      >
        <div className="flex items-center justify-between border-b border-paper/10 px-5 py-4">
          <p className="text-[15px]">Ask about my work</p>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full hover:bg-paper/10" aria-label="Close">
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div ref={logRef} role="log" aria-live="polite" aria-label="Conversation" className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
              <div className={`max-w-[88%] text-[15px] leading-7 ${m.role === "user" ? "rounded-2xl rounded-br-sm bg-signal px-4 py-2.5 text-white" : ""}`}>
                {m.lines.map((l, i) => (
                  <p key={i} className={m.role === "bot" && i > 0 ? "text-paper/80" : ""}>
                    {l}
                  </p>
                ))}
                {m.source ? <p className="mt-2 font-mono text-[11px] text-paper/45">source → {m.source}</p> : null}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-paper/10 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {assistantSuggestions.map((s) => (
              <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-paper/20 px-3 py-1.5 text-[13px] text-paper/80 hover:border-paper hover:text-paper">
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
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask about experience, projects…"
              className="h-10 min-w-0 flex-1 bg-transparent text-base text-paper outline-none placeholder:text-paper/45"
              autoComplete="off"
              enterKeyHint="send"
            />
            <button type="submit" disabled={!value.trim()} aria-label="Send question" className="grid size-10 shrink-0 place-items-center rounded-full bg-signal text-white disabled:opacity-40">
              <ArrowUp className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
