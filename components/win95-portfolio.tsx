"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Screen = "home" | "about" | "projects" | "skills" | "experience" | "contact";

const projects = [
  { id: "01", title: "MEMORY ROUTER", desc: "AI context management with multi-provider routing and encrypted local memory.", tags: ["TypeScript", "AI"], color: "#00d4ff" },
  { id: "02", title: "RIDECOMPARE", desc: "Cross-platform fare comparison for Indian ride-hailing services.", tags: ["React Native", "APIs"], color: "#ff6b9d" },
  { id: "03", title: "LIFEADMIN OS", desc: "AI-powered personal admin dashboard for documents and subscriptions.", tags: ["Next.js", "AI"], color: "#39ff14" },
  { id: "04", title: "CRM WORKFLOW", desc: "Automated CRM pipeline with n8n workflows and Supabase backend.", tags: ["n8n", "Automation"], color: "#ffd700" },
];

const skillBars = [
  { name: "Business Analysis", pct: 90 }, { name: "SQL & Data", pct: 85 },
  { name: "API Testing", pct: 82 }, { name: "UAT / QA", pct: 88 },
  { name: "Agile / Scrum", pct: 85 }, { name: "Stakeholder Mgmt", pct: 80 },
  { name: "Process Design", pct: 78 }, { name: "Problem Solving", pct: 92 },
];

const toolsList = ["Jira", "Postman", "SQL Server", "Power BI", "Python", "Figma", "n8n", "Git", "Excel", "Confluence", "Miro", "Notion"];

const jobs = [
  { role: "Business Analyst", co: "Digit Life Insurance", period: "Jun 2025 – Present", loc: "Bengaluru", bullets: ["Leading SDLC for Group Life products — 1,500+ Cr premium portfolio", "API integration testing, UAT coordination, SQL-based data analysis", "Recipient of Tech Titan Award for technical contributions"] },
  { role: "Finance & Accounting Intern", co: "BHEL", period: "May – Aug 2024", loc: "Bhopal", bullets: ["Financial analysis and reporting for India's largest engineering enterprise"] },
  { role: "Deep Learning Intern", co: "MANIT Bhopal", period: "May – Jul 2023", loc: "Bhopal", bullets: ["Research on deep learning models for practical applications"] },
];

const certs = ["NISM VIII – Equity Derivatives", "NISM XV – Research Analyst", "FMVA – Financial Modelling", "Business Analysis Foundations"];
const edu = [{ deg: "MBA Finance", school: "DAVV, Indore", gpa: "3.56/4" }, { deg: "B.Tech CSE", school: "RGPV, Bhopal", gpa: "3.56/4" }];

const screenMeta: Record<Screen, { title: string; color: string }> = {
  home: { title: "portfolio.exe", color: "#00d4ff" },
  about: { title: "about.exe", color: "#ff6b9d" },
  projects: { title: "projects.exe", color: "#39ff14" },
  skills: { title: "skills.exe", color: "#4ecdc4" },
  experience: { title: "experience.exe", color: "#ffd700" },
  contact: { title: "contact.exe", color: "#a855f7" },
};

/* ═══════════════════════════════════════════════════════ */

export function Win95Portfolio() {
  const [screen, setScreen] = useState<Screen>("home");
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState("--:--");

  useEffect(() => { const t = setTimeout(() => setBooted(true), 2600); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick(); const id = setInterval(tick, 30_000); return () => clearInterval(id);
  }, []);

  if (!booted) return <BootScreen />;

  const m = screenMeta[screen];
  return (
    <div className="flex h-screen flex-col bg-[#0a0a16] font-mono selection:bg-[#39ff14]/20">
      <div className="pointer-events-none fixed inset-0 z-50 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.12)_2px,rgba(0,0,0,0.12)_4px)] opacity-20" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(169,112,255,0.06),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(0,212,255,0.04),transparent_40%)]" />

      <div className="relative flex-1 overflow-hidden p-2 pb-0 md:p-3 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div key={screen} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.15 }} className="flex h-full flex-col">
            <Win title={m.title} color={m.color} time={time}>
              {screen === "home" && <HomeScreen nav={setScreen} active={screen} />}
              {screen === "about" && <AboutScreen />}
              {screen === "projects" && <ProjectsScreen />}
              {screen === "skills" && <SkillsScreen />}
              {screen === "experience" && <ExperienceScreen />}
              {screen === "contact" && <ContactScreen />}
            </Win>
          </motion.div>
        </AnimatePresence>
      </div>

      <Taskbar screen={screen} nav={setScreen} time={time} />
    </div>
  );
}

