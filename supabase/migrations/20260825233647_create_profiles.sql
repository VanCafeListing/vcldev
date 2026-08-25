-- One profile per authenticated user. The primary key IS the auth user id, so
-- the row is deleted automatically when the account is (see the cascade below,
-- which the profile-settings change relies on for account deletion).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users may only ever read or write their own profile.
create policy "Users can view own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using ((select auth.uid()) = id);
