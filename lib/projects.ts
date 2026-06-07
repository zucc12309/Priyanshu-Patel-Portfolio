export type Project = {
  slug: string;
  title: string;
  type: "Open Source" | "Private Project";
  status: string;
  image: string;
  repo?: string;
  live?: string;
  caseStudy: string;
  description: string;
  features: string[];
  stack: string[];
  impact: string[];
  challenges: string[];
  learnings: string[];
  architecture: string[];
  sections: {
    problem: string;
    solution: string;
    decisions: string[];
    roadmap: string[];
  };
  flows: string[];
  accent: "cyan" | "mint" | "blue" | "amber";
};

export const projects: Project[] = [
  {
    slug: "memory-router",
    title: "Memory Router",
    type: "Open Source",
    status: "Local-first AI infrastructure",
    image: "/projects/memory-router.png",
    repo: "https://github.com/zucc12309/memory-router",
    caseStudy: "/case-studies/memory-router.html",
    description:
      "I built a local-first intelligent model routing system with structured memory, semantic retrieval, context optimization, adaptive provider routing, and MCP integration.",
    features: [
      "Local memory storage",
      "Vector retrieval",
      "Context optimization",
      "Hybrid model routing",
      "MCP support",
      "CLI interface",
    ],
    stack: ["Python", "SQLite / FTS5", "Vector retrieval", "MCP", "Ollama", "OpenAI", "Anthropic", "Gemini"],
    impact: [
      "I reduced input context by roughly 80-90% in typical README examples",
      "I kept user memory local while still supporting cloud model fallback",
      "I used the project to explore privacy, context quality, and AI infrastructure tradeoffs",
    ],
    challenges: [
      "I had to balance retrieval relevance, privacy, and provider latency",
      "I designed a CLI that stays simple while supporting multiple routing modes",
      "I worked through how memory decay and consolidation should feel predictable for users",
    ],
    learnings: [
      "I learned that AI products need strong defaults before they need more controls",
      "I learned how local-first infrastructure changes the trust story of personal AI tools",
      "I now treat routing as a product surface, not just an optimization technique",
    ],
    architecture: ["CLI + MCP Server", "Classifier", "Context Builder", "Memory Palace + FTS5", "Vector Store", "Router + Providers", "Security + Health"],
    sections: {
      problem:
        "LLM workflows often resend too much context, lose durable memory, and force users to choose between privacy and capability.",
      solution:
        "I built a local-first memory and routing layer that retrieves relevant knowledge, assembles a compact prompt, and sends it to the right provider.",
      decisions: [
        "I used SQLite and FTS5 to keep the base storage portable and inspectable",
        "I separated routing logic from model-specific APIs through provider abstractions",
        "I added MCP support so the system can plug into agent tooling instead of living as a standalone script",
      ],
      roadmap: ["Richer evaluation loops", "More MCP clients", "Visual memory inspection", "Sandboxed public demos"],
    },
    flows: ["Capture memory", "Score relevance", "Assemble context", "Route provider", "Stream answer", "Record outcome"],
    accent: "cyan",
  },
  {
    slug: "ridecompare",
    title: "RideCompare",
    type: "Private Project",
    status: "Production-grade MVP",
    image: "/projects/ridecompare.png",
    live: "#",
    caseStudy: "/case-studies/ridecompare.html",
    description:
      "I built a mobile product that compares ride fares across multiple providers and helps users choose the best route, price, and booking option.",
    features: [
      "Multi-provider comparison",
      "Route optimization",
      "Fare estimation",
      "ML-assisted pricing",
      "Maps integration",
      "Real-time recommendations",
    ],
    stack: ["Flutter", "Dart", "Node.js", "Express", "PostgreSQL", "Google Maps API", "JWT", "Railway"],
    impact: [
      "I turned a repetitive consumer decision into a ranked recommendation",
      "I track shown fare versus actual paid fare to improve pricing accuracy",
      "I owned the requirements, fare logic, API contracts, testing, and release-readiness thinking",
    ],
    challenges: [
      "I had to normalize provider estimates across inconsistent pricing models",
      "I protected maps and app credentials through backend proxies",
      "I designed trust signals for price confidence and recommendation quality",
    ],
    learnings: [
      "I learned that consumer AI has to earn trust through clear comparisons",
      "I learned that pricing systems need feedback loops, not static formulas",
      "I learned mobile UX improves when recommendations explain the tradeoff",
    ],
    architecture: ["Flutter Screens", "App Services + Session Store", "Node/Express API", "Fare Engine", "Google Maps Proxy", "PostgreSQL Migrations", "Bookings + Analytics"],
    sections: {
      problem:
        "Ride pricing is fragmented across apps, and users waste time checking providers manually without knowing which option is actually best.",
      solution:
        "I built a mobile comparison layer that estimates fares, highlights savings, tracks accuracy, and deep-links into provider apps.",
      decisions: [
        "I used backend proxies to protect map keys and centralize fare logic",
        "I made fare configuration DB-driven to avoid hardcoded provider pricing",
        "I record booking history so estimate accuracy can improve over time",
      ],
      roadmap: ["Live provider integrations", "Personalized savings model", "Trip bundles", "City expansion", "Native booking handoff"],
    },
    flows: ["Enter route", "Fetch places", "Estimate providers", "Rank options", "Recommend ride", "Track outcome"],
    accent: "mint",
  },
  {
    slug: "ai-lifeadmin-os",
    title: "AI LifeAdmin OS",
    type: "Private Project",
    status: "Personal AI operations system",
    image: "/projects/lifeadmin-os.png",
    caseStudy: "/case-studies/lifeadmin-os.html",
    description:
      "I designed a personal AI operating system to manage tasks, subscriptions, documents, reminders, payments, and life administration through intelligent agents.",
    features: [
      "Unified Inbox",
      "Task Management",
      "Document Vault",
      "Subscription Tracking",
      "AI Assistant",
      "Automation Workflows",
    ],
    stack: ["React prototype", "Node.js", "Express", "PostgreSQL", "Redis queues", "Gmail sync", "LLM services", "Encryption"],
    impact: [
      "I reframed personal admin as an agent-orchestrated operating system",
      "I combined documents, renewals, tasks, reminders, and payments into one workflow",
      "I defined a product vision for proactive consumer automation with review queues and privacy-aware ingestion",
    ],
    challenges: [
      "I had to design around sensitive personal data with encryption and redaction",
      "I worked through how agents can be helpful without becoming noisy",
      "I turned multiple admin categories into a coherent daily workflow",
    ],
    learnings: [
      "I learned the inbox is the best entry point for personal automation",
      "I learned agent products need review queues and confidence states",
      "I learned premium UX matters more when the product touches money and documents",
    ],
    architecture: ["Flutter iOS App", "Node/Express API", "Gmail + Upload Ingestion", "OCR + LLM Extraction", "Review Queue", "Postgres Schemas", "Digest + Reminder Jobs"],
    sections: {
      problem:
        "Life administration is scattered across email, documents, subscriptions, calendars, and payment reminders, creating missed renewals and hidden work.",
      solution:
        "I designed an AI-native command center that extracts obligations, prioritizes tasks, and coordinates specialized agents with human review.",
      decisions: [
        "I used review queues to keep automation auditable",
        "I treated PII redaction and encryption as core product primitives",
        "I designed daily digest jobs to turn passive data into proactive action",
      ],
      roadmap: ["Native mobile app", "Bank and wallet integrations", "Family workspace", "Agent marketplace", "Autonomous renewal negotiation"],
    },
    flows: ["Sync inbox", "Extract obligations", "Classify priority", "Route to agent", "Request review", "Automate follow-up"],
    accent: "blue",
  },
  {
    slug: "crm-workflow-automation",
    title: "CRM Workflow Automation",
    type: "Open Source",
    status: "CRM analytics automation",
    image: "/projects/crm-workflow.png",
    repo: "https://github.com/zucc12309/CRM-workflow-automation",
    caseStudy: "/case-studies/crm-workflow-automation.html",
    description:
      "I built a workflow automation system focused on streamlining CRM operations, routing work, improving reporting, and reducing manual effort.",
    features: ["Workflow orchestration", "Process automation", "Reporting", "Integrations", "Business process optimization"],
    stack: ["Workflow rules", "CRM process mapping", "Automation logic", "Analytics", "Integrations", "Reporting"],
    impact: [
      "I automated CRM export processing from email intake through formatted reporting",
      "I improved process visibility with cleaned KPIs, exception flags, and briefing output",
      "I translated business-analysis thinking into data cleaning, workflow design, and executive reporting",
    ],
    challenges: [
      "I mapped CRM export quality issues into deterministic preprocessing rules",
      "I designed error paths for failed or low-quality inputs",
      "I balanced automation speed with auditability and stakeholder-ready reporting",
    ],
    learnings: [
      "I learned automation is only valuable when it fits the process owner’s mental model",
      "I learned reporting should explain bottlenecks, not just count activity",
      "I learned the best workflow products make handoffs visible",
    ],
    architecture: ["Gmail CRM Export Trigger", "n8n Workflow", "Python Preprocessing", "Formatting Script", "AI Briefing", "Power BI Refresh", "Success/Error Email"],
    sections: {
      problem:
        "CRM teams lose time to manual updates, lead routing, status checks, follow-ups, and reporting that should happen automatically.",
      solution:
        "I built a workflow layer that orchestrates CRM actions, tracks outcomes, and gives operators visibility into process performance.",
      decisions: [
        "I used n8n to keep orchestration visible for business-process review",
        "I used Python scripts for data cleaning, formatting, KPI calculation, and Power BI export",
        "I designed success and error email paths so operational exceptions stay explicit",
      ],
      roadmap: ["Credential hardening", "More CRM export templates", "SLA monitoring", "Power BI dashboard expansion"],
    },
    flows: ["Receive CRM export", "Clean dataset", "Calculate KPIs", "Generate briefing", "Refresh dashboard", "Email report"],
    accent: "amber",
  },
];

export const publicRepos = projects.filter((project) => project.repo);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const focusAreas = [
  "Requirements & BRD/SRS",
  "SQL & Data Analysis",
  "API & System Integration",
  "UAT & Test Cases",
  "Workflow Automation",
  "Stakeholder Management",
  "Agile Delivery",
  "System Design",
];

export const buildSteps = ["Research", "Discovery", "Requirements", "Data Analysis", "API Contracts", "UAT", "Release", "RCA & Iteration"];
