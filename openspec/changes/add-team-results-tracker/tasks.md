## 1. Project Setup

- [x] 1.1 Initialize Next.js app (App Router) with TypeScript in the repo root and verify `npm run dev` serves a default page
- [x] 1.2 Add Prisma + SQLite and verify `npx prisma migrate dev` runs successfully against a local `dev.db`
- [x] 1.3 Define Prisma schema for `Game` (date, opponent, isHome, homeScore, awayScore nullable, videoUrl nullable) and `GoalScorer` (gameId FK, playerName, side) and verify migration generates client types
- [x] 1.4 Add a seed script for team name/logo settings and verify seeded data is queryable
- [x] 1.5 Configure admin credentials via env vars (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`) and verify the app builds with `npm run build`

## 2. Admin Authentication

- [x] 2.1 Implement login server action / route validating credentials against env config and verify valid login sets a session cookie while invalid login is rejected
- [x] 2.2 Add session middleware protecting `/admin/*` routes and verify unauthenticated requests to `/admin` redirect to `/admin/login`
- [x] 2.3 Add logout action clearing the session and verify subsequent admin access is denied

## 3. Admin Game Management

- [x] 3.1 Build admin games list page and verify all saved games render with edit links
- [x] 3.2 Implement game create/edit form (opponent, date, home/away, scores) and verify creating a game persists it and appears in the admin list
- [x] 3.3 Implement game delete and verify removal deletes the game and its goal scorers
- [x] 3.4 Implement goal scorer add/remove within the admin game detail and verify scorers persist and are listed only in admin
- [x] 3.5 Implement video URL input with YouTube/Vimeo validation and verify valid embed URLs are saved while invalid URLs are rejected with an error

## 4. Public Site

- [x] 4.1 Build homepage showing team logo and W/D/L counts computed from completed games and verify counts match seeded/edit test data
- [x] 4.2 Build homepage recent results and upcoming fixtures sections linking to match pages and verify ordering (recent = most recent first, upcoming = chronological)
- [x] 4.3 Build match page at `/matches/[id]` showing home team first, away team second, and verify it renders correctly for a seeded game
- [x] 4.4 Render score as `HOME x - y AWAY` only when scores exist and verify upcoming games show no score
- [x] 4.5 Embed the game video on match pages when a video URL exists and verify no video section renders when absent
- [x] 4.6 Verify public pages contain no goal scorer data by inspecting rendered HTML of a match page that has scorers recorded
- [x] 4.7 Verify unknown match IDs return a 404 page

## 5. Verification

- [x] 5.1 Run `npm run build` and verify production build succeeds
- [x] 5.2 Manually walk through: login → create game with score → add goal scorer → attach video → logout → view homepage and match page publicly; confirm scorers hidden and video/score display correctly
