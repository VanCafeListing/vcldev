# cafe-filters Specification

## Purpose
Defines the Filters screen's criteria and how applying or clearing them narrows the cafe lists on the Home and Search screens.

## Requirements

### Requirement: Filters screen exposes all mockup criteria
The Filters screen SHALL let the user select any combination of: Commuter Friendly, Easy Parking, Free Wi-Fi, Outlets, a price range with independently adjustable lower and upper bounds, seating tags (Spacious, Wide Tables, Patio Seating), and atmosphere tags (Quiet, Lively), plus a "Nearest" location toggle.

#### Scenario: Opening Filters shows current selections
- **WHEN** a user opens the Filters screen
- **THEN** every previously selected criterion from the current app session SHALL appear selected, and unselected criteria SHALL appear unselected

### Requirement: Applying filters narrows the active list
Confirming "Apply" SHALL update the currently viewed list (Home or Search) to show only cafes matching every selected criterion.

#### Scenario: Apply narrows the Home feed
- **WHEN** a user selects "Free Wi-Fi" and "Outlets" and taps "Apply" from the Home feed
- **THEN** the Home feed SHALL show only cafes with both Wi-Fi and outlets, still sorted nearest-first (or unsorted, per the existing location-permission fallback)

#### Scenario: Apply narrows Search results
- **WHEN** a user has an active text query on the Search tab, narrows both ends of the price range and selects "Quiet" atmosphere, and taps "Apply"
- **THEN** the Search results SHALL show only cafes matching the text query and whose price falls within both the lower and upper bounds and whose atmosphere is quiet

#### Scenario: No cafes match the combined filters
- **WHEN** applied filters match no cafes
- **THEN** the list SHALL show a message indicating no cafes match the current filters, not an empty or broken list

### Requirement: Clear all resets every selection
"Clear all" SHALL deselect every criterion on the Filters screen without requiring "Apply" to take effect on the screen's own state.

#### Scenario: Clearing filters
- **WHEN** a user taps "Clear all" on the Filters screen
- **THEN** every previously selected criterion SHALL become unselected

### Requirement: Active filters are visibly indicated
Whenever one or more filters are applied to the active list, the entry point that opens the Filters screen SHALL show a visible indicator that filters are active.

#### Scenario: Indicator appears after applying filters
- **WHEN** a user applies at least one filter and returns to the Home feed or Search tab
- **THEN** the icon/control that opens the Filters screen SHALL show a visible indicator (e.g. a badge) that filters are active

#### Scenario: Indicator disappears after clearing
- **WHEN** a user clears all filters (via "Clear all" and Apply, or by unselecting every criterion and applying)
- **THEN** the indicator SHALL no longer be shown

### Requirement: Filter selections do not persist across app restarts
Filter selections SHALL reset to none the next time the app is launched.

#### Scenario: Restarting the app clears filters
- **WHEN** a user applies filters, then fully closes and relaunches the app
- **THEN** the Home feed and Search tab SHALL show unfiltered results again
