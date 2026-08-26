## Why

The bottom navigation's third tab is a map, and `bootstrap-app-foundation` scaffolds it as a placeholder. The designers have drawn the map experience on the wider Figma board, so leaving the tab empty ships a visibly broken quarter of the app's primary navigation against a design that already exists.

## What Changes

- Implement the Map tab: a full-screen map centred on the user's location, with every cafe plotted as a pin.
- Tapping a pin surfaces that cafe (name + minimal detail) and provides a route into the existing Cafe detail screen from `cafe-discovery`.
- Respect the same location-permission fallback `cafe-discovery` established: if permission is denied, the map still renders with cafes plotted, just not centred on the user.
- Apply the active filter criteria from `cafe-filters` so the map and the Home/Search lists stay consistent about which cafes are "in play".

**Correction**: an earlier draft of this proposal called the Map screen an invented addition. It is not — the designers drew it on the wider Figma board (node 1:2): a full map with cafe pins, a back + search + filter bar, a "List" bottom sheet of cafe cards, and a selected-pin state. Build from those frames. They sit outside the Styleguide page, so treat them as design intent rather than final pixels, and confirm styling details with the user rather than over-investing in them.

## Capabilities

### New Capabilities
- `cafe-map`: the Map tab — plotting cafes as pins, pin interaction, and its relationship to location permission and active filters.

### Modified Capabilities
None. This change reads the same `cafes` data and filter criteria that `data-model` and `cafe-filters` already define, and routes into `cafe-discovery`'s existing detail screen; it doesn't change any existing contract.

## Impact

- New screen: real implementation of `app/(tabs)/map.tsx` (a placeholder from `bootstrap-app-foundation`).
- Depends on `cafe-discovery` (the `react-native-maps` dependency, the cafe query helpers, and the detail route) and on `cafe-filters` (the `FiltersProvider` criteria).
- Should be implemented after `cafe-discovery` and `cafe-filters`, since it composes both.
