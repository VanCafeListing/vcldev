import * as Linking from 'expo-linking';
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

import { Button, TextInput } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { isValidEmail } from '@/lib/validation';
import { useTheme } from '@/theme';

/**
 * Request a password reset.
 *
 * Reached from "Forgot your password?" on the Log In screen. Note it always
 * reports the same thing whether or not the address has an account — otherwise
 * this screen would be a way to test which emails are registered.
 *
 * Only an email is accepted here, not a username: the reset has to be
 * delivered somewhere, and a username on its own has no destination.
 */
export default function ForgotPasswordScreen() {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (!email.trim()) {
      setError('Required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError(undefined);
    setSubmitting(true);

    // The result is deliberately ignored: reporting failure differently for an
    // unknown address is exactly the leak this screen must not have.
    await supabase.auth
      .resetPasswordForEmail(email.trim(), {
        redirectTo: Linking.createURL('/reset-password'),
      })
      .catch(() => undefined);

    setSubmitting(false);
    setSent(true);
  }

  const body = {
    color: colors.text,
    fontFamily: typography.family.regular,
    fontSize: typography.size.md,
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl }}
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
              marginBottom: spacing.sm,
            }}
          >
            Reset password
          </Text>

          {sent ? (
            <View style={{ gap: spacing.lg }}>
              <Text style={body} accessibilityRole="alert">
                If an account exists for that email address, we&apos;ve sent it a link to reset the
                password. Check your inbox.
              </Text>
              <Button label="Back to log in" onPress={() => router.back()} />
            </View>
          ) : (
            <View style={{ gap: spacing.lg }}>
              <Text style={body}>
                Enter the email address for your account and we&apos;ll send you a link to set a new
                password.
              </Text>

              <TextInput
                label="Email Address"
                required
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setError(undefined);
                }}
                error={error}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
              />

              <Button label="Send reset link" onPress={onSubmit} loading={submitting} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
