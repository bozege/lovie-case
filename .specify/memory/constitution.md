# Loviecase Assignment Constitution

## Core Principles

### I. Spec-First Delivery
Every meaningful change MUST be traceable to Spec-Kit artifacts before implementation begins. The repository source of truth is the chain of constitution, feature spec, implementation plan, and task breakdown. Code, tests, and documentation MUST align with those artifacts, and assumptions made during delivery MUST be recorded in the spec or plan instead of remaining implicit.

### II. Assignment-Complete Scope
Work MUST satisfy the full assignment, not just the UI feature. A complete delivery includes the payment-request product flows, GitHub Spec-Kit artifacts, automated E2E coverage, automated screen recording through the test suite, public deployment readiness, and submission-quality documentation. Work that improves polish but leaves any required assignment deliverable missing is considered incomplete.

### III. Fintech-Safe Domain Rules
Payment request behavior MUST prioritize correctness over convenience. Monetary values MUST be represented in minor units, user input MUST be validated before persistence, request status transitions MUST be explicit, and expired or terminal requests MUST reject invalid actions. Authentication and data access MUST be scoped so users can only view or act on requests they are allowed to access.

### IV. Testable User Journeys
Each core user journey MUST be independently testable and mapped to acceptance scenarios in the spec. Critical flows require automated end-to-end coverage, including the recorded execution artifact. At minimum, tests MUST cover authentication entry, request creation, incoming and outgoing dashboard visibility, request payment, request decline or cancel, filtering or search, and expired-request behavior.

### V. Pragmatic, Documented Shipping
Implementation choices MUST favor a polished MVP that can be shipped within assignment time constraints. Dependencies, architecture, and UX should remain simple enough to explain clearly to another PM or AI agent. Any shortcut taken for speed MUST be intentional, documented, and non-destructive to the required experience, correctness, or submission quality.

## Technical and Product Constraints

- The product target is a responsive web application.
- The baseline stack is React with TypeScript, Vite, React Router, Supabase, and Playwright unless a later plan amendment documents a justified change.
- Authentication is email-based and may use magic links.
- The live experience MUST be usable from a public URL without requiring local setup.
- Payment processing is simulated only; no live money movement is required.
- Currency support defaults to USD for v1 unless the feature spec is amended.
- Phone support may use format validation only; SMS delivery is out of scope for v1.

## Workflow and Quality Gates

- The repository MUST progress in this order: constitution, feature spec, implementation plan, task breakdown, implementation, verification, documentation finalization.
- Each feature spec MUST include prioritized user stories, acceptance scenarios, edge cases, functional requirements, success criteria, and explicit assumptions.
- The implementation plan MUST define data model decisions, auth behavior, status transitions, expiration handling, testing strategy, deployment path, and documentation outputs.
- The task breakdown MUST be specific enough that another engineer or AI agent can execute it without re-planning the feature.
- Before submission, the repo MUST contain:
  - Spec-Kit artifacts
  - source code
  - automated E2E tests
  - automated screen recording output path or linked artifact
  - README with setup, testing, live demo, and AI-tool-process notes

## Governance

This constitution overrides informal preferences when they conflict. Amendments require updating this file and any affected spec, plan, or task artifacts in the same change. Review of future work MUST confirm compliance with assignment completeness, fintech-safe behavior, test coverage, and documentation quality before the work is considered done.

**Version**: 1.0.0 | **Ratified**: 2026-04-08 | **Last Amended**: 2026-04-08
