# Priyanshu Patel Portfolio

Premium Next.js portfolio for Priyanshu Patel, built with Next.js 15, TypeScript, TailwindCSS, and Framer Motion.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Import this repository into Vercel.
2. Use the default Next.js framework preset.
3. No required environment variables are needed for the Memory Router playground.
4. Optional: set `GITHUB_TOKEN` to improve GitHub API rate limits for repository stats.
5. Deploy.

## Memory Router Playground

The page at `/projects/memory-router/playground` exposes an interactive web playground backed by `/api/memory-router`.

For public deployment, the API uses a Vercel-safe demo adapter:

- No API keys are exposed or required.
- Visitor prompts are not stored permanently.
- The adapter does not access Priyanshu's real local Memory Router data.
- The adapter does not read from `~/.memory-router`.
- Demo memory is hardcoded and sandboxed in `lib/memory-router-demo.ts`.
- The API returns a structured response with context summary, optimized prompt, relevant memory used, token savings, mode, route, and safety labels.

Direct CLI execution is intentionally avoided for Vercel because the production environment should not depend on local filesystem state, local model services, or private memories.

## Routes

- `/`
- `/projects/memory-router`
- `/projects/memory-router/playground`
- `/projects/ridecompare`
- `/projects/ai-lifeadmin-os`
- `/projects/crm-workflow-automation`
- `/api/github`
- `/api/memory-router`
