## Why

The Profile tab is still the placeholder `bootstrap-app-foundation` scaffolded, and `user-auth`'s sign-out call has nowhere real to live yet. This is the last mockup screen group — the account menu hub, profile editing, and account deletion — needed to complete the MVP as scoped.

## What Changes

- Implement the Profile tab as the account menu hub: username/email header, "❤ Favourites" shortcut (links to the `favourites` screen), and a list of Notification / Privacy Policy / Terms of Use / Log Out / Delete Account rows.
- **Mockup gap**: the Profile hub's header (avatar + username) has no explicit affordance drawn for opening the edit screen. Default: tapping the avatar/username header opens the Profile-edit modal, per the project's recorded default for implied-but-undrawn navigation.
- Notification, Privacy Policy, and Terms of Use rows each navigate to their own screen. A push-notification settings screen IS drawn on the wider Figma board, so build Notification from it rather than as a stub. Privacy Policy and Terms of Use have no design and no copy — those two remain minimal placeholder screens until the user supplies content.
- Implement the Profile-edit screen (a modal with ✕ + "Profile" title): avatar with the drawn "Edit" button beneath it, a single Name field, an Email field, and a full-width dark Save button that updates the `profiles` row (and the underlying Supabase Auth email, kept in sync — see design.md).
- Implement avatar/profile-photo upload behind that "Edit" button: pick an image, upload it to a new `avatars` Storage bucket, and store the resulting URL on the `profiles` row. The mockup draws the Edit button but no picker UI; the user confirmed avatar upload is in MVP scope.
- Implement the Log Out confirmation dialog ("Do you want to log-out from this account?" Cancel/Logout) — confirming calls `user-auth`'s existing sign-out.
- Implement the Delete Account confirmation dialog ("Do you want to delete this account?" Cancel/Delete) and the actual deletion: a Supabase Edge Function that deletes the Auth user (cascading to `profiles`/`favourites` per `data-model`'s existing requirement), then signs the client out locally and routes to the Splash screen.

## Capabilities

### New Capabilities
- `profile-settings`: the Profile tab hub, profile editing, the Log Out and Delete Account confirmation flows, and the placeholder Notification/Privacy Policy/Terms of Use screens.

### Modified Capabilities
None. Account deletion fulfills `data-model`'s existing "account deletion cascades cleanly" requirement with a concrete mechanism (Edge Function + FK cascade); it doesn't change what that requirement guarantees. Sign-out reuses `user-auth`'s existing behavior as-is.

## Impact

- New screens: real `app/(tabs)/profile.tsx` (hub), `app/profile/edit.tsx`, `app/profile/notifications.tsx`, `app/profile/privacy.tsx`, `app/profile/terms.tsx` (placeholders).
- New backend: a `delete-account` Supabase Edge Function using the service-role key to call the Auth Admin API (client credentials can't delete their own `auth.users` row directly); plus a new `avatars` Storage bucket with RLS so a user can only write their own avatar.
- Migration: confirm/add `ON DELETE CASCADE` from `profiles`/`favourites` to `auth.users` so the Edge Function's single delete call cascades correctly; add an `avatar_url` column to `profiles`.
- Depends on `user-auth` (sign-out call, session state), `favourites` (the shortcut's destination), and `data-model`'s existing schema.
