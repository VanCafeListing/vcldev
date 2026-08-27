## Context

`cafe-discovery` already introduced the `['favourites', userId]` TanStack Query cache (currently just favourited cafe *ids*) and the card-list component. This change is mostly composition: a new screen over existing data and components. See proposal.md for motivation and specs/favourites/spec.md for the behavior contract.

## Goals / Non-Goals

**Goals:**
- Reuse `cafe-discovery`'s components and cache rather than duplicating list-rendering or favourite-toggle logic.
- Correct guest handling: no failed query, just a prompt.

**Non-Goals:**
- Sorting/filtering the Favourites list (the mockup shows a plain list; no filter/sort controls here) — filters remain scoped to Home/Search per `cafe-filters`.

## Decisions

**Fetch full cafe records for favourited ids via a dedicated `getFavouritedCafes(userId)` query, not by joining onto the existing id-only cache in the UI layer.**
`cafe-discovery`'s `['favourites', userId]` cache stores favourited cafe *ids* (enough for heart-icon state). The Favourites screen needs full card data (photo, name, address, distance). Decision: a new query function does a single Postgrest query joining `favourites` → `cafes` for the current user, returned as its own `['favourites', userId, 'full']` cache entry — kept in sync with the id-only cache by invalidating both on the same toggle mutation. Alternative considered: fetch cafes client-side per id from the id list — an N+1 pattern, rejected.

**Guest state checked before querying, not as an error-state fallback.**
The screen checks session/guest state (same source `cafe-discovery`'s guest-prompt uses) before calling `getFavouritedCafes` at all, so no request is attempted for guests — matches the spec's explicit "no favourites query SHALL be attempted" requirement.

## Risks / Trade-offs

- [Risk] Two related cache entries (id-only and full) could drift if only one is invalidated on toggle → Mitigation: the toggle mutation (already built in `cafe-discovery`) invalidates both keys together.

## Implementation Notes

**Screen built from `cafe-discovery`'s existing card-list conventions, not the wider Figma board's Favourites frame.** The proposal called for building from the Figma board's dedicated Favourites screen rather than defaulting to "reuse Home's list." The Figma MCP's `get_metadata` call against that board (node 1:2) failed with a response-parsing error (oversized/corrupted SSE payload) rather than returning usable data. Given `openspec/config.yaml` already treats board 1:2 as "history/reference, not spec, unless the user says otherwise," and design.md's own Goals already commit to reusing `cafe-discovery`'s card and list-rendering rather than duplicating it, the screen was built with the same header/list/empty-state/guest-prompt structure as the already-shipped Search screen. Revisit if the Figma board becomes fetchable and shows a materially different layout.

## Migration Plan

1. Add `getFavouritedCafes(userId)` query function and its cache key.
2. Build the Favourites screen as a stack route (pushed from Profile, not a tab): guest check → prompt, or full list with empty state.
3. Wire card taps to the existing detail route and heart-icon taps to the existing toggle mutation.
