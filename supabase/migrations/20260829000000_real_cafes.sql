-- Replace the fictional demo fixtures from `seed_cafes` with real Vancouver
-- cafes. Photos hotlink to Unsplash rather than the `cafe-photos` bucket —
-- real photography is still a content task, not code.

-- These four were invented for local verification and don't correspond to
-- real businesses.
delete from public.cafes
  where name in ('Tealips Cafe', 'Foundation Coffee House', 'Kits Beach Roasters', 'The Reading Room');

-- The seed's "Mon Paris Patisserie" was a placeholder address; override it
-- with the real Vancouver location (Olympic Village).
update public.cafes
set
  name = 'Mon Paris Patisserie',
  description = 'French pastry shop and cafe in Olympic Village, from the team behind the original Burnaby location — croissants, tarts, and espresso in a bright, minimal space.',
  address = '1731 Manitoba St, Vancouver, BC V5Y 0H8',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.1067672, 49.2698716), 4326),
  photo_url = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
  price_range = 9.50,
  wifi = true,
  outlets = false,
  seat_count = 14,
  commuter_friendly = true,
  parking = false,
  seating_spacious = false,
  seating_wide_tables = false,
  seating_patio = true,
  atmosphere_quiet = true,
  atmosphere_lively = false
where name = 'Mon Paris Patisserie';

insert into public.cafes
  (name, description, address, location, photo_url, price_range, wifi, outlets, seat_count,
   commuter_friendly, parking, seating_spacious, seating_wide_tables, seating_patio,
   atmosphere_quiet, atmosphere_lively)
values
  ('Matcha Corner',
   'A small Kingsway matcha specialty cafe with ceremonial-grade drinks and a cozy, quiet counter for a slower coffee break.',
   '1148 Kingsway, Vancouver, BC V5V 3C8',
   extensions.st_setsrid(extensions.st_makepoint(-123.0516749, 49.2389713), 4326),
   'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
   7.50, true, false, 10, true, false, false, false, false, true, false),

  ('Trees Organic Coffee (Gastown)',
   'A Gastown institution on Water Street — organic coffee and live music some nights, with a steady flow of tourists and regulars.',
   '321 Water St, Vancouver, BC V6B 1B8',
   extensions.st_setsrid(extensions.st_makepoint(-123.1093009, 49.2846463), 4326),
   'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
   8.50, true, true, 28, true, false, true, true, false, false, true),

  ('Trees Organic Coffee (Downtown)',
   'The Granville Street outpost of the local Trees Organic chain — reliable wifi and outlets in the heart of the Financial District.',
   '450 Granville St, Vancouver, BC V6C 1V4',
   extensions.st_setsrid(extensions.st_makepoint(-123.1143085, 49.2848589), 4326),
   'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
   8.50, true, true, 22, true, false, true, false, false, false, true),

  ('Breka Bakery & Cafe (Davie St)',
   'A 24-hour Vancouver bakery chain known for croissants and late-night baking — busy, bright, and always open on Davie Street.',
   '855 Davie St, Vancouver, BC V6Z 1B7',
   extensions.st_setsrid(extensions.st_makepoint(-123.1278962, 49.2784140), 4326),
   'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
   6.50, true, false, 18, true, false, false, true, false, false, true),

  ('Cafe Algan',
   'A hidden-gem matcha and coffee spot on West 58th in Marpole — small, quiet, and worth the trip off the beaten path.',
   '688 W 58th Ave, Vancouver, BC V6P 0K1',
   extensions.st_setsrid(extensions.st_makepoint(-123.1184167, 49.2176487), 4326),
   'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
   7.00, true, false, 12, false, true, false, false, false, true, false);
