# favourites Specification

## Purpose
Defines what an authenticated user sees on the Favourites screen (reached from the Profile menu), and what an unauthenticated guest sees there instead.

## Requirements

### Requirement: Favourites screen lists the user's favourited cafes
The Favourites screen SHALL show every cafe the authenticated user has favourited, using the same card presentation (photo, name, address, distance) as the Home feed.

#### Scenario: Viewing favourites
- **WHEN** an authenticated user with at least one favourited cafe opens the Favourites screen
- **THEN** every cafe they've favourited SHALL appear in the list, each showing its photo, name, address, and distance

#### Scenario: Empty favourites
- **WHEN** an authenticated user with no favourited cafes opens the Favourites screen
- **THEN** the screen SHALL show a message indicating they have no favourites yet, not a blank or broken list

### Requirement: Unfavouriting from this screen removes the cafe immediately
Tapping the heart icon on a card in the Favourites list SHALL remove that cafe from the list right away.

#### Scenario: Unfavouriting from the list
- **WHEN** a user taps the heart icon on a cafe card within the Favourites screen
- **THEN** that cafe SHALL be removed from their favourites and disappear from the list without requiring a manual refresh

### Requirement: Tapping a favourited cafe opens its detail screen
Tapping a card in the Favourites list SHALL navigate to that cafe's detail screen.

#### Scenario: Opening a favourited cafe
- **WHEN** a user taps a cafe card in the Favourites screen
- **THEN** they SHALL be taken to that cafe's detail screen

### Requirement: Guests see a sign-in prompt instead of a list
A guest (no active session) opening the Favourites screen SHALL see a prompt to sign in or sign up, not an empty or broken favourites list.

#### Scenario: Guest opens the Favourites screen
- **WHEN** a guest opens the Favourites screen
- **THEN** they SHALL see a prompt to sign in or sign up, and no favourites query SHALL be attempted
