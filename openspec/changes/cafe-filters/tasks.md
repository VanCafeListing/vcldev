## 1. Backend

- [ ] 1.1 Extend the `cafes_nearby` RPC function with optional filter parameters (wifi, outlets, commuter_friendly, parking, min_price, max_price, seating tags, atmosphere tags)
- [ ] 1.2 Verify seed cafe data has enough variation across amenities/price/tags to exercise filtering during verification

## 2. Filter State & Query Layer

- [ ] 2.1 Define the `FilterCriteria` type
- [ ] 2.2 Build the `FilterCriteria → Postgrest filter chain` builder function
- [ ] 2.3 Extend `getNearbyCafes`/`searchCafes` (from `cafe-discovery`) to accept optional `FilterCriteria`
- [ ] 2.4 Build `FiltersProvider` (React Context) holding current criteria + apply/clear actions; wire into the `(tabs)` layout

## 3. Filters Screen

- [ ] 3.1 Build `app/filters.tsx` as a modal/sheet route: ✕ close, "Clear all" link, title
- [ ] 3.2 Location section: Nearest (inert, cosmetic), Commuter Friendly, Easy Parking chips
- [ ] 3.3 Workspace Essentials section: Free Wi-Fi, Outlets chips
- [ ] 3.4 Price Range: DUAL-THUMB min–max range slider, $5–$20 (needs a range-capable slider component; RN core Slider is single-thumb only)
- [ ] 3.5 Seating section: Spacious, Wide Tables, Patio Seating chips
- [ ] 3.6 Atmosphere section: Quiet, Lively chips
- [ ] 3.7 "Apply" button: commits current selections to `FiltersProvider` and closes the modal
- [ ] 3.8 ✕ close: discards in-progress changes, reverting to last-applied state

## 4. Wiring Into Discovery Screens

- [ ] 4.1 Add a filter-trigger icon: repurpose Home's existing "⋯" header icon; add an analogous icon next to the Search tab's search bar
- [ ] 4.2 Add the active-filter dot badge on both trigger icons, driven by whether `FiltersProvider`'s criteria is non-empty
- [ ] 4.3 Wire Home's query call to pass current criteria from `FiltersProvider`
- [ ] 4.4 Wire Search's query call to pass current criteria alongside the text query
- [ ] 4.5 No-results state for "filters matched nothing" (distinct message from the existing "no search results" case, or a shared one — implementer's call, both must be non-blank)

## 5. Verification

- [ ] 5.1 Opening Filters shows the current session's selections correctly reflected
- [ ] 5.2 Applying Wi-Fi + Outlets from Home narrows the list to matching cafes only
- [ ] 5.3 Applying a price range + atmosphere tag from Search narrows results alongside the active text query
- [ ] 5.4 A filter combination matching no cafes shows a non-blank message
- [ ] 5.5 "Clear all" deselects every criterion on the Filters screen itself
- [ ] 5.6 The active-filter badge appears after Apply with ≥1 criterion selected, and disappears once cleared and re-applied
- [ ] 5.7 Closing via ✕ without Apply discards in-progress changes; reopening Filters shows the last-applied state, not the discarded one
- [ ] 5.8 Force-quitting and relaunching the app resets filters to none
