## Purpose

Makes the app's Privacy Policy and Terms of Use readable in-app as versioned documents, so that the Terms consent the Sign Up screen already requires refers to text the user can actually read before agreeing.

## ADDED Requirements

### Requirement: Privacy Policy is readable in-app
The Privacy Policy screen SHALL render the full policy text in-app, scrollable to its end, without requiring network access or an external browser.

#### Scenario: Opening the Privacy Policy
- **WHEN** a user taps the Privacy Policy row on the Profile tab
- **THEN** the full policy text SHALL be displayed, and SHALL NOT show a "coming soon" or otherwise empty state

#### Scenario: Reading the whole policy
- **WHEN** a user scrolls the Privacy Policy screen to the bottom
- **THEN** the end of the policy text SHALL be reachable and not clipped by the screen edge or any overlaying navigation chrome

#### Scenario: Returning to the Profile tab
- **WHEN** a user navigates back from the Privacy Policy screen
- **THEN** they SHALL return to the Profile tab

### Requirement: Terms of Use is readable in-app
The Terms of Use screen SHALL render the full terms text in-app, scrollable to its end, without requiring network access or an external browser.

#### Scenario: Opening the Terms of Use
- **WHEN** a user taps the Terms of Use row on the Profile tab
- **THEN** the full terms text SHALL be displayed, and SHALL NOT show a "coming soon" or otherwise empty state

#### Scenario: Reading the whole terms
- **WHEN** a user scrolls the Terms of Use screen to the bottom
- **THEN** the end of the terms text SHALL be reachable and not clipped by the screen edge or any overlaying navigation chrome

### Requirement: Legal documents are versioned
Each legal document SHALL declare a version identifier and an effective date, both visible to the user on the document's screen.

#### Scenario: Viewing a document's version
- **WHEN** a user views the Privacy Policy or the Terms of Use
- **THEN** the document's version identifier and effective date SHALL be visible on that screen

### Requirement: Terms consent at sign-up is informed
The Sign Up screen's Terms of Service label SHALL link to the Terms of Use document, so a user can read the terms before accepting them.

#### Scenario: Opening the terms from Sign Up
- **WHEN** a prospective user taps the Terms of Service label on the Sign Up screen
- **THEN** the Terms of Use document SHALL be displayed

#### Scenario: Returning to a part-completed Sign Up form
- **WHEN** a prospective user opens the Terms of Use from Sign Up and then navigates back
- **THEN** they SHALL return to the Sign Up form with the values they had already entered still present

#### Scenario: Consent remains explicit
- **WHEN** a prospective user opens and reads the Terms of Use from the Sign Up screen
- **THEN** the Terms of Service checkbox SHALL NOT become checked as a result, and acceptance SHALL still require an explicit tap

### Requirement: Legal documents are reachable without an account
The legal documents SHALL be reachable by a user who is not signed in.

#### Scenario: Reading the terms before having an account
- **WHEN** a prospective user who has not signed in or signed up opens the Terms of Use from the Sign Up screen
- **THEN** the document SHALL be displayed without requiring authentication
