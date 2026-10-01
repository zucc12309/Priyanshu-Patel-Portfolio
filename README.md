# Priyanshu Patel — Portfolio

Editorial portfolio for Priyanshu Patel (Business Analyst → Product & AI), built with Next.js 15, TypeScript, Tailwind CSS and three.js.

## What's here

- **3D hero → impact stage** (`components/three/block-field.ts`): a single instanced-mesh "architectural model" rendered with raw three.js. It rises into a *PP* monogram, ripples under the cursor, and rebuilds into four bars — one per impact metric — as you scroll. HTML labels are pinned to the projected bar tops each frame.
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
