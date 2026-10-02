"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "@/lib/data";
import { useBlockField } from "@/components/three/use-block-field";
import { LocalTime } from "@/components/site/local-time";

const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE;

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ready } = useBlockField(canvasRef, sectionRef, { theme: "obsidian", shape: "wave" });
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, _subject: `Portfolio message from ${data.name || "a visitor"}` }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section ref={sectionRef} id="contact" data-theme="dark" className="relative scroll-mt-0 overflow-hidden bg-obsidian text-paper">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] md:inset-y-0 md:left-auto md:h-auto md:w-[62%]" aria-hidden>
        <canvas ref={canvasRef} className={`h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40 md:bg-gradient-to-r md:from-obsidian md:via-obsidian/20 md:to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 pb-10 pt-[38vh] sm:px-8 md:pt-40 lg:px-12">
        <p className="label text-paper/55">(07) Contact</p>
        <h2 className="mt-4 max-w-[12ch] font-serif text-[clamp(56px,9vw,148px)] leading-[0.86] tracking-[-0.035em]">
          Let&apos;s build something <span className="italic text-signal">worth shipping.</span>
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div>
            <p className="max-w-md text-lg leading-relaxed text-paper/75">Open to Business Analyst, Product and AI Product roles — and to conversations with people building interesting things.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="font-serif text-[clamp(24px,3.2vw,40px)] italic underline decoration-paper/30 underline-offset-8 transition-colors hover:decoration-signal">
                {profile.email}
              </a>
              <button type="button" onClick={copy} className="grid size-11 place-items-center rounded-full border border-paper/25 transition-colors hover:bg-paper hover:text-ink" aria-label="Copy email address">
                {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              </button>
              <span role="status" className="sr-only">
                {copied ? "Email copied" : ""}
              </span>
            </div>
            <ul className="mt-10 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-xl border border-paper/15 bg-paper/15 text-[14px]">
              {[
                ["LinkedIn", profile.linkedin],
                ["GitHub", profile.github],
                ["Résumé", profile.resume],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className="flex h-14 items-center justify-between bg-obsidian px-4 transition-colors hover:bg-paper hover:text-ink">
                    {label} <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-paper/15 bg-obsidian/60 p-6 backdrop-blur-md sm:p-8">
            <p className="label text-paper/55">Or leave a note</p>
            <div className="mt-6 grid gap-5">
              {[
                { name: "name", label: "Name", type: "text", auto: "name" },
                { name: "email", label: "Email", type: "email", auto: "email" },
              ].map((f) => (
                <label key={f.name} className="grid gap-1.5 text-[13px] text-paper/60">
                  {f.label}
                  <input name={f.name} type={f.type} required autoComplete={f.auto} className="h-12 border-b border-paper/25 bg-transparent text-base text-paper outline-none transition-colors focus:border-signal" />
                </label>
              ))}
              <label className="grid gap-1.5 text-[13px] text-paper/60">
                Message
                <textarea name="message" required rows={4} className="resize-none border-b border-paper/25 bg-transparent py-2 text-base text-paper outline-none transition-colors focus:border-signal" />
              </label>
              <button type="submit" disabled={status === "sending"} className="btn mt-2 w-full bg-paper text-ink hover:bg-signal hover:text-white disabled:opacity-60">
                {status === "sending" ? "Sending…" : status === "sent" ? "Sent — thank you" : "Send message"}
              </button>
              <p role="status" className="min-h-5 text-[13px] text-paper/60">
                {status === "sent" ? "Got it. I usually reply within a couple of days." : status === "error" ? "That didn't go through — please email me directly." : ""}
              </p>
            </div>
          </form>
        </div>

        <footer className="mt-28 grid gap-6 border-t border-paper/15 pt-6 text-[13px] text-paper/55 md:grid-cols-[1fr_auto_auto] md:items-center md:gap-10">
          <p>
            © {new Date().getFullYear()} {profile.name}. Designed and built by me, with AI-assisted development · Next.js, three.js.
          </p>
          <p className="tabular-nums">
            Bengaluru · <LocalTime />
            {buildDate ? <> · updated {new Date(buildDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</> : null}
          </p>
          <Link href="/retro" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-signal">
            Enter retro mode →
          </Link>
        </footer>
      </div>
    </section>
  );
}
