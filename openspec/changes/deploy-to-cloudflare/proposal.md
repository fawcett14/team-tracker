## Why

The app currently only runs locally (`next dev` / `next start` with a SQLite file at `prisma/dev.db`). We want to host it on Cloudflare so it is publicly reachable without running a server.

## What Changes

- **BREAKING**: Replace the local SQLite file database (`prisma/dev.db`) with **Cloudflare D1**, a managed SQLite-compatible database. Prisma connects through the `@prisma/adapter-d1` driver adapter instead of a file-based datasource.
- Migrate the Next.js build to run on **Cloudflare Workers** via **vinext** (Cloudflare's recommended Next.js-on-Workers path), keeping `next dev` working alongside it.
- Add Wrangler configuration (`wrangler.jsonc`/`wrangler.toml`) for the Worker, D1 binding, and static assets.
- Add npm scripts for the vinext dev/build/deploy flow (`dev:vinext`, `build:vinext`, `deploy`) and keep existing `next dev`/`next build` scripts.
- Seed/migrate D1 so the existing schema (Team, Game, GoalScorer) is available in production.
- Update local dev documentation/README for the new workflow and environment variables (`DATABASE_URL`, Cloudflare bindings).

## Capabilities

### New Capabilities
- `cloudflare-deployment`: Running the application on Cloudflare Workers via vinext, including build, deploy, and environment configuration.
- `d1-database`: Persisting application data in Cloudflare D1 through Prisma's D1 driver adapter, including schema migrations and seeding.

### Modified Capabilities
<!-- None: no existing specs. -->

## Impact

- **Code**: `src/lib/db.ts` (Prisma client instantiation must use the D1 driver adapter), new Worker entry/config files (`vite.config.ts`, `wrangler.*`, `open-next`/vinext config), Prisma schema datasource config.
- **Dependencies**: add `vinext`, `@vinext/cloudflare`, `wrangler`, `@prisma/adapter-d1` (versions to be pinned at implementation time).
- **Data**: existing `prisma/dev.db` data must be exported/imported into D1; local dev will use either a local D1 database via `wrangler dev` or keep SQLite for `next dev`.
- **Ops**: requires a Cloudflare account, D1 database creation, and `wrangler login` / API token for deploys. Secrets/env vars must be configured for production.
