-- Cafes are admin/seed-provisioned: the app has no "add a cafe" flow.
-- Every filter in the Filters screen maps to a structured column here rather
-- than to free text, so filtering happens in the query, not the client.
create table public.cafes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text,
  location extensions.geography (Point, 4326),
  photo_url text,

  -- Price Range filter ($5-$20 dual-thumb slider): a typical spend per visit.
  price_range numeric(6, 2),

  -- Workspace Essentials
  wifi boolean not null default false,
  outlets boolean not null default false,

  -- Shown on the detail screen as the "20+ seats" tile.
  seat_count integer,

  -- Location filters
  commuter_friendly boolean not null default false,
  parking boolean not null default false,

  -- Seating filters
  seating_spacious boolean not null default false,
  seating_wide_tables boolean not null default false,
  seating_patio boolean not null default false,

  -- Atmosphere filters
  atmosphere_quiet boolean not null default false,
  atmosphere_lively boolean not null default false,

  created_at timestamptz not null default now()
);

-- Powers nearest-first ordering and radius search.
create index cafes_location_idx on public.cafes using gist (location);

alter table public.cafes enable row level security;

-- Anyone may browse cafes, including guests with no session. No insert/update/
-- delete policy exists, so writes are possible only via the service role.
create policy "Cafes are viewable by everyone"
  on public.cafes for select
  using (true);
