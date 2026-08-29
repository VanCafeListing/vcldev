## Purpose

Lets a signed-in user state which notifications they want to receive, persisted to their account, so that a future delivery mechanism has recorded preferences to honour rather than having to assume consent.

## ADDED Requirements

### Requirement: Users can view and change notification preferences
The Notification screen SHALL present the available notification categories as individual toggles reflecting the signed-in user's current stored preferences.

#### Scenario: Opening the Notification screen
- **WHEN** a signed-in user taps the Notification row on the Profile tab
- **THEN** each notification category SHALL be shown with a toggle set to that user's currently stored preference

#### Scenario: Changing a preference
- **WHEN** a signed-in user changes a notification toggle
- **THEN** the new value SHALL be persisted to their account

#### Scenario: Preferences survive a restart
- **WHEN** a signed-in user changes a preference, closes the app, reopens it, and returns to the Notification screen
- **THEN** the changed value SHALL still be shown

#### Scenario: Preferences are per-account
- **WHEN** a user signs out and a different user signs in on the same device
- **THEN** the Notification screen SHALL show the second user's own preferences, not the first user's

### Requirement: Preference changes report failure honestly
A preference change that fails to persist SHALL NOT be left displayed as though it succeeded.

#### Scenario: Persisting a preference fails
- **WHEN** a signed-in user changes a notification toggle and the change cannot be saved
- **THEN** the user SHALL be informed that the change did not save, and the toggle SHALL reflect the last successfully stored value

### Requirement: Accounts have a defined default preference state
Every account SHALL have a defined value for every notification category, including accounts that existed before this capability.

#### Scenario: An account that predates notification preferences
- **WHEN** a user whose account was created before notification preferences existed opens the Notification screen
- **THEN** each toggle SHALL show the defined default value rather than an empty, indeterminate, or error state

### Requirement: The screen does not imply notifications are being delivered
Because no notification delivery exists yet, the Notification screen SHALL state that preferences are saved for future use and that notifications are not currently sent.

#### Scenario: Setting expectations
- **WHEN** a user views the Notification screen
- **THEN** an explanation SHALL be visible stating that these preferences are stored for future use and that no notifications are sent yet

### Requirement: Notification preferences require an account
Notification preferences SHALL be available only to signed-in users, since they are stored per account.

#### Scenario: A guest opens the Notification screen
- **WHEN** a user browsing as a guest reaches the Notification screen
- **THEN** they SHALL be told that an account is required and SHALL be offered a route to sign in or sign up, rather than being shown toggles that cannot persist
