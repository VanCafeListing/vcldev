## Why

Search was originally folded into `cafe-discovery` on the assumption it was the Home list with a search bar on top. The hi-fi Figma frame (75:2474) shows it is its own screen, with a distinct heading, a labelled input beside a dedicated filter button, a row of recent-search chips, and a Recommendation list. It also needs data — search history and a notion of "recommended" — that no existing spec or migration covers. That is enough substance to own a change rather than ride along inside discovery.

## What Changes

- Implement the Search tab from Figma (75:2474): a "Tailored to your needs" heading, a "Search" label above a text input carrying a search icon, and a separate filter button (`mage:filter`, 46x48) beside the input.
- Show the user's recent searches as tappable chips beneath the input; tapping one re-runs that query. Selected/most-recent chips are filled in the accent colour, the rest are neutral.
- Show a "Recommendation" list of cafe cards, reusing the card component from `cafe-discovery`.
- Run the text query against cafe names, showing results in place of the default recent/recommendation content once a query is active, and an explicit no-results state.
- Persist recent searches per user so they survive a restart, and expose which cafes are recommended. Both need schema (see below); recommendations are curated rather than computed, matching the project's admin/seed-provisioned cafe model.
- The filter button opens the Filters sheet built by `cafe-filters`, and active filters narrow search results the same way they narrow Home.

**Not in this change**: the Filters sheet itself (`cafe-filters`), the cafe cards and detail screen (`cafe-discovery`), and any user-facing way to mark a cafe as recommended — curation happens outside the app, as with cafe records themselves.

## Capabilities

### New Capabilities
- `cafe-search`: the Search screen, its recent-search history, and the recommended-cafes list — including the persisted data both depend on.

### Modified Capabilities
None. The new tables and columns this change needs belong to search itself, so they are specified here rather than as edits to `data-model`, whose profiles/cafes/favourites contract is unchanged.

## Impact

- New screen: real implementation of `app/(tabs)/search.tsx` (a placeholder from `bootstrap-app-foundation`).
- New migration: a `recent_searches` table with RLS restricting rows to their owner, and a nullable recommendation ordering column on `cafes`.
- Depends on `cafe-discovery` (card component, cafe queries, detail route) and `cafe-filters` (the sheet and its criteria).
