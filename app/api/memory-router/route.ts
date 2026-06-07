import { NextResponse } from "next/server";
import { isMemoryRouterMode, runMemoryRouterDemo } from "@/lib/memory-router-demo";

const maxPromptLength = 2000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    const mode = isMemoryRouterMode(body?.mode) ? body.mode : "hybrid";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    if (prompt.length > maxPromptLength) {
      return NextResponse.json({ error: `Prompt must be ${maxPromptLength} characters or fewer.` }, { status: 413 });
    }

    return NextResponse.json(runMemoryRouterDemo(prompt, mode), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to process this Memory Router demo request." }, { status: 500 });
  }
}
