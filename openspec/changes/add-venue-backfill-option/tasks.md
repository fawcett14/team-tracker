## 1. Team Settings Dialog

- [x] 1.1 Extract the team settings form from `src/app/admin/(protected)/page.tsx` into a client component (`src/components/TeamSettingsForm.tsx`) that renders the same fields (name, logoUrl, homeVenue) and submits `updateTeamSettings`; verify the form renders identically and saves settings as before
- [x] 1.2 Add submit interception: when the trimmed `homeVenue` value is non-empty and differs from the saved value, show a dialog with "Apply to all previous fixtures" and "Only apply to new fixtures" options plus a cancel; verify the dialog appears only on venue change and cancel submits nothing
- [x] 1.3 On dialog choice, set a hidden `venueScope` field (`all` or `future`) and submit the form; verify both paths reach `updateTeamSettings` with the correct scope

## 2. Server-Side Backfill

- [x] 2.1 Update `updateTeamSettings` in `src/app/admin/actions.ts` to read `venueScope` and, when it is `all` and `homeVenue` is non-empty, run `UPDATE "Game" SET "venue" = ?, "updatedAt" = ? WHERE "isHome" = 1` via `$executeRaw`; verify choosing "all" updates venue on every home game (including scored games and custom venues) while away games are untouched, and "future"/missing scope leaves games unchanged

## 3. Verification

- [x] 3.1 Run `npm run build` and verify the production build succeeds
- [x] 3.2 Walk through: change home venue → choose "all previous fixtures" → confirm all home games show the new venue publicly; repeat choosing "only new fixtures" → confirm existing games unchanged and a new home game still auto-fills
