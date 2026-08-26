import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Linking,
  Platform,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmenityBadge, Icon } from '@/components/ui';
import { getCafeById, type Cafe } from '@/lib/cafes';
import { useFavouriteAction } from '@/lib/favourites';
import { useTheme } from '@/theme';

/** Figma (73:2412): hero photo, name + heart, address, description, amenities, map. */
const HERO_HEIGHT = 198;
const MAP_HEIGHT = 236;

function openInMaps(cafe: Cafe) {
  if (cafe.lat == null || cafe.lng == null) return;
  const label = encodeURIComponent(cafe.name);
  const url = Platform.select({
    ios: `maps:0,0?q=${label}@${cafe.lat},${cafe.lng}`,
    default: `geo:${cafe.lat},${cafe.lng}?q=${cafe.lat},${cafe.lng}(${label})`,
  });
  Linking.openURL(url).catch(() => undefined);
}

export default function CafeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, radii, spacing, typography } = useTheme();
  const router = useRouter();
  const { isFavourited, toggleFavourite } = useFavouriteAction();

  const cafeQuery = useQuery({
    queryKey: ['cafe', id],
    queryFn: () => getCafeById(id),
    enabled: Boolean(id),
  });

  const cafe = cafeQuery.data;

  if (cafeQuery.isLoading || !cafe) {
    return (
      <SafeAreaView style={[styles.root, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  const subtitle = [
    cafe.address,
    cafe.distance_meters != null
      ? cafe.distance_meters < 1000
        ? `${Math.round(cafe.distance_meters)}m`
        : `${(cafe.distance_meters / 1000).toFixed(1)}km`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl + 90 }}>
        <View>
          {cafe.photo_url ? (
            <Image
              source={{ uri: cafe.photo_url }}
              style={{ width: '100%', height: HERO_HEIGHT }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{ width: '100%', height: HERO_HEIGHT, backgroundColor: colors.placeholder }}
            />
          )}

          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            style={[
              styles.backButton,
              { top: spacing.md, left: spacing.md, borderRadius: radii.pill },
            ]}
          >
            <Text
              style={{
                color: colors.onCard,
                fontFamily: typography.family.bold,
                fontSize: typography.size.lg,
              }}
            >
              ‹
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.xl }}>
          <View style={[styles.titleRow, { marginTop: spacing.xl }]}>
            <Text
              style={{
                color: colors.text,
                fontFamily: typography.family.bold,
                fontSize: typography.size.xxl,
                flexShrink: 1,
              }}
            >
              {cafe.name}
            </Text>

            <Pressable
              onPress={() => toggleFavourite(cafe.id)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={
                isFavourited(cafe.id) ? 'Remove from favourites' : 'Add to favourites'
              }
            >
              <Icon
                name="Heart"
                size={24}
                color={isFavourited(cafe.id) ? colors.accent : colors.text}
              />
            </Pressable>
          </View>

          {subtitle ? (
            <View style={[styles.addressRow, { gap: spacing.xs, marginTop: spacing.sm }]}>
              <Icon name="LocationPin" size={14} color={colors.text} />
              <Text
                style={{
                  color: colors.text,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.md,
                }}
              >
                {subtitle}
              </Text>
            </View>
          ) : null}

          {cafe.description ? (
            <Text
              style={{
                color: colors.text,
                fontFamily: typography.family.regular,
                fontSize: typography.size.md,
                marginTop: spacing.xl,
                lineHeight: 24,
              }}
            >
              <Text style={{ fontFamily: typography.family.bold }}>Description: </Text>
              {cafe.description}
            </Text>
          ) : null}

          <View style={[styles.amenityRow, { gap: spacing.md, marginTop: spacing.xl }]}>
            <AmenityBadge
              label="Outlet"
              tone={cafe.outlets ? 'outlet' : 'neutral'}
              icon={<Icon name="Outlet" size={35} color={colors.text} />}
            />
            <AmenityBadge label="Wifi" tone={cafe.wifi ? 'wifi' : 'neutral'} />
            <AmenityBadge
              label="seats"
              tone="neutral"
              count={cafe.seat_count != null ? String(cafe.seat_count) : '—'}
            />
          </View>

          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.bold,
              fontSize: typography.size.md,
              marginTop: spacing.xl,
              marginBottom: spacing.md,
            }}
          >
            Location
          </Text>

          <CafeLocationCard cafe={cafe} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Figma draws this area as a grey "Link to map" placeholder — a WIP box, not
 * a designed surface. Rather than embed a real map view (which needs a
 * native build outside Expo Go), this opens the device's own Maps app, which
 * is closer to what the placeholder's label already implied.
 */
function CafeLocationCard({ cafe }: { cafe: Cafe }) {
  const { colors, radii, spacing, typography } = useTheme();

  if (cafe.lat == null || cafe.lng == null) return null;

  return (
    <Pressable
      onPress={() => openInMaps(cafe)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${cafe.name} in Maps`}
      style={[
        styles.mapCard,
        {
          height: MAP_HEIGHT,
          borderRadius: radii.lg,
          backgroundColor: colors.placeholder,
          gap: spacing.sm,
        },
      ]}
    >
      <Icon name="LocationPin" size={28} color={colors.text} />
      <Text
        style={{
          color: colors.text,
          fontFamily: typography.family.bold,
          fontSize: typography.size.md,
        }}
      >
        Open in Maps
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  backButton: {
    position: 'absolute',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityRow: {
    flexDirection: 'row',
  },
  mapCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
