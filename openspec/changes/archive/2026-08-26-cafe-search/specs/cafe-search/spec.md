## Purpose

Defines the Search screen — finding a cafe by name, the recent-search history that persists between sessions, and the curated recommendations shown before any query is entered.

## ADDED Requirements

### Requirement: Search finds cafes by name
The Search screen SHALL let a user filter cafes by a text query matched against cafe names.

#### Scenario: Query returns matching cafes
- **WHEN** a user enters a query on the Search screen
- **THEN** the screen SHALL show only cafes whose name matches that query, presented as cafe cards

#### Scenario: Query matches nothing
- **WHEN** a query matches no cafes
- **THEN** the screen SHALL show a message saying no cafes were found, not a blank or broken list

#### Scenario: Clearing the query restores the default content
- **WHEN** a user clears the query
- **THEN** the screen SHALL return to showing recent searches and recommendations

### Requirement: Recent searches persist and are re-runnable
A user's recent searches SHALL be shown as chips on the Search screen, SHALL survive restarting the app, and SHALL be private to that user.

#### Scenario: Submitting a query records it
- **WHEN** an authenticated user submits a search query
- **THEN** that query SHALL be recorded as one of their recent searches, without creating a duplicate entry if they have searched it before

#### Scenario: Tapping a recent search re-runs it
- **WHEN** a user taps one of their recent-search chips
- **THEN** that query SHALL be applied and its matching cafes shown

#### Scenario: Recent searches survive a restart
- **WHEN** an authenticated user searches, fully closes the app, and reopens the Search screen
- **THEN** their earlier searches SHALL still be listed

#### Scenario: Recent searches are private
- **WHEN** a user's recent searches are read
- **THEN** only their own SHALL be returned, and no other user SHALL be able to read or modify them

### Requirement: Guests can search without a history
A guest with no session SHALL be able to search, and SHALL NOT be shown a recent-search history.

#### Scenario: Guest searches
- **WHEN** a guest enters a query
- **THEN** matching cafes SHALL be shown, no recent-search record SHALL be written, and the recent-searches section SHALL be omitted

### Requirement: Recommended cafes are shown before a query
The Search screen SHALL show a Recommendation list of cafes when no query is active.

#### Scenario: Viewing recommendations
- **WHEN** a user opens the Search screen with no query entered
- **THEN** the cafes marked as recommended SHALL be listed, in their curated order

#### Scenario: Opening a recommended cafe
- **WHEN** a user taps a recommended cafe
- **THEN** they SHALL be taken to that cafe's detail screen

### Requirement: Search respects active filters
WHEN filters are applied, search results SHALL only include cafes matching them.

#### Scenario: Filters narrow search results
- **WHEN** a user has applied filters and then searches
- **THEN** the results SHALL include only cafes matching both the query and every applied filter criterion
