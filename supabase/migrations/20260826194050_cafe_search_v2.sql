-- Corrects the previous migration's shape (see cafe_search.sql) before it
-- was ever used by the app.
drop table if exists public.recent_searches;
alter table public.cafes drop column if exists recommended_order;

alter table public.cafes
  add column recommended_rank integer;

-- One row per (user, query): searching an existing term bumps updated_at
-- rather than inserting a duplicate, so "recent" reflects last-searched
-- order without the chips accumulating repeats.
create table public.recent_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  query text not null,
  updated_at timestamptz not null default now(),
  unique (user_id, query)
);

create index recent_searches_user_id_updated_at_idx
  on public.recent_searches (user_id, updated_at desc);

alter table public.recent_searches enable row level security;

create policy "Users can view own recent searches"
  on public.recent_searches for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own recent searches"
  on public.recent_searches for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own recent searches"
  on public.recent_searches for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own recent searches"
  on public.recent_searches for delete
  using ((select auth.uid()) = user_id);

-- Seed a recommendation ranking so the Search screen's Recommendation list
-- has something to show during development/verification.
update public.cafes set recommended_rank = 1 where name = 'Tealips Cafe';
update public.cafes set recommended_rank = 2 where name = 'Foundation Coffee House';
update public.cafes set recommended_rank = 3 where name = 'The Reading Room';
