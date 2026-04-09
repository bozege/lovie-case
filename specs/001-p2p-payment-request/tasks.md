# Tasks: P2P Payment Request Experience

**Input**: Design documents from `/specs/001-p2p-payment-request/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/app-contract.md`

**Tests**: Automated tests are required by the feature specification. Include unit, integration, and Playwright E2E coverage with video output.

**Organization**: Tasks are grouped by setup, foundational work, and user story so each user story remains independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: `US1`, `US2`, `US3`, or `Shared`
- Each task references the exact file paths or folders it should touch

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the app scaffold and baseline tooling

- [ ] T001 [Shared] Scaffold the Vite React TypeScript app and root config files in `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, and `src/`
- [ ] T002 [P] [Shared] Add core dependencies and scripts for React Router, Supabase, Zod, Vitest, Testing Library, and Playwright in `package.json`
- [ ] T003 [P] [Shared] Add linting, formatting, and editor config in `.eslintrc*`, `.prettierrc*`, and `.vscode/settings.json`
- [ ] T004 [Shared] Create the initial project directory structure in `src/app`, `src/components`, `src/features`, `src/lib`, `src/routes`, `src/styles`, `tests`, `playwright`, and `supabase`
- [ ] T005 [Shared] Add environment variable documentation and sample config in `.env.example` and `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that must be in place before story implementation

- [ ] T006 [Shared] Configure Supabase client bootstrapping in `src/lib/supabase/client.ts` and shared auth/session helpers in `src/lib/supabase/auth.ts`
- [ ] T007 [P] [Shared] Create the initial database schema and migration for `payment_requests` in `supabase/migrations/`
- [ ] T008 [P] [Shared] Define shared domain types for requests, statuses, and auth state in `src/lib/types.ts`
- [ ] T009 [P] [Shared] Implement money parsing/formatting utilities in `src/lib/money/amount.ts`
- [ ] T010 [P] [Shared] Implement validation schemas for recipient contact, amount, and note fields in `src/lib/validation/request.ts`
- [ ] T011 [Shared] Implement request lifecycle helpers for allowed actions and expiration checks in `src/lib/request-status.ts`
- [ ] T012 [Shared] Configure app routing shell, providers, and protected-route behavior in `src/app/App.tsx`, `src/app/providers.tsx`, and `src/routes/`
- [ ] T013 [Shared] Configure Vitest and Testing Library setup in `vitest.config.ts` and `src/test/setup.ts`
- [ ] T014 [Shared] Configure Playwright with video recording and multi-user test support in `playwright.config.ts` and `playwright/fixtures/`

**Checkpoint**: App foundation, schema, validation, routing, and test tooling are ready

---

## Phase 3: User Story 1 - Create and share a payment request (Priority: P1) MVP

**Goal**: Signed-in users can create valid payment requests and get a shareable link

**Independent Test**: Sign in, submit a valid request, and verify it appears in outgoing requests with a pending status and share link

### Tests for User Story 1

- [ ] T015 [P] [US1] Add unit tests for amount parsing and contact validation in `tests/unit/money.test.ts` and `tests/unit/request-validation.test.ts`
- [ ] T016 [P] [US1] Add integration tests for request creation logic in `tests/integration/request-create.test.tsx`
- [ ] T017 [P] [US1] Add Playwright coverage for sign-in and request creation in `tests/e2e/request-create.spec.ts`

### Implementation for User Story 1

- [ ] T018 [P] [US1] Build the authentication screens and magic-link UX in `src/features/auth/` and `src/routes/auth.tsx`
- [ ] T019 [US1] Build the request creation form UI in `src/features/request-create/RequestCreateForm.tsx`
- [ ] T020 [US1] Implement request creation service and Supabase insert flow in `src/features/request-create/request-create.service.ts`
- [ ] T021 [US1] Implement post-create success state and share-link copy UI in `src/features/request-create/RequestCreateSuccess.tsx`
- [ ] T022 [US1] Add outgoing request refresh after creation in `src/features/dashboard/dashboard.store.ts` or equivalent shared state module

**Checkpoint**: Users can authenticate and create requests end-to-end

---

## Phase 4: User Story 2 - Manage incoming and outgoing requests (Priority: P2)

**Goal**: Users can browse, search, filter, and inspect request lists

**Independent Test**: Load multiple requests, filter/search them, and open details with correct role-based actions visible

### Tests for User Story 2

- [ ] T023 [P] [US2] Add unit tests for status/action helpers in `tests/unit/request-status.test.ts`
- [ ] T024 [P] [US2] Add integration tests for dashboard filtering and search in `tests/integration/dashboard.test.tsx`
- [ ] T025 [P] [US2] Add Playwright coverage for dashboard browsing and detail navigation in `tests/e2e/dashboard.spec.ts`

