# Lovie Case

Peer-to-peer payment request MVP built for the Lovie first interview assignment. The app lets a signed-in user create a payment request, share it with a recipient, manage incoming/outgoing requests, and simulate fulfillment without real payment rails.

## Links

- GitHub repository: [bozege/lovie-case](https://github.com/bozege/lovie-case)
- Live demo: pending Step 12 deployment
- Spec-Kit feature docs: [`specs/001-p2p-payment-request`](./specs/001-p2p-payment-request)
- AI workflow log: [`docs/ai-workflow.md`](./docs/ai-workflow.md)

## What It Does

- Passwordless email sign-in through Supabase magic links
- Create payment requests with recipient contact, USD amount, optional note, and 7-day expiration
- Dashboard with outgoing and incoming request lists
- Shared search and status filtering across dashboard lists
- Request detail page with sender, recipient, amount, note, created time, status, countdown, share token, and copy actions
- Simulated payment flow with a 2-3 second processing state
- Recipient decline flow
- Sender cancel flow for pending outgoing requests
- Expiration-aware blocking for requests past their expiration date

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Supabase Auth + Postgres
- Zod validation
- Vitest for helper/unit coverage
- Playwright for E2E coverage and automated video recording

## Architecture

This is a React SPA backed by Supabase as a managed Backend-as-a-Service. The frontend talks directly to Supabase for auth and `payment_requests` persistence.

For this assignment, that keeps the MVP small, deployable, and easy to review. For a production fintech system, the next step would likely be a dedicated backend/API layer for stricter domain enforcement, audit logging, payment orchestration, observability, and server-owned lifecycle transitions.

## Local Setup

Install dependencies:

```powershell
npm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

Add your Supabase project values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Run the app:

```powershell
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Supabase Setup

Create a Supabase project and enable email auth:

1. Go to `Authentication` -> `Providers`.
2. Ensure `Email` is enabled.
3. Go to auth URL settings.
4. Add local redirect URLs such as `http://localhost:5173` and `http://127.0.0.1:5173`.
5. After deployment, add the production URL as an allowed redirect URL too.

Run the SQL in:

```text
supabase/migrations/20260409170000_create_payment_requests.sql
```

The migration creates `payment_requests`, enables row-level security, and adds participant-scoped policies for authenticated users.

## Scripts

```powershell
npm run dev
npm run build
npm run lint
npm run test
npm run test:e2e
npm run test:e2e:record
```

## Testing And Recording

Run unit/helper tests:

```powershell
npm run test
```

Run Playwright E2E tests:

```powershell
npm run test:e2e
```

Playwright video recording is enabled in [`playwright.config.ts`](./playwright.config.ts) with `video: "on"`. After an E2E run, videos are generated under:

```text
test-results/e2e/**/video.webm
```

The E2E suite runs in `VITE_E2E_MODE=true`, which uses browser `localStorage` instead of live magic-link email delivery or mutable Supabase data. This keeps the automated suite deterministic while the normal app still uses Supabase in development and production.

Current E2E coverage includes:

- auth entry
- request creation
- outgoing dashboard visibility
- dashboard search and status filtering
- payment simulation
- decline flow
- expired request blocking

## Spec-Kit Workflow

The project was built with GitHub Spec-Kit as the planning backbone:

- Constitution: [`.specify/memory/constitution.md`](./.specify/memory/constitution.md)
- Feature spec: [`specs/001-p2p-payment-request/spec.md`](./specs/001-p2p-payment-request/spec.md)
- Implementation plan: [`specs/001-p2p-payment-request/plan.md`](./specs/001-p2p-payment-request/plan.md)
- Task breakdown: [`specs/001-p2p-payment-request/tasks.md`](./specs/001-p2p-payment-request/tasks.md)

The intended workflow was:

```text
assignment brief -> constitution -> spec -> plan -> tasks -> implementation -> tests -> docs -> deployment
```

## Assumptions And Tradeoffs

- Currency is fixed to USD for MVP simplicity.
- Payment is simulated only; no real processor or money movement is integrated.
- Requests expire after 7 days.
- Paid, declined, canceled, and expired requests are terminal states in this MVP.
- Self-sent requests are allowed intentionally for testing convenience, and the dashboard includes a toggle to show or hide them in the incoming list.
- The app uses Supabase as the managed backend instead of a separate custom API server.
- The share token is a public lookup token for the request URL, not a transaction ID.

## AI Usage

AI was used as a coding and planning partner for:

- translating the assignment into Spec-Kit artifacts
- choosing a pragmatic MVP architecture
- scaffolding React, Supabase, and testing foundations
- implementing feature slices
- creating automated tests and recording setup
- documenting representative prompts and process notes

Representative prompts and outcomes are recorded in [`docs/ai-workflow.md`](./docs/ai-workflow.md).
