-- Authoritative cafe data pulled from the Google Places API (New), which the
-- project now has enabled. Replaces hand-geocoded coordinates and
-- manually-sourced website photos with Google's own listing data.
--
-- Notably this corrects Matcha Corner, whose hand-geocoded pin sat ~2.6km
-- from the real storefront despite a correct street address.
--
-- google_place_id is stored so this data can be re-synced later without
-- re-running a text search (see scripts/sync-places.mjs).

alter table public.cafes
  add column if not exists google_place_id text unique,
  add column if not exists rating numeric(2,1),
  add column if not exists user_ratings_total integer,
  add column if not exists website text,
  add column if not exists phone text;

update public.cafes set
  google_place_id = 'ChIJJe_9i9RzhlQRr_00iVd_JKA',
  address = '855 Davie St, Vancouver, BC V6Z 1B7',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.1278688, 49.278452699999995), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjBesLXX5So-sokUtwKilW-KtRVfA3RXNgKbx2WOOMIOypuzPInwsmjqjtPed5Rwge10vSOoom8vR6mKPN40dNRXNg7n5A0zV_lZbmHJH8LBN7rinckO-LonRagJ_I5fozdLk4MNw5ps3Ky2lOfmPZ_Sgg=s4800-w1200',
  rating = 4.4,
  user_ratings_total = 4478,
  website = 'https://www.breka.ca/',
  phone = '(604) 428-8080'
where id = '3b6a1a5a-664c-44d2-8ad1-fe74d2542bed';

update public.cafes set
  google_place_id = 'ChIJLyt8u_V1hlQR5bngw4xp-4c',
  address = '688 W 58th Ave, Vancouver, BC V6P 0K1',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.11831599999998, 49.2175188), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjCXAY9ZGmcrRF_sBmA6KDdA2MXNixwpLyccG3576OQPV8X7wm4pSKd7LRsi1PNB5M0LbaWebJrZhU5R_bymJKeO7uOiGo0PsLDiS2AtxgYeS2jqPvXx8pXYdcQkGb9HIKNwzxnXKD39XPrNSPd-M051AQ=s4800-w1200',
  rating = 4.1,
  user_ratings_total = 289,
  website = 'http://www.cafealgan.com/',
  phone = null
where id = '8db7ee03-508b-4704-a2d1-5280b737d28d';

update public.cafes set
  google_place_id = 'ChIJnQYkCWRzhlQR7YV9M6VFwag',
  address = '1945 Cornwall Ave, Vancouver, BC V6J 1C8',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.1488316, 49.272613299999996), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjCi2iWD7z7bDGymTsracftvUqM6-8guq_SBTCG2fh3v8S-mt8MFYeQ0LFv65InSgcF75jz4-eWZMYDb_AkZDsplOHD1q3ZgtozssS4zo0OmFtm3Ajf5uiqODb4ytieNu-5IuOoSpDjneSFgwDCt4iE5=s4800-w1200',
  rating = 4.4,
  user_ratings_total = 442,
  website = 'http://www.kitsbeachcoffee.com/',
  phone = null
where id = 'bb7008ac-86a6-435e-a6dd-e4cc58dae58a';

update public.cafes set
  google_place_id = 'ChIJtZWlBQBxhlQRhbmXZbkIAOk',
  address = '1148 Kingsway, Vancouver, BC V5V 3C8',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.0810365, 49.252417099999995), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjAbejHszSHevUn-aBgUuPZjDI07UyNTykzz0Z_A-K6eLb0AalMdf98lNxE_Ep1kpeH0MoXQmk4MJXQopkAnrO8SomcblUq8uBsddmplJ7_sO6spU5i0j5PEamux8Ha5o2rllchHME-LJzyXfBW-oFE=s4800-w1200',
  rating = 4.3,
  user_ratings_total = 250,
  website = 'https://matchacorner.square.site/',
  phone = '(604) 620-2018'
where id = '55a82ba2-85ae-403d-b033-256ff8ad2777';

update public.cafes set
  google_place_id = 'ChIJNQzC-V52hlQRV9zwaieHioY',
  address = '4396 Beresford St., Burnaby, BC V5H 2Y4',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.00543689999998, 49.225937099999996), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjAXkGmLkcGVY63Wq82l5nnPjn1Ew9IDI7FM-jmX3BJbK3nt1braISsalqelXAxMCPcswYQinuDBWEeyQSky1LCbaKIm9sa7nc2rRnBfsWJv6Us5lPaTT8HUUmC1k2SEerhH0ChJpsMeJhJTdg=s4800-w1200',
  rating = 4.3,
  user_ratings_total = 868,
  website = 'http://www.monparis.ca/',
  phone = '(604) 564-5665'
where id = '7a114302-8de2-4e6f-a8ad-af1e7361f11d';

