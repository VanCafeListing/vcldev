# app-shell Specification

## Purpose
Defines the navigational structure and session-aware routing that every screen mounts into — which stack (auth vs. main) a user sees on launch, and how the four main tabs are reached — independent of any single feature's content.

## Requirements

### Requirement: Unauthenticated users land on the auth stack
WHEN the app launches with no active session, the user SHALL see the auth stack starting at the Splash screen, not the main tab shell.

#### Scenario: Cold launch with no session
- **WHEN** the app launches and no active Supabase session exists
- **THEN** the user SHALL see the Splash screen with Sign up / Log in / "Start as a guest" options

### Requirement: Guest access reaches the main tab shell
A user who chooses "Start as a guest" SHALL be routed into the main tab shell without authenticating.

#### Scenario: Guest selects "Start as a guest"
- **WHEN** a user selects "Start as a guest" from the Splash screen
- **THEN** they SHALL be routed to the main tab shell, landing on the Home tab

### Requirement: Authenticated users bypass the auth stack
WHEN the app launches with an active session, the user SHALL be routed directly into the main tab shell.

#### Scenario: Cold launch with an active session
- **WHEN** the app launches and an active Supabase session exists
- **THEN** the user SHALL be routed directly to the main tab shell (Home tab), bypassing the Splash and sign-up/log-in screens

### Requirement: Main tab shell exposes exactly four destinations
The main tab shell SHALL provide a persistent bottom navigation bar with exactly four destinations: Home, Search, Map, Profile, rendered as a full-width bar in the design's tab-bar color with the design's exported icons.

#### Scenario: Switching tabs preserves other tabs' state
- **WHEN** a user is in the main tab shell and selects a different tab
- **THEN** the visible screen SHALL switch to that destination, and the previously active tab's scroll/UI state SHALL be preserved when the user returns to it

### Requirement: Signing out returns to the auth stack
WHEN an authenticated user signs out, they SHALL be routed back to the Splash screen and SHALL NOT be able to reach the main tab shell again without authenticating or choosing guest.

#### Scenario: Authenticated user signs out from Profile
- **WHEN** an authenticated user confirms "Log out" from the Profile screen
- **THEN** their session SHALL end and they SHALL be routed back to the Splash screen
