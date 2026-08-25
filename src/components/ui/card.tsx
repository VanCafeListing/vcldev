import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme';

/**
 * The rounded, shadowed surface used for cafe cards on the Home feed and the
 * grouped list on the Profile menu.
 */
export function Card({ style, children, ...rest }: ViewProps) {
  const { colors, radii } = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderRadius: radii.lg }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    // Soft lift, matching the cards in the mockup.
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
