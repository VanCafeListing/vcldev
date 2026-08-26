## Context

`bootstrap-app-foundation` provides the `cafes` table (with a `geography(Point,4326)` column and GIST index) and `favourites` table with RLS, plus TanStack Query already wired at the app root. `user-auth` provides real sessions and guest mode. This change is the first to actually query and mutate that data. See proposal.md for motivation and specs/cafe-discovery/spec.md for the behavior contract.

## Goals / Non-Goals

**Goals:**
- Real, distance-sorted cafe browsing backed by the PostGIS column, with a graceful fallback when location permission is denied.
- Consistent favourite state across every screen that shows a heart icon, via a single shared cache.
- Cafe photo loading that stays smooth in a scrollable list.

**Non-Goals:**
- The Filters modal and applying structured filters (Wi-Fi, price range, etc.) — separate `cafe-filters` change.
- Text search and the Search screen — separate `cafe-search` change.
- The dedicated Favourites list screen — separate `favourites` change; this change only implements the toggle.
- Any cafe-creation/editing tooling — cafes remain seed/admin-provisioned only, per the project's MVP scope rule.

## Decisions

**Distance sorting via a Postgres RPC function, not client-side Haversine.**
A `cafes_nearby(user_lat, user_lng)` SQL function uses the existing GIST-indexed geography column (`ORDER BY location <-> point(...)`) and returns each cafe plus a computed `distance_meters`, called via `supabase.rpc('cafes_nearby', {...})`. This uses the index bootstrap already set up rather than fetching every cafe and computing distance in the client, which doesn't scale and duplicates logic per screen.

**Location denied → fall back to an unsorted (name-ordered) query, not a blocked screen.**
Uses `expo-location`'s foreground permission request. If denied, the Home feed calls a plain `select` ordered by name instead of the RPC function, and simply omits per-card distance — matches the spec's "still load and be usable" requirement without inventing an error/retry UI the mockup doesn't show.

**Favourite state: one shared TanStack Query cache key (`['favourites', userId]`) driving every heart icon.**
Toggling a favourite from any screen invalidates this single query, so the Home feed, Cafe detail — and later the Search and Favourites screens — all re-derive the same state — satisfying the spec's cross-screen consistency requirement without each screen tracking its own copy. The toggle mutation is optimistic (flips the icon immediately) and reverts on failure.

**Guest favourite attempt: an in-place prompt (Sign Up / Log In / Cancel), not an automatic redirect.**
Tapping a heart icon while a guest shows a lightweight prompt with those three actions rather than yanking the user away from what they're browsing. Guest status is read from the same session/guest state `app-shell` already tracks.

**Cafe photos: `expo-image` (not core `Image`) for disk caching in the scrollable list.**
The Home feed is a photo-heavy scrolling list; `expo-image`'s caching keeps scroll performance acceptable. Photo URLs come from the `cafe-photos` Storage bucket bootstrap already provisioned (public read).

**Map: "Open in Maps" via `Linking`, not an embedded `MapView`.**
`react-native-maps` was tried first and works fine in principle, but Expo SDK 57's `expo-modules-jsi` fails to compile against Xcode 26.2 on the dev machine (an open upstream Expo bug, unrelated to this change) — and that build only has to happen at all because a native module forces the app out of Expo Go. Rather than block this change on an upstream fix, the Cafe detail's Location card opens the device's own Maps app instead. Revisit an embedded `MapView` once the toolchain issue is resolved upstream.

**PDF is now the primary design source (revised mid-implementation).**
Home and Cafe detail first shipped built from the Figma Styleguide page (per the project's original Figma-primary rule), but the user flagged the result as visually unfaithful — the PDF's version of the same two screens (which the file also draws, on the artboard directly beside Sign-up/Profile) turned out to be the more finished design: a different card treatment (photo fills the whole card with an overlay scrim, not a solid brown footer), a floating pill tab bar instead of a full-width bar, a distance-ribbon badge, amber amenity tiles with a verified checkmark, and a "Hi, {name}!" greeting. The user then made this the standing rule project-wide (`openspec/config.yaml`'s design-source-of-truth section), not just a one-off fix. The rebuild:
- Sampled exact colours from a 600dpi crop of each PDF artboard with a small PIL script (`Image.getcolors()` on a tight crop, sorted by frequency) rather than eyeballing — PDF rasterization adds antialiasing noise a Figma vector fill doesn't have, so values within a few hex points of an existing token reuse that token instead of minting a near-duplicate.
- Traced new icons (Heart, Outlet, Wifi, Checkmark, all four tab icons) from those crops with `potrace` — real vector paths from the actual artwork, not hand-drawn or substituted from an icon-font library.
- Added `expo-linear-gradient` for the card's bottom scrim — a standard precompiled Expo module, unlike `react-native-maps` it doesn't force a native build.
- Consolidated tokens the two sources disagreed on: `background`/`authBackground` merged (both were the same `#f1eae7` PDF tone once auth screens and Home/Cafe-detail agreed), and the two-greens `amenityOutlet`/`amenityWifi`/`amenityNeutral` collapsed to one `amenityTile` amber shared by all three tiles.

## Risks / Trade-offs

- [Risk] Photo-heavy lists can jank on scroll → Mitigation: windowed `FlatList`/`FlashList` rendering + `expo-image` caching.
- [Risk] Optimistic favourite toggle can briefly show the wrong state if the write fails → Mitigation: TanStack Query's rollback-on-error restores the prior state automatically.

## Migration Plan

1. Add the `cafes_nearby` SQL RPC function (migration).
2. Build the Home feed: location permission request → RPC call (or fallback query) → card list.
3. Build the Cafe detail screen and route.
4. Add the shared favourites query/mutation and wire the heart icon into cards and detail.
5. Add the guest-prompt path for unauthenticated favourite attempts.

## Open Questions

Superseded now that Home and Cafe detail are built from the PDF rather than the Figma Styleguide page (the questions below were specific to that Figma frame and no longer apply — the PDF draws one unambiguous version of each):

- ~~Home (70:2397) and Home_1 (81:2460) draw two cafe-card treatments. Which is current?~~ Moot — the PDF's card treatment (photo-fills-card with overlay scrim) is what shipped.
- What does Home's "···" dots icon open? Still open — nothing in either source says. Default unchanged: the Filters sheet, mirroring Search's explicit filter button.
- ~~Are the cafe detail screen's two amenity greens deliberate or drift?~~ Moot — the PDF uses one amber tone for all three tiles.
- The detail screen's Location area: the PDF shows a real map (street name, dropped pin), which the app can't embed live (see the `react-native-maps` decision above) — it opens the device's Maps app instead. Revisit once the toolchain issue is fixed upstream.
