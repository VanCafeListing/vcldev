## Context

`bootstrap-app-foundation` provides the `cafes` table (with a `geography(Point,4326)` column and GIST index) and `favourites` table with RLS, plus TanStack Query already wired at the app root. `user-auth` provides real sessions and guest mode. This change is the first to actually query and mutate that data. See proposal.md for motivation and specs/cafe-discovery/spec.md for the behavior contract.

## Goals / Non-Goals

**Goals:**
- Real, distance-sorted cafe browsing backed by the PostGIS column, with a graceful fallback when location permission is denied.
- Consistent favourite state across every screen that shows a heart icon, via a single shared cache.
- Cafe photo loading that stays smooth in a scrollable list.

**Non-Goals:**
- The Filters modal and applying structured filters (Wi-Fi, price range, etc.) — separate `cafe-filters` change.
- The dedicated Favourites list screen — separate `favourites` change; this change only implements the toggle.
- Any cafe-creation/editing tooling — cafes remain seed/admin-provisioned only, per the project's MVP scope rule.

## Decisions

**Distance sorting via a Postgres RPC function, not client-side Haversine.**
A `cafes_nearby(user_lat, user_lng)` SQL function uses the existing GIST-indexed geography column (`ORDER BY location <-> point(...)`) and returns each cafe plus a computed `distance_meters`, called via `supabase.rpc('cafes_nearby', {...})`. This uses the index bootstrap already set up rather than fetching every cafe and computing distance in the client, which doesn't scale and duplicates logic per screen.

**Location denied → fall back to an unsorted (name-ordered) query, not a blocked screen.**
Uses `expo-location`'s foreground permission request. If denied, the Home feed calls a plain `select` ordered by name instead of the RPC function, and simply omits per-card distance — matches the spec's "still load and be usable" requirement without inventing an error/retry UI the mockup doesn't show.

**Search via Postgrest `.ilike()` on the cafe name, debounced 300ms client-side.**
Sufficient for MVP-scale cafe counts (seed/admin-provisioned, not user-generated at volume) and needs no new schema. Alternative considered: Postgres full-text search (`tsvector`) — more powerful but unwarranted complexity for name-only matching at this scale; revisit if search needs to expand beyond name.

**Favourite state: one shared TanStack Query cache key (`['favourites', userId]`) driving every heart icon.**
Toggling a favourite from any screen invalidates this single query, so the Home feed, Search results, and Cafe detail all re-derive the same state — satisfying the spec's cross-screen consistency requirement without each screen tracking its own copy. The toggle mutation is optimistic (flips the icon immediately) and reverts on failure.

**Guest favourite attempt: an in-place prompt (Sign Up / Log In / Cancel), not an automatic redirect.**
Tapping a heart icon while a guest shows a lightweight prompt with those three actions rather than yanking the user away from what they're browsing. Guest status is read from the same session/guest state `app-shell` already tracks.

**Cafe photos: `expo-image` (not core `Image`) for disk caching in the scrollable list.**
The Home feed and Search results are photo-heavy scrolling lists; `expo-image`'s caching keeps scroll performance acceptable. Photo URLs come from the `cafe-photos` Storage bucket bootstrap already provisioned (public read).

**Map: `react-native-maps` for the Cafe detail pin.**
Mature, well-supported in Expo, matches the mockup's static pinned-location view (no interactive routing/directions needed for MVP).

## Risks / Trade-offs

- [Risk] Photo-heavy lists can jank on scroll → Mitigation: windowed `FlatList`/`FlashList` rendering + `expo-image` caching.
- [Risk] Optimistic favourite toggle can briefly show the wrong state if the write fails → Mitigation: TanStack Query's rollback-on-error restores the prior state automatically.
- [Risk] `ILIKE` search doesn't handle typos/fuzzy matching → Mitigation: acceptable at MVP cafe-count scale; revisit only if it becomes a real usability complaint.

## Migration Plan

1. Add the `cafes_nearby` SQL RPC function (migration).
2. Build the Home feed: location permission request → RPC call (or fallback query) → card list.
3. Build the Cafe detail screen and route.
4. Build the Search tab reusing the card-list component with a debounced `.ilike()` query.
5. Add the shared favourites query/mutation and wire the heart icon into cards and detail.
6. Add the guest-prompt path for unauthenticated favourite attempts.
