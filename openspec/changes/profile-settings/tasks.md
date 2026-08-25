## 1. Backend

- [ ] 1.1 Migration: confirm/add `ON DELETE CASCADE` on the `profiles` → `auth.users` FK and the `favourites` → `profiles`/`auth.users` FK
- [ ] 1.2 Write the `delete-account` Edge Function: verify caller JWT, derive `userId` from `auth.uid()` (never from a client parameter), call `supabase.auth.admin.deleteUser(userId)` with the service-role key
- [ ] 1.3 Deploy the Edge Function to the `vancafe-listing` project
- [ ] 1.4 Migration: add `avatar_url` to `profiles`
- [ ] 1.5 Create the `avatars` Storage bucket: public read, writes restricted to the owning user via a path-prefixed RLS policy

## 2. Profile Tab Hub

- [ ] 2.1 Build `app/(tabs)/profile.tsx`: name/email header, "❤ Favourites" shortcut, and the five rows (Notification, Privacy Policy, Terms of Use, Log Out, Delete Account)
- [ ] 2.2 Wire the header (avatar/username) tap to open the Profile-edit screen
- [ ] 2.3 Wire the Favourites shortcut to the `favourites` screen

## 3. Profile Editing

- [ ] 3.1 Build `app/profile/edit.tsx` as a modal (✕ + "Profile" title): avatar + dark "Edit" button, Name field, Email field, full-width dark Save button
- [ ] 3.2 Install `expo-image-picker`; wire the "Edit" button to pick an image, upload it to `avatars/{user_id}/…`, and save the URL to `profiles.avatar_url`
- [ ] 3.3 Save: update `profiles` (name, email); if email changed, also call `supabase.auth.updateUser({ email })`
- [ ] 3.4 Confirm "Secure email change" confirmation is disabled in Supabase Auth settings

## 4. Log Out & Delete Account

- [ ] 4.1 Build the Log Out confirmation dialog; Cancel dismisses, Logout calls `user-auth`'s existing sign-out
- [ ] 4.2 Build the Delete Account confirmation dialog; Cancel dismisses, Delete calls the `delete-account` Edge Function
- [ ] 4.3 On successful deletion: clear local session state and route to the Splash screen

## 5. Placeholder Screens

- [ ] 5.1 Build `app/profile/notifications.tsx`, `app/profile/privacy.tsx`, `app/profile/terms.tsx`: title + "Content coming soon" body, each with back navigation
- [ ] 5.2 Wire the corresponding Profile-tab rows to these routes

## 6. Verification

- [ ] 6.1 Editing name and Save reflects the change on the Profile tab
- [ ] 6.2 Editing email and Save updates both `profiles.email` and the Auth sign-in email (verify by signing out and back in with the new email)
- [ ] 6.3 Log Out: Cancel keeps the session active; Logout ends it and routes to Splash
- [ ] 6.4 Delete Account: Cancel deletes nothing; Delete removes the Auth user, `profiles` row, and all `favourites` rows, ends the session, and routes to Splash
- [ ] 6.5 Attempting to call the Edge Function for a different user id than the caller's own JWT is rejected (deletion is always self-only)
- [ ] 6.6 Each of the three placeholder rows navigates to its titled screen and back
- [ ] 6.7 Uploading a new avatar updates it on both the Profile-edit screen and the Profile hub
- [ ] 6.8 A client cannot write an avatar under another user's id prefix (storage policy rejects it)
