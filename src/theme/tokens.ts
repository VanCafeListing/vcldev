/**
 * Design tokens for VanCafe Listing.
 *
 * Every value here is transcribed from the source design
 * (`design/source/App-design.pdf`) and was verified against it by sampling the
 * rendered swatches pixel-by-pixel. Do not "tidy" these hex values — they are
 * the design's own printed labels, and the style-guide screen exists to catch
 * any drift.
 */

/**
 * "Beer Glazed Bacon" — the brand brown.
 *
 * `base` is the brand colour. `shade` darkens it toward black and `tint`
 * lightens it toward white, each in 10% steps as labelled in the design.
 * Both scales start from the same base value.
 */
export const brown = {
  base: '#753011',

  /** Darker: base mixed toward black, 10%–90%. */
  shade: {
    10: '#692b0f',
    20: '#5e260e',
    30: '#52220c',
    40: '#461d0a',
    50: '#3b1809',
    60: '#2f1307',
    70: '#230e05',
    80: '#170a03',
    90: '#0c0502',
  },

  /** Lighter: base mixed toward white, 10%–90%. */
  tint: {
    10: '#834529',
    20: '#915941',
    30: '#9e6e58',
    40: '#ac8370',
    50: '#ba9888',
    60: '#c8aca0',
    70: '#d6c1b8',
    80: '#e3d6cf',
    90: '#f1eae7',
  },
} as const;

/**
 * The amber/accent scale, keyed by the design's own 0–10 step labels.
 *
 * Note the steps are uneven — the design includes half-steps at the light end
 * (0.5, 1.5) and the dark end (8.5, 9.5) but not in the middle. Keys are
 * strings so the half-steps survive as written; numeric object keys would
 * reorder and mangle them.
 */
export const amber = {
  '0': '#FFFFFF',
  '0.5': '#FFF8ED',
  '1': '#FFF0DB',
  '1.5': '#FFE9CA',
  '2': '#FFE1B8',
  '3': '#FFD394',
  '4': '#FFC471',
  '5': '#FFB54D',
  '6': '#D3953E',
  '7': '#A7752E',
  '8': '#7C551F',
  '8.5': '#664517',
  '9': '#50350F',
  '9.5': '#3A2508',
  '10': '#241500',
} as const;

/**
 * Neutrals.
 *
 * `dark` is the charcoal the design uses for Save, the avatar Edit button, and
 * the confirm button in both dialogs. Note the design has no destructive red —
 * "Delete Account" confirms in this same charcoal.
 */
export const neutral = {
  white: '#FFFFFF',
  dark: '#3A3A3A',
  border: '#C9C9C9',
  muted: '#8A8A8A',
  track: '#D4D4D4',
} as const;

/**
 * Semantic roles. Screens should reach for these rather than raw scale values,
 * so a palette change lands in one place.
 */
export const colors = {
  /** Brand brown: primary buttons, the splash field, the bottom nav bar. */
  primary: brown.base,
  onPrimary: neutral.white,

  /** Light brown tint: the splash's secondary "Log in" button. */
  secondary: brown.tint[70],
  onSecondary: brown.base,

  /** Charcoal: Save, avatar Edit, and dialog confirm actions. */
  neutralAction: neutral.dark,
  onNeutralAction: neutral.white,

  /** Amber accent: selected filter chips, amenity tiles, the Favourites button. */
  accent: amber['5'],
  accentSoft: amber['2'],
  accentSofter: amber['1'],
  onAccent: amber['10'],

  /** Screen backgrounds. Most screens sit on the palest brown tint. */
  background: brown.tint[90],
  surface: neutral.white,
  surfaceAlt: amber['0.5'],

  text: '#111111',
  textMuted: neutral.muted,
  textOnBrand: brown.tint[80],

  border: neutral.border,
  track: neutral.track,
} as const;

/** 4pt spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Corner radii. Buttons and chips are fully rounded in the design. */
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Type scale. `family` values are the Lato faces registered at app start —
 * see `src/theme/fonts.ts`.
 */
export const typography = {
  family: {
    regular: 'Lato_400Regular',
    bold: 'Lato_700Bold',
    black: 'Lato_900Black',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
} as const;

export type Spacing = keyof typeof spacing;
export type Radii = keyof typeof radii;
