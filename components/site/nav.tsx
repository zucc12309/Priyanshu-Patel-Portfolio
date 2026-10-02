"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import { profile } from "@/lib/data";
import { CommandPalette } from "@/components/site/command-palette";
import { AskPanel } from "@/components/site/assistant";

export const sections = [
  { id: "approach", label: "How I work", n: "00" },
  { id: "work", label: "Work", n: "01" },
  { id: "projects", label: "Projects", n: "02" },
  { id: "contact", label: "Contact", n: "03" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [ask, setAsk] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Track the section in view, and whether the nav is over a dark section.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    const darkEls = document.querySelectorAll("[data-theme='dark']");
    const darkIo = new IntersectionObserver((entries) => entries.forEach((e) => setDark(e.isIntersecting)), { rootMargin: "0px 0px -95% 0px" });
    darkEls.forEach((el) => darkIo.observe(el));

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      io.disconnect();
      darkIo.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const tone = dark && !open ? "text-paper" : "text-ink";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 pt-[var(--safe-top)] transition-colors duration-300 ${tone}`}>
        <div
          className={`mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-5 transition-[background-color,backdrop-filter] duration-300 sm:px-8 lg:px-12 ${
            scrolled && !open ? (dark ? "bg-obsidian/70 backdrop-blur-md" : "bg-paper/75 backdrop-blur-md") : ""
          }`}
        >
          <a href="#top" className="font-serif text-[22px] leading-none tracking-tight" aria-label="Priyanshu Patel — back to top">
            Priyanshu <span className="italic">Patel</span>
          </a>
          <nav aria-label="Sections" className="ml-auto hidden items-center gap-1 md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${active === s.id ? (dark ? "bg-paper text-ink" : "bg-ink text-paper") : "hover:opacity-60"}`}
              >
                {s.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setPalette(true)}
            className="ml-auto hidden h-9 items-center gap-1.5 rounded-full border border-current px-3 font-mono text-[11px] opacity-80 transition-opacity hover:opacity-100 md:ml-0 md:flex"
            aria-label="Open command menu"
          >
            <Command className="size-3" aria-hidden /> K
          </button>
          <button type="button" onClick={() => setAsk(true)} className="hidden h-9 items-center rounded-full px-3 text-[13px] transition-opacity hover:opacity-60 md:flex">
            Ask
          </button>
          <a href={profile.resume} target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-[13px] lg:flex">
            <span className="link-draw">Résumé</span> <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="ml-auto grid size-11 place-items-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </header>

      {open ? (
        <div id="mobile-menu" className="fixed inset-0 z-40 flex flex-col bg-paper px-5 pb-[calc(24px+var(--safe-bottom))] pt-[calc(88px+var(--safe-top))] md:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="fade-up flex items-baseline gap-4 border-b hairline py-4 font-serif text-[44px] leading-none tracking-tight"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="font-mono text-[11px] text-mute">{s.n}</span>
                {s.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setAsk(true);
            }}
            className="mt-6 h-11 text-left text-[15px] underline decoration-ink/30 underline-offset-4"
          >
            Ask about my work
          </button>
          <div className="mt-auto flex flex-wrap gap-3">
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-ink">
              Résumé <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-ghost">
              Email me
            </a>
          </div>
        </div>
      ) : null}

      {palette ? (
        <CommandPalette
          onClose={() => setPalette(false)}
          onAsk={() => {
            setPalette(false);
            setAsk(true);
          }}
        />
      ) : null}
      {ask ? <AskPanel onClose={() => setAsk(false)} /> : null}
    </>
  );
}
