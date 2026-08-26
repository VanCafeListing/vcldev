-- The design never asks for a username — Sign Up collects only name, email and
-- password — yet the Profile screen displays one and Log In accepts one. So it
-- is derived server-side at account creation and is never blank.
alter table public.profiles add column username text;

-- Backfill any accounts that predate this column, then lock the constraints in.
update public.profiles
set username = 'user' || substr(replace(id::text, '-', ''), 1, 12)
where username is null;

alter table public.profiles
  alter column username set not null,
  add constraint profiles_username_key unique (username);

-- Case-insensitive lookups: "Ada" and "ada" must be the same handle, both when
-- signing in and when checking whether a generated name is taken.
create unique index profiles_username_lower_idx on public.profiles (lower(username));
