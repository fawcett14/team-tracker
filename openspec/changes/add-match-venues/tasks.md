## 1. Schema & Migration

- [x] 1.1 Add `venue String?` to `Game` and `homeVenue String?` to `Team` in `prisma/schema.prisma`, run `npx prisma migrate dev`, and verify the generated migration adds both nullable columns and `prisma generate` succeeds

## 2. Admin: Team Settings

- [x] 2.1 Add a "Home venue" input to the team settings form on `src/app/admin/(protected)/page.tsx` and verify it renders with the saved `team.homeVenue` as default value
- [x] 2.2 Update `updateTeamSettings` in `src/app/admin/actions.ts` to read `homeVenue` and persist it (empty → null) in the `team.upsert`, and verify saving/clearing the field round-trips correctly

## 3. Admin: Game Form & Actions

- [x] 3.1 Extend `parseGameForm`/`gameValues`/`createGame`/`updateGame` in `src/app/admin/actions.ts` to accept `venue` (trim, empty → null), include it in the `INSERT`/`UPDATE` raw SQL, and add the server-side fallback to `team.homeVenue` when `isHome` is true and venue is empty; verify create/edit persist venue via manual admin flow
- [x] 3.2 Convert `GameForm` to a client component, add a venue text input, pass `defaultVenue`/`defaultIsHome` props from the new/edit game pages (fetching `team.homeVenue`), implement prefill-on-home-check behavior that preserves admin edits, and verify: new home game shows prefilled venue, toggling away clears it, editing an existing game shows its stored venue
- [x] 3.3 Verify validation errors still redirect correctly and that a home game saved with empty venue and no configured home venue persists with null venue

## 4. Public Display

- [x] 4.1 Add `venue` to `GameListItem` in `src/components/GameList.tsx` and render it alongside the date when present; verify fixtures/results/homepage lists show venue for games that have one and nothing for those that don't
- [x] 4.2 Display `game.venue` on `src/app/matches/[id]/page.tsx` under the date when present; verify match page shows venue for a game with one and renders normally without one

## 5. Verification

- [x] 5.1 Run `npm run build` and verify the production build succeeds
- [x] 5.2 Walk through: set home venue in team settings → create a home game (venue auto-fills) → override venue → create an away game (no auto-fill) → confirm venue appears on homepage list, fixtures/results lists, and match page; confirm games without venue render unchanged