/* ─── Boot ─── */

function BootScreen() {
  const [p, setP] = useState(0);
  useEffect(() => { const id = setInterval(() => setP(v => Math.min(v + 4, 100)), 70); return () => clearInterval(id); }, []);
  const lines = ["BIOS v3.1.0 — Priyanshu Patel Portfolio System", "Memory test... 4096 MB OK", "Loading portfolio.exe...", "Mounting projects... 4 found", "Initializing subsystems... OK"];
  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a16] font-mono">
      <div className="w-full max-w-lg space-y-1 px-6 text-sm text-[#39ff14]">
        {lines.filter((_, i) => p > i * 16).map(l => <p key={l}>{l}</p>)}
        <div className="mt-6 h-5 border border-[#39ff14]/30 p-[2px]">
          <div style={{ width: `${p}%`, backgroundImage: "repeating-linear-gradient(90deg,#39ff14 0 7px,transparent 7px 10px)" }} className="h-full transition-[width] duration-100" />
        </div>
        <p className="text-xs text-[#39ff14]/40">{p}% loaded</p>
      </div>
    </div>
  );
}

/* ─── Window Chrome ─── */

function Win({ title, color, time, children }: { title: string; color: string; time: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden border border-white/[0.08] bg-[#0f0f23]" style={{ borderTopColor: color, borderTopWidth: 3 }}>
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#1a1a2e] px-3 py-1.5">
        <span className="text-xs text-white/60">{title}</span>
        <div className="flex gap-[3px]">
          {["─", "□", "×"].map((ch, i) => (
            <span key={ch} className={`flex h-[18px] w-[22px] cursor-default items-center justify-center border border-white/[0.12] text-[10px] leading-none text-white/25 ${i === 2 ? "hover:bg-red-500/40 hover:text-white" : "hover:bg-white/[0.06]"}`}>{ch}</span>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6">{children}</div>
      <div className="flex shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#1a1a2e] px-3 py-1">
        <span className="text-[11px] text-[#39ff14]/40">C:\&gt;</span>
        <span className="text-[11px] text-white/20">{time}</span>
      </div>
    </div>
  );
}

/* ─── Home ─── */

function HomeScreen({ nav, active }: { nav: (s: Screen) => void; active: Screen }) {
  const links: { id: Screen; label: string }[] = [
    { id: "home", label: "HOME" }, { id: "about", label: "ABOUT" }, { id: "projects", label: "PROJECTS" },
    { id: "skills", label: "SKILLS" }, { id: "experience", label: "EXPERIENCE" }, { id: "contact", label: "CONTACT" },
  ];
  return (
    <div className="flex h-full flex-col gap-4 md:flex-row md:gap-6">
      {/* Sidebar */}
      <div className="flex shrink-0 flex-row gap-2 overflow-x-auto md:w-44 md:flex-col md:justify-between md:overflow-visible">
        <div>
          <p className="mb-3 hidden text-xl text-[#39ff14] md:block">&gt;_</p>
          <nav className="flex gap-0.5 md:flex-col md:gap-1">
            {links.map(l => (
              <button key={l.id} onClick={() => nav(l.id)} className={`whitespace-nowrap px-2 py-1 text-left text-xs transition-colors md:px-0 ${active === l.id ? "text-[#39ff14]" : "text-white/20 hover:text-white/35"}`}>
                <span className="hidden md:inline">{active === l.id ? "> " : "  "}</span>{l.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Now-playing widget */}
        <div className="hidden border border-white/[0.06] bg-[#0a0a16] p-3 md:block">
          <p className="mb-1 text-[10px] uppercase tracking-wider text-white/20">Now Playing</p>
          <p className="text-xs text-white/50">Lo-fi Focus</p>
          <p className="text-[10px] text-white/25">Deep Work Mix</p>
          <div className="mt-2 flex items-end gap-[3px]">
            {[5, 9, 3, 11, 7, 13, 5, 9, 4, 10].map((h, i) => (
              <motion.div key={i} animate={{ height: [h, 2, h] }} transition={{ duration: 0.6 + i * 0.07, repeat: Infinity, repeatType: "mirror" }} className="w-[3px] bg-[#39ff14]/40" style={{ height: h }} />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-center gap-3 text-[10px] text-white/20">
            <span>◄◄</span><span>◄</span><span className="text-[#39ff14]/60">▶</span><span>►</span><span>►►</span>
          </div>
        </div>
      </div>

      {/* Main hero */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm text-[#00d4ff]">Hello!</p>
            <p className="mt-1 text-lg text-white/60">I&apos;m</p>
            <h1 className="text-5xl font-bold leading-[1.05] text-white md:text-7xl" style={{ textShadow: "0 0 40px rgba(0,212,255,0.15), 2px 2px 0 rgba(169,112,255,0.25)" }}>
              Priyanshu<br />Patel
            </h1>
            <p className="mt-4 text-[11px] tracking-[0.2em] text-[#ffd700]">BUSINESS ANALYST &bull; DATA DRIVEN &bull; PROBLEM SOLVER</p>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-white/35">
              I build efficient workflows and data-driven solutions with clean analysis and a lot of analytical thinking.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => nav("projects")} className="border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-5 py-2 text-xs text-[#00d4ff] transition hover:bg-[#00d4ff]/20">▶ VIEW MY WORK</button>
              <button onClick={() => nav("contact")} className="border border-white/10 px-5 py-2 text-xs text-white/35 transition hover:border-white/20 hover:text-white/55">&gt; LET&apos;S CONNECT</button>
            </div>
          </div>
          {/* Right info box */}
          <div className="hidden w-52 shrink-0 space-y-3 border border-white/[0.06] bg-[#0a0a16] p-4 lg:block">
            <p className="text-xs leading-relaxed text-white/35">Driving product decisions at Digit Life Insurance since 2025</p>
            <div className="border border-[#ffd700]/15 bg-[#ffd700]/[0.04] p-2">
              <p className="text-[10px] text-[#ffd700]/60">🏆 Tech Titan Award</p>
              <p className="text-[10px] text-white/25">Digit Life Insurance</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {["SQL", "APIs", "UAT", "Automation", "AI", "Agile"].map(t => (
                <span key={t} className="border border-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/20">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── About ─── */

function AboutScreen() {
  return (
    <div>
      <Cmd text="about me" />
      <div className="mt-5 flex flex-col gap-6 md:flex-row">
        <div className="shrink-0 space-y-4 md:w-56">
          {/* Retro terminal */}
          <div className="border border-white/[0.08] bg-[#0a0a16] p-3">
            <div className="border border-white/[0.06] bg-black p-3 text-xs">
              <p className="text-[#39ff14]">&gt;_ me.txt</p>
              <p className="mt-1 text-white/20">loading personality...</p>
              <p className="mt-1 text-[#00d4ff]">ready.</p>
              <p className="mt-2 text-white/10">───────────────</p>
              <p className="text-white/25">MBA + B.Tech</p>
              <p className="text-white/25">Business Analyst</p>
              <p className="text-white/25">Bengaluru, IN</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#39ff14]" />
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          </div>
          {/* Favorite things */}
          <div className="border border-white/[0.06] p-3">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-white/25">Favorite Things</p>
            <div className="grid grid-cols-2 gap-2">
              {["Data Analysis", "Process Design", "Automation", "Finance"].map(i => (
                <div key={i} className="border border-white/[0.06] bg-[#0a0a16] px-2 py-2 text-center text-[10px] text-white/30">{i}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white" style={{ textShadow: "0 0 20px rgba(255,107,157,0.15)" }}>Who am I?</h2>
          <div className="mt-4 space-y-3 text-xs leading-relaxed text-white/35">
            <p>I&apos;m a Business Analyst who bridges the gap between business needs and technical solutions. With an MBA in Finance and a B.Tech in Computer Science, I bring a unique blend of analytical and technical thinking to every project.</p>
            <p>Currently at Digit Life Insurance, I lead the SDLC for Group Life products, working with API integrations, SQL-based analysis, and UAT coordination for systems supporting lakhs of monthly transactions.</p>
            <p>When I&apos;m not optimising workflows, you&apos;ll find me exploring AI tools, building side projects, or diving into financial markets.</p>
          </div>
          <div className="mt-5 border border-white/[0.06] bg-[#0a0a16] p-3">
            <p className="mb-2 text-xs text-[#ff6b9d]">system.info</p>
            <div className="space-y-1 text-[11px]">
              {[
                ["OS", "Business Analyst v2.0"], ["CPU", "MBA Finance + B.Tech CSE"],
                ["RAM", "Multitasking enabled"], ["HDD", "4 projects loaded"],
                ["Mode", "Focused"], ["Location", "Bengaluru, India"],
              ].map(([k, v]) => (
                <p key={k} className="text-white/25">{k}: <span className="text-white/40">{v}</span></p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Projects ─── */

function ProjectsScreen() {
  const [filter, setFilter] = useState("ALL");
  const filters = ["ALL", "AI", "MOBILE", "AUTOMATION"];
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Cmd text="my projects" />
        <div className="flex gap-1">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`border px-3 py-1 text-[10px] transition ${filter === f ? "border-white/20 bg-white/[0.08] text-white" : "border-white/[0.06] text-white/25 hover:text-white/40"}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((pr, idx) => (
          <motion.div key={pr.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="group border border-white/[0.06] bg-[#0a0a16] transition hover:border-white/[0.12]">
            <div className="relative h-24 overflow-hidden" style={{ background: `linear-gradient(135deg, ${pr.color}08, ${pr.color}15)` }}>
              <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${pr.color}18 1px, transparent 1px)`, backgroundSize: "10px 10px" }} />
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(45deg, transparent 40%, ${pr.color}08 40%, ${pr.color}08 60%, transparent 60%)` }} />
              <div className="absolute left-3 top-3 text-lg font-bold" style={{ color: pr.color }}>{pr.id}</div>
              <div className="absolute bottom-3 left-3 text-sm font-bold text-white">{pr.title}</div>
            </div>
            <div className="p-3">
              <p className="text-[11px] leading-relaxed text-white/30">{pr.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1">
                  {pr.tags.map(t => <span key={t} className="border border-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/25">{t}</span>)}
                </div>
                <span className="text-[11px] text-white/20 transition group-hover:text-white/40">VIEW DEMO →</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Skills ─── */

function SkillsScreen() {
  return (
    <div>
      <Cmd text="skills &amp; tools" />
      <div className="mt-5 flex flex-col gap-6 lg:flex-row">
        {/* Skills bars */}
        <div className="flex-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#4ecdc4]">Skills</p>
          <div className="space-y-2.5">
            {skillBars.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-white/40">{s.name}</span>
                  <span className="text-white/20">{s.pct}%</span>
                </div>
                <div className="h-3 bg-white/[0.04]">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} className="h-full" style={{ backgroundImage: "repeating-linear-gradient(90deg, #4ecdc4 0 7px, transparent 7px 10px)" }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Tools grid */}
        <div className="lg:w-72">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#a855f7]">Tools I Use</p>
          <div className="grid grid-cols-4 gap-2">
            {toolsList.map((tool, i) => (
              <motion.div key={tool} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} className="flex flex-col items-center gap-1 border border-white/[0.06] bg-[#0a0a16] p-2">
                <div className="flex h-8 w-8 items-center justify-center bg-white/[0.04] text-sm text-white/40">{tool.slice(0, 2)}</div>
                <span className="text-[9px] text-white/25">{tool}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Currently learning */}
      <div className="mt-6 border border-white/[0.06] bg-[#0a0a16] p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#ffd700]">Currently Learning...</p>
        <div className="flex items-center gap-3">
          <Cmd text="learning.exe" />
          <div className="flex-1">
            <p className="text-[11px] text-white/30">AI/ML, Advanced Analytics, and building in public</p>
            <div className="mt-1 h-2 w-full bg-white/[0.04]">
              <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 1.2 }} className="h-full" style={{ backgroundImage: "repeating-linear-gradient(90deg, #ffd700 0 5px, transparent 5px 8px)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Experience ─── */

function ExperienceScreen() {
  return (
    <div>
      <Cmd text="experience" />
      {/* Work */}
      <p className="mb-3 mt-5 text-xs font-bold uppercase tracking-wider text-[#ffd700]">Work Experience</p>
      <div className="space-y-3">
        {jobs.map((j, i) => (
          <motion.div key={j.co} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="border border-white/[0.06] bg-[#0a0a16] p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-sm font-bold text-white">{j.role}</span>
                <span className="text-sm text-white/25"> — {j.co}</span>
              </div>
              <span className="text-[10px] text-white/20">{j.period} · {j.loc}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {j.bullets.map(b => <li key={b} className="text-[11px] leading-relaxed text-white/30">▸ {b}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>
      {/* Certifications */}
      <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-[#00d4ff]">Certifications</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {certs.map(c => (
          <div key={c} className="border border-white/[0.06] bg-[#0a0a16] px-3 py-2 text-[11px] text-white/35">▪ {c}</div>
        ))}
      </div>
      {/* Education */}
      <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-[#ff6b9d]">Education</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {edu.map(e => (
          <div key={e.deg} className="border border-white/[0.06] bg-[#0a0a16] p-3">
            <p className="text-xs font-bold text-white/50">{e.deg}</p>
            <p className="text-[10px] text-white/25">{e.school}</p>
            <p className="text-[10px] text-white/20">GPA: {e.gpa}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Contact ─── */

function ContactScreen() {
  return (
    <div>
      <Cmd text="contact me" />
      <h2 className="mt-4 text-3xl font-bold text-white" style={{ textShadow: "0 0 20px rgba(168,85,247,0.15)" }}>Let&apos;s connect!</h2>
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        {/* Social links */}
        <div className="space-y-4 md:w-56">
          {[
            { label: "EMAIL", value: "patelpriyanshu017@gmail.com", icon: "✉", href: "mailto:patelpriyanshu017@gmail.com" },
            { label: "LINKEDIN", value: "/in/priyanshu-patel", icon: "in", href: "https://www.linkedin.com/in/priyanshu-patel-069331200/" },
            { label: "GITHUB", value: "/zucc12309", icon: "⌘", href: "https://github.com/zucc12309" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 transition hover:opacity-80">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.08] bg-[#0a0a16] text-xs text-[#a855f7]">{s.icon}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">{s.label}</p>
                <p className="text-xs text-white/50 transition group-hover:text-[#a855f7]">{s.value}</p>
              </div>
            </a>
          ))}
          <div className="border-t border-white/[0.06] pt-3">
            <p className="text-[10px] text-white/15">📍 Based in Bengaluru, India</p>
            <p className="text-[10px] text-white/15">Available for opportunities</p>
          </div>
        </div>
        {/* Contact form */}
        <div className="flex-1 border border-white/[0.06] bg-[#0a0a16] p-4">
          <p className="mb-4 text-center text-xs text-white/40">SEND A MESSAGE  :)</p>
          <div className="space-y-3">
            <input type="text" placeholder="NAME" className="w-full border border-white/[0.08] bg-[#0f0f23] px-3 py-2 text-xs text-white/60 placeholder:text-white/15 outline-none focus:border-[#a855f7]/40" />
            <input type="email" placeholder="EMAIL" className="w-full border border-white/[0.08] bg-[#0f0f23] px-3 py-2 text-xs text-white/60 placeholder:text-white/15 outline-none focus:border-[#a855f7]/40" />
            <textarea placeholder="MESSAGE" rows={4} className="w-full resize-none border border-white/[0.08] bg-[#0f0f23] px-3 py-2 text-xs text-white/60 placeholder:text-white/15 outline-none focus:border-[#a855f7]/40" />
            <button className="w-full border border-[#a855f7]/30 bg-[#a855f7]/10 py-2 text-xs text-[#a855f7] transition hover:bg-[#a855f7]/20">▶ SEND MESSAGE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Taskbar ─── */

function Taskbar({ screen, nav, time }: { screen: Screen; nav: (s: Screen) => void; time: string }) {
  const tabs: { id: Screen; label: string }[] = [
    { id: "about", label: "about.exe" }, { id: "projects", label: "projects.exe" },
    { id: "skills", label: "skills.exe" }, { id: "experience", label: "experience.exe" }, { id: "contact", label: "contact.exe" },
  ];
  return (
    <div className="flex items-center gap-1 border-t border-white/[0.1] bg-[#1a1a2e] px-2 py-1.5">
      <button onClick={() => nav("home")} className={`flex items-center gap-2 border px-3 py-1 text-xs transition ${screen === "home" ? "border-white/15 bg-white/[0.08] text-white" : "border-white/[0.08] bg-[#0f0f23] text-white/50 hover:bg-white/[0.04]"}`}>
        <span className="grid grid-cols-2 gap-[2px]">
          <span className="block h-[5px] w-[5px] bg-[#ff6b9d]" /><span className="block h-[5px] w-[5px] bg-[#39ff14]" />
          <span className="block h-[5px] w-[5px] bg-[#00d4ff]" /><span className="block h-[5px] w-[5px] bg-[#ffd700]" />
        </span>
        Start
      </button>
      <div className="flex flex-1 gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => nav(t.id)} className={`hidden border px-3 py-1 text-[11px] transition sm:block ${screen === t.id ? "border-white/15 bg-white/[0.08] text-white" : "border-white/[0.06] bg-[#0f0f23] text-white/25 hover:text-white/40"}`}>{t.label}</button>
        ))}
      </div>
      <div className="border border-white/[0.06] bg-[#0f0f23] px-3 py-1 text-[11px] text-white/30">{time}</div>
    </div>
  );
}

/* ─── Helpers ─── */

function Cmd({ text }: { text: string }) {
  return <p className="text-sm"><span className="text-white/20">C:\&gt;</span> <span className="text-[#39ff14]" dangerouslySetInnerHTML={{ __html: text }} /></p>;
}
