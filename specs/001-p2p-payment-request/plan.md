# Implementation Plan: P2P Payment Request Experience

**Branch**: `001-p2p-payment-request` | **Date**: 2026-04-09 | **Spec**: [spec.md](C:/Users/semaa/Projects/Loviecase/specs/001-p2p-payment-request/spec.md)
**Input**: Feature specification from `/specs/001-p2p-payment-request/spec.md`

## Summary

Build a responsive React + TypeScript web app for peer-to-peer payment requests with Supabase-backed email magic-link authentication and persistent request data. The implementation will prioritize a polished MVP that covers request creation, incoming and outgoing dashboards, request detail actions, simulated payment processing, expiration handling, Playwright E2E with video, and public deployment readiness.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 22.x  
**Primary Dependencies**: Vite, React, React Router, Supabase JS, Zod, Playwright  
**Storage**: Supabase Postgres  
**Testing**: Vitest, React Testing Library, Playwright  
**Target Platform**: Modern desktop and mobile web browsers  
**Project Type**: Web application  
**Performance Goals**: Primary screens render and become interactive within 2 seconds on a normal broadband connection; simulated payment transition completes in 2-3 seconds by design  
**Constraints**: Public demo, simple email auth, precision-safe money handling, responsive layout, automated video capture for E2E  
**Scale/Scope**: Single-assignment MVP, two authenticated user roles interacting through one payment-request lifecycle

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec-first delivery: Pass. The constitution and feature spec exist before app scaffolding.
- Assignment-complete scope: Pass. Plan includes product flows, Spec-Kit artifacts, E2E automation, video output, deployment, and submission docs.
- Fintech-safe domain rules: Pass. Money will use minor units, transitions are explicit, and expired or terminal actions are blocked.
- Testable user journeys: Pass. Each user story maps to acceptance scenarios and planned automated tests.
- Pragmatic shipping: Pass. React + Vite + Supabase keeps scope realistic for the assignment window.

## Phase 0 Research Decisions

- Choose a single Vite React SPA instead of a split frontend/backend repository structure to reduce delivery overhead and keep the repo easy for reviewers and AI agents to follow.
- Use Supabase Auth magic links to satisfy the email-based authentication requirement with minimal custom auth code.
- Use one primary `payment_requests` table plus a small set of derived selectors/helpers rather than a more complex event-sourcing or ledger model.
- Store monetary amounts as integer minor units to avoid float precision issues in both UI and persistence.
- Treat expiration as both computed UI state and persisted status reconciliation, using a lightweight server or client reconciliation step so stale pending items become expired consistently.
- Use Playwright for E2E because it provides browser automation, traceability, and built-in video recording in one toolchain.

## Project Structure

### Documentation (this feature)

```text
specs/001-p2p-payment-request/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- app-contract.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/
|-- components/
|-- features/
|   |-- auth/
|   |-- dashboard/
|   |-- request-create/
|   `-- request-detail/
|-- lib/
|   |-- supabase/
|   |-- validation/
|   `-- money/
|-- routes/
|-- styles/
`-- test/

supabase/
|-- migrations/
`-- seed/

playwright/
|-- fixtures/
`-- helpers/

tests/
|-- e2e/
|-- integration/
`-- unit/
```

**Structure Decision**: Use a single web application at the repository root with feature-oriented UI modules, a `supabase/` folder for schema artifacts, and `tests/` plus `playwright/` for automated validation.

## Implementation Design

### Auth and Access

- Authenticate through Supabase magic links using email as the primary identity.
- Require authentication before request creation, dashboards, and actionable request details.
- Allow share links to route to request detail pages, but require the user to be authenticated before viewing sensitive data or taking action.
- Resolve incoming requests by matching the authenticated user's email to `recipient_contact` or an assigned `recipient_user_id`.

### Data and State

- Main table: `payment_requests`
- Core fields:
  - `id` UUID
  - `sender_user_id`
  - `sender_email`
  - `recipient_contact`
  - `recipient_user_id` nullable
  - `amount_minor`
  - `currency`
  - `note` nullable
  - `status`
  - `share_token`
  - `created_at`
  - `updated_at`
  - `expires_at`
  - `paid_at` nullable
  - `declined_at` nullable
  - `canceled_at` nullable
- UI state will derive:
  - incoming vs outgoing request lists
  - filter/search results
  - allowed actions by role and status
  - countdown text from `expires_at`

### Status Rules

- Initial status: `pending`
- Valid terminal states: `paid`, `declined`, `canceled`, `expired`
- Sender can cancel only when status is `pending` and not expired.
- Recipient can pay or decline only when status is `pending` and not expired.
- Expiration takes precedence over pending actions once the current time passes `expires_at`.
- Reconciliation should update stale pending rows to `expired` when encountered by list/detail reads or an explicit sync step.

### UI Flows

- Auth flow:
  - landing/auth screen
  - magic-link confirmation
  - session restore on revisit
- Request creation flow:
  - recipient contact input
  - amount input with validation and minor-unit conversion
  - optional note
  - post-create success state with share link copy
- Dashboard flow:
  - outgoing and incoming sections or tabs
  - status filter
  - sender/recipient search
  - empty states
- Detail flow:
  - request metadata
  - expiration countdown
  - contextual actions
  - disabled and error states for invalid actions
- Payment flow:
  - 2-3 second simulated processing state
  - success confirmation
  - synchronized list/detail updates

### Validation and Error Handling

- Use shared schema validation for contact, amount, and note length.
- Normalize money input before storage.
- Show field-level validation for form errors and actionable banner/toast feedback for async failures.
- Prevent duplicate submissions during create, pay, decline, and cancel actions.

## Test Strategy

- Unit tests:
  - money parsing and formatting
  - contact validation
  - action eligibility helpers
  - expiration detection
- Integration tests:
  - request list derivation
  - detail action state
  - status transition helpers
- Playwright E2E:
  - sign in and session restoration
  - request creation
  - outgoing/incoming visibility
  - filtering and search
  - pay flow
  - decline flow
  - sender cancel flow
  - expired request blocking
- Configure Playwright to always record video for assignment evidence.

## Delivery and Documentation Plan

- Deploy frontend to Vercel.
- Use hosted Supabase for production demo data/auth.
- Document setup, env vars, local run instructions, test commands, and video artifact location in README.
- Include AI-tool usage and process notes in submission documentation.
- Keep future commits aligned to Spec-Kit phases: plan, tasks, scaffold, feature implementation, tests, final docs.

## Complexity Tracking

No constitution violations are currently expected. The selected architecture is the simplest approach that still satisfies the assignment’s documentation, testing, and deployment requirements.
