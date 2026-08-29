> **Recorded assumption** (design.md — Open Questions): the Figma wider board's push-notification screen could not be consulted while planning — the Figma Dev Mode MCP server is not running, so the board is unreachable. Tasks below use the design's stated fallback categories, `notify_new_cafes` and `notify_favourite_updates`. If the board is reachable at implementation time and enumerates different categories, follow the board and adjust task 1.1 accordingly.

## 1. Notification preference storage

- [ ] 1.1 Migration: add `notify_new_cafes` and `notify_favourite_updates` to `public.profiles` as `boolean not null default false` (default is opt-out by design — see design.md); confirm the migration backfills existing rows
- [ ] 1.2 Verify `profiles` RLS already restricts select and update to `auth.uid() = id` — read the existing policies, do not assume. This is what makes preferences per-account; if it does not hold, fix it here
- [ ] 1.3 Add a typed read/update module for notification preferences following the existing `src/lib/favourites.ts` pattern: a query-options helper plus an optimistic mutation with rollback on failure

## 2. Legal document content

- [ ] 2.1 Create the content module under `src/content/` with the document type (`version`, `effectiveDate`, `title`, `sections[]`) shared by both documents
- [ ] 2.2 Draft the Privacy Policy content describing the app's actual behaviour: Supabase-managed account data (email, name, avatar), foreground location used only for proximity sorting, favourites, cafe data sourced from Google Places, account deletion cascading all owned data, and the third-party processors (Supabase, Google, Expo). Mark clearly that it requires legal review before public launch
- [ ] 2.3 Draft the Terms of Use content: acceptable use, that cafe data is informational and may be inaccurate or stale, account termination and deletion, no warranty, and how changes to the terms are communicated. Same review caveat
- [ ] 2.4 Set each document's `version` (date-based) and `effectiveDate`

## 3. Legal document rendering

- [ ] 3.1 Build the shared legal-document renderer: scrollable, renders headings and paragraphs from the structured content, and displays the version and effective date
- [ ] 3.2 Ensure the scroll container's bottom padding clears the floating tab bar so the end of the text is reachable and not clipped (spec: "Reading the whole policy")
- [ ] 3.3 Replace `src/app/profile/privacy.tsx` to render the Privacy Policy through the shared renderer, keeping back navigation to the Profile tab
- [ ] 3.4 Replace `src/app/profile/terms.tsx` to render the Terms of Use the same way

## 4. Unauthenticated access to the terms

- [ ] 4.1 Resolve the routing problem in design.md — Sign Up → Terms: `SessionRouter` redirects users without `canEnterApp` to `/(auth)/splash`, so a signed-out user opening the terms from Sign Up must not be bounced. Mount the shared renderer at a route the redirect does not capture, reachable from both the Profile tab and the auth stack
- [ ] 4.2 Make the Sign Up screen's "Terms of Service" label a `Pressable` that pushes (not replaces) the terms route, so the part-completed form survives back-navigation
- [ ] 4.3 Confirm opening the terms does not check the consent checkbox — acceptance stays an explicit, separate tap

## 5. Notification settings screen

- [ ] 5.1 Replace `src/app/profile/notifications.tsx`: one row per category with a React Native `Switch` tinted from theme tokens, reflecting stored values, with back navigation
- [ ] 5.2 Wire each toggle to the optimistic mutation from 1.3; on failure surface the error and revert the toggle to the last stored value
- [ ] 5.3 Add the explanatory line stating preferences are stored for future use and no notifications are sent yet (spec requires this — the screen must not imply delivery exists)
- [ ] 5.4 Handle the no-account case: if reached without a signed-in user, show that an account is required plus routes to log in / sign up, rather than non-persisting toggles. The screen must not assume a session even though the Profile hub currently gates it

## 6. Verification

- [ ] 6.1 Privacy Policy opens from the Profile tab, shows real content (no "coming soon"), scrolls to a reachable end, and returns to the Profile tab
- [ ] 6.2 Terms of Use does the same
- [ ] 6.3 Version and effective date are visible on both documents
- [ ] 6.4 From Sign Up: tapping "Terms of Service" opens the terms while signed out (not redirected to splash), back returns to the form with entered values intact, and the checkbox is still unchecked
- [ ] 6.5 Notification toggles reflect stored values, persist across an app restart, and show the defined default for an account created before this change
- [ ] 6.6 A failed preference write surfaces an error and reverts the toggle rather than showing a value that was never saved (verify by simulating the failure, not by inspection alone)
- [ ] 6.7 Signing out and into a different account shows the second account's own preferences
- [ ] 6.8 `npx tsc --noEmit` and `npx eslint src scripts` are both clean
- [ ] 6.9 Verify the three screens rendered on a device or emulator, not by code review alone — per the project's visual-fidelity rule, and because these three screens have never been seen running with real content
