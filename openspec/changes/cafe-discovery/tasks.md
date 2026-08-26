## 1. Backend

- [ ] 1.1 Migration: `cafes_nearby(user_lat, user_lng)` SQL RPC function using the GIST-indexed `location` column, returning cafes ordered nearest-first with `distance_meters`
- [ ] 1.2 Seed a handful of test cafe rows (name, address, location, description, price_range, amenity columns, at least one photo in `cafe-photos`) for development/verification

## 2. Location & Data Layer

- [ ] 2.1 Install `expo-location`; request foreground permission on Home tab mount
- [ ] 2.2 `lib/cafes.ts`: query helpers — `getNearbyCafes(lat, lng)` (RPC), `getCafesFallback()` (name-ordered, no distance), `getCafeById(id)`. `cafe-search` adds the name-search helper on top of these.
- [ ] 2.3 Install `expo-image`; use it for all cafe photo rendering

## 3. Home Feed

- [ ] 3.1 Build the cafe card component (photo, name, address, distance, heart icon) using `design-system` primitives
- [ ] 3.2 Build `app/(tabs)/index.tsx`: header ("Hi, {name}! Cafes near you"), card list wired to `getNearbyCafes`/`getCafesFallback` depending on permission result
- [ ] 3.3 Loading and empty states for the list

## 4. Cafe Detail

- [ ] 4.1 Install `react-native-maps`
- [ ] 4.2 Build `app/cafe/[id].tsx`: single hero photo, name + heart, address, brown distance badge, About text, three amenity tiles (Outlets/Wi-Fi with amber verified checkmarks, seat-count without), Location map with pin
- [ ] 4.3 Wire card taps to navigate to the detail route with the cafe id

## 5. Favourite Toggle

- [ ] 5.1 Add a `['favourites', userId]` TanStack Query hook returning the current user's favourited cafe ids
- [ ] 5.2 Add an optimistic toggle mutation (insert/delete on `favourites`) that updates the shared cache and rolls back on failure
- [ ] 5.3 Wire the heart icon on cafe cards and the detail screen to this hook/mutation
- [ ] 5.4 Guest path: tapping the heart with no session shows a Sign Up / Log In / Cancel prompt and creates no favourite

## 6. Verification

- [ ] 6.1 Home feed loads real cafes sorted by distance with location permission granted
- [ ] 6.2 Home feed still loads (unsorted, no distance) with location permission denied
- [ ] 6.3 Cafe detail shows accurate data matching a seeded cafe's real attributes
- [ ] 6.5 Favouriting/unfavouriting from a card and from the detail screen stays consistent across both, as an authenticated user
- [ ] 6.6 Tapping a heart icon as a guest prompts sign-in/sign-up and creates no favourite
