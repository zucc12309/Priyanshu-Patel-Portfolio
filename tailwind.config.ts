import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        surface: "#151A21",
        "retro-green": "#8BE78B",
        "retro-amber": "#F5B14C",
        "accent-purple": "#A970FF",
        "retro-text": "#F5F1E8",
        night: "#05060a",
        ink: "#0a0d14",
        glass: "rgba(255,255,255,0.075)",
        line: "rgba(255,255,255,0.12)",
        cyan: "#46e9ff",
        mint: "#58ffc8",
        blue: "#6b8cff",
        amber: "#ffc767",
      },
      boxShadow: {
        glow: "0 0 80px rgba(139,231,139,0.12)",
        card: "0 24px 80px rgba(0,0,0,0.38)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
