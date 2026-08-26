import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, PasswordInput } from '@/components/ui';
import { authErrorMessage } from '@/lib/auth-errors';
import { supabase } from '@/lib/supabase';
import { MIN_PASSWORD_LENGTH } from '@/lib/validation';
import { useSession } from '@/lib/session';
import { useTheme } from '@/theme';

/**
 * Set a new password.
 *
 * Reached by opening the emailed reset link, which Supabase turns into a
 * recovery session — that session is what authorises the `updateUser` call
 * below, so there is no old password to supply.
 */
export default function ResetPasswordScreen() {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();
  const { finishRecovery } = useSession();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    const found: { password?: string; confirm?: string } = {};
    if (!password) found.password = 'Required';
    else if (password.length < MIN_PASSWORD_LENGTH)
      found.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
    if (confirm !== password) found.confirm = 'Passwords do not match';

    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setFormError(authErrorMessage(error));
        return;
      }
      // Clearing the recovery flag lets the root layout treat this as an
      // ordinary session and route into the app.
      finishRecovery();
      router.replace('/(tabs)');
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.authBackground }]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.black,
              fontSize: typography.size.xxl,
              marginBottom: spacing.lg,
            }}
          >
            Set a new password
          </Text>

          <View style={{ gap: spacing.md }}>
            <PasswordInput
              label="New Password"
              required
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
              textContentType="newPassword"
            />

            <PasswordInput
              label="Confirm New Password"
              required
              value={confirm}
              onChangeText={(v) => {
                setConfirm(v);
                setErrors((e) => ({ ...e, confirm: undefined }));
              }}
              error={errors.confirm}
              textContentType="newPassword"
            />

            {formError ? (
              <Text
                accessibilityRole="alert"
                style={{
                  color: colors.primary,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.sm,
                  textAlign: 'center',
                }}
              >
                {formError}
              </Text>
            ) : null}

            <Button
              label="Save password"
              onPress={onSubmit}
              loading={submitting}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
