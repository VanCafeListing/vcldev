## Why

The mockup's bottom navigation has four tabs, and the third — drawn consistently in all four screens that show the nav bar — is a map icon (a location pin on a folded map). No Map screen was ever designed, so `bootstrap-app-foundation` scaffolds that tab as a placeholder. Leaving it empty ships a visibly broken quarter of the app's primary navigation. Since the whole product is about finding a nearby cafe to work from, a map of those cafes is also the most natural thing that tab could be.

## What Changes

- Implement the Map tab: a full-screen map centred on the user's location, with every cafe plotted as a pin.
- Tapping a pin surfaces that cafe (name + minimal detail) and provides a route into the existing Cafe detail screen from `cafe-discovery`.
- Respect the same location-permission fallback `cafe-discovery` established: if permission is denied, the map still renders with cafes plotted, just not centred on the user.
- Apply the active filter criteria from `cafe-filters` so the map and the Home/Search lists stay consistent about which cafes are "in play".

**Approved deviation**: no Map screen exists in the source design, so this screen's layout is invented rather than matched. The user explicitly chose building a real cafe map over shipping a placeholder tab. Its chrome reuses existing design-system primitives, and the map itself reuses the same `react-native-maps` setup `cafe-discovery` already introduces for the Cafe detail screen's Location section, so the visual vocabulary stays consistent with the drawn screens.

## Capabilities

### New Capabilities
- `cafe-map`: the Map tab — plotting cafes as pins, pin interaction, and its relationship to location permission and active filters.

### Modified Capabilities
None. This change reads the same `cafes` data and filter criteria that `data-model` and `cafe-filters` already define, and routes into `cafe-discovery`'s existing detail screen; it doesn't change any existing contract.

## Impact

- New screen: real implementation of `app/(tabs)/map.tsx` (a placeholder from `bootstrap-app-foundation`).
- Depends on `cafe-discovery` (the `react-native-maps` dependency, the cafe query helpers, and the detail route) and on `cafe-filters` (the `FiltersProvider` criteria).
- Should be implemented after `cafe-discovery` and `cafe-filters`, since it composes both.
