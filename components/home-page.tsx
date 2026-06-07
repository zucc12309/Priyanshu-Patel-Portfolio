"use client";

import type { MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bot,
  BriefcaseBusiness,
  Code2,
  Download,
  Eye,
  FolderOpen,
  Github,
  GraduationCap,
  Home,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Terminal,
  Trophy,
  User,
  Wrench,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { buildSteps, projects, publicRepos } from "@/lib/projects";
import { cn } from "@/lib/utils";

type GithubStat = {
  name: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
  url: string;
};

type ViewId = "home" | "about" | "experience" | "projects" | "skills" | "github" | "contact";

type NavItem = {
  id: ViewId;
  hash: string;
  label: string;
  icon: typeof Home;
  title: string;
  command: string;
};

const navItems: NavItem[] = [
  { id: "home", hash: "top", label: "Home", icon: Home, title: "portfolio.exe", command: "run intro" },
  { id: "about", hash: "about", label: "About", icon: User, title: "about.exe", command: "about_me" },
  { id: "experience", hash: "experience", label: "Experience", icon: BriefcaseBusiness, title: "career.exe", command: "work_history" },
  { id: "projects", hash: "projects", label: "Projects", icon: FolderOpen, title: "projects.exe", command: "my_projects" },
  { id: "skills", hash: "skills", label: "Skills", icon: Wrench, title: "skills.exe", command: "skills_&_tools" },
  { id: "github", hash: "github", label: "GitHub", icon: Github, title: "github.exe", command: "public_repos" },
  { id: "contact", hash: "contact", label: "Contact", icon: Mail, title: "contact.exe", command: "contact_me" },
];

const skillCategories = [
  {
    title: "Product & Analysis",
    skills: ["Requirements Gathering", "BRD/SRS", "Product Discovery", "Stakeholder Management", "UAT Planning", "RCA"],
  },
  {
    title: "Technical",
    skills: ["SQL", "Python", "APIs & Integrations", "System Design", "Data Analysis", "PostgreSQL"],
  },
  {
    title: "Tools & Platforms",
    skills: ["Power BI", "Figma", "GitHub", "n8n", "Jira", "Postman"],
  },
  {
    title: "AI & Emerging",
    skills: ["LLM Integration", "AI Prototyping", "Agentic Systems", "Prompt Engineering", "Vector Search", "MCP"],
  },
];

export function HomePage({ stats }: { stats: GithubStat[] }) {
  const [booted, setBooted] = useState(true);
  const [showBoot, setShowBoot] = useState(false);
  const [activeView, setActiveView] = useState<ViewId>("home");
  const [recruiterMode, setRecruiterMode] = useState(false);
  const activeItem = useMemo(() => navItems.find((item) => item.id === activeView) ?? navItems[0], [activeView]);

  useEffect(() => {
    try {
      const hasBooted = sessionStorage.getItem("portfolio-booted");
      if (hasBooted) return;
      setBooted(false);
      setShowBoot(true);
      const timer = setTimeout(() => {
        setBooted(true);
        setShowBoot(false);
        sessionStorage.setItem("portfolio-booted", "1");
      }, 3200);
      return () => clearTimeout(timer);
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      const match = navItems.find((item) => item.hash === hash || item.id === hash);
      setActiveView(match?.id ?? "home");
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, []);

  const navigateTo = useCallback((view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event?.preventDefault();
    const item = navItems.find((navItem) => navItem.id === view) ?? navItems[0];
    setActiveView(item.id);
    window.history.pushState(null, "", `#${item.hash}`);
  }, []);

  if (!booted && showBoot) {
    return <BootScreen />;
  }

  return (
    <div className="retro-scanlines h-screen overflow-hidden font-mono text-[13px] text-retro-text">
      <main className="mx-auto h-[calc(100vh-3rem)] max-w-[1600px] p-3 sm:p-5">
        <RetroWindow title={activeItem.title} className="h-full">
          <div className="grid h-[calc(100%-2rem)] lg:grid-cols-[220px_1fr]">
            <DesktopSidebar activeView={activeView} onNavigate={navigateTo} recruiterMode={recruiterMode} onToggleRecruiter={() => setRecruiterMode(!recruiterMode)} />
            <section className="min-h-0 overflow-y-auto p-5 md:p-8 lg:p-10">
              <MobileNav activeView={activeView} onNavigate={navigateTo} />
              <div className="mb-6 flex items-center justify-between gap-3">
                <Prompt command={activeItem.command} />
                <button
                  onClick={() => setRecruiterMode(!recruiterMode)}
                  className={cn(
                    "hidden items-center gap-2 border px-3 py-1.5 text-[11px] uppercase transition sm:inline-flex",
                    recruiterMode
                      ? "recruiter-pulse border-retro-green/50 bg-retro-green/10 text-retro-green"
                      : "border-retro-text/15 text-retro-text/40 hover:border-retro-green/30 hover:text-retro-green",
                  )}
                >
                  <Eye className="size-3" />
                  {recruiterMode ? "Recruiter Mode ON" : "Recruiter Mode"}
                </button>
              </div>
              {activeView === "home" && <HomeScreen onNavigate={navigateTo} recruiterMode={recruiterMode} />}
              {activeView === "about" && <AboutScreen />}
              {activeView === "experience" && <ExperienceScreen />}
              {activeView === "projects" && <ProjectsScreen />}
              {activeView === "skills" && <SkillsScreen />}
              {activeView === "github" && <GithubScreen stats={stats} />}
              {activeView === "contact" && <ContactScreen />}
            </section>
          </div>
        </RetroWindow>
      </main>
      <Taskbar activeView={activeView} onNavigate={navigateTo} />
    </div>
  );
}

const bootLines = [
  "BIOS v3.1.0 — Priyanshu Patel Portfolio System",
  "Memory test... 4096 MB OK",
  "Loading portfolio.exe...",
  "Mounting projects... 4 found",
  "Initializing AI subsystems... OK",
  "Loading career modules... Business Analyst → Product Manager",
  "Tech Titan Award verified ✓",
  "System ready.",
];

function BootScreen() {
  const [visibleCount, setVisibleCount] = useState(0);
  const progress = Math.round((visibleCount / bootLines.length) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= bootLines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 340);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="boot-screen flex h-screen items-center justify-center font-mono text-sm text-retro-green">
      <div className="w-full max-w-xl px-6">
        <div className="space-y-1">
          {bootLines.slice(0, visibleCount).map((line, index) => (
            <p key={index} className={cn("text-retro-green", line.includes("✓") && "text-retro-amber")}>
              {line}
            </p>
          ))}
          {visibleCount < bootLines.length && (
            <span className="boot-cursor inline-block h-4 w-2 bg-retro-green" />
          )}
        </div>
        <div className="mt-6 h-4 border border-retro-green/30 bg-black">
          <div className="boot-progress h-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-retro-text/40">{progress}% loaded</p>
      </div>
    </div>
  );
}

function RetroWindow({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("retro-window overflow-hidden", className)}>
      <div className="retro-titlebar flex h-8 items-center justify-between px-3 text-xs">
        <span>{title}</span>
        <WindowControls />
      </div>
      {children}
    </section>
  );
}

function WindowControls() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-3 rounded-full bg-red-400/70" />
      <span className="size-3 rounded-full bg-retro-amber/70" />
      <span className="size-3 rounded-full bg-retro-green/70" />
    </div>
  );
}

