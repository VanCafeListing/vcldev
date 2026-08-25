-- PostGIS backs the "cafes near you" proximity queries. A geography column
-- with a GIST index gives correct, indexed nearest/radius search, which plain
-- lat/lng columns cannot.
create extension if not exists postgis with schema extensions;
