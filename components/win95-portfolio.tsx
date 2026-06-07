"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Linkedin, Github, Figma, Database, BarChart3,
  Code2, GitBranch, FileSpreadsheet, MessageSquare, Workflow,
  Terminal, PenTool, Send, Pause, Play,
  SkipBack, SkipForward, Volume2, VolumeX,
} from "lucide-react";

type Screen = "home" | "about" | "projects" | "skills" | "experience" | "contact";

/* ═══ DATA ════════════════════════════════════════════════ */

const projects = [
  { id: "01", title: "MEMORY ROUTER", desc: "Local-first intelligent model routing system with structured memory, semantic retrieval, and MCP integration.", tags: ["Python", "SQLite", "MCP", "AI"], color: "#ff6b9d", repo: "https://github.com/zucc12309/memory-router" },
  { id: "02", title: "RIDECOMPARE", desc: "Mobile product that compares ride fares across multiple providers and helps users choose the best option.", tags: ["Flutter", "Node.js", "PostgreSQL"], color: "#39ff14", repo: undefined },
  { id: "03", title: "AI LIFEADMIN OS", desc: "Personal AI operating system to manage tasks, subscriptions, documents, and life administration.", tags: ["React", "Node.js", "Redis", "LLM"], color: "#00d4ff", repo: undefined },
  { id: "04", title: "CRM WORKFLOW", desc: "Workflow automation system focused on streamlining CRM operations, routing work, and reducing manual effort.", tags: ["n8n", "Python", "Power BI"], color: "#ffd700", repo: "https://github.com/zucc12309/CRM-workflow-automation" },
];

const skillBars = [
  { name: "Requirements & BRD", pct: 92 }, { name: "SQL & Data Analysis", pct: 88 },
  { name: "API Integration", pct: 85 }, { name: "UAT & Test Cases", pct: 90 },
  { name: "Agile / Scrum", pct: 87 }, { name: "Stakeholder Mgmt", pct: 85 },
  { name: "Workflow Automation", pct: 80 }, { name: "Process Improvement", pct: 82 },
  { name: "Problem Solving", pct: 92 },
];

const tools = [
  { name: "Jira", icon: BarChart3, color: "#0052CC" },
  { name: "Postman", icon: Send, color: "#FF6C37" },
  { name: "SQL Server", icon: Database, color: "#CC2927" },
  { name: "Power BI", icon: BarChart3, color: "#F2C811" },
  { name: "Python", icon: Terminal, color: "#3776AB" },
  { name: "Figma", icon: Figma, color: "#F24E1E" },
  { name: "n8n", icon: Workflow, color: "#EA4B71" },
  { name: "Git", icon: GitBranch, color: "#F05032" },
  { name: "VS Code", icon: Code2, color: "#007ACC" },
  { name: "Excel", icon: FileSpreadsheet, color: "#217346" },
  { name: "DBeaver", icon: Database, color: "#382923" },
  { name: "Confluence", icon: MessageSquare, color: "#172B4D" },
];

