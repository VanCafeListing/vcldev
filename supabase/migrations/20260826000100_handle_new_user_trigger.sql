-- Create the profile row server-side whenever an auth user is created, so a
-- profile is guaranteed for every account regardless of how it was made
-- (email/password or any OAuth provider) and cannot be skipped by a client
-- bug or a dropped request after sign-up.
--
-- SECURITY DEFINER is required: the row is inserted before the new user has a
-- session, so RLS would otherwise reject it. search_path is pinned to defend
-- the definer's rights against search_path manipulation.
--
-- Name sources: email/password sign-up sends first_name/last_name in the
-- metadata; OAuth providers send a display name under full_name or name. Falls
-- back to null rather than inventing a placeholder, so the profile screen can
-- prompt the user instead of showing something wrong.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  built_name text;
begin
  built_name := nullif(
    trim(
      coalesce(meta ->> 'first_name', '') || ' ' || coalesce(meta ->> 'last_name', '')
    ),
    ''
  );

  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(built_name, nullif(meta ->> 'full_name', ''), nullif(meta ->> 'name', '')),
    new.email
  )
  -- Idempotent: never block account creation if a row somehow already exists.
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
