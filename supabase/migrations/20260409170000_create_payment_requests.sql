create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  sender_user_id uuid not null,
  sender_email text not null,
  recipient_contact text not null,
  recipient_user_id uuid null,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null default 'USD',
  note text null,
  status text not null default 'pending',
  share_token text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz not null,
  paid_at timestamptz null,
  declined_at timestamptz null,
  canceled_at timestamptz null,
  constraint payment_requests_status_check
    check (status in ('pending', 'paid', 'declined', 'canceled', 'expired'))
);
