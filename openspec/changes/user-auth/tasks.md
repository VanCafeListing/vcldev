## 1. Supabase Auth Configuration

- [ ] 1.1 Disable "Confirm email" in the `vancafe-listing` project's Auth settings (dashboard — cannot be done over the MCP)
- [ ] 1.2 Register the `vancafelisting://` redirect URL in Auth settings, for OAuth and for the password-reset link (dashboard)
- [x] 1.3 Migration: `handle_new_user()` trigger function + `AFTER INSERT ON auth.users` trigger that creates the matching `profiles` row

## 2. Usernames

- [x] 2.1 Migration: add `username text not null unique` to `profiles`
- [x] 2.2 Extend `handle_new_user()` to derive the username from the email local-part, appending an incrementing suffix until it is unique
- [x] 2.3 Verify against the live project: two accounts whose emails share a local-part get distinct usernames, and neither insert fails

## 3. Design System Extensions

- [x] 3.1 Extend the `TextInput` primitive with a trailing-icon slot
- [x] 3.2 Extract the eye / eye-off icons from the PDF vector into `design/icons/` and regenerate the icon module
- [x] 3.3 Add password visibility toggle behaviour to password fields using the trailing-icon slot

## 4. Sign Up Screen

- [x] 4.1 Wire the Sign Up placeholder to real fields: first/last name, email, password, confirm password, ToS checkbox
- [x] 4.2 Client-side validation: required fields, email format, matching passwords, ToS checkbox required to submit
- [x] 4.3 Call `supabase.auth.signUp()` passing first/last name as metadata; on success route to the main tab shell
- [x] 4.4 Defensive fallback: idempotent upsert into `profiles` on first authenticated launch, in case the trigger did not fire

## 5. Log In Screen

- [x] 5.1 Build `src/app/(auth)/log-in.tsx`: "Welcome back!" heading, "User Name or Email Address" field, password field with visibility toggle, "Log In" button, "Forgot your password?" link, "Don't have an account? Sign up". No social buttons — the design has none here
- [x] 5.2 Client-side validation: both fields required
- [x] 5.3 Write and deploy a `sign-in` Edge Function: resolve a username to its account with the service role, sign in server-side, return the session; never return an email to the client
- [x] 5.4 Wire the screen to that function and adopt the returned session

## 6. Password Reset

- [x] 6.1 Build the reset-request screen reached from "Forgot your password?": one email field, submit calls `resetPasswordForEmail` with the `vancafelisting://` redirect
- [x] 6.2 Always report success regardless of whether the address has an account
- [x] 6.3 Handle the recovery deep link back into the app and route to a set-new-password screen
- [x] 6.4 Build the set-new-password screen: new password + confirm, calls `updateUser`, then routes into the app

## 7. Social Sign-In (Sign Up screen only)

- [ ] 7.1 Install and configure `expo-apple-authentication`; wire native Sign in with Apple, exchanging the identity token via `supabase.auth.signInWithIdToken()`
- [ ] 7.2 Wire Google sign-in via `supabase.auth.signInWithOAuth()` + `expo-web-browser`
- [ ] 7.3 Wire Facebook sign-in via `supabase.auth.signInWithOAuth()` + `expo-web-browser`
- [ ] 7.4 Handle the OAuth redirect back into the app via the `vancafelisting://` scheme and complete the session

## 8. Sign-Out & Errors

- [x] 8.1 Replace the Profile tab's placeholder "Log out" action with a real `supabase.auth.signOut()` call
- [x] 8.2 Create the auth error map, collapsing invalid-credentials and unknown-email into one generic message
- [x] 8.3 Surface mapped errors on Sign Up, Log In and the reset screens without losing entered form data; handle network failures the same way

## 9. Verification

- [ ] 9.1 Sign up with email/password: account + `profiles` row with a username created, routed straight to the main tab shell (no email-confirmation step)
- [ ] 9.2 Sign up with a duplicate email: rejected with a visible error, no new account created
- [x] 9.3 Log in by email, and by username, both succeed and route to the main tab shell
- [x] 9.4 Log in with wrong credentials: generic error, no session, and no indication of whether the identifier exists
- [x] 9.5 Confirm the client cannot resolve a username to an email through any exposed endpoint
- [x] 9.6 Toggle password visibility on every password field without losing entered text
- [ ] 9.7 Request a password reset for a real address and for an unknown one: the two responses are indistinguishable
- [ ] 9.8 Complete a reset end to end: the new password works and the old one no longer does
- [x] 9.9 Sign out from the Profile tab: session ends, routed back to Splash, main tab shell unreachable without re-authenticating or choosing guest
- [ ] 9.10 For each OAuth provider once configured: first sign-in creates an account + profile with a username; returning sign-in reuses the same account
- [x] 9.11 Compare Sign Up and Log In side by side against their designs
