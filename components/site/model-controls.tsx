"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { sanitizeWord } from "@/lib/pixel-font";

const presets = ["PP", "HELLO", "SQL", "UAT", "AI", "HIRE ME"];

/** Small control deck for the hero model: type a word, or pick a preset. */
export function ModelControls({ maxChars, onWord, className = "" }: { maxChars: number; onWord: (word: string) => void; className?: string }) {
  const [value, setValue] = useState("");
  const timer = useRef(0);
  const word = sanitizeWord(value, maxChars);

  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onWord(word), 140);
    return () => window.clearTimeout(timer.current);
  }, [word, onWord]);

  return (
    <div data-no-sculpt className={`rounded-2xl border hairline bg-paper/85 p-4 shadow-[0_20px_50px_-30px_rgba(18,18,17,0.5)] backdrop-blur-md ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="model-word" className="label text-mute">
          Play with the model
        </label>
        <span className="label hidden text-mute md:inline">drag · click</span>
      </div>
      <input
        id="model-word"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxChars + 4}
        placeholder="Type a word…"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        enterKeyHint="done"
        className="mt-2 h-11 w-full border-b border-ink/25 bg-transparent font-mono text-base uppercase tracking-[0.2em] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-mute focus:border-signal"
        aria-describedby="model-word-hint"
      />
      <p id="model-word-hint" className="mt-2 text-[12px] text-mute md:sr-only">
        Up to {maxChars} letters. The blocks rebuild as you type.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Preset words">
        {presets
          .filter((p) => p.length <= maxChars)
          .map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValue(p === "PP" ? "" : p)}
              aria-pressed={word === p || (p === "PP" && !word)}
              className={`h-8 rounded-full border px-3 font-mono text-[11px] transition-colors ${(word === p || (p === "PP" && !word)) ? "border-ink bg-ink text-paper" : "hairline hover:border-ink"}`}
            >
              {p}
            </button>
          ))}
      </div>
      {word === "HIRE ME" ? (
        <a href="#contact" className="fade-up mt-3 flex items-center justify-between rounded-xl bg-signal px-4 py-2.5 text-[14px] font-medium text-white">
          Great idea. Let&apos;s talk <ArrowRight className="size-4" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
