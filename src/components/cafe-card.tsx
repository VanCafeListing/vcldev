import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Icon } from '@/components/ui';
import type { Cafe } from '@/lib/cafes';
import { useTheme } from '@/theme';

/**
 * PDF Home artboard: the photo fills the whole card; name/address/heart sit
 * directly over its bottom edge on a white-to-transparent scrim, rather than
 * a separate solid-brown footer block (that was the Figma Styleguide page's
 * treatment — superseded now the PDF is the primary design source).
 */
const CARD_HEIGHT = 236;
const OVERLAY_HEIGHT = 100;

type CafeCardProps = {
  cafe: Cafe;
  isFavourited: boolean;
  onPress: () => void;
  onToggleFavourite: () => void;
};

function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`;
}

export function CafeCard({ cafe, isFavourited, onPress, onToggleFavourite }: CafeCardProps) {
  const { colors, radii, spacing, typography } = useTheme();

  const subtitle = [
    cafe.address,
    cafe.distance_meters != null && formatDistance(cafe.distance_meters),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={cafe.name}>
      <Card style={[styles.card, { height: CARD_HEIGHT }]}>
        {cafe.photo_url ? (
          <Image
            source={{ uri: cafe.photo_url }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.placeholder }]} />
        )}

        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0.92)']}
          style={[styles.scrim, { height: OVERLAY_HEIGHT }]}
        />

        <View style={[styles.footer, { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }]}>
          <View style={styles.footerText}>
            <Text
              numberOfLines={1}
              style={{
                color: colors.text,
                fontFamily: typography.family.bold,
                fontSize: typography.size.lg,
              }}
            >
              {cafe.name}
            </Text>

            <View style={[styles.addressRow, { gap: spacing.xs }]}>
              <Icon name="LocationPin" size={14} color={colors.primary} />
              <Text
                numberOfLines={1}
                style={{
                  color: colors.text,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.md,
                  flexShrink: 1,
                }}
              >
                {subtitle}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onToggleFavourite}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            style={{ borderRadius: radii.pill }}
          >
            <Icon name="Heart" size={22} color={isFavourited ? colors.primary : colors.text} />
          </Pressable>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  footerText: {
    flex: 1,
    gap: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
