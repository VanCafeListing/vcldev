## Context

`cafe-discovery` already provides the Home feed, Search tab, and their query helpers (`getNearbyCafes`, `searchCafes`) against the `cafes` table's structured amenity columns. This change adds the Filters screen and threads filter criteria through those existing queries. See proposal.md for motivation and specs/cafe-filters/spec.md for the behavior contract.

## Goals / Non-Goals

**Goals:**
- A Filters screen matching the mockup's criteria and chrome (✕, Clear all, Apply).
- Filter criteria composed as an AND across categories, applied to whichever list (Home or Search) the user opened Filters from.
- In-session-only filter state — no new persistence layer.

**Non-Goals:**
- Saved filter presets, filter usage analytics, or any alternate sort mode beyond "nearest" (the mockup shows no other sort option) — "Nearest" is treated as intentionally inert (see Decisions) rather than inventing behavior for an unspecified alternate sort.
- Full-text or fuzzy matching on filter criteria — these are exact boolean/range matches on structured columns, same as the underlying data model.

## Decisions

**Filter state: a React Context at the tabs-layout level, not a global store or server-state cache.**
Filter criteria are client-only UI state shared among exactly three screens (Home, Search, the Filters modal) for the current app session. A `FiltersProvider` wrapping the `(tabs)` layout holds the current `FilterCriteria` object and exposes it to both the modal and the list screens. Alternative considered: Zustand — unnecessary weight for state this scoped; TanStack Query — rejected, this is client UI state, not server data, even though it becomes a parameter to server queries.

**Price range: a dual-thumb min–max range slider.**
Verified against the source at high resolution: the mockup draws two identical amber thumbs on the $5–$20 track with an amber fill between them and a grey track beyond — a min/max range, not a single upper bound. Filtering is therefore `price_range >= min AND price_range <= max`. (An earlier draft of this design specified a single-thumb "up to $X" slider; that was a misreading of the source and has been corrected.) Implementation note: React Native's core `Slider` is single-thumb only, so this needs a range-capable component (e.g. `@react-native-community/slider` does NOT support two thumbs — use a library such as `rn-range-slider`, or compose two thumbs over a shared track).

**"Nearest" chip: cosmetic/inert, not a functional sort toggle.**
The mockup shows no alternate sort order anywhere, so there's nothing for deselecting "Nearest" to switch to. It's rendered as a selectable chip (matching the mockup) but has no effect on the query — `cafe-discovery`'s existing nearest-first default (or its no-permission fallback) is unaffected either way. This is called out explicitly so it isn't mistaken for a bug later.

**Filter application: extend `getNearbyCafes`/`searchCafes` with an optional `FilterCriteria` parameter, translated to Postgrest filters.**
Boolean criteria (Wi-Fi, Outlets, Commuter Friendly, Easy Parking, each seating/atmosphere tag) become `.eq(column, true)` calls; price becomes `.gte('price_range', min)` + `.lte('price_range', max)`. All combine with implicit AND via chained Postgrest filters — no new RPC function needed; the existing `cafes_nearby` RPC gains the same optional filter parameters.

**Modal dismissal semantics: only "Apply" commits; "✕" discards in-progress changes.**
Closing via ✕ without tapping Apply reverts the Filters screen's own selections to the last-applied state next time it's opened. "Clear all" updates the Filters screen's own checkboxes immediately (per spec) but — like any other selection change — still requires "Apply" to affect the Home/Search list.

**Active-filter indicator: an unlabeled dot badge on the filter trigger icon.**
Simplest option that satisfies the spec's "visible indicator" requirement; the mockup doesn't show a specific badge design to match, and a count adds complexity (recalculating on every criterion) with no evidence it's wanted.

## Risks / Trade-offs

- [Risk] Chaining many optional Postgrest filters (up to ~8 criteria) could get unwieldy in query-building code → Mitigation: build the filter chain from a single declarative `FilterCriteria → Postgrest builder` function, not ad hoc per-screen logic.
- [Risk] "Nearest" being inert may look like a bug to a future reader → Mitigation: called out explicitly in this design doc and should be a code comment at the point it's rendered as always-effectively-selected.
- [Risk] In-memory-only filter state means switching tabs away from Home mid-session and back keeps filters (Context persists) but an app restart silently drops them → Mitigation: matches the spec's explicit requirement; no user-facing surprise since there's no "saved filters" affordance in the mockup to set an expectation otherwise.

## Migration Plan

1. Add `FilterCriteria` type and the Postgrest filter-building function.
2. Extend `getNearbyCafes`/`searchCafes`/`cafes_nearby` to accept optional criteria.
3. Build `FiltersProvider` and wire it into the `(tabs)` layout.
4. Build the Filters screen UI (all criteria groups, Clear all, Apply, ✕).
5. Add the filter-trigger icon (Home's "⋯", a new Search-bar icon) with the active-indicator badge.
6. Wire Home and Search to read criteria from context and pass them into their queries.
