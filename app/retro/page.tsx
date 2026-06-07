import type { Metadata } from "next";
import { Win95Portfolio } from "@/components/win95-portfolio";

export const metadata: Metadata = {
  title: "Priyanshu Patel — Retro Portfolio",
  description: "Business Analyst at Digit Life Insurance. Win95-styled retro portfolio.",
};

export default function RetroPage() {
  return <Win95Portfolio />;
}
