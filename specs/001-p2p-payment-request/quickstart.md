# Quickstart: P2P Payment Request Experience

## Prerequisites

- Node.js 22+
- npm 11+
- Supabase project with email auth enabled

## Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Local Development

1. Install dependencies:
   `npm install`
2. Start the app:
   `npm run dev`
3. Open the local URL shown by Vite.

## Database Setup

1. Apply the SQL or migration files under `supabase/migrations/`.
2. Confirm email magic-link auth is enabled in Supabase.
3. Optionally seed test data for sender/recipient scenarios.

## Testing

Run unit and integration tests:

```bash
npm test
```

Run Playwright E2E with video:

```bash
npm run test:e2e
```

## Demo Verification

- Sign in as sender and create a request.
- Sign in as recipient and verify the request appears in incoming requests.
- Pay, decline, and cancel scenarios should update statuses correctly.
- Expired requests should be blocked from payment.