const jobs = [
  {
    role: "Business Analyst", co: "Digit Life Insurance", period: "Jun 2025 – Present", loc: "Bengaluru",
    bullets: [
      "Led end-to-end SDLC for Group Life products — 1,500+ Cr premium portfolio, 2L+ monthly transactions",
      "Collaborated with 10-12 cross-functional stakeholders across sprint planning and release cycles",
      "Analysed high-volume transaction data using SQL to identify inefficiencies and failure patterns",
      "Designed scalable solutions through GAP analysis — API integrations, database schemas, UI workflows",
      "Authored BRDs, SRS, and user stories ensuring clear requirement translation across modules",
      "Automated workflows implementing 10+ business rules, improving accuracy by 18%, reducing effort by 30%",
      "Led UAT with 80+ test cases, reducing post-release defects by 40%",
      "Performed RCA using API logs and database analysis with engineering and cloud/infra teams",
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

/* ═══ MUSIC PLAYER HOOK ══════════════════════════════════ */

function useSynthPlayer() {
  const ctxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const gainRef = useRef<GainNode | null>(null);

  const playNote = useCallback((ctx: AudioContext, freq: number, start: number, dur: number, gain: GainNode) => {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);
    env.gain.setValueAtTime(0, start);
    env.gain.linearRampToValueAtTime(0.08, start + 0.05);
    env.gain.linearRampToValueAtTime(0, start + dur);
    osc.connect(env).connect(gain);
    osc.start(start);
    osc.stop(start + dur);
  }, []);

  const start = useCallback(() => {
    if (ctxRef.current) { ctxRef.current.resume(); setPlaying(true); return; }
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    gain.connect(ctx.destination);
    ctxRef.current = ctx;
    gainRef.current = gain;

    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const melody = [0, 2, 4, 5, 4, 2, 3, 1, 0, 4, 7, 5, 4, 2, 0, 3];
    let step = 0;

    const loop = () => {
      const now = ctx.currentTime;
      const note = notes[melody[step % melody.length]];
      playNote(ctx, note, now, 0.4, gain);
      playNote(ctx, note * 0.5, now, 0.6, gain); // bass
      step++;
    };
    loop();
    intervalRef.current = setInterval(loop, 500);
    setPlaying(true);
  }, [playNote]);

  const pause = useCallback(() => {
    ctxRef.current?.suspend();
    setPlaying(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = muted ? 0.3 : 0;
      setMuted(!muted);
    }
  }, [muted]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    ctxRef.current?.close();
  }, []);

  return { playing, muted, start, pause, toggleMute };
}

/* ═══ MAIN ═══════════════════════════════════════════════ */

export function Win95Portfolio() {
  const [screen, setScreen] = useState<Screen>("home");
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState("--:-- --");

  useEffect(() => { const t = setTimeout(() => setBooted(true), 2800); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
    tick(); const id = setInterval(tick, 30_000); return () => clearInterval(id);
  }, []);

  if (!booted) return <BootScreen />;

  const titles: Record<Screen, string> = {
    home: "portfolio.exe", about: "about.exe", projects: "projects.exe",
    skills: "skills.exe", experience: "experience.exe", contact: "contact.exe",
  };

  return (
    <div className="flex h-[100dvh] flex-col font-[family-name:var(--font-vt)] text-white" style={{ background: "linear-gradient(135deg, #0a0010 0%, #0d0020 30%, #080018 60%, #050010 100%)" }}>
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)" }} />
      {/* CRT vignette */}
      <div className="pointer-events-none fixed inset-0 z-40" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />

      {/* Window area */}
      <div className="relative flex-1 overflow-hidden p-1 sm:p-2">
        <AnimatePresence mode="wait">
          <motion.div key={screen} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.12 }} className="flex h-full flex-col">
            {/* Title bar */}
            <div className="flex shrink-0 items-center justify-between border border-white/10 px-3 py-1" style={{ background: "linear-gradient(90deg, #1a0a3a, #2d1560 50%, #1a0a3a)" }}>
              <span className="font-[family-name:var(--font-pixel)] text-[10px] text-white/80">{titles[screen]}</span>
              <div className="flex gap-1">
                {["─", "□", "×"].map((c, i) => (
                  <span key={c} className={`flex h-4 w-5 items-center justify-center border text-[10px] leading-none ${i === 2 ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/30" : "border-white/10 bg-white/5 text-white/30 hover:bg-white/10"}`}>{c}</span>
                ))}
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto border-x border-white/10 p-4 sm:p-5" style={{ background: "linear-gradient(180deg, rgba(15,5,40,0.97), rgba(10,3,25,0.98))" }}>
              {screen === "home" && <HomeScreen nav={setScreen} active={screen} />}
              {screen === "about" && <AboutScreen />}
              {screen === "projects" && <ProjectsScreen />}
              {screen === "skills" && <SkillsScreen />}
              {screen === "experience" && <ExperienceScreen />}
              {screen === "contact" && <ContactScreen />}
            </div>
            {/* Status bar */}
            <div className="flex shrink-0 items-center justify-between border border-white/10 px-3 py-0.5" style={{ background: "linear-gradient(90deg, #1a0a3a, #2d1560 50%, #1a0a3a)" }}>
              <span className="text-sm text-[#39ff14]/60">C:\&gt;</span>
              <span className="text-sm text-white/30">{time}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Taskbar */}
      <Taskbar screen={screen} nav={setScreen} time={time} />
    </div>
  );
}

/* ═══ BOOT ═══════════════════════════════════════════════ */

