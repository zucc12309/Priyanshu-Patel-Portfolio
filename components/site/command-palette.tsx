"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { navigateWithTransition } from "@/lib/view-transition";
import { CornerDownLeft, Search } from "lucide-react";
import { profile } from "@/lib/data";
import { projects } from "@/lib/projects";

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

function go(href: string, newTab = false) {
  if (newTab) window.open(href, "_blank", "noopener,noreferrer");
  else window.location.href = href;
}

export function CommandPalette({ onClose, onAsk }: { onClose: () => void; onAsk: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(
    () => [
      ...[
        ["approach", "How I work"],
        ["work", "Work"],
        ["projects", "Projects"],
        ["contact", "Contact"],
      ].map(([id, label]) => ({ id, group: "Jump to", label, run: () => go(`/#${id}`) })),
      { id: "ask", group: "Jump to", label: "Ask about my work", run: onAsk },
      ...projects.map((p) => ({ id: p.slug, group: "Projects", label: p.title, hint: p.status, run: () => navigateWithTransition(router, `/projects/${p.slug}`) })),
      { id: "resume", group: "Links", label: "Open résumé", hint: "PDF", run: () => go(profile.resume, true) },
      { id: "email", group: "Links", label: "Email Priyanshu", hint: profile.email, run: () => go(`mailto:${profile.email}`) },
      { id: "linkedin", group: "Links", label: "LinkedIn", run: () => go(profile.linkedin, true) },
      { id: "github", group: "Links", label: "GitHub", run: () => go(profile.github, true) },
      { id: "playground", group: "Links", label: "Memory Router playground", run: () => go("/projects/memory-router/playground") },
      { id: "retro", group: "Easter egg", label: "Enter retro mode (Win95)", run: () => go("/retro") },
    ],
    [router, onAsk],
  );

  const results = items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(query.toLowerCase().trim()));
  const idx = Math.min(active, Math.max(0, results.length - 1));

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, []);

  const select = (item?: Item) => {
    if (!item) return;
    onClose();
    item.run();
  };

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/30 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Command menu" className="fade-up w-full max-w-lg overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]" style={{ animationDuration: "300ms" }}>
        <div className="flex items-center gap-3 border-b hairline px-4">
          <Search className="size-4 text-mute" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((idx + 1) % Math.max(1, results.length));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((idx - 1 + results.length) % Math.max(1, results.length));
              } else if (e.key === "Enter") {
                e.preventDefault();
                select(results[idx]);
              }
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={results[idx] ? `cmd-${results[idx].id}` : undefined}
            aria-label="Search"
            placeholder="Jump to a section, project or link…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-mute"
          />
          <kbd className="rounded border hairline px-1.5 font-mono text-[10px] text-mute">ESC</kbd>
        </div>
        <ul id="cmd-list" role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-2">
          {results.map((item, i) => {
            const head = item.group !== lastGroup;
            lastGroup = item.group;
            return (
              <li key={item.id} role="presentation">
                {head ? <p className="label px-3 pb-1 pt-3 text-mute">{item.group}</p> : null}
                <div
                  id={`cmd-${item.id}`}
                  role="option"
                  aria-selected={i === idx}
                  onMouseMove={() => setActive(i)}
                  onClick={() => select(item)}
                  className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-[15px] ${i === idx ? "bg-ink text-paper" : ""}`}
                >
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.hint ? <span className={`hidden truncate text-[12px] sm:block ${i === idx ? "text-paper/60" : "text-mute"}`}>{item.hint}</span> : null}
                  {i === idx ? <CornerDownLeft className="size-3.5" aria-hidden /> : null}
                </div>
              </li>
            );
          })}
          {results.length === 0 ? <li className="px-3 py-6 text-center text-mute">Nothing found.</li> : null}
        </ul>
      </div>
    </div>
  );
}
