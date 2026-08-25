## 1. Supabase Auth Configuration

- [ ] 1.1 Disable "Confirm email" in the `vancafe-listing` project's Auth settings
- [ ] 1.2 Register the `vancafelisting://` redirect URL in Auth settings for OAuth
- [ ] 1.3 Migration: `handle_new_user()` trigger function + `AFTER INSERT ON auth.users` trigger that creates the matching `profiles` row

## 2. Design System Extensions

- [ ] 2.1 Extend the `TextInput` primitive with a trailing-icon slot
- [ ] 2.2 Add password visibility toggle (eye icon) behavior to password fields using the trailing-icon slot

## 3. Log In Screen (new — mirrors Sign Up)

- [ ] 3.1 Build `app/(auth)/login.tsx`: email + password fields, "Log in" primary button, social divider + buttons, link to Sign Up
- [ ] 3.2 Client-side validation: required fields, email format

## 4. Sign Up Screen (real implementation)

- [ ] 4.1 Wire the existing Sign Up placeholder to real fields: first/last name, email, password, confirm password, ToS checkbox
- [ ] 4.2 Client-side validation: required fields, matching passwords, ToS checkbox required to submit, email format
- [ ] 4.3 Call `supabase.auth.signUp()` on submit; on success, route to the main tab shell
- [ ] 4.4 Defensive fallback: idempotent upsert into `profiles` on first authenticated app launch, in case the trigger didn't fire

## 5. Social Sign-In

- [ ] 5.1 Install and configure `expo-apple-authentication`; wire native Sign in with Apple on both Sign Up and Log In, exchanging the identity token via `supabase.auth.signInWithIdToken()`
- [ ] 5.2 Wire Google sign-in via `supabase.auth.signInWithOAuth()` + `expo-web-browser` on both screens
- [ ] 5.3 Wire Facebook sign-in via `supabase.auth.signInWithOAuth()` + `expo-web-browser` on both screens
- [ ] 5.4 Handle the OAuth redirect back into the app via the `vancafelisting://` scheme and complete the session

## 6. Sign-Out & Errors

- [ ] 6.1 Replace the Profile tab's placeholder "Log out" action with a real `supabase.auth.signOut()` call
- [ ] 6.2 Create `lib/authErrors.ts` mapping Supabase Auth error codes to user-facing copy, collapsing invalid-credentials/unknown-email into one generic message
- [ ] 6.3 Surface mapped errors on both Sign Up and Log In without losing entered form data; handle network failures the same way

## 7. Verification

- [ ] 7.1 Sign up with email/password: account + `profiles` row created, immediately routed to the main tab shell (no email-confirmation step)
- [ ] 7.2 Sign up with a duplicate email: rejected with a visible error, no new account created
- [ ] 7.3 Log in with correct and with incorrect credentials: correct succeeds and routes to the main tab shell; incorrect shows a generic error and creates no session
- [ ] 7.4 Toggle password visibility on both password fields without losing entered text
- [ ] 7.5 Sign out from the Profile tab: session ends, user is routed back to the Splash screen and cannot reach the main tab shell without re-authenticating or choosing guest
- [ ] 7.6 For each OAuth provider once its credentials are configured in Supabase: first-time sign-in creates an account + profile; returning sign-in re-authenticates the same account
