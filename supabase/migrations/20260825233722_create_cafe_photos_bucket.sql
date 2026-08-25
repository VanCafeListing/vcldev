-- Cafe photos: readable by anyone (the Home feed must load them for guests
-- too), writable only by the service role. `public = true` makes objects
-- readable without a signed URL; no insert/update/delete policy is created,
-- so client keys cannot write here.
insert into storage.buckets (id, name, public)
values ('cafe-photos', 'cafe-photos', true)
on conflict (id) do nothing;

create policy "Cafe photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'cafe-photos');
