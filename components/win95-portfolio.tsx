"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Screen = "home" | "about" | "projects" | "skills" | "experience" | "contact";

/* ═══ DATA (all from existing portfolio) ═══════════════ */

const projects = [
  { id: "01", title: "MEMORY ROUTER", status: "Local-first AI infrastructure", desc: "Local-first intelligent model routing system with structured memory, semantic retrieval, context optimization, adaptive provider routing, and MCP integration.", tags: ["Python", "SQLite", "MCP", "AI"], color: "#00d4ff", repo: "https://github.com/zucc12309/memory-router" },
  { id: "02", title: "RIDECOMPARE", status: "Functional MVP", desc: "Mobile product that compares ride fares across multiple providers and helps users choose the best route, price, and booking option.", tags: ["Flutter", "Node.js", "PostgreSQL", "Maps"], color: "#ff6b9d", repo: undefined },
  { id: "03", title: "AI LIFEADMIN OS", status: "Personal AI operations system", desc: "Personal AI operating system to manage tasks, subscriptions, documents, reminders, payments, and life administration through intelligent agents.", tags: ["React", "Node.js", "Redis", "LLM"], color: "#39ff14", repo: undefined },
  { id: "04", title: "CRM WORKFLOW", status: "CRM analytics automation", desc: "Workflow automation system focused on streamlining CRM operations, routing work, improving reporting, and reducing manual effort.", tags: ["n8n", "Python", "Power BI"], color: "#ffd700", repo: "https://github.com/zucc12309/CRM-workflow-automation" },
];

const skillCategories = [
  { title: "Business Analysis", color: "#00d4ff", skills: ["Requirements Gathering", "BRD/SRS", "GAP Analysis", "Stakeholder Management", "User Stories", "SDLC"] },
  { title: "Agile & Delivery", color: "#39ff14", skills: ["Sprint Planning", "Backlog Grooming", "Scrum", "UAT", "Test Cases", "RCA"] },
  { title: "Technical", color: "#ff6b9d", skills: ["SQL", "Python", "API & System Integration", "Data Analysis", "PostgreSQL", "Database Concepts"] },
  { title: "Tools", color: "#ffd700", skills: ["Jira", "Confluence", "Postman", "Camunda", "DBeaver", "Figma", "Excel", "n8n"] },
];

const skillBars = [
  { name: "Requirements & BRD", pct: 92 }, { name: "SQL & Data Analysis", pct: 88 },
  { name: "API Integration", pct: 85 }, { name: "UAT & Test Cases", pct: 90 },
  { name: "Agile / Scrum", pct: 87 }, { name: "Stakeholder Mgmt", pct: 85 },
  { name: "Workflow Automation", pct: 80 }, { name: "Process Improvement", pct: 82 },
  { name: "Problem Solving", pct: 92 },
];

const toolsList = [
  { name: "Jira", abbr: "Ji" }, { name: "Postman", abbr: "Pm" }, { name: "SQL Server", abbr: "SQ" }, { name: "Power BI", abbr: "PB" },
  { name: "Python", abbr: "Py" }, { name: "Figma", abbr: "Fi" }, { name: "n8n", abbr: "n8" }, { name: "Git", abbr: "Gt" },
  { name: "Excel", abbr: "Ex" }, { name: "Confluence", abbr: "Co" }, { name: "DBeaver", abbr: "DB" }, { name: "Camunda", abbr: "Ca" },
];

