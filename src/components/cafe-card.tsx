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
const OVERLAY_HEIGHT = 150;

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

        {cafe.rating != null ? (
          <View
            style={[
              styles.ratingBadge,
              {
                top: spacing.sm,
                right: spacing.sm,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.sm,
                gap: 4,
              },
            ]}
            accessibilityLabel={`Rated ${cafe.rating} out of 5${
              cafe.user_ratings_total != null ? ` from ${cafe.user_ratings_total} reviews` : ''
            }`}
          >
            <Text style={{ color: '#FFC107', fontSize: typography.size.sm }}>★</Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: typography.family.bold,
                fontSize: typography.size.sm,
              }}
            >
              {cafe.rating.toFixed(1)}
            </Text>
            {cafe.user_ratings_total != null ? (
              <Text
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.sm,
                }}
              >
                ({cafe.user_ratings_total})
              </Text>
            ) : null}
          </View>
        ) : null}

        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.75)',
            'rgba(255,255,255,0.96)',
            'rgba(255,255,255,0.98)',
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={[styles.scrim, { height: OVERLAY_HEIGHT }]}
        />

        <View style={[styles.footer, { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }]}>
          <View style={styles.footerText}>
            <Text
              numberOfLines={1}
              style={[
                styles.nameShadow,
                {
                  color: colors.text,
                  fontFamily: typography.family.bold,
                  fontSize: typography.size.lg,
                },
              ]}
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
            <Icon
              name={isFavourited ? 'HeartFilled' : 'Heart'}
              size={22}
              color={isFavourited ? colors.favourite : colors.text}
            />
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
  /** Sits over the photo's top-right, above the scrim's reach — hence its own
   * dark pill rather than relying on the white-to-transparent gradient. */
  ratingBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
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
  /** Extra insurance for the name, which sits highest — where the scrim is
   * still ramping up — so it stays legible over a bright/busy photo. */
  nameShadow: {
    textShadowColor: 'rgba(255,255,255,0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});
