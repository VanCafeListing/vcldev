import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, ConfirmDialog, Icon, type IconName } from '@/components/ui';
import { deleteAccount, getProfile } from '@/lib/profile';
import { useSession } from '@/lib/session';
import { useTheme } from '@/theme';

type Row = {
  key: string;
  label: string;
  icon: IconName;
  onPress: () => void;
  showChevron: boolean;
};

/**
 * PDF Profile-menu artboard: avatar header + amber Favourites shortcut sit
 * on the plain white screen background; the five rows live inside their own
 * pale rounded card (`colors.background`, the same tone the rest of the app
 * uses for a full screen — here it's a contained block instead).
 */
export default function ProfileScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const router = useRouter();
  const { session, isGuest, signOut } = useSession();
  const queryClient = useQueryClient();
  const isSignedIn = Boolean(session) && !isGuest;

  const [logOutVisible, setLogOutVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const profileQuery = useQuery({
    queryKey: ['profile', session?.user.id],
    queryFn: () => getProfile(session!.user.id),
    enabled: isSignedIn,
  });

  async function onConfirmDelete() {
    setDeleting(true);
    try {
      await deleteAccount();
      queryClient.clear();
      await signOut();
    } finally {
      setDeleting(false);
      setDeleteVisible(false);
    }
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView style={[styles.root, styles.centered, { backgroundColor: colors.surface }]}>
        <View style={{ padding: spacing.xl, gap: spacing.lg, alignItems: 'center' }}>
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
            {isGuest ? 'Browsing as a guest' : 'Sign in to manage your account'}
          </Text>
          {isGuest ? (
            <Button label="Exit guest mode" variant="neutral" fullWidth={false} onPress={signOut} />
          ) : (
            <View style={{ gap: spacing.sm, width: '100%' }}>
              <Button label="Log In" onPress={() => router.push('/(auth)/log-in')} />
              <Button
                label="Sign Up"
                variant="secondary"
                onPress={() => router.push('/(auth)/sign-up')}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const profile = profileQuery.data;

  const rows: Row[] = [
    {
      key: 'notification',
      label: 'Notification',
      icon: 'Notification',
      onPress: () => router.push('/profile/notifications'),
      showChevron: true,
    },
    {
      key: 'privacy',
      label: 'Privacy Policy',
      icon: 'Privacy',
      onPress: () => router.push('/profile/privacy'),
      showChevron: true,
    },
    {
      key: 'terms',
      label: 'Terms of Use',
      icon: 'Terms',
      onPress: () => router.push('/profile/terms'),
      showChevron: true,
    },
    {
      key: 'logout',
      label: 'Log Out',
      icon: 'LogOut',
      onPress: () => setLogOutVisible(true),
      showChevron: false,
    },
    {
      key: 'delete',
      label: 'Delete Account',
      icon: 'Delete',
      onPress: () => setDeleteVisible(true),
      showChevron: false,
    },
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.surface }]}>
      <View style={{ padding: spacing.xl, gap: spacing.xl, flex: 1 }}>
        <Pressable
          onPress={() => router.push('/profile/edit')}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          style={{ alignItems: 'center', gap: spacing.xs }}
        >
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.placeholder }]}>
              <Icon name="TabUser" size={40} color={colors.textMuted} />
            </View>
          )}
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.bold,
              fontSize: typography.size.xl,
            }}
          >
            {profile?.name || profile?.username || 'Username'}
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: typography.family.regular,
              fontSize: typography.size.sm,
            }}
          >
            {profile?.email ?? session?.user.email}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/favourites')}
          accessibilityRole="button"
          style={[
            styles.favouritesButton,
            { backgroundColor: colors.amenityTile, borderRadius: radii.md, padding: spacing.lg, gap: spacing.sm },
          ]}
        >
          <Icon name="Heart" size={20} color={colors.primary} />
          <Text
            style={{
              color: colors.primary,
              fontFamily: typography.family.regular,
              fontSize: typography.size.md,
            }}
          >
            Favourites
          </Text>
        </Pressable>

        <View
          style={[
            styles.rowsContainer,
            { backgroundColor: colors.background, borderRadius: radii.md, padding: spacing.lg, gap: spacing.xl },
          ]}
        >
          {rows.map((row) => (
            <Pressable
              key={row.key}
              onPress={row.onPress}
              accessibilityRole="button"
              style={[styles.row, { gap: spacing.md }]}
            >
              <Icon name={row.icon} size={22} color={colors.text} />
              <Text
                style={{
                  flex: 1,
                  color: colors.text,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.md,
                }}
              >
                {row.label}
              </Text>
              {row.showChevron ? (
                <Text style={{ color: colors.text, fontSize: typography.size.lg }}>›</Text>
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>

      <ConfirmDialog
        visible={logOutVisible}
        message="Do you want to log-out from this account?"
        confirmLabel="Logout"
        onCancel={() => setLogOutVisible(false)}
        onConfirm={() => {
          setLogOutVisible(false);
          signOut();
        }}
      />

      <ConfirmDialog
        visible={deleteVisible}
        message="Do you want to delete this account?"
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        onCancel={() => setDeleteVisible(false)}
        onConfirm={onConfirmDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favouritesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
