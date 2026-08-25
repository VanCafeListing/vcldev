## Context

`bootstrap-app-foundation` already provides: the `(auth)`/`(tabs)` route groups with session-aware redirect logic, the `profiles`/`cafes`/`favourites` schema with RLS, the `supabase-js` client wired with an AsyncStorage session adapter, and the `vancafelisting://` deep-link scheme. This change fills in the actual sign-up/log-in/OAuth/sign-out behavior behind the already-scaffolded Splash, Sign Up, and Profile screens. See proposal.md for motivation and specs/user-auth/spec.md for the behavior contract.

## Goals / Non-Goals

**Goals:**
- Working email/password sign-up and log-in, immediately usable without an email-confirmation step (nothing in the mockup shows a "verify your email" screen).
- A Log In screen that visually matches the design system despite not being in the source mockup.
- Social sign-in wired for all three providers at the code level, functional as soon as each provider is enabled in the Supabase dashboard.
- A guaranteed `profiles` row for every account, regardless of which sign-up path created it.

**Non-Goals:**
- Forgot/reset password — no button or screen for it exists anywhere in the mockup; excluded outright, not deferred.
- Profile editing, Delete Account, and the Profile menu screen itself — these belong to a future `profile-settings` change.
- Password strength meters, MFA, or any validation UI beyond what the spec requires (matching passwords, ToS checkbox, email format) — the mockup shows none of this.

## Decisions

**Disable Supabase's default email-confirmation requirement.**
Supabase projects require email confirmation before sign-in by default. The spec (and the mockup) has sign-up immediately land the user in the main tab shell — there's no "check your email" screen. Decision: turn off "Confirm email" in Supabase Auth settings for this project. Alternative considered: keep confirmation on and add a verification-pending screen — rejected, it's a screen/flow not in the mockup and would violate the MVP-as-is rule.

**Profile creation via a Postgres trigger on `auth.users`, not client-side insert.**
A `handle_new_user()` trigger firing `AFTER INSERT ON auth.users` creates the matching `profiles` row server-side. This guarantees a profile exists for every account regardless of path (email/password or any of the three OAuth providers) without duplicating creation logic per sign-up method, and it can't be skipped by a client bug or a dropped network request after sign-up. Alternative considered: client calls `insert` into `profiles` right after a successful `signUp()` — rejected as the primary mechanism because the OAuth redirect flow makes "right after sign-up" ambiguous to hook reliably client-side; kept only as a defensive, idempotent upsert-on-first-launch fallback in case the trigger is ever missing (e.g. local dev reset).

**Apple: native `expo-apple-authentication`, not the generic web OAuth flow.**
Apple App Store Review Guideline 4.8 requires offering native "Sign in with Apple" when other third-party sign-in options (Google, Facebook) are offered on iOS. Decision: use `expo-apple-authentication`'s native button/flow for Apple specifically, then exchange its identity token with Supabase (`signInWithIdToken`); Google and Facebook use Supabase's generic browser-based OAuth (`signInWithOAuth` + `expo-web-browser`'s `openAuthSessionAsync`, completing via the `vancafelisting://` redirect scheme). Alternative considered: run all three providers through the same generic web OAuth flow — rejected, would fail App Store review once Apple's own guideline is checked.

**Password field: extend the existing `TextInput` primitive with a trailing-icon slot, not a separate `PasswordInput` component.**
Keeps the design-system primitive set from `bootstrap-app-foundation` minimal — the mockup's password fields are the same input style plus one icon-driven behavior (visibility toggle), not a visually distinct component.

**Auth error messages: a small local mapping table, not raw Supabase error text.**
Supabase's raw error strings (e.g. "Invalid login credentials") are mapped to our own copy in `lib/authErrors.ts`. This lets invalid-credentials and "email not found" collapse to the same generic message (satisfying the spec's no-enumeration requirement) and keeps message tone consistent with the rest of the app.

**ToS consent: a real gating checkbox, deviating from the mockup.**
The mockup draws only a centred sentence with a "Terms of Service" link and no checkbox, which would mean consent is implied by tapping "Sign up". The user explicitly chose to add a gating checkbox instead, so account creation carries auditable proof of consent. This is the one deliberate UI addition in this change; everything else matches the drawing.

**Password policy: Supabase's default minimum (6 characters), no custom complexity rules.**
The mockup shows no password strength indicator or complexity hint. Adding custom rules would be inventing UI not in the source design.

## Risks / Trade-offs

- [Risk] OAuth cannot be end-to-end verified until the user registers apps with Apple, Google, and Facebook and supplies credentials to Supabase → Mitigation: email/password and the UI/plumbing for all three providers ship regardless; each provider activates independently once configured, no code change needed.
- [Risk] Disabling email confirmation lowers signup friction but means unverified emails can create accounts → Mitigation: acceptable for MVP scope (mockup has no verification flow); revisit if abuse becomes a real problem.
- [Risk] The Log In screen has no source design — a visual mismatch with the user's actual intent is possible → Mitigation: built from the same primitives as Sign Up, so any correction is a straightforward re-layout, not a rebuild.
- [Risk] The `auth.users` trigger runs outside application code (raw SQL) — a bug there is less visible in normal app testing → Mitigation: covered explicitly in tasks' verification step, and the client-side fallback upsert catches a missing-trigger case defensively.

## Migration Plan

1. Configure Supabase Auth: disable email confirmation; register the OAuth redirect URL.
2. Add the `handle_new_user()` trigger migration.
3. Build the Log In screen and wire it plus Sign Up to real Supabase Auth calls.
4. Add the password-visibility toggle to the `TextInput` primitive.
5. Wire Apple (native), Google, and Facebook (generic OAuth) sign-in on both screens.
6. Wire real sign-out on the Profile tab's existing placeholder action.
7. Verify against a live (empty) `vancafe-listing` project; OAuth providers verified as each is configured.
