## Context

Greenfield repository — no existing code, specs, or dependencies. The site is a single-team results tracker: a public site plus a small admin area. See proposal.md for motivation and scope; specs/public-site and specs/admin-management define the behavior contract.

## Goals / Non-Goals

**Goals:**
- A deployable website (single app) serving public pages and an admin area
- Simple, reliable persistence for teams, games, scores, goal scorers, and video references
- Minimal operational complexity — suitable for a single coach/admin user

**Non-Goals:**
- Multi-user accounts or role management (single admin credential is sufficient)
- Player statistics beyond goal scorer names
- Public display of goal scorers (explicitly admin-only per spec)
- User-generated content, comments, or social features
- Self-hosted video storage — videos are embedded from external providers

## Decisions

### Stack: Next.js (App Router) + SQLite

**Decision:** Build as a single Next.js application using the App Router, with SQLite for persistence via Prisma ORM.

**Rationale:** Next.js gives server-rendered public pages (good for SEO/sharing) plus API routes / server actions for admin writes in one deployable unit. SQLite is zero-ops, file-based, and more than sufficient for a single team's fixture list. Prisma provides typed queries and simple migrations without a running database server.

**Alternatives considered:**
- Static site + headless CMS: adds an external service dependency and complicates admin writes; rejected for simplicity.
- Postgres/Supabase: overkill for one team's data; adds hosting cost and ops burden.
- Plain Express + templates: less modern tooling, weaker React component model for future UI work.

### Data model

- `Game`: id, date, opponent name, `isHome` (boolean — this team is home or away), home/away score columns (nullable until played), video URL (nullable), timestamps
- `GoalScorer`: id, gameId (FK), player name, team side (this team / opponent) — stored in its own table so it can be filtered out of every public query
- Team identity (name, logo) stored in a `Team` table or site settings table seeded at setup

**Rationale:** Keeping `GoalScorer` in a separate table makes the admin-only guarantee structural: public queries simply never join it, rather than relying on conditional rendering.

### Admin authentication

**Decision:** Single admin user. Credentials configured via environment variables (e.g., `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`). Login sets a signed, HTTP-only session cookie (e.g., via `iron-session` or NextAuth credentials provider).

**Rationale:** One coach, one login — no user table or registration flow needed. Session cookie keeps auth server-side and avoids exposing tokens to client JS.

**Alternatives considered:**
- NextAuth with a users table: more machinery than needed for a single credential.
- HTTP Basic Auth: simplest, but ugly UX and no logout/session semantics.

### Public/private separation

**Decision:** Admin routes live under `/admin/*` and are guarded by a middleware/server-side session check that redirects unauthenticated requests to `/admin/login`. Public pages query only `Game` fields; `GoalScorer` is fetched exclusively in admin game-detail views.

### Video embedding

**Decision:** Admin pastes a video URL (YouTube or Vimeo). Store the URL; on the match page, render the provider's embed iframe (URL normalized to embed form). Unknown/unparseable URLs are rejected at input time with a validation error.

**Rationale:** Covers the stated need (recorded games / highlights reels) without hosting video. Provider embeds are free and reliable.

**Alternatives considered:**
- Direct file upload: storage/bandwidth costs and transcoding concerns; rejected.
- Generic iframe for any URL: security risk (arbitrary embeds); restricted to allowlisted providers.

## Risks / Trade-offs

- [SQLite file on ephemeral hosting (e.g., serverless filesystem) loses data] → Mitigation: document requirement for persistent disk or a volume; alternatively the data model ports cleanly to Postgres later via Prisma.
- [Single shared admin password] → Mitigation: store only a hash; document rotation via env var. Acceptable for a single-team site.
- [Score entry errors corrupt W/D/L record] → Mitigation: record is computed from stored scores; admin can edit games, and a validation pass checks score consistency.
- [Embed URL formats vary] → Mitigation: strict allowlist parsing for YouTube/Vimeo at admin input; reject anything else.

## Migration Plan

N/A — new application, no existing data or deployment to migrate. Initial setup seeds the team name/logo and admin credentials.

## Open Questions

- Team name, logo asset, and initial admin credentials — needed at deploy/setup time, not blocking implementation (can be seeded via env/config).
