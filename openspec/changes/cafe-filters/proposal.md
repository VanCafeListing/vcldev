## Why

Work-friendliness filtering (Wi-Fi, outlets, seating, price, atmosphere, parking, commuter-friendliness) is this app's core differentiator, called out explicitly in the mockup's dedicated Filters screen. `cafe-discovery` only supports distance-sort and name search — without this change, the structured amenity data `data-model` already stores can't actually be used to narrow results.

## What Changes

- Implement the Filters sheet from Figma (75:2531): 402x819, white, top corners radius 50; a circled ✕ at the left, "Filters" centred, "Clear all" at the right; section labels at 16pt; chips 48pt tall with radius 10, selected chips filled `#fb8b24` with white text; and a full-width `#42210c` "Apply" button. Sections:
  - **Location**: "Nearest" (reaffirms the existing nearest-first sort — a no-op if already the default), "Commuter Friendly" and "Easy Parking" (real boolean filters on the `cafes` table)
  - **Workspace Essentials**: Free Wi-Fi, Outlets (boolean filters)
  - **Price Range**: a DUAL-THUMB min/max slider (two round thumbs on a shared track), filtering `price_range` between both bounds — not a single upper bound
  - **Seating**: Spacious, Wide Tables, Patio Seating (tag filters)
  - **Atmosphere**: Quiet, Lively (tag filters)
- Wire the entry points. The Search frame draws a real filter button (`mage:filter`, 46x48, beside the search input) — use it as designed. The Home frame draws a `tabler:dots-filled` icon on the "Cafes near you" row; nothing states what it opens, so treating it as the Filters trigger remains an assumption worth confirming with the designers.
- Applying filters narrows the currently viewed list (Home or Search) to cafes matching every selected criterion (AND across categories); "Clear all" resets every selection.
- A visual indicator (e.g. a badge/dot) on the filter trigger shows when one or more filters are active, so "Clear all" has a discoverable state to clear.
- Filter selections persist only for the current app session (in-memory) — not saved across app restarts, since the mockup shows no such persistence.

## Capabilities

### New Capabilities
- `cafe-filters`: the Filters screen, its criteria, and how applying/clearing them narrows the Home and Search lists from `cafe-discovery`.

### Modified Capabilities
None. `cafe-filters` composes with `cafe-discovery`'s existing list surfaces (filtering which cafes appear) without changing what `cafe-discovery` itself guarantees (sort order, card contents, favourite toggling all still hold).

## Impact

- New screen: `app/filters.tsx` (modal/sheet route).
- Modifies the query helpers `cafe-discovery` built (`getNearbyCafes`, `searchCafes`) to accept an optional filter-criteria parameter.
- Depends on `cafe-discovery`'s Home/Search screens and card-list component, and on `data-model`'s structured cafe columns (already defined in `bootstrap-app-foundation`, no schema change needed).
