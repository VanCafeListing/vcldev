-- cafe-search: recent search history and a curated recommendation ordering
-- on cafes. Superseded by cafe_search_v2 in the same session, before this
-- shape was ever used by the app — `unique (user_id, query)` and
-- `updated_at` (used to bump "last searched" order) turned out to be a
-- better fit than plain `created_at`, and `recommended_rank` a clearer name
-- than `recommended_order`. Kept as a record of what actually ran.
alter table public.cafes
  add column recommended_order integer;

create table public.recent_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  query text not null,
  created_at timestamptz not null default now()
);

create index recent_searches_user_id_created_at_idx
  on public.recent_searches (user_id, created_at desc);

alter table public.recent_searches enable row level security;

create policy "Users can view own recent searches"
  on public.recent_searches for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own recent searches"
  on public.recent_searches for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own recent searches"
  on public.recent_searches for delete
  using ((select auth.uid()) = user_id);

update public.cafes set recommended_order = 1 where name = 'Tealips Cafe';
update public.cafes set recommended_order = 2 where name = 'Foundation Coffee House';
update public.cafes set recommended_order = 3 where name = 'The Reading Room';
