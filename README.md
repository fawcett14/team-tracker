This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), deployed to **Cloudflare Workers** via [vinext](https://vinext.dev).

## Getting Started

### Local development (Next.js, SQLite)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Uses `prisma/dev.db` (SQLite) — no Cloudflare account needed. Apply schema changes with `npx prisma migrate dev` and seed with `npm run prisma:seed` equivalent (`npx prisma db seed`).

### Local development on the Workers runtime (vinext + D1)

```bash
npm run dev:vinext
```

Runs the app inside workerd (port 3001+) against a **local simulated D1** database persisted in `.cloudflare/state`. This is the closest match to production.

First-time setup for the local D1 database:

```bash
npm run dev:vinext   # start once so the local D1 file is created
node scripts/d1.mjs migrate --local
node scripts/d1.mjs import-devdb --local   # or: node scripts/d1.mjs seed --local
```

## Database

Production data lives in **Cloudflare D1** (SQLite-compatible), accessed through Prisma's D1 driver adapter (`@prisma/adapter-d1`). `src/lib/db.ts` picks the adapter automatically: on Workers it uses the `DB` binding; in Node it falls back to `prisma/dev.db`.

Migrations are plain SQL files in `migrations/` (generated from `prisma/schema.prisma` via `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`).

**DateTime storage:** Prisma on SQLite stores `DateTime` as epoch-millisecond integers, but `@prisma/adapter-d1` serializes `DateTime` write args as ISO strings — mixing the two formats in one column makes reads fail with P2023 "inconsistent column data" (HTTP 500). `src/app/admin/actions.ts` therefore writes `Game` rows via `$executeRaw` with ms integers; keep it that way for any new `DateTime` columns.

```bash
# Local (miniflare) D1
node scripts/d1.mjs migrate --local
node scripts/d1.mjs seed --local
node scripts/d1.mjs import-devdb --local   # copy prisma/dev.db contents into D1

# Remote D1 (requires `npx cf auth login`)
node scripts/d1.mjs migrate --remote <database-id>
node scripts/d1.mjs seed --remote <database-id>
node scripts/d1.mjs import-devdb --remote <database-id>
```

## Deploy to Cloudflare Workers

One-time setup:

```bash
npx cf auth login                 # authenticate with Cloudflare
npx cf d1 create --name team-tracker-db   # create the production database
npx cf workers secrets            # set SESSION_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH
```

Then:

```bash
npm run build:vinext     # production build
npm run deploy:vinext    # deploy Worker + assets to *.workers.dev
```

Other scripts: `npm run start:vinext` (preview build locally), `npm run lint`, `npm run hash-password`.

Bindings and env vars are declared in `cloudflare.config.ts`; regenerate types with `npx cf workers types` (output in `.cloudflare/types`, already in `tsconfig.json`).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [vinext](https://vinext.dev) — Next.js on Vite/Cloudflare Workers
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Prisma D1 driver adapter](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/d1)