const jobs = [
  {
    role: "Business Analyst", co: "Digit Life Insurance", period: "Jun 2025 – Present", loc: "Bengaluru",
    bullets: [
      "Led end-to-end SDLC for Group Life products — 1,500+ Cr premium portfolio, 2L+ monthly transactions",
      "Collaborated with 10-12 cross-functional stakeholders across sprint planning and release cycles",
      "Analysed high-volume transaction data using SQL to identify inefficiencies, edge cases, and failure patterns",
      "Designed scalable solutions through GAP analysis — API integrations, API contracts, database schemas, and UI workflows",
      "Authored BRDs, SRS, and user stories ensuring clear requirement translation across modules",
      "Automated workflows by implementing 10+ business rules, improving accuracy by 18% and reducing manual effort by 30%",
      "Led UAT with 80+ test cases, reducing post-release defects by 40%",
      "Performed RCA using API logs and database analysis, collaborating with engineering and cloud/infra teams",
    ],
    award: "Tech Titan Award",
  },
  {
    role: "Finance & Accounting Intern", co: "Bharat Heavy Electricals Ltd", period: "May – Aug 2024", loc: "Bhopal",
    bullets: [
      "Worked in Oracle ERP across Billing and Accounts operations",
      "Executed end-to-end invoice processing, verification, tracking, and reconciliation",
      "Built dynamic Excel-based MIS dashboards, improving reporting accuracy by ~15%",
    ],
  },
  {
    role: "Deep Learning Intern", co: "MANIT Bhopal", period: "May – Jul 2023", loc: "Bhopal",
    bullets: [
      "Built a CNN-based cancer diagnosis system in Python using classification ML techniques",
      "Executed data preprocessing, model training, and performance evaluation",
      "Achieved approximately 89% diagnostic accuracy on a real-world dataset",
    ],
  },
];

const certs = [
  "NISM Series VIII: Equity Derivatives (Valid till Sep 2027)",
  "NISM Series XV: Research Analyst (Valid till Oct 2027)",
  "Financial Modelling & Valuation Analyst (FMVA)",
  "Business Analysis Foundations: Business Process Modelling",
];

const education = [
  { deg: "MBA/PGDM — Finance", school: "MPSTME, Mumbai", gpa: "3.56/4.00", year: "2025" },
  { deg: "B.Tech — CSE", school: "MPSTME, Mumbai", gpa: "3.56/4.00", year: "2025" },
  { deg: "12th CBSE — PCM", school: "", gpa: "85.4%", year: "2020" },
];

const screenMeta: Record<Screen, { title: string; color: string }> = {
  home: { title: "portfolio.exe", color: "#00d4ff" },
  about: { title: "about.exe", color: "#ff6b9d" },
  projects: { title: "projects.exe", color: "#39ff14" },
  skills: { title: "skills.exe", color: "#4ecdc4" },
  experience: { title: "experience.exe", color: "#ffd700" },
  contact: { title: "contact.exe", color: "#a855f7" },
};

/* ═══ MAIN ═════════════════════════════════════════════ */

export function Win95Portfolio() {
  const [screen, setScreen] = useState<Screen>("home");
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState("--:--");

  useEffect(() => { const t = setTimeout(() => setBooted(true), 2800); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick(); const id = setInterval(tick, 30_000); return () => clearInterval(id);
  }, []);

  if (!booted) return <BootScreen />;

  const m = screenMeta[screen];
  return (
    <div className="flex h-[100dvh] flex-col bg-[#080812] font-mono selection:bg-[#39ff14]/20">
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] opacity-30" />
      {/* Grid */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:28px_28px]" />
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(169,112,255,0.07),transparent_50%),radial-gradient(ellipse_at_85%_85%,rgba(0,212,255,0.05),transparent_50%),radial-gradient(ellipse_at_50%_50%,rgba(57,255,20,0.02),transparent_60%)]" />

      {/* Window */}
      <div className="relative flex-1 overflow-hidden p-1.5 pb-0 sm:p-2.5 sm:pb-0">
        <AnimatePresence mode="wait">
          <motion.div key={screen} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }} className="flex h-full flex-col">
            <WinFrame title={m.title} color={m.color} time={time}>
              {screen === "home" && <HomeScreen nav={setScreen} active={screen} />}
              {screen === "about" && <AboutScreen />}
              {screen === "projects" && <ProjectsScreen />}
              {screen === "skills" && <SkillsScreen />}
              {screen === "experience" && <ExperienceScreen />}
              {screen === "contact" && <ContactScreen />}
            </WinFrame>
          </motion.div>
        </AnimatePresence>
      </div>

      <Taskbar screen={screen} nav={setScreen} time={time} />
    </div>
  );
}

