## Why

`bootstrap-app-foundation` scaffolds the Home, Search, and Profile tabs as placeholders and `user-auth` gets users into the app, but nothing yet reads real cafe data. The Home feed, cafe detail, and search are the app's core value — a user can't find a work-friendly cafe until these exist.

## What Changes

- Implement the Home feed from Figma (70:2397): a "Find a cafe" heading, a "Cafes near you" row with the overflow icon that opens Filters, and geo-sorted cafe cards. Each card is a brown surface whose photo fills the top and whose footer carries the name, a location pin + "address · distance", and the heart toggle in off-white.
- Implement the Cafe detail screen from Figma (73:2412): a full-width hero photo, name + heart, pin + "address · distance", a "Description:" block, three amenity tiles (Outlet and Wifi on their own green backgrounds, plus a seat-count tile — no verified checkmarks), and a Location map. Figma shows the map as a grey "Link to map" placeholder; build the real map there.
- Wire the inline favourite (heart) toggle on both cafe cards and the detail screen: tapping it creates/removes a row in the existing `favourites` table. (The dedicated Favourites *list* screen, reached from the Profile menu shortcut — favourites is not a bottom-nav tab; that slot is the Map — is a separate `favourites` change — bundling just the toggle here avoids shipping a visibly non-functional heart icon on these two screens.)

**Explicitly not in this change**: the Search screen (separate `cafe-search` change — the Figma frame turned out to be a designed screen with its own history and recommendation sections, too substantial to ride along here), the Filters screen/logic (separate `cafe-filters` change — the mockup's Filters screen has a close icon and "Apply" button, reading as a modal opened from Home/Search rather than a tab's own content), the Favourites list screen (`favourites` change), and any cafe-creation/editing UI (cafes are seed/admin-provisioned per the project's MVP scope rule).

## Capabilities

### New Capabilities
- `cafe-discovery`: the Home feed, the Cafe detail screen, and the favourite-toggle interaction on both.

### Modified Capabilities
None. This change reads/writes against the `cafes` and `favourites` tables and RLS policies `data-model` already defines; it doesn't change that contract.

## Impact

- New screens: a real implementation of `app/(tabs)/index.tsx` (Home) and a new `app/cafe/[id].tsx` detail route.
- Requires device location permission (for distance sorting/display) — first real use of a native permission in the app.
- Depends on `bootstrap-app-foundation`'s `cafes`/`favourites` schema and `design-system` primitives (Card, AmenityBadge), and on `user-auth` for the authenticated/guest user context (favouriting requires a session; guests can browse but not favourite — see design.md).
