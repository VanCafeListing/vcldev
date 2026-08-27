## Context

Greenfield repo (currently just a README). We have source design assets (a Figma-exported PDF and an Illustrator logo) and a Supabase MCP available in this dev environment for provisioning. See proposal.md for motivation; this covers the technical approach for the `design-system`, `app-shell`, and `data-model` capabilities.

## Goals / Non-Goals

**Goals:**
- Pick a concrete, minimal architecture for the Expo app (routing, styling approach, data layer) that later feature changes build on without re-litigating structure.
- Get color/typography tokens and the logo into the codebase as the single source of truth, replacing the source PDF/AI files.
- Stand up the Supabase schema, storage, and RLS so feature changes can read/write real data from day one.

**Non-Goals:**
- Implementing actual feature logic (sign-up validation, cafe search, filter application, favouriting, profile editing) — screens are scaffolded as placeholders only; behavior comes in later changes.
- Dark mode, admin tooling for adding cafes, reviews/ratings, payments, chat, push notifications — all explicitly out of scope (see proposal).
- Deciding whether cafes are admin-curated or user-submitted — deferred to whichever future change adds cafe-creation.

## Decisions

**Routing: Expo Router (file-based), not bare React Navigation.**
Expo Router is built on React Navigation but maps the `(auth)` vs `(tabs)` split directly onto the file system (`app/(auth)/...`, `app/(tabs)/...`), which mirrors the app-shell spec's two stacks, and it ships deep-linking config out of the box — needed later for OAuth redirect handling. Alternative considered: configuring React Navigation's stack/tab navigators by hand — more boilerplate for the same structure, no material benefit here.

**Styling: hand-rolled tokens + primitive components, not a third-party UI kit.**
The design system is small and specific (two color scales, Lato, a handful of primitives: button, input, card, badge, bottom nav) and needs to match the supplied mockups precisely. A kit like Tamagui/RN Paper/Gluestack would add bundle size and its own opinions to override. Decision: a `theme/tokens.ts` (colors, spacing, radii) + `ThemeProvider` + a small primitives folder. Alternative considered: React Native Paper — rejected, its Material-style defaults fight the custom look more than they save.

**Data/server-state: `@supabase/supabase-js` + TanStack Query.**
Screens will repeatedly fetch/cache Postgrest data (cafe list, cafe detail, favourites) with the same loading/error/cache-invalidation needs. TanStack Query gives that without hand-rolling it per screen. Plain client-side selection state (e.g. in-progress filter choices before "Apply") stays as local component state — no global store needed yet. Alternative considered: Redux/Zustand for everything — unnecessary weight until a cross-screen client-state need actually appears.

**Geo: PostGIS `geography(Point, 4326)` column on `cafes`, not plain lat/lng + app-side Haversine.**
Supabase supports enabling the `postgis` extension directly; a `geography` column with a GIST index gives correct, indexed nearest/radius queries via `ST_DWithin`/`<->` that scale as the cafe count grows. Alternative considered: plain `lat`/`lng` numeric columns with Haversine computed in SQL or the client — simpler short-term, but not indexable and duplicates logic across queries.

**Session persistence: `@react-native-async-storage/async-storage` as the Supabase Auth storage adapter.**
This matches Supabase's official Expo quickstart and is sufficient to start. Noted as a follow-up hardening item (not blocking this change) to consider migrating to `expo-secure-store` for encrypted token storage.

**OAuth redirect: custom URL scheme via `expo-linking` (`vancafelisting://`), configured now.**
Apple/Google/Facebook sign-in isn't implemented in this change, but the redirect scheme is an `app.json`-level config decision that's cheap to set now and awkward to retrofit once auth screens exist.

**Schema management: SQL migrations applied via the Supabase MCP, tracked in-repo under `supabase/migrations/`.**
Keeps the schema version-controlled and reproducible rather than drifting from dashboard-only edits.

**Supabase project: create a new dedicated project (`vancafe-listing`), not the existing "Shexter's Project."**
Keeps this app's schema, auth config, and storage isolated from anything else on the account. Confirmed with the user.

**Project layout: single `app/` Expo project at repo root, no monorepo tooling yet.**
There's only one app and a backend-as-a-service (no separate backend server package to share code with). Alternative considered: an `apps/`/`packages/` workspace (Turborepo/pnpm workspaces) — deferred until a second app (e.g. a web admin panel) actually exists; adding it now is speculative structure with no current payoff.

## Risks / Trade-offs

- [Risk] PostGIS adds schema/extension complexity vs. plain lat/lng → Mitigation: it's a single `create extension` call on Supabase and pays for itself once cafe volume makes accurate/indexed proximity queries matter.
- [Risk] Hand-rolled design system is more upfront work than adopting a kit → Mitigation: the primitive surface is small and fixed by the mockups; precision to the supplied design outweighs kit convenience here.
- [Risk] Client holds the Supabase anon key (standard practice) — safety depends entirely on RLS being correct → Mitigation: the `data-model` spec requires an explicit RLS policy per table; these get reviewed before archive.

## Migration Plan

Greenfield — no rollback complexity, nothing in production yet:
1. Scaffold the Expo app (`app/`) with Expo Router, TypeScript, and the chosen dependencies.
2. Commit design tokens and the converted logo asset under `design/` and wire them into `theme/`.
3. Build the auth-stack/tab-shell route structure with placeholder screens per the app-shell spec.
4. Apply the Supabase schema migration (profiles, cafes, favourites, storage bucket, RLS policies, PostGIS extension) via the Supabase MCP.
5. Wire `supabase-js` + TanStack Query provider into the app with env-based config; verify the app boots to the Splash screen against a real (empty) Supabase project.

