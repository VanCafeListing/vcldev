## 1. Expo App Scaffold

- [x] 1.1 Initialize the Expo (TypeScript) project in `app/` using the Expo Router template
- [x] 1.2 Configure ESLint/Prettier and TypeScript strict mode
- [x] 1.3 Set `app.json` URL scheme to `vancafelisting` (for future OAuth redirects) and placeholder app name/icon
- [x] 1.4 Add env config: `.env.example` (committed) documenting `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `.env` gitignored

## 2. Design System

- [x] 2.1 Convert the "VAN" monogram to `design/logo/van-monogram.svg` (source: `design/source/VanCafe_Logo.ai`); tighten the viewBox from the full 792×612pt page to the logo's ink bounds, and make the paths tintable (`currentColor`) since the splash renders it light-on-brown
- [x] 2.2 Create `theme/tokens.ts` with the two confirmed color scales (Beer Glazed Bacon brown shade/tint, amber 0–10 accent) as named constants matching the recorded hex values exactly, plus the dark charcoal neutral (~#3A3A3A) used by Save/Edit/dialog-confirm buttons
- [x] 2.3 Add the Lato font (e.g. `@expo-google-fonts/lato`) with a system-font fallback while loading
- [x] 2.4 Build a `ThemeProvider` exposing color tokens, typography scale, and spacing scale
- [x] 2.5 Build primitive components from tokens: `Button` (primary / secondary / neutral / outlined variants), `TextInput`, `Card`, `AmenityBadge`, `BottomNavBar`
- [x] 2.6 Add a dev-only style-guide screen rendering all primitives and both color scales, for visual QA against the source mockup

## 3. Supabase Backend

- [x] 3.1 Create a new Supabase project named `vancafe-listing`
- [x] 3.2 Enable the `postgis` extension
- [x] 3.3 Migration: `profiles` table (id → `auth.users`, name, email, created_at) with RLS restricting read/write to the owning user
- [x] 3.4 Migration: `cafes` table — name, description, address, `location geography(Point,4326)` with a GIST index, price_range, and structured filter columns (wifi, outlets, seat count/category, parking, commuter_friendly, seating tags: spacious/wide_tables/patio, atmosphere tags: quiet/lively)
- [x] 3.5 Migration: `favourites` table (user_id, cafe_id, created_at, unique on the pair) with RLS restricting read/write to the owning user
- [x] 3.6 Create Storage bucket `cafe-photos`: public read, write restricted to service role
- [x] 3.7 Apply all migrations to the `vancafe-listing` project via the Supabase MCP and verify with `list_tables`

## 4. Supabase Client Wiring

- [x] 4.1 Install `@supabase/supabase-js`, `@react-native-async-storage/async-storage`, `@tanstack/react-query`
- [x] 4.2 Create `lib/supabase.ts`: client configured with the AsyncStorage auth adapter and env-based URL/anon key
- [x] 4.3 Wire a `QueryClientProvider` at the app root

## 5. App Shell & Navigation

- [x] 5.1 Create route groups: `app/(auth)/` (Splash, Sign up, Log in — placeholder content) and `app/(tabs)/` (Home, Search, Map, Profile — placeholder content)
- [x] 5.2 Implement session-aware root layout: no session → `(auth)`; active session or guest mode → `(tabs)`
- [x] 5.3 Implement a guest-mode flag (local state) so "Start as a guest" reaches `(tabs)` without a Supabase session
- [x] 5.4 Wire the four-tab `BottomNavBar` primitive into the `(tabs)` layout
- [x] 5.5 Wire a placeholder "Log out" action on the Profile tab that clears the session/guest flag and returns to `(auth)`

## 6. Verification

- [x] 6.1 Cold launch with no session shows the Splash screen (Sign up / Log in / Start as a guest)
- [x] 6.2 "Start as a guest" reaches the Home tab; all four tabs are reachable via the bottom nav
- [x] 6.3 The style-guide screen's rendered colors and typography visually match the source mockup and recorded hex values
- [x] 6.4 Supabase `list_tables` confirms `profiles`, `cafes`, `favourites` exist with RLS enabled, and the `cafe-photos` bucket exists
