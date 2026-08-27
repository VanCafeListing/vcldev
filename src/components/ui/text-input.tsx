import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
  type ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';

import { useTheme } from '@/theme';

type TextInputProps = RNTextInputProps & {
  label?: string;
  /** Renders a `*` after the label, as the sign-up screen's fields do. */
  required?: boolean;
  error?: string;
  /**
   * Rendered inside the field at its trailing edge. `user-auth` uses this for
   * the password visibility toggle, so passwords need no separate component.
   */
  trailing?: ReactNode;
  /** Rendered inside the field at its leading edge — `cafe-search`'s search icon. */
  leading?: ReactNode;
  containerStyle?: ViewStyle;
};

export function TextInput({
  label,
  required = false,
  error,
  trailing,
  leading,
  containerStyle,
  style,
  ...rest
}: TextInputProps) {
  const { colors, radii, spacing, typography } = useTheme();

  return (
    <View style={[{ gap: spacing.xs }, containerStyle]}>
      {label ? (
        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.regular,
            fontSize: typography.size.sm,
          }}
        >
          {label}
          {required ? ' *' : ''}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          {
            borderColor: error ? colors.primary : colors.border,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
            gap: spacing.sm,
          },
        ]}
      >
        {leading}
        <RNTextInput
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              color: colors.text,
              fontFamily: typography.family.regular,
              fontSize: typography.size.md,
              paddingVertical: spacing.md,
            },
            style,
          ]}
          {...rest}
        />
        {trailing}
      </View>

      {error ? (
        <Text
          style={{
            color: colors.primary,
            fontFamily: typography.family.regular,
            fontSize: typography.size.xs,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
  },
});
