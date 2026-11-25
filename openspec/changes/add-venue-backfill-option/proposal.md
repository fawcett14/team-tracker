## Why

The team's home venue is now stored in team settings and auto-fills new home games, but fixtures created before the venue was set (or before it changed) keep their old or empty venue. Admins need a way to propagate a new home venue to existing fixtures without editing each game.

## What Changes

- When the admin changes the home venue in team settings and saves, a dialog offers two choices:
  - **Apply to all previous fixtures** — sets the new venue on every existing home game (including played games), overwriting any per-match venue
  - **Only apply to new fixtures** — saves the setting without touching existing games
- Saving team settings without changing the home venue shows no dialog
- No change to how venue auto-fill works for new games or how venues display publicly

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `admin-management`: Team settings save flow gains a venue-scope choice when the home venue changes; choosing "all previous fixtures" bulk-updates the venue on all home games

## Impact

- `src/app/admin/(protected)/page.tsx` — team settings form needs client-side interactivity for the dialog (likely extracted into a client component)
- `src/app/admin/actions.ts` — `updateTeamSettings` accepts a venue-scope field and runs a bulk `UPDATE` on `Game` when "all" is chosen
- No schema or migration changes; no public-site changes
