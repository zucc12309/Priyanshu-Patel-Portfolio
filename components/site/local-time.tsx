"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

export function LocalTime() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: profile.timezone, hour12: false });
    const tick = () => setNow(`${fmt.format(new Date())} IST`);
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{now || "— IST"}</span>;
}
