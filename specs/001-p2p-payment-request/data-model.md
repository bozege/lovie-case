# Data Model: P2P Payment Request Experience

## Entity: User

- Purpose: Represents an authenticated app user.
- Key fields:
  - `id`
  - `email`
  - `created_at`
- Notes:
  - User records are primarily managed by Supabase Auth.
  - Email is the main identity used to match incoming requests.

## Entity: Payment Request

- Purpose: Represents a sender’s request for payment from a recipient.
- Key fields:
  - `id` UUID
  - `sender_user_id` UUID
  - `sender_email` text
  - `recipient_contact` text
  - `recipient_user_id` UUID nullable
  - `amount_minor` integer
  - `currency` text
  - `note` text nullable
  - `status` enum-like text
  - `share_token` text unique
  - `created_at` timestamp
  - `updated_at` timestamp
  - `expires_at` timestamp
  - `paid_at` timestamp nullable
  - `declined_at` timestamp nullable
  - `canceled_at` timestamp nullable

## State Model

- `pending`
  - Initial state after creation.
  - Can transition to `paid`, `declined`, `canceled`, or `expired`.
- `paid`
  - Terminal state after recipient payment simulation succeeds.
- `declined`
  - Terminal state after recipient declines.
- `canceled`
  - Terminal state after sender cancels while still pending.
- `expired`
  - Terminal state when current time passes `expires_at` before any other terminal action.

## Relationships

- One `User` can send many `Payment Request` rows.
- One `User` can receive many `Payment Request` rows when matched by `recipient_user_id` or `recipient_contact`.
- A `Payment Request` belongs to exactly one sender and zero or one resolved recipient user.

## Validation Rules

- `recipient_contact` must match accepted email or phone-like formats.
- `amount_minor` must be greater than `0`.
- `currency` is fixed to `USD` in v1.
- `note` is optional and capped to a reasonable max length in the UI and validation layer.
- `share_token` must be unique.

## Access Rules

- Sender can read requests where `sender_user_id` equals the authenticated user ID.
- Recipient can read requests where `recipient_user_id` equals the authenticated user ID or `recipient_contact` matches the authenticated email.
- Mutations are restricted by role and current status.
