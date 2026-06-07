import type { Project } from "@/lib/projects";

export function accentText(accent: Project["accent"]) {
  return {
    cyan: "text-cyan",
    mint: "text-mint",
    blue: "text-blue",
    amber: "text-amber",
  }[accent];
}

export function accentBorder(accent: Project["accent"]) {
  return {
    cyan: "border-cyan/35 bg-cyan/10",
    mint: "border-mint/35 bg-mint/10",
    blue: "border-blue/35 bg-blue/10",
    amber: "border-amber/35 bg-amber/10",
  }[accent];
}
