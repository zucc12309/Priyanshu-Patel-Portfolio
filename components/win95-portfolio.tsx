"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Linkedin, Github, Figma, Database, BarChart3,
  Code2, GitBranch, FileSpreadsheet, MessageSquare, Workflow,
  Terminal, PenTool, Send, Pause, Play, Download, Eye, EyeOff,
  SkipBack, SkipForward, Volume2, VolumeX, Trophy, Lightbulb,
  Target, Wrench, BookOpen, Briefcase, Rocket, Search, Zap,
  ChevronRight, ExternalLink, Music, Gamepad2, Dumbbell, Pencil,
} from "lucide-react";

type Screen = "home" | "about" | "digit" | "builder" | "skills" | "contact";

type MusicControls = {
  playing: boolean;
  muted: boolean;
  start: () => void;
  pause: () => void;
  toggleMute: () => void;
};

/* ═══ DESIGN TOKENS ══════════════════════════════════════ */
const C = {
  bg: "#0B0F14",
  surface: "#151A21",
  surfaceAlt: "#1C2129",
  green: "#8BE78B",
  greenDim: "rgba(139,231,139,0.15)",
  amber: "#F5B14C",
  purple: "#A970FF",
  pink: "#E8729A",
  cyan: "#6BC5E8",
  gold: "#F5B14C",
  text: "#F5F1E8",
  textDim: "rgba(245,241,232,0.72)",
  textMuted: "#D0D6DE",
  border: "rgba(245,241,232,0.12)",
  borderLight: "rgba(245,241,232,0.08)",
};

/* ═══ DATA ════════════════════════════════════════════════ */

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

const builderProjects = [
  {
    id: "01", title: "MEMORY ROUTER", color: C.pink, status: "Active" as const,
    problem: "LLM workflows resend too much context, lose durable memory, and force users to choose between privacy and capability.",
    solution: "A local-first memory and routing layer that retrieves relevant knowledge, assembles a compact prompt, and sends it to the right provider.",
    stack: ["Python", "SQLite", "FTS5", "MCP", "Ollama"],
    learnings: ["AI products need strong defaults before more controls", "Local-first infrastructure changes the trust story of personal AI tools", "Routing is a product surface, not just an optimization technique"],
    repo: "https://github.com/zucc12309/memory-router",
    flagship: true,
  },
  {
    id: "02", title: "RIDECOMPARE", color: C.green, status: "Complete" as const,
    problem: "Ride pricing is fragmented across apps. Users waste time checking providers manually without knowing which option is actually best.",
    solution: "A mobile comparison layer that estimates fares, highlights savings, tracks accuracy, and deep-links into provider apps.",
    stack: ["Flutter", "Node.js", "PostgreSQL", "Google Maps API"],
    learnings: ["Consumer AI has to earn trust through clear comparisons", "Pricing systems need feedback loops, not static formulas", "Mobile UX improves when recommendations explain the tradeoff"],
    repo: undefined,
  },
  {
    id: "03", title: "AI LIFEADMIN OS", color: C.cyan, status: "Active" as const,
    problem: "Life administration is scattered across email, documents, subscriptions, calendars, and payment reminders — creating missed renewals and hidden work.",
    solution: "An AI-native command center that extracts obligations, prioritizes tasks, and coordinates specialized agents with human review.",
    stack: ["React", "Node.js", "Redis", "PostgreSQL", "LLM APIs"],
    learnings: ["The inbox is the best entry point for personal automation", "Agent products need review queues and confidence states", "Premium UX matters more when the product touches money and documents"],
    repo: undefined,
  },
  {
    id: "04", title: "CRM WORKFLOW", color: C.amber, status: "Complete" as const,
    problem: "CRM export data requires manual cleaning, formatting, and reporting before it becomes useful for stakeholders and dashboards.",
    solution: "A workflow layer that orchestrates CRM actions, tracks outcomes, and gives operators visibility into process performance.",
    stack: ["n8n", "Python", "Power BI", "Gmail API"],
    learnings: ["Automation is only valuable when it fits the process owner's mental model", "Reporting should explain bottlenecks, not just count activity", "The best workflow products make handoffs visible"],
    repo: "https://github.com/zucc12309/CRM-workflow-automation",
  },
];

const skillBars = [
  { name: "Requirements & BRD", pct: 92 }, { name: "SQL & Data Analysis", pct: 88 },
  { name: "API Integration", pct: 85 }, { name: "UAT & Test Cases", pct: 90 },
  { name: "Agile / Scrum", pct: 87 }, { name: "Stakeholder Mgmt", pct: 85 },
  { name: "Workflow Automation", pct: 80 }, { name: "Process Improvement", pct: 82 },
  { name: "Problem Solving", pct: 92 },
];

const tools = [
  { name: "Jira", icon: BarChart3, color: "#4C9AFF" },
  { name: "Postman", icon: Send, color: "#FF6C37" },
  { name: "SQL Server", icon: Database, color: "#E8729A" },
  { name: "Power BI", icon: BarChart3, color: "#F5B14C" },
  { name: "Python", icon: Terminal, color: "#6BC5E8" },
  { name: "Figma", icon: Figma, color: "#A970FF" },
  { name: "n8n", icon: Workflow, color: "#E8729A" },
  { name: "Git", icon: GitBranch, color: "#8BE78B" },
  { name: "VS Code", icon: Code2, color: "#6BC5E8" },
  { name: "Excel", icon: FileSpreadsheet, color: "#8BE78B" },
  { name: "DBeaver", icon: Database, color: "#B8C0CC" },
  { name: "Confluence", icon: MessageSquare, color: "#6BC5E8" },
];

/* ═══ MUSIC PLAYER HOOK ══════════════════════════════════ */

