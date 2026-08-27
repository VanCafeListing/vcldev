## 1. Backend

- [x] 1.1 Migration: `recent_searches` (id, user_id → `auth.users` on delete cascade, query text, updated_at, unique on `(user_id, query)`) with RLS restricting select/insert/update/delete to the owning user
- [x] 1.2 Migration: add nullable `recommended_rank integer` to `cafes` (null = not recommended, lower sorts first)
- [x] 1.3 Seed `recommended_rank` on a couple of cafes so the Recommendation section is exercisable

Note: the first migration (`20260826193942_cafe_search.sql`) used the wrong column/table shape (`recommended_order`, no `unique(user_id, query)`). Rather than editing an already-applied migration, `20260826194050_cafe_search_v2.sql` drops and recreates with the shape above, matching this file. The first migration is kept as a historical record.

## 2. Data Layer

- [x] 2.1 `getRecentSearches(userId, limit)` ordered by `updated_at` descending
- [x] 2.2 `recordSearch(userId, query)` as an upsert that bumps `updated_at` on an existing term rather than inserting a duplicate; must not block rendering results if it fails
- [x] 2.3 `getRecommendedCafes()` — cafes with a non-null `recommended_rank`, ordered by it
- [x] 2.4 Extend the existing filter-aware cafe query so search results honour active `cafe-filters` criteria

## 3. Search Screen

- [x] 3.1 Build `app/(tabs)/search.tsx` per Figma 75:2474: "Tailored to your needs" heading, "Search" label, text input with the search icon
- [x] 3.2 Add the `mage:filter` button (46x48) beside the input, opening the Filters sheet; export the icon from Figma into `design/icons/` rather than substituting a glyph
- [x] 3.3 Recent-search chips: render from `getRecentSearches`, tap re-runs the query; hidden entirely for guests
- [x] 3.4 "Recommendation" section rendering cafe cards from `getRecommendedCafes`, reusing `cafe-discovery`'s card
- [x] 3.5 Query behaviour: debounce input, show results in place of the recent/recommendation content while a query is active, restore it when cleared
- [x] 3.6 No-results state
- [x] 3.7 Record the query on submit for authenticated users only

## 4. Verification

- [x] 4.1 Entering a query shows matching cafes; clearing it restores recent searches and recommendations
- [x] 4.2 A query matching nothing shows the no-results message
- [x] 4.3 Submitting a query adds it to the chips; searching the same term again does not duplicate it and moves it to the front
- [x] 4.4 Recent searches survive force-quitting and relaunching the app (verified via Expo Go relaunch)
- [x] 4.5 A second account sees none of the first account's recent searches (verified via RLS policy inspection: select/insert/update/delete all scoped to `auth.uid() = user_id`, RLS enabled — see `20260826194050_cafe_search_v2.sql`; not re-verified live against a second signed-up account)
- [x] 4.6 A guest can search, sees no recent-searches section, and writes no history rows (verified live: guest search for "Kits" returns results, no "Recent searches" section renders, `recordSearch` is gated on `session && !isGuest`)
- [x] 4.7 Recommendation section lists the seeded cafes in rank order; tapping one opens its detail screen (verified live: Tealips Cafe listed first, tap opens Cafe detail)
- [x] 4.8 With filters applied, search results include only cafes matching both the query and the filters (verified live: "Coffee" + Quiet atmosphere → 0 results)
- [x] 4.9 The screen matches Figma 75:2474 side by side — heading, input, filter button, chips, section headings
