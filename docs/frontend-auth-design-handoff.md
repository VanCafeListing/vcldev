# Frontend Auth Design Handoff

## Purpose

This document lists the authentication designs that VanCafe needs beyond the original app mockup. These states support real Supabase behavior and complete user journeys.

Designers should add these screens and component states to the VanCafe Figma file. Product and engineering should approve the marked decisions before implementation.

## Priority 0: Email confirmation

VanCafe will keep Supabase **Confirm email** enabled. A new email-and-password account must verify its email before it receives an authenticated session.

### 1. Check your email screen

**Entry:** The user submits a valid Sign Up form and Supabase accepts the request.

Design the following content and states:

- A clear “Check your email” heading.
- The submitted email address.
- Instructions to open the verification link.
- An “Open email app” action when the platform supports it.
- A “Resend email” action.
- A “Change email” action that returns to Sign Up with the other fields preserved.
- A “Back to log in” action.
- Initial, sending, sent, cooldown, offline, and request-failed states for resend.
- Guidance to check the spam folder.

Do not imply that the user is signed in before verification succeeds.

### 2. Email verification result

**Entry:** The app opens from the verification link.

Design these outcomes:

- **Success:** Confirm the address and continue into the main app.
- **Expired link:** Explain that the link expired and offer a new email.
- **Invalid or already-used link:** Offer resend and return-to-login actions.
- **Offline:** Keep the link recoverable and offer retry.
- **Unexpected failure:** Show a safe error and offer retry or support.

The success state may be a short transition screen. It must not leave the user on a blank loading view.

### 3. Existing-email signup response

**Product decision required:** Decide whether signup may disclose that an account already exists.

The safer default is a non-enumerating response. It shows the same result whether the address is new or already registered. The alternative is a visible “Email already in use” error.

Design the selected response. Do not design both as equally valid production outcomes.

## Priority 0: Password recovery

The app already implements these routes, but the original source mockup does not define their final visual design.

### 4. Forgot password request

Design these states:

- Empty form.
- Invalid email validation.
- Submitting.
- Generic sent confirmation.
- Offline or server failure.

The sent confirmation must use the same message for registered and unknown addresses. This prevents account discovery.

### 5. Set a new password

**Entry:** The app opens from a valid recovery link.

Design these states:

- New password and confirmation fields.
- Password visibility controls.
- Password requirements.
- Password mismatch validation.
- Saving.
- Save failure.
- Password updated successfully.
- Expired, invalid, or already-used recovery link.

The invalid-link state needs “Request another link” and “Back to log in” actions.

## Priority 0: Social authentication

VanCafe supports Google and Facebook through a browser handoff. It supports Apple through the native iOS prompt.

### 6. Provider button states

Design each Apple, Google, and Facebook action with these states:

- Default.
- Pressed.
- Loading.
- Disabled while another provider is active.
- Provider cancelled.
- Provider unavailable.
- Network failure.
- Provider configuration failure.
- Generic unexpected failure.

A user cancellation should not look like an account error. Apple should appear only where the platform and release policy require it.

### 7. Provider return outcomes

**Entry:** The app returns from Google or Facebook, or the Apple prompt closes.

Design these outcomes:

- First sign-in creates the account and enters the app.
- Returning sign-in enters the existing account.
- The provider returns no usable email.
- The provider email matches an existing account with another sign-in method.
- The provider denies access.
- The callback is invalid or expired.
- The browser closes before completion.

**Product decision required:** Define the account-linking experience when the same verified email already uses another sign-in method.

## Priority 1: Account email changes

The Profile editor can submit a new authentication email. Supabase may require confirmation before the account email changes.

### 8. Pending email change

Design these states:

- Explain that the current email remains active until confirmation completes.
- Show the pending new email.
- Resend the confirmation email.
- Cancel or replace the pending change, if product supports it.
- Confirm the change after the app opens from the link.
- Handle an expired or invalid change link.
- Handle an email that another account already uses.

The Profile screen should distinguish the active email from a pending email.

## Priority 1: Session and security states

### 9. Session expired

Design a session-expired message that routes the user to Log In. Preserve unsaved input when practical.

### 10. Recent authentication required

Design a reauthentication prompt for sensitive actions such as changing an email, changing a password, or deleting an account. Include cancel, failure, and success states.

### 11. Account deleted or disabled

Design the next launch after account deletion or administrative disablement. The app must clear the session and explain why it returned to the authentication flow.

## Shared component states

Every authentication design should specify:

- Initial, focused, filled, disabled, and error input states.
- Password shown and password hidden states.
- Button default, pressed, disabled, and loading states.
- Inline validation and form-level error placement.
- Offline and retry presentation.
- Screen-reader labels and logical focus order.
- Keyboard-open layouts for small iOS and Android screens.
- Light-theme colors, spacing, typography, and icon references from the current design system.

## Required Figma handoff

For each flow, provide:

1. One frame for every state listed above.
2. A connected prototype for the success, cancel, retry, and expired-link paths.
3. Final user-facing copy. Do not leave placeholder error text.
4. Component variants for loading, disabled, error, and success states.
5. Notes that identify the backend event that opens each state.
6. iOS and Android differences where native behavior changes the flow.

## Engineering follow-up

After Figma approval, engineering must update the `user-auth` OpenSpec change before implementation. The update must replace the current immediate-entry signup requirement with the confirmed-email flow.
