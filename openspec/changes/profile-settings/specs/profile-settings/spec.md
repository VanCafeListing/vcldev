## Purpose

Defines the account menu hub, profile editing, and the log-out/delete-account flows reachable from the Profile tab.

## ADDED Requirements

### Requirement: Profile tab shows the account hub
The Profile tab SHALL show the authenticated user's name and email, a "Favourites" shortcut, and rows for Notification, Privacy Policy, Terms of Use, Log Out, and Delete Account.

#### Scenario: Viewing the Profile tab
- **WHEN** an authenticated user opens the Profile tab
- **THEN** their current name and email SHALL be displayed, along with the Favourites shortcut and the five listed rows

#### Scenario: Favourites shortcut navigates to the Favourites screen
- **WHEN** a user taps the "Favourites" shortcut on the Profile tab
- **THEN** they SHALL be taken to the Favourites screen

### Requirement: Profile editing updates name and email
A user SHALL be able to edit their name and email from the Profile-edit screen, and Save SHALL persist both.

#### Scenario: Saving a name change
- **WHEN** a user changes their name on the Profile-edit screen and taps Save
- **THEN** their `profiles` row SHALL reflect the new name, and the Profile tab SHALL show it afterward

#### Scenario: Saving an email change
- **WHEN** a user changes their email on the Profile-edit screen and taps Save
- **THEN** both their `profiles` row and their Auth sign-in email SHALL reflect the new address

### Requirement: Users can set a profile photo
A user SHALL be able to replace their profile photo from the Profile-edit screen, and the new photo SHALL appear wherever their avatar is displayed.

#### Scenario: Uploading a new avatar
- **WHEN** a user taps "Edit" beneath their avatar, selects an image, and it finishes uploading
- **THEN** their profile SHALL reference the new image, and their avatar SHALL show it on both the Profile-edit screen and the Profile hub

#### Scenario: Users cannot overwrite another user's avatar
- **WHEN** a client attempts to write an avatar image belonging to a different user
- **THEN** the write SHALL be denied

### Requirement: Log Out requires confirmation
Tapping "Log Out" SHALL show a confirmation dialog before ending the session.

#### Scenario: Confirming log-out
- **WHEN** a user taps "Log Out" and then confirms "Logout" in the dialog
- **THEN** their session SHALL end and they SHALL be routed to the Splash screen

#### Scenario: Cancelling log-out
- **WHEN** a user taps "Log Out" and then taps "Cancel" in the dialog
- **THEN** their session SHALL remain active and they SHALL stay on the Profile tab

### Requirement: Delete Account requires confirmation and removes all owned data
Tapping "Delete Account" SHALL show a confirmation dialog; confirming SHALL permanently delete the user's account, profile, and favourites, then sign them out.

#### Scenario: Confirming account deletion
- **WHEN** a user taps "Delete Account" and then confirms "Delete" in the dialog
- **THEN** their Auth account, `profiles` row, and all their `favourites` rows SHALL be permanently deleted, their local session SHALL end, and they SHALL be routed to the Splash screen

#### Scenario: Cancelling account deletion
- **WHEN** a user taps "Delete Account" and then taps "Cancel" in the dialog
- **THEN** no data SHALL be deleted and they SHALL stay on the Profile tab

### Requirement: Notification, Privacy Policy, and Terms of Use rows are navigable
Each of the Notification, Privacy Policy, and Terms of Use rows SHALL navigate to its own screen when tapped.

#### Scenario: Opening a placeholder row
- **WHEN** a user taps the Notification, Privacy Policy, or Terms of Use row
- **THEN** they SHALL be taken to a screen titled accordingly, and SHALL be able to navigate back to the Profile tab
