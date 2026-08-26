import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, PasswordInput, TextInput } from '@/components/ui';
import { authErrorMessage } from '@/lib/auth-errors';
import { signInWithIdentifier } from '@/lib/sign-in';
import { hasErrors, validateLogIn, type FieldErrors, type LogInFields } from '@/lib/validation';
import { useTheme } from '@/theme';

const EMPTY: LogInFields = { identifier: '', password: '' };

/**
 * Log In — the "Welcome back!" screen.
 *
 * Note it deliberately carries NO social sign-in buttons: the design puts
 * those on Sign Up only. The identifier accepts a username or an email, which
 * is why signing in goes through the `sign-in` Edge Function rather than
 * calling Supabase directly.
 */
export default function LogInScreen() {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();

  const [fields, setFields] = useState<LogInFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<LogInFields>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof LogInFields>(key: K, value: LogInFields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit() {
    const found = validateLogIn(fields);
    setErrors(found);
    setFormError(null);
    if (hasErrors(found)) return;

    setSubmitting(true);
    try {
      await signInWithIdentifier(fields.identifier.trim(), fields.password);
      // The root layout routes into the app once the session lands.
    } catch (error) {
      // Entered values are kept so the user can correct and retry.
      setFormError(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  const body = {
    color: colors.text,
    fontFamily: typography.family.regular,
    fontSize: typography.size.sm,
  };
  const link = { color: colors.primary, fontFamily: typography.family.bold };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxxl }}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={{ paddingVertical: spacing.sm }}
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

          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.black,
              fontSize: typography.size.xxl,
              marginBottom: spacing.xl,
            }}
          >
            Welcome back!
          </Text>

          <View style={{ gap: spacing.md }}>
            <TextInput
              label="User Name or Email Address"
              required
              value={fields.identifier}
              onChangeText={(v) => set('identifier', v)}
              error={errors.identifier}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="username"
            />

            <PasswordInput
              label="Password"
              required
              value={fields.password}
              onChangeText={(v) => set('password', v)}
              error={errors.password}
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
              label="Log In"
              onPress={onSubmit}
              loading={submitting}
              style={{ marginTop: spacing.sm }}
            />

            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              accessibilityRole="button"
              style={{ paddingVertical: spacing.sm }}
            >
              <Text style={[body, { fontFamily: typography.family.bold }]}>
                Forgot your password?
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace('/(auth)/sign-up')}
              accessibilityRole="button"
              style={{ paddingVertical: spacing.sm }}
            >
              <Text style={[body, { textAlign: 'center' }]}>
                Don&apos;t have an account? <Text style={link}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
