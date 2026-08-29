## Context

See `proposal.md` — Why. Relevant current state:

- `src/app/profile/{privacy,terms,notifications}.tsx` are each a five-line render of `PlaceholderScreen`.
- `profiles` currently has `id, name, email, created_at, username, avatar_url`. No preference storage exists.
- `src/components/ui` has `Checkbox` but no toggle/switch primitive. React Native ships `Switch`.
- Sign Up's Terms label is styled text inside a `Checkbox` row, not a link.
- The project's design sources (PDF, Figma Styleguide) do not draw any of these three screens. The Figma wider board (node 1:2) has a push-notification screen, which the project context classes as "intent rather than final pixels, ask before investing heavily in its styling."

## Goals / Non-Goals

**Goals:**
- Legal text lives in data, not JSX, so a wording revision is a content edit and cannot break rendering.
- Notification preferences have one defined default applied uniformly to existing and new accounts.
- Reuse existing theme tokens and screen scaffolding; introduce no new visual language for screens the designers have not drawn.

**Non-Goals:**
- Rich text/Markdown rendering. The documents are prose with headings; a structured-data model covers them without a Markdown dependency.
- Designing a bespoke notification screen layout. Absent a final design, this follows the Profile hub's existing row idiom.
- See `proposal.md` — Non-goals for the scope-level exclusions (no push delivery, no legal sign-off, no consent history).

## Decisions

### Legal text as structured data, not JSX or Markdown

Store each document as a typed object: `{ version, effectiveDate, title, sections: { heading, body[] }[] }`, in a content module under `src/content/`. One shared renderer component walks it.

- *Why not JSX per document*: prose interleaved with styling means every wording fix risks a rendering regression, and the two documents would drift in appearance.
- *Why not Markdown*: needs a renderer dependency and a parse step at runtime, for prose whose structure is only "heading + paragraphs". The structured form is directly typed and cannot fail to parse.
- *Why not remote-hosted*: an offline user must be able to read what they agreed to, and a network failure must not produce an empty legal screen. Bundling also means the shipped text and the shipped consent checkbox are always the same revision.

**Trade-off**: updating the text requires an app release. Accepted — a versioned document that changes under a user's feet without their consent being re-collected is worse. Store-listing URLs (out of scope here) will need the same text published separately, so the content module should stay the single source both are generated from.

### Version identifier: date-based, hand-maintained

`version: '2026-08-29'` plus a human-readable `effectiveDate`. Not semver — there is no meaningful major/minor distinction for a policy document, and a date is what a reader wants.

The constant lives next to the text it describes so the two cannot drift. Nothing yet *consumes* the version (no consent-history table); it exists so the displayed document is identifiable and so a later consent-history change has a key to record.

### Notification preferences: dedicated boolean columns on `profiles`

Add explicit boolean columns (e.g. `notify_new_cafes`, `notify_favourite_updates`) with `NOT NULL DEFAULT` values, rather than a single `jsonb` blob.

- *Why not `jsonb`*: a blob has no schema, so a typo in a key silently reads as "off" — which for a notification preference means silently not sending something the user asked for. Columns get defaults applied to existing rows automatically by the migration, and a wrong name is a query error rather than a wrong value.
- *Why not a separate `notification_preferences` table*: one row per user, one-to-one with `profiles`, no history — a join with no upside. `profiles` already carries the user's other account settings, and its RLS policies already scope to the owning user.
- **Default**: opt-in (`true`) for product-update categories is not obviously right, and getting it wrong biases every future send. Defaulting to `false` (off) means a future delivery mechanism never sends to a user who has not affirmatively asked. This is the conservative choice and the one that matches "no notifications are sent yet".

`NOT NULL DEFAULT false` satisfies the spec's "accounts that predate this capability" requirement directly — the migration backfills every existing row.

### RLS reuse

No new policies. `profiles` already restricts select/update to `auth.uid() = id`, which is exactly the required scope. This must be **verified, not assumed**, during implementation — the spec's "preferences are per-account" scenario depends on it.

### Toggle primitive: React Native `Switch`

Use RN's built-in `Switch`, tinted with theme tokens, rather than building a `Toggle` into `src/components/ui`.

- The designers have not drawn a toggle, so inventing one adds an unspecified component to the design system that a future real design would have to displace. `Switch` is platform-native, accessible by default, and visually neutral enough to be replaced later without touching call sites if it is wrapped thinly.

### Persistence: optimistic with rollback

Follow the established `useToggleFavourite` pattern in `src/lib/favourites.ts` — optimistic cache update, rollback and surfaced error on failure. This is what the spec's "reports failure honestly" requirement demands, and reusing the existing idiom keeps one mutation pattern in the codebase.

### Sign Up → Terms navigation

The Terms label becomes a `Pressable` pushing the terms route. Sign Up's form state lives in component state within the `(auth)` stack; pushing a route rather than replacing it preserves the form on back-navigation, satisfying the "part-completed form" scenario.

**The terms route must be reachable unauthenticated.** `SessionRouter` redirects users without `canEnterApp` to `/(auth)/splash`, so a route under `/profile/` would bounce a signed-out user mid-signup. Reaching the document from both the Profile tab and the auth stack therefore needs the shared renderer mounted at a route the redirect does not capture — resolving this is an implementation task, and the "reachable without an account" scenario is its acceptance test.

### `PlaceholderScreen`

Keep the component; it stops being referenced by any route. Deleting it is unrelated cleanup that would enlarge this change's diff for no behavioural gain, and it remains the right tool for the next stubbed screen.

## Risks / Trade-offs

- **Drafted legal text is not lawyer-reviewed** → The text describes actual app behaviour (Supabase, foreground location, Google Places, favourites, deletion) rather than making claims it cannot back. It is marked as requiring review before public launch. The gate is store submission, not this change — shipping a truthful description to test users is strictly better than the current "Content coming soon" under a consent checkbox.
- **Text and behaviour drift as the app changes** → The policy enumerates specific processors and data; a later feature adding a processor makes it stale and inaccurate. Mitigated only by the version/effective-date being visible. Worth a recurring review, not solvable in code.
- **Bundled text needs an app release to correct an error** → Accepted; see the content decision above.
- **Defaulting preferences off means a future launch reaches nobody by default** → Deliberate. Consent-first is the correct default, and it can be revisited when a delivery mechanism actually exists and the trade-off is concrete.
- **A guest reaching the Notification screen** → The Profile hub only renders those rows when signed in, so this is currently unreachable; the spec still requires the screen to handle it, so the screen must not assume a session rather than relying on the caller to gate it.

## Migration Plan

One additive migration: `alter table public.profiles add column ... boolean not null default false`. Backfills existing rows by definition of the default. No destructive change and no data movement.

**Rollback**: dropping the columns loses only stated preferences, which nothing consumes yet (no delivery mechanism exists). The app screens would need reverting in the same step, since they read those columns.

Deploy order does not matter much, but migrate first: the columns existing while no client reads them is harmless, whereas a client reading columns that do not exist errors.

## Open Questions

- Which notification categories to offer. The Figma wider board's push-notification screen may enumerate them; if it does, follow it. If it does not, "new cafes near you" and "updates to cafes you've favourited" cover what the app can currently observe. Deferrable: adding or renaming a category is a column and a row, and changes neither the approach nor the task breakdown.
