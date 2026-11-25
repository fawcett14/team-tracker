## Purpose

Defines how the application is built and deployed to Cloudflare Workers, including local development workflows and production deploys.

## ADDED Requirements

### Requirement: Workers deployment
The application SHALL be deployable to Cloudflare Workers and serve all existing pages and server actions without a separately hosted Node.js server.

#### Scenario: Production deploy
- **WHEN** a production build is deployed with the project's deploy script
- **THEN** the application is reachable on its Cloudflare Workers URL and serves pages and server actions correctly

### Requirement: Local development preserved
The existing local development workflow (`next dev`) SHALL continue to work for developers without requiring a Cloudflare account.

#### Scenario: Local dev without Cloudflare
- **WHEN** a developer runs the local dev script on a machine without Cloudflare credentials
- **THEN** the app starts and functions normally against the local database setup

### Requirement: vinext compatibility
The codebase SHALL pass the vinext compatibility check, or any flagged incompatibility SHALL be resolved or documented with a workaround before deploy.

#### Scenario: Compatibility check
- **WHEN** the vinext compatibility check runs against the project
- **THEN** it reports no blocking incompatibilities, or each issue has a documented resolution

### Requirement: Environment configuration
Required environment variables and Cloudflare bindings (D1 database) SHALL be documented and configurable for both local development and production.

#### Scenario: Missing configuration
- **WHEN** the app is deployed or run without required configuration
- **THEN** it fails with a clear, actionable error message rather than an opaque crash
