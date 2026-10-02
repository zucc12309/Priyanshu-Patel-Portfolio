export const profile = {
  name: "Priyanshu Patel",
  first: "Priyanshu",
  last: "Patel",
  role: "Business Analyst",
  title: "Associate Manager — Business Analyst",
  company: "Digit Life Insurance",
  location: "Bengaluru, India",
  timezone: "Asia/Kolkata",
  email: "itsmepriyanshu36@gmail.com",
  github: "https://github.com/zucc12309",
  linkedin: "https://www.linkedin.com/in/priyanshu-patel-069331200/",
  resume: "/cv/priyanshu-patel-business-analyst-cv.pdf",
  positioning: "Business Analyst · AI Product Builder",
  intro:
    "I'm a Business Analyst at Digit Life Insurance, moving into product management. I turn messy business inputs into clear requirements and working systems — and I design and ship my own AI products, using AI-assisted development, to sharpen my product judgement.",
};

export const impact = [
  { value: "₹1,500+ Cr", label: "Premium portfolio I support", detail: "Group Life products at Digit Life Insurance, 2L+ transactions a month." },
  { value: "−40%", label: "Post-release defects", detail: "After I led UAT with 80+ end-to-end test cases." },
  { value: "−30%", label: "Manual effort", detail: "By automating workflows with 10+ business rules." },
  { value: "+18%", label: "Data accuracy", detail: "From validation logic built into policy issuance." },
];

export const work = {
  company: "Digit Life Insurance",
  title: "Associate Manager — Business Analyst",
  period: "Jun 2025 — Present",
  location: "Bengaluru",
  headline: "Driving Group Life product delivery across a ₹1,500+ Cr premium portfolio.",
  context:
    "Group Life insurance for enterprise clients: 2L+ monthly transactions that depend on precise business rules, cross-functional coordination and continuous delivery.",
  approach: [
    "Led end-to-end SDLC — requirements, GAP analysis, API & schema design, UAT and release",
    "Defined API contracts (request / response, error handling), database schemas and UI workflows aligned with Figma",
    "Analysed high-volume transaction data in SQL to find inefficiencies, edge cases and failure patterns",
    "Aligned 10–12 cross-functional stakeholders across sprint planning and release cycles",
  ],
  outcomes: [
    "10+ automated business rules → accuracy +18%, manual effort −30%",
    "80+ case UAT → post-release defects −40%",
    "BRDs, SRS and user stories with clear cross-module impact",
    "RCA from API logs and database analysis with engineering and cloud / infra teams",
  ],
  capabilities: ["Policy issuance", "Underwriting journeys", "API integrations", "Production issue resolution", "SQL investigation", "UAT", "SDLC", "Stakeholder management"],
};

export const timeline = [
  { year: "2025 —", title: "Business Analyst, Digit Life Insurance", note: "Group Life products · Tech Titan Award" },
  { year: "2025", title: "MBA (Finance) + B.Tech (CSE), MPSTME Mumbai", note: "3.56 / 4.00" },
  { year: "2024", title: "Finance & Accounting Intern, BHEL", note: "Oracle ERP billing & reconciliation · MIS dashboards, ~15% better reporting accuracy" },
  { year: "2023", title: "Deep Learning Intern, MANIT Bhopal", note: "CNN cancer-diagnosis classifier, ~89% accuracy" },
];

/** How I work — the three districts of the sculpture, left to right. */
export const approach = [
  {
    id: "analysis",
    title: "Analysis",
    text: "I start with the data and the people. SQL investigations into failure patterns, GAP analysis of existing systems, and conversations with the 10–12 stakeholders who own the process.",
    capabilities: ["SQL & data analysis", "GAP analysis", "Root-cause analysis", "Stakeholder discovery"],
  },
  {
    id: "requirements",
    title: "Requirements",
    text: "I turn findings into things engineers can build and testers can verify: BRDs, SRS, user stories, API contracts, business rules — and the UAT that proves them.",
    capabilities: ["BRD / SRS & user stories", "API contracts", "Business rules", "UAT & release"],
  },
  {
    id: "products",
    title: "AI products",
    text: "Outside work I build AI products end to end to practise product judgement by shipping: memory and model routing, approval-gated agents, commerce and fintech experiments.",
    capabilities: ["LLMs & MCP", "Agents with guardrails", "Prototyping to release", "Product decisions"],
  },
];

export const recognition = [
  { title: "Tech Titan Award", org: "Digit Life Insurance", note: "Recognised for contribution to technology and product delivery." },
  { title: "Finalist", org: "EY Young Leaders Business Case Competition 2024", note: "" },
];

export const certifications = [
  "NISM Series VIII — Equity Derivatives (valid till Sep 2027)",
  "NISM Series XV — Research Analyst (valid till Oct 2027)",
  "Financial Modelling & Valuation Analyst (FMVA)",
  "Business Analysis Foundations: Business Process Modelling",
];

