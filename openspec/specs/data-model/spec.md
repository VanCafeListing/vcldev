# data-model Specification

## Purpose
Defines the persisted entities and access rules — profiles, cafes, favourites, and cafe photo storage — that every feature capability (auth, discovery, filters, favourites, profile settings) reads and writes, including the isolation guarantees between users' data.

## Requirements

### Requirement: A profile exists for every authenticated user
A profile record SHALL exist for every authenticated user, keyed to their auth identity, with their name and email populated.

#### Scenario: Profile created on sign-up
- **WHEN** a new user completes sign-up, whether by email/password or an OAuth provider (Apple, Google, Facebook)
- **THEN** a corresponding profile row SHALL exist with their name and email populated

### Requirement: Users can only access their own profile
Row-level security SHALL restrict profile reads and writes to the owning user.

#### Scenario: Reading another user's profile is denied
- **WHEN** a user attempts to read or update a profile row that is not their own
- **THEN** the request SHALL be denied

### Requirement: Cafes expose structured, filterable attributes
Cafe records SHALL expose structured, queryable fields for every filter shown in the mockup (Wi-Fi, Outlets, seating tags, atmosphere tags, price range, commuter-friendly/parking) rather than relying on free-text description alone.

#### Scenario: Combined filter query
- **WHEN** a query filters cafes by "Free Wi-Fi" AND "Outlets" AND a price range
- **THEN** only cafes whose structured fields satisfy all three conditions SHALL be returned

### Requirement: Cafes support proximity queries
Cafe records SHALL store a geographic coordinate enabling "nearest" sorting and radius queries.

#### Scenario: Sort by distance
- **WHEN** a query requests cafes sorted by distance from a given coordinate
- **THEN** results SHALL be ordered nearest-first using each cafe's stored coordinate

### Requirement: Favourites are private per user
A user SHALL be able to mark or unmark a cafe as a favourite, and SHALL only ever see their own favourites.

#### Scenario: Favouriting a cafe
- **WHEN** an authenticated user favourites a cafe
- **THEN** a favourites record linking their user id and that cafe SHALL be created, it SHALL appear in their own favourites list, and it SHALL NOT appear in any other user's favourites list

### Requirement: Cafe photos are publicly readable but restricted-write
Cafe photos SHALL be stored in a dedicated Storage bucket that is publicly readable but not publicly writable.

#### Scenario: Reading a cafe photo requires no auth
- **WHEN** the app requests a cafe's photo URL
- **THEN** it SHALL be retrievable without authentication

#### Scenario: Unauthorized upload is denied
- **WHEN** a client without the required authorization attempts to upload or overwrite a cafe photo
- **THEN** the write SHALL be denied

### Requirement: Account deletion cascades cleanly
Deleting an account SHALL remove all rows owned by that user (profile, favourites) without leaving orphaned references or affecting other users' data.

#### Scenario: User deletes their account
- **WHEN** a user deletes their account
- **THEN** their profile row and all their favourites rows SHALL be removed, and no other user's data SHALL be affected
