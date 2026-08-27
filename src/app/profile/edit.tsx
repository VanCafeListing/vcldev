import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Icon, TextInput } from '@/components/ui';
import { getProfile, pickAndUploadAvatar, updateProfile } from '@/lib/profile';
import { useSession } from '@/lib/session';
import { useTheme } from '@/theme';

/**
 * PDF Profile-edit artboard: ✕ + "Profile" title, avatar + Edit, Name, Email,
 * Save. Only reachable from the signed-in Profile hub, but guards against a
 * stray deep link with no session rather than crashing on `session.user.id`.
 */
export default function ProfileEditScreen() {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();
  const { session, isGuest } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId as string),
    enabled: Boolean(userId),
  });

  // Local edits override the loaded profile once the user types or picks a
  // photo; until then the fields mirror the query directly, no effect needed.
  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const [emailOverride, setEmailOverride] = useState<string | null>(null);
  const [avatarOverride, setAvatarOverride] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  if (!session || isGuest || !userId) return <Redirect href="/(tabs)/profile" />;
  const uid = userId;

  const name = nameOverride ?? profileQuery.data?.name ?? '';
  const email = emailOverride ?? profileQuery.data?.email ?? '';
  const avatarUrl = avatarOverride ?? profileQuery.data?.avatar_url ?? null;

  async function onEditAvatar() {
    setUploading(true);
    setError(undefined);
    try {
      const url = await pickAndUploadAvatar(uid);
      if (url) setAvatarOverride(url);
    } catch {
      setError('Could not update your photo. Try again.');
    } finally {
      setUploading(false);
    }
  }

  async function onSave() {
    setSaving(true);
    setError(undefined);
    try {
      await updateProfile(uid, { name, email }, profileQuery.data?.email ?? null);
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      router.back();
    } catch {
      setError('Could not save your changes. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl, paddingTop: spacing.md }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={8}
          style={[styles.closeButton, { backgroundColor: colors.placeholder }]}
        >
          <Text style={{ color: colors.text, fontSize: typography.size.lg }}>✕</Text>
        </Pressable>
        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.bold,
            fontSize: typography.size.xl,
          }}
        >
          Profile
        </Text>
        <View style={styles.closeButton} />
      </View>

      <View style={{ padding: spacing.xl, gap: spacing.xl, flex: 1 }}>
        <View style={{ alignItems: 'center', gap: spacing.md }}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.placeholder }]}>
              <Icon name="TabUser" size={40} color={colors.textMuted} />
            </View>
          )}
          <Button
            label={uploading ? 'Uploading…' : 'Edit'}
            variant="neutral"
            fullWidth={false}
            disabled={uploading}
            onPress={onEditAvatar}
          />
        </View>

        <TextInput label="Name" value={name} onChangeText={setNameOverride} autoCapitalize="words" />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmailOverride}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        {error ? (
          <Text
            style={{
              color: colors.primary,
              fontFamily: typography.family.regular,
              fontSize: typography.size.sm,
            }}
          >
            {error}
          </Text>
        ) : null}

        <View style={{ flex: 1 }} />

        <Button label={saving ? 'Saving…' : 'Save'} variant="neutral" disabled={saving} onPress={onSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
