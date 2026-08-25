## Why

`cafe-discovery` lets an authenticated user toggle a cafe as a favourite, but there's still no way to see the accumulated list — the Profile menu's "♥ Favourites" button has no destination. Without this change, favouriting is a write with no corresponding read.

## What Changes

- Implement the Favourites list screen: the authenticated user's favourited cafes, rendered with the same card-list component `cafe-discovery` built for Home/Search.
- **Correction from earlier planning**: Favourites is NOT a bottom-nav tab. The mockup's third tab is a Map (a location pin on a folded map), and the only entry point to favourites is the "♥ Favourites" button in the Profile menu. This screen is therefore pushed from Profile, not mounted as a tab.
- Unfavouriting from this screen (tapping the heart) removes the cafe from the list immediately, using the same shared favourites cache `cafe-discovery` already introduced — no new toggle logic.
- Empty state when the user has no favourites yet.
- Guest state: since guests can't create favourites (per `cafe-discovery`'s spec), the screen shows a sign-in/sign-up prompt for guests rather than a blank or broken list. (In practice guests reach it only if the Profile menu is reachable in guest mode; the prompt guarantees correct behavior either way.)
- Tapping a favourited cafe navigates to its existing detail screen (`cafe-discovery`'s route).

**Note**: wiring the Profile menu's "♥ Favourites" button to this screen belongs to `profile-settings`, which builds that menu. This change provides the destination; `profile-settings` provides the link.

## Capabilities

### New Capabilities
- `favourites`: the Favourites list screen — its content, empty state, and guest state.

### Modified Capabilities
None. This change only adds a new read view over data `cafe-discovery` already writes (the `favourites` table via the shared toggle mutation/cache); it doesn't change any existing capability's contract.

## Impact

- New screen: `app/favourites.tsx` (a stack route outside `(tabs)`, pushed from the Profile tab).
- Depends on `cafe-discovery`'s card-list component, cafe detail route, and shared `['favourites', userId]` query/mutation, and on `user-auth` for session/guest state.
