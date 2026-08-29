-- Tealips Cafe and Mon Paris Patisserie were seeded at their wrong
-- locations: Tealips at the Highgate/Arcola Way store instead of the
-- Metrotown one near Kingsway, and Mon Paris at its Vancouver/Olympic
-- Village store instead of the Burnaby store across from Metropolis at
-- Metrotown. Both chains have multiple real locations; these correct the
-- single seeded row for each to the location the user actually meant.

update public.cafes
set
  address = '110-6125 Sussex Ave, Burnaby, BC V5H 4G1',
  description = 'A bubble tea and waffle cafe steps from Metropolis at Metrotown — bright, colourful, and popular with students after class.',
  location = extensions.st_setsrid(extensions.st_makepoint(-122.9991180, 49.2291279), 4326)
where name = 'Tealips Cafe';

update public.cafes
set
  address = '4396 Beresford St, Burnaby, BC V5H 2Y4',
  description = 'French pastry shop and cafe directly across from Metropolis at Metrotown — croissants, tarts, and espresso in a bright, minimal space.',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.0055761, 49.2260261), 4326)
where name = 'Mon Paris Patisserie';
