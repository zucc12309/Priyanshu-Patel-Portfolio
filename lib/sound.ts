// Soft, synthesized UI sounds. Off by default and only ever played after the
// visitor turns them on (which is also the user gesture audio needs).

export type SoundName = "click" | "thump" | "whoosh" | "on";

let enabled = false;
let ctx: AudioContext | null = null;
const listeners = new Set<(on: boolean) => void>();
const KEY = "pp-sound";

export function soundEnabled() {
  return enabled;
}

export function initSound() {
  try {
    enabled = localStorage.getItem(KEY) === "1";
  } catch {
    enabled = false;
  }
  listeners.forEach((fn) => fn(enabled));
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    // ignore
  }
  listeners.forEach((fn) => fn(on));
  if (on) playSound("on");
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function audio() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(ac: AudioContext, freq: number, endFreq: number, dur: number, gain: number, type: OscillatorType = "sine", delay = 0) {
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function playSound(name: SoundName) {
  if (!enabled) return;
  try {
    const ac = audio();
    if (!ac) return;
    if (name === "click") tone(ac, 1400, 900, 0.05, 0.035);
    else if (name === "thump") tone(ac, 190, 70, 0.16, 0.12);
    else if (name === "on") {
      tone(ac, 660, 660, 0.09, 0.04);
      tone(ac, 990, 990, 0.12, 0.04, "sine", 0.08);
    } else if (name === "whoosh") {
      const len = Math.floor(ac.sampleRate * 0.35);
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.sin((i / len) * Math.PI);
      const src = ac.createBufferSource();
      src.buffer = buf;
      const filter = ac.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, ac.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2200, ac.currentTime + 0.35);
      const g = ac.createGain();
      g.gain.value = 0.05;
      src.connect(filter).connect(g).connect(ac.destination);
      src.start();
    }
  } catch {
    // Sound is a nicety.
  }
}
