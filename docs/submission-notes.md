# Submission Notes Draft

## Project Summary

Lovie Case is a peer-to-peer payment request MVP. A user can sign in with email, create a request for a recipient, share a request link, manage outgoing and incoming requests, and simulate payment, decline, cancel, and expiration flows.

## What To Submit

- Public GitHub repository: https://github.com/bozege/lovie-case
- Live demo URL: https://lovie-case.vercel.app
- README with setup, Supabase, test, video, architecture, and AI workflow instructions
- Spec-Kit artifacts under `specs/001-p2p-payment-request`
- Automated E2E tests under `tests/e2e`
- Generated Playwright videos under `docs/e2e-recordings`

## Suggested Cover Note

Hi Lovie team,

I built this assignment as a React + Supabase MVP using GitHub Spec-Kit as the planning backbone. I started from the assignment brief, generated a constitution, feature spec, implementation plan, and task breakdown, then implemented the app in small committed phases.

The app supports passwordless email auth, payment request creation, incoming/outgoing dashboards, status/search filtering, request detail pages, simulated payment, decline, cancel, and expiration handling. I also added Vitest unit coverage and Playwright E2E coverage with automatic video recording enabled.

I chose Supabase as a managed backend to keep the prototype focused and deployable within assignment scope. For a production fintech system, I would likely add a dedicated backend/API layer, audit/event logging, stricter server-side lifecycle orchestration, and real payment processor integration.

AI was used as a planning and implementation partner. Representative prompts and workflow notes are documented in `docs/ai-workflow.md`.

## Intentional Tradeoffs

- Payment is simulated and does not move real money.
- Self-sent requests are allowed for testing convenience and can be shown or hidden in incoming requests.
- The app uses Supabase directly instead of a custom backend server.
- Share tokens are public request lookup tokens, not transaction IDs.
- Playwright E2E tests use a deterministic E2E mode instead of real magic-link email delivery.

## Final Checklist

- Confirm live deployment URL is added to README.
- Confirm Supabase production redirect URL is configured.
- Run `npm run lint`.
- Run `npm run test`.
- Run `npm run build`.
- Run `npm run test:e2e`.
- Open at least one generated Playwright `video.webm` and confirm it plays.
- Merge or present the `001-p2p-payment-request` branch as the final submission branch.
