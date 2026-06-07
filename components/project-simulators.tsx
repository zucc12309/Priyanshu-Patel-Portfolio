"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, Brain, Car, CheckCircle2, CircleDollarSign, Database, GitBranch, Inbox, MapPin, Route, Server, Shield, Sparkles } from "lucide-react";
import { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

const iconMap = [Inbox, Brain, Database, GitBranch, Server, Shield, Route, Sparkles];

const rideCompareFrames = [
  { src: "/projects/ridecompare/phoneframe-3.png", alt: "RideCompare fare comparison screen" },
  { src: "/projects/ridecompare/phoneframe-4.png", alt: "RideCompare booking log screen" },
  { src: "/projects/ridecompare/phoneframe-5.png", alt: "RideCompare ride history screen" },
  { src: "/projects/ridecompare/phoneframe-6.png", alt: "RideCompare fare accuracy dashboard" },
  { src: "/projects/ridecompare/phoneframe-7.png", alt: "RideCompare profile and preferences screen" },
];

export function ArchitectureDiagram({ project }: { project: Project }) {
  return (
    <div className="retro-panel relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:18px_18px]" />
      <div className="relative grid gap-4 md:grid-cols-3">
        {project.architecture.map((node, index) => {
          const Icon = iconMap[index % iconMap.length];
          return (
            <motion.div
              key={node}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="relative border border-retro-text/10 bg-black/40 p-4"
            >
              <div className="mb-4 flex size-10 items-center justify-center border border-retro-green/40 bg-retro-green/8">
                <Icon className="size-5 text-retro-green" />
              </div>
              <p className="text-sm font-medium text-retro-text">{node}</p>
              <p className="mt-2 text-xs leading-5 text-retro-text/40">Layer {index + 1} in the product system.</p>
              {index < project.architecture.length - 1 ? (
                <div className="absolute -right-4 top-1/2 hidden h-px w-4 bg-[#efe7d1]/35 md:block" />
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkflowVisualization({ flows }: { flows: string[]; accent: Project["accent"] }) {
  return (
    <div className="grid gap-3 md:grid-cols-6">
      {flows.map((flow, index) => (
        <div key={flow} className="retro-panel relative p-4">
          <div className="mb-3 flex size-9 items-center justify-center border border-retro-amber/40 bg-retro-amber/8 text-xs font-semibold text-retro-amber">
            {index + 1}
          </div>
          <p className="text-sm font-medium text-retro-text">{flow}</p>
          {index < flows.length - 1 ? <div className="absolute -right-3 top-8 hidden h-px w-3 bg-[#efe7d1]/35 md:block" /> : null}
        </div>
      ))}
    </div>
  );
}

export function MemoryTerminal() {
  const lines = [
    "$ memory-router init --mode hybrid",
    "local memory: enabled | provider fallback: openai, anthropic, gemini",
    "$ memory-router memory add \"Prefer concise product specs\" --domain product",
    "stored in Memory Palace | confidence 0.91 | encrypted export ready",
    "$ memory-router build-context \"Draft a PRD for ride fare recommendations\"",
    "retrieved: pricing, maps, recommendation UX",
    "tokens_sent≈418 | saved≈87% | route=hybrid",
  ];

  return (
    <div className="retro-panel bg-[#05070b] p-4 font-mono text-sm">
      <div className="mb-4 flex gap-2">
        <span className="size-3 rounded-full bg-red-400/80" />
        <span className="size-3 rounded-full bg-amber/80" />
        <span className="size-3 rounded-full bg-mint/80" />
      </div>
      <div className="space-y-2">
        {lines.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.16 }}
            className={line.startsWith("$") ? "text-retro-green" : "text-retro-text/58"}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

export function RidePhoneSimulator() {
  const rides = [
    ["Namma Yatri", "₹184", "3 min", "Best value"],
    ["Rapido", "₹196", "5 min", "Fast pickup"],
    ["Ola Mini", "₹221", "7 min", "Stable fare"],
  ];

  return (
    <div className="mx-auto w-full max-w-[330px] rounded-[36px] border border-white/20 bg-black p-3 shadow-card">
      <div className="rounded-[28px] border border-white/10 bg-[#071017] p-5">
        <div className="mx-auto mb-5 h-6 w-24 rounded-full bg-black" />
        <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-white/70">
            <MapPin className="size-4 text-cyan" /> Indiranagar to Koramangala
          </div>
          <div className="h-28 rounded-[8px] bg-[linear-gradient(135deg,rgba(70,233,255,.18),rgba(88,255,200,.12)),linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:auto,22px_22px,22px_22px]" />
        </div>
        <div className="mt-4 space-y-3">
          {rides.map(([name, price, eta, tag], index) => (
            <motion.div
              key={name}
              animate={{ y: index === 0 ? [0, -3, 0] : 0 }}
              transition={{ duration: 3, repeat: Infinity }}
              className={cn("rounded-[8px] border p-3", index === 0 ? "border-mint/40 bg-mint/10" : "border-white/10 bg-white/[0.04]")}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{name}</span>
                <span className="font-semibold text-white">{price}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/55">
                <span>{eta} away</span>
                <span>{tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LifeAdminDashboard() {
  return (
    <div className="retro-panel p-4">
      <div className="grid gap-4 md:grid-cols-[1.1fr_1fr_.85fr]">
        <Panel title="Unified Inbox" icon={Inbox} items={["Renewal notice", "Invoice received", "Policy document"]} />
        <Panel title="Tasks" icon={CheckCircle2} items={["Review contract", "Pay broadband", "Upload tax file"]} />
        <Panel title="Subscriptions" icon={CircleDollarSign} items={["12 active", "₹18,400/month", "2 anomalies"]} />
      </div>
      <div className="mt-4 border border-accent-purple/30 bg-accent-purple/8 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
          <Sparkles className="size-4 text-blue" /> Agent orchestration
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {["Inbox triage", "Document intelligence", "Payment manager"].map((agent) => (
            <div key={agent} className="border border-retro-text/25 bg-black/45 p-3 text-sm text-retro-text/70">
              {agent}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, items }: { title: string; icon: typeof Inbox; items: string[] }) {
  return (
    <div className="border border-retro-text/25 bg-black/45 p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
        <Icon className="size-4 text-cyan" /> {title}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="border border-retro-text/15 bg-black/45 px-3 py-2 text-sm text-retro-text/62">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScreenshotGallery({ project }: { project: Project }) {
  if (project.slug === "ridecompare") {
    return (
      <div className="grid gap-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {rideCompareFrames.map((frame, index) => (
            <motion.div
              key={frame.src}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="relative mx-auto w-full max-w-[260px]"
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                width={550}
                height={1014}
                sizes="(max-width: 640px) 72vw, (max-width: 1024px) 34vw, 19vw"
                className="h-auto w-full"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Metric icon={Car} label="Providers compared" value="4+" />
          <Metric icon={Activity} label="Pricing loop" value="Estimate -> actual paid" />
          <Metric icon={MapPin} label="Maps layer" value="Backend-proxied places" />
        </div>
      </div>
    );
  }

  if (project.slug === "ai-lifeadmin-os") {
    return (
      <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <BuildScreenshotFrame src="/projects/lifeadmin-os-screen.png" alt="LifeAdmin built prototype screenshot" />
        <LifeAdminDashboard />
      </div>
    );
  }

  if (project.slug === "memory-router") {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative aspect-[16/10] overflow-hidden border border-retro-text/35 bg-black/30">
          <Image src="/projects/memory-router-playground-screen.png" alt="Memory Router playground screenshot" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-top" />
        </div>
        <MemoryTerminal />
      </div>
    );
  }

  if (project.slug === "crm-workflow-automation") {
    return (
      <div className="grid gap-6">
        <div className="relative aspect-[16/9] overflow-hidden border border-retro-text/35 bg-black/30">
          <Image src="/projects/crm-n8n-workflow.png" alt="CRM workflow automation n8n workflow canvas" fill sizes="100vw" className="object-cover" />
        </div>
        <WorkflowVisualization flows={project.flows} accent={project.accent} />
      </div>
    );
  }

  return <WorkflowVisualization flows={project.flows} accent={project.accent} />;
}

function BuildScreenshotFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto w-full max-w-[340px] rounded-[34px] border border-white/20 bg-black p-3 shadow-card">
      <div className="relative aspect-[390/844] overflow-hidden rounded-[26px] bg-white">
        <Image src={src} alt={alt} fill sizes="340px" className="object-cover" />
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Car; label: string; value: string }) {
  return (
    <div className="retro-panel p-5">
      <Icon className="mb-4 size-5 text-mint" />
      <p className="text-sm text-retro-text/50">{label}</p>
      <p className="mt-1 font-medium text-retro-text">{value}</p>
    </div>
  );
}
