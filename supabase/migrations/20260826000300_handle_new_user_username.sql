-- Assign a username as part of creating the profile, so every account has one
-- no matter which sign-up path created it. Derived from the email's local-part
-- and uniquified with a counter, so a clash can never fail account creation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  built_name text;
  base_handle text;
  candidate text;
  suffix integer := 0;
begin
  built_name := nullif(
    trim(
      coalesce(meta ->> 'first_name', '') || ' ' || coalesce(meta ->> 'last_name', '')
    ),
    ''
  );

  -- Local-part of the email, folded to lowercase and stripped of anything that
  -- is not alphanumeric, dot, underscore or hyphen.
  base_handle := regexp_replace(lower(split_part(coalesce(new.email, ''), '@', 1)), '[^a-z0-9._-]', '', 'g');
  if base_handle is null or length(base_handle) < 3 then
    base_handle := 'user' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  candidate := base_handle;
  -- Compare case-insensitively, matching the unique index on lower(username).
  while exists (select 1 from public.profiles p where lower(p.username) = candidate) loop
    suffix := suffix + 1;
    candidate := base_handle || suffix::text;
  end loop;

  insert into public.profiles (id, name, email, username)
  values (
    new.id,
    coalesce(built_name, nullif(meta ->> 'full_name', ''), nullif(meta ->> 'name', '')),
    new.email,
    candidate
  )
  -- Idempotent: never block account creation if a row somehow already exists.
  on conflict (id) do nothing;

  return new;
end;
$$;
