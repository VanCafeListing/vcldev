## Why

Sign Up gates account creation on an "I agree to the Terms of Service" checkbox, but the Terms of Use screen renders "Content coming soon." Users are being asked to consent to a document the app cannot show them, which is both a legal exposure and a broken promise in the UI. The Privacy Policy screen has the same gap, and both are store-listing prerequisites for Apple and Google.

`profile-settings` shipped these three rows as deliberate placeholders (its task 5.1). This change fills them in.

## What Changes

- **Privacy Policy screen** renders real, scrollable policy content in-app describing what the app actually collects: Supabase-managed account data (email, name, avatar), foreground location used for proximity sorting, favourites, and the third-party processors involved (Supabase, Google Maps/Places, Expo).
- **Terms of Use screen** renders real, scrollable terms content in-app.
- Both documents carry a **version identifier and effective date**, so the consent recorded at sign-up refers to a specific revision rather than to whatever the text happens to say later.
- The Sign Up screen's "Terms of Service" label becomes a **working link** into the Terms of Use screen, so consent is informed rather than blind.
- **Notification screen** becomes a working preferences screen: per-category toggles persisted to the user's profile. No push delivery is built — see Non-goals.
- The shared `PlaceholderScreen` component is no longer used by any route once these three land.

## Non-goals

- **No push-notification delivery.** The project context lists "push-notification backend" as explicitly out of scope. This change stores the user's stated preferences so a future delivery mechanism can honour them, and ships no device-token registration, no `expo-notifications` dependency, and no send path. The screen therefore states plainly that notifications are not yet being sent, rather than implying a capability that does not exist.
- **No legal sign-off.** The drafted content is a good-faith plain-language description of the app's real behaviour, written to be accurate rather than authoritative. It is explicitly not a substitute for review by a qualified lawyer before public launch, and is marked as such in `design.md`.
- **No consent-history table.** Recording which policy version each user accepted, and re-prompting on revision, is a larger change; this one only makes the version legible.

## Capabilities

### New Capabilities

- `legal-documents`: In-app Privacy Policy and Terms of Use — versioned content, rendering, and the Sign Up link that makes ToS consent informed.
- `notification-settings`: User-controlled notification preferences, persisted per account, with no delivery mechanism attached.

### Modified Capabilities

None. `profile-settings` is still an unarchived change, so its requirement "Notification, Privacy Policy, and Terms of Use rows are navigable" is not yet a canonical spec under `openspec/specs/` and cannot take a delta. That requirement stays satisfied — the rows still navigate — and is narrowed rather than contradicted by the new capabilities above. `user-auth`'s "Sign up requires Terms of Service acceptance" is likewise unaffected: the checkbox and its gating behaviour do not change, only the label gains a link.

## Impact

- **Screens**: `src/app/profile/privacy.tsx`, `src/app/profile/terms.tsx`, `src/app/profile/notifications.tsx` (all three currently one-line placeholders); `src/app/(auth)/sign-up.tsx` (ToS label becomes a link).
- **New content module**: the policy/terms text and their version metadata, kept out of the screen components so revisions are a content edit rather than a JSX edit.
- **Database**: one additive migration adding notification-preference columns (or a JSON column) to `profiles`. Existing rows need a sensible default; no destructive change.
- **Components**: `src/components/placeholder-screen.tsx` becomes unused by routes. Retained or removed is a `design.md` decision, not a spec-level one.
- **Dependencies**: none added.
- **Out of band**: the same policy text will eventually be needed as public URLs for the App Store and Play Store listings, which this change does not produce.
