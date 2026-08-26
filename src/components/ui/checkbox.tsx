import { Pressable, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

import { useTheme } from '@/theme';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Rendered beside the box; usually the consent sentence. */
  children?: ReactNode;
  accessibilityLabel: string;
};

/**
 * A checkbox.
 *
 * Note this is not in the design: the Sign Up screen draws only the sentence
 * "I agree to the Terms of Service". A real gating checkbox was added on the
 * user's instruction so consent is auditable, which is why the styling is
 * derived from the design tokens rather than matched to a drawn control.
 */
export function Checkbox({ checked, onChange, children, accessibilityLabel }: CheckboxProps) {
  const { colors, spacing, radii } = useTheme();

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={spacing.sm}
      style={({ pressed }) => [styles.row, { gap: spacing.sm, opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? colors.primary : colors.textMuted,
            backgroundColor: checked ? colors.primary : 'transparent',
            borderRadius: radii.sm / 2,
          },
        ]}
      >
        {checked ? <View style={[styles.tick, { borderColor: colors.onPrimary }]} /> : null}
      </View>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    width: 10,
    height: 5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
});
