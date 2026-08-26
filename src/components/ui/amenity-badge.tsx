import { StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { useTheme } from '@/theme';
import { Icon } from './icon';

type AmenityBadgeProps = {
  label: string;
  /** Icon-style tile — pass the exported icon for the amenity. */
  icon?: ReactNode;
  /** Count-style tile: large number above the label, e.g. "20+" seats. */
  count?: string;
  /**
   * Shows the amber "verified" checkmark badge overlapping the tile's
   * top-right corner (PDF: Outlets/Wifi carry it, the seat-count tile
   * doesn't).
   */
  verified?: boolean;
};

/** PDF: ~105x101 tile, ~15pt radius, all three tiles share one amber tone. */
const TILE_WIDTH = 105;
const TILE_HEIGHT = 101;
const BADGE_SIZE = 34;

/** An amenity tile from the cafe detail screen. */
export function AmenityBadge({ label, icon, count, verified }: AmenityBadgeProps) {
  const { colors, radii, typography } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.tile, { backgroundColor: colors.amenityTile, borderRadius: radii.lg }]}>
        {count ? (
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.black,
              fontSize: 32,
              letterSpacing: -0.352,
            }}
          >
            {count}
          </Text>
        ) : (
          icon
        )}

        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.regular,
            fontSize: typography.size.md,
            letterSpacing: -0.176,
          }}
        >
          {label}
        </Text>
      </View>

      {verified ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: colors.amenityCheck, borderColor: colors.surface },
          ]}
        >
          <Icon name="Checkmark" size={16} color={colors.text} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: TILE_WIDTH,
  },
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
