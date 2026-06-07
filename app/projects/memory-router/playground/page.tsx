import type { Metadata } from "next";
import { MemoryRouterPlayground } from "@/components/memory-router-playground";

export const metadata: Metadata = {
  title: "Memory Router Playground",
  description: "Try a sandboxed, Vercel-safe Memory Router demo directly inside Priyanshu Patel's portfolio.",
  openGraph: {
    title: "Memory Router Playground | Priyanshu Patel",
    description: "Interactive demo for context optimization, sandbox memory retrieval, and model routing.",
    images: ["/projects/memory-router.png"],
  },
};

export default function Page() {
  return <MemoryRouterPlayground />;
}
