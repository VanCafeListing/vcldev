import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { signInWithApple, signInWithWebProvider, type WebOAuthProvider } from '@/lib/social-auth';
import { useTheme } from '@/theme';

// Crisp, uncropped vector SVGs with official brand proportions and colours.
const ICONS = {
  apple: `<svg viewBox="0 0 170 170" width="38" height="38" xmlns="http://www.w3.org/2000/svg">
  <path fill="#000000" d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.07-7.69-7.94-12-14.61-6.19-9.56-11.06-20.2-14.62-31.93-3.56-11.73-5.34-23.01-5.34-33.85 0-14.3 3.65-26.06 10.95-35.29 7.3-9.23 16.5-13.97 27.59-14.23 4.89 0 10.38 1.34 16.48 4.02 6.1 2.68 9.94 4.08 11.53 4.22 1.48-.14 5.48-1.6 12-4.37 6.52-2.77 11.83-3.95 15.93-3.54 11.74.88 20.93 5.41 27.56 13.59-10.42 6.32-15.5 15.22-15.24 26.7.27 8.97 3.73 16.47 10.38 22.5 6.65 6.03 14.54 9.4 23.67 10.11-2.15 6.39-4.87 12.83-8.16 19.33zM119.22 33.09c0-6.73 2.45-13.1 7.35-19.11 4.9-6.01 11.07-9.98 18.51-11.91.56 2.45.84 4.88.84 7.29 0 6.62-2.58 13.1-7.74 19.44-5.16 6.34-11.45 10.32-18.87 11.94-.06-2.57-.09-5.12-.09-7.65z"/>
</svg>`,
  google: `<svg viewBox="0 0 48 48" width="38" height="38" xmlns="http://www.w3.org/2000/svg">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>`,
  facebook: `<svg viewBox="0 0 24 48" width="20" height="38" xmlns="http://www.w3.org/2000/svg">
  <path fill="#1877F2" d="M22.675 0h-7.054C7.758 0 3.125 5.236 3.125 13.313V19.5H0v8.625h3.125V48h10.375V28.125h7.125l1.094-8.625H13.5V14.156c0-2.428.675-4.088 4.16-4.088h4.015V0z"/>
</svg>`,
} as const;

type SocialProvider = 'apple' | WebOAuthProvider;

/**
 * `signInWithApple` throws outright off iOS, so offering the button on Android
 * would only ever produce an error. Apple requires the option on iOS when
 * other social logins are present, so it stays there.
 */
const PROVIDERS: readonly SocialProvider[] =
  Platform.OS === 'ios' ? (['apple', 'google', 'facebook'] as const) : (['google', 'facebook'] as const);

type Props = {
  disabled?: boolean;
  onStart?: () => boolean;
  onError: (error: unknown) => void;
};

export function SocialAuthButtons({ disabled = false, onStart, onError }: Props) {
  const { colors, spacing, typography } = useTheme();
  const [busyProvider, setBusyProvider] = useState<SocialProvider | null>(null);

  const launch = async (provider: SocialProvider) => {
    if (disabled || busyProvider) return;
    if (onStart?.() === false) return;
    setBusyProvider(provider);

    try {
      if (provider === 'apple') await signInWithApple();
      else await signInWithWebProvider(provider);
    } catch (error) {
      onError(error);
    } finally {
      setBusyProvider(null);
    }
  };

  return (
    <View style={{ gap: spacing.md }}>
      <View style={styles.dividerRow}>
        <View style={[styles.divider, { backgroundColor: colors.text }]} />
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: typography.family.regular,
            fontSize: typography.size.sm,
          }}
        >
          Or sign in with
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.text }]} />
      </View>

      <View style={styles.buttons}>
        {PROVIDERS.map((provider) => (
          <Pressable
            key={provider}
            accessibilityRole="button"
            accessibilityLabel={`Continue with ${provider[0].toUpperCase()}${provider.slice(1)}`}
            accessibilityState={{
              disabled: disabled || Boolean(busyProvider),
              busy: busyProvider === provider,
            }}
            disabled={disabled || Boolean(busyProvider)}
            onPress={() => void launch(provider)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.socialButton,
              {
                opacity:
                  disabled || (busyProvider && busyProvider !== provider)
                    ? 0.4
                    : pressed
                      ? 0.65
                      : 1,
              },
            ]}
          >
            <SvgXml xml={ICONS[provider]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  divider: { flex: 1, height: StyleSheet.hairlineWidth * 2 },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: 28 },
  socialButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