/* ═══ BOOT ═════════════════════════════════════════════ */

function BootScreen() {
  const [p, setP] = useState(0);
  useEffect(() => { const id = setInterval(() => setP(v => Math.min(v + 4, 100)), 75); return () => clearInterval(id); }, []);
  const lines = [
    "BIOS v3.1.0 — Priyanshu Patel Portfolio System",
    "Memory test... 4096 MB OK",
    "Loading portfolio.exe...",
    "Mounting projects... 4 found",
    "Initializing AI subsystems... OK",
    "Loading career modules... Business Analyst at Digit Life Insurance",
  ];
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-[#080812] font-mono">
      <div className="w-full max-w-xl space-y-1.5 px-6 text-sm text-[#39ff14]">
        {lines.filter((_, i) => p > i * 13).map(l => <p key={l}>{l}</p>)}
        <div className="mt-6 h-5 border border-[#39ff14]/30 p-[2px]">
          <div style={{ width: `${p}%`, backgroundImage: "repeating-linear-gradient(90deg,#39ff14 0 7px,transparent 7px 10px)" }} className="h-full transition-[width] duration-75" />
        </div>
        <p className="text-xs text-[#39ff14]/40">{p}% loaded</p>
      </div>
    </div>
  );
}

/* ═══ WINDOW FRAME ═════════════════════════════════════ */

