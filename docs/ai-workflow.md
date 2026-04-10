# AI Workflow Log

This file captures representative prompts and AI-assisted workflow notes used to build the assignment. It is not intended to be an exhaustive chat transcript. Instead, it documents the kinds of prompts, decisions, and outputs that shaped the project so reviewers can understand how AI was used in practice.

## How AI Was Used

- Turn the assignment brief into a structured Spec-Kit workflow
- Draft the product spec, implementation plan, and task breakdown
- Scaffold the React + Vite application and shared project structure
- Wire Supabase auth and request-creation flows
- Refine validation, routing, and UI structure
- Plan future E2E coverage, deployment, and submission materials

## Representative Prompts

### 1. Repository and Spec-Kit Setup

**Prompt intent**: Initialize the repo correctly for the assignment and follow the Spec-Kit workflow from the start.

**Representative prompt**:
> Check if we are connected to git, if we are, tell me which account

**Follow-up prompt**:
> Initialize a local identity within this project folder and init git inside

**Outcome**:
- Local Git repo initialized
- Repo-only Git identity configured
- Spec-Kit installed and initialized

### 2. Assignment Ingestion

**Prompt intent**: Convert the assignment brief into a working source of truth inside the repo.

**Representative prompt**:
> Check if you can access this link and convert its content to a txt file

**Outcome**:
- Assignment text saved locally
- Brief became the direct input for constitution/spec/plan/tasks work

### 3. Planning the Assignment

**Prompt intent**: Build an end-to-end plan that covers not just the app, but also documentation, testing, and delivery requirements.

**Representative prompt**:
> Build a plan to cover up the full assignment. Starting from git initialization, documenting and everything else that we need to build.

**Outcome**:
- Chosen stack and delivery strategy
- Assignment concerns mapped into implementation and documentation steps

### 4. Spec-Kit Constitution and Spec

**Prompt intent**: Turn the assignment into formal project artifacts another PM or AI could follow.

**Representative prompt**:
> Before step 3, introduce to me what Spec-Kit is and how it works briefly

**Follow-up prompt**:
> Alright lets move on to step 3, spec-kit workflow init

**Outcome**:
- Constitution created
- Feature spec created
- Requirements, edge cases, assumptions, and success criteria documented

### 5. Implementation Planning and Tasks

**Prompt intent**: Create the technical plan and break implementation into concrete work items.

**Representative prompt**:
> Do the step 4 and commit it too

**Follow-up prompt**:
> Now, lets move forward with step 5

**Outcome**:
- `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and contracts added
- `tasks.md` created with phased implementation breakdown

### 6. App Scaffold and Foundation

**Prompt intent**: Move from documentation to code with a clean first implementation checkpoint.

**Representative prompt**:
> Now lets proceed with step 6

**Outcome**:
- Vite + React + TypeScript app scaffolded
- Shared utilities, routes, test config, and Supabase foundation added
- Initial migration stub created

### 7. Auth and Request Creation

**Prompt intent**: Implement the first real user-facing feature slice.

**Representative prompt**:
> lets move on

**Context of the step**:
- `.env` configured with Supabase project values
- Auth and create-request flow prioritized as the first meaningful feature slice

**Outcome**:
- Magic-link auth UI
- Auth-aware app shell
- Protected request creation route
- Request creation form and insert flow
- Success state with shareable link
- Outgoing requests listing on dashboard

### 8. Request Lifecycle and Management

**Prompt intent**: Move from simple creation into the actual payment-request lifecycle expected by the assignment.

**Representative prompt**:
> Now, lets proceed to step 8

**Outcome**:
- Incoming requests added to the dashboard
- Request detail page wired by share token
- Pay, decline, and cancel actions implemented
- Expiration-aware status handling and countdown added
- Lifecycle actions connected back to request status updates

## Notes on AI Process

- AI was used as a structured implementation partner, not as a blind code generator.
- The workflow intentionally followed: assignment brief -> Spec-Kit artifacts -> scaffold -> feature slices.
- Useful checkpoints were committed to Git as separate phases to make the process reviewable.
- Future additions to this file should focus on representative prompts and decisions, not noisy full transcripts.

## Suggested Final README Summary

When the README is finalized, summarize AI usage like this:

- AI was used to translate the assignment into Spec-Kit artifacts
- AI helped scaffold the app and shared utilities
- AI accelerated implementation, but setup, Git workflow, Supabase decisions, and verification were handled deliberately in steps
- Representative prompts are documented in this file for reviewer visibility
