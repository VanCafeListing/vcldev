-- A user's favourited cafes. Both foreign keys cascade, so deleting an account
-- (or a cafe) leaves no orphaned rows.
create table public.favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cafe_id uuid not null references public.cafes (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- A cafe can only be favourited once per user; makes the toggle idempotent.
  unique (user_id, cafe_id)
);

create index favourites_user_id_idx on public.favourites (user_id);

alter table public.favourites enable row level security;

-- Favourites are private: a user only ever sees or changes their own.
create policy "Users can view own favourites"
  on public.favourites for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own favourites"
  on public.favourites for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own favourites"
  on public.favourites for delete
  using ((select auth.uid()) = user_id);