function WinFrame({ title, color, time, children }: { title: string; color: string; time: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden border border-white/[0.07]" style={{ borderTopColor: color, borderTopWidth: 3, background: "linear-gradient(180deg, #0e0e1f 0%, #0a0a18 100%)" }}>
      {/* Title bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-3 py-1.5" style={{ background: "linear-gradient(90deg, #12122a, #1a1a35 50%, #12122a)" }}>
        <span className="text-xs text-white/60">{title}</span>
        <div className="flex gap-[3px]">
          <span className="flex h-[16px] w-[20px] items-center justify-center border border-white/[0.12] bg-white/[0.03] text-[9px] leading-none text-white/25 hover:bg-white/[0.08]">─</span>
          <span className="flex h-[16px] w-[20px] items-center justify-center border border-white/[0.12] bg-white/[0.03] text-[9px] leading-none text-white/25 hover:bg-white/[0.08]">□</span>
          <span className="flex h-[16px] w-[20px] items-center justify-center border border-white/[0.12] bg-white/[0.03] text-[9px] leading-none text-white/25 hover:bg-red-500/50 hover:text-white">×</span>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">{children}</div>
      {/* Status bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/[0.06] px-3 py-1" style={{ background: "linear-gradient(90deg, #12122a, #1a1a35 50%, #12122a)" }}>
        <span className="text-[11px] text-[#39ff14]/40">C:\&gt;</span>
        <span className="text-[11px] text-white/20">{time}</span>
      </div>
    </div>
  );
}

/* ═══ HOME ═════════════════════════════════════════════ */

function HomeScreen({ nav, active }: { nav: (s: Screen) => void; active: Screen }) {
  const links: { id: Screen; label: string }[] = [
    { id: "home", label: "HOME" }, { id: "about", label: "ABOUT" }, { id: "projects", label: "PROJECTS" },
    { id: "skills", label: "SKILLS" }, { id: "experience", label: "EXPERIENCE" }, { id: "contact", label: "CONTACT" },
  ];
  return (
    <div className="flex h-full flex-col gap-4 md:flex-row md:gap-8">
      {/* Sidebar */}
      <div className="flex shrink-0 flex-row gap-1 overflow-x-auto md:w-44 md:flex-col md:justify-between md:overflow-visible">
        <div>
          <p className="mb-4 hidden text-xl text-[#39ff14] md:block">&gt;_</p>
          <nav className="flex gap-0.5 md:flex-col md:gap-1.5">
            {links.map(l => (
              <button key={l.id} onClick={() => nav(l.id)} className={`whitespace-nowrap px-2 py-1 text-left text-xs transition-colors md:px-0 md:py-1.5 ${active === l.id ? "text-[#39ff14]" : "text-white/20 hover:text-white/40"}`}>
                <span className="hidden md:inline">{active === l.id ? "> " : "  "}</span>{l.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Now playing widget */}
        <div className="hidden border border-white/[0.06] bg-black/30 p-3 md:block">
          <p className="mb-1.5 text-[9px] uppercase tracking-widest text-white/20">Now Playing</p>
          <p className="text-[11px] text-white/45">Lo-fi Focus</p>
          <p className="text-[10px] text-white/20">Deep Work Mix</p>
          <div className="mt-2.5 flex items-end gap-[3px]">
            {[5, 9, 3, 11, 7, 14, 5, 9, 4, 10, 6, 12].map((h, i) => (
              <motion.div key={i} animate={{ height: [h, 2, h] }} transition={{ duration: 0.5 + i * 0.06, repeat: Infinity, repeatType: "mirror" }} className="w-[3px] bg-[#39ff14]/40" style={{ height: h }} />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-center gap-3 text-[10px] text-white/15">
            <span>◄◄</span><span>◄</span><span className="text-sm text-[#39ff14]/50">▶</span><span>►</span><span>►►</span>
          </div>
        </div>
      </div>

      {/* Main hero */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm text-[#00d4ff]">Hello!</p>
            <p className="mt-1 text-lg text-white/60">I&apos;m</p>
            <h1 className="text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl" style={{ textShadow: "0 0 50px rgba(0,212,255,0.12), 3px 3px 0 rgba(169,112,255,0.3)" }}>
              Priyanshu<br />Patel
            </h1>
            <p className="mt-4 text-[11px] tracking-[0.2em] text-[#ffd700]">BUSINESS ANALYST &bull; DATA DRIVEN &bull; PROBLEM SOLVER</p>
            <p className="mt-4 text-xs leading-relaxed text-white/35">
              Product &amp; data-focused Business Analyst experienced in building and optimising API-driven systems and workflows. Currently at Digit Life Insurance, leading end-to-end SDLC for Group Life products supporting a 1,500+ Cr premium portfolio and 2L+ monthly transactions.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => nav("projects")} className="border border-[#00d4ff]/30 bg-[#00d4ff]/[0.08] px-5 py-2 text-xs text-[#00d4ff] transition hover:bg-[#00d4ff]/[0.15]">▶ VIEW MY WORK</button>
              <button onClick={() => nav("contact")} className="border border-white/10 px-5 py-2 text-xs text-white/30 transition hover:border-white/20 hover:text-white/50">&gt; LET&apos;S CONNECT</button>
            </div>
          </div>
          {/* Right info box */}
          <div className="hidden w-56 shrink-0 space-y-3 border border-white/[0.06] bg-black/30 p-4 lg:block">
            <p className="text-[10px] uppercase tracking-wider text-[#39ff14]/60">Quick Stats</p>
            <div className="grid grid-cols-2 gap-2">
              {[["Premium Systems", "1,500+ Cr"], ["Monthly Txns", "2L+"], ["Projects Shipped", "4"], ["Recognition", "Tech Titan"]].map(([l, v]) => (
                <div key={l} className="border border-white/[0.06] bg-black/40 p-2">
                  <p className="text-[9px] text-white/25">{l}</p>
                  <p className="mt-0.5 text-[11px] font-bold text-[#39ff14]/70">{v}</p>
                </div>
              ))}
            </div>
            <div className="border border-[#ffd700]/15 bg-[#ffd700]/[0.04] p-2">
              <p className="text-[10px] text-[#ffd700]/60">🏆 Tech Titan Award</p>
              <p className="text-[9px] text-white/25">Digit Life Insurance</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {["SQL", "APIs", "UAT", "Automation", "AI", "Agile"].map(t => (
                <span key={t} className="border border-white/[0.05] px-1.5 py-0.5 text-[8px] text-white/20">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ ABOUT ════════════════════════════════════════════ */

function AboutScreen() {
  return (
    <div>
      <Cmd text="about me" />
      <div className="mt-5 flex flex-col gap-6 md:flex-row">
        <div className="shrink-0 space-y-4 md:w-60">
          {/* Retro terminal */}
          <div className="border border-white/[0.07] bg-black/40 p-3">
            <div className="border border-white/[0.05] bg-black p-3 text-xs">
              <p className="text-[#39ff14]">&gt;_ me.txt</p>
              <p className="mt-1 text-white/20">loading personality...</p>
              <p className="mt-1 text-[#00d4ff]">ready.</p>
              <p className="mt-2 text-white/[0.08]">───────────────────</p>
              <p className="text-white/30">MBA Finance + B.Tech CSE</p>
              <p className="text-white/30">Business Analyst</p>
              <p className="text-white/30">Digit Life Insurance</p>
              <p className="text-white/30">Bengaluru, India</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#39ff14]" />
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          </div>
          {/* Favorite things */}
          <div className="border border-white/[0.06] p-3">
            <p className="mb-2.5 text-[10px] uppercase tracking-widest text-white/25">Favorite Things</p>
            <div className="grid grid-cols-2 gap-2">
              {["Data Analysis", "Process Design", "Automation", "Finance", "AI Tools", "Side Projects"].map(i => (
                <div key={i} className="border border-white/[0.06] bg-black/40 px-2 py-2 text-center text-[10px] text-white/30">{i}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white" style={{ textShadow: "0 0 25px rgba(255,107,157,0.15)" }}>Who am I?</h2>
          <div className="mt-4 space-y-3 text-xs leading-relaxed text-white/40">
            <p>Product &amp; data-focused Business Analyst experienced in building and optimising API-driven systems and workflows. I translate business requirements into technical solutions, perform SQL-driven analysis, and deliver automation and system improvements that enhance efficiency and reduce errors.</p>
            <p>Strong in system design, data analysis, and cross-functional execution across product, engineering, and operations teams. Proficient in PostgreSQL, Python, and workflow automation.</p>
            <p>When I&apos;m not optimising workflows, you&apos;ll find me exploring AI tools, building side projects that solve real problems, or diving into financial markets.</p>
          </div>
          {/* System info */}
          <div className="mt-5 border border-white/[0.06] bg-black/30 p-4">
            <p className="mb-3 text-xs text-[#ff6b9d]">system.info</p>
            <div className="grid gap-x-6 gap-y-1.5 text-[11px] sm:grid-cols-2">
              {[
                ["OS", "Business Analyst v2.0"],
                ["CPU", "MBA Finance + B.Tech CSE"],
                ["RAM", "MPSTME, Mumbai · 2025"],
                ["HDD", "4 projects loaded"],
                ["Mode", "Focused"],
                ["Award", "Tech Titan — Digit Life Insurance"],
                ["Location", "Bengaluru, India"],
                ["C:/ Drive", "Open to opportunities"],
              ].map(([k, v]) => (
                <p key={k} className="text-white/25">{k}: <span className="text-white/45">{v}</span></p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ PROJECTS ═════════════════════════════════════════ */

function ProjectsScreen() {
  const [filter, setFilter] = useState("ALL");
  const filters = ["ALL", "AI", "MOBILE", "AUTOMATION"];
  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Cmd text="my projects" />
        <div className="flex gap-1">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`border px-3 py-1 text-[10px] tracking-wider transition ${filter === f ? "border-[#39ff14]/30 bg-[#39ff14]/[0.08] text-[#39ff14]" : "border-white/[0.06] text-white/20 hover:text-white/35"}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((pr, idx) => (
          <motion.div key={pr.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }} className="group border border-white/[0.06] bg-black/30 transition hover:border-white/[0.12]">
            {/* Colored header area */}
            <div className="relative h-28 overflow-hidden" style={{ background: `linear-gradient(135deg, ${pr.color}06, ${pr.color}12)` }}>
              <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${pr.color}15 1px, transparent 1px)`, backgroundSize: "8px 8px" }} />
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(45deg, transparent 35%, ${pr.color}06 35%, ${pr.color}06 65%, transparent 65%)` }} />
              <div className="absolute left-3 top-3 text-xl font-bold" style={{ color: pr.color, textShadow: `0 0 15px ${pr.color}40` }}>{pr.id}</div>
              <div className="absolute bottom-3 left-3 text-sm font-bold tracking-wider text-white">{pr.title}</div>
            </div>
            {/* Content */}
            <div className="p-3">
              <p className="text-[10px] text-[#ffd700]/60">{pr.status}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/30">{pr.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {pr.tags.map(t => <span key={t} className="border border-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/20">{t}</span>)}
                </div>
                <span className="text-[11px] text-white/15 transition group-hover:text-white/40">VIEW DEMO →</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* What projects demonstrate */}
      <div className="mt-4 border border-white/[0.06] bg-black/30 p-3">
        <p className="mb-2 text-[10px] text-[#ffd700]/50">▸ What these projects demonstrate</p>
        <div className="flex flex-wrap gap-1.5">
          {["Product Thinking", "API & Integration", "AI Integration", "End-to-End Ownership", "Privacy-First", "User Empathy"].map(s => (
            <span key={s} className="border border-white/[0.05] bg-black/40 px-2 py-1 text-[9px] uppercase text-white/25">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ SKILLS ═══════════════════════════════════════════ */

function SkillsScreen() {
  return (
    <div>
      <Cmd text="skills &amp; tools" />
      <div className="mt-5 flex flex-col gap-6 lg:flex-row">
        {/* Skill bars */}
        <div className="flex-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4ecdc4]">Skills</p>
          <div className="space-y-2">
            {skillBars.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="mb-0.5 flex items-center justify-between text-[11px]">
                  <span className="text-white/35">{s.name}</span>
                </div>
                <div className="h-[10px] bg-white/[0.03]">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.5, delay: i * 0.05 }} className="h-full" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${i % 2 === 0 ? "#4ecdc4" : "#00d4ff"} 0 6px, transparent 6px 9px)` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Tools grid */}
        <div className="lg:w-[280px]">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#a855f7]">Tools I Use</p>
          <div className="grid grid-cols-4 gap-2">
            {toolsList.map((tool, i) => (
              <motion.div key={tool.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className="flex flex-col items-center gap-1 border border-white/[0.06] bg-black/40 p-2 transition hover:border-white/[0.12]">
                <div className="flex h-8 w-8 items-center justify-center bg-white/[0.04] text-[11px] font-bold text-white/35">{tool.abbr}</div>
                <span className="text-[8px] text-white/20">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Skill categories */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {skillCategories.map(cat => (
          <div key={cat.title} className="border border-white/[0.06] bg-black/30 p-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: cat.color }}>{cat.title}</p>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map(s => <span key={s} className="border border-white/[0.05] bg-black/40 px-2 py-1 text-[10px] text-white/35">{s}</span>)}
            </div>
          </div>
        ))}
      </div>
      {/* Certifications */}
      <div className="mt-4 border border-white/[0.06] bg-black/30 p-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#ffd700]">Certifications</p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {certs.map(c => <div key={c} className="border border-white/[0.05] bg-black/40 px-2 py-1.5 text-[10px] text-white/35">▪ {c}</div>)}
        </div>
      </div>
      {/* Currently learning */}
      <div className="mt-4 border border-white/[0.06] bg-black/30 p-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#ff6b9d]">Currently Learning...</p>
        <div className="flex items-center gap-3">
          <Cmd text="learning.exe" />
          <div className="flex-1">
            <p className="text-[11px] text-white/30">Agentic AI systems, product analytics, and AI-native product design</p>
            <div className="mt-1 h-2.5 bg-white/[0.03]">
              <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1 }} className="h-full" style={{ backgroundImage: "repeating-linear-gradient(90deg, #ff6b9d 0 5px, transparent 5px 8px)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ EXPERIENCE ═══════════════════════════════════════ */

function ExperienceScreen() {
  return (
    <div>
      <Cmd text="experience" />
      <h2 className="mt-3 text-2xl font-bold text-white" style={{ textShadow: "0 0 20px rgba(255,215,0,0.1)" }}>Work Experience</h2>
      <p className="mt-1 text-[11px] text-white/25">Full-time role and internships.</p>
      <div className="mt-4 space-y-3">
        {jobs.map((j, i) => (
          <motion.div key={j.co} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="border border-white/[0.06] bg-black/30 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="text-sm font-bold text-white">{j.role}</span>
                <span className="text-sm text-white/20"> — {j.co}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/20">{j.period} · {j.loc}</span>
                {j.award && <span className="border border-[#ffd700]/20 bg-[#ffd700]/[0.05] px-1.5 py-0.5 text-[9px] text-[#ffd700]/60">🏆 {j.award}</span>}
              </div>
            </div>
            <ul className="mt-2.5 space-y-1">
              {j.bullets.map(b => <li key={b} className="text-[11px] leading-relaxed text-white/30">▸ {b}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Education */}
      <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-[#ff6b9d]">Education</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {education.map(e => (
          <div key={e.deg} className="border border-white/[0.06] bg-black/30 p-3">
            <p className="text-[11px] font-bold text-white/50">{e.deg}</p>
            <p className="text-[10px] text-white/25">{e.school}{e.school ? " · " : ""}{e.year}</p>
            <p className="text-[10px] text-[#39ff14]/50">{e.gpa}</p>
          </div>
        ))}
      </div>

      {/* Achievement */}
      <div className="mt-4 border border-[#ffd700]/10 bg-[#ffd700]/[0.03] p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]/50">Achievement</p>
        <p className="mt-1 text-[11px] text-white/35">Finalist — EY Young Leader&apos;s Business Case Study Competition 2024</p>
      </div>
    </div>
  );
}

/* ═══ CONTACT ══════════════════════════════════════════ */

function ContactScreen() {
  return (
    <div>
      <Cmd text="contact me" />
      <h2 className="mt-3 text-3xl font-bold text-white" style={{ textShadow: "0 0 25px rgba(168,85,247,0.12)" }}>Let&apos;s connect!</h2>
      <p className="mt-2 text-xs text-white/25">I am always open to discussing interesting opportunities in business analysis, product, and technology.</p>
      <div className="mt-5 flex flex-col gap-6 md:flex-row">
        {/* Social links */}
        <div className="space-y-4 md:w-64">
          {[
            { label: "EMAIL", value: "itsmepriyanshu36@gmail.com", icon: "✉", href: "mailto:itsmepriyanshu36@gmail.com" },
            { label: "LINKEDIN", value: "/in/priyanshu-patel", icon: "in", href: "https://www.linkedin.com/in/priyanshu-patel-069331200/" },
            { label: "GITHUB", value: "/zucc12309", icon: "⌘", href: "https://github.com/zucc12309" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 transition hover:opacity-80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.08] bg-black/40 text-sm text-[#a855f7]">{s.icon}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">{s.label}</p>
                <p className="text-[11px] text-white/45 transition group-hover:text-[#a855f7]">{s.value}</p>
              </div>
            </a>
          ))}
          <div className="border-t border-white/[0.06] pt-3">
            <p className="text-[10px] text-white/15">📍 Based in Bengaluru, India</p>
            <p className="text-[10px] text-white/15">Available worldwide</p>
          </div>
        </div>
        {/* Contact form */}
        <div className="flex-1 border border-white/[0.06] bg-black/30 p-4">
          <p className="mb-4 text-center text-xs text-white/35">SEND A MESSAGE  :)</p>
          <div className="space-y-3">
            <input type="text" placeholder="NAME" className="w-full border border-white/[0.07] bg-[#0a0a18] px-3 py-2.5 text-xs text-white/50 placeholder:text-white/12 outline-none focus:border-[#a855f7]/30" />
            <input type="email" placeholder="EMAIL" className="w-full border border-white/[0.07] bg-[#0a0a18] px-3 py-2.5 text-xs text-white/50 placeholder:text-white/12 outline-none focus:border-[#a855f7]/30" />
            <textarea placeholder="MESSAGE" rows={4} className="w-full resize-none border border-white/[0.07] bg-[#0a0a18] px-3 py-2.5 text-xs text-white/50 placeholder:text-white/12 outline-none focus:border-[#a855f7]/30" />
            <button className="w-full border border-[#a855f7]/25 bg-[#a855f7]/[0.08] py-2.5 text-xs tracking-wider text-[#a855f7] transition hover:bg-[#a855f7]/[0.15]">▶ SEND MESSAGE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ TASKBAR ══════════════════════════════════════════ */

function Taskbar({ screen, nav, time }: { screen: Screen; nav: (s: Screen) => void; time: string }) {
  const tabs: { id: Screen; label: string }[] = [
    { id: "about", label: "about.exe" }, { id: "projects", label: "projects.exe" },
    { id: "skills", label: "skills.exe" }, { id: "experience", label: "experience.exe" }, { id: "contact", label: "contact.exe" },
  ];
  return (
    <div className="flex items-center gap-1 border-t border-white/[0.08] px-2 py-1.5" style={{ background: "linear-gradient(180deg, #1a1a35, #0e0e1f)" }}>
      {/* Start button */}
      <button onClick={() => nav("home")} className={`flex items-center gap-2 border px-3 py-1 text-xs transition ${screen === "home" ? "border-[#39ff14]/20 bg-[#39ff14]/[0.08] text-[#39ff14]" : "border-white/[0.08] bg-black/30 text-white/45 hover:bg-white/[0.04]"}`}>
        <span className="grid grid-cols-2 gap-[2px]">
          <span className="block h-[5px] w-[5px] bg-[#ff6b9d]" /><span className="block h-[5px] w-[5px] bg-[#39ff14]" />
          <span className="block h-[5px] w-[5px] bg-[#00d4ff]" /><span className="block h-[5px] w-[5px] bg-[#ffd700]" />
        </span>
        Start
      </button>
      {/* Tabs */}
      <div className="flex flex-1 gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => nav(t.id)} className={`border px-2.5 py-1 text-[10px] transition sm:px-3 ${screen === t.id ? "border-white/[0.12] bg-white/[0.07] text-white" : "border-white/[0.05] bg-black/30 text-white/20 hover:text-white/35"}`}>{t.label}</button>
        ))}
      </div>
      {/* Clock */}
      <div className="border border-white/[0.06] bg-black/30 px-3 py-1 text-[11px] text-white/25">{time}</div>
    </div>
  );
}

/* ═══ HELPERS ══════════════════════════════════════════ */

function Cmd({ text }: { text: string }) {
  return <p className="text-sm"><span className="text-white/20">C:\&gt;</span> <span className="text-[#39ff14]" dangerouslySetInnerHTML={{ __html: text }} /></p>;
}
