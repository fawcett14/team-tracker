## Why

Parents and players need to know where each match is being played. Today the site records only the opponent and home/away flag — there is no venue anywhere, and home matches almost always happen at the team's regular ground, so re-typing it for every fixture is tedious.

## What Changes

- New `venue` field on each game/match, editable in the admin game form (create and edit)
- New `homeVenue` setting on the team, editable in the admin team settings section
- When a game is marked as a home game, the venue field is automatically populated from the team's home venue default; the admin can still override it per match
- Venue is displayed publicly on match pages and game lists where a venue is recorded
- Database migration adds the new columns (`Game.venue`, `Team.homeVenue`)

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `admin-management`: Game form gains a venue field; team settings gains a home venue field; home games auto-populate venue from the team default
- `public-site`: Match pages and game lists display the venue when one is recorded

## Impact

- Prisma schema: `Game.venue` (nullable string), `Team.homeVenue` (nullable string) plus a new migration
- Admin game create/edit form (`GameForm`, `parseGameForm`, `createGame`, `updateGame` in `src/app/admin/actions.ts`)
- Admin team settings form and `updateTeamSettings` action
- Public pages: match detail page, `GameList` component, fixtures/results/homepage queries
- No new dependencies; existing raw-SQL write path for `Game` must include the new column
