import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { ComponentProps } from 'react';

import { useTheme } from '@/theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type AmenityBadgeProps = {
  label: string;
  /** Icon-style tile (Outlets, Wi-Fi). Ignored when `count` is given. */
  icon?: IoniconName;
  /** Count-style tile — renders large text instead of an icon, e.g. "20+". */
  count?: string;
  /**
   * Shows the circled checkmark in the corner. In the design only the boolean
   * amenities (Outlets, Wi-Fi) carry it; the seat-count tile does not.
   */
  verified?: boolean;
};

/**
 * An amenity tile from the cafe detail screen: an amber rounded square holding
 * either an icon or a count, with the amenity name beneath it.
 */
export function AmenityBadge({ label, icon, count, verified = false }: AmenityBadgeProps) {
  const { colors, radii, spacing, typography } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.tile,
          {
            backgroundColor: colors.accentSoft,
            borderRadius: radii.md,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            gap: spacing.xs,
          },
        ]}
      >
        {count ? (
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.black,
              fontSize: typography.size.xl,
            }}
          >
            {count}
          </Text>
        ) : icon ? (
          <Ionicons name={icon} size={typography.size.xl} color={colors.text} />
        ) : null}

        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.regular,
            fontSize: typography.size.sm,
          }}
        >
          {label}
        </Text>
      </View>

      {verified ? (
        <View
          style={[styles.check, { backgroundColor: colors.accent, borderColor: colors.surface }]}
          accessibilityLabel={`${label} verified`}
        >
          <Ionicons name="checkmark" size={14} color={colors.onAccent} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // Lets the checkmark overhang the tile's top-right corner.
    paddingTop: 8,
    paddingRight: 8,
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 92,
  },
  check: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
