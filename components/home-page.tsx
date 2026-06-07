"use client";

import type { MouseEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Download,
  FileText,
  FolderOpen,
  Github,
  Home,
  Linkedin,
  Mail,
  Network,
  Sparkles,
  Terminal,
  User,
  Wrench,
} from "lucide-react";
import { ArchitectureDiagram } from "@/components/project-simulators";
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

type ViewId = "home" | "about" | "projects" | "process" | "skills" | "architecture" | "github" | "contact";

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
  { id: "projects", hash: "projects", label: "Projects", icon: FolderOpen, title: "projects.exe", command: "my_projects" },
  { id: "process", hash: "process", label: "Process", icon: Network, title: "process.exe", command: "how_i_build_products" },
  { id: "skills", hash: "skills", label: "Skills", icon: Wrench, title: "skills.exe", command: "skills_&_tools" },
  { id: "architecture", hash: "architecture", label: "Architecture", icon: Code2, title: "architecture.exe", command: "system_designs" },
  { id: "github", hash: "github", label: "GitHub", icon: Github, title: "github.exe", command: "public_repos" },
  { id: "contact", hash: "contact", label: "Contact", icon: Mail, title: "contact.exe", command: "contact_me" },
];

const skillBars = [
  ["Requirements", 92],
  ["SQL Analysis", 84],
  ["API Contracts", 78],
  ["UAT Planning", 88],
  ["Automation", 82],
  ["AI Prototyping", 76],
  ["Stakeholders", 90],
  ["System Design", 74],
] as const;

export function HomePage({ stats }: { stats: GithubStat[] }) {
  const [activeView, setActiveView] = useState<ViewId>("home");
  const activeItem = useMemo(() => navItems.find((item) => item.id === activeView) ?? navItems[0], [activeView]);

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

  function navigateTo(view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    event?.preventDefault();
    const item = navItems.find((navItem) => navItem.id === view) ?? navItems[0];
    setActiveView(item.id);
    window.history.pushState(null, "", `#${item.hash}`);
  }

  return (
    <div className="retro-scanlines h-screen overflow-hidden font-mono text-[13px] text-[#fff3d6]">
      <main className="mx-auto h-[calc(100vh-3.5rem)] max-w-[1600px] p-3 sm:p-5">
        <RetroWindow title={activeItem.title} className="h-full">
          <div className="grid h-[calc(100%-2rem)] lg:grid-cols-[230px_1fr]">
            <DesktopSidebar activeView={activeView} onNavigate={navigateTo} />
            <section className="min-h-0 overflow-y-auto p-5 md:p-8 lg:p-10">
              <MobileNav activeView={activeView} onNavigate={navigateTo} />
              <div className="mb-6 flex items-center justify-between gap-3">
                <Prompt command={activeItem.command} />
                <span className="hidden text-[#fff3d6]/55 sm:inline">navigation mode</span>
              </div>
              {activeView === "home" ? <HomeScreen onNavigate={navigateTo} /> : null}
              {activeView === "about" ? <AboutScreen /> : null}
              {activeView === "projects" ? <ProjectsScreen /> : null}
              {activeView === "process" ? <ProcessScreen /> : null}
              {activeView === "skills" ? <SkillsScreen /> : null}
              {activeView === "architecture" ? <ArchitectureScreen /> : null}
              {activeView === "github" ? <GithubScreen stats={stats} /> : null}
              {activeView === "contact" ? <ContactScreen /> : null}
            </section>
          </div>
        </RetroWindow>
      </main>
      <Taskbar activeView={activeView} onNavigate={navigateTo} />
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
    <div className="flex items-center gap-1">
      {["_", "□", "×"].map((item) => (
        <span key={item} className="grid size-5 place-items-center border border-[#ded6bf] bg-[#b9b3ba] text-[11px] leading-none text-black shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_#4a4650]">
          {item}
        </span>
      ))}
    </div>
  );
}

function Prompt({ command }: { command: string }) {
  return (
    <p className="retro-terminal text-sm">
      C:\&gt; <span>{command}</span>
    </p>
  );
}

