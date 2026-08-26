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

**Map: `react-native-maps` for the Cafe detail pin.**
Mature, well-supported in Expo, matches the mockup's static pinned-location view (no interactive routing/directions needed for MVP).

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

Each has a working default, so none blocks implementation — but they should go to the designers.

- Home (70:2397) and Home_1 (81:2460) draw two cafe-card treatments. Which is current? Default: 70:2397, the frame named plainly "Home".
- What does Home's `tabler:dots-filled` icon open? Nothing in the file says. Default: the Filters sheet, mirroring Search's explicit filter button.
- Are the cafe detail screen's two amenity greens (`#dbf897` Outlet, `#d3efb0` Wifi) deliberate or drift between similar swatches? Default: implement both exactly as drawn.
- The detail screen's Location area is a grey "Link to map" placeholder in Figma. Default: render the real map there, styled to match the Cafe detail surface.