### Implementation for User Story 2

- [ ] T026 [P] [US2] Implement outgoing and incoming query helpers in `src/features/dashboard/dashboard.service.ts`
- [ ] T027 [US2] Build the dashboard page and sectioned lists in `src/features/dashboard/DashboardPage.tsx`
- [ ] T028 [US2] Build filter and search controls in `src/features/dashboard/DashboardFilters.tsx`
- [ ] T029 [US2] Build reusable request list items/cards in `src/features/dashboard/RequestListItem.tsx`
- [ ] T030 [US2] Build the request detail page shell in `src/features/request-detail/RequestDetailPage.tsx`
- [ ] T031 [US2] Add empty states, loading states, and error states for dashboard/detail views in `src/features/dashboard/` and `src/features/request-detail/`

**Checkpoint**: Users can inspect and navigate request data independently of payment actions

---

## Phase 5: User Story 3 - Fulfill or resolve a request (Priority: P3)

**Goal**: Recipients can pay or decline, senders can cancel, and expiration is enforced

**Independent Test**: Execute pay, decline, cancel, and expired flows and verify consistent status updates

### Tests for User Story 3

- [ ] T032 [P] [US3] Add integration tests for request transitions and expiration reconciliation in `tests/integration/request-transitions.test.ts`
- [ ] T033 [P] [US3] Add Playwright happy-path payment flow coverage in `tests/e2e/request-pay.spec.ts`
- [ ] T034 [P] [US3] Add Playwright decline, cancel, and expired-flow coverage in `tests/e2e/request-resolution.spec.ts`

### Implementation for User Story 3

- [ ] T035 [P] [US3] Implement pay, decline, cancel, and expire mutation helpers in `src/features/request-detail/request-detail.service.ts`
- [ ] T036 [US3] Build the request action panel with role-based controls in `src/features/request-detail/RequestActions.tsx`
- [ ] T037 [US3] Implement the simulated payment loading/success UX in `src/features/request-detail/PayRequestFlow.tsx`
- [ ] T038 [US3] Implement expiration countdown display in `src/features/request-detail/ExpirationCountdown.tsx`
- [ ] T039 [US3] Add request reconciliation on reads or app refresh in `src/features/dashboard/dashboard.service.ts` and `src/features/request-detail/request-detail.service.ts`
- [ ] T040 [US3] Ensure sender and recipient views refresh after lifecycle mutations in dashboard/detail state modules

**Checkpoint**: Full request lifecycle is functional and testable end-to-end

---

## Phase 6: Polish & Submission Readiness

**Purpose**: Finalize documentation, deployability, and assignment evidence

- [ ] T041 [P] [Shared] Finalize responsive styling and interaction polish in `src/styles/` and feature UI components
- [ ] T042 [Shared] Add Supabase seed or demo-data helpers for local/E2E use in `supabase/seed/`
- [ ] T043 [Shared] Finalize README with setup, testing, deployment, live demo, and AI tool usage in `README.md`
- [ ] T044 [Shared] Add deployment configuration for Vercel and environment instructions in project root config files and `README.md`
- [ ] T045 [Shared] Validate that Playwright video artifacts are generated and document their location in `README.md`
- [ ] T046 [Shared] Prepare submission note draft and process notes in `docs/` or `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 must complete before Phase 2.
- Phase 2 blocks all user stories.
- User stories can proceed in priority order after Phase 2.
- Phase 6 depends on the desired user stories being complete.

### User Story Dependencies

- US1 depends only on foundational work.
- US2 depends on foundational work and can reuse data created by US1 but should remain independently testable.
- US3 depends on foundational work and the detail/dashboard surfaces from US2.

### Parallel Opportunities

- T002-T004 can run in parallel after T001 starts.
- T007-T011 can run in parallel during foundational work.
- Within each user story, unit/integration/E2E tests marked `[P]` can be authored in parallel with other isolated files.
- UI component tasks and service-layer tasks marked `[P]` can be split across collaborators as long as file ownership stays separate.

## Implementation Strategy

### MVP First

1. Finish Setup and Foundational phases.
2. Deliver US1 completely and verify it independently.
3. Add US2 for browsing and detail visibility.
4. Add US3 to complete the lifecycle.
5. Finish polish, docs, and deployment preparation.

### Commit Strategy

- Commit after Step 5 docs: `docs: add task breakdown for implementation`
- Commit after app scaffold/foundation: `feat: scaffold app shell and Supabase integration`
- Commit after US1: `feat: implement request creation flow`
- Commit after US2: `feat: add request dashboard and detail views`
- Commit after US3: `feat: implement payment lifecycle actions`
- Commit after test completion: `test: add Playwright and app test coverage`
- Commit after final docs/deploy setup: `docs: finalize assignment documentation`
