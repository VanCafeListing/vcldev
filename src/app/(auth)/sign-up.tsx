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

import { Button, Checkbox, PasswordInput, TextInput } from '@/components/ui';
import { SocialAuthButtons } from '@/components/social-auth-buttons';
import { authErrorMessage } from '@/lib/auth-errors';
import { supabase } from '@/lib/supabase';
import { hasErrors, validateSignUp, type FieldErrors, type SignUpFields } from '@/lib/validation';
import { useTheme } from '@/theme';

const EMPTY: SignUpFields = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};

/**
 * Sign Up, from the design in `design/source/App-design.pdf`.
 *
 * One deliberate deviation: the design draws only the sentence "I agree to the
 * Terms of Service", with no control. A real gating checkbox was added on the
 * user's instruction so consent is auditable.
 */
export default function SignUpScreen() {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();

  const [fields, setFields] = useState<SignUpFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<SignUpFields>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof SignUpFields>(key: K, value: SignUpFields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    // Clear a field's error as soon as the user edits it, rather than leaving
    // stale complaints on screen while they fix things.
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit() {
    const found = validateSignUp(fields);
    setErrors(found);
    setFormError(null);
    if (hasErrors(found)) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: fields.email.trim(),
        password: fields.password,
        // Read by the handle_new_user trigger to populate the profile's name.
        options: {
          data: { first_name: fields.firstName.trim(), last_name: fields.lastName.trim() },
        },
      });

      if (error) {
        // Entered values are deliberately left intact so the user can correct
        // and retry rather than retyping the whole form.
        setFormError(authErrorMessage(error));
        return;
      }

      // Routing is handled by the session-aware root layout once the session
      // lands, so there is nothing to navigate to here.
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  const label = {
    color: colors.text,
    fontFamily: typography.family.regular,
    fontSize: typography.size.sm,
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      {/* The splash sets a light status bar over its brown field; this screen is
          pale, so it needs the dark one back. */}
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
            }}
          >
            Welcome!
          </Text>
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.bold,
              fontSize: typography.size.lg,
              marginBottom: spacing.lg,
            }}
          >
            Create your new account
          </Text>

          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <TextInput
                containerStyle={styles.half}
                label="First Name"
                required
                placeholder="First Name"
                value={fields.firstName}
                onChangeText={(v) => set('firstName', v)}
                error={errors.firstName}
                autoCapitalize="words"
                textContentType="givenName"
              />
              <TextInput
                containerStyle={styles.half}
                label="Last Name"
                required
                placeholder="Last Name"
                value={fields.lastName}
                onChangeText={(v) => set('lastName', v)}
                error={errors.lastName}
                autoCapitalize="words"
                textContentType="familyName"
              />
            </View>

            <TextInput
              label="Email"
              required
              value={fields.email}
              onChangeText={(v) => set('email', v)}
              error={errors.email}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
            />

            <PasswordInput
              label="Password"
              required
              value={fields.password}
              onChangeText={(v) => set('password', v)}
              error={errors.password}
              textContentType="newPassword"
            />

            <PasswordInput
              label="Confirm Password"
              required
              value={fields.confirmPassword}
              onChangeText={(v) => set('confirmPassword', v)}
              error={errors.confirmPassword}
              textContentType="newPassword"
            />

            <Checkbox
              checked={fields.acceptedTerms}
              onChange={(v) => set('acceptedTerms', v)}
              accessibilityLabel="I agree to the Terms of Service"
            >
              <Text style={label}>
                I agree to the{' '}
                <Text style={{ color: colors.primary, fontFamily: typography.family.bold }}>
                  Terms of Service
                </Text>
              </Text>
            </Checkbox>
            {errors.acceptedTerms ? (
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.xs,
                  textAlign: 'center',
                }}
              >
                {errors.acceptedTerms}
              </Text>
            ) : null}

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

            <SocialAuthButtons
              disabled={submitting}
              onStart={() => {
                if (!fields.acceptedTerms) {
                  setErrors((current) => ({
                    ...current,
                    acceptedTerms: 'You must agree to the Terms of Service.',
                  }));
                  return false;
                }
                setFormError(null);
                return true;
              }}
              onError={(error) => setFormError(authErrorMessage(error))}
            />

            <Button
              label="Sign up"
              onPress={onSubmit}
              loading={submitting}
              style={{ marginTop: spacing.sm }}
            />

            <Pressable
              onPress={() => router.replace('/(auth)/log-in')}
              accessibilityRole="button"
              style={{ paddingVertical: spacing.sm }}
            >
              <Text style={[label, { textAlign: 'center' }]}>
                Already have an account?{' '}
                <Text style={{ color: colors.primary, fontFamily: typography.family.bold }}>
                  Sign in
                </Text>
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
  half: { flex: 1 },
});
