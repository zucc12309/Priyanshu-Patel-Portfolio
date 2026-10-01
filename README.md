# Priyanshu Patel — Portfolio

Editorial portfolio for Priyanshu Patel (Business Analyst → Product & AI), built with Next.js 15, TypeScript, Tailwind CSS and three.js.

## What's here

- **3D hero → impact stage** (`components/three/block-field.ts`): a single instanced-mesh "architectural model" rendered with raw three.js. It rises into a *PP* monogram, ripples under the cursor, and rebuilds into four bars — one per impact metric — as you scroll. HTML labels are pinned to the projected bar tops each frame.
- **Playable hero**: type a word (or pick a preset) and the blocks rebuild it in a 5×7 pixel font; click to send a shockwave; drag sideways to rotate the model (vertical swipes still scroll on touch).
- **3D project scenes** (`components/three/project-scenes.ts`): one small scene per featured project — Memory Router (memories stream into a router and out to a provider), LifePilot (an order loops the decision track and waits at the approval gate) and RideCompare (four fare columns compete for each trip). Click to interact.
- **Page transitions**: project cards morph into their case pages with the View Transitions API (`lib/view-transition.ts`); browsers without it navigate normally.
- **Motion intro**: blocks assemble before the name rises — once per visit, skippable, never with reduced motion.
- **Custom cursor + sound**: a cursor that reacts to links, buttons and the 3D scenes (fine pointers only), and optional soft UI sounds, off by default.
- **Try-it project demos** (`components/site/demos`): Memory Router context optimiser (runs the real sandbox adapter client-side), LifePilot approval loop with spend-cap and guardrail simulation, and a RideCompare slab-pricing fare engine.
- **Dark contact sculpture**: the same engine in an obsidian theme.
- **Projects**: three featured case panels (CSS 3D tilt), plus an expandable index of all eight projects with a cursor-following preview, and a full case page per project at `/projects/[slug]`.
- **Ask the portfolio**: a rule-based assistant that answers only from portfolio content and cites its source. No LLM calls.
- **⌘K / Ctrl+K** command menu, a full-screen mobile menu, and the original Win95 portfolio at `/retro`.

Performance: three.js loads lazily after first paint, renders only while on screen and when the tab is visible, and caps pixel ratio. `prefers-reduced-motion` freezes the scene and disables the transitions.

## Develop

```bash
npm install
npm run dev
```

## Routes

- `/` — main portfolio
- `/projects/[slug]` — memory-router, lifepilot, ridecompare, ai-lifeadmin-os, lecrec, ai-agent-os, ai-hedge-fund, crm-workflow-automation
- `/projects/memory-router/playground` — sandboxed Memory Router demo (`/api/memory-router`)
- `/retro` — Win95-style portfolio
- `/api/github` — public repo stats (optional `GITHUB_TOKEN`)

## Content

Edit `lib/data.ts` (profile, impact, work, skills, assistant knowledge base) and `lib/projects.ts` (projects).
