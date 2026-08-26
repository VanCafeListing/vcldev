import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Button, Logo } from '@/components/ui';
import { useSession } from '@/lib/session';
import { useTheme } from '@/theme';

/**
 * Geometry measured from the splash artboard in `design/source/App-design.pdf`,
 * as fractions of the screen. The background art is stretched to fill the
 * screen, so positioning content by the same fractions keeps it aligned with
 * the wave on any device rather than drifting on taller or shorter screens.
 */
const LOGO_WIDTH = 0.2596;
const LOGO_CENTER_Y = 0.2987;
const CONTENT_INSET = 0.087;
const SIGN_UP_TOP = 0.7196;

/** Aspect ratio of the VAN monogram, from the source artwork. */
const LOGO_ASPECT = 111.03 / 80.01;

/**
 * The landing screen.
 *
 * The brown field, the wave, its faceted texture and the cream gradient are one
 * background image extracted from the design source — the wave is an
 * asymmetric S-curve (trough left, crest right) that a border radius cannot
 * reproduce.
 */
export default function SplashScreen() {
  const { colors, spacing, typography } = useTheme();
  const { continueAsGuest } = useSession();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const logoWidth = width * LOGO_WIDTH;

  return (
    <View style={[styles.root, { backgroundColor: colors.primary }]}>
      {/* Stretched, not cover: the wave must stay at its designed fraction of
          the screen height so the content below lines up with it. */}
      <Image
        source={require('@/assets/images/splash-bg.png')}
        style={StyleSheet.absoluteFill}
        contentFit="fill"
      />

      {/* The status bar sits over the brown field, so it needs light content. */}
      <StatusBar style="light" />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: height * LOGO_CENTER_Y - logoWidth / LOGO_ASPECT / 2,
          alignItems: 'center',
        }}
      >
        <Logo width={logoWidth} color={colors.textOnBrand} />
      </View>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: height * SIGN_UP_TOP,
          paddingHorizontal: width * CONTENT_INSET,
          gap: spacing.sm,
        }}
      >
        <Button label="Sign up" onPress={() => router.push('/(auth)/sign-up')} />
        <Button label="Log in" variant="secondary" onPress={() => router.push('/(auth)/log-in')} />

        <Pressable
          onPress={continueAsGuest}
          accessibilityRole="button"
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, paddingVertical: spacing.sm }]}
        >
          <Text
            style={{
              textAlign: 'center',
              color: colors.text,
              fontFamily: typography.family.regular,
              fontSize: typography.size.md,
            }}
          >
            Start as a guest
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
