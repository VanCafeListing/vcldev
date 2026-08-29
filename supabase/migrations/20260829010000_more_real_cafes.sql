-- Two more of the original seed's demo names turned out to correspond to
-- real cafes; add them back with real addresses. "Foundation Coffee House"
-- and "The Reading Room" have no real Vancouver match and stay dropped.

insert into public.cafes
  (name, description, address, location, photo_url, price_range, wifi, outlets, seat_count,
   commuter_friendly, parking, seating_spacious, seating_wide_tables, seating_patio,
   atmosphere_quiet, atmosphere_lively)
values
  ('Tealips Cafe',
   'A Burnaby bubble tea and waffle cafe near Metrotown — bright, colourful, and popular with students after class.',
   '7139 Arcola Way, Burnaby, BC',
   extensions.st_setsrid(extensions.st_makepoint(-122.9565062, 49.2194953), 4326),
   'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
   8.00, true, false, 20, true, true, false, true, false, false, true),

  ('Kits Beach Coffee',
   'A community-focused coffee shop a block from Kits Beach — sunny, laid-back, and popular for a walk-up coffee before the water.',
   '1945 Cornwall Ave, Vancouver, BC V6J 1C8',
   extensions.st_setsrid(extensions.st_makepoint(-123.1488220, 49.2726334), 4326),
   'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
   6.50, true, false, 10, false, false, false, false, true, false, true);
