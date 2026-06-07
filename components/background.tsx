"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0B0F14]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(169,112,255,0.08),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(139,231,139,0.06),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(245,177,76,0.04),transparent_34%)]" />
      <motion.div
        className="absolute left-1/2 top-[-18rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-accent-purple/5 blur-3xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-16rem] right-[-6rem] h-[36rem] w-[36rem] rounded-full bg-retro-green/4 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
