-- `cafes_nearby` lists its return columns explicitly, so the Google Places
-- columns added in the previous migration would be silently dropped for any
-- user who granted location permission (the Home/Map feed's primary path)
-- while the permission-denied fallback — a plain select — returned them.
--
-- The return type changes, so this drops and recreates rather than using
-- `create or replace`.

drop function if exists public.cafes_nearby(
  double precision, double precision, boolean, boolean, boolean, boolean,
  numeric, numeric, boolean, boolean, boolean, boolean, boolean
);

create function public.cafes_nearby(
  user_lat double precision,
  user_lng double precision,
  f_wifi boolean default null,
  f_outlets boolean default null,
  f_commuter_friendly boolean default null,
  f_parking boolean default null,
  f_min_price numeric default null,
  f_max_price numeric default null,
  f_seating_spacious boolean default null,
  f_seating_wide_tables boolean default null,
  f_seating_patio boolean default null,
  f_atmosphere_quiet boolean default null,
  f_atmosphere_lively boolean default null
)
returns table(
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
  lat double precision,
  lng double precision,
  google_place_id text,
  rating numeric,
  user_ratings_total integer,
  website text,
  phone text,
  distance_meters double precision
)
language sql
stable
set search_path to 'public, extensions'
as $function$
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
    c.lat,
    c.lng,
    c.google_place_id,
    c.rating,
    c.user_ratings_total,
    c.website,
    c.phone,
    extensions.st_distance(
      c.location,
      extensions.st_setsrid(extensions.st_makepoint(user_lng, user_lat), 4326)::extensions.geography
    ) as distance_meters
  from public.cafes c
  where (f_wifi is null or c.wifi = f_wifi)
    and (f_outlets is null or c.outlets = f_outlets)
    and (f_commuter_friendly is null or c.commuter_friendly = f_commuter_friendly)
    and (f_parking is null or c.parking = f_parking)
    and (f_min_price is null or c.price_range >= f_min_price)
    and (f_max_price is null or c.price_range <= f_max_price)
    and (f_seating_spacious is null or c.seating_spacious = f_seating_spacious)
    and (f_seating_wide_tables is null or c.seating_wide_tables = f_seating_wide_tables)
    and (f_seating_patio is null or c.seating_patio = f_seating_patio)
    and (f_atmosphere_quiet is null or c.atmosphere_quiet = f_atmosphere_quiet)
    and (f_atmosphere_lively is null or c.atmosphere_lively = f_atmosphere_lively)
  order by
    c.location operator(extensions.<->) extensions.st_setsrid(extensions.st_makepoint(user_lng, user_lat), 4326)::extensions.geography;
$function$;
