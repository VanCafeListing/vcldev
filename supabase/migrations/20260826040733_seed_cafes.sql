-- Development/verification fixtures. Photos hotlink to Unsplash rather than
-- the `cafe-photos` bucket — real photography is a content task, not code.
insert into public.cafes
  (name, description, address, location, photo_url, price_range, wifi, outlets, seat_count,
   commuter_friendly, parking, seating_spacious, seating_wide_tables, seating_patio,
   atmosphere_quiet, atmosphere_lively)
values
  ('Tealips Cafe',
   'A bright, plant-filled corner cafe with fast Wi-Fi and plenty of outlets — a favourite for a full day of remote work.',
   '1046 Commercial Dr, Vancouver',
   extensions.st_setsrid(extensions.st_makepoint(-123.0698, 49.2789), 4326),
   'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
   12.00, true, true, 24, true, false, true, true, false, true, false),

  ('Mon Paris Patisserie',
   'French pastries and strong espresso, with a quiet back room that stays low on noise through the afternoon.',
   '2588 W Broadway, Vancouver',
   extensions.st_setsrid(extensions.st_makepoint(-123.1477, 49.2632), 4326),
   'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
   9.50, true, true, 16, true, true, false, true, false, true, false),

  ('Foundation Coffee House',
   'Industrial-chic roastery near the SkyTrain with wide communal tables built for laptops.',
   '520 Main St, Vancouver',
   extensions.st_setsrid(extensions.st_makepoint(-123.1004, 49.2802), 4326),
   'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
   8.00, true, true, 32, true, false, true, true, true, false, true),

  ('Kits Beach Roasters',
   'Laid-back beachside spot with a sunny patio — better for a casual working afternoon than back-to-back calls.',
   '2205 Cornwall Ave, Vancouver',
   extensions.st_setsrid(extensions.st_makepoint(-123.1553, 49.2764), 4326),
   'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
   10.50, true, false, 12, false, true, false, false, true, false, true),

  ('The Reading Room',
   'A hushed, book-lined cafe with dim lighting and single-seat nooks — no patio, no music, just quiet focus.',
   '3438 Cambie St, Vancouver',
   extensions.st_setsrid(extensions.st_makepoint(-123.1148, 49.2497), 4326),
   'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
   11.00, true, true, 20, true, false, false, false, false, true, false);
