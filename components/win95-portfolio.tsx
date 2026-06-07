"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Linkedin, Github, Figma, Database, BarChart3,
  Code2, GitBranch, FileSpreadsheet, MessageSquare, Workflow,
  Terminal, PenTool, Send, Pause, Play, Download, Eye, EyeOff,
  SkipBack, SkipForward, Volume2, VolumeX, Trophy, Lightbulb,
  Target, Wrench, BookOpen, Award, Briefcase, Rocket,
} from "lucide-react";

type Screen = "home" | "about" | "digit" | "builder" | "skills" | "contact";

/* ═══ DATA ════════════════════════════════════════════════ */

/* --- Professional work (DIGIT.EXE) --- */
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

/* --- Personal projects (BUILDER.EXE) --- */
const builderProjects = [
  {
    id: "01", title: "MEMORY ROUTER", color: "#ff6b9d",
    problem: "LLM workflows resend too much context, lose durable memory, and force users to choose between privacy and capability.",
    solution: "A local-first memory and routing layer that retrieves relevant knowledge, assembles a compact prompt, and sends it to the right provider.",
    stack: ["Python", "SQLite", "FTS5", "MCP", "Ollama"],
    learnings: ["AI products need strong defaults before more controls", "Local-first infrastructure changes the trust story of personal AI tools", "Routing is a product surface, not just an optimization technique"],
    repo: "https://github.com/zucc12309/memory-router",
  },
  {
    id: "02", title: "RIDECOMPARE", color: "#39ff14",
    problem: "Ride pricing is fragmented across apps. Users waste time checking providers manually without knowing which option is actually best.",
    solution: "A mobile comparison layer that estimates fares, highlights savings, tracks accuracy, and deep-links into provider apps.",
    stack: ["Flutter", "Node.js", "PostgreSQL", "Google Maps API"],
    learnings: ["Consumer AI has to earn trust through clear comparisons", "Pricing systems need feedback loops, not static formulas", "Mobile UX improves when recommendations explain the tradeoff"],
    repo: undefined,
  },
  {
    id: "03", title: "AI LIFEADMIN OS", color: "#00d4ff",
    problem: "Life administration is scattered across email, documents, subscriptions, calendars, and payment reminders — creating missed renewals and hidden work.",
    solution: "An AI-native command center that extracts obligations, prioritizes tasks, and coordinates specialized agents with human review.",
    stack: ["React", "Node.js", "Redis", "PostgreSQL", "LLM APIs"],
    learnings: ["The inbox is the best entry point for personal automation", "Agent products need review queues and confidence states", "Premium UX matters more when the product touches money and documents"],
    repo: undefined,
  },
  {
    id: "04", title: "CRM WORKFLOW", color: "#ffd700",
    problem: "CRM export data requires manual cleaning, formatting, and reporting before it becomes useful for stakeholders and dashboards.",
    solution: "A workflow layer that orchestrates CRM actions, tracks outcomes, and gives operators visibility into process performance.",
    stack: ["n8n", "Python", "Power BI", "Gmail API"],
    learnings: ["Automation is only valuable when it fits the process owner's mental model", "Reporting should explain bottlenecks, not just count activity", "The best workflow products make handoffs visible"],
    repo: "https://github.com/zucc12309/CRM-workflow-automation",
  },
];

