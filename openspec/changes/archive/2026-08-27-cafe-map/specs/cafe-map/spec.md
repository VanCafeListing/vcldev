## Purpose

Defines the Map tab — how cafes are plotted geographically, how a user gets from a pin to a cafe's details, and how the map behaves without location permission or with filters applied.

## ADDED Requirements

### Requirement: Map plots cafes as pins
The Map tab SHALL render a map with a pin at each cafe's stored coordinate.

#### Scenario: Opening the Map tab
- **WHEN** a user opens the Map tab
- **THEN** a map SHALL render with a pin for every cafe currently in play, each positioned at that cafe's stored coordinate

### Requirement: Map centres on the user when location is available
WHEN location permission is granted, the map SHALL open centred on the user's current position.

#### Scenario: Location permission granted
- **WHEN** a user opens the Map tab having granted location permission
- **THEN** the map SHALL be centred on their current position

#### Scenario: Location permission denied
- **WHEN** a user opens the Map tab having denied location permission
- **THEN** the map SHALL still render with cafe pins and remain usable, centred on a default region rather than the user's position

### Requirement: Tapping a pin leads to the cafe's detail screen
A user SHALL be able to get from a cafe's pin to that cafe's detail screen.

#### Scenario: Selecting a cafe from the map
- **WHEN** a user taps a cafe's pin and then taps through the surfaced cafe
- **THEN** they SHALL be taken to that cafe's detail screen

#### Scenario: Pin identifies its cafe
- **WHEN** a user taps a cafe's pin
- **THEN** the cafe's name SHALL be shown, so the user can tell which cafe the pin represents before navigating

### Requirement: Map respects active filters
WHEN filters are applied, the map SHALL plot only cafes matching those filters.

#### Scenario: Filters narrow the plotted pins
- **WHEN** a user has applied filters and opens the Map tab
- **THEN** only cafes matching every applied filter criterion SHALL be plotted

#### Scenario: No cafes match
- **WHEN** applied filters match no cafes
- **THEN** the map SHALL render with no pins and indicate that no cafes match the current filters, rather than appearing broken
