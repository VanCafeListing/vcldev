## Context

`user-auth` already provides sign-out and session state; `data-model` already requires that account deletion cascades cleanly but doesn't specify the mechanism. This change is the first to touch account deletion (a genuinely destructive, security-sensitive operation) and to change a user's Auth-level email, so it needs real technical decisions rather than pure UI composition. See proposal.md for motivation and specs/profile-settings/spec.md for the behavior contract.

## Goals / Non-Goals

**Goals:**
- Account deletion that actually removes the Auth user (not just app-table rows), correctly, from a single user action.
- Email changes that keep `profiles.email` and the Auth sign-in email consistent, without introducing a verification screen the mockup doesn't have.

**Non-Goals:**
- Real content for Notification settings, Privacy Policy, or Terms of Use — placeholder screens only (see proposal's mockup-gap default).
- Avatar cropping/editing UI — the picker's own built-in crop is sufficient; no custom editor is drawn.
- Any re-authentication step before Delete Account beyond the confirmation dialog already in the mockup (e.g. re-entering a password) — not shown in the mockup, not added.

## Decisions

**Account deletion via a Supabase Edge Function using the service-role key, not a client-side table delete.**
A client's session (anon/authenticated key) cannot delete its own `auth.users` row — that requires the Auth Admin API, which needs the service-role key and must run server-side. Decision: a `delete-account` Edge Function that verifies the caller's JWT, then calls `supabase.auth.admin.deleteUser(userId)`. Alternative considered: client deletes its own `profiles`/`favourites` rows directly and leaves the `auth.users` row behind — rejected, that's not actually deleting the account (the person could still "exist" for login purposes), and contradicts the data-model spec's intent.

**Cascade via `ON DELETE CASCADE` on the `profiles`/`favourites` foreign keys to `auth.users`, triggered by the Edge Function's single delete call.**
Deleting the `auth.users` row cascades to `profiles` (FK) and from there to `favourites` (FK to `profiles` or directly to the user id) — one delete call, no manual multi-table cleanup in the Edge Function. Decision: add a migration confirming/setting `ON DELETE CASCADE` on both FKs if not already present from `bootstrap-app-foundation`. Alternative considered: the Edge Function manually deletes `favourites`, then `profiles`, then the Auth user — more code, and a partial-failure mid-sequence could leave orphaned rows; the DB-level cascade is atomic with the single delete.

**Avatar upload: `expo-image-picker` → `avatars` Storage bucket, keyed by user id, with the URL stored on `profiles.avatar_url`.**
The mockup draws an "Edit" button under the avatar but no picker UI; the user confirmed upload is in scope. Objects are stored at a path prefixed by the owner's user id (e.g. `avatars/{user_id}/…`) so a storage RLS policy can restrict writes to the owning user while keeping reads public — the same public-read/restricted-write shape `data-model` already defines for `cafe-photos`. Storing the URL on `profiles` (rather than deriving it) keeps the avatar readable in the same query that already loads name/email.

**Email change: call `supabase.auth.updateUser({ email })` directly, with "Secure email change" confirmation disabled.**
Consistent with the earlier `user-auth` decision to disable Supabase's email-confirmation requirement (no such verification screen exists in the mockup), email changes here also apply immediately rather than requiring the user to click a confirmation link sent to the new address. `profiles.email` is updated in the same Save action so the two never drift. Alternative considered: leave Supabase's default secure email change (confirmation link) enabled — rejected, it would need a "check your new email" screen this mockup doesn't have, same reasoning as the sign-up confirmation decision.

**Placeholder screens (Notification/Privacy Policy/Terms of Use): static content, no new tables or settings state.**
Each is a simple screen with a title and "Content coming soon" body — no notification-preference persistence is built, since no actual notification system exists yet (explicitly out of scope per the project's MVP rule). Revisit if/when push notifications are ever scoped in.

## Risks / Trade-offs

- [Risk] Deleting the Auth user is irreversible — a bug in the Edge Function (e.g. wrong user id) could delete the wrong account → Mitigation: the function must derive the user id from the caller's verified JWT (`auth.uid()`), never from a client-supplied parameter.
- [Risk] Disabling secure email-change confirmation means anyone with a logged-in session can redirect the account to an email they don't control, locking the original owner out only if they're also logged out elsewhere → Mitigation: acceptable at MVP scope (same trust boundary as the rest of the session-based app); revisit if this becomes a real abuse vector.
- [Risk] `ON DELETE CASCADE` is powerful — a future accidental delete of an `auth.users` row (e.g. via dashboard) silently wipes that user's data too → Mitigation: expected/intended behavior here, but worth calling out since it's easy to forget once set.

## Implementation Notes

**Colors and icons sourced from the PDF's Profile menu / Profile edit / dialog artboards**, via the same 600dpi-crop-and-sample pipeline used for the rest of the app. All sampled values matched existing tokens exactly (no new tokens needed): row-container background `#F1EAE7` (`colors.background`), Favourites pill background `#FFE1B8` (`colors.amenityTile`), avatar placeholder `#D9D9D9` (`colors.placeholder`), and Edit/Save/Delete/Logout button fill `#3B3B3B` (`colors.neutralAction`'s underlying `neutral.dark`, within rasterization rounding) — confirming the existing "neutral" `Button` variant is exactly right for this screen group. The five row icons (Notification/Privacy/Terms/LogOut/Delete) were traced from the PDF via crop → threshold → `potrace`, the same pipeline as Heart/Wifi/Outlet; source SVGs live in `design/icons/`.

**"Secure email change" confirmation**: not independently reconfirmed in the Supabase Auth dashboard this session — `user-auth` already disabled it project-wide per its own design decision, and this change relies on that being unchanged rather than re-verifying it.

**Live verification was guest-only.** No test-account credentials were available this session (creating a new account is outside what this session can do), so the signed-in hub, Profile-edit save/avatar-upload, and the Log Out/Delete Account dialogs are verified by code review only, not on-device. The guest state (`app/(tabs)/profile.tsx`'s no-session branch, and the `/profile/edit` redirect guard added after a deep-link crash surfaced it) was verified live. Revisit with a real account when credentials are available.

## Migration Plan

1. Migration: add `profiles.avatar_url`; create the `avatars` bucket with public-read/owner-write policies; confirm/add `ON DELETE CASCADE` on `profiles.id → auth.users.id` and `favourites.user_id → auth.users.id` (or `profiles.id`, whichever bootstrap used).
2. Write and deploy the `delete-account` Edge Function.
3. Build the Profile tab hub, wiring the Favourites shortcut and the five rows.
4. Build the Profile-edit screen (Save updates `profiles` + calls `updateUser({ email })` when email changed).
5. Build the Log Out and Delete Account confirmation dialogs, wired to `user-auth`'s sign-out and the new Edge Function respectively.
6. Build the three placeholder screens.
