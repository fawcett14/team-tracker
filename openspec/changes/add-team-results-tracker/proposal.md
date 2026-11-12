## Why

There is no way to share or track a children's football team's results, fixtures, and match videos in one place. Parents, players, and coaches need a simple public site to see recent results, upcoming games, and highlights, while the coach needs a private admin area to enter results, fixtures, and video links.

## What Changes

- New public-facing website for the team
- Homepage showing the team logo, season record (won / drawn / lost counts), recent results, and upcoming fixtures
- Match detail pages for every game: home team listed first, away team second, score shown as `HOME TEAM 1 - 0 AWAY TEAM` when available
- Support for embedding recorded game videos / highlights reels on match pages
- Admin area behind login where the coach can manage fixtures/results and attach video embeds
- Goal scorer entry in the admin area, stored for admin reference only and never displayed publicly
- New persistence layer (database) to store teams, fixtures, results, scores, goal scorers, and video references

## Capabilities

### New Capabilities

- `public-site`: Public pages — homepage with logo, W/D/L record, recent and upcoming games; clickable match pages showing teams in home/away order with optional score and embedded video
- `admin-management`: Authenticated admin area for creating/editing fixtures and results, attaching video embeds, and recording goal scorers (admin-only data)

### Modified Capabilities

<!-- None — greenfield project, no existing specs -->

## Impact

- New application codebase (currently empty repository)
- New database for fixtures, results, scorers, and media references
- New authentication mechanism for admin login
- No existing code, APIs, or dependencies affected
