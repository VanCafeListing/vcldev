-- Distance-sorted cafe browsing for the Home feed. Uses the GIST-indexed
-- `location` column via the `<->` KNN operator so Postgres can answer with an
-- index scan rather than computing distance for every row client-side.
create function public.cafes_nearby(user_lat double precision, user_lng double precision)
returns table (
  id uuid,
  name text,
  description text,
  address text,
  photo_url text,
  price_range numeric,
  wifi boolean,
  outlets boolean,
  seat_count integer,
  commuter_friendly boolean,
  parking boolean,
  seating_spacious boolean,
  seating_wide_tables boolean,
  seating_patio boolean,
  atmosphere_quiet boolean,
  atmosphere_lively boolean,
  distance_meters double precision
)
language sql
stable
security invoker
-- The KNN `<->` operator for `geography` is registered by PostGIS in the
-- `extensions` schema; an empty search_path (the usual hardening default)
-- hides it from operator resolution, so it must be included here.
set search_path = 'public, extensions'
as $$
  select
    c.id,
    c.name,
    c.description,
    c.address,
    c.photo_url,
    c.price_range,
    c.wifi,
    c.outlets,
    c.seat_count,
    c.commuter_friendly,
    c.parking,
    c.seating_spacious,
    c.seating_wide_tables,
    c.seating_patio,
    c.atmosphere_quiet,
    c.atmosphere_lively,
    extensions.st_distance(
      c.location,
      extensions.st_setsrid(extensions.st_makepoint(user_lng, user_lat), 4326)::extensions.geography
    ) as distance_meters
  from public.cafes c
  order by
    c.location OPERATOR(extensions.<->) extensions.st_setsrid(extensions.st_makepoint(user_lng, user_lat), 4326)::extensions.geography;
$$;

-- Anyone may call it, matching the "Cafes are viewable by everyone" select
-- policy on the underlying table.
grant execute on function public.cafes_nearby(double precision, double precision) to anon, authenticated;