function BootScreen() {
  const [p, setP] = useState(0);
  useEffect(() => { const id = setInterval(() => setP(v => Math.min(v + 3, 100)), 65); return () => clearInterval(id); }, []);
  const lines = [
    "BIOS v3.1.0 — Priyanshu Patel Portfolio System",
    "Memory test... 4096 MB OK",
    "Loading portfolio.exe...",
    "Mounting projects... 4 found",
    "Initializing AI subsystems... OK",
    "Loading career modules... Business Analyst @ Digit Life Insurance",
  ];
  return (
    <div className="flex h-[100dvh] items-center justify-center font-[family-name:var(--font-vt)]" style={{ background: "#050010" }}>
      <div className="w-full max-w-xl space-y-2 px-6 text-lg text-[#39ff14]">
        {lines.filter((_, i) => p > i * 14).map(l => <p key={l}>{l}</p>)}
        <div className="mt-6 h-6 border border-[#39ff14]/30 p-[3px]">
          <div style={{ width: `${p}%`, backgroundImage: "repeating-linear-gradient(90deg,#39ff14 0 8px,transparent 8px 11px)" }} className="h-full transition-[width] duration-100" />
        </div>
        <p className="text-base text-[#39ff14]/40">{p}% loaded</p>
      </div>
    </div>
  );
}

/* ═══ HOME ═══════════════════════════════════════════════ */

