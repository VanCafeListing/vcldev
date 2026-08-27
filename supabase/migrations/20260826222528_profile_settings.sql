-- profiles.id -> auth.users.id and favourites.user_id -> auth.users.id
-- already cascade (see create_profiles.sql / create_favourites.sql), so
-- deleting the auth.users row via the delete-account Edge Function is
-- sufficient to clean up both tables in one call. Nothing to add there.

alter table public.profiles add column avatar_url text;

-- Avatars: readable by anyone (shown on other users' content eventually,
-- and simplest to load without signed URLs), writable only under the
-- owning user's own id-prefixed path — mirrors cafe-photos' public-read
-- shape but adds an owner-write policy since, unlike cafe photos, avatars
-- are user-uploaded rather than admin/seed-provisioned.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatars are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
