## Purpose

Defines how application data is persisted in Cloudflare D1, replacing the local SQLite file, including migrations and seeding.

## ADDED Requirements

### Requirement: D1-backed data access
All application data access (Team, Game, GoalScorer) SHALL go through a Prisma client configured to use Cloudflare D1 via the D1 driver adapter, with no reliance on a local SQLite file in the deployed environment.

#### Scenario: Read/write on Workers
- **WHEN** the deployed application reads or writes games, goal scorers, or team data
- **THEN** the operation succeeds against the bound D1 database

### Requirement: Schema migration
The Prisma schema SHALL be applied to the D1 database so that all models and relations exist in production.

#### Scenario: Fresh production database
- **WHEN** the D1 database is created and migrations are applied
- **THEN** the schema matches `prisma/schema.prisma` (Team, Game, GoalScorer with their relations and constraints)

### Requirement: Data seeding
A repeatable seeding process SHALL exist to populate the D1 database with initial data (team name/logo, seed script content) without manual SQL.

#### Scenario: Seed run
- **WHEN** the seed process runs against the D1 database
- **THEN** the initial team and any seed games/scorers are present and the app displays them

### Requirement: Local data parity
Local development SHALL have a working database path — either a local D1 database via Wrangler or the existing SQLite file — so developers can run and test the app without a deployed Cloudflare environment.

#### Scenario: Local dev database
- **WHEN** a developer runs the app locally
- **THEN** reads and writes work against the local database configuration
