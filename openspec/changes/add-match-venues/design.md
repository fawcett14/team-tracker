## Context

See proposal.md for motivation. Current state: `Game` and `Team` are Prisma models on SQLite; game writes go through raw SQL (`prisma.$executeRaw`) because `@prisma/adapter-d1` can't serialize DateTime args consistently (see comment in `src/app/admin/actions.ts`). `GameForm` is a server component using a plain `<form action={...}>`; team settings live in a form on `/admin` handled by `updateTeamSettings`. Public pages render games via `GameList` (homepage/fixtures/results) and `src/app/matches/[id]/page.tsx`.

## Goals / Non-Goals

**Goals:**
- Persist an optional venue per game and an optional default home venue per team
- Auto-fill the venue for home games without blocking manual entry
- Show venue publicly wherever game details are shown

**Non-Goals:**
- Separate venue entities, maps, or addresses — venue is free text
- Auto-populating away-game venues (opponent grounds are unknown)
- Backfilling venues on existing games

## Decisions

### Schema: nullable string columns

Add `venue String?` to `Game` and `homeVenue String?` to `Team` via a standard Prisma migration. Nullable keeps existing rows valid and matches how `videoUrl`/`logoUrl` are modeled.

### Auto-population: client-side prefill + server-side fallback

**Decision:** `GameForm` becomes a client component (`'use client'`) that receives `defaultVenue` (the team's `homeVenue`) and `defaultIsHome`. The venue input's value is React state: when `isHome` is checked and the venue field is untouched/empty, it shows `defaultVenue`; unchecking `isHome` clears an auto-filled value but preserves admin-typed text. On submit, the server action additionally falls back: if `isHome` is true and the submitted venue is empty, it uses the team's `homeVenue`.

**Rationale:** Prefill gives immediate visual feedback ("this is where we're playing") and lets the admin see/override it before saving. The server-side fallback covers cases where JS state doesn't carry through (e.g., form resubmitted after a validation error) and keeps the invariant in one place.

**Alternatives considered:**
- Server-only defaulting (no client JS): simpler, but the admin can't see the venue before saving and can't tell it was auto-filled. Rejected — worse UX for the primary use case.
- Separate "use home venue" checkbox: extra UI complexity for marginal benefit; the prefill approach achieves the same with less state.

### Write path: extend existing raw SQL

`parseGameForm` gains a `venue` field (trimmed, empty → null). `gameValues` and both `INSERT`/`UPDATE` statements in `createGame`/`updateGame` include `venue`. `updateTeamSettings` reads `homeVenue` and upserts it alongside `name`/`logoUrl`.

### Public display

`GameList` item type gains `venue`; the date line becomes `date · venue` (or venue appended when present). Match page shows venue under the date when present. Queries already return full `Game` rows, so no query changes are needed beyond passing the field through.

## Risks / Trade-offs

- [Venue text becomes stale if the team's home ground changes] → Mitigation: venue is a snapshot per game; admin can edit any game. Home-venue default only applies at creation/default time, not retroactively.
- [Client component conversion of `GameForm`] → Low risk: form actions work identically from client components in Next.js; only state for the venue prefill is added.
- [D1/SQLite migration on prod] → Mitigation: standard additive nullable columns; no data migration needed.

## Migration Plan

1. `npx prisma migrate dev` locally to generate the migration, then apply to prod D1 per existing deploy process (`deploy-to-cloudflare` change documents it).
2. No rollback concerns — additive columns; reverting code leaves harmless null columns.

## Open Questions

- Whether away games should also get a venue field pre-labeled "opponent venue" — deferred; the generic venue field already covers it.
