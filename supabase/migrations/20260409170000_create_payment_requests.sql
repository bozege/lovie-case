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

alter table public.payment_requests enable row level security;

create policy "Users can read their own payment requests"
  on public.payment_requests
  for select
  to authenticated
  using (
    sender_user_id = auth.uid()
    or recipient_user_id = auth.uid()
    or recipient_contact = auth.jwt() ->> 'email'
  );

create policy "Users can create outgoing payment requests"
  on public.payment_requests
  for insert
  to authenticated
  with check (
    sender_user_id = auth.uid()
    and sender_email = auth.jwt() ->> 'email'
    and status = 'pending'
  );

create policy "Participants can update request lifecycle status"
  on public.payment_requests
  for update
  to authenticated
  using (
    sender_user_id = auth.uid()
    or recipient_user_id = auth.uid()
    or recipient_contact = auth.jwt() ->> 'email'
  )
  with check (
    sender_user_id = auth.uid()
    or recipient_user_id = auth.uid()
    or recipient_contact = auth.jwt() ->> 'email'
  );
