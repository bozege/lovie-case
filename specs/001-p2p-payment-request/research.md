# Research: P2P Payment Request Experience

## Decision 1: Application Architecture

- Decision: Use a single Vite React SPA with Supabase as the external backend service.
- Rationale: The assignment values speed, clarity, and working delivery. A single app is easier to document, scaffold, test, and deploy than a split frontend/backend monorepo.
- Alternatives considered:
  - Next.js full-stack app: acceptable, but not chosen because the current plan already favors a lean SPA and does not need SSR.
  - Separate API server: rejected because it adds more delivery overhead than value for this MVP.

## Decision 2: Authentication

- Decision: Use Supabase magic-link email authentication.
- Rationale: It directly satisfies the assignment’s email-based auth requirement and works well for a public demo.
- Alternatives considered:
  - Mock auth: faster, but weaker against the assignment wording and less convincing in a public live demo.
  - Email/password auth: more setup and more UX friction than needed.

## Decision 3: Persistence Model

- Decision: Store requests in a single `payment_requests` table with explicit status fields and timestamps.
- Rationale: The lifecycle is simple and benefits from a straightforward relational model that reviewers can understand quickly.
- Alternatives considered:
  - Event log / event sourcing: more complex than needed for the assignment.
  - Local-only storage: rejected because the assignment requires real persistence and a live public demo.

## Decision 4: Money Handling

- Decision: Store `amount_minor` as an integer in minor units.
- Rationale: This avoids floating-point rounding issues and demonstrates fintech-safe handling.
- Alternatives considered:
  - Decimal strings in the client: workable, but more cumbersome than integer minor units.
  - Floating-point numbers: rejected due to precision risk.

## Decision 5: Expiration Handling

- Decision: Use both computed expiration checks in the client and persisted status reconciliation when reading or syncing requests.
- Rationale: UI-only expiration can drift from stored status, while persisted-only expiration can appear stale until a write occurs.
- Alternatives considered:
  - UI-only expiration: too easy for dashboards to show stale pending rows.
  - Scheduled backend jobs only: overkill for this assignment.

## Decision 6: E2E and Screen Recording

- Decision: Use Playwright with video enabled in the configuration.
- Rationale: One tool can cover user journeys, regression checking, and the assignment’s automated recording requirement.
- Alternatives considered:
  - Cypress: also valid, but not chosen because Playwright offers strong multi-context flows for sender/recipient testing.
  - Manual screen recording: rejected because the assignment explicitly asks for automation.
