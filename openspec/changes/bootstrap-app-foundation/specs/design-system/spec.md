## Purpose

Defines the shared visual language — color tokens, typography, and themed UI primitives — that every screen in the app must use, so the product matches the supplied design system consistently instead of screens each inventing their own styling.

## ADDED Requirements

### Requirement: Brand color tokens match the design source
The system SHALL expose a single source of truth for brand colors, and the exposed values SHALL match the confirmed hex values for both the "Beer Glazed Bacon" brown scale and the amber/accent 0–10 scale exactly.

#### Scenario: Token values match source
- **WHEN** a developer inspects the exposed color tokens
- **THEN** every token's hex value SHALL exactly match the corresponding value recorded from the source design (both the brown shade/tint scale and the amber 0–10 scale)

### Requirement: App text renders in Lato
All screen text SHALL render in the Lato typeface, with a system-font fallback while Lato is loading.

#### Scenario: Screen renders with brand typeface
- **WHEN** any screen renders text after fonts have finished loading
- **THEN** the font family SHALL be Lato

### Requirement: Shared themed UI primitives are available
The system SHALL provide reusable UI primitives (button, text input, card, amenity badge, bottom navigation bar) that are styled from the design tokens, so feature screens compose from consistent building blocks rather than one-off styles.

#### Scenario: Primary button uses brand color
- **WHEN** a primary action button is rendered
- **THEN** its background SHALL use the brand brown color token and its label SHALL use a color token that meets readable contrast against that background

### Requirement: Button primitive supports all four design variants
The button primitive SHALL support the four variants the design uses: primary (brand brown), secondary (light brown tint), neutral (dark charcoal), and outlined (transparent with a border).

#### Scenario: Neutral variant renders dark, not brand brown
- **WHEN** a neutral-variant button is rendered (as used for Save, avatar Edit, and dialog confirm actions)
- **THEN** its background SHALL use the dark charcoal token, not the brand brown token

#### Scenario: Destructive actions use the neutral variant
- **WHEN** a destructive confirm action (e.g. Delete Account) is rendered
- **THEN** it SHALL use the neutral (dark charcoal) variant, since the design defines no destructive-red styling

#### Scenario: Verified amenity badge uses accent scale
- **WHEN** an amenity badge is rendered for a verified/active amenity (e.g. Wi-Fi, Outlets)
- **THEN** it SHALL use the amber/accent scale token to indicate the active state, matching the mockup's badge styling

### Requirement: Logo renders from a vector asset
The VanCafe monogram logo SHALL be available as a reusable vector asset so it renders crisply at any display size.

#### Scenario: Splash screen renders the logo
- **WHEN** the splash/landing screen renders the logo
- **THEN** it SHALL render from a vector (SVG) source rather than a fixed-resolution raster image

### Requirement: Single light theme is in scope
The design system SHALL define one light theme. Dark mode is out of scope for this change.

#### Scenario: Device dark mode does not change app appearance
- **WHEN** the user's device is set to a dark color scheme
- **THEN** the app SHALL still render using the light token set, since no dark variant exists yet
