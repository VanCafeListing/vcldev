import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

/**
 * The button styles the design uses:
 * - `primary`   brand brown — Sign up on the splash
 * - `secondary` light brown tint — Log in on the splash
 * - `deep`      deep brown (#42210c) — Apply on the Filters sheet
 * - `neutral`   dark charcoal — Save, avatar Edit, dialog confirms
 *               (the design has no destructive red; Delete uses this too)
 * - `outlined`  transparent with a border — Cancel in dialogs
 */
export type ButtonVariant = 'primary' | 'secondary' | 'deep' | 'neutral' | 'outlined';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Buttons fill their container by default; set false to size to content. */
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const { colors, radii, spacing, typography } = useTheme();

  const palette: Record<ButtonVariant, { background: string; text: string; border: string }> = {
    primary: { background: colors.primary, text: colors.onPrimary, border: 'transparent' },
    secondary: { background: colors.secondary, text: colors.onSecondary, border: 'transparent' },
    deep: { background: colors.deepAction, text: colors.onDeepAction, border: 'transparent' },
    neutral: {
      background: colors.neutralAction,
      text: colors.onNeutralAction,
      border: 'transparent',
    },
    outlined: { background: 'transparent', text: colors.text, border: colors.border },
  };

  const { background, text, border } = palette[variant];
  const isInactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: background,
          borderColor: border,
          borderRadius: radii.pill,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          // Dim on press and while inactive rather than swapping in more
          // colour tokens — the design defines no pressed/disabled variants.
          opacity: isInactive ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={text} />
      ) : (
        <Text
          style={[
            styles.label,
            { color: text, fontFamily: typography.family.bold, fontSize: typography.size.md },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  label: {
    textAlign: 'center',
  },
});
