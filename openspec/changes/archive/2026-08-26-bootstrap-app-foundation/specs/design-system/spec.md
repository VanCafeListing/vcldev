## Purpose

Defines the shared visual language — color tokens, typography, and themed UI primitives — that every screen in the app must use, so the product matches the supplied design system consistently instead of screens each inventing their own styling.

## ADDED Requirements

### Requirement: Brand color tokens match the design source
The system SHALL expose a single source of truth for colors, covering both the documented "Beer Glazed Bacon" brown scale with the amber 0–10 scale, and the surface colors used by the hi-fi Figma frames.

#### Scenario: Token values match source
- **WHEN** a developer inspects the exposed color tokens
- **THEN** every token's hex value SHALL exactly match the corresponding value recorded from the design source

#### Scenario: Surface colors follow the Figma frames
- **WHEN** a screen paints a surface the Figma frames define (cafe card, Apply button, selected filter chip, tab bar and its icons, amenity tiles, screen background)
- **THEN** it SHALL use that frame's color rather than a value derived from the documented brown scale

### Requirement: Icons come from the design's exported assets
Icons SHALL be rendered from the assets exported out of the design, not from a generic icon font or hand-authored vector paths.

#### Scenario: Tab bar icons
- **WHEN** the bottom tab bar renders its four icons
- **THEN** each SHALL render from the icon exported for it in the design, and SHALL be tintable to the design's icon color

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

### Requirement: Button primitive supports every design variant
The button primitive SHALL support the variants the design uses: primary (brand brown), secondary (light brown tint), deep (the Filters sheet's Apply button), neutral (dark charcoal), and outlined (transparent with a border).

#### Scenario: Neutral variant renders dark, not brand brown
- **WHEN** a neutral-variant button is rendered (as used for Save, avatar Edit, and dialog confirm actions)
- **THEN** its background SHALL use the dark charcoal token, not the brand brown token

#### Scenario: Destructive actions use the neutral variant
- **WHEN** a destructive confirm action (e.g. Delete Account) is rendered
- **THEN** it SHALL use the neutral (dark charcoal) variant, since the design defines no destructive-red styling

#### Scenario: Amenity tiles are distinguished by background colour
- **WHEN** the Outlet, Wifi and seat-count amenity tiles are rendered
- **THEN** each SHALL use its own background colour from the design, and no tile SHALL carry a "verified" checkmark

### Requirement: Logo renders from a vector asset
The "VAN" monogram logo SHALL be available as a reusable vector asset so it renders crisply at any display size and can be tinted to match its background.

#### Scenario: Splash screen renders the logo
- **WHEN** the splash/landing screen renders the logo
- **THEN** it SHALL render from a vector (SVG) source rather than a fixed-resolution raster image

#### Scenario: Logo is tintable
- **WHEN** the logo is rendered against the brand-brown splash background
- **THEN** it SHALL render in the light tint the design specifies, rather than the source asset's hardcoded black

### Requirement: Single light theme is in scope
The design system SHALL define one light theme. Dark mode is out of scope for this change.

#### Scenario: Device dark mode does not change app appearance
- **WHEN** the user's device is set to a dark color scheme
- **THEN** the app SHALL still render using the light token set, since no dark variant exists yet
