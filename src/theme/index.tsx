import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { systemFontFallback, useAppFonts } from './fonts';
import { colors, radii, spacing, typography } from './tokens';

export * from './tokens';

/**
 * The resolved type scale.
 *
 * `family` here is not the same as `typography.family` in tokens: until Lato
 * has loaded these resolve to the platform's system face, so text is readable
 * on the first frame rather than invisible.
 */
type ResolvedTypography = Omit<typeof typography, 'family'> & {
  family: { regular: string; bold: string; black: string };
};

type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: ResolvedTypography;
  /** False while Lato is still loading and the system fallback is in use. */
  fontsLoaded: boolean;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const fontsLoaded = useAppFonts();

  const value = useMemo<Theme>(() => {
    const family = fontsLoaded
      ? typography.family
      : { regular: systemFontFallback, bold: systemFontFallback, black: systemFontFallback };

    return {
      colors,
      spacing,
      radii,
      typography: { ...typography, family },
      fontsLoaded,
    };
  }, [fontsLoaded]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return theme;
}