function DesktopSidebar({ activeView, onNavigate }: { activeView: ViewId; onNavigate: (view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void }) {
  return (
    <aside className="hidden border-r border-[#efe7d1]/40 p-4 lg:block">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={`#${item.hash}`}
              onClick={(event) => onNavigate(item.id, event)}
              className={cn(
                "flex h-10 items-center gap-3 border border-transparent px-3 uppercase tracking-wide text-[#fff3d6]/82 transition hover:border-[#ff2aa8] hover:bg-[#7d155c]/70 hover:text-white",
                activeView === item.id && "border-[#ff2aa8] bg-[#7d155c]/80 text-white",
              )}
            >
              <Icon className="size-4 text-[#ff78d4]" />
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="retro-panel mt-10 p-4">
        <p className="text-[11px] uppercase text-[#a97cff]">Now running</p>
        <p className="mt-3 text-white">BA Product OS</p>
        <div className="mt-4 h-10 border border-[#ff2aa8]/45 bg-black/40 p-1">
          <div className="retro-progress h-full w-[72%]" />
        </div>
        <p className="mt-3 text-[11px] text-[#77ff5f]">status: focused</p>
      </div>
    </aside>
  );
}

function MobileNav({ activeView, onNavigate }: { activeView: ViewId; onNavigate: (view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void }) {
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto border-b border-[#efe7d1]/25 pb-4 lg:hidden">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={(event) => onNavigate(item.id, event)}
          className={cn(
            "retro-button h-10 shrink-0 px-3 text-xs uppercase",
            activeView === item.id && "border-[#ff2aa8] bg-[#7d155c]/90 text-white",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void }) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_390px]">
      <Reveal>
        <p className="text-xl text-[#77ff5f]">Hello!</p>
        <h1 className="pixel-heading mt-4 text-6xl font-black leading-none sm:text-7xl xl:text-8xl">
          Priyanshu
          <br />
          Patel
        </h1>
        <p className="mt-5 text-lg uppercase tracking-[0.16em] text-[#5fc3ff]">
          Business Analyst * AI Product Builder * Product Systems
        </p>
        <p className="mt-8 max-w-2xl text-base leading-8 text-[#fff3d6]/72">
          I translate business requirements into API-driven systems, SQL-backed insights, workflow automation, UAT plans, and AI product prototypes.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button onClick={(event) => onNavigate("projects", event)} className="retro-button inline-flex h-11 items-center gap-2 border-[#ff2aa8] bg-[#7d155c]/90 px-4 text-sm uppercase tracking-wide text-white shadow-[0_0_24px_rgba(255,42,168,0.25)] transition">
            <ArrowRight className="size-4" /> View My Work
          </button>
          <ButtonLink href="/cv/priyanshu-patel-business-analyst-cv.pdf" label="Download CV" icon={Download} />
          <ButtonLink href="https://github.com/zucc12309" label="GitHub" icon={Github} />
          <ButtonLink href="https://www.linkedin.com/in/priyanshupatel/" label="LinkedIn" icon={Linkedin} />
        </div>
      </Reveal>

      <Reveal delay={0.12} className="grid content-start gap-5">
        <div className="retro-panel p-5">
          <p className="text-[#fff3d6]">Building product systems since 2025</p>
          <p className="mt-3 text-[#77ff5f]">:)</p>
        </div>
        <div className="retro-panel p-4">
          <div className="relative aspect-[4/3] overflow-hidden border border-[#efe7d1]/50 bg-black">
            <Image src="/projects/ridecompare.png" alt="RideCompare retro monitor preview" fill sizes="390px" className="object-cover opacity-85" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] uppercase text-[#fff3d6]/70">
            {["BRD/SRS", "SQL", "APIs", "UAT", "Automation", "RCA"].map((item) => (
              <span key={item} className="border border-[#efe7d1]/25 bg-black/45 px-2 py-2">
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function ButtonLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof ArrowRight }) {
  return (
    <Link href={href} className="retro-button inline-flex h-11 items-center gap-2 px-4 text-sm uppercase tracking-wide transition">
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

function AboutScreen() {
  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
      <Reveal>
        <div className="rotate-[-3deg] border border-[#efe7d1]/50 bg-[#efe7d1] p-3 text-black shadow-[10px_12px_0_rgba(0,0,0,0.35)]">
          <div className="grid aspect-square place-items-center bg-[#17242b] text-5xl font-black text-[#77ff5f]">PP</div>
          <p className="mt-3 text-center text-lg font-bold">me.txt</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="text-4xl font-black text-[#a97cff] underline decoration-[#a97cff]/70 underline-offset-8">Who am I?</h2>
        <p className="mt-7 max-w-3xl text-base leading-8 text-[#fff3d6]/75">
          I work at the intersection of product, engineering, and operations: gathering requirements, writing BRDs/SRS, analyzing transaction data with SQL, defining API contracts and validation logic, coordinating UAT, and improving workflows through automation.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <SystemInfo label="Current role" value="Business Analyst at Digit Life Insurance" />
          <SystemInfo label="Portfolio" value="1500+ Cr premium systems, 2L+ monthly transactions" />
          <SystemInfo label="Education" value="MBA Finance & Business Analytics + B.Tech CSE" />
          <SystemInfo label="Mode" value="Product management path, AI systems, workflow automation" />
        </div>
      </Reveal>
    </div>
  );
}

function SystemInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="retro-panel p-4">
      <p className="text-[11px] uppercase tracking-wide text-[#77ff5f]">{label}</p>
      <p className="mt-2 leading-6 text-[#fff3d6]/76">{value}</p>
    </div>
  );
}

function ProjectsScreen() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-black text-[#ff78d4]">Product systems I have shaped.</h2>
        <div className="flex gap-2 text-[11px] uppercase">
          {["All", "AI", "Apps", "Automation"].map((filter, index) => (
            <span key={filter} className={cn("border border-[#efe7d1]/35 px-3 py-2", index === 0 ? "bg-[#8b1765] text-white" : "bg-black/40 text-[#fff3d6]/70")}>
              {filter}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.04}>
            <Link href={`/projects/${project.slug}`} className="group block border border-[#efe7d1]/45 bg-black/45 transition hover:-translate-y-1 hover:border-[#ff2aa8] hover:bg-[#160817]">
              <div className="flex items-center justify-between border-b border-[#efe7d1]/30 px-3 py-2 text-xs uppercase">
                <span className="text-[#77ff5f]">{String(index + 1).padStart(2, "0")}</span>
                <span className="truncate pl-3 text-[#fff3d6]">{project.title}</span>
              </div>
              <div className="relative aspect-[16/9] overflow-hidden border-b border-[#efe7d1]/30 bg-black">
                <Image src={project.image} alt={`${project.title} project cover`} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
              </div>
              <div className="p-3">
                <p className="line-clamp-3 min-h-16 leading-6 text-[#fff3d6]/70">{project.description}</p>
                <p className="mt-4 text-[#5fc3ff]">OPEN PROJECT -&gt;</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ProcessScreen() {
  return (
    <div>
      <h2 className="text-3xl font-black text-[#ff78d4]">How I move from unclear workflow to validated system change.</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
        {buildSteps.map((step, index) => (
          <Reveal key={step} delay={index * 0.03} className="relative border border-[#efe7d1]/35 bg-black/45 p-4">
            <span className="grid size-9 place-items-center border border-[#77ff5f]/70 bg-[#113016] text-[#77ff5f]">{index + 1}</span>
            <p className="mt-4 min-h-12 font-semibold text-[#fff3d6]">{step}</p>
            {index < buildSteps.length - 1 ? <div className="absolute -right-3 top-8 hidden h-px w-3 bg-[#efe7d1]/50 xl:block" /> : null}
          </Reveal>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {projects.slice(0, 3).map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.05} className="retro-panel p-4">
            <p className="text-[#5fc3ff]">{project.title}</p>
            <p className="mt-3 leading-7 text-[#fff3d6]/70">{project.sections.problem}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function SkillsScreen() {
  return (
    <div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="retro-panel p-4">
          <h3 className="mb-4 text-lg uppercase text-[#a97cff]">Skills</h3>
          <div className="space-y-3">
            {skillBars.map(([skill, value]) => (
              <div key={skill} className="grid grid-cols-[120px_1fr] items-center gap-3">
                <span className="text-[#fff3d6]/76">{skill}</span>
                <div className="h-3 border border-[#efe7d1]/25 bg-black">
                  <div className="retro-progress h-full" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="retro-panel p-4">
          <h3 className="mb-4 text-lg uppercase text-[#a97cff]">Tools I use</h3>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
            {["SQL", "Python", "Postgres", "Figma", "GitHub", "n8n", "APIs", "Power BI", "LLMs"].map((tool) => (
              <div key={tool} className="border border-[#efe7d1]/25 bg-black/45 p-3">
                <Code2 className="mx-auto mb-2 size-5 text-[#5fc3ff]" />
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="retro-panel mt-4 p-4">
        <p className="text-[#a97cff]">Currently learning...</p>
        <p className="mt-3 text-[#77ff5f]">C:\&gt; agentic_ai.exe</p>
        <p className="mt-2 text-[#ff78d4]">AI agents, product analytics, and public product storytelling</p>
      </div>
    </div>
  );
}

function ArchitectureScreen() {
  return (
    <div>
      <h2 className="text-3xl font-black text-[#ff78d4]">How I think through architecture, data flow, and integrations.</h2>
      <div className="mt-7 grid gap-6">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.04}>
            <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
              <div className="retro-panel p-4">
                <p className="text-[11px] text-[#77ff5f]">0{index + 1} / 04</p>
                <h3 className="mt-3 text-2xl font-black text-[#fff3d6]">{project.title}</h3>
                <p className="mt-4 leading-7 text-[#fff3d6]/70">{project.sections.solution}</p>
              </div>
              <ArchitectureDiagram project={project} />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function GithubScreen({ stats }: { stats: GithubStat[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {publicRepos.map((repoProject) => {
        const stat = stats.find((item) => item.url.toLowerCase() === repoProject.repo?.toLowerCase());
        return (
          <Reveal key={repoProject.slug} className="retro-panel p-4">
            <Github className="mb-4 size-6 text-[#fff3d6]" />
            <h3 className="text-2xl font-black text-[#ff78d4]">{repoProject.title}</h3>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <RepoMetric label="Stars" value={String(stat?.stars ?? "Live")} />
              <RepoMetric label="Forks" value={String(stat?.forks ?? "Fetch")} />
              <RepoMetric label="Language" value={stat?.language ?? "GitHub"} />
              <RepoMetric label="Updated" value={formatRepoDate(stat?.updatedAt)} />
            </div>
            <Link href={repoProject.repo ?? "#"} className="mt-5 inline-flex items-center gap-2 text-[#5fc3ff]">
              Open repository <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

function RepoMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#efe7d1]/25 bg-black/45 p-3">
      <p className="text-[11px] uppercase text-[#77ff5f]">{label}</p>
      <p className="mt-1 text-[#fff3d6]">{value}</p>
    </div>
  );
}

function formatRepoDate(value?: string) {
  if (!value) {
    return "On deploy";
  }

  return value.slice(0, 10);
}

function ContactScreen() {
  return (
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <Reveal>
        <h2 className="text-4xl font-black text-[#a97cff] underline decoration-[#a97cff]/70 underline-offset-8">Let&apos;s connect!</h2>
        <div className="mt-8 space-y-5 text-base">
          <Link href="mailto:itsmepriyanshu36@gmail.com" className="flex items-center gap-4 text-[#fff3d6]/78 hover:text-white"><Mail className="size-5 text-[#a97cff]" /> itsmepriyanshu36@gmail.com</Link>
          <Link href="https://www.linkedin.com/in/priyanshupatel/" className="flex items-center gap-4 text-[#fff3d6]/78 hover:text-white"><Linkedin className="size-5 text-[#a97cff]" /> LinkedIn</Link>
          <Link href="https://github.com/zucc12309" className="flex items-center gap-4 text-[#fff3d6]/78 hover:text-white"><Github className="size-5 text-[#a97cff]" /> GitHub</Link>
        </div>
        <div className="retro-panel mt-10 inline-flex items-center gap-3 p-4 text-[#fff3d6]/75">
          <Sparkles className="size-5 text-[#77ff5f]" />
          Bengaluru, India - Available worldwide
        </div>
      </Reveal>
      <Reveal delay={0.08} className="retro-panel p-5">
        <div className="mb-5 border border-[#77ff5f]/40 bg-black p-5 text-[#77ff5f]">
          SEND A MESSAGE
          <br />
          :)
        </div>
        <form action="mailto:itsmepriyanshu36@gmail.com" className="grid gap-3">
          <input className="h-11 border border-[#efe7d1]/35 bg-[#17202a] px-3 text-[#fff3d6] outline-none placeholder:text-[#fff3d6]/45 focus:border-[#ff2aa8]" placeholder="NAME" />
          <input className="h-11 border border-[#efe7d1]/35 bg-[#17202a] px-3 text-[#fff3d6] outline-none placeholder:text-[#fff3d6]/45 focus:border-[#ff2aa8]" placeholder="EMAIL" type="email" />
          <textarea className="min-h-32 border border-[#efe7d1]/35 bg-[#17202a] p-3 text-[#fff3d6] outline-none placeholder:text-[#fff3d6]/45 focus:border-[#ff2aa8]" placeholder="MESSAGE" />
          <button className="retro-button h-11 border-[#ff2aa8] bg-[#7d155c]/90 text-white">
            &gt; Send Message
          </button>
        </form>
      </Reveal>
    </div>
  );
}

function Taskbar({ activeView, onNavigate }: { activeView: ViewId; onNavigate: (view: ViewId, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void }) {
  const taskItems = navItems.filter((item) => ["home", "about", "projects", "skills", "contact"].includes(item.id));

  return (
    <div className="retro-taskbar fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center gap-2 overflow-x-auto px-3 font-mono">
      <button onClick={(event) => onNavigate("home", event)} className="flex h-10 shrink-0 items-center gap-2 border border-[#333] bg-[#d7d1d8] px-4 shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_#4a4650]">
        <Terminal className="size-4" />
        Start
      </button>
      {taskItems.map((item) => (
        <button
          key={item.id}
          onClick={(event) => onNavigate(item.id, event)}
          className={cn(
            "flex h-10 min-w-36 shrink-0 items-center border border-[#333] bg-[#bfb8c4] px-3 shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_#4a4650]",
            activeView === item.id && "bg-[#eee8ef]",
          )}
        >
          <FileText className="mr-2 size-4" />
          {item.title}
        </button>
      ))}
      <span className="ml-auto hidden h-10 shrink-0 items-center gap-2 border border-[#333] bg-[#d7d1d8] px-4 shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_#4a4650] md:flex">
        <BriefcaseBusiness className="size-4" />
        11:45 PM
      </span>
    </div>
  );
}
