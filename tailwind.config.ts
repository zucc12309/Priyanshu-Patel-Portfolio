import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Editorial system
        paper: "#EEEAE2",
        "paper-2": "#E6E1D7",
        ink: "#121211",
        "ink-2": "#2A2926",
        mute: "#6A665E",
        signal: "#FF4D12",
        obsidian: "#0E0E0D",
        // Legacy tokens (playground, project simulators)
        bg: "#0B0F14",
        surface: "#151A21",
        "retro-green": "#8BE78B",
        "retro-amber": "#F5B14C",
        "accent-purple": "#A970FF",
        "retro-text": "#F5F1E8",
        night: "#05060a",
        line: "rgba(255,255,255,0.12)",
        cyan: "#46e9ff",
        mint: "#58ffc8",
        blue: "#6b8cff",
        amber: "#ffc767",
      },
      boxShadow: {
        card: "0 24px 80px rgba(0,0,0,0.38)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "SFMono-Regular", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
