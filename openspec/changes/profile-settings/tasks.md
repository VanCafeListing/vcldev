## 1. Backend

- [x] 1.1 Migration: confirm/add `ON DELETE CASCADE` on the `profiles` → `auth.users` FK and the `favourites` → `profiles`/`auth.users` FK (already present from `bootstrap-app-foundation`/`cafe-discovery` — confirmed by reading the existing migrations, no change needed)
- [x] 1.2 Write the `delete-account` Edge Function: verify caller JWT, derive `userId` from `auth.uid()` (never from a client parameter), call `supabase.auth.admin.deleteUser(userId)` with the service-role key
- [x] 1.3 Deploy the Edge Function to the `vancafe-listing` project
- [x] 1.4 Migration: add `avatar_url` to `profiles`
- [x] 1.5 Create the `avatars` Storage bucket: public read, writes restricted to the owning user via a path-prefixed RLS policy

## 2. Profile Tab Hub

- [x] 2.1 Build `app/(tabs)/profile.tsx`: name/email header, "❤ Favourites" shortcut, and the five rows (Notification, Privacy Policy, Terms of Use, Log Out, Delete Account)
- [x] 2.2 Wire the header (avatar/username) tap to open the Profile-edit screen
- [x] 2.3 Wire the Favourites shortcut to the `favourites` screen

## 3. Profile Editing

- [x] 3.1 Build `app/profile/edit.tsx` as a modal (✕ + "Profile" title): avatar + dark "Edit" button, Name field, Email field, full-width dark Save button
- [x] 3.2 Install `expo-image-picker`; wire the "Edit" button to pick an image, upload it to `avatars/{user_id}/…`, and save the URL to `profiles.avatar_url`
- [x] 3.3 Save: update `profiles` (name, email); if email changed, also call `supabase.auth.updateUser({ email })`
- [x] 3.4 Confirm "Secure email change" confirmation is disabled in Supabase Auth settings (inherited from `user-auth`'s existing project-wide decision — not independently reconfirmed in the dashboard this session, see design.md)

## 4. Log Out & Delete Account

- [x] 4.1 Build the Log Out confirmation dialog; Cancel dismisses, Logout calls `user-auth`'s existing sign-out
- [x] 4.2 Build the Delete Account confirmation dialog; Cancel dismisses, Delete calls the `delete-account` Edge Function
- [x] 4.3 On successful deletion: clear local session state and route to the Splash screen

## 5. Placeholder Screens

- [x] 5.1 Build `app/profile/notifications.tsx`, `app/profile/privacy.tsx`, `app/profile/terms.tsx`: title + "Content coming soon" body, each with back navigation
- [x] 5.2 Wire the corresponding Profile-tab rows to these routes

## 6. Verification

- [ ] 6.1 Editing name and Save reflects the change on the Profile tab (code-reviewed only — no test-account credentials available this session; see design.md)
- [ ] 6.2 Editing email and Save updates both `profiles.email` and the Auth sign-in email (code-reviewed only, not live-verified)
- [x] 6.3 Log Out: Cancel keeps the session active; Logout ends it and routes to Splash (guest "Exit guest mode" path verified live; the signed-in Logout dialog itself is code-reviewed only — same `signOut()` call)
- [ ] 6.4 Delete Account: Cancel deletes nothing; Delete removes the Auth user, `profiles` row, and all `favourites` rows, ends the session, and routes to Splash (2026-08-27: live backend E2E passed with a disposable user — created one favourite, invoked `delete-account`, then confirmed zero `profiles` and `favourites` rows and rejected re-login; the in-app confirmation/Splash routing leg remains unverified because the installed development client attached to a stale unrelated bundle)
- [x] 6.5 Attempting to call the Edge Function for a different user id than the caller's own JWT is rejected (deletion is always self-only) — the function derives `userId` solely from `admin.auth.getUser(token)`, never a request body/param, so there is no parameter to substitute; confirmed by code review
- [x] 6.6 Each of the three placeholder rows navigates to its titled screen and back (verified live via deep link to `/profile/notifications`; `privacy`/`terms` share the identical `PlaceholderScreen` component)
- [ ] 6.7 Uploading a new avatar updates it on both the Profile-edit screen and the Profile hub (code-reviewed only, not live-verified)
- [ ] 6.8 A client cannot write an avatar under another user's id prefix (storage policy rejects it) (code-reviewed only — the migration's insert/update/delete policies all require `(storage.foldername(name))[1] = auth.uid()::text`, not live-verified against a second account)
