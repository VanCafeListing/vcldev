-- Three more real Vancouver cafes, requested by the user.
--
-- Wifi/outlet values come from the user's own on-the-ground knowledge
-- (Sweet Thea: no wifi, outlets present but only 4; Olivier's: both). No
-- wifi/outlet claim was supplied for Noct. Coffee, and Google Places has no
-- field for either, so both stay false — meaning "not verified" rather than
-- "confirmed absent". The amenity badge only shows a checkmark when true, so
-- false understates rather than misleads.
--
-- Patio, parking and price come from the Places API's own attributes
-- (outdoorSeating, parkingOptions, priceLevel) rather than being invented.
-- Remaining unknowns (seat_count, commuter_friendly, seating and atmosphere
-- tags) are left at false/null for the same reason.

insert into public.cafes
  (name, description, address, location, photo_url, price_range, wifi, outlets, seat_count,
   commuter_friendly, parking, seating_spacious, seating_wide_tables, seating_patio,
   atmosphere_quiet, atmosphere_lively,
   google_place_id, rating, user_ratings_total, website, phone)
values
  ('Noct. Coffee',
   'A specialty coffee bar on Main Street with a small patio — tight, design-led, and focused on the coffee itself.',
   '4807 Main St, Vancouver, BC V5V 0E4',
   extensions.st_setsrid(extensions.st_makepoint(-123.1018007, 49.241807099999996), 4326),
   'https://lh3.googleusercontent.com/place-photos/AG9NLjCJNQURASF5iQlU6YsnmrTkfILKc9Ya-mBWEKUrNnN8K6rzXUltfc3o8szandLiF1clTAjjJej9I-t_GB7VbaXbIAWhIOqH6GGMAkOcJEk0bBRzMgivsTFY1nRQTn8jmtu7nHUfwKki2FRdHQhTozwCPw=s4800-w1200',
   6.00, false, false, null,
   false, true, false, false, true,
   false, false,
   'ChIJgQrB6u1xhlQRerPXxjKn3OI', 4.6, 161, 'https://noct.coffee/', null),

  ('Sweet Thea Bakery',
   'A Main Street bakery and cafe known for its pastries. No wifi, and only about four power outlets — better for a short stop than a long working session.',
   '4789 Main St, Vancouver, BC V5X 3H3',
   extensions.st_setsrid(extensions.st_makepoint(-123.10159940000001, 49.2427663), 4326),
   'https://lh3.googleusercontent.com/place-photos/AG9NLjDEuKcnqU271B432Q85aw8hBYK-YNp1vmW9GZQImq7MnJVNOJw_snCySMg5HvNMLLZxM1qvjikEkM4PuKDnn0Xw92bGIh9CyP4J23R7lsKnGjjQg8cy7s3KO2aRGTUYxod7udCtI2lxYpMm8TS1ma0a0g=s4800-w1200',
   9.00, false, true, null,
   false, true, false, false, false,
   false, false,
   'ChIJY70BasJzhlQRFEHaebI8JgU', 4.4, 321, 'http://www.sweetthea.com/', '(604) 226-0895'),

  ('Olivier''s La Boulangerie (Fraser St)',
   'A French bakery on Fraser Street with wifi and power outlets — breads, viennoiserie, and room to sit and work.',
   '3885 Fraser St, Vancouver, BC V5V 4E3',
   extensions.st_setsrid(extensions.st_makepoint(-123.09036139999999, 49.250241499999994), 4326),
   'https://lh3.googleusercontent.com/place-photos/AG9NLjCMIJBJ061JJpNmFOxLTM6drWXhsPBXZCo6iSckhWBtMhenE55BlYVLhQ5L04WP6TxJamTR5LJXBeqHKQUiKG4hEACazYHj52Ny6mz4ZLlxDClViruVncVGY9S0Z1MIcKzDRkIoyztSWx2fOQPXCSr7=s4800-w1200',
   9.00, true, true, null,
   false, true, false, false, false,
   false, false,
   'ChIJm98TKQBzhlQR23VAjv2k_g4', 4.4, 434, 'https://www.oliviersbreads.com/', '(604) 559-8081');