/* --- Skills --- */
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

  if (recruiterMode) return <RecruiterMode exit={() => setRecruiterMode(false)} time={time} />;

  return (
    <div className="flex h-[100dvh] flex-col font-[family-name:var(--font-vt)] text-white" style={{ background: "linear-gradient(135deg, #0a0010 0%, #0d0020 30%, #080018 60%, #050010 100%)" }}>
      <div className="pointer-events-none fixed inset-0 z-50 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)" }} />
      <div className="pointer-events-none fixed inset-0 z-40" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />

      <div className="relative flex-1 overflow-hidden p-1 sm:p-2">
        <AnimatePresence mode="wait">
          <motion.div key={screen} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.12 }} className="flex h-full flex-col">
            <div className="flex shrink-0 items-center justify-between border border-white/10 px-3 py-1" style={{ background: "linear-gradient(90deg, #1a0a3a, #2d1560 50%, #1a0a3a)" }}>
              <span className="font-[family-name:var(--font-pixel)] text-[10px] text-white/80">{titles[screen]}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setRecruiterMode(true)} className="flex items-center gap-1 border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/30 transition hover:border-[#39ff14]/30 hover:text-[#39ff14]">
                  <Eye size={10} /> Recruiter
                </button>
                <div className="flex gap-1">
                  {["─", "□", "×"].map((c, i) => (
                    <span key={c} className={`flex h-4 w-5 items-center justify-center border text-[10px] leading-none ${i === 2 ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-white/10 bg-white/5 text-white/30"}`}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto border-x border-white/10 p-4 sm:p-5" style={{ background: "linear-gradient(180deg, rgba(15,5,40,0.97), rgba(10,3,25,0.98))" }}>
              {screen === "home" && <HomeScreen nav={setScreen} />}
              {screen === "about" && <AboutScreen />}
              {screen === "digit" && <DigitScreen />}
              {screen === "builder" && <BuilderScreen />}
              {screen === "skills" && <SkillsScreen />}
              {screen === "contact" && <ContactScreen />}
            </div>
            <div className="flex shrink-0 items-center justify-between border border-white/10 px-3 py-0.5" style={{ background: "linear-gradient(90deg, #1a0a3a, #2d1560 50%, #1a0a3a)" }}>
              <span className="text-sm text-[#39ff14]/60">C:\&gt;</span>
              <span className="text-sm text-white/30">{time}</span>
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
    <div className="flex h-[100dvh] items-center justify-center font-[family-name:var(--font-vt)]" style={{ background: "#050010" }}>
      <div className="w-full max-w-xl space-y-2 px-6 text-lg text-[#39ff14]">
        {lines.filter((_, i) => p > i * 14).map(l => <p key={l} className={l.includes("✓") ? "text-[#ffd700]" : ""}>{l}</p>)}
        <div className="mt-6 h-6 border border-[#39ff14]/30 p-[3px]">
          <div style={{ width: `${p}%`, backgroundImage: "repeating-linear-gradient(90deg,#39ff14 0 8px,transparent 8px 11px)" }} className="h-full transition-[width] duration-100" />
        </div>
        <p className="text-base text-[#39ff14]/40">{p}% loaded</p>
      </div>
    </div>
  );
}

/* ═══ HOME — Redesigned with dual-track ═════════════════ */

function HomeScreen({ nav }: { nav: (s: Screen) => void }) {
  const music = useSynthPlayer();

  return (
    <div className="flex h-full flex-col gap-4 md:flex-row md:gap-6">
      {/* Left sidebar */}
      <div className="flex shrink-0 flex-row gap-1 overflow-x-auto md:w-40 md:flex-col md:justify-between md:overflow-visible">
        <div>
          <p className="mb-3 hidden font-[family-name:var(--font-pixel)] text-lg text-[#39ff14] md:block">&gt;_</p>
          <nav className="flex gap-0.5 md:flex-col md:gap-1">
            {([["home", "HOME"], ["about", "ABOUT"], ["digit", "DIGIT.EXE"], ["builder", "BUILDER.EXE"], ["skills", "SKILLS"], ["contact", "CONTACT"]] as const).map(([id, label]) => (
              <button key={id} onClick={() => nav(id as Screen)} className="whitespace-nowrap px-2 py-1 text-left text-base text-white/25 transition hover:text-white/50 md:px-0 md:py-1">
                {label}
              </button>
            ))}
          </nav>
        </div>
        {/* Now Playing */}
        <div className="hidden shrink-0 border border-white/10 bg-black/50 p-3 md:block">
          <p className="font-[family-name:var(--font-pixel)] text-[8px] uppercase tracking-widest text-white/25">Now Playing</p>
          <p className="mt-1 text-base text-white/50">Synthwave Dreams</p>
          <p className="text-sm text-white/25">Lo-fi Focus Mix</p>
          <div className="mt-2 flex items-end gap-[3px]">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div key={i} animate={music.playing ? { height: [4, 2 + Math.random() * 14, 4] } : { height: 3 }}
                transition={music.playing ? { duration: 0.3 + Math.random() * 0.3, repeat: Infinity, repeatType: "mirror" } : {}}
                className="w-[3px] rounded-sm" style={{ background: "linear-gradient(180deg, #ff6b9d, #a855f7)", height: 3 }} />
            ))}
          </div>
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

      {/* Main hero — redesigned */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div>
            <p className="text-lg text-[#00d4ff]">Hello!</p>
            <p className="mt-1 text-xl text-white/60">I&apos;m</p>
            <h1 className="font-[family-name:var(--font-pixel)] text-3xl leading-relaxed text-white sm:text-4xl lg:text-5xl" style={{ textShadow: "0 0 40px rgba(168,85,247,0.3), 3px 3px 0 rgba(168,85,247,0.4)" }}>
              Priyanshu<br />Patel
            </h1>
          </div>
          {/* Retro computer pixel art */}
          <div className="shrink-0" style={{ imageRendering: "pixelated" }}>
            <RetroPC />
          </div>
        </div>
        <p className="mt-2 text-base text-white/50">Business Analyst at <span className="text-[#39ff14]">Digit Life Insurance</span></p>
        <p className="mt-1 text-sm text-white/30">Building AI-native products and workflow systems independently.</p>
        <p className="mt-1 text-sm text-white/25">MBA Finance + B.Tech CSE</p>

        {/* Tech Titan Award — prominent */}
        <div className="mt-4 inline-flex w-fit items-center gap-2 border border-[#ffd700]/25 bg-[#ffd700]/5 px-4 py-2">
          <Trophy size={16} className="text-[#ffd700]" />
          <span className="font-[family-name:var(--font-pixel)] text-[9px] text-[#ffd700]">TECH TITAN AWARD RECIPIENT</span>
          <span className="text-sm text-[#ffd700]/50">— Digit Life Insurance</span>
        </div>

        {/* Dual-track navigation */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:max-w-lg">
          <button onClick={() => nav("digit")} className="group border border-[#00d4ff]/25 bg-[#00d4ff]/5 p-4 text-left transition hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/10">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-[#00d4ff]" />
              <span className="font-[family-name:var(--font-pixel)] text-[10px] text-[#00d4ff]">DIGIT.EXE</span>
            </div>
            <p className="mt-2 text-sm text-white/35">Professional Career</p>
            <p className="text-[11px] text-white/20">Experience · Impact · Skills</p>
          </button>
          <button onClick={() => nav("builder")} className="group border border-[#ff6b9d]/25 bg-[#ff6b9d]/5 p-4 text-left transition hover:border-[#ff6b9d]/40 hover:bg-[#ff6b9d]/10">
            <div className="flex items-center gap-2">
              <Rocket size={16} className="text-[#ff6b9d]" />
              <span className="font-[family-name:var(--font-pixel)] text-[10px] text-[#ff6b9d]">BUILDER.EXE</span>
            </div>
            <p className="mt-2 text-sm text-white/35">Personal Projects</p>
            <p className="text-[11px] text-white/20">What I build independently</p>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => nav("skills")} className="border border-white/10 px-4 py-2 font-[family-name:var(--font-pixel)] text-[9px] text-white/30 transition hover:text-white/50">SKILLS</button>
          <button onClick={() => nav("contact")} className="border border-white/10 px-4 py-2 font-[family-name:var(--font-pixel)] text-[9px] text-white/30 transition hover:text-white/50">CONTACT</button>
          <a href="/cv/priyanshu-patel-business-analyst-cv.pdf" className="flex items-center gap-1.5 border border-white/10 px-4 py-2 font-[family-name:var(--font-pixel)] text-[9px] text-white/30 transition hover:text-white/50">
            <Download size={10} /> RESUME
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
      <div className="mt-4 flex flex-col gap-6 md:flex-row">
        <div className="shrink-0 space-y-4 md:w-56">
          <div className="border border-white/10 bg-black/50 p-3">
            <div className="border border-[#39ff14]/10 bg-black p-3">
              <p className="text-base text-[#39ff14]">&gt;_ me.txt</p>
              <p className="text-sm text-white/20">loading...</p>
              <p className="text-sm text-[#00d4ff]">ready.</p>
              <p className="my-1 text-white/10">───────────────</p>
              <p className="text-sm text-white/35">MBA Finance + B.Tech CSE</p>
              <p className="text-sm text-white/35">Business Analyst</p>
              <p className="text-sm text-white/35">Digit Life Insurance</p>
              <p className="text-sm text-white/35">Bengaluru, India</p>
            </div>
          </div>
          <div className="border border-white/10 p-3">
            <p className="mb-2 font-[family-name:var(--font-pixel)] text-[8px] uppercase tracking-widest text-white/30">Interests</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[{ icon: BarChart3, label: "Data Analysis" }, { icon: Workflow, label: "Process Design" }, { icon: Terminal, label: "AI Tools" }, { icon: PenTool, label: "Finance" }].map(f => (
                <div key={f.label} className="flex flex-col items-center gap-1 border border-white/5 bg-black/40 p-2">
                  <f.icon size={20} className="text-[#a855f7]" />
                  <span className="text-center text-[10px] text-white/30">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-[family-name:var(--font-pixel)] text-xl text-white" style={{ textShadow: "0 0 20px rgba(255,107,157,0.2)" }}>Who am I?</h2>
          <div className="mt-4 space-y-3 text-base leading-relaxed text-white/40">
            <p>Product &amp; data-focused Business Analyst at <span className="text-[#39ff14]">Digit Life Insurance</span>. I translate business requirements into technical solutions, perform SQL-driven analysis, and deliver automation that improves accuracy and reduces manual effort.</p>
            <p>Outside work, I independently build products — from AI infrastructure tools to mobile apps. These personal projects reflect my product thinking and technical curiosity, not my professional work.</p>
            <p>Strong in system design, data analysis, and cross-functional execution across product, engineering, and operations teams.</p>
          </div>
          <div className="mt-5 border border-white/10 bg-black/40 p-4">
            <p className="mb-2 font-[family-name:var(--font-pixel)] text-[9px] text-[#ff6b9d]">system.info</p>
            <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {[["OS", "Business Analyst v2.0"], ["CPU", "MBA + B.Tech Dual Degree"], ["RAM", "MPSTME, Mumbai · 2025"], ["Award", "Tech Titan — Digit Life"], ["Mode", "Focused"], ["Side Projects", "4 shipped"], ["Coffee", "Many cups"], ["C:/ Drive", "Open to opportunities"]].map(([k, v]) => (
                <p key={k} className="text-white/25">{k}: <span className="text-white/50">{v}</span></p>
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
        <Briefcase size={18} className="text-[#00d4ff]" />
        <Cmd text="professional career" />
      </div>
      <p className="mt-2 text-sm text-white/25">What I do at work. Real roles, real impact.</p>

      <h2 className="mt-4 font-[family-name:var(--font-pixel)] text-lg text-white" style={{ textShadow: "0 0 15px rgba(0,212,255,0.15)" }}>Work Experience</h2>
      <div className="mt-3 space-y-3">
        {jobs.map((j, i) => (
          <motion.div key={j.co} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="border border-white/10 bg-black/40 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="text-base font-bold text-white">{j.role}</span>
                <span className="text-base text-white/30"> — {j.co}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/20">{j.period} · {j.loc}</span>
                {j.award && <span className="flex items-center gap-1 border border-[#ffd700]/25 bg-[#ffd700]/5 px-2 py-0.5 text-[10px] text-[#ffd700]"><Trophy size={10} /> {j.award}</span>}
              </div>
            </div>
            <ul className="mt-2 space-y-0.5">
              {j.bullets.map(b => <li key={b} className="text-sm leading-relaxed text-white/35">▸ {b}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>

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

      <p className="mb-2 mt-4 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest text-[#ffd700]">Certifications</p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {certs.map(c => <div key={c} className="border border-white/5 bg-black/30 px-3 py-2 text-sm text-white/35">▪ {c}</div>)}
      </div>

      <div className="mt-4 border border-[#ffd700]/15 bg-[#ffd700]/5 p-3">
        <p className="font-[family-name:var(--font-pixel)] text-[9px] text-[#ffd700]/60">Achievement</p>
        <p className="mt-1 text-sm text-white/40">Finalist — EY Young Leader&apos;s Business Case Study Competition 2024</p>
      </div>
    </div>
  );
}

/* ═══ BUILDER.EXE — Personal Projects ═══════════════════ */

function BuilderScreen() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Rocket size={18} className="text-[#ff6b9d]" />
        <Cmd text="personal projects" />
      </div>
      <p className="mt-2 text-sm text-white/25">What I build independently, outside work. These are not company projects.</p>

      <div className="mt-4 space-y-4">
        {builderProjects.map((pr, idx) => (
          <motion.div key={pr.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            className="border border-white/10 bg-black/40 overflow-hidden" style={{ borderTopColor: pr.color, borderTopWidth: 3 }}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: pr.color }}>{pr.id}</span>
                  <span className="font-[family-name:var(--font-pixel)] text-[10px] tracking-wider text-white">{pr.title}</span>
                </div>
                {pr.repo && <a href={pr.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-white/20 transition hover:text-[#39ff14]"><Github size={12} /> CODE</a>}
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {/* Problem */}
                <div className="border border-white/5 bg-black/30 p-3">
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <Target size={12} className="text-[#ff6b9d]" />
                    <span className="font-[family-name:var(--font-pixel)] text-[8px] text-[#ff6b9d]">PROBLEM</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/35">{pr.problem}</p>
                </div>
                {/* Solution */}
                <div className="border border-white/5 bg-black/30 p-3">
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <Lightbulb size={12} className="text-[#39ff14]" />
                    <span className="font-[family-name:var(--font-pixel)] text-[8px] text-[#39ff14]">SOLUTION</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/35">{pr.solution}</p>
                </div>
              </div>

              {/* Stack */}
              <div className="mt-3 flex flex-wrap items-center gap-1">
                <Wrench size={10} className="text-white/15" />
                {pr.stack.map(t => <span key={t} className="border border-white/5 px-1.5 py-0.5 text-[10px] text-white/25">{t}</span>)}
              </div>

              {/* Learnings */}
              <div className="mt-3 border-t border-white/5 pt-3">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={10} className="text-[#ffd700]" />
                  <span className="font-[family-name:var(--font-pixel)] text-[8px] text-[#ffd700]">LEARNINGS</span>
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  {pr.learnings.map(l => <li key={l} className="text-[11px] leading-relaxed text-white/30">▸ {l}</li>)}
                </ul>
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
      <div className="mt-4 border border-white/10 bg-black/30 p-3">
        <p className="font-[family-name:var(--font-pixel)] text-[9px] uppercase tracking-widest text-[#ffd700]">Currently Learning...</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm text-[#39ff14]/50">C:\&gt;</span>
          <div className="flex-1">
            <p className="text-sm text-white/40">Agentic AI, product analytics, and AI-native product design</p>
            <div className="mt-1 h-3 bg-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1.2 }}
                className="h-full" style={{ backgroundImage: "repeating-linear-gradient(90deg, #ff6b9d 0 6px, transparent 6px 9px)" }} />
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

  return (
    <div>
      <Cmd text="contact me" />
      <h2 className="mt-3 font-[family-name:var(--font-pixel)] text-xl text-white" style={{ textShadow: "0 0 20px rgba(168,85,247,0.2)" }}>Let&apos;s connect!</h2>
      <p className="mt-2 text-base text-white/30">Always open to discussing interesting opportunities in business analysis, product, and technology.</p>
      <div className="mt-5 flex flex-col gap-6 md:flex-row">
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
        <div className="flex-1 border border-white/10 bg-black/40 p-4">
          <p className="mb-4 text-center font-[family-name:var(--font-pixel)] text-[10px] text-white/40">SEND A MESSAGE  :)</p>
          <div className="space-y-3">
            <input type="text" placeholder="NAME" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-white/10 bg-[#0a0018] px-3 py-2.5 font-[family-name:var(--font-vt)] text-base text-white/60 placeholder:text-white/15 outline-none transition focus:border-[#a855f7]/40" />
            <input type="email" placeholder="EMAIL" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border border-white/10 bg-[#0a0018] px-3 py-2.5 font-[family-name:var(--font-vt)] text-base text-white/60 placeholder:text-white/15 outline-none transition focus:border-[#a855f7]/40" />
            <textarea placeholder="MESSAGE" rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="w-full resize-none border border-white/10 bg-[#0a0018] px-3 py-2.5 font-[family-name:var(--font-vt)] text-base text-white/60 placeholder:text-white/15 outline-none transition focus:border-[#a855f7]/40" />
            <button onClick={handleSubmit} disabled={status === "sending"} className="w-full border border-[#a855f7]/30 bg-[#a855f7]/10 py-2.5 font-[family-name:var(--font-pixel)] text-[9px] tracking-wider text-[#a855f7] transition hover:bg-[#a855f7]/20 disabled:opacity-50">
              {status === "sending" ? "SENDING..." : status === "sent" ? "✓ MESSAGE SENT!" : status === "error" ? "✕ RETRY" : "▶ SEND MESSAGE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ RECRUITER MODE ════════════════════════════════════ */

function RecruiterMode({ exit, time }: { exit: () => void; time: string }) {
  return (
    <div className="flex h-[100dvh] flex-col bg-[#0a0a14] font-[family-name:var(--font-vt)] text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2" style={{ background: "linear-gradient(90deg, #1a0a3a, #2d1560 50%, #1a0a3a)" }}>
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-[#39ff14]" />
          <span className="font-[family-name:var(--font-pixel)] text-[10px] text-[#39ff14]">RECRUITER MODE</span>
          <span className="text-sm text-white/20">— 30-second overview</span>
        </div>
        <button onClick={exit} className="flex items-center gap-1 border border-white/10 px-2 py-1 text-sm text-white/30 transition hover:text-white/60">
          <EyeOff size={12} /> Exit
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Identity */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-pixel)] text-2xl text-white sm:text-3xl">Priyanshu Patel</h1>
            <p className="mt-1 text-lg text-[#00d4ff]">Business Analyst</p>
            <p className="text-base text-white/40">Digit Life Insurance · Bengaluru, India</p>
            <div className="mt-2 flex items-center gap-2">
              <Trophy size={14} className="text-[#ffd700]" />
              <span className="text-sm text-[#ffd700]">Tech Titan Award Recipient</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/cv/priyanshu-patel-business-analyst-cv.pdf" className="flex items-center gap-1.5 border border-[#39ff14]/30 bg-[#39ff14]/10 px-3 py-1.5 text-sm text-[#39ff14]"><Download size={12} /> Download CV</a>
            <a href="mailto:itsmepriyanshu36@gmail.com" className="flex items-center gap-1.5 border border-white/10 px-3 py-1.5 text-sm text-white/40"><Mail size={12} /> Email</a>
            <a href="https://www.linkedin.com/in/priyanshu-patel-069331200/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-white/10 px-3 py-1.5 text-sm text-white/40"><Linkedin size={12} /> LinkedIn</a>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/45">
          Product &amp; data-focused Business Analyst. Led end-to-end SDLC for Group Life products supporting 1,500+ Cr premium portfolio and 2L+ monthly transactions. Strong in SQL-driven analysis, API design, GAP analysis, and workflow automation.
        </p>

        {/* Skills & Experience in 2-col */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <p className="font-[family-name:var(--font-pixel)] text-[10px] text-[#00d4ff]">CORE SKILLS</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Requirements & BRD/SRS", "SQL & Data Analysis", "API Integration", "UAT & Test Cases", "GAP Analysis", "Stakeholder Management", "Agile/Scrum", "Workflow Automation", "Python", "Process Improvement"].map(s => (
                <span key={s} className="border border-white/10 bg-black/40 px-2 py-1 text-sm text-white/50">{s}</span>
              ))}
            </div>
            <p className="mt-3 font-[family-name:var(--font-pixel)] text-[10px] text-[#ff6b9d]">TOOLS</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Jira", "Confluence", "Postman", "SQL Server", "Power BI", "DBeaver", "Camunda", "Excel", "n8n", "Git"].map(t => (
                <span key={t} className="border border-white/10 bg-black/40 px-2 py-1 text-sm text-white/50">{t}</span>
              ))}
            </div>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <p className="font-[family-name:var(--font-pixel)] text-[10px] text-[#ffd700]">EXPERIENCE</p>
            <div className="mt-2 space-y-3">
              {jobs.map(j => (
                <div key={j.co}>
                  <p className="text-base font-bold text-white/70">{j.role}</p>
                  <p className="text-sm text-[#00d4ff]/60">{j.co} · {j.period}</p>
                  <p className="mt-1 text-sm text-white/30">{j.bullets[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education & Certs */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <p className="font-[family-name:var(--font-pixel)] text-[10px] text-[#a855f7]">EDUCATION</p>
            <div className="mt-2 space-y-1.5">
              {education.map(e => (
                <p key={e.deg} className="text-sm text-white/40">{e.deg} · {e.gpa} <span className="text-white/20">({e.year})</span></p>
              ))}
            </div>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-4">
            <p className="font-[family-name:var(--font-pixel)] text-[10px] text-[#a855f7]">CERTIFICATIONS</p>
            <div className="mt-2 space-y-1">
              {certs.map(c => <p key={c} className="text-sm text-white/35">{c}</p>)}
            </div>
          </div>
        </div>

        {/* Personal projects — clearly labeled */}
        <div className="mt-4 border border-white/10 bg-white/[0.02] p-4">
          <p className="font-[family-name:var(--font-pixel)] text-[10px] text-[#ff6b9d]">PERSONAL PROJECTS <span className="text-white/20">(built independently, not company work)</span></p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {builderProjects.map(pr => (
              <div key={pr.id} className="border border-white/5 bg-black/30 p-3" style={{ borderTopColor: pr.color, borderTopWidth: 2 }}>
                <p className="text-sm font-bold text-white/60">{pr.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/30">{pr.problem.split(".")[0]}.</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {pr.stack.slice(0, 3).map(t => <span key={t} className="text-[10px] text-white/20">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-1.5" style={{ background: "linear-gradient(90deg, #1a0a3a, #2d1560 50%, #1a0a3a)" }}>
        <span className="text-sm text-[#39ff14]/40">Recruiter Mode Active</span>
        <span className="text-sm text-white/20">{time}</span>
      </div>
    </div>
  );
}

/* ═══ TASKBAR ════════════════════════════════════════════ */

function Taskbar({ screen, nav, time }: { screen: Screen; nav: (s: Screen) => void; time: string }) {
  const tabs: { id: Screen; label: string }[] = [
    { id: "about", label: "about.exe" }, { id: "digit", label: "digit.exe" },
    { id: "builder", label: "builder.exe" }, { id: "skills", label: "skills.exe" }, { id: "contact", label: "contact.exe" },
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

/* Pixel-art retro PC: monitor with smiley, CPU tower, keyboard, coffee mug */
function RetroPC() {
  return (
    <svg viewBox="0 0 160 140" className="h-36 w-44 sm:h-44 sm:w-52" style={{ imageRendering: "pixelated" }}>
      {/* === CPU Tower (left) === */}
      <rect x="4" y="30" width="34" height="75" rx="1" fill="#3a3530" stroke="#2a2520" strokeWidth="1" />
      <rect x="6" y="32" width="30" height="71" rx="1" fill="#4a4540" />
      {/* Drive bays */}
      <rect x="9" y="36" width="24" height="8" rx="0.5" fill="#2a2520" stroke="#1a1510" strokeWidth="0.5" />
      <rect x="9" y="47" width="24" height="8" rx="0.5" fill="#2a2520" stroke="#1a1510" strokeWidth="0.5" />
      <rect x="9" y="58" width="24" height="5" rx="0.5" fill="#2a2520" stroke="#1a1510" strokeWidth="0.5" />
      {/* Drive slot lines */}
      <line x1="11" y1="40" x2="31" y2="40" stroke="#1a1510" strokeWidth="0.5" />
      <line x1="11" y1="51" x2="31" y2="51" stroke="#1a1510" strokeWidth="0.5" />
      {/* Eject buttons */}
      <rect x="28" y="38" width="3" height="2" rx="0.3" fill="#5a5550" />
      <rect x="28" y="49" width="3" height="2" rx="0.3" fill="#5a5550" />
      {/* Power button */}
      <circle cx="21" cy="94" r="3" fill="#2a2520" stroke="#1a1510" strokeWidth="0.5" />
      <circle cx="21" cy="94" r="2" fill="#3a3530" />
      {/* Power LED */}
      <motion.circle cx="13" cy="94" r="1.5" fill="#39ff14" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />

      {/* === Monitor === */}
      <rect x="44" y="6" width="76" height="62" rx="3" fill="#3a3530" stroke="#2a2520" strokeWidth="1.5" />
      <rect x="46" y="8" width="72" height="58" rx="2" fill="#4a4540" />
      {/* Screen bezel */}
      <rect x="52" y="12" width="60" height="46" rx="1" fill="#1a1510" />
      {/* Screen */}
      <rect x="54" y="14" width="56" height="42" fill="#0a1a0a" />
      {/* Scanlines on screen */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`sl${i}`} x1="54" y1={14 + i * 4.2} x2="110" y2={14 + i * 4.2} stroke="#0f250f" strokeWidth="0.5" />
      ))}
      {/* Smiley face on screen */}
      {/* Eyes */}
      <motion.rect x="70" y="24" width="4" height="6" fill="#39ff14" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.rect x="90" y="24" width="4" height="6" fill="#39ff14" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} />
      {/* Mouth */}
      <motion.path d="M72 38 Q82 48 92 38" fill="none" stroke="#39ff14" strokeWidth="2.5" strokeLinecap="round"
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} />
      {/* Monitor brand label */}
      <rect x="74" y="60" width="16" height="3" rx="0.5" fill="#5a5550" />
      {/* Monitor LED */}
      <motion.circle cx="68" cy="61.5" r="1.2" fill="#39ff14" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />

      {/* Monitor stand */}
      <rect x="72" y="68" width="20" height="6" fill="#3a3530" stroke="#2a2520" strokeWidth="0.5" />
      <rect x="66" y="74" width="32" height="3" rx="1" fill="#3a3530" stroke="#2a2520" strokeWidth="0.5" />

      {/* === Keyboard === */}
      <rect x="44" y="82" width="76" height="18" rx="2" fill="#3a3530" stroke="#2a2520" strokeWidth="1" />
      <rect x="46" y="84" width="72" height="14" rx="1" fill="#4a4540" />
      {/* Key rows */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={`k1${i}`} x={48 + i * 5.5} y="86" width="4" height="3" rx="0.3" fill="#5a5550" stroke="#2a2520" strokeWidth="0.3" />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <rect key={`k2${i}`} x={50 + i * 5.5} y="91" width="4" height="3" rx="0.3" fill="#5a5550" stroke="#2a2520" strokeWidth="0.3" />
      ))}
      {/* Spacebar */}
      <rect x="60" y="96" width="24" height="2.5" rx="0.3" fill="#5a5550" stroke="#2a2520" strokeWidth="0.3" />

      {/* === Coffee mug (right) === */}
      <rect x="128" y="86" width="14" height="16" rx="2" fill="#4a4038" stroke="#3a3028" strokeWidth="1" />
      {/* Mug handle */}
      <path d="M142 90 Q148 90 148 94 Q148 98 142 98" fill="none" stroke="#3a3028" strokeWidth="1.5" />
      {/* Coffee surface */}
      <rect x="129" y="88" width="12" height="3" rx="1" fill="#2a1a0a" />
      {/* Steam */}
      <motion.path d="M133 84 Q134 80 133 76" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.2"
        animate={{ opacity: [0.1, 0.3, 0.1], y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.path d="M137 84 Q138 79 137 75" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.2"
        animate={{ opacity: [0.15, 0.35, 0.15], y: [0, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />

      {/* Ambient glow behind monitor */}
      <rect x="54" y="14" width="56" height="42" fill="url(#screenGlow)" opacity="0.15" />
      <defs>
        <radialGradient id="screenGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#39ff14" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
}
