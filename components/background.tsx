"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050607]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:18px_18px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(161,85,255,0.16),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(255,42,168,0.12),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(119,255,95,0.08),transparent_34%)]" />
      <motion.div
        className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#ff2aa8]/10 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-18rem] right-[-8rem] h-[38rem] w-[38rem] rounded-full bg-[#77ff5f]/10 blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, 30, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
