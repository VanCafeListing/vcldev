## 1. Backend

- [x] 1.1 Migration: `cafes_nearby(user_lat, user_lng)` SQL RPC function using the GIST-indexed `location` column, returning cafes ordered nearest-first with `distance_meters`
- [x] 1.2 Seed a handful of test cafe rows (name, address, location, description, price_range, amenity columns, at least one photo in `cafe-photos`) for development/verification — photos hotlink to Unsplash rather than the bucket; real photography is a content task, not code

## 2. Location & Data Layer

- [x] 2.1 Install `expo-location`; request foreground permission on Home tab mount
- [x] 2.2 `lib/cafes.ts`: query helpers — `getNearbyCafes(lat, lng)` (RPC), `getCafesFallback()` (name-ordered, no distance), `getCafeById(id)`. `cafe-search` adds the name-search helper on top of these.
- [x] 2.3 Install `expo-image`; use it for all cafe photo rendering

## 3. Home Feed

- [x] 3.1 Build the cafe card component (photo, name, address, distance, heart icon) using `design-system` primitives — rebuilt to the PDF's overlay treatment (photo fills the whole card, text on a bottom scrim) after the initial Figma-sourced version (solid brown footer) was flagged as unfaithful
- [x] 3.2 Build `app/(tabs)/index.tsx`: "Hi, {name}!" / "Cafes near you" header (PDF; falls back to "Find a cafe" for guests or a session with no name on record), card list wired to `getNearbyCafes`/`getCafesFallback` depending on permission result
- [x] 3.3 Loading and empty states for the list
- [x] 3.4 (Out of this change's original scope, done alongside the PDF rebuild since it's shared chrome visible on every screen touched here) Rebuilt `BottomNavBar` — owned by `bootstrap-app-foundation` — from the Figma full-width cream bar to the PDF's floating brand-brown pill with newly-traced icons

## 4. Cafe Detail

- [x] ~~4.1 Install `react-native-maps`~~ — reverted. Expo SDK 57's `expo-modules-jsi` fails to compile against this machine's Xcode 26.2 (open upstream bug, unrelated to this change), which only surfaces once a native module forces a build outside Expo Go. Replaced with a tappable "Open in Maps" card (`Linking` to the device's Maps app). Revisit `react-native-maps` once Expo patches the toolchain issue.
- [x] 4.2 Build `app/cafe/[id].tsx`: hero photo, name + heart, two-line address, a distance-ribbon badge, "About" + body, three amber amenity tiles with a verified-checkmark badge on Outlets/Wifi, Location card that opens the device's Maps app — rebuilt to match the PDF artboard (see design.md) after the initial Figma-sourced version was flagged as unfaithful
- [x] 4.3 Wire card taps to navigate to the detail route with the cafe id

## 5. Favourite Toggle

- [x] 5.1 Add a `['favourites', userId]` TanStack Query hook returning the current user's favourited cafe ids
- [x] 5.2 Add an optimistic toggle mutation (insert/delete on `favourites`) that updates the shared cache and rolls back on failure
- [x] 5.3 Wire the heart icon on cafe cards and the detail screen to this hook/mutation
- [x] 5.4 Guest path: tapping the heart with no session shows a Sign Up / Log In / Cancel prompt and creates no favourite — verified on simulator

## 6. Verification

- [x] 6.1 Home feed loads real cafes, distance-sorted RPC verified directly against the database (nearest-first, correct meter values); on-device confirmation blocked by the simulator having no location provider configured in this session
- [x] 6.2 Home feed still loads (unsorted, no distance) with location permission denied — verified on simulator
- [x] 6.3 Cafe detail shows accurate data matching a seeded cafe's real attributes — verified on simulator
- [ ] 6.5 Favouriting/unfavouriting from a card and from the detail screen stays consistent across both, as an authenticated user — blocked: the dev fixture account (`alice@gmail.com`) is rejecting its known password this session; needs the account's password reset or a fresh sign-up to verify
- [x] 6.6 Tapping a heart icon as a guest prompts sign-in/sign-up and creates no favourite — verified on simulator