function Prompt({ command }: { command: string }) {
  return (
    <p className="retro-terminal text-sm">
      <span className="text-retro-text/40">$</span> {command}
    </p>
  );
}

function DesktopSidebar({
  activeView,
  onNavigate,
  recruiterMode,
  onToggleRecruiter,
}: {
  activeView: ViewId;
  onNavigate: (view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  recruiterMode: boolean;
  onToggleRecruiter: () => void;
}) {
  return (
    <aside className="hidden border-r border-retro-text/10 p-4 lg:block">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={`#${item.hash}`}
              onClick={(event) => onNavigate(item.id, event)}
              className={cn(
                "flex h-9 items-center gap-3 border border-transparent px-3 text-xs uppercase tracking-wide text-retro-text/60 transition hover:border-retro-green/30 hover:text-retro-text",
                activeView === item.id && "border-retro-green/40 bg-retro-green/8 text-retro-green",
              )}
            >
              <Icon className={cn("size-3.5", activeView === item.id ? "text-retro-green" : "text-accent-purple/70")} />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="retro-panel mt-8 p-3">
        <p className="text-[10px] uppercase tracking-wider text-retro-amber">Status</p>
        <p className="mt-2 text-xs text-retro-text/70">Business Analyst</p>
        <p className="text-[10px] text-retro-green">→ Product Manager</p>
        <div className="mt-3 h-2 border border-retro-green/20 bg-black">
          <div className="retro-progress h-full w-[72%]" />
        </div>
      </div>

      <button
        onClick={onToggleRecruiter}
        className={cn(
          "mt-3 flex w-full items-center gap-2 border p-3 text-[10px] uppercase transition",
          recruiterMode
            ? "recruiter-pulse border-retro-green/40 bg-retro-green/8 text-retro-green"
            : "border-retro-text/10 text-retro-text/40 hover:border-retro-green/20",
        )}
      >
        <Eye className="size-3" />
        Recruiter Mode
      </button>
    </aside>
  );
}

function MobileNav({ activeView, onNavigate }: { activeView: ViewId; onNavigate: (view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void }) {
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto border-b border-retro-text/10 pb-4 lg:hidden">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={(event) => onNavigate(item.id, event)}
          className={cn(
            "retro-button h-9 shrink-0 px-3 text-xs uppercase",
            activeView === item.id && "border-retro-green/40 bg-retro-green/10 text-retro-green",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function HomeScreen({ onNavigate, recruiterMode }: { onNavigate: (view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void; recruiterMode: boolean }) {
  if (recruiterMode) {
    return <RecruiterView onNavigate={onNavigate} />;
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
      <Reveal>
        <p className="text-sm text-retro-green">Hello, world.</p>
        <h1 className="pixel-heading mt-4 text-5xl font-black leading-none sm:text-6xl xl:text-7xl">
          Priyanshu
          <br />
          Patel
        </h1>
        <p className="mt-4 text-base uppercase tracking-[0.14em] text-retro-amber">
          Business Analyst → Product Manager
        </p>
        <p className="mt-2 text-sm text-accent-purple">
          AI Product Builder · Systems Thinker · Builder
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-retro-text/65">
          I turn business requirements into working systems — APIs, SQL pipelines, workflow automation, UAT plans, and AI product prototypes. Currently at Digit Insurance, managing systems handling 1,500+ Cr in premiums and 2L+ monthly transactions.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="award-glow flex items-center gap-2 border border-retro-amber/30 bg-retro-amber/8 px-3 py-2">
            <Trophy className="size-4 text-retro-amber" />
            <span className="text-xs text-retro-amber">Tech Titan Award — Digit Insurance</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={(event) => onNavigate("projects", event)} className="retro-button inline-flex h-10 items-center gap-2 border-retro-green/40 bg-retro-green/8 px-4 text-sm uppercase text-retro-green transition hover:bg-retro-green/15">
            <ArrowRight className="size-4" /> View My Work
          </button>
          <ButtonLink href="/cv/priyanshu-patel-business-analyst-cv.pdf" label="Download CV" icon={Download} />
          <ButtonLink href="https://github.com/zucc12309" label="GitHub" icon={Github} />
          <ButtonLink href="https://www.linkedin.com/in/priyanshupatel/" label="LinkedIn" icon={Linkedin} />
        </div>
      </Reveal>

      <Reveal delay={0.12} className="grid content-start gap-4">
        <div className="retro-panel p-4">
          <p className="text-[10px] uppercase tracking-wider text-retro-green">Quick Stats</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniStat label="Premium Systems" value="1,500+ Cr" />
            <MiniStat label="Monthly Txns" value="2L+" />
            <MiniStat label="Projects Shipped" value="4" />
            <MiniStat label="Recognition" value="Tech Titan" />
          </div>
        </div>
        <div className="retro-panel p-3">
          <div className="relative aspect-[4/3] overflow-hidden border border-retro-text/10 bg-black">
            <Image src="/projects/memory-router.png" alt="Memory Router — AI infrastructure project" fill sizes="380px" className="object-cover opacity-80" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px] uppercase text-retro-text/50">
            {["SQL", "APIs", "UAT", "Automation", "AI", "Product"].map((item) => (
              <span key={item} className="border border-retro-text/10 bg-black/40 px-2 py-1.5 text-center">
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function RecruiterView({ onNavigate }: { onNavigate: (view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void }) {
  return (
    <div className="grid gap-6">
      <Reveal>
        <div className="flex items-center gap-2 text-xs text-retro-green">
          <Eye className="size-3" /> RECRUITER MODE — 30-second overview
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="retro-panel p-5">
            <h2 className="text-2xl font-black text-retro-text">Priyanshu Patel</h2>
            <p className="mt-1 text-sm text-retro-amber">Business Analyst → Product Manager</p>
            <p className="mt-1 text-xs text-retro-text/50">Digit Insurance · Bengaluru, India</p>
            <div className="mt-4 flex items-center gap-2">
              <Trophy className="size-3.5 text-retro-amber" />
              <span className="text-xs text-retro-amber">Tech Titan Award Recipient</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-retro-text/65">
              Business Analyst managing 1,500+ Cr premium systems and 2L+ monthly transactions. Building AI products on the side. Targeting PM roles where I can combine product thinking with technical execution.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href="/cv/priyanshu-patel-business-analyst-cv.pdf" label="Download CV" icon={Download} />
              <ButtonLink href="mailto:itsmepriyanshu36@gmail.com" label="Email" icon={Mail} />
              <ButtonLink href="https://www.linkedin.com/in/priyanshupatel/" label="LinkedIn" icon={Linkedin} />
            </div>
          </div>

          <div className="retro-panel p-5">
            <p className="text-[10px] uppercase tracking-wider text-retro-green">Key Skills</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Requirements", "SQL", "APIs", "UAT", "Automation", "Stakeholders", "Product Discovery", "AI Prototyping", "System Design", "Data Analysis"].map((skill) => (
                <span key={skill} className="border border-retro-text/15 bg-black/40 px-2 py-1 text-[11px] text-retro-text/70">{skill}</span>
              ))}
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-wider text-retro-green">Education</p>
            <p className="mt-1 text-xs text-retro-text/60">MBA Finance & Business Analytics + B.Tech CSE</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="text-[10px] uppercase tracking-wider text-accent-purple">Featured Projects</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <button key={project.slug} onClick={(e) => onNavigate("projects", e)} className="retro-panel p-3 text-left transition hover:border-retro-green/30">
              <p className="text-sm font-medium text-retro-text">{project.title}</p>
              <p className="mt-1 text-[11px] text-retro-amber">{project.status}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-retro-text/50">{project.sections.problem}</p>
            </button>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-retro-text/10 bg-black/40 p-2">
      <p className="text-[10px] text-retro-text/40">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-retro-green">{value}</p>
    </div>
  );
}

function ButtonLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof ArrowRight }) {
  return (
    <Link href={href} className="retro-button inline-flex h-10 items-center gap-2 px-4 text-sm uppercase tracking-wide transition">
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

function AboutScreen() {
  return (
    <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
      <Reveal>
        <div className="retro-panel p-4">
          <div className="grid aspect-square place-items-center bg-black text-4xl font-black text-retro-green">PP</div>
          <p className="mt-3 text-center text-xs text-retro-text/50">me.txt</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="text-3xl font-black text-accent-purple">Who am I?</h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-retro-text/65">
          I work at the intersection of product, engineering, and operations. My day job involves gathering requirements, writing BRDs/SRS, analyzing transaction data with SQL, defining API contracts, coordinating UAT, and improving workflows through automation. On the side, I build AI-native products that solve real problems.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-retro-text/65">
          I am transitioning into Product Management, bringing hands-on technical execution, business analysis rigor, and a builder mindset. I believe the best PMs are the ones who have shipped real products — and I have.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <SystemInfo icon={BriefcaseBusiness} label="Current role" value="Business Analyst at Digit Insurance" />
          <SystemInfo icon={Trophy} label="Recognition" value="Tech Titan Award for exceptional contribution" />
          <SystemInfo icon={Zap} label="Scale" value="1,500+ Cr premium systems, 2L+ monthly transactions" />
          <SystemInfo icon={GraduationCap} label="Education" value="MBA Finance & Business Analytics + B.Tech CSE" />
          <SystemInfo icon={MapPin} label="Location" value="Bengaluru, India — Available worldwide" />
          <SystemInfo icon={Bot} label="Building" value="AI products, workflow automation, agentic systems" />
        </div>
      </Reveal>
    </div>
  );
}

function SystemInfo({ icon: Icon, label, value }: { icon: typeof BriefcaseBusiness; label: string; value: string }) {
  return (
    <div className="retro-panel p-3">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-retro-green" />
        <p className="text-[10px] uppercase tracking-wider text-retro-green">{label}</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-retro-text/65">{value}</p>
    </div>
  );
}

function ExperienceScreen() {
  return (
    <div>
      <h2 className="text-3xl font-black text-accent-purple">Work Experience</h2>
      <p className="mt-2 text-sm text-retro-text/50">My career path from engineering to product thinking.</p>

      <div className="mt-8 space-y-6">
        <Reveal>
          <div className="retro-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-retro-text">Business Analyst</h3>
                <p className="mt-1 text-sm text-retro-amber">Digit Insurance (Go Digit General Insurance)</p>
              </div>
              <div className="flex items-center gap-2 border border-retro-amber/30 bg-retro-amber/8 px-2 py-1">
                <Trophy className="size-3 text-retro-amber" />
                <span className="text-[10px] text-retro-amber">Tech Titan Award</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <ExperienceItem text="Managing systems handling 1,500+ Cr in premiums and 2L+ monthly transactions" />
              <ExperienceItem text="Requirements gathering, BRD/SRS documentation, and stakeholder management" />
              <ExperienceItem text="SQL-based data analysis for transaction monitoring and reporting" />
              <ExperienceItem text="API contract definition and system integration coordination" />
              <ExperienceItem text="UAT planning, test case design, and release coordination" />
              <ExperienceItem text="Workflow automation and process improvement initiatives" />
              <ExperienceItem text="Recognised with the Tech Titan Award for exceptional contribution to technology and product delivery" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="retro-panel p-5">
            <h3 className="text-lg font-bold text-retro-text">How I Build Products</h3>
            <p className="mt-2 text-xs text-retro-text/50">My process from unclear requirements to validated system change.</p>
            <div className="mt-4 grid gap-2 md:grid-cols-4 xl:grid-cols-8">
              {buildSteps.map((step, index) => (
                <div key={step} className="relative border border-retro-text/10 bg-black/40 p-3">
                  <span className="flex size-6 items-center justify-center border border-retro-green/40 bg-retro-green/8 text-[10px] text-retro-green">{index + 1}</span>
                  <p className="mt-2 text-xs font-medium text-retro-text/70">{step}</p>
                  {index < buildSteps.length - 1 && <div className="absolute -right-2 top-5 hidden h-px w-2 bg-retro-text/20 xl:block" />}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="retro-panel p-5">
            <h3 className="text-lg font-bold text-retro-text">Education</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="border border-retro-text/10 bg-black/40 p-3">
                <GraduationCap className="size-4 text-accent-purple" />
                <p className="mt-2 text-sm font-medium text-retro-text">MBA — Finance & Business Analytics</p>
              </div>
              <div className="border border-retro-text/10 bg-black/40 p-3">
                <Code2 className="size-4 text-accent-purple" />
                <p className="mt-2 text-sm font-medium text-retro-text">B.Tech — Computer Science & Engineering</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function ExperienceItem({ text }: { text: string }) {
  return (
    <div className="flex gap-2 text-sm leading-6 text-retro-text/60">
      <Sparkles className="mt-1 size-3 shrink-0 text-retro-green" />
      {text}
    </div>
  );
}

function ProjectsScreen() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-accent-purple">Projects</h2>
          <p className="mt-1 text-sm text-retro-text/50">Products I have built and shipped.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.04}>
            <Link href={`/projects/${project.slug}`} className="group block border border-retro-text/10 bg-black/40 transition hover:-translate-y-1 hover:border-retro-green/30">
              <div className="flex items-center justify-between border-b border-retro-text/10 px-3 py-2 text-xs uppercase">
                <span className="text-retro-green">{String(index + 1).padStart(2, "0")}</span>
                <span className="truncate pl-3 text-retro-text/80">{project.title}</span>
              </div>
              <div className="relative aspect-[16/9] overflow-hidden border-b border-retro-text/10 bg-black">
                <Image src={project.image} alt={`${project.title} project cover`} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
              </div>
              <div className="p-3">
                <p className="text-xs text-retro-amber">{project.status}</p>
                <p className="mt-2 line-clamp-3 min-h-14 text-xs leading-5 text-retro-text/55">{project.description}</p>
                <p className="mt-3 text-xs text-retro-green">OPEN PROJECT →</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="retro-panel mt-6 p-4">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-retro-amber" />
            <p className="text-xs text-retro-amber">What these projects demonstrate</p>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {["Product Thinking", "System Design", "AI Integration", "Full-Stack Execution", "Privacy-First", "User Empathy"].map((signal) => (
              <span key={signal} className="border border-retro-text/10 bg-black/40 px-2 py-1.5 text-center text-[10px] uppercase text-retro-text/50">{signal}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SkillsScreen() {
  return (
    <div>
      <h2 className="text-3xl font-black text-accent-purple">Skills & Tools</h2>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {skillCategories.map((category) => (
          <Reveal key={category.title}>
            <div className="retro-panel p-4">
              <h3 className="text-sm uppercase tracking-wider text-retro-green">{category.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span key={skill} className="border border-retro-text/15 bg-black/40 px-3 py-1.5 text-xs text-retro-text/70">{skill}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.12}>
        <div className="retro-panel mt-4 p-4">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-retro-green" />
            <p className="text-xs text-retro-green">Currently exploring</p>
          </div>
          <p className="mt-2 text-sm text-retro-text/60">Agentic AI systems, product analytics, and building in public</p>
        </div>
      </Reveal>
    </div>
  );
}

function GithubScreen({ stats }: { stats: GithubStat[] }) {
  return (
    <div>
      <h2 className="text-3xl font-black text-accent-purple">Open Source</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {publicRepos.map((repoProject) => {
          const stat = stats.find((item) => item.url.toLowerCase() === repoProject.repo?.toLowerCase());
          return (
            <Reveal key={repoProject.slug} className="retro-panel p-4">
              <Github className="mb-3 size-5 text-retro-text/70" />
              <h3 className="text-xl font-bold text-retro-text">{repoProject.title}</h3>
              <p className="mt-2 text-xs text-retro-text/50">{repoProject.status}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <RepoMetric label="Stars" value={String(stat?.stars ?? "—")} />
                <RepoMetric label="Forks" value={String(stat?.forks ?? "—")} />
                <RepoMetric label="Language" value={stat?.language ?? "—"} />
                <RepoMetric label="Updated" value={formatRepoDate(stat?.updatedAt)} />
              </div>
              <Link href={repoProject.repo ?? "#"} className="mt-4 inline-flex items-center gap-2 text-xs text-retro-green hover:underline">
                Open repository <ArrowRight className="size-3" />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

function RepoMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-retro-text/10 bg-black/40 p-2">
      <p className="text-[10px] uppercase text-retro-green">{label}</p>
      <p className="mt-0.5 text-xs text-retro-text/70">{value}</p>
    </div>
  );
}

function formatRepoDate(value?: string) {
  if (!value) return "—";
  return value.slice(0, 10);
}

function ContactScreen() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Reveal>
        <h2 className="text-3xl font-black text-accent-purple">Let&apos;s connect</h2>
        <p className="mt-3 text-sm text-retro-text/50">
          I am actively exploring Product Manager and AI Product roles. If you are building something interesting, I would love to talk.
        </p>
        <div className="mt-6 space-y-3">
          <Link href="mailto:itsmepriyanshu36@gmail.com" className="flex items-center gap-3 text-sm text-retro-text/65 transition hover:text-retro-text">
            <Mail className="size-4 text-accent-purple" /> itsmepriyanshu36@gmail.com
          </Link>
          <Link href="https://www.linkedin.com/in/priyanshupatel/" className="flex items-center gap-3 text-sm text-retro-text/65 transition hover:text-retro-text">
            <Linkedin className="size-4 text-accent-purple" /> LinkedIn
          </Link>
          <Link href="https://github.com/zucc12309" className="flex items-center gap-3 text-sm text-retro-text/65 transition hover:text-retro-text">
            <Github className="size-4 text-accent-purple" /> GitHub
          </Link>
        </div>
        <div className="retro-panel mt-6 inline-flex items-center gap-2 p-3">
          <MapPin className="size-3.5 text-retro-green" />
          <span className="text-xs text-retro-text/55">Bengaluru, India — Available worldwide</span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="retro-panel p-5">
          <p className="text-xs text-retro-green">$ send_message</p>
          <div className="mt-4 grid gap-3">
            <input className="h-10 border border-retro-text/15 bg-black/40 px-3 text-sm text-retro-text outline-none placeholder:text-retro-text/30 focus:border-retro-green/40" placeholder="NAME" />
            <input className="h-10 border border-retro-text/15 bg-black/40 px-3 text-sm text-retro-text outline-none placeholder:text-retro-text/30 focus:border-retro-green/40" placeholder="EMAIL" type="email" />
            <textarea className="min-h-28 border border-retro-text/15 bg-black/40 p-3 text-sm text-retro-text outline-none placeholder:text-retro-text/30 focus:border-retro-green/40" placeholder="MESSAGE" />
            <button className="retro-button h-10 border-retro-green/40 bg-retro-green/8 text-sm uppercase text-retro-green hover:bg-retro-green/15">
              → Send Message
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Taskbar({ activeView, onNavigate }: { activeView: ViewId; onNavigate: (view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void }) {
  const taskItems = navItems.filter((item) => ["home", "about", "projects", "contact"].includes(item.id));
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="retro-taskbar fixed bottom-0 left-0 right-0 z-50 flex h-12 items-center gap-2 overflow-x-auto px-3 font-mono text-xs">
      <button onClick={(event) => onNavigate("home", event)} className="flex h-8 shrink-0 items-center gap-2 border border-retro-green/20 bg-retro-green/8 px-3 text-retro-green">
        <Terminal className="size-3" />
        Start
      </button>
      <div className="h-6 w-px bg-retro-text/10" />
      {taskItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={(event) => onNavigate(item.id, event)}
            className={cn(
              "flex h-8 min-w-28 shrink-0 items-center gap-2 border border-retro-text/10 px-3 transition",
              activeView === item.id ? "bg-retro-green/8 text-retro-green" : "text-retro-text/50 hover:text-retro-text",
            )}
          >
            <Icon className="size-3" />
            {item.title}
          </button>
        );
      })}
      {time && (
        <span className="ml-auto hidden h-8 shrink-0 items-center gap-2 border border-retro-text/10 px-3 text-retro-text/40 md:flex">
          <BriefcaseBusiness className="size-3" />
          {time}
        </span>
      )}
    </div>
  );
}
