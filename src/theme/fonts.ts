import { Lato_400Regular, Lato_700Bold, Lato_900Black, useFonts } from '@expo-google-fonts/lato';
import { Platform } from 'react-native';

/**
 * The system faces used until Lato finishes loading.
 *
 * The design specifies Lato everywhere, but fonts load asynchronously, so the
 * first frame would otherwise render with no text at all. Rendering in the
 * platform's own UI face keeps the app readable during that window, and text
 * re-renders in Lato as soon as it is ready.
 */
export const systemFontFallback = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui',
}) as string;

/**
 * Loads the Lato faces the design uses.
 *
 * Returns whether Lato is ready. Callers should fall back to
 * `systemFontFallback` while it is not — see `ThemeProvider`, which does this
 * for the whole tree.
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  return loaded;
}
