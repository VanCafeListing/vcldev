import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Icon } from '@/components/ui';
import type { Cafe } from '@/lib/cafes';
import { useTheme } from '@/theme';

const CARD_HEIGHT = 220;
const OVERLAY_HEIGHT = 135;

type CafeCardProps = {
  cafe: Cafe;
  isFavourited: boolean;
  onPress: () => void;
  onToggleFavourite: () => void;
};

export function CafeCard({ cafe, isFavourited, onPress, onToggleFavourite }: CafeCardProps) {
  const { colors, radii, spacing, typography } = useTheme();

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={cafe.name}>
      <Card style={[styles.card, { height: CARD_HEIGHT, borderRadius: radii.xl }]}>
        {/* 1. Full Photo Background */}
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

        {/* 2. Soft White Gradient Scrim */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0)',
            'rgba(255, 255, 255, 0.45)',
            'rgba(255, 255, 255, 0.85)',
            'rgba(255, 255, 255, 0.96)',
          ]}
          locations={[0, 0.3, 0.65, 1]}
          style={[styles.scrim, { height: OVERLAY_HEIGHT }]}
        />

        {/* 3. Text & Heart Content Overlay */}
        <View
          style={[styles.content, { paddingHorizontal: spacing.lg, paddingBottom: spacing.md }]}
        >
          {/* Title & Heart Row */}
          <View style={styles.titleRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontFamily: typography.family.bold,
                  fontSize: typography.size.lg,
                },
              ]}
            >
              {cafe.name}
            </Text>

            <Pressable
              onPress={onToggleFavourite}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Icon
                name={isFavourited ? 'HeartFilled' : 'Heart'}
                size={18}
                color={isFavourited ? colors.favourite : colors.text}
              />
            </Pressable>
          </View>

          {/* Address Row */}
          {cafe.address ? (
            <View style={[styles.addressRow, { gap: spacing.xs }]}>
              <View style={styles.pinWrapper}>
                <Icon name="LocationPin" size={14} color={colors.primary} />
              </View>
              <Text
                numberOfLines={2}
                style={{
                  color: colors.text,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.xs,
                  lineHeight: 16,
                  flex: 1,
                }}
              >
                {cafe.address}
              </Text>
            </View>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden',
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pinWrapper: {
    marginTop: 1,
  },
});
