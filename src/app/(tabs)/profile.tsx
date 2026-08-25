import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { useSession } from '@/lib/session';
import { useTheme } from '@/theme';

/**
 * Scaffolded Profile tab — the full account menu is built by the
 * `profile-settings` change. Log out is wired up here so the shell's
 * session-aware routing can actually be exercised end to end.
 */
export default function ProfileScreen() {
  const { colors, spacing, typography } = useTheme();
  const { session, isGuest, signOut } = useSession();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.body, { padding: spacing.xl, gap: spacing.sm }]}>
        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.black,
            fontSize: typography.size.xxl,
          }}
        >
          Profile
        </Text>

        <Text
          style={{
            color: colors.textMuted,
            fontFamily: typography.family.regular,
            fontSize: typography.size.md,
            textAlign: 'center',
          }}
        >
          {isGuest ? 'Browsing as a guest' : (session?.user.email ?? 'Signed in')}
        </Text>

        <Text
          style={{
            color: colors.textMuted,
            fontFamily: typography.family.regular,
            fontSize: typography.size.sm,
            textAlign: 'center',
            marginBottom: spacing.lg,
          }}
        >
          The account menu is implemented by the profile-settings change.
        </Text>

        <Button
          label={isGuest ? 'Exit guest mode' : 'Log Out'}
          variant="neutral"
          fullWidth={false}
          onPress={signOut}
        />
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
