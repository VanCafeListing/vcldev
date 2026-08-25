## Why

`bootstrap-app-foundation` scaffolds the Home, Search, and Profile tabs as placeholders and `user-auth` gets users into the app, but nothing yet reads real cafe data. The Home feed, cafe detail, and search are the app's core value — a user can't find a work-friendly cafe until these exist.

## What Changes

- Implement the Home feed: "Hi, {name}! Cafes near you" header, a geo-sorted list of cafe cards (photo, name, address, distance), using the device's location and the `cafes` table's PostGIS column.
- Implement the Cafe detail screen: a single hero photo (the mockup shows one full-bleed image, not a gallery), name, address, distance badge, About description, amenity badges (Outlets and Wi-Fi each with a verified checkmark, plus a seat-count tile without one) reflecting the cafe's real structured data, and a location map with a pin.
- Implement the Search tab. **Mockup gap**: no distinct Search screen was drawn, only the bottom-nav icon. Default: reuse the Home feed's card-list component with a text search bar filtering cafes by name, per the project's recorded default for undesigned screens.
- Wire the inline favourite (heart) toggle on both cafe cards and the detail screen: tapping it creates/removes a row in the existing `favourites` table. (The dedicated Favourites *list* screen, reached from the Profile menu shortcut — favourites is not a bottom-nav tab; that slot is the Map — is a separate `favourites` change — bundling just the toggle here avoids shipping a visibly non-functional heart icon on these two screens.)

**Explicitly not in this change**: the Filters screen/logic (separate `cafe-filters` change — the mockup's Filters screen has a close icon and "Apply" button, reading as a modal opened from Home/Search rather than a tab's own content), the Favourites list screen (`favourites` change), and any cafe-creation/editing UI (cafes are seed/admin-provisioned per the project's MVP scope rule).

## Capabilities

### New Capabilities
- `cafe-discovery`: the Home feed, Search tab, Cafe detail screen, and the favourite-toggle interaction on both.

### Modified Capabilities
None. This change reads/writes against the `cafes` and `favourites` tables and RLS policies `data-model` already defines; it doesn't change that contract.

## Impact

- New screens: real implementations of `app/(tabs)/index.tsx` (Home), `app/(tabs)/search.tsx`, and a new `app/cafe/[id].tsx` detail route.
- Requires device location permission (for distance sorting/display) — first real use of a native permission in the app.
- Depends on `bootstrap-app-foundation`'s `cafes`/`favourites` schema and `design-system` primitives (Card, AmenityBadge), and on `user-auth` for the authenticated/guest user context (favouriting requires a session; guests can browse but not favourite — see design.md).
