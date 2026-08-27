## 1. Map Setup

- [x] 1.1 Confirm `react-native-maps` is installed and configured from `cafe-discovery`; add an Android Google Maps API key to `app.json` if not already present
- [x] 1.2 Verify the map renders on both iOS (Apple Maps) and Android (Google Maps) before wiring data

## 2. Map Tab

- [x] 2.1 Build `app/(tabs)/map.tsx`: full-screen map replacing the placeholder from `bootstrap-app-foundation`
- [x] 2.2 Fetch cafes via the existing filter-aware query helper, reading criteria from `cafe-filters`' `FiltersProvider`
- [x] 2.3 Request/read location permission (reusing `cafe-discovery`'s pattern); centre on the user when granted, else fall back to a default region
- [x] 2.4 Render a `Marker` per cafe at its stored coordinate

## 3. Pin Interaction

- [x] 3.1 Add a callout to each marker showing the cafe's name
- [x] 3.2 Wire callout tap to navigate to the existing `app/cafe/[id].tsx` detail route
- [x] 3.3 Add the "no cafes match the current filters" state

## 4. Verification

- [x] 4.1 Map tab renders with a pin for every seeded cafe
- [x] 4.2 With location permission granted, the map opens centred on the user's position
- [x] 4.3 With location permission denied, the map still renders pins and is usable on a default region
- [x] 4.4 Tapping a pin shows the cafe's name; tapping the callout opens that cafe's detail screen
- [x] 4.5 Applying filters (e.g. Free Wi-Fi + Outlets) reduces the plotted pins to matching cafes only, consistent with the Home feed under the same filters
- [x] 4.6 A filter combination matching no cafes shows the no-match state rather than a blank/broken map
