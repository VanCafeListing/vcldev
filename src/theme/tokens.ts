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
  black: '#000000',
  dark: '#3A3A3A',
  darkGrey: '#3B3B3B',
  border: '#C9C9C9',
  muted: '#8A8A8A',
  track: '#D4D4D4',
  /**
   * The grey Figma uses for unfinished placeholders (image slots, the map
   * box). Kept so those areas can be rendered as explicit skeletons rather
   * than mistaken for a designed surface.
   */
  placeholder: '#D9D9D9',
} as const;

/**
 * Colours read directly off the hi-fi Figma frames on the Styleguide page.
 *
 * These sit outside the "Beer Glazed Bacon" scale above — the scale is the
 * documented palette, but the frames paint surfaces with their own values and
 * the user confirmed the frames win. Both are kept: the scale for shading and
 * derived tones, these for the surfaces they actually appear on.
 *
 * Deliberately NOT included: Figma's named "Primary" variable (#545F71, a
 * slate blue-grey used for chip borders). It is the same colour as the WIP
 * placeholder boxes and the user confirmed it is template residue, so borders
 * use our own neutral instead.
 */
export const figma = {
  /** Cafe card body on the Home feed. */
  cardBrown: '#a44012',
  /** The Apply button on the Filters sheet. */
  deepBrown: '#42210c',
  /** Selected filter chip. */
  selected: '#fb8b24',
  /** Tab bar icons. */
  tabIcon: '#6F1414',
  /** Tab bar background. */
  tabBar: '#fffbf5',
  /** "Off White" — screen background and text on brown surfaces. */
  offWhite: '#FFFCF8',
  /** Amenity tiles on the cafe detail screen. */
  amenityOutlet: '#dbf897',
  amenityWifi: '#d3efb0',
} as const;

/**
 * Semantic roles. Screens should reach for these rather than raw values, so a
 * palette change lands in one place.
 */
export const colors = {
  /** Brand brown: primary buttons and brand surfaces. */
  primary: brown.base,
  onPrimary: neutral.white,

  /** Light brown tint: the splash's secondary "Log in" button. */
  secondary: brown.tint[70],
  onSecondary: brown.base,

  /** Charcoal: Save, avatar Edit, and dialog confirm actions. */
  neutralAction: neutral.dark,
  onNeutralAction: neutral.white,

  /** Cafe cards: brown body with off-white text laid over the photo. */
  card: figma.cardBrown,
  onCard: figma.offWhite,

  /** The Filters sheet's Apply button. */
  deepAction: figma.deepBrown,
  onDeepAction: neutral.white,

  /** Selected filter chip. */
  accent: figma.selected,
  onAccent: neutral.white,

  /** Amenity tiles on the cafe detail screen. */
  amenityOutlet: figma.amenityOutlet,
  amenityWifi: figma.amenityWifi,
  amenityNeutral: neutral.placeholder,

  /** Screen backgrounds. The hi-fi Figma frames sit on off-white. */
  background: figma.offWhite,

  /**
   * The auth screens come from the PDF, not the Figma Styleguide page, and
   * sit on the palest brown tint rather than the off-white the Figma frames
   * use. Sampled from the source: #f1eae7.
   */
  authBackground: brown.tint[90],
  surface: neutral.white,
  surfaceAlt: amber['0.5'],

  /** Bottom tab bar: cream with dark red-brown icons. */
  tabBar: figma.tabBar,
  tabIcon: figma.tabIcon,

  text: neutral.black,
  textMuted: neutral.muted,
  textOnBrand: brown.tint[80],

  border: neutral.border,
  track: neutral.track,
  placeholder: neutral.placeholder,
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
