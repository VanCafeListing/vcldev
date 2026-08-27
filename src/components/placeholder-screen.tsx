import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type PlaceholderScreenProps = {
  title: string;
  /** Which change will implement this screen, so the stub explains itself. */
  note?: string;
  showBack?: boolean;
};

/**
 * A scaffolded screen that has not been implemented yet.
 *
 * `bootstrap-app-foundation` builds the navigation shell only; each feature
 * change replaces these stubs with the real screen. `profile-settings`
 * reuses it for Notification/Privacy Policy/Terms of Use, which have no
 * design or copy yet — just a title, "Content coming soon", and back nav.
 */
export function PlaceholderScreen({ title, note, showBack = false }: PlaceholderScreenProps) {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={{ padding: spacing.lg }}
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.bold,
              fontSize: typography.size.md,
            }}
          >
            ‹ Back
          </Text>
        </Pressable>
      ) : null}

      <View style={[styles.body, { padding: spacing.xl, gap: spacing.sm }]}>
        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.black,
            fontSize: typography.size.xxl,
          }}
        >
          {title}
        </Text>
        {note ? (
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: typography.family.regular,
              fontSize: typography.size.md,
              textAlign: 'center',
            }}
          >
            {note}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