function HomeScreen({ nav, active }: { nav: (s: Screen) => void; active: Screen }) {
  const music = useSynthPlayer();
  const links: { id: Screen; label: string }[] = [
    { id: "home", label: "HOME" }, { id: "about", label: "ABOUT" }, { id: "projects", label: "PROJECTS" },
    { id: "skills", label: "SKILLS" }, { id: "experience", label: "EXPERIENCE" }, { id: "contact", label: "CONTACT" },
  ];

  return (
    <div className="flex h-full flex-col gap-4 md:flex-row md:gap-6">
      {/* Left sidebar */}
      <div className="flex shrink-0 flex-row gap-1 overflow-x-auto md:w-40 md:flex-col md:justify-between md:overflow-visible">
        <div>
          <p className="mb-3 hidden font-[family-name:var(--font-pixel)] text-lg text-[#39ff14] md:block">&gt;_</p>
          <nav className="flex gap-0.5 md:flex-col md:gap-1">
            {links.map(l => (
              <button key={l.id} onClick={() => nav(l.id)} className={`whitespace-nowrap px-2 py-1 text-left text-base transition md:px-0 md:py-1 ${active === l.id ? "font-[family-name:var(--font-pixel)] text-[10px] text-[#39ff14]" : "text-white/25 hover:text-white/50"}`}>
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Now Playing */}
        <div className="hidden shrink-0 border border-white/10 bg-black/50 p-3 md:block">
          <p className="font-[family-name:var(--font-pixel)] text-[8px] uppercase tracking-widest text-white/25">Now Playing</p>
          <p className="mt-1 text-base text-white/50">Synthwave Dreams</p>
          <p className="text-sm text-white/25">Lo-fi Focus Mix</p>
          {/* Visualizer */}
          <div className="mt-2 flex items-end gap-[3px]">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div key={i} animate={music.playing ? { height: [4, 2 + Math.random() * 14, 4] } : { height: 3 }}
                transition={music.playing ? { duration: 0.3 + Math.random() * 0.3, repeat: Infinity, repeatType: "mirror" } : {}}
                className="w-[3px] rounded-sm" style={{ background: `linear-gradient(180deg, #ff6b9d, #a855f7)`, height: 3 }} />
            ))}
          </div>
          {/* Controls */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <button className="text-white/20 hover:text-white/50"><SkipBack size={12} /></button>
            <button onClick={music.playing ? music.pause : music.start} className="flex h-6 w-6 items-center justify-center rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 text-[#a855f7] hover:bg-[#a855f7]/20">
              {music.playing ? <Pause size={10} /> : <Play size={10} />}
            </button>
            <button className="text-white/20 hover:text-white/50"><SkipForward size={12} /></button>
            <button onClick={music.toggleMute} className="ml-1 text-white/20 hover:text-white/50">
              {music.muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main hero */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="max-w-xl flex-1">
            <p className="text-lg text-[#00d4ff]">Hello!</p>
            <p className="mt-1 text-xl text-white/60">I&apos;m</p>
            <h1 className="font-[family-name:var(--font-pixel)] text-3xl leading-relaxed text-white sm:text-4xl lg:text-5xl" style={{ textShadow: "0 0 40px rgba(168,85,247,0.3), 3px 3px 0 rgba(168,85,247,0.4)" }}>
              Priyanshu<br />Patel
            </h1>
            <p className="mt-3 font-[family-name:var(--font-pixel)] text-[8px] tracking-[0.15em] text-[#ffd700]">
              BUSINESS ANALYST &bull; DATA DRIVEN &bull; PROBLEM SOLVER
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/40">
              Product &amp; data-focused Business Analyst building and optimising API-driven systems and workflows.
              Currently at Digit Life Insurance, leading end-to-end SDLC for Group Life products supporting 1,500+ Cr premium portfolio.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => nav("projects")} className="border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-5 py-2 font-[family-name:var(--font-pixel)] text-[9px] text-[#00d4ff] transition hover:bg-[#00d4ff]/20">▶ VIEW MY WORK</button>
              <button onClick={() => nav("contact")} className="border border-white/15 px-5 py-2 font-[family-name:var(--font-pixel)] text-[9px] text-white/40 transition hover:border-white/30 hover:text-white/60">&gt; LET&apos;S CONNECT</button>
            </div>
          </div>

          {/* Right info card */}
          <div className="hidden w-52 shrink-0 space-y-2 border border-white/10 bg-black/40 p-4 lg:block">
            <p className="text-sm text-white/30">Building smart systems &amp; automating workflows since undergrad.</p>
            <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#a855f7]/30 to-transparent" />
            <div className="grid grid-cols-2 gap-1.5">
              {[["Portfolio", "1,500+ Cr"], ["Txns/mo", "2L+"], ["Projects", "4"], ["Award", "Tech Titan"]].map(([k, v]) => (
                <div key={k} className="border border-white/5 bg-white/[0.02] p-1.5">
                  <p className="text-[10px] text-white/20">{k}</p>
                  <p className="text-sm font-bold text-[#39ff14]">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ ABOUT ══════════════════════════════════════════════ */

function AboutScreen() {
  return (
    <div>
      <Cmd text="about me" />
      <div className="mt-4 flex flex-col gap-6 md:flex-row">
        {/* Left column */}
        <div className="shrink-0 space-y-4 md:w-56">
          {/* Terminal card */}
          <div className="border border-white/10 bg-black/50 p-3">
            <div className="border border-[#39ff14]/10 bg-black p-3">
              <p className="text-base text-[#39ff14]">&gt;_ me.txt</p>
              <p className="text-sm text-white/20">loading personality...</p>
              <p className="text-sm text-[#00d4ff]">ready.</p>
              <p className="my-1 text-white/10">───────────────</p>
              <p className="text-sm text-white/35">MBA Finance + B.Tech CSE</p>
              <p className="text-sm text-white/35">Business Analyst</p>
              <p className="text-sm text-white/35">Digit Life Insurance</p>
              <p className="text-sm text-white/35">Bengaluru, India</p>
            </div>
          </div>
          {/* Favorite things */}
          <div className="border border-white/10 p-3">
            <p className="mb-2 font-[family-name:var(--font-pixel)] text-[8px] uppercase tracking-widest text-white/30">Favorite Things</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { icon: BarChart3, label: "Data Analysis" }, { icon: Workflow, label: "Process Design" },
                { icon: Terminal, label: "Automation" }, { icon: PenTool, label: "Finance" },
              ].map(f => (
                <div key={f.label} className="flex flex-col items-center gap-1 border border-white/5 bg-black/40 p-2">
                  <f.icon size={20} className="text-[#a855f7]" />
                  <span className="text-center text-[10px] text-white/30">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1">
          <h2 className="font-[family-name:var(--font-pixel)] text-xl text-white" style={{ textShadow: "0 0 20px rgba(255,107,157,0.2)" }}>
            Who am I?
          </h2>
          <div className="mt-4 space-y-3 text-base leading-relaxed text-white/40">
            <p>I&apos;m a product &amp; data-focused Business Analyst experienced in building and optimising API-driven systems and workflows. I translate business requirements into technical solutions, perform SQL-driven analysis, and deliver automation.</p>
            <p>Strong in system design, data analysis, and cross-functional execution across product, engineering, and operations teams. Proficient in PostgreSQL, Python, and workflow automation tools.</p>
            <p>When I&apos;m not optimising workflows, you&apos;ll find me exploring AI tools, building side projects, or diving into financial markets.</p>
          </div>
          {/* System info */}
          <div className="mt-5 border border-white/10 bg-black/40 p-4">
            <p className="mb-2 font-[family-name:var(--font-pixel)] text-[9px] text-[#ff6b9d]">system.info</p>
            <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {[
                ["OS", "Business Analyst v2.0"], ["CPU", "MBA + B.Tech Dual Degree"],
                ["RAM", "MPSTME, Mumbai"], ["HDD", "4 projects loaded"],
                ["Mode", "Focused"], ["Award", "Tech Titan"],
                ["Coffee", "Many cups"], ["C:/ Drive", "85% free — open to opportunities"],
              ].map(([k, v]) => (
                <p key={k} className="text-white/25">{k}: <span className="text-white/50">{v}</span></p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ PROJECTS ═══════════════════════════════════════════ */

function ProjectsScreen() {
  const [filter, setFilter] = useState("ALL");
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Cmd text="my projects" />
        <div className="flex gap-1">
          {["ALL", "AI", "MOBILE", "AUTOMATION"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`border px-3 py-1 font-[family-name:var(--font-pixel)] text-[8px] transition ${filter === f ? "border-[#39ff14]/30 bg-[#39ff14]/10 text-[#39ff14]" : "border-white/10 text-white/25 hover:text-white/40"}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((pr, idx) => (
          <motion.div key={pr.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            className="group border border-white/10 bg-black/40 transition hover:border-white/20" style={{ borderTopColor: pr.color, borderTopWidth: 3 }}>
            {/* Preview area */}
            <div className="relative h-28 overflow-hidden" style={{ background: `linear-gradient(135deg, ${pr.color}08, ${pr.color}18)` }}>
              <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${pr.color}20 1px, transparent 1px)`, backgroundSize: "10px 10px" }} />
              <div className="absolute left-3 top-3 font-[family-name:var(--font-pixel)] text-lg" style={{ color: pr.color }}>{pr.id}</div>
              <div className="absolute bottom-3 left-3 font-[family-name:var(--font-pixel)] text-[10px] tracking-wider text-white">{pr.title}</div>
            </div>
            <div className="p-3">
              <p className="text-sm leading-relaxed text-white/35">{pr.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {pr.tags.map(t => <span key={t} className="border border-white/5 px-1.5 py-0.5 text-[10px] text-white/20">{t}</span>)}
                </div>
                {pr.repo ? (
                  <a href={pr.repo} target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-pixel)] text-[8px] text-white/20 transition hover:text-[#39ff14]">VIEW DEMO →</a>
                ) : (
                  <span className="font-[family-name:var(--font-pixel)] text-[8px] text-white/15">VIEW DEMO →</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══ SKILLS ═════════════════════════════════════════════ */

function SkillsScreen() {
  return (
    <div>
      <Cmd text="skills &amp; tools" />
      <div className="mt-4 flex flex-col gap-6 lg:flex-row">
        {/* Skills column */}
        <div className="flex-1">
          <div className="mb-1 border border-white/10 bg-black/30 p-4">
            <p className="mb-3 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest text-[#00d4ff]">Skills</p>
            <div className="space-y-2.5">
              {skillBars.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <p className="mb-0.5 text-sm text-white/40">{s.name}</p>
                  <div className="h-3 bg-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.6, delay: i * 0.04 }} className="h-full"
                      style={{ backgroundImage: `repeating-linear-gradient(90deg, ${["#00d4ff", "#39ff14", "#ff6b9d", "#ffd700", "#a855f7"][i % 5]} 0 7px, transparent 7px 10px)` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tools column */}
        <div className="lg:w-[280px]">
          <div className="border border-white/10 bg-black/30 p-4">
            <p className="mb-3 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest text-[#ff6b9d]">Tools I Use</p>
            <div className="grid grid-cols-3 gap-2">
              {tools.map((tool, i) => (
                <motion.div key={tool.name} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                  className="flex flex-col items-center gap-1.5 border border-white/5 bg-black/40 p-2.5 transition hover:border-white/15">
                  <tool.icon size={22} style={{ color: tool.color }} />
                  <span className="text-center text-[10px] text-white/30">{tool.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Currently learning */}
      <div className="mt-4 border border-white/10 bg-black/30 p-3">
        <p className="font-[family-name:var(--font-pixel)] text-[9px] uppercase tracking-widest text-[#ffd700]">Currently Learning...</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm text-[#39ff14]/50">C:\&gt;</span>
          <p className="text-sm text-white/35">learning.exe</p>
          <div className="flex-1">
            <p className="text-sm text-white/40">Agentic AI, product analytics, and AI-native product design</p>
            <div className="mt-1 h-3 bg-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1.2 }}
                className="h-full" style={{ backgroundImage: "repeating-linear-gradient(90deg, #ff6b9d 0 6px, transparent 6px 9px)" }} />
            </div>
          </div>
          <span className="text-xl">🎓</span>
        </div>
      </div>
    </div>
  );
}

/* ═══ EXPERIENCE ═════════════════════════════════════════ */

function ExperienceScreen() {
  return (
    <div>
      <Cmd text="experience" />
      <h2 className="mt-3 font-[family-name:var(--font-pixel)] text-lg text-white" style={{ textShadow: "0 0 15px rgba(255,215,0,0.15)" }}>
        Work Experience
      </h2>
      <div className="mt-3 space-y-3">
        {jobs.map((j, i) => (
          <motion.div key={j.co} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="border border-white/10 bg-black/40 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="text-base font-bold text-white">{j.role}</span>
                <span className="text-base text-white/30"> — {j.co}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/20">{j.period} · {j.loc}</span>
                {j.award && <span className="border border-[#ffd700]/20 bg-[#ffd700]/5 px-1.5 py-0.5 text-[10px] text-[#ffd700]/70">🏆 {j.award}</span>}
              </div>
            </div>
            <ul className="mt-2 space-y-0.5">
              {j.bullets.map(b => <li key={b} className="text-sm leading-relaxed text-white/35">▸ {b}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Education */}
      <p className="mb-2 mt-5 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest text-[#ff6b9d]">Education</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {education.map(e => (
          <div key={e.deg} className="border border-white/10 bg-black/40 p-3">
            <p className="text-sm font-bold text-white/60">{e.deg}</p>
            <p className="text-sm text-white/25">{e.school}{e.school ? " · " : ""}{e.year}</p>
            <p className="text-sm text-[#39ff14]/60">{e.gpa}</p>
          </div>
        ))}
      </div>

      {/* Certs */}
      <p className="mb-2 mt-4 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest text-[#ffd700]">Certifications</p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {certs.map(c => <div key={c} className="border border-white/5 bg-black/30 px-3 py-2 text-sm text-white/35">▪ {c}</div>)}
      </div>

      {/* Achievement */}
      <div className="mt-4 border border-[#ffd700]/15 bg-[#ffd700]/5 p-3">
        <p className="font-[family-name:var(--font-pixel)] text-[9px] text-[#ffd700]/60">Achievement</p>
        <p className="mt-1 text-sm text-white/40">Finalist — EY Young Leader&apos;s Business Case Study Competition 2024</p>
      </div>
    </div>
  );
}

/* ═══ CONTACT ════════════════════════════════════════════ */

function ContactScreen() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/itsmepriyanshu36@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); }
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); }
  };

  return (
    <div>
      <Cmd text="contact me" />
      <h2 className="mt-3 font-[family-name:var(--font-pixel)] text-xl text-white" style={{ textShadow: "0 0 20px rgba(168,85,247,0.2)" }}>
        Let&apos;s connect!
      </h2>
      <p className="mt-2 text-base text-white/30">Always open to discussing interesting opportunities in business analysis, product, and technology.</p>

      <div className="mt-5 flex flex-col gap-6 md:flex-row">
        {/* Social links */}
        <div className="space-y-4 md:w-64">
          {[
            { label: "EMAIL", value: "itsmepriyanshu36@gmail.com", Icon: Mail, color: "#ff6b9d", href: "mailto:itsmepriyanshu36@gmail.com" },
            { label: "LINKEDIN", value: "/in/priyanshu-patel", Icon: Linkedin, color: "#0077B5", href: "https://www.linkedin.com/in/priyanshu-patel-069331200/" },
            { label: "GITHUB", value: "/zucc12309", Icon: Github, color: "#fff", href: "https://github.com/zucc12309" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 transition hover:opacity-80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-black/50">
                <s.Icon size={18} style={{ color: s.color }} />
              </span>
              <div>
                <p className="font-[family-name:var(--font-pixel)] text-[8px] uppercase tracking-widest text-white/30">{s.label}</p>
                <p className="text-sm text-white/50 transition group-hover:text-[#a855f7]">{s.value}</p>
              </div>
            </a>
          ))}
          <div className="border-t border-white/5 pt-3">
            <p className="text-sm text-white/20">📍 Based in Bengaluru, India</p>
            <p className="text-sm text-white/20">Available Worldwide</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="flex-1 border border-white/10 bg-black/40 p-4">
          <p className="mb-4 text-center font-[family-name:var(--font-pixel)] text-[10px] text-white/40">SEND A MESSAGE  :)</p>
          <div className="space-y-3">
            <input type="text" placeholder="NAME" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full border border-white/10 bg-[#0a0018] px-3 py-2.5 font-[family-name:var(--font-vt)] text-base text-white/60 placeholder:text-white/15 outline-none transition focus:border-[#a855f7]/40" />
            <input type="email" placeholder="EMAIL" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-white/10 bg-[#0a0018] px-3 py-2.5 font-[family-name:var(--font-vt)] text-base text-white/60 placeholder:text-white/15 outline-none transition focus:border-[#a855f7]/40" />
            <textarea placeholder="MESSAGE" rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="w-full resize-none border border-white/10 bg-[#0a0018] px-3 py-2.5 font-[family-name:var(--font-vt)] text-base text-white/60 placeholder:text-white/15 outline-none transition focus:border-[#a855f7]/40" />
            <button onClick={handleSubmit} disabled={status === "sending"}
              className="w-full border border-[#a855f7]/30 bg-[#a855f7]/10 py-2.5 font-[family-name:var(--font-pixel)] text-[9px] tracking-wider text-[#a855f7] transition hover:bg-[#a855f7]/20 disabled:opacity-50">
              {status === "sending" ? "SENDING..." : status === "sent" ? "✓ MESSAGE SENT!" : status === "error" ? "✕ RETRY" : "▶ SEND MESSAGE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ TASKBAR ════════════════════════════════════════════ */

function Taskbar({ screen, nav, time }: { screen: Screen; nav: (s: Screen) => void; time: string }) {
  const tabs: { id: Screen; label: string }[] = [
    { id: "about", label: "about.exe" }, { id: "projects", label: "projects.exe" },
    { id: "skills", label: "skills.exe" }, { id: "experience", label: "experience.exe" }, { id: "contact", label: "contact.exe" },
  ];
  return (
    <div className="flex items-center gap-1 border-t border-white/10 px-2 py-1.5" style={{ background: "linear-gradient(180deg, #1a0a3a, #0d0020)" }}>
      <button onClick={() => nav("home")} className={`flex items-center gap-2 border px-3 py-1 font-[family-name:var(--font-pixel)] text-[9px] transition ${screen === "home" ? "border-[#39ff14]/20 bg-[#39ff14]/10 text-[#39ff14]" : "border-white/10 bg-black/30 text-white/40 hover:bg-white/5"}`}>
        <span className="grid grid-cols-2 gap-[2px]">
          <span className="block h-[5px] w-[5px] bg-[#ff6b9d]" /><span className="block h-[5px] w-[5px] bg-[#39ff14]" />
          <span className="block h-[5px] w-[5px] bg-[#00d4ff]" /><span className="block h-[5px] w-[5px] bg-[#ffd700]" />
        </span>
        Start
      </button>
      <div className="flex flex-1 gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => nav(t.id)}
            className={`border px-2 py-1 text-sm transition sm:px-3 ${screen === t.id ? "border-white/15 bg-white/10 text-white" : "border-white/5 bg-black/30 text-white/25 hover:text-white/40"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="border border-white/10 bg-black/30 px-3 py-1 text-sm text-white/30">{time}</div>
    </div>
  );
}

/* ═══ HELPERS ════════════════════════════════════════════ */

function Cmd({ text }: { text: string }) {
  return <p className="text-base"><span className="text-[#39ff14]/50">C:\&gt;</span> <span className="font-bold text-[#39ff14]" dangerouslySetInnerHTML={{ __html: text }} /></p>;
}
