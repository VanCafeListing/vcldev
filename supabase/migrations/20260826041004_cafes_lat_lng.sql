-- Generated lat/lng columns so the client can read plain coordinates for the
-- Cafe detail map without parsing PostGIS's WKB encoding of `location`.
alter table public.cafes
  add column lat double precision generated always as (extensions.st_y(location::extensions.geometry)) stored,
  add column lng double precision generated always as (extensions.st_x(location::extensions.geometry)) stored;
