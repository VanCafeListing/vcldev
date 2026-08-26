import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Icon } from '@/components/ui';
import type { Cafe } from '@/lib/cafes';
import { useTheme } from '@/theme';

/** Figma (70:2397): 362x236, the photo fills the top 155pt. */
const CARD_HEIGHT = 236;
const PHOTO_HEIGHT = 155;

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
      <Card style={[styles.card, { height: CARD_HEIGHT, backgroundColor: colors.card }]}>
        {cafe.photo_url ? (
          <Image
            source={{ uri: cafe.photo_url }}
            style={{ width: '100%', height: PHOTO_HEIGHT }}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View
            style={{ width: '100%', height: PHOTO_HEIGHT, backgroundColor: colors.placeholder }}
          />
        )}

        <View style={[styles.footer, { paddingHorizontal: spacing.lg, paddingTop: spacing.sm }]}>
          <View style={styles.footerText}>
            <Text
              numberOfLines={1}
              style={{
                color: colors.onCard,
                fontFamily: typography.family.bold,
                fontSize: typography.size.lg,
              }}
            >
              {cafe.name}
            </Text>

            <View style={[styles.addressRow, { gap: spacing.xs }]}>
              <Icon name="LocationPin" size={14} color={colors.onCard} />
              <Text
                numberOfLines={1}
                style={{
                  color: colors.onCard,
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
            <Icon name="Heart" size={24} color={isFavourited ? colors.accent : colors.onCard} />
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
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  footerText: {
    flex: 1,
    gap: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
