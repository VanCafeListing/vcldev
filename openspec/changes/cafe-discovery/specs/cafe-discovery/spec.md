## Purpose

Defines how a user browses, searches, and views work-friendly cafes, and how they mark cafes as favourites from within those browsing surfaces.

## ADDED Requirements

### Requirement: Home feed shows nearby cafes sorted by distance
The Home feed SHALL display a list of cafes sorted nearest-first from the user's current location, each showing a photo, name, address, and distance.

#### Scenario: Cafes load sorted by distance
- **WHEN** a user opens the Home tab with location permission granted
- **THEN** the cafe list SHALL be sorted nearest-first, and each card SHALL show the cafe's photo, name, address, and distance from the user

#### Scenario: Location permission denied
- **WHEN** a user opens the Home tab having denied location permission
- **THEN** the cafe list SHALL still load and be usable (not blocked), without a distance-sorted order or per-card distance value

### Requirement: Cafe detail shows full cafe information
The Cafe detail screen SHALL show the cafe's hero photo, name, address, distance, About description, amenity badges reflecting its real structured data, and a map with its location pinned.

#### Scenario: Opening a cafe's detail
- **WHEN** a user taps a cafe card from the Home feed, Search tab, or Favourites screen
- **THEN** the Cafe detail screen SHALL show that cafe's hero photo, name, address, About text, amenity badges matching its actual stored attributes (Wi-Fi, Outlets, seat count, etc.), and a map pin at its stored coordinate

### Requirement: Search filters cafes by name
The Search tab SHALL let a user filter the cafe list by name using a text query.

#### Scenario: Searching by name
- **WHEN** a user types a query into the Search tab's search bar
- **THEN** the displayed list SHALL update to show only cafes whose name matches the query

#### Scenario: No results
- **WHEN** a search query matches no cafes
- **THEN** the Search tab SHALL show a message indicating no cafes were found, not an empty or broken list

### Requirement: Authenticated users can toggle favourites from discovery screens
An authenticated user SHALL be able to mark or unmark a cafe as a favourite by tapping its heart icon on a cafe card or the Cafe detail screen, and the icon SHALL reflect the current favourite state.

#### Scenario: Favouriting from a card
- **WHEN** an authenticated user taps the heart icon on a cafe card
- **THEN** that cafe SHALL be added to their favourites, and the heart icon SHALL immediately reflect the favourited state

#### Scenario: Unfavouriting from the detail screen
- **WHEN** an authenticated user taps the heart icon on a favourited cafe's detail screen
- **THEN** that cafe SHALL be removed from their favourites, and the heart icon SHALL immediately reflect the unfavourited state

#### Scenario: Favourite state is consistent across screens
- **WHEN** a user favourites a cafe from one screen (e.g. the Home feed) and then views that same cafe on another screen (e.g. its detail screen)
- **THEN** the heart icon SHALL show the same favourited state on both

### Requirement: Guests are prompted to sign in when attempting to favourite
A guest (no active session) who taps a heart icon SHALL be prompted to sign in or sign up rather than the tap silently failing or erroring.

#### Scenario: Guest taps a heart icon
- **WHEN** a guest taps the heart icon on a cafe card or the Cafe detail screen
- **THEN** no favourite SHALL be created, and the user SHALL be prompted to sign in or sign up
