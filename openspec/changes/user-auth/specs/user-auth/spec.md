## Purpose

Defines how a user establishes, authenticates, and ends a session — sign up, log in, social OAuth, and sign-out — including the validation and error behavior those flows must guarantee.

## ADDED Requirements

### Requirement: Sign up creates an account and profile
A user SHALL be able to create an account with first name, last name, email, and password, and a corresponding profile record SHALL exist immediately after.

#### Scenario: Successful sign-up
- **WHEN** a user submits the Sign Up form with a unique email, a password matching its confirmation, and the Terms of Service checkbox checked
- **THEN** an account SHALL be created, a `profiles` row SHALL exist with their name and email, and they SHALL be signed in and routed to the main tab shell

#### Scenario: Duplicate email is rejected
- **WHEN** a user submits the Sign Up form with an email that already has an account
- **THEN** no new account SHALL be created and the user SHALL see an error indicating the email is already in use

### Requirement: Sign up requires Terms of Service acceptance
The Sign Up form SHALL NOT be submittable unless the Terms of Service checkbox is checked.

#### Scenario: Submit blocked without ToS acceptance
- **WHEN** a user attempts to submit the Sign Up form with the Terms of Service checkbox unchecked
- **THEN** the submission SHALL be blocked and no account SHALL be created

### Requirement: Sign up requires matching passwords
The Sign Up form SHALL NOT be submittable unless the password and confirm-password fields match.

#### Scenario: Submit blocked on mismatched passwords
- **WHEN** a user enters different values in the password and confirm-password fields and attempts to submit
- **THEN** the submission SHALL be blocked and the user SHALL see an indication that the passwords do not match

### Requirement: Password fields support visibility toggle
Password and confirm-password fields SHALL support toggling between masked and plain-text display.

#### Scenario: Toggling password visibility
- **WHEN** a user taps the show/hide control on a password field
- **THEN** that field's content SHALL switch between masked and plain-text display without clearing the entered value

### Requirement: Log in authenticates an existing account
A user SHALL be able to sign in with the email and password of an existing account.

#### Scenario: Successful log-in
- **WHEN** a user submits the Log In form with the correct email and password of an existing account
- **THEN** they SHALL be signed in and routed to the main tab shell

#### Scenario: Invalid credentials are rejected
- **WHEN** a user submits the Log In form with an email/password combination that does not match an existing account
- **THEN** no session SHALL be created and the user SHALL see an error indicating the credentials are invalid, without revealing whether the email itself exists

### Requirement: Social sign-in authenticates or creates an account
A user SHALL be able to sign up or log in using Apple, Google, or Facebook, from either the Sign Up or Log In screen.

#### Scenario: First-time social sign-in creates an account
- **WHEN** a user completes OAuth with a provider (Apple, Google, or Facebook) for the first time
- **THEN** an account and corresponding `profiles` row SHALL be created using the identity information returned by the provider, and they SHALL be signed in and routed to the main tab shell

#### Scenario: Returning social sign-in authenticates the existing account
- **WHEN** a user completes OAuth with a provider they've previously used to sign in
- **THEN** they SHALL be signed into their existing account, not a new one

### Requirement: Sign-out ends the session
Signing out SHALL end the user's active session immediately.

#### Scenario: User signs out
- **WHEN** an authenticated user confirms "Log out"
- **THEN** their session SHALL be invalidated, and any subsequent request that requires authentication SHALL be rejected until they sign in again

### Requirement: Unexpected errors are surfaced without crashing
A network or unexpected failure during sign-up, log-in, or OAuth SHALL be surfaced to the user as a visible error rather than crashing the app or failing silently.

#### Scenario: Network failure during sign-in
- **WHEN** a sign-up or log-in request fails due to a network or server error
- **THEN** the user SHALL see a visible error message and SHALL remain on the current screen with their entered data intact, able to retry
