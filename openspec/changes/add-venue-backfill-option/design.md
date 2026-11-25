## Context

See proposal.md for motivation. The team settings form on `/admin` is currently a plain server-rendered `<form action={updateTeamSettings}>` inside `src/app/admin/(protected)/page.tsx`. `updateTeamSettings` upserts the `Team` row (id=1). Game writes elsewhere use raw SQL via `prisma.$executeRaw` because `@prisma/adapter-d1` serializes DateTime args unreliably — a plain `UPDATE "Game" SET "venue" = ...` has no DateTime args, but raw SQL remains the consistent choice for writes to `Game`.

## Goals / Non-Goals

**Goals:**
- Let the admin decide per-save whether a changed home venue backfills existing home fixtures
- Keep the common case (saving unrelated settings) friction-free — no dialog unless the venue actually changed

**Non-Goals:**
- Applying a venue to away games
- Preserving per-match venue overrides during backfill (user confirmed: overwrite all home games)
- Undo/history for the bulk update

## Decisions

### Client-side dialog via extracted client component

**Decision:** Extract the team settings form into a client component (e.g. `TeamSettingsForm.tsx` with `'use client'`). It keeps the saved `homeVenue` as the original value; on submit, if the trimmed venue value is non-empty and differs from the original, it prevents default submission and shows a modal dialog with two buttons. Choosing either sets a hidden `venueScope` field (`all` | `future`) and submits the form; cancelling closes the dialog without submitting.

**Rationale:** A native `<dialog>`/fixed overlay needs client JS anyway; intercepting submit in one place keeps `updateTeamSettings` a normal server action. No new dependencies.

**Alternatives considered:**
- `window.confirm()` — only supports two generic buttons and can't label them clearly; rejected for UX.
- Always show the dialog on every settings save — annoying when only the team name changed; rejected.

### Server-side bulk update in `updateTeamSettings`

**Decision:** Add a `venueScope` form field. After the `team.upsert`, when `venueScope === 'all'` and `homeVenue` is non-null, run `UPDATE "Game" SET "venue" = ${homeVenue}, "updatedAt" = ${Date.now()} WHERE "isHome" = 1` via `$executeRaw`.

**Rationale:** Single round-trip, atomic-ish with the settings save, and consistent with the existing raw-SQL write path for `Game`. `isHome` is stored as integer 1/0 by `gameValues`, matching the `WHERE "isHome" = 1` filter.

**Edge cases handled:**
- `venueScope` missing or `future` → no bulk update (also covers non-JS/form-encoded posts)
- `homeVenue` empty → dialog never offered, and server ignores `venueScope=all` (guard on non-empty venue to avoid nulling venues)

## Risks / Trade-offs

- [Bulk update overwrites custom per-match venues] → Accepted per user decision; the dialog copy should make the consequence explicit ("This will replace the venue on all existing home games, including played ones")
- [Dialog adds a client component to an otherwise server-rendered admin page] → Low risk; form actions work from client components (same pattern as `GameForm`)

## Migration Plan

N/A — no schema changes. Deploy is a normal `vinext-cloudflare deploy`; remote D1 needs no migration.

## Open Questions

None.
