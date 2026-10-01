"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { onSoundChange, setSound, soundEnabled } from "@/lib/sound";

export function SoundToggle({ withLabel = false, className = "" }: { withLabel?: boolean; className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(soundEnabled());
    const off = onSoundChange(setOn);
    return () => {
      off();
    };
  }, []);

  return (
    <button
      type="button"
      data-sound="none"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className={`flex items-center gap-2 ${className}`}
    >
      {on ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
      {withLabel ? <span>{on ? "Sound on" : "Sound off"}</span> : null}
    </button>
  );
}
