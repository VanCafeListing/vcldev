## 1. Backend

- [ ] 1.1 Migration: `recent_searches` (id, user_id → `auth.users` on delete cascade, query text, updated_at, unique on `(user_id, query)`) with RLS restricting select/insert/update/delete to the owning user
- [ ] 1.2 Migration: add nullable `recommended_rank integer` to `cafes` (null = not recommended, lower sorts first)
- [ ] 1.3 Seed `recommended_rank` on a couple of cafes so the Recommendation section is exercisable

## 2. Data Layer

- [ ] 2.1 `getRecentSearches(userId, limit)` ordered by `updated_at` descending
- [ ] 2.2 `recordSearch(userId, query)` as an upsert that bumps `updated_at` on an existing term rather than inserting a duplicate; must not block rendering results if it fails
- [ ] 2.3 `getRecommendedCafes()` — cafes with a non-null `recommended_rank`, ordered by it
- [ ] 2.4 Extend the existing filter-aware cafe query so search results honour active `cafe-filters` criteria

## 3. Search Screen

- [ ] 3.1 Build `app/(tabs)/search.tsx` per Figma 75:2474: "Tailored to your needs" heading, "Search" label, text input with the search icon
- [ ] 3.2 Add the `mage:filter` button (46x48) beside the input, opening the Filters sheet; export the icon from Figma into `design/icons/` rather than substituting a glyph
- [ ] 3.3 Recent-search chips: render from `getRecentSearches`, tap re-runs the query; hidden entirely for guests
- [ ] 3.4 "Recommendation" section rendering cafe cards from `getRecommendedCafes`, reusing `cafe-discovery`'s card
- [ ] 3.5 Query behaviour: debounce input, show results in place of the recent/recommendation content while a query is active, restore it when cleared
- [ ] 3.6 No-results state
- [ ] 3.7 Record the query on submit for authenticated users only

## 4. Verification

- [ ] 4.1 Entering a query shows matching cafes; clearing it restores recent searches and recommendations
- [ ] 4.2 A query matching nothing shows the no-results message
- [ ] 4.3 Submitting a query adds it to the chips; searching the same term again does not duplicate it and moves it to the front
- [ ] 4.4 Recent searches survive force-quitting and relaunching the app
- [ ] 4.5 A second account sees none of the first account's recent searches (verify the RLS policy, not just the UI)
- [ ] 4.6 A guest can search, sees no recent-searches section, and writes no history rows
- [ ] 4.7 Recommendation section lists the seeded cafes in rank order; tapping one opens its detail screen
- [ ] 4.8 With filters applied, search results include only cafes matching both the query and the filters
- [ ] 4.9 The screen matches Figma 75:2474 side by side — heading, input, filter button, chips, section headings
