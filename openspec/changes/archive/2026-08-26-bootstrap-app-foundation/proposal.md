## Why

The repo is currently empty except for a README. We now have a complete design system (logo, color tokens, typography) and a full mockup of the app's screens, but no code. Every feature change (auth, cafe discovery, filters, favourites, profile) needs a project scaffold, a themed component library, and a backend schema to build on top of — so those foundations need to land first, as one coherent change, rather than being improvised piecemeal inside the first feature change.

## What Changes

- Initialize a React Native + Expo (TypeScript) app at the repo root, with Expo Router routes under `src/app/`, plus navigation, linting, and env config. React Native/Expo was chosen over Flutter — shared TypeScript with Supabase, mature `supabase-js`/EAS tooling — and confirmed by the user.
- Extract and commit the design system: the VAN monogram (SVG, converted from the supplied `.ai`), the Lato font, the documented colour scales ("Beer Glazed Bacon" brown and the amber 0–10 accent), the surface colours read off the hi-fi Figma frames, the icons exported from the design's own icon sets, and a themed UI primitive set (buttons, inputs, cards, amenity tiles, tab bar).
- Build the navigation shell: an auth stack (Splash → Sign up / Log in / Guest) and a main tab shell (Home, Search, Map, Profile) behind the design's cream tab bar — feature screens scaffolded as placeholders, not implemented yet.
- Provision the Supabase backend: project schema for `profiles`, `cafes` (with geo columns + structured amenity/attribute columns so filters are queryable), `favourites` (user↔cafe join), a Storage bucket for cafe photos, and RLS policies so users only manage their own profile/favourites.
- Wire the Supabase client (`supabase-js`) into the app with environment-based config (no secrets committed).

## Capabilities

### New Capabilities
- `design-system`: design tokens (color scales, typography, spacing) and the themed UI primitive components (buttons, inputs, cards, amenity badges, bottom nav) used across all screens.
- `app-shell`: navigation structure (auth stack + main tab shell), screen scaffolding, and session-aware routing (guest vs. authenticated).
- `data-model`: the Supabase Postgres schema (profiles, cafes, favourites), Storage bucket, and RLS policies that later feature changes (auth, discovery, filters, favourites, profile) will read and write.

### Modified Capabilities
None — this is a greenfield repo.

## Impact

- New repo structure: `app/` (Expo project), `design/logo/` (the converted, tintable VAN monogram SVG), and Supabase project config/migrations (location TBD in design.md — likely `supabase/migrations/`). The original design files are already committed at `design/source/` (`App-design.pdf`, `VanCafe_Logo.ai`) and are the source of truth for every token and screen.
- No existing code or specs are affected (nothing exists yet).
- Establishes the `design-system`, `app-shell`, and `data-model` capabilities that subsequent changes (`user-auth`, `cafe-discovery`, `cafe-filters`, `cafe-map`, `favourites`, `profile-settings`) will depend on and extend.
