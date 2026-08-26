import { StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { useTheme } from '@/theme';

/**
 * Which amenity the tile represents. The Figma detail screen gives each its
 * own background: two greens for the boolean amenities and a neutral for the
 * seat count.
 */
export type AmenityTone = 'outlet' | 'wifi' | 'neutral';

type AmenityBadgeProps = {
  label: string;
  tone: AmenityTone;
  /** Icon-style tile — pass the exported icon for the amenity. */
  icon?: ReactNode;
  /** Count-style tile: large number above the label, e.g. "24" seats. */
  count?: string;
};

/** Figma: 105x101 tile, 15pt radius. */
const TILE_WIDTH = 105;
const TILE_HEIGHT = 101;

/**
 * An amenity tile from the cafe detail screen.
 *
 * Note there is no "verified" checkmark in the hi-fi design — an earlier
 * iteration had one, but the current frames use the tile's background colour
 * alone to distinguish the amenities.
 */
export function AmenityBadge({ label, tone, icon, count }: AmenityBadgeProps) {
  const { colors, radii, typography } = useTheme();

  const background = {
    outlet: colors.amenityOutlet,
    wifi: colors.amenityWifi,
    neutral: colors.amenityNeutral,
  }[tone];

  return (
    <View style={[styles.tile, { backgroundColor: background, borderRadius: radii.lg }]}>
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
  );
}

const styles = StyleSheet.create({
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
