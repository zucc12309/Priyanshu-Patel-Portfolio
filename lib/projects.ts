export type Accent = "cyan" | "mint" | "blue" | "amber";

export type ProjectCategory = "AI" | "Infra" | "Fintech" | "Commerce" | "Mobile" | "Automation";

export type Project = {
  slug: string;
  title: string;
  /** Filename shown in Priyanshu OS, e.g. MEMORY_ROUTER.APP */
  file: string;
  /** Two-letter monogram used for the pixel app icon */
  monogram: string;
  subtitle?: string;
  type: "Open Source" | "Private Project";
  status: string;
  featured?: boolean;
  categories: ProjectCategory[];
  /** One line a visitor should get in five seconds */
  tagline: string;
  description: string;
  role: string;
  problem: string;
  solution: string;
  built: string[];
  decisions: string[];
  metrics: { value: string; label: string }[];
  features: string[];
  stack: string[];
  architecture: string[];
  flows: string[];
  image?: string;
  repo?: string;
  live?: { label: string; href: string };
  caseStudy?: string;
  challenges?: string[];
  learnings?: string[];
  roadmap?: string[];
  accent: Accent;
};

export const projects: Project[] = [
  {
    slug: "memory-router",
    title: "Memory Router",
    file: "MEMORY_ROUTER.APP",
    monogram: "MR",
    type: "Open Source",
    status: "Local-first AI infrastructure",
    featured: true,
    categories: ["AI", "Infra"],
    tagline: "A local-first memory and model-routing layer that cuts LLM input tokens by 80–90%.",
    description:
      "I built a local-first context optimisation layer: it stores structured memory on your machine, retrieves only what matters, assembles a compact prompt and routes it to the best available model.",
    role: "Solo builder: product definition, architecture, Python implementation, CLI + MCP surface, test suite.",
    problem:
      "LLM workflows resend too much context, lose durable memory, and force users to choose between privacy and capability.",
    solution:
      "A memory layer that retrieves relevant knowledge, assembles a compact prompt, and sends it to the right provider — with every byte of memory staying on the laptop.",
    built: [
      "Memory Palace on SQLite + FTS5 with confidence decay and reinforcement",
      "Priority-scored context assembly that drops low-value blocks first",
      "Adaptive router across Ollama, OpenAI, Anthropic and Gemini with automatic fallback",
      "MCP server + CLI, streaming responses and AES-256-GCM encrypted export",
    ],
    decisions: [
      "SQLite + FTS5 keeps storage portable, inspectable and instant at any scale",
      "Routing is separated from model APIs through provider abstractions",
      "MCP support so it plugs into agent tooling instead of living as a script",
      "API keys live in the OS keychain; there is no cloud component to opt out of",
    ],
    metrics: [
      { value: "80–90%", label: "input tokens saved" },
      { value: "4", label: "LLM providers routed" },
      { value: "368+", label: "automated tests" },
      { value: "0", label: "cloud components" },
    ],
    features: ["Local memory storage", "Vector retrieval", "Context optimisation", "Hybrid model routing", "MCP support", "CLI interface"],
    stack: ["Python", "SQLite / FTS5", "Vector retrieval", "MCP", "Ollama", "OpenAI", "Anthropic", "Gemini"],
    architecture: ["CLI + MCP Server", "Classifier", "Context Builder", "Memory Palace + FTS5", "Vector Store", "Router + Providers", "Security + Health"],
    flows: ["Capture memory", "Score relevance", "Assemble context", "Route provider", "Stream answer", "Record outcome"],
    image: "/projects/memory-router.png",
    repo: "https://github.com/zucc12309/memory-router",
    live: { label: "Try playground", href: "/projects/memory-router/playground" },
    caseStudy: "/case-studies/memory-router.html",
    challenges: [
      "Balancing retrieval relevance, privacy, and provider latency",
      "Keeping the CLI simple while supporting multiple routing modes",
      "Making memory decay and consolidation feel predictable for users",
    ],
    learnings: [
      "AI products need strong defaults before they need more controls",
      "Local-first infrastructure changes the trust story of personal AI tools",
      "Routing is a product surface, not just an optimisation technique",
    ],
    roadmap: ["Richer evaluation loops", "More MCP clients", "Visual memory inspection", "Sandboxed public demos"],
    accent: "cyan",
  },
  {
    slug: "lifepilot",
    title: "LifePilot",
    file: "LIFEPILOT.APP",
    monogram: "LP",
    type: "Private Project",
    status: "Telegram-first MVP · Swiggy MCP",
    featured: true,
    categories: ["AI", "Commerce"],
    tagline: "A memory-first AI commerce agent that plans food and grocery orders — and never spends without your tap.",
    description:
      "A Telegram-first AI commerce OS. It remembers routines, budget and household, reasons over calendar, weather and Swiggy context, and proposes orders that only execute after explicit approval.",
    role: "Solo builder: product spec, agent-loop design, Python services, Swiggy MCP + OAuth integration, web setup flow.",
    problem:
      "Household commerce — groceries, meals, restocks — is repetitive decision work. But handing an AI agent your wallet without guardrails is a trust problem.",
    solution:
      "A Context → Memory → Reasoning → Recommendation → Approval → Execution → Memory-update loop, where every recommendation explains why and every purchase needs an explicit button tap.",
    built: [
      "Telegram bot with Confirm / Skip / Edit inline approvals wired end-to-end",
      "Fact-shaped SQLite memory: FTS5 + 768-dim embeddings with importance-ranked recall",
      "LLM reasoning (Ollama-first, Claude/OpenAI pluggable) with schema-validated plans and rule-based fallback",
      "Real Swiggy MCP client: dynamic client registration, OAuth PKCE, cart and checkout tools",
      "React setup form with magic-link auth and Google Places autocomplete",
    ],
    decisions: [
      "One approval service is the single source of truth — no plan executes without a tap",
      "Two-stage cart cap (before and after update_cart) clears the cart if the real total breaches budget",
      "Guardrails scrub every LLM reply for URLs, tokens, secrets and false 'order placed' claims",
      "Per-user Real / Demo mode so the full loop can be shown without spending money",
    ],
    metrics: [
      { value: "7-step", label: "decision loop" },
      { value: "2-stage", label: "spend-cap enforcement" },
      { value: "500+", label: "automated tests" },
      { value: "0", label: "purchases without approval" },
    ],
    features: ["Telegram-first UX", "Long-term memory recall", "Calendar + weather context", "Budget caps", "Approval-gated checkout", "Web setup form"],
    stack: ["Python", "FastAPI", "aiogram", "SQLite / FTS5", "Embeddings", "Ollama / Claude / OpenAI", "Swiggy MCP", "React"],
    architecture: [
      "Telegram Bot",
      "Memory Service (facts + embeddings)",
      "Context Providers (calendar, weather, budget)",
      "LLM Reasoning Engine",
      "Guardrails + Approval Service",
      "Executor + Swiggy MCP",
      "FastAPI + React Setup",
    ],
    flows: ["Message arrives", "Recall memory", "Build context", "Reason + validate", "Request approval", "Execute + remember"],
    accent: "amber",
  },
  {
    slug: "ridecompare",
    title: "RideCompare",
    file: "RIDECOMPARE.APP",
    monogram: "RC",
    type: "Private Project",
    status: "Production-grade mobile MVP",
    featured: true,
    categories: ["Mobile", "Commerce"],
    tagline: "Compare Uber, Ola, Rapido and Namma Yatri fares in one tap — and learn from what you actually paid.",
    description:
      "A Flutter app that estimates fares across four ride platforms, highlights the cheapest option, deep-links into the chosen app, and tracks shown-vs-paid fares to improve accuracy.",
    role: "Product owner + full-stack builder: PRD, fare engine, API contracts, Flutter app, test suite, release.",
    problem:
      "Ride pricing is fragmented across apps, and users waste time checking providers manually without knowing which option is actually best.",
    solution:
      "A mobile comparison layer that estimates fares, ranks options, highlights savings, tracks estimate accuracy and deep-links into provider apps.",
    built: [
      "Flutter app (iOS & Android): route entry, ranked fares, one-tap deep-links",
      "Node/Express fare engine with DB-driven slab pricing and surge/night multipliers",
      "Google Maps / Places proxied through the backend for key safety and caching",
      "Shown-vs-paid tracking with per-platform accuracy stats",
      "Phone OTP + JWT auth; CI/CD via GitHub Actions to Railway",
    ],
    decisions: [
      "Backend proxies protect map keys and centralise fare logic",
      "Fare configuration is DB-driven — no hard-coded provider pricing",
      "Booking history is recorded so estimate accuracy improves over time",
    ],
    metrics: [
      { value: "4", label: "platforms compared" },
      { value: "163", label: "Jest tests" },
      { value: "16", label: "DB migrations" },
      { value: "2", label: "mobile platforms" },
    ],
    features: ["Multi-provider comparison", "Route optimisation", "Fare estimation", "Accuracy tracking", "Maps integration", "Deep-link booking"],
    stack: ["Flutter", "Dart", "Node.js", "Express", "PostgreSQL", "Google Maps API", "JWT", "Railway"],
    architecture: ["Flutter Screens", "App Services + Session Store", "Node/Express API", "Fare Engine", "Google Maps Proxy", "PostgreSQL Migrations", "Bookings + Analytics"],
    flows: ["Enter route", "Fetch places", "Estimate providers", "Rank options", "Recommend ride", "Track outcome"],
    image: "/projects/ridecompare.png",
    caseStudy: "/case-studies/ridecompare.html",
    challenges: [
      "Normalising provider estimates across inconsistent pricing models",
      "Protecting maps and app credentials through backend proxies",
      "Designing trust signals for price confidence and recommendation quality",
    ],
    learnings: [
      "Consumer AI has to earn trust through clear comparisons",
      "Pricing systems need feedback loops, not static formulas",
      "Mobile UX improves when recommendations explain the trade-off",
    ],
    roadmap: ["Live provider integrations", "Personalised savings model", "City expansion", "Native booking handoff"],
    accent: "mint",
  },
  {
    slug: "ai-lifeadmin-os",
    title: "LifeAdmin OS",
    file: "LIFEADMIN_OS.APP",
    monogram: "LA",
    type: "Private Project",
    status: "Personal-use V0 · running on my iPhone",
    categories: ["AI", "Mobile"],
    tagline: "A personal AI admin assistant that turns bills, renewals and reimbursements into one calm dashboard.",
    description:
      "A Flutter + Node app that reads Gmail, screenshots and PDFs, extracts obligations with on-device OCR and Claude, and queues them for review before anything is automated.",
    role: "Solo builder: PRD, design spec, Flutter app, Node API, extraction pipeline.",
    problem:
      "Life admin is scattered across email, documents, subscriptions and payment reminders — creating missed renewals and hidden work.",
    solution:
      "An AI-native command centre that extracts obligations, prioritises tasks and keeps a human review step in front of every automation.",
    built: [
      "Flutter iOS app with phone OTP and Apple Sign In",
      "Gmail + upload ingestion feeding OCR and LLM extraction",
      "On-device OCR (Google ML Kit) — image bytes never leave the phone",
      "Tiered extraction: Claude Haiku for bulk, Sonnet for hard cases",
      "Review queue plus digest / reminder jobs on Node, Express and Postgres",
    ],
    decisions: [
      "Review queues keep automation auditable",
      "PII redaction and encryption treated as core product primitives",
      "Reused RideCompare's proven Flutter / Node / Postgres patterns to ship V0 fast",
    ],
    metrics: [
      { value: "V0", label: "live on my own iPhone" },
      { value: "19", label: "Postgres migrations" },
      { value: "On-device", label: "OCR for privacy" },
      { value: "2-tier", label: "LLM extraction" },
    ],
    features: ["Unified inbox", "Task management", "Document vault", "Subscription tracking", "AI extraction", "Review queue"],
    stack: ["Flutter", "Dart", "Node.js", "Express", "PostgreSQL", "Google ML Kit", "Claude API", "JWT"],
    architecture: ["Flutter iOS App", "Node/Express API", "Gmail + Upload Ingestion", "OCR + LLM Extraction", "Review Queue", "Postgres Schemas", "Digest + Reminder Jobs"],
    flows: ["Sync inbox", "Extract obligations", "Classify priority", "Request review", "Remind", "Automate follow-up"],
    image: "/projects/lifeadmin-os.png",
    caseStudy: "/case-studies/lifeadmin-os.html",
    challenges: [
      "Designing around sensitive personal data with encryption and redaction",
      "Making agents helpful without becoming noisy",
      "Turning many admin categories into one coherent daily workflow",
    ],
    learnings: [
      "The inbox is the best entry point for personal automation",
      "Agent products need review queues and confidence states",
      "Premium UX matters more when the product touches money and documents",
    ],
    roadmap: ["Bank and wallet integrations", "Family workspace", "Public V1 on Railway (Mumbai)"],
    accent: "blue",
  },
  {
    slug: "lecrec",
    title: "Lecrec",
    file: "LECREC.APP",
    monogram: "LC",
    type: "Private Project",
    status: "Limited-drop D2C commerce",
    categories: ["Commerce"],
    tagline: "Limited-edition watch drops — 100 pieces per edition — on a reservation engine that can't oversell.",
    description:
      "Commerce platform for a stone-dial watch label: waitlist → invite → timed reservation → order, designed to stay correct when hundreds of buyers hit 'reserve' in the same second.",
    role: "Product + engineering: drop mechanics, concurrency spec, data model, Next.js build, tests.",
    problem:
      "Limited drops create a thundering-herd moment. Hundreds of buyers race for fixed stock, and a naïve read-then-write checkout oversells or double-reserves.",
    solution:
      "A reserve → confirm → order lifecycle where an atomic Redis Lua script is the live availability counter and Postgres is the durable record — with a serialised-transaction fallback when Redis is absent.",
    built: [
      "Atomic Redis Lua reservation: stock decrement, per-buyer lock and self-expiring hold in one call",
      "Prisma / Postgres model for products, stone variants, waitlist, reservations and orders",
      "Waitlist with invite codes and a gated admin drop console",
      "Per-minute cron sweep that returns expired holds to stock",
      "Rate limiting, JWT auth, Vitest unit and Playwright end-to-end tests",
    ],
    decisions: [
      "Idempotent reserve: a buyer who double-clicks gets the same unit back, not two",
      "Redis decides availability; Postgres settles disputes and only decrements at confirm",
      "Zero-dependency Postgres fallback keeps the full flow runnable locally",
    ],
    metrics: [
      { value: "100", label: "pieces per edition" },
      { value: "1", label: "atomic op per reservation" },
      { value: "0", label: "oversells by design" },
      { value: "60s", label: "expiry sweep" },
    ],
    features: ["Waitlist + invites", "Timed reservations", "Atomic stock", "Admin drop console", "Accounts", "Policy pages"],
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Redis + Lua", "Zod", "Vercel Cron", "Playwright"],
    architecture: ["Next.js Storefront", "Waitlist + Invites", "Reserve API", "Redis Lua Counter", "Postgres (Prisma)", "Cron Expiry Sweep", "Admin Drop Console"],
    flows: ["Join waitlist", "Receive invite", "Reserve unit", "Hold (TTL)", "Confirm order", "Sweep expired"],
    accent: "cyan",
  },
  {
    slug: "ai-agent-os",
    title: "AI Agent OS",
    subtitle: "Agent Gateway",
    file: "AGENT_GATEWAY.APP",
    monogram: "AG",
    type: "Open Source",
    status: "Secure MCP / API gateway for agents",
    categories: ["AI", "Infra"],
    tagline: "A permissioned gateway that lets AI agents use business tools — with approvals and a tamper-evident audit trail.",
    description:
      "A FastAPI + MCP service that sits between AI agents and tools like PostgreSQL, Gmail and internal APIs, enforcing permissions, risk-based approvals and audit logging, with a Next.js operator dashboard.",
    role: "Solo builder: architecture, FastAPI + MCP backend, security model, operator dashboard, structured self-reviews.",
    problem:
      "Teams want agents to query databases, send email and call internal APIs — but direct tool access gives an LLM unchecked write power and no record of what it did.",
    solution:
      "A tool registry carrying schema, risk and approval metadata, per-agent permissions, approval gating for high-risk actions and hash-chained audit logs.",
    built: [
      "Tool registry with schema, risk level and approval metadata per tool",
      "FastMCP server mounted at /mcp alongside the REST API",
      "Approval workflow: high-risk tools create requests instead of executing",
      "Audit log for every attempt, with payload redaction and hash chaining",
      "Operator dashboard on HttpOnly sessions — raw keys never touch browser storage",
    ],
    decisions: [
      "API keys hashed with a pepper, never stored in plaintext",
      "Postgres connector limited to an allowlisted table with safe equality filters",
      "Internal API connector rejects absolute URLs, traversal and user-supplied headers",
      "Wrote seven structured reviews (architecture, backend, security, agent flows, frontend, DevOps)",
    ],
    metrics: [
      { value: "100%", label: "executions audited" },
      { value: "4", label: "MCP tools exposed" },
      { value: "7", label: "self-review audits" },
      { value: "1 cmd", label: "Docker stack" },
    ],
    features: ["Tool registry", "Per-agent permissions", "Approval gating", "Audit logs", "MCP endpoint", "Operator dashboard"],
    stack: ["Python", "FastAPI", "FastMCP", "PostgreSQL", "Pydantic", "Next.js", "Docker"],
    architecture: ["Next.js Operator Dashboard", "FastAPI Backend", "API Key → HttpOnly Session", "Tool Registry + Permissions", "Approval Engine", "Hash-chained Audit Log", "Connectors: Postgres / Gmail / APIs"],
    flows: ["Agent calls tool", "Check permission", "Assess risk", "Approve or queue", "Execute connector", "Audit + redact"],
    repo: "https://github.com/zucc12309/Ai-agent-os",
    accent: "blue",
  },
  {
    slug: "ai-hedge-fund",
    title: "AI Hedge Fund",
    subtitle: "Indian Investment OS",
    file: "INVESTMENT_OS.APP",
    monogram: "HF",
    type: "Open Source",
    status: "MCP-first investment research OS",
    categories: ["AI", "Fintech"],
    tagline: "An MCP-first OS for an AI-native investment firm in Indian markets — research-first, risk-gated, paper by default.",
    description:
      "A local-first system that gives AI clients durable financial memory, thesis tracking, structured Bull/Bear/Judge review and pre-trade risk checks as MCP tools, with a dashboard for agent activity and paper trading.",
    role: "Solo builder: system architecture, Python MCP server, risk rules, Zerodha integration, Next.js dashboard.",
    problem:
      "LLM 'trading bots' jump straight to orders. Real investment work needs memory of events, beliefs and theses, structured debate and hard risk checks before capital moves.",
    solution:
      "The host model does the reasoning; the OS supplies memory and deterministic services — and no live order can happen without passing explicit gates.",
    built: [
      "24 MCP tools: event / belief / thesis memory, context search, thesis review, pre-trade checks",
      "Deterministic Bull / Bear / Judge thesis-review scaffolding",
      "Paper-trading engine with virtual cash, positions and a trade tape",
      "Zerodha Kite Connect quotes, OHLC and candles behind write gates",
      "Next.js dashboard: agent timeline, memory search, thesis verdicts, performance",
    ],
    decisions: [
      "Live orders need a write gate, a risk check and a live-order switch",
      "No LLM API dependency — MCP lets the client's model do the reasoning",
      "MCP write tools are read-only unless the server starts with --allow-writes",
      "Financial memory layer inspired by Memory Router, kept standalone around financial schemas",
    ],
    metrics: [
      { value: "24", label: "MCP tools" },
      { value: "3", label: "gates before a live order" },
      { value: "Paper", label: "default mode" },
      { value: "0", label: "LLM API keys required" },
    ],
    features: ["Financial memory", "Thesis tracking", "Bull/Bear/Judge review", "Pre-trade risk checks", "Paper trading", "Zerodha market data"],
    stack: ["Python", "MCP", "Next.js", "Zerodha Kite Connect", "Local-first storage"],
    architecture: ["MCP Clients (Claude, Codex, Cursor)", "MCP Server", "Financial Memory", "Thesis Review (Bull/Bear/Judge)", "Pre-trade Risk Checks", "Paper / Zerodha Execution Gate", "Dashboard + Audit"],
    flows: ["Ingest event", "Store belief", "Propose thesis", "Debate + review", "Pre-trade check", "Paper trade + record"],
    repo: "https://github.com/zucc12309/AI-HEDGE-FUND",
    accent: "mint",
  },
  {
    slug: "crm-workflow-automation",
    title: "CRM Workflow Automation",
    file: "CRM_AUTOMATION.APP",
    monogram: "CR",
    type: "Open Source",
    status: "CRM analytics automation",
    categories: ["Automation"],
    tagline: "From raw CRM export in an inbox to a cleaned KPI briefing and refreshed Power BI dashboard — automatically.",
    description:
      "A workflow that streamlines CRM operations: email intake, data cleaning, KPI calculation, an AI briefing and dashboard refresh, with explicit success and error paths.",
    role: "Builder: process mapping, n8n orchestration, Python preprocessing, reporting design.",
    problem:
      "CRM teams lose time to manual exports, cleaning, status checks and reporting that should happen automatically.",
    solution:
      "A workflow layer that orchestrates the CRM reporting pipeline, tracks outcomes and gives operators visibility into exceptions.",
    built: [
      "Gmail-triggered n8n workflow for CRM export intake",
      "Python preprocessing: cleaning, formatting and KPI calculation",
      "AI-generated briefing and Power BI refresh",
      "Success / error email paths so exceptions stay visible",
    ],
    decisions: [
      "n8n keeps orchestration visible for business-process review",
      "Python scripts own cleaning, formatting, KPIs and Power BI export",
      "Explicit success and error emails make operational exceptions obvious",
    ],
    metrics: [
      { value: "7", label: "pipeline stages" },
      { value: "n8n + Py", label: "orchestration + scripts" },
      { value: "2", label: "outcome paths (ok / error)" },
      { value: "1", label: "refreshed dashboard" },
    ],
    features: ["Workflow orchestration", "Process automation", "Reporting", "Integrations", "Business process optimisation"],
    stack: ["n8n", "Python", "Power BI", "Gmail", "LLM briefing"],
    architecture: ["Gmail CRM Export Trigger", "n8n Workflow", "Python Preprocessing", "Formatting Script", "AI Briefing", "Power BI Refresh", "Success/Error Email"],
    flows: ["Receive CRM export", "Clean dataset", "Calculate KPIs", "Generate briefing", "Refresh dashboard", "Email report"],
    image: "/projects/crm-workflow.png",
    repo: "https://github.com/zucc12309/CRM-workflow-automation",
    caseStudy: "/case-studies/crm-workflow-automation.html",
    challenges: [
      "Mapping CRM export quality issues into deterministic preprocessing rules",
      "Designing error paths for failed or low-quality inputs",
      "Balancing automation speed with auditability",
    ],
    learnings: [
      "Automation is only valuable when it fits the process owner's mental model",
      "Reporting should explain bottlenecks, not just count activity",
      "The best workflow products make handoffs visible",
    ],
    roadmap: ["Credential hardening", "More CRM export templates", "SLA monitoring"],
    accent: "amber",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const projectCategories: ProjectCategory[] = ["AI", "Infra", "Fintech", "Commerce", "Mobile", "Automation"];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** Loose lookup used by the terminal: slug, title or monogram, case-insensitive. */
export function findProject(query: string) {
  const q = query.trim().toLowerCase().replace(/\s+/g, "-");
  if (!q) return undefined;
  return (
    projects.find((p) => p.slug === q || p.title.toLowerCase().replace(/\s+/g, "-") === q || p.monogram.toLowerCase() === q) ??
    projects.find((p) => p.slug.includes(q) || p.title.toLowerCase().replace(/\s+/g, "-").includes(q))
  );
}

export const buildSteps = ["Research", "Discovery", "Requirements", "Data Analysis", "API Contracts", "UAT", "Release", "RCA & Iteration"];
