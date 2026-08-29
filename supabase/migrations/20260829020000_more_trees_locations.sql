-- Add the rest of the Trees Organic Coffee locations the user asked for:
-- Joyce-Collingwood, Kingsway & Knight, and the Richmond Capstan SkyTrain
-- location.

insert into public.cafes
  (name, description, address, location, photo_url, price_range, wifi, outlets, seat_count,
   commuter_friendly, parking, seating_spacious, seating_wide_tables, seating_patio,
   atmosphere_quiet, atmosphere_lively)
values
  ('Trees Organic Coffee (Joyce)',
   'The Joyce-Collingwood outpost of the local Trees Organic chain, right by the SkyTrain station — a quick coffee stop for commuters.',
   '5078 Joyce St, Vancouver, BC V5R 4G6',
   extensions.st_setsrid(extensions.st_makepoint(-123.0312920, 49.2385624), 4326),
   'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
   8.50, true, true, 16, true, false, false, false, false, false, true),

  ('Trees Organic Coffee (Kingsway & Knight)',
   'A Trees Organic location in King Edward Village at Kingsway and Knight — cheesecake, coffee, and a steady neighbourhood crowd.',
   '1408 Kingsway, Vancouver, BC',
   extensions.st_setsrid(extensions.st_makepoint(-123.0757342, 49.2497442), 4326),
   'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
   8.50, true, true, 20, true, false, true, false, false, false, true),

  ('Trees Organic Coffee (Capstan, Richmond)',
   'Trees Organic''s Richmond expansion, right inside Capstan SkyTrain Station — coffee and cheesecake for the commute.',
   '3300 Number 3 Rd #110, Richmond, BC V6X 2B6',
   extensions.st_setsrid(extensions.st_makepoint(-123.1314838, 49.1895309), 4326),
   'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
   8.50, true, true, 12, true, true, false, false, false, false, true);
