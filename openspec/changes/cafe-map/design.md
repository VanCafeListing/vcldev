## Context

`cafe-discovery` already installs `react-native-maps` (for the Cafe detail Location section), owns the cafe query helpers, and established the location-permission fallback pattern. `cafe-filters` owns the `FiltersProvider` criteria that Home and Search read. This change composes all three into the Map tab. See proposal.md for motivation and specs/cafe-map/spec.md for the behavior contract.

## Goals / Non-Goals

**Goals:**
- A map view consistent with the rest of the app about which cafes are "in play" (same filters) and how it handles missing location permission.
- A clear path from pin → cafe detail, reusing the existing detail route.

**Non-Goals:**
- Turn-by-turn directions, routing, or "navigate here" hand-off to Apple/Google Maps — nothing in the design suggests it, and it's outside the MVP.
- Search-as-you-pan / "search this area" behavior — cafes are a small, seed-provisioned set, so the map can plot them all.
- Clustering — see Decisions; deliberately deferred.
- A distinct map-styled theme — the map renders with platform defaults; the design provides no map styling to match beyond the Cafe detail screen's plain grey map.

## Decisions

**Plot all cafes at once, no viewport-bounded querying and no clustering.**
Cafes are admin/seed-provisioned (per the project's MVP scope rule), so the total count is small — a single fetch of all matching cafes is simpler and avoids refetch-on-pan complexity. Clustering libraries (`react-native-map-clustering`) add a dependency and tuning burden that only pays off at pin densities this dataset won't reach. Revisit both if the cafe count ever grows past a few hundred.

**Reuse `cafe-filters`' `FiltersProvider` rather than giving the map its own filter state.**
The provider already wraps the `(tabs)` layout, so the Map tab can read the same criteria Home and Search use. This keeps the three surfaces consistent for free and means the existing filter-trigger and active-filter badge work unchanged. Note this makes `cafe-map` depend on `cafe-filters` being implemented first.

**Pin tap → native callout showing the cafe name → tap callout to open detail.**
`react-native-maps`' built-in `Marker` callout is the least-invented option and satisfies the spec's "pin identifies its cafe" requirement without designing a custom bottom sheet that has no basis in the mockup. Alternative considered: a custom draggable bottom sheet previewing the cafe card — more polished, but it's inventing UI, and the MVP rule says don't.

**Reuse the filter-aware query helper rather than adding a map-specific RPC.**
The map needs the same rows the Home feed already fetches, minus the ordering concern. It calls the existing filter-aware helper (`cafes_nearby` when a coordinate is available, otherwise the plain fallback query) — no new backend surface.

## Risks / Trade-offs

- [Risk] This screen has no source design, so it may not match the user's mental picture → Mitigation: it's built entirely from existing primitives and the platform map, so a redesign is a re-layout rather than a rebuild; flagged as an approved deviation in the proposal.
- [Risk] Plotting all cafes without clustering degrades if the dataset grows well beyond MVP scale → Mitigation: acceptable and explicitly bounded by the seed-provisioned cafe model; revisit thresholds noted above.
- [Risk] `react-native-maps` needs platform API keys (Google Maps on Android) that aren't required for the simple detail-screen map on iOS → Mitigation: call this out during implementation; iOS uses Apple Maps with no key, Android needs a Google Maps API key in `app.json`.

## Migration Plan

1. Confirm `react-native-maps` config (including an Android Google Maps API key) is in place from `cafe-discovery`.
2. Build the Map tab reading cafes via the existing filter-aware query helper.
3. Wire location permission (reusing `cafe-discovery`'s pattern) for initial centring, with the default-region fallback.
4. Add markers with name callouts and wire callout taps to the existing cafe detail route.
5. Add the no-cafes-match state.