function useSynthPlayer(): MusicControls {
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
      playNote(ctx, note * 0.5, now, 0.6, gain);
      step++;
    };
    loop();
    intervalRef.current = setInterval(loop, 500);
    setPlaying(true);
  }, [playNote]);

  const pause = useCallback(() => { ctxRef.current?.suspend(); setPlaying(false); }, []);
  const toggleMute = useCallback(() => {
    if (gainRef.current) { gainRef.current.gain.value = muted ? 0.3 : 0; setMuted(!muted); }
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
  const [recruiterMode, setRecruiterMode] = useState(false);
  const music = useSynthPlayer();

  useEffect(() => { const t = setTimeout(() => setBooted(true), 2800); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
    tick(); const id = setInterval(tick, 30_000); return () => clearInterval(id);
  }, []);

  if (!booted) return <BootScreen />;

  const titles: Record<Screen, string> = {
    home: "portfolio.exe", about: "about.exe", digit: "digit.exe",
    builder: "builder.exe", skills: "skills.exe", contact: "contact.exe",
  };

  if (recruiterMode) return <RecruiterMode exit={() => setRecruiterMode(false)} time={time} music={music} />;

  return (
    <div className="flex h-[100dvh] flex-col font-[family-name:var(--font-vt)]" style={{ background: C.bg, color: C.text }}>
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.12]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)" }} />
      <div className="pointer-events-none fixed inset-0 z-40" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)" }} />

      {/* Max-width container for ultrawide */}
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col overflow-hidden p-1 sm:p-2">
        <AnimatePresence mode="wait">
          <motion.div key={screen} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.12 }} className="flex h-full flex-col">
            {/* Title bar */}
            <div className="flex shrink-0 items-center justify-between gap-2 px-2 py-1.5 sm:px-3" style={{ background: `linear-gradient(90deg, #0d1117, ${C.surface} 48%, #0d1117)`, borderBottom: `1px solid ${C.border}` }}>
              <span className="min-w-0 truncate font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.green, textShadow: `0 0 8px rgba(139,231,139,0.3)` }}>{titles[screen]}</span>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button onClick={() => setRecruiterMode(true)} className="hidden items-center gap-1.5 border px-2 py-1 text-xs transition hover:border-green-400/30 xs:flex sm:px-2.5" style={{ borderColor: C.border, color: C.textMuted }}>
                  <Eye size={11} /> <span className="hidden sm:inline">Recruiter</span>
                </button>
                <button onClick={() => setRecruiterMode(true)} className="flex items-center border p-1 text-xs xs:hidden" style={{ borderColor: C.border, color: C.textMuted }}>
                  <Eye size={12} />
                </button>
                <div className="flex gap-0.5 sm:gap-1">
                  {["─", "□", "×"].map((c, i) => (
                    <span key={c} className={`flex h-4 w-4 items-center justify-center border text-[10px] leading-none sm:w-5 ${i === 2 ? "border-red-500/20 bg-red-500/10 text-red-400/70" : ""}`} style={i < 2 ? { borderColor: C.border, color: C.textDim } : {}}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6" style={{ background: C.surface, borderLeft: `1px solid ${C.borderLight}`, borderRight: `1px solid ${C.borderLight}` }}>
              {screen === "home" && <HomeScreen nav={setScreen} music={music} />}
              {screen === "about" && <AboutScreen />}
              {screen === "digit" && <DigitScreen />}
              {screen === "builder" && <BuilderScreen />}
              {screen === "skills" && <SkillsScreen />}
              {screen === "contact" && <ContactScreen />}
            </div>
            {/* Status bar with persistent music */}
            <div className="flex shrink-0 items-center justify-between gap-2 px-2 py-1 sm:px-3" style={{ background: `linear-gradient(90deg, #0d1117, ${C.surface} 48%, #0d1117)`, borderTop: `1px solid ${C.border}` }}>
              <span className="hidden text-sm sm:inline" style={{ color: C.green, opacity: 0.5 }}>C:\&gt;</span>
              {/* Persistent music controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-[2px]">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div key={i} animate={music.playing ? { height: [2, 1 + Math.random() * 8, 2] } : { height: 2 }}
                      transition={music.playing ? { duration: 0.3 + Math.random() * 0.3, repeat: Infinity, repeatType: "mirror" } : {}}
                      className="w-[2px] rounded-sm" style={{ background: `linear-gradient(180deg, ${C.pink}, ${C.purple})`, height: 2 }} />
                  ))}
                </div>
                <span className="hidden text-xs sm:inline" style={{ color: C.textDim }}>Synthwave</span>
                <button onClick={music.playing ? music.pause : music.start} className="flex h-5 w-5 items-center justify-center rounded-full transition hover:opacity-80" style={{ border: `1px solid rgba(169,112,255,0.3)`, background: `rgba(169,112,255,0.1)`, color: C.purple }}>
                  {music.playing ? <Pause size={8} /> : <Play size={8} />}
                </button>
                <button onClick={music.toggleMute} className="transition hover:opacity-80" style={{ color: C.textDim }}>
                  {music.muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

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
    "Mounting projects... 4 personal builds found",
    "Loading career modules... Business Analyst @ Digit Life Insurance",
    "Tech Titan Award verified ✓",
  ];
  return (
    <div className="flex h-[100dvh] items-center justify-center font-[family-name:var(--font-vt)]" style={{ background: C.bg }}>
      <div className="w-full max-w-xl space-y-2 px-4 text-base sm:px-6 sm:text-lg md:text-xl" style={{ color: C.green }}>
        {lines.filter((_, i) => p > i * 14).map(l => <p key={l} style={l.includes("✓") ? { color: C.amber } : {}}>{l}</p>)}
        <div className="mt-6 h-5 p-[3px] sm:h-6" style={{ border: `1px solid rgba(139,231,139,0.25)` }}>
          <div style={{ width: `${p}%`, backgroundImage: `repeating-linear-gradient(90deg, ${C.green} 0 8px, transparent 8px 11px)` }} className="h-full transition-[width] duration-100" />
        </div>
        <p className="text-sm sm:text-base" style={{ color: C.textDim }}>{p}% loaded</p>
      </div>
    </div>
  );
}

/* ═══ HOME ═══════════════════════════════════════════════ */

function HomeScreen({ nav, music }: { nav: (s: Screen) => void; music: MusicControls }) {
  return (
    <div className="flex h-full flex-col gap-4 md:flex-row md:gap-8">
      {/* Left sidebar — hidden below md */}
      <div className="hidden shrink-0 md:flex md:w-40 md:flex-col md:justify-between lg:w-44">
        <div>
          <p className="mb-3 font-[family-name:var(--font-pixel)] text-lg lg:text-xl" style={{ color: C.green, textShadow: `0 0 8px rgba(139,231,139,0.3)` }}>&gt;_</p>
          <nav className="flex flex-col gap-0.5">
            {([["home", "HOME"], ["about", "ABOUT"], ["digit", "DIGIT.EXE"], ["builder", "BUILDER.EXE"], ["skills", "SKILLS"], ["contact", "CONTACT"]] as const).map(([id, label]) => (
              <button key={id} onClick={() => nav(id as Screen)} className="py-1 text-left text-base transition hover:opacity-80 lg:text-lg" style={{ color: C.textDim }}>
                {label}
              </button>
            ))}
          </nav>
        </div>
        {/* Now Playing — sidebar only */}
        <div className="shrink-0 p-3" style={{ border: `1px solid ${C.border}`, background: `${C.bg}88` }}>
          <p className="font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest" style={{ color: C.textDim }}>Now Playing</p>
          <p className="mt-1 text-base" style={{ color: C.textMuted }}>Synthwave Dreams</p>
          <p className="text-sm" style={{ color: C.textDim }}>Lo-fi Focus Mix</p>
          <div className="mt-2 flex items-end gap-[3px]">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div key={i} animate={music.playing ? { height: [4, 2 + Math.random() * 14, 4] } : { height: 3 }}
                transition={music.playing ? { duration: 0.3 + Math.random() * 0.3, repeat: Infinity, repeatType: "mirror" } : {}}
                className="w-[3px] rounded-sm" style={{ background: `linear-gradient(180deg, ${C.pink}, ${C.purple})`, height: 3 }} />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <button style={{ color: C.textDim }} className="hover:opacity-80"><SkipBack size={12} /></button>
            <button onClick={music.playing ? music.pause : music.start} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ border: `1px solid rgba(169,112,255,0.3)`, background: `rgba(169,112,255,0.1)`, color: C.purple }}>
              {music.playing ? <Pause size={10} /> : <Play size={10} />}
            </button>
            <button style={{ color: C.textDim }} className="hover:opacity-80"><SkipForward size={12} /></button>
            <button onClick={music.toggleMute} style={{ color: C.textDim }} className="ml-1 hover:opacity-80">
              {music.muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main hero */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="min-w-0 flex-1">
            <p className="text-lg sm:text-xl" style={{ color: C.cyan }}>Hello!</p>
            <p className="mt-1 text-xl sm:text-2xl" style={{ color: C.textMuted }}>I&apos;m</p>
            <h1 className="font-[family-name:var(--font-pixel)] text-xl leading-relaxed sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl" style={{ color: C.text, textShadow: `2px 0 0 rgba(169,112,255,0.4), 0 0 20px rgba(169,112,255,0.15)` }}>
              Priyanshu<br />Patel
            </h1>
          </div>
          {/* Retro computer pixel art — responsive sizing */}
          <div className="hidden shrink-0 sm:block" style={{ imageRendering: "pixelated" }}>
            <RetroPC />
          </div>
        </div>

        <p className="mt-3 text-base sm:text-lg lg:text-xl" style={{ color: C.textMuted }}>Business Analyst at <span style={{ color: C.green }}>Digit Life Insurance</span></p>
        <p className="mt-1 text-sm sm:text-base lg:text-lg" style={{ color: C.textDim }}>Building AI-native products and workflow systems independently.</p>
        <p className="mt-1 text-xs sm:text-sm lg:text-base" style={{ color: C.textDim }}>MBA Finance + B.Tech CSE · Bengaluru, India</p>

        {/* Tech Titan Award */}
        <div className="mt-3 inline-flex w-fit flex-wrap items-center gap-1.5 px-3 py-1.5 sm:mt-4 sm:gap-2 sm:px-4 sm:py-2" style={{ border: `1px solid rgba(245,177,76,0.2)`, background: `rgba(245,177,76,0.06)`, boxShadow: `0 0 20px rgba(245,177,76,0.08)` }}>
          <Trophy size={14} style={{ color: C.amber }} />
          <span className="font-[family-name:var(--font-pixel)] text-[9px] sm:text-[10px] lg:text-xs" style={{ color: C.amber }}>TECH TITAN AWARD RECIPIENT</span>
          <span className="hidden text-xs sm:inline sm:text-sm" style={{ color: `rgba(245,177,76,0.7)` }}>— Digit Life Insurance</span>
        </div>

        {/* Dual-track navigation */}
        <div className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3 sm:max-w-lg">
          <button onClick={() => nav("digit")} className="group p-3 text-left transition hover:scale-[1.01] sm:p-4" style={{ border: `1px solid rgba(107,197,232,0.2)`, background: `rgba(107,197,232,0.04)` }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(107,197,232,0.35)"; e.currentTarget.style.boxShadow = `0 0 20px rgba(107,197,232,0.08)`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(107,197,232,0.2)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div className="flex items-center gap-2">
              <Briefcase size={14} style={{ color: C.cyan }} />
              <span className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.cyan }}>DIGIT.EXE</span>
            </div>
            <p className="mt-1.5 text-sm sm:mt-2 sm:text-base" style={{ color: C.textMuted }}>Professional Career</p>
            <p className="text-xs sm:text-sm" style={{ color: C.textDim }}>Experience · Impact · Skills</p>
          </button>
          <button onClick={() => nav("builder")} className="group p-3 text-left transition hover:scale-[1.01] sm:p-4" style={{ border: `1px solid rgba(232,114,154,0.2)`, background: `rgba(232,114,154,0.04)` }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,114,154,0.35)"; e.currentTarget.style.boxShadow = `0 0 20px rgba(232,114,154,0.08)`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(232,114,154,0.2)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div className="flex items-center gap-2">
              <Rocket size={14} style={{ color: C.pink }} />
              <span className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.pink }}>BUILDER.EXE</span>
            </div>
            <p className="mt-1.5 text-sm sm:mt-2 sm:text-base" style={{ color: C.textMuted }}>Personal Projects</p>
            <p className="text-xs sm:text-sm" style={{ color: C.textDim }}>What I build independently</p>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
          <button onClick={() => nav("skills")} className="px-3 py-1.5 font-[family-name:var(--font-pixel)] text-[10px] transition hover:opacity-80 sm:px-4 sm:py-2 sm:text-xs" style={{ border: `1px solid ${C.border}`, color: C.textDim }}>SKILLS</button>
          <button onClick={() => nav("contact")} className="px-3 py-1.5 font-[family-name:var(--font-pixel)] text-[10px] transition hover:opacity-80 sm:px-4 sm:py-2 sm:text-xs" style={{ border: `1px solid ${C.border}`, color: C.textDim }}>CONTACT</button>
          <a href="/cv/priyanshu-patel-business-analyst-cv.pdf" className="flex items-center gap-1.5 px-3 py-1.5 font-[family-name:var(--font-pixel)] text-[10px] transition hover:opacity-80 sm:px-4 sm:py-2 sm:text-xs" style={{ border: `1px solid ${C.border}`, color: C.textDim }}>
            <Download size={11} /> RESUME
          </a>
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
      <div className="mt-4 flex flex-col gap-4 sm:gap-6 md:flex-row">
        <div className="shrink-0 space-y-4 md:w-52 lg:w-56">
          <div className="p-3" style={{ border: `1px solid ${C.border}`, background: C.bg }}>
            <div className="p-2 sm:p-3" style={{ border: `1px solid rgba(139,231,139,0.1)`, background: C.bg }}>
              <p className="text-sm sm:text-base" style={{ color: C.green }}>&gt;_ me.txt</p>
              <p className="text-xs sm:text-sm" style={{ color: C.textDim }}>loading...</p>
              <p className="text-xs sm:text-sm" style={{ color: C.cyan }}>ready.</p>
              <p className="my-1" style={{ color: `rgba(245,241,232,0.1)` }}>───────────────</p>
              <p className="text-xs sm:text-sm" style={{ color: C.textMuted }}>MBA Finance + B.Tech CSE</p>
              <p className="text-xs sm:text-sm" style={{ color: C.textMuted }}>Business Analyst</p>
              <p className="text-xs sm:text-sm" style={{ color: C.textMuted }}>Digit Life Insurance</p>
              <p className="text-xs sm:text-sm" style={{ color: C.textMuted }}>Bengaluru, India</p>
            </div>
          </div>
          <div className="p-3" style={{ border: `1px solid ${C.border}` }}>
            <p className="mb-2 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: C.textDim }}>Interests</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[{ icon: Gamepad2, label: "Gaming" }, { icon: Dumbbell, label: "Working Out" }, { icon: Pencil, label: "Sketching" }, { icon: Terminal, label: "Vibe Coding" }].map(f => (
                <div key={f.label} className="flex flex-col items-center gap-1 p-2" style={{ border: `1px solid ${C.borderLight}`, background: C.bg }}>
                  <f.icon size={18} style={{ color: C.purple }} />
                  <span className="text-center text-[10px] sm:text-xs" style={{ color: C.textDim }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-pixel)] text-lg sm:text-xl lg:text-2xl" style={{ color: C.text, textShadow: `0 0 20px rgba(232,114,154,0.15)` }}>Who am I?</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed sm:mt-4 sm:text-base lg:text-lg" style={{ color: C.textMuted }}>
            <p>Product &amp; data-focused Business Analyst at <span style={{ color: C.green }}>Digit Life Insurance</span>. I translate business requirements into technical solutions, perform SQL-driven analysis, and deliver automation that improves accuracy and reduces manual effort.</p>
            <p>Outside work, I independently build products — from AI infrastructure tools to mobile apps. These personal projects reflect my product thinking and technical curiosity, not my professional work.</p>
            <p>Strong in system design, data analysis, and cross-functional execution across product, engineering, and operations teams.</p>
          </div>
          <div className="mt-4 p-3 sm:mt-5 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.bg }}>
            <p className="mb-2 font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.pink }}>system.info</p>
            <div className="grid gap-x-4 gap-y-1 text-xs sm:grid-cols-2 sm:gap-x-6 sm:gap-y-1.5 sm:text-sm">
              {[["OS", "Business Analyst v2.0"], ["CPU", "MBA + B.Tech Dual Degree"], ["RAM", "MPSTME, Mumbai · 2025"], ["Award", "Tech Titan — Digit Life"], ["Mode", "Focused"], ["Side Projects", "4 shipped"], ["Coffee", "Many cups"], ["C:/ Drive", "Open to opportunities"]].map(([k, v]) => (
                <p key={k} style={{ color: C.textDim }}>{k}: <span style={{ color: C.textMuted }}>{v}</span></p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ DIGIT.EXE — Professional Career ═══════════════════ */

function DigitScreen() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Briefcase size={18} style={{ color: C.cyan }} />
        <Cmd text="professional career" />
      </div>
      <p className="mt-2 text-sm sm:text-base" style={{ color: C.textDim }}>What I do at work. Real roles, real impact.</p>

      <h2 className="mt-4 font-[family-name:var(--font-pixel)] text-base sm:text-lg lg:text-xl" style={{ color: C.text, textShadow: `0 0 15px rgba(107,197,232,0.12)` }}>Work Experience</h2>
      <div className="mt-3 space-y-3">
        {jobs.map((j, i) => (
          <motion.div key={j.co} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="p-3 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.bg }}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <span className="text-base font-bold sm:text-lg" style={{ color: C.text }}>{j.role}</span>
                <span className="text-base sm:text-lg" style={{ color: C.textDim }}> — {j.co}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm" style={{ color: C.textDim }}>{j.period} · {j.loc}</span>
                {j.award && <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-xs" style={{ border: `1px solid rgba(245,177,76,0.2)`, background: `rgba(245,177,76,0.06)`, color: C.amber }}><Trophy size={10} /> {j.award}</span>}
              </div>
            </div>
            <ul className="mt-2 space-y-1">
              {j.bullets.map(b => <li key={b} className="text-sm leading-relaxed sm:text-base" style={{ color: C.textMuted }}>▸ {b}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>

      <p className="mb-2 mt-5 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: C.pink }}>Education</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {education.map(e => (
          <div key={e.deg} className="p-2 sm:p-3" style={{ border: `1px solid ${C.border}`, background: C.bg }}>
            <p className="text-xs font-bold sm:text-sm" style={{ color: C.textMuted }}>{e.deg}</p>
            <p className="text-xs sm:text-sm" style={{ color: C.textDim }}>{e.school}{e.school ? " · " : ""}{e.year}</p>
            <p className="text-xs sm:text-sm" style={{ color: C.green }}>{e.gpa}</p>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-4 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: C.amber }}>Certifications</p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {certs.map(c => <div key={c} className="px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm" style={{ border: `1px solid ${C.borderLight}`, background: C.bg, color: C.textMuted }}>▪ {c}</div>)}
      </div>

      <div className="mt-4 p-2 sm:p-3" style={{ border: `1px solid rgba(245,177,76,0.12)`, background: `rgba(245,177,76,0.04)` }}>
        <p className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: `rgba(245,177,76,0.75)` }}>Achievement</p>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: C.textMuted }}>Finalist — EY Young Leader&apos;s Business Case Study Competition 2024</p>
      </div>
    </div>
  );
}

/* ═══ BUILDER.EXE — Personal Projects ═══════════════════ */

function BuilderScreen() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Rocket size={18} style={{ color: C.pink }} />
        <Cmd text="personal projects" />
      </div>
      <p className="mt-2 text-sm sm:text-base" style={{ color: C.textDim }}>What I build independently, outside work. These are not company projects.</p>

      <div className="mt-4 space-y-4">
        {builderProjects.map((pr, idx) => (
          <motion.div key={pr.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            className="overflow-hidden" style={{ border: `1px solid ${C.border}`, background: C.bg, borderTopColor: pr.color, borderTopWidth: 3 }}>
            <div className="p-3 sm:p-4">
              {/* Project header — stacks on mobile */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="font-[family-name:var(--font-pixel)] text-base sm:text-lg" style={{ color: pr.color }}>{pr.id}</span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px] tracking-wider sm:text-sm" style={{ color: C.text }}>{pr.title}</span>
                  {pr.flagship && <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px]" style={{ border: `1px solid rgba(245,177,76,0.2)`, color: C.amber }}><Zap size={9} /> Flagship</span>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={pr.status} />
                  {pr.repo && <a href={pr.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs transition hover:opacity-80" style={{ color: C.textDim }}><Github size={12} /> Code <ExternalLink size={9} /></a>}
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:gap-3 md:grid-cols-2">
                <div className="p-2 sm:p-3" style={{ border: `1px solid ${C.borderLight}`, background: C.surfaceAlt }}>
                  <div className="flex items-center gap-1.5">
                    <Target size={12} style={{ color: C.pink }} />
                    <span className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.pink }}>PROBLEM</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed sm:text-base" style={{ color: C.textMuted }}>{pr.problem}</p>
                </div>
                <div className="p-2 sm:p-3" style={{ border: `1px solid ${C.borderLight}`, background: C.surfaceAlt }}>
                  <div className="flex items-center gap-1.5">
                    <Lightbulb size={12} style={{ color: C.green }} />
                    <span className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.green }}>SOLUTION</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed sm:text-base" style={{ color: C.textMuted }}>{pr.solution}</p>
                </div>
              </div>

              {/* Stack */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Wrench size={11} style={{ color: C.textDim }} />
                {pr.stack.map(t => <span key={t} className="px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs" style={{ border: `1px solid ${C.borderLight}`, color: C.textDim }}>{t}</span>)}
              </div>

              {/* Learnings */}
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.borderLight}` }}>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={11} style={{ color: C.amber }} />
                  <span className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.amber }}>LEARNINGS</span>
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  {pr.learnings.map(l => <li key={l} className="text-sm leading-relaxed sm:text-base" style={{ color: C.textDim }}>▸ {l}</li>)}
                </ul>
              </div>
            </div>

            {pr.flagship && <MemoryRouterTerminal />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══ MEMORY ROUTER TERMINAL ═══════════════════════════ */

function MemoryRouterTerminal() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<{ text: string; color?: string; isCmd?: boolean }[]>([
    { text: "Memory Router v0.3.1 — Local-first AI memory & routing layer", color: C.green },
    { text: 'Type "help" for commands. Click terminal to focus.', color: C.textDim },
    { text: "" },
  ]);
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const emit = useCallback((rows: { text: string; color?: string }[], cb?: () => void) => {
    setBusy(true);
    let i = 0;
    const next = () => {
      if (i < rows.length) {
        const row = rows[i];
        setLines(p => [...p, row]);
        i++;
        setTimeout(next, 80 + Math.random() * 60);
      } else {
        setLines(p => [...p, { text: "" }]);
        setBusy(false);
        cb?.();
      }
    };
    next();
  }, []);

  const exec = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    setLines(p => [...p, { text: raw, isCmd: true }]);
    if (raw.trim()) setCmdHist(p => [raw.trim(), ...p]);
    setHistIdx(-1);
    setInput("");
    if (!cmd) return;

    if (cmd === "help") {
      emit([
        { text: "Available commands:", color: C.green },
        { text: "  route <query>   Route a query through the memory pipeline", color: C.textMuted },
        { text: "  memories        Show stored memory count & index stats", color: C.textMuted },
        { text: "  status          System health and provider status", color: C.textMuted },
        { text: "  providers       List available LLM providers", color: C.textMuted },
        { text: "  clear           Clear terminal", color: C.textMuted },
      ]);
    } else if (cmd === "clear") {
      setLines([]);
    } else if (cmd === "memories") {
      emit([
        { text: "Scanning memory index...", color: C.textDim },
        { text: "  FTS5 Index:     847 documents", color: C.cyan },
        { text: "  Categories:     12 namespaces", color: C.cyan },
        { text: "  Last indexed:   2 min ago", color: C.textMuted },
        { text: "  Storage:        SQLite (14.2 MB)", color: C.textMuted },
        { text: "  Index health:   OK ✓", color: C.green },
      ]);
    } else if (cmd === "status") {
      emit([
        { text: "Memory Router — System Status", color: C.green },
        { text: "  Engine:        Running ✓", color: C.green },
        { text: "  Memory store:  SQLite + FTS5", color: C.textMuted },
        { text: "  MCP server:    Connected (port 3847)", color: C.green },
        { text: "  Ollama:        localhost:11434 ✓", color: C.green },
        { text: "  Queries today: 142", color: C.textMuted },
        { text: "  Avg latency:   23ms (retrieval)", color: C.textMuted },
        { text: "  Token savings: ~47% avg", color: C.amber },
      ]);
    } else if (cmd === "providers") {
      emit([
        { text: "Configured LLM Providers:", color: C.green },
        { text: "  [1] Ollama (local)   llama3, codellama  ✓", color: C.green },
        { text: "  [2] Claude Sonnet    via API key         ✓", color: C.green },
        { text: "  [3] GPT-4o           via API key         ✓", color: C.green },
        { text: "  [4] Claude Haiku     via API key         ✓", color: C.green },
        { text: "  Routing: cost-optimized, local-first", color: C.textMuted },
      ]);
    } else if (cmd.startsWith("route ")) {
      const q = raw.trim().slice(6);
      if (!q) { emit([{ text: "Usage: route <your query>", color: C.amber }]); return; }
      const cat = q.toLowerCase().includes("code") || q.toLowerCase().includes("build") ? "Coding" : q.toLowerCase().includes("finance") || q.toLowerCase().includes("money") ? "Finance" : "General";
      const mdl = cat === "Coding" ? "Claude Sonnet" : cat === "Finance" ? "GPT-4o" : "Ollama (local)";
      const sav = cat === "Coding" ? "42%" : cat === "Finance" ? "38%" : "51%";
      const n = cat === "Coding" ? 5 : cat === "Finance" ? 3 : 4;
      emit([
        { text: "[1/4] Classifying query...", color: C.textDim },
        { text: `       Category: ${cat}`, color: C.cyan },
        { text: "[2/4] Searching memories (FTS5)...", color: C.textDim },
        { text: `       Found ${n} relevant memories (23ms)`, color: C.green },
        { text: "[3/4] Assembling context window...", color: C.textDim },
        { text: "       Prompt: 2,847 → 1,203 tokens", color: C.textMuted },
        { text: "[4/4] Routing to provider...", color: C.textDim },
        { text: `       Selected: ${mdl}`, color: C.purple },
        { text: "" },
        { text: "  ✓ Routed successfully", color: C.green },
        { text: `  Token savings: ${sav}   Cost: $0.0003`, color: C.amber },
      ]);
    } else {
      emit([
        { text: `Unknown command: "${cmd}"`, color: C.pink },
        { text: 'Type "help" for commands.', color: C.textDim },
      ]);
    }
  }, [emit]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !busy) exec(input);
    else if (e.key === "ArrowUp") { e.preventDefault(); if (cmdHist.length) { const i = Math.min(histIdx + 1, cmdHist.length - 1); setHistIdx(i); setInput(cmdHist[i]); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (histIdx > 0) { setHistIdx(histIdx - 1); setInput(cmdHist[histIdx - 1]); } else { setHistIdx(-1); setInput(""); } }
  };

  return (
    <div className="p-3 sm:p-4" style={{ borderTop: `1px solid ${C.border}`, background: "#0a0e12" }}>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.purple }}>▶ INTERACTIVE TERMINAL</p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: C.green }} />
          <span className="text-sm sm:text-base" style={{ color: C.textDim }}>v0.3.1</span>
        </div>
      </div>

      <div
        onClick={() => inputRef.current?.focus()}
        ref={scrollRef}
        className="h-40 cursor-text overflow-y-auto p-2 font-[family-name:var(--font-vt)] sm:h-56 sm:p-3"
        style={{ background: C.bg, border: `1px solid ${C.border}` }}
      >
        {lines.map((l, i) =>
          l.isCmd ? (
            <p key={i} className="text-sm sm:text-lg"><span style={{ color: C.green }}>C:\memory-router&gt;</span> <span style={{ color: C.text }}>{l.text}</span></p>
          ) : (
            <p key={i} className="text-sm sm:text-lg" style={{ color: l.color || C.textMuted, minHeight: l.text ? undefined : "1.25em" }}>{l.text}</p>
          ),
        )}
        {!busy && (
          <div className="flex items-center text-sm sm:text-lg">
            <span className="shrink-0" style={{ color: C.green }}>C:\memory-router&gt;&nbsp;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => !busy && setInput(e.target.value)}
              onKeyDown={onKey}
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent outline-none"
              style={{ color: C.text, caretColor: C.green }}
              aria-label="Terminal input"
            />
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm sm:gap-x-3 sm:text-base" style={{ color: C.textDim }}>
        Try:
        {[
          { cmd: "route How does memory routing work?", label: "route", color: C.purple },
          { cmd: "memories", label: "memories", color: C.cyan },
          { cmd: "status", label: "status", color: C.green },
          { cmd: "help", label: "help", color: C.amber },
        ].map(s => (
          <button key={s.label} onClick={() => !busy && exec(s.cmd)} className="underline transition hover:opacity-80" style={{ color: s.color }}>{s.label}</button>
        ))}
      </div>
    </div>
  );
}

/* ═══ SKILLS ═════════════════════════════════════════════ */

function SkillsScreen() {
  const colors = ["rgba(107,197,232,0.45)", "rgba(139,231,139,0.45)", "rgba(232,114,154,0.45)", "rgba(245,177,76,0.45)", "rgba(169,112,255,0.45)"];
  return (
    <div>
      <Cmd text="skills &amp; tools" />
      <div className="mt-4 flex flex-col gap-4 sm:gap-6 lg:flex-row">
        <div className="flex-1">
          <div className="p-3 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.bg }}>
            <p className="mb-3 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: C.cyan }}>Skills</p>
            <div className="space-y-2 sm:space-y-2.5">
              {skillBars.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="mb-0.5 flex items-center justify-between">
                    <p className="text-sm sm:text-base" style={{ color: C.textMuted }}>{s.name}</p>
                    <p className="text-xs sm:text-sm" style={{ color: C.textDim }}>{s.pct}%</p>
                  </div>
                  <div className="h-2.5 sm:h-3" style={{ background: `rgba(245,241,232,0.04)` }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.6, delay: i * 0.04 }} className="h-full"
                      style={{ backgroundImage: `repeating-linear-gradient(90deg, ${colors[i % 5]} 0 7px, transparent 7px 10px)` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:w-[280px]">
          <div className="p-3 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.bg }}>
            <p className="mb-3 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: C.pink }}>Tools I Use</p>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {tools.map((tool, i) => (
                <motion.div key={tool.name} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                  className="flex flex-col items-center gap-1 p-2 transition hover:opacity-80 sm:gap-1.5 sm:p-2.5" style={{ border: `1px solid ${C.borderLight}`, background: C.surfaceAlt }}>
                  <tool.icon size={20} style={{ color: tool.color }} />
                  <span className="text-center text-[10px] sm:text-xs" style={{ color: C.textDim }}>{tool.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 p-2 sm:p-3" style={{ border: `1px solid ${C.border}`, background: C.bg }}>
        <p className="font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: C.amber }}>Currently Learning...</p>
        <div className="mt-2 flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm" style={{ color: C.green, opacity: 0.5 }}>C:\&gt;</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm" style={{ color: C.textMuted }}>Agentic AI, product analytics, and AI-native product design</p>
            <div className="mt-1 h-2.5 sm:h-3" style={{ background: `rgba(245,241,232,0.04)` }}>
              <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1.2 }}
                className="h-full" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${C.pink} 0 6px, transparent 6px 9px)` }} />
            </div>
          </div>
        </div>
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
      if (res.ok) { setStatus("sent"); setForm({ name: "", email: "", message: "" }); setTimeout(() => setStatus("idle"), 4000); }
      else { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); }
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); }
  };

  const inputStyle = { border: `1px solid ${C.border}`, background: C.bg, color: C.textMuted };

  return (
    <div>
      <Cmd text="contact me" />
      <h2 className="mt-3 font-[family-name:var(--font-pixel)] text-lg sm:text-xl lg:text-2xl" style={{ color: C.text, textShadow: `0 0 20px rgba(169,112,255,0.15)` }}>Let&apos;s connect!</h2>
      <p className="mt-2 text-sm sm:text-base lg:text-lg" style={{ color: C.textDim }}>Always open to discussing interesting opportunities in business analysis, product, and technology.</p>
      <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:gap-6 md:flex-row">
        <div className="space-y-3 sm:space-y-4 md:w-64">
          {[
            { label: "EMAIL", value: "itsmepriyanshu36@gmail.com", Icon: Mail, color: C.pink, href: "mailto:itsmepriyanshu36@gmail.com" },
            { label: "LINKEDIN", value: "/in/priyanshu-patel", Icon: Linkedin, color: "#0077B5", href: "https://www.linkedin.com/in/priyanshu-patel-069331200/" },
            { label: "GITHUB", value: "/zucc12309", Icon: Github, color: C.text, href: "https://github.com/zucc12309" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 transition hover:opacity-80">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9" style={{ border: `1px solid ${C.border}`, background: C.bg }}>
                <s.Icon size={16} style={{ color: s.color }} />
              </span>
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: C.textDim }}>{s.label}</p>
                <p className="truncate text-xs sm:text-sm" style={{ color: C.textMuted }}>{s.value}</p>
              </div>
            </a>
          ))}
          <div className="pt-3" style={{ borderTop: `1px solid ${C.borderLight}` }}>
            <p className="text-xs sm:text-sm" style={{ color: C.textDim }}>📍 Based in Bengaluru, India</p>
          </div>
        </div>
        <div className="flex-1 p-3 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.bg }}>
          <p className="mb-3 text-center font-[family-name:var(--font-pixel)] text-[10px] sm:mb-4 sm:text-xs" style={{ color: C.textDim }}>SEND A MESSAGE  :)</p>
          <div className="space-y-2 sm:space-y-3">
            <input type="text" placeholder="NAME" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 font-[family-name:var(--font-vt)] text-sm outline-none transition placeholder:opacity-30 focus:border-purple-400/30 sm:py-2.5 sm:text-base" style={inputStyle} />
            <input type="email" placeholder="EMAIL" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 font-[family-name:var(--font-vt)] text-sm outline-none transition placeholder:opacity-30 focus:border-purple-400/30 sm:py-2.5 sm:text-base" style={inputStyle} />
            <textarea placeholder="MESSAGE" rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="w-full resize-none px-3 py-2 font-[family-name:var(--font-vt)] text-sm outline-none transition placeholder:opacity-30 focus:border-purple-400/30 sm:py-2.5 sm:text-base" style={inputStyle} />
            <button onClick={handleSubmit} disabled={status === "sending"} className="w-full py-2 font-[family-name:var(--font-pixel)] text-[10px] tracking-wider transition hover:opacity-80 disabled:opacity-50 sm:py-2.5 sm:text-xs"
              style={{ border: `1px solid rgba(169,112,255,0.25)`, background: `rgba(169,112,255,0.08)`, color: C.purple }}>
              {status === "sending" ? "SENDING..." : status === "sent" ? "✓ MESSAGE SENT!" : status === "error" ? "✕ RETRY" : "▶ SEND MESSAGE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ RECRUITER MODE ════════════════════════════════════ */

function RecruiterMode({ exit, time, music }: { exit: () => void; time: string; music: MusicControls }) {
  return (
    <div className="flex h-[100dvh] flex-col font-[family-name:var(--font-vt)]" style={{ background: C.bg, color: C.text }}>
      <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5" style={{ borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div className="flex min-w-0 items-center gap-2">
          <Eye size={14} style={{ color: C.green }} />
          <span className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.green }}>RECRUITER MODE</span>
          <span className="hidden text-sm sm:inline" style={{ color: C.textDim }}>— 30-second overview</span>
        </div>
        <button onClick={exit} className="flex shrink-0 items-center gap-1 px-2 py-1 text-xs transition hover:opacity-80 sm:px-2.5 sm:text-sm" style={{ border: `1px solid ${C.border}`, color: C.textDim }}>
          <EyeOff size={12} /> Exit
        </button>
      </div>

      <div className="mx-auto w-full max-w-[1400px] flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-pixel)] text-xl sm:text-2xl md:text-3xl lg:text-4xl" style={{ color: C.text }}>Priyanshu Patel</h1>
            <p className="mt-1 text-base sm:text-lg lg:text-xl" style={{ color: C.cyan }}>Business Analyst</p>
            <p className="text-sm sm:text-base lg:text-lg" style={{ color: C.textMuted }}>Digit Life Insurance · Bengaluru, India</p>
            <div className="mt-2 flex items-center gap-2">
              <Trophy size={14} style={{ color: C.amber }} />
              <span className="text-xs sm:text-sm" style={{ color: C.amber }}>Tech Titan Award Recipient</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/cv/priyanshu-patel-business-analyst-cv.pdf" className="flex items-center gap-1.5 px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm" style={{ border: `1px solid rgba(139,231,139,0.25)`, background: `rgba(139,231,139,0.08)`, color: C.green }}><Download size={12} /> Download CV</a>
            <a href="mailto:itsmepriyanshu36@gmail.com" className="flex items-center gap-1.5 px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm" style={{ border: `1px solid ${C.border}`, color: C.textDim }}><Mail size={12} /> Email</a>
            <a href="https://www.linkedin.com/in/priyanshu-patel-069331200/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm" style={{ border: `1px solid ${C.border}`, color: C.textDim }}><Linkedin size={12} /> LinkedIn</a>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed sm:mt-4 sm:text-base lg:text-lg" style={{ color: C.textMuted }}>
          Product &amp; data-focused Business Analyst. Led end-to-end SDLC for Group Life products supporting 1,500+ Cr premium portfolio and 2L+ monthly transactions. Strong in SQL-driven analysis, API design, GAP analysis, and workflow automation.
        </p>

        <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-2">
          <div className="p-3 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.surfaceAlt }}>
            <p className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.cyan }}>CORE SKILLS</p>
            <div className="mt-2 flex flex-wrap gap-1 sm:gap-1.5">
              {["Requirements & BRD/SRS", "SQL & Data Analysis", "API Integration", "UAT & Test Cases", "GAP Analysis", "Stakeholder Management", "Agile/Scrum", "Workflow Automation", "Python", "Process Improvement"].map(s => (
                <span key={s} className="px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm" style={{ border: `1px solid ${C.border}`, background: C.bg, color: C.textMuted }}>{s}</span>
              ))}
            </div>
            <p className="mt-3 font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.pink }}>TOOLS</p>
            <div className="mt-2 flex flex-wrap gap-1 sm:gap-1.5">
              {["Jira", "Confluence", "Postman", "SQL Server", "Power BI", "DBeaver", "Camunda", "Excel", "n8n", "Git"].map(t => (
                <span key={t} className="px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm" style={{ border: `1px solid ${C.border}`, background: C.bg, color: C.textMuted }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="p-3 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.surfaceAlt }}>
            <p className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.amber }}>EXPERIENCE</p>
            <div className="mt-2 space-y-3">
              {jobs.map(j => (
                <div key={j.co}>
                  <p className="text-sm font-bold sm:text-base" style={{ color: C.textMuted }}>{j.role}</p>
                  <p className="text-xs sm:text-sm" style={{ color: C.cyan }}>{j.co} · {j.period}</p>
                  <p className="mt-1 text-xs sm:text-sm" style={{ color: C.textDim }}>{j.bullets[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:grid-cols-2">
          <div className="p-3 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.surfaceAlt }}>
            <p className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.purple }}>EDUCATION</p>
            <div className="mt-2 space-y-1.5">
              {education.map(e => (
                <p key={e.deg} className="text-xs sm:text-sm" style={{ color: C.textMuted }}>{e.deg} · {e.gpa} <span style={{ color: C.textDim }}>({e.year})</span></p>
              ))}
            </div>
          </div>
          <div className="p-3 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.surfaceAlt }}>
            <p className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.purple }}>CERTIFICATIONS</p>
            <div className="mt-2 space-y-1">
              {certs.map(c => <p key={c} className="text-xs sm:text-sm" style={{ color: C.textMuted }}>{c}</p>)}
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 sm:mt-4 sm:p-4" style={{ border: `1px solid ${C.border}`, background: C.surfaceAlt }}>
          <p className="font-[family-name:var(--font-pixel)] text-[10px] sm:text-xs" style={{ color: C.pink }}>PERSONAL PROJECTS <span style={{ color: C.textDim }}>(built independently, not company work)</span></p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {builderProjects.map(pr => (
              <div key={pr.id} className="p-2 sm:p-3" style={{ border: `1px solid ${C.borderLight}`, background: C.bg, borderTopColor: pr.color, borderTopWidth: 2 }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold sm:text-sm" style={{ color: C.textMuted }}>{pr.title}</p>
                  <StatusBadge status={pr.status} />
                </div>
                <p className="mt-1 text-[10px] leading-relaxed sm:text-xs" style={{ color: C.textDim }}>{pr.problem.split(".")[0]}.</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {pr.stack.slice(0, 3).map(t => <span key={t} className="text-[10px]" style={{ color: C.textDim }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-1.5 sm:px-4" style={{ borderTop: `1px solid ${C.border}`, background: C.surface }}>
        <span className="text-xs sm:text-sm" style={{ color: `rgba(139,231,139,0.6)` }}>Recruiter Mode Active</span>
        {/* Music controls in recruiter mode too */}
        <div className="flex items-center gap-2">
          <button onClick={music.playing ? music.pause : music.start} className="flex h-5 w-5 items-center justify-center rounded-full" style={{ border: `1px solid rgba(169,112,255,0.3)`, background: `rgba(169,112,255,0.1)`, color: C.purple }}>
            {music.playing ? <Pause size={8} /> : <Play size={8} />}
          </button>
          <button onClick={music.toggleMute} className="transition hover:opacity-80" style={{ color: C.textDim }}>
            {music.muted ? <VolumeX size={11} /> : <Volume2 size={11} />}
          </button>
          <span className="text-xs sm:text-sm" style={{ color: C.textDim }}>{time}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══ TASKBAR ════════════════════════════════════════════ */

function Taskbar({ screen, nav, time }: { screen: Screen; nav: (s: Screen) => void; time: string }) {
  const tabs: { id: Screen; label: string; short: string }[] = [
    { id: "about", label: "about", short: "abt" },
    { id: "digit", label: "digit", short: "dig" },
    { id: "builder", label: "builder", short: "bld" },
    { id: "skills", label: "skills", short: "skl" },
    { id: "contact", label: "contact", short: "msg" },
  ];
  return (
    <div className="flex items-center gap-0.5 px-1 py-1 sm:gap-1 sm:px-2 sm:py-1.5" style={{ borderTop: `1px solid rgba(139,231,139,0.2)`, background: `linear-gradient(${C.surface}, #0d1117)` }}>
      <button onClick={() => nav("home")} className="flex shrink-0 items-center gap-1.5 px-2 py-1 font-[family-name:var(--font-pixel)] text-[10px] transition sm:gap-2 sm:px-3 sm:text-xs"
        style={screen === "home" ? { border: `1px solid rgba(139,231,139,0.15)`, background: `rgba(139,231,139,0.08)`, color: C.green } : { border: `1px solid ${C.border}`, background: C.bg, color: C.textDim }}>
        <span className="grid grid-cols-2 gap-[2px]">
          <span className="block h-[4px] w-[4px] sm:h-[5px] sm:w-[5px]" style={{ background: C.pink }} /><span className="block h-[4px] w-[4px] sm:h-[5px] sm:w-[5px]" style={{ background: C.green }} />
          <span className="block h-[4px] w-[4px] sm:h-[5px] sm:w-[5px]" style={{ background: C.cyan }} /><span className="block h-[4px] w-[4px] sm:h-[5px] sm:w-[5px]" style={{ background: C.amber }} />
        </span>
        <span className="hidden xs:inline">Start</span>
      </button>
      <div className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto sm:gap-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => nav(t.id)}
            className="shrink-0 px-1.5 py-1 text-xs transition sm:px-3 sm:text-sm"
            style={screen === t.id ? { border: `1px solid rgba(245,241,232,0.12)`, background: `rgba(245,241,232,0.08)`, color: C.text } : { border: `1px solid ${C.borderLight}`, background: C.bg, color: C.textDim }}>
            <span className="sm:hidden">{t.short}</span>
            <span className="hidden sm:inline">{t.label}.exe</span>
          </button>
        ))}
      </div>
      <div className="hidden shrink-0 px-2 py-1 text-xs sm:block sm:px-3 sm:text-sm" style={{ border: `1px solid ${C.border}`, background: C.bg, color: C.textDim }}>{time}</div>
    </div>
  );
}

/* ═══ HELPERS ════════════════════════════════════════════ */

function Cmd({ text }: { text: string }) {
  return <p className="text-base sm:text-lg"><span style={{ color: C.green, opacity: 0.5 }}>C:\&gt;</span> <span className="font-bold" style={{ color: C.green }} dangerouslySetInnerHTML={{ __html: text }} /></p>;
}

function StatusBadge({ status }: { status: "Active" | "Complete" | "Experimental" }) {
  const colors = { Active: C.green, Complete: C.cyan, Experimental: C.amber };
  return (
    <span className="flex items-center gap-1 text-[10px] sm:text-xs" style={{ color: colors[status] }}>
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: colors[status] }} />
      {status}
    </span>
  );
}

/* Pixel-art retro PC: monitor with smiley, CPU tower, keyboard, coffee mug */
function RetroPC() {
  return (
    <svg viewBox="0 0 160 140" className="h-24 w-28 sm:h-36 sm:w-44 lg:h-44 lg:w-52" style={{ imageRendering: "pixelated" }}>
      <rect x="4" y="30" width="34" height="75" rx="1" fill="#3a3530" stroke="#2a2520" strokeWidth="1" />
      <rect x="6" y="32" width="30" height="71" rx="1" fill="#4a4540" />
      <rect x="9" y="36" width="24" height="8" rx="0.5" fill="#2a2520" stroke="#1a1510" strokeWidth="0.5" />
      <rect x="9" y="47" width="24" height="8" rx="0.5" fill="#2a2520" stroke="#1a1510" strokeWidth="0.5" />
      <rect x="9" y="58" width="24" height="5" rx="0.5" fill="#2a2520" stroke="#1a1510" strokeWidth="0.5" />
      <line x1="11" y1="40" x2="31" y2="40" stroke="#1a1510" strokeWidth="0.5" />
      <line x1="11" y1="51" x2="31" y2="51" stroke="#1a1510" strokeWidth="0.5" />
      <rect x="28" y="38" width="3" height="2" rx="0.3" fill="#5a5550" />
      <rect x="28" y="49" width="3" height="2" rx="0.3" fill="#5a5550" />
      <circle cx="21" cy="94" r="3" fill="#2a2520" stroke="#1a1510" strokeWidth="0.5" />
      <circle cx="21" cy="94" r="2" fill="#3a3530" />
      <motion.circle cx="13" cy="94" r="1.5" fill={C.green} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      <rect x="44" y="6" width="76" height="62" rx="3" fill="#3a3530" stroke="#2a2520" strokeWidth="1.5" />
      <rect x="46" y="8" width="72" height="58" rx="2" fill="#4a4540" />
      <rect x="52" y="12" width="60" height="46" rx="1" fill="#1a1510" />
      <rect x="54" y="14" width="56" height="42" fill="#0a1a0a" />
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`sl${i}`} x1="54" y1={14 + i * 4.2} x2="110" y2={14 + i * 4.2} stroke="#0f250f" strokeWidth="0.5" />
      ))}
      <motion.rect x="70" y="24" width="4" height="6" fill={C.green} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.rect x="90" y="24" width="4" height="6" fill={C.green} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.path d="M72 38 Q82 48 92 38" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round"
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} />
      <rect x="74" y="60" width="16" height="3" rx="0.5" fill="#5a5550" />
      <motion.circle cx="68" cy="61.5" r="1.2" fill={C.green} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
      <rect x="72" y="68" width="20" height="6" fill="#3a3530" stroke="#2a2520" strokeWidth="0.5" />
      <rect x="66" y="74" width="32" height="3" rx="1" fill="#3a3530" stroke="#2a2520" strokeWidth="0.5" />
      <rect x="44" y="82" width="76" height="18" rx="2" fill="#3a3530" stroke="#2a2520" strokeWidth="1" />
      <rect x="46" y="84" width="72" height="14" rx="1" fill="#4a4540" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={`k1${i}`} x={48 + i * 5.5} y="86" width="4" height="3" rx="0.3" fill="#5a5550" stroke="#2a2520" strokeWidth="0.3" />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <rect key={`k2${i}`} x={50 + i * 5.5} y="91" width="4" height="3" rx="0.3" fill="#5a5550" stroke="#2a2520" strokeWidth="0.3" />
      ))}
      <rect x="60" y="96" width="24" height="2.5" rx="0.3" fill="#5a5550" stroke="#2a2520" strokeWidth="0.3" />
      <rect x="128" y="86" width="14" height="16" rx="2" fill="#4a4038" stroke="#3a3028" strokeWidth="1" />
      <path d="M142 90 Q148 90 148 94 Q148 98 142 98" fill="none" stroke="#3a3028" strokeWidth="1.5" />
      <rect x="129" y="88" width="12" height="3" rx="1" fill="#2a1a0a" />
      <motion.path d="M133 84 Q134 80 133 76" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.2"
        animate={{ opacity: [0.1, 0.3, 0.1], y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.path d="M137 84 Q138 79 137 75" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.2"
        animate={{ opacity: [0.15, 0.35, 0.15], y: [0, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <rect x="54" y="14" width="56" height="42" fill="url(#screenGlow)" opacity="0.15" />
      <defs>
        <radialGradient id="screenGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor={C.green} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
}
