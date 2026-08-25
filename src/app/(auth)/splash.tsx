import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Logo } from '@/components/ui';
import { useSession } from '@/lib/session';
import { useTheme } from '@/theme';

/** Curve radius on the cream sheet's top corners. */
const SHEET_CURVE = 48;

/**
 * The landing screen: a brand-brown field holding the logo above a cream lower
 * half with the three entry points. The design's divider is an asymmetric wave;
 * this approximates it with a rounded top edge. Matching the exact curve is a
 * design-polish follow-up.
 */
export default function SplashScreen() {
  const { colors, spacing, typography } = useTheme();
  const { continueAsGuest } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.primary }]}>
      <View style={styles.brandArea}>
        <Logo width={132} color={colors.textOnBrand} />
      </View>

      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            // A gentle curve into the cream half, approximating the design's
            // wave. A pill radius here balloons into a dome — keep it modest.
            borderTopLeftRadius: SHEET_CURVE,
            borderTopRightRadius: SHEET_CURVE,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xxl,
            paddingBottom: insets.bottom + spacing.xl,
            gap: spacing.md,
          },
        ]}
      >
        <Button label="Sign up" onPress={() => router.push('/(auth)/sign-up')} />
        <Button label="Log in" variant="secondary" onPress={() => router.push('/(auth)/log-in')} />

        <Pressable
          onPress={continueAsGuest}
          accessibilityRole="button"
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: spacing.sm }]}
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
  brandArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    justifyContent: 'flex-end',
  },
});
