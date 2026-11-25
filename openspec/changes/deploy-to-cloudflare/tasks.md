## 1. vinext setup

- [x] 1.1 Run `npx vinext check` and resolve or document any blocking incompatibilities (verify: check reports no unaddressed blocking issues)
- [x] 1.2 Run `npx vinext init`, select the Cloudflare Workers target, and verify it generates the Vite/Wrangler config plus `dev:vinext`/`build:vinext` scripts while `next dev` still starts
- [x] 1.3 Verify Tailwind CSS still compiles under the vinext/Vite pipeline (adjust PostCSS/Vite config if the turbopack-only CSS rule is not applied); verify `npm run dev:vinext` renders styled pages

## 2. D1 database

- [x] 2.1 Install `wrangler` and `@prisma/adapter-d1`; create a D1 database with `wrangler d1 create` and record the binding in the Wrangler config (verify: `wrangler d1 list` shows the database and config references its id)
- [x] 2.2 Update `prisma/schema.prisma`/client generation as needed for driver adapters and update `src/lib/db.ts` so Workers uses the D1 binding from `cloudflare:workers` while Node falls back to the existing SQLite client (verify: typecheck passes; `npm run dev` still works locally)
- [x] 2.3 Generate SQL migrations from the Prisma schema (e.g. `prisma migrate diff`) and apply them to D1 via `wrangler d1 migrations apply` / `wrangler d1 execute` (verify: `wrangler d1 execute --command "SELECT name FROM sqlite_master WHERE type='table'"` lists Team, Game, GoalScorer)
- [x] 2.4 Port `prisma/seed.mjs` (or add an equivalent script) so it can seed the D1 database; run it against local/remote D1 and verify seeded team/games appear (verify: app pages show seeded data)
- [x] 2.5 Export existing `prisma/dev.db` data and import it into the production D1 database (verify: row counts for Team/Game/GoalScorer match between dev.db and D1)

## 3. Configuration and deploy

- [x] 3.1 Add `wrangler types` output (`cloudflare-env.d.ts`) and any required `.dev.vars`/`wrangler secret` entries for env vars like admin credentials (verify: `npx tsc --noEmit` passes with typed bindings)
- [x] 3.2 Run `npm run build:vinext` and fix any build errors (verify: production build completes and emits Worker + assets output)
- [x] 3.3 Run `npx @vinext/cloudflare deploy` (or `wrangler deploy`) and verify the site is reachable on its `*.workers.dev` URL (verify: homepage and an admin page load; a server action e.g. adding a game succeeds and persists to D1)
- [x] 3.4 Update README/AGENTS.md with the new dev, build, migrate, seed, and deploy commands plus required Cloudflare setup (verify: docs match the actual package.json scripts)
