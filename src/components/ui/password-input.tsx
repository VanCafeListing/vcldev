import { useState } from 'react';
import { Pressable } from 'react-native';
import type { TextInputProps as RNTextInputProps } from 'react-native';

import { useTheme } from '@/theme';
import { Icon } from './icon';
import { TextInput } from './text-input';

type PasswordInputProps = Omit<RNTextInputProps, 'secureTextEntry'> & {
  label?: string;
  required?: boolean;
  error?: string;
};

/**
 * A password field with the design's show/hide control.
 *
 * The design only ever draws the eye-off glyph — there is no "visible"
 * variant — so rather than inventing a second icon, the same glyph is dimmed
 * while the password is showing. The real feedback is the text itself becoming
 * readable; the accessibility label carries the state for screen readers.
 */
export function PasswordInput({ label, required, error, ...rest }: PasswordInputProps) {
  const { colors, spacing } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      label={label}
      required={required}
      error={error}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      trailing={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          // Widen the touch target beyond the glyph without changing its size.
          hitSlop={spacing.md}
        >
          <Icon name="EyeOff" size={22} color={colors.textMuted} opacity={visible ? 0.45 : 1} />
        </Pressable>
      }
      {...rest}
    />
  );
}
