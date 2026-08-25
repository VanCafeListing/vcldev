## Why

`bootstrap-app-foundation` scaffolds the Splash, Sign Up, and Profile screens as placeholders and routes between the auth stack and main tab shell based on "does a session exist," but no screen actually creates, validates, or destroys a session yet. Discovery, filters, and favourites all assume a real authenticated (or guest) user, so real auth needs to land before those can be meaningfully built or tested.

## What Changes

- Implement the Sign Up screen for real: first/last name, email, password + confirm password (with show/hide toggles), and account creation via Supabase Auth (email/password), creating the corresponding `profiles` row.
- Add a required "I agree to the Terms of Service" checkbox gating submission. **Approved deviation**: the mockup draws only the sentence "I agree to the Terms of Service" with a tappable link and no checkbox; the user explicitly approved adding a real gating checkbox for auditable consent.
- Add a Log In screen. **Mockup gap**: no Log In screen was in the source PDF (only Sign Up). Default: mirror the Sign Up screen's styling with just email + password (no name/confirm/ToS fields) and a "Sign in" primary button, per the project's recorded default for this gap.
- Wire social sign-in/sign-up (Apple, Google, Facebook) on both screens via Supabase Auth OAuth, using the `vancafelisting://` redirect scheme already configured in `app.json`.
- Wire the Splash screen's "Sign up" / "Log in" buttons to these real screens (guest routing is already implemented by `app-shell` and is unaffected).
- Implement real sign-out: the Profile tab's placeholder "Log out" action now calls Supabase Auth's sign-out and ends the real session (extends the already-scaffolded routing behavior with the real auth call).
- Basic form validation and error surfacing: required fields, email format, matching passwords, ToS checkbox required to submit, and user-visible errors for invalid credentials / duplicate email / network failure.

**Explicitly not in this change** (mockup has no design for them, or they belong to a later capability): forgot/reset password (no button or screen anywhere in the mockup — excluded per the MVP-as-is rule, not deferred), the Profile menu screen itself, profile editing, and Delete Account (all belong to a future `profile-settings` change).

## Capabilities

### New Capabilities
- `user-auth`: sign up, log in, guest-compatible routing, social OAuth (Apple/Google/Facebook), sign-out, and the form validation/error-handling behavior for all of the above.

### Modified Capabilities
None. `app-shell`'s routing contract (session vs. no session vs. guest) and `data-model`'s profile/RLS requirements already cover the behavior this change implements against — this change fulfills them, it doesn't change them.

## Impact

- New screens: `app/(auth)/login.tsx` (new), real implementations of `app/(auth)/signup.tsx` and the Splash screen's button handlers (previously placeholders from `bootstrap-app-foundation`).
- Supabase Auth configuration: email/password is usable immediately; Apple/Google/Facebook OAuth requires the user to register apps with each provider and enter the resulting client ID/secret into the Supabase Auth dashboard — the app-side code path is provider-agnostic and works once a provider is enabled, but end-to-end OAuth verification is blocked until those credentials exist (see design.md).
- Depends on `bootstrap-app-foundation`'s `app-shell` routing and `data-model` schema (`profiles` table + RLS) already being in place.
