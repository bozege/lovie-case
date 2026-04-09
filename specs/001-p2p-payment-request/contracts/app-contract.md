# App Contract: P2P Payment Request Experience

## Client-to-Backend Capabilities

The application requires these backend capabilities, whether implemented through Supabase table operations, RPCs, or thin API wrappers:

### Authentication

- Start email magic-link sign-in
- Restore authenticated session
- Sign out current session

### Payment Request Reads

- List outgoing requests for the authenticated sender
- List incoming requests for the authenticated recipient
- Read request detail by `id` or `share_token`
- Reconcile expired pending requests during relevant reads

### Payment Request Writes

- Create request
- Mark request as paid after simulated delay
- Mark request as declined
- Mark request as canceled

## Request Shape

```json
{
  "id": "uuid",
  "sender_user_id": "uuid",
  "sender_email": "sender@example.com",
  "recipient_contact": "friend@example.com",
  "recipient_user_id": "uuid-or-null",
  "amount_minor": 1250,
  "currency": "USD",
  "note": "Dinner split",
  "status": "pending",
  "share_token": "unique-token",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "expires_at": "timestamp",
  "paid_at": null,
  "declined_at": null,
  "canceled_at": null
}
```

## Mutation Rules

- Create:
  - Requires authenticated sender
  - Valid recipient contact
  - Positive amount
- Pay:
  - Allowed only for recipient on `pending` and unexpired requests
- Decline:
  - Allowed only for recipient on `pending` and unexpired requests
- Cancel:
  - Allowed only for sender on `pending` and unexpired requests
- Expire:
  - Triggered when `now > expires_at` for still-pending requests

## Error Cases

- Unauthorized request access
- Invalid contact format
- Non-positive amount
- Action attempted on terminal request
- Action attempted on expired request
- Missing or invalid share token