update public.cafes set
  google_place_id = 'ChIJcx-6UwB3hlQRj7N1Ld6aYY4',
  address = '6125 Sussex Ave #110, Burnaby, BC V5H 4G1',
  location = extensions.st_setsrid(extensions.st_makepoint(-122.99905489999999, 49.229046), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjBhQmpiM1RMRWU1__YbqDQ4wbiMPZkWqOfujkkXj6kKFheoiRb4MLczYbj6f7tuWW5lhwQJqTiTuSuHRVNtMjHX8Bpv3OnAPQ8grBonCX96AiOtElOAmUJCgqQY2GkvSrL_X36QDrXe-X7fvw=s4800-w1200',
  rating = 4.4,
  user_ratings_total = 91,
  website = 'http://www.tealipscafe.ca/',
  phone = '(604) 565-6886'
where id = '45648372-0794-4911-9fd4-402dea0cad0b';

update public.cafes set
  google_place_id = 'ChIJLVqwJAB1hlQRkyhlHMwCAkY',
  address = '3300 Number 3 Rd #110, Richmond, BC V6X 1R3',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.1318328, 49.1893258), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjCBOW6qXf6ed6ErbjH_j0c1ZkFBtLAKzdd753_nElgQkVaVKbfld-Gu28x3IhRza9Zego4hB0uxpuXLHKZWAlwISMObsjneKLDMPnFkIbK_x57M5Nbe8QEyP6t24X-WXgeAVJwY-BUasYvbg7DySl2KbA=s4800-w1200',
  rating = 4.4,
  user_ratings_total = 89,
  website = 'https://treescoffee.com/',
  phone = '(236) 235-5096'
where id = 'ceee1fc9-c4d8-47a3-a9d6-144b9a26d081';

update public.cafes set
  google_place_id = 'ChIJx19lhHhxhlQR00Wyx2MBMZc',
  address = '450 Granville St, Vancouver, BC V6C 1V4',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.1143322, 49.284841899999996), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjCE6nEK-DkqViDioAt0yF5_9Mi6zOFJKbiDgLUYDpRNCVpnSorqFhokYT2K9AF4I5kXIUz2s7ToNx8jpkb1cFxrADUWh-FG2dWZReE1CJYiPmeE9p1sWTkpnHT7C_5hRcyf-4IpH4bbtc9w8w=s4800-w1200',
  rating = 4.3,
  user_ratings_total = 1891,
  website = 'https://treescoffee.com/',
  phone = '(604) 684-5022'
where id = '82b81f7b-1a15-423c-9bea-aa2475d17893';

update public.cafes set
  google_place_id = 'ChIJM297MXhxhlQRexycFVo2UQ8',
  address = '321 Water St, Vancouver, BC V6C 2R6',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.1092778, 49.2845389), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjCeXxuAXROaw4g0ZtJ0T0JLG8Y0s2zqzkg2qc4uWdKBYds0VGTt0V8TAkJP8XmnRpOqZQfZxCU5895n-E_7uQrpA6re4QBybKipeXcD4m648WX9Y7uYbyklMT38fRZpbZubAw1whwZSjzFoNycdLbiWaA=s4800-w1200',
  rating = 4.5,
  user_ratings_total = 613,
  website = 'https://treescoffee.com/',
  phone = '(604) 633-3880'
where id = '5478d90c-7917-4e9d-9d90-9449dfca4742';

update public.cafes set
  google_place_id = 'ChIJCQJCjXV3hlQRN5HczmnZJWg',
  address = '5078 Joyce St, Vancouver, BC V5R 6B2',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.0312627, 49.2385637), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjCr6n23HOtOeJ7ODBEBDtxnDjnujanaMl6tu2OfD58FIciFHQj1h4hiuvzzlFri0c8hy7ZlDVyUMzd-pZU_5HANsTuOwSXWI9Op8Y5_StaQUScC8tMDZGnN6BuTqCz2hMKepwIuVIydgqCSbs8=s4800-w1200',
  rating = 4.1,
  user_ratings_total = 706,
  website = 'https://treescoffee.com/',
  phone = '(604) 895-4211'
where id = '27672b90-26a8-45ee-b786-0e813138e125';

update public.cafes set
  google_place_id = 'ChIJY5OOUwB3hlQRarHXANht15E',
  address = '1408 Kingsway, Vancouver, BC V5N 2R5',
  location = extensions.st_setsrid(extensions.st_makepoint(-123.07583330000001, 49.2496833), 4326),
  photo_url = 'https://lh3.googleusercontent.com/place-photos/AG9NLjAa9HIFxXsaKRnp5geQMj9Fh9S91D5g9Fcxjs9XWljzZYw3inC1sBH8xfKQBwH3bwOhMjI94FmzErtmOEJPp-YRm4CjqRfyianFd6Fd9Om8KRThqMPIEtTvuwm5BZyDEiLOUuBDdE7ar0IddmXiSKo80w=s4800-w1200',
  rating = 4.6,
  user_ratings_total = 88,
  website = 'https://treescoffee.com/',
  phone = '(236) 480-7902'
where id = 'bcebea2b-9602-48df-b6b8-4e52c134b502';