/** Rule-based assistant: answers only from this portfolio's content. No LLM calls. */
export const assistantKB: { match: RegExp; answer: string[]; source: string }[] = [
  {
    match: /impact|outcome|achiev|result|metric|deliver|numbers/i,
    answer: [
      "Measurable impact at Digit Life Insurance:",
      "• 10+ automated business rules → accuracy +18%, manual effort −30%",
      "• Led UAT with 80+ test cases → post-release defects −40%",
      "• Supports a ₹1,500+ Cr premium portfolio with 2L+ monthly transactions",
      "• Tech Titan Award recipient",
    ],
    source: "Work · Impact",
  },
  {
    match: /memory\s*router|flagship|routing|token/i,
    answer: [
      "Memory Router is his flagship open-source project — a local-first context-optimisation layer and LLM router.",
      "It stores structured memory locally (SQLite + FTS5), retrieves only relevant context, builds a compact prompt (80–90% fewer input tokens) and routes to Ollama, OpenAI, Anthropic or Gemini with automatic fallback.",
      "There's a sandboxed playground you can try on this site.",
    ],
    source: "Projects · Memory Router",
  },
  {
    match: /life\s*pilot|swiggy|commerce|grocer/i,
    answer: [
      "LifePilot is a Telegram-first, memory-first AI commerce agent built on the Swiggy MCP.",
      "It reasons over memory, calendar, weather and budget, and proposes orders — but every purchase needs an explicit tap, with a two-stage cart cap and output guardrails.",
    ],
    source: "Projects · LifePilot",
  },
  {
    match: /ride\s*compare|fare|uber|ola|mobile app|flutter/i,
    answer: [
      "RideCompare is a Flutter app comparing fares across Uber, Ola, Rapido and Namma Yatri, with one-tap deep links into the cheapest app.",
      "• Node.js + PostgreSQL fare engine with slab pricing and night surcharges",
      "• Google Maps / Places proxied through the backend",
      "• Tracks estimated vs actually-paid fares · 160+ automated tests · CI/CD",
    ],
    source: "Projects · RideCompare",
  },
  {
    match: /agent|gateway|hedge|invest|lecrec|watch|lifeadmin|crm/i,
    answer: [
      "Other builds: AI Agent OS (approval-gated MCP gateway for agents), AI Hedge Fund (MCP-first investment research OS, paper trading by default), LifeAdmin OS (on-device OCR + Claude life-admin app), Lecrec (limited-drop commerce with an atomic Redis reservation engine) and CRM Workflow Automation (n8n + Python + Power BI).",
      "Open any of them in the Projects section for the full breakdown.",
    ],
    source: "Projects",
  },
  {
    match: /skill|sql|api|python|technical|tool|stack|how .*work/i,
    answer: [
      "• Analysis: SQL investigations, GAP analysis, root-cause analysis, stakeholder discovery",
      "• Requirements: BRD / SRS, user stories, API contracts, business rules, UAT",
      "• AI products: LLMs and MCP, agents with guardrails, prototyping to release",
      "• Day-to-day tools at Digit: Jira, Confluence, Postman, DBeaver, Camunda",
    ],
    source: "How I work · Work",
  },
  {
    match: /contact|email|hire|reach|linkedin|github|available|open to/i,
    answer: [
      "He's open to Business Analyst, Product and AI Product roles.",
      "• Email: itsmepriyanshu36@gmail.com",
      "• LinkedIn and GitHub are linked in the Contact section.",
    ],
    source: "Contact",
  },
  {
    match: /experience|work|digit|job|role|insurance|intern/i,
    answer: [
      "Associate Manager — Business Analyst at Digit Life Insurance (Jun 2025 – present, Bengaluru): end-to-end SDLC for Group Life products, API contracts, SQL investigations, UAT and RCA.",
      "Earlier: Finance & Accounting Intern at BHEL (Oracle ERP) and Deep Learning Intern at MANIT (CNN cancer diagnosis, ~89% accuracy).",
    ],
    source: "Work",
  },
  {
    match: /award|recognition|titan|\bey\b|honou?r/i,
    answer: ["• Tech Titan Award — Digit Life Insurance", "• Finalist — EY Young Leaders Business Case Study Competition 2024"],
    source: "Recognition",
  },
  {
    match: /education|degree|mba|b\.?tech|college|study|certif/i,
    answer: [
      "• MBA / PGDM Finance — MPSTME, Mumbai (2025) · 3.56 / 4.00",
      "• B.Tech CSE — MPSTME, Mumbai (2025) · 3.56 / 4.00",
      "Certifications: NISM VIII, NISM XV, FMVA, Business Process Modelling.",
    ],
    source: "Recognition · Education",
  },
  {
    match: /ai[- ]assisted|how.*built|vibe|code himself|write code/i,
    answer: [
      "He designs his products end to end — problem, product decisions, architecture, data model, tests — and builds them with AI-assisted development.",
      "The repos (memory-router, Ai-agent-os, AI-HEDGE-FUND, CRM-workflow-automation) are public if you want to judge the output directly.",
    ],
    source: "About",
  },
  {
    match: /who|about|tell me|introduce|priyanshu|summary|yourself/i,
    answer: [
      "Priyanshu Patel is a product- and data-focused Business Analyst at Digit Life Insurance in Bengaluru, and an AI product builder.",
      "At work he runs end-to-end SDLC for Group Life products on a ₹1,500+ Cr portfolio. Outside work he ships his own products — Memory Router, LifePilot, RideCompare and more.",
      "MBA (Finance) + B.Tech (CSE) from MPSTME Mumbai · Tech Titan Award recipient.",
    ],
    source: "About",
  },
];

export const assistantSuggestions = ["What impact has he delivered?", "Tell me about Memory Router", "What's his experience?", "Is he open to roles?"];
