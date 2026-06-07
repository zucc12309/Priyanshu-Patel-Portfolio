export const memoryRouterModes = ["local", "api", "hybrid"] as const;

export type MemoryRouterMode = (typeof memoryRouterModes)[number];

export type DemoMemory = {
  id: string;
  domain: string;
  task: string;
  memory: string;
  concepts: string[];
  confidence: number;
};

export type MemoryRouterDemoResponse = {
  demo: true;
  mode: MemoryRouterMode;
  route: {
    selectedProvider: string;
    reason: string;
    latencyEstimateMs: number;
  };
  contextSummary: string;
  optimizedPrompt: string;
  relevantMemoryUsed: Array<DemoMemory & { relevance: number }>;
  tokenSavings: {
    originalTokens: number;
    optimizedTokens: number;
    savedTokens: number;
    savedPercent: number;
  };
  safety: {
    liveDemoMode: true;
    privateUserDataStored: false;
    sandboxedMemory: true;
    adapter: "vercel-safe-demo";
  };
};

const sandboxMemories: DemoMemory[] = [
  {
    id: "mem_product_specs",
    domain: "product",
    task: "requirements",
    memory: "User prefers concise product specs with explicit problem, user segment, success metric, and launch risks.",
    concepts: ["prd", "requirements", "product", "launch", "metric", "user"],
    confidence: 0.91,
  },
  {
    id: "mem_ai_routing",
    domain: "ai-infrastructure",
    task: "routing",
    memory: "Memory Router should trim irrelevant context before provider selection and route simple work locally when possible.",
    concepts: ["memory", "router", "routing", "provider", "local", "context", "optimization"],
    confidence: 0.88,
  },
  {
    id: "mem_workflow_automation",
    domain: "operations",
    task: "automation",
    memory: "For workflow automation, map the trigger, decision rule, exception path, audit event, and reporting output.",
    concepts: ["workflow", "automation", "crm", "trigger", "audit", "reporting"],
    confidence: 0.84,
  },
  {
    id: "mem_consumer_apps",
    domain: "consumer",
    task: "mobile",
    memory: "Consumer apps need trust signals: recommendation reason, confidence, price comparison, and a clear next action.",
    concepts: ["mobile", "consumer", "ride", "pricing", "recommendation", "confidence"],
    confidence: 0.82,
  },
  {
    id: "mem_agentic_systems",
    domain: "agentic-ai",
    task: "system-design",
    memory: "Agentic AI systems should separate planner, tool executor, memory retrieval, review queue, and observability layers.",
    concepts: ["agent", "agentic", "planner", "tool", "memory", "review", "observability"],
    confidence: 0.9,
  },
];

export function isMemoryRouterMode(value: unknown): value is MemoryRouterMode {
  return typeof value === "string" && memoryRouterModes.includes(value as MemoryRouterMode);
}

export function runMemoryRouterDemo(prompt: string, mode: MemoryRouterMode): MemoryRouterDemoResponse {
  const normalizedPrompt = prompt.trim().replace(/\s+/g, " ");
  const relevantMemoryUsed = rankMemories(normalizedPrompt).slice(0, 3);
  const concepts = Array.from(new Set(relevantMemoryUsed.flatMap((memory) => memory.concepts))).slice(0, 8);
  const selectedProvider = selectProvider(mode, normalizedPrompt);
  const optimizedPrompt = buildOptimizedPrompt(normalizedPrompt, relevantMemoryUsed, mode);
  const originalTokens = estimateOriginalTokens(normalizedPrompt);
  const optimizedTokens = estimateTokens(optimizedPrompt);
  const savedTokens = Math.max(0, originalTokens - optimizedTokens);
  const savedPercent = originalTokens > 0 ? Math.round((savedTokens / originalTokens) * 100) : 0;

  return {
    demo: true,
    mode,
    route: selectedProvider,
    contextSummary:
      relevantMemoryUsed.length > 0
        ? `Retrieved ${relevantMemoryUsed.length} sandbox memories across ${concepts.join(", ")}. Context was compressed into a provider-ready prompt without touching private memory.`
        : "No strong sandbox memory match. The adapter kept the prompt lightweight and routed it using demo defaults.",
    optimizedPrompt,
    relevantMemoryUsed,
    tokenSavings: {
      originalTokens,
      optimizedTokens,
      savedTokens,
      savedPercent,
    },
    safety: {
      liveDemoMode: true,
      privateUserDataStored: false,
      sandboxedMemory: true,
      adapter: "vercel-safe-demo",
    },
  };
}

function rankMemories(prompt: string) {
  const promptTokens = tokenize(prompt);

  return sandboxMemories
    .map((memory) => {
      const overlap = memory.concepts.filter((concept) => promptTokens.has(concept)).length;
      const phraseBoost = prompt.toLowerCase().includes(memory.domain) || prompt.toLowerCase().includes(memory.task) ? 1 : 0;
      const relevance = Math.min(0.99, Number(((overlap * 0.18 + phraseBoost * 0.12 + memory.confidence * 0.34) || 0.18).toFixed(2)));

      return { ...memory, relevance };
    })
    .filter((memory) => memory.relevance >= 0.32)
    .sort((a, b) => b.relevance - a.relevance);
}

function tokenize(prompt: string) {
  return new Set(
    prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(Boolean),
  );
}

function selectProvider(mode: MemoryRouterMode, prompt: string) {
  const tokens = estimateTokens(prompt);

  if (mode === "local") {
    return {
      selectedProvider: "local / ollama-demo",
      reason: "Local mode keeps the request on a local-style route in this sandbox simulation.",
      latencyEstimateMs: 420,
    };
  }

  if (mode === "api") {
    return {
      selectedProvider: "api / cloud-demo",
      reason: "API mode prioritizes higher capability for complex prompts. No real API key is used in this public demo.",
      latencyEstimateMs: 900,
    };
  }

  return tokens < 140
    ? {
        selectedProvider: "hybrid / local-demo",
        reason: "Hybrid mode selected the local-style path because the prompt is compact after retrieval.",
        latencyEstimateMs: 480,
      }
    : {
        selectedProvider: "hybrid / api-demo",
        reason: "Hybrid mode selected the API-style path because the prompt needs broader reasoning capacity.",
        latencyEstimateMs: 780,
      };
}

function buildOptimizedPrompt(prompt: string, memories: Array<DemoMemory & { relevance: number }>, mode: MemoryRouterMode) {
  const memoryBlock =
    memories.length > 0
      ? memories
          .map((memory) => `- [${memory.domain}/${memory.task}] ${memory.memory} (confidence ${memory.confidence}, relevance ${memory.relevance})`)
          .join("\n")
      : "- No sandbox memory exceeded the retrieval threshold.";

  return [
    "SYSTEM CONTEXT (sandbox demo)",
    `Mode: ${mode}`,
    "Privacy: public playground, no persistent storage, no real local memories.",
    "",
    "RELEVANT MEMORY",
    memoryBlock,
    "",
    "USER REQUEST",
    prompt,
    "",
    "RESPONSE STRATEGY",
    "Answer with the retrieved context only when it improves relevance. Keep assumptions visible and avoid inventing private user history.",
  ].join("\n");
}

function estimateOriginalTokens(prompt: string) {
  const promptTokens = estimateTokens(prompt);
  const simulatedChatHistoryTokens = 1180;
  const simulatedWorkingMemoryTokens = 360;

  return promptTokens + simulatedChatHistoryTokens + simulatedWorkingMemoryTokens;
}

function estimateTokens(text: string) {
  return Math.max(8, Math.ceil(text.length / 4));
}
