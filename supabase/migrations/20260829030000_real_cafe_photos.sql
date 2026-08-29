-- Swap the generic Unsplash stock photos for real photos pulled from each
-- cafe's own website (or, where a site had none, a coffee/restaurant
-- directory listing) — verified to actually load before being used here.
-- Matcha Corner has no confirmed real photo available and keeps its
-- Unsplash placeholder.

update public.cafes set photo_url = 'https://treescoffee.com/wp-content/uploads/2015/03/Trees-Organic-Coffee-Gastown-Vancouver_2.jpg'
  where name = 'Trees Organic Coffee (Gastown)';

update public.cafes set photo_url = 'https://treescoffee.com/wp-content/uploads/2015/03/Granv-Web-update.jpg'
  where name = 'Trees Organic Coffee (Downtown)';

update public.cafes set photo_url = 'https://treescoffee.com/wp-content/uploads/2015/03/VAN_3501-1280x779.jpg'
  where name = 'Trees Organic Coffee (Joyce)';

update public.cafes set photo_url = 'https://treescoffee.com/wp-content/uploads/2015/03/VAN_4274KMv2r-Trees-Organic.jpg'
  where name = 'Trees Organic Coffee (Kingsway & Knight)';

update public.cafes set photo_url = 'https://treescoffee.com/wp-content/uploads/2015/03/VAN_3415KM-Trees-Organic.jpg'
  where name = 'Trees Organic Coffee (Capstan, Richmond)';

update public.cafes set photo_url = 'https://images.squarespace-cdn.com/content/v1/54f8c792e4b03ea829c79558/e5d8a840-52f0-4310-b9f6-d72a4c1a01b8/3750+WEST+4TH+AVE.+-+2024-06-16T103815.586.png'
  where name = 'Breka Bakery & Cafe (Davie St)';

update public.cafes set photo_url = 'https://cdn.th3rdwave.coffee/processed/merchants/2w9PygKjJJUjNuULsl7n3qJkozg.jpg/768x768i_2x.png'
  where name = 'Cafe Algan';

update public.cafes set photo_url = 'https://www.monparis.ca/wp-content/uploads/2017/03/DSC_0912-Edit-small-1-300x286.jpg'
  where name = 'Mon Paris Patisserie';

update public.cafes set photo_url = 'https://img02.restaurantguru.com/cfa8-Restaurant-Tealips-Cafe-waffles.jpg'
  where name = 'Tealips Cafe';

update public.cafes set photo_url = 'https://static.wixstatic.com/media/cff7df_6a6b95936d5f4c4bba7dc9024450db5d~mv2.jpg/v1/fill/w_408,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/cff7df_6a6b95936d5f4c4bba7dc9024450db5d~mv2.jpg'
  where name = 'Kits Beach Coffee';
