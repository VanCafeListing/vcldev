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
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmenityBadge, Icon } from '@/components/ui';
import { getCafeById, type Cafe } from '@/lib/cafes';
import { useFavouriteAction } from '@/lib/favourites';
import { useTheme } from '@/theme';

/** PDF Cafe-detail artboard: hero photo, name + heart, address, distance
 * ribbon, About, amenity tiles, Location map. */
const HERO_HEIGHT = 220;
const MAP_HEIGHT = 236;

function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`;
}

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
                size={22}
                color={isFavourited(cafe.id) ? colors.primary : colors.text}
              />
            </Pressable>
          </View>

          {cafe.address ? (
            <View style={[styles.addressRow, { gap: spacing.xs, marginTop: spacing.sm }]}>
              <Icon name="LocationPin" size={14} color={colors.primary} />
              <Text
                style={{
                  color: colors.text,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.md,
                  flexShrink: 1,
                }}
              >
                {cafe.address}
              </Text>
            </View>
          ) : null}

          {cafe.rating != null ? (
            <View style={[styles.addressRow, { gap: spacing.xs, marginTop: spacing.sm }]}>
              <Text style={{ color: '#FFC107', fontSize: typography.size.md }}>★</Text>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: typography.family.bold,
                  fontSize: typography.size.md,
                }}
              >
                {cafe.rating.toFixed(1)}
              </Text>
              {cafe.user_ratings_total != null ? (
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: typography.family.regular,
                    fontSize: typography.size.md,
                  }}
                >
                  ({cafe.user_ratings_total.toLocaleString()} Google reviews)
                </Text>
              ) : null}
            </View>
          ) : null}

          {cafe.distance_meters != null ? (
            <View style={[styles.distanceBadgeRow, { marginTop: spacing.md }]}>
              <View
                style={[
                  styles.distanceBadge,
                  { backgroundColor: colors.primary, borderRadius: radii.sm },
                ]}
              >
                <Text
                  style={{
                    color: colors.onPrimary,
                    fontFamily: typography.family.bold,
                    fontSize: typography.size.sm,
                  }}
                >
                  {formatDistance(cafe.distance_meters)}
                </Text>
              </View>
              <View style={[styles.distanceBadgePoint, { borderLeftColor: colors.primary }]} />
            </View>
          ) : null}

          {cafe.description ? (
            <View style={{ marginTop: spacing.xl }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: typography.family.bold,
                  fontSize: typography.size.md,
                }}
              >
                About
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.md,
                  marginTop: spacing.xs,
                  lineHeight: 24,
                }}
              >
                {cafe.description}
              </Text>
            </View>
          ) : null}

          <View style={[styles.amenityRow, { gap: spacing.md, marginTop: spacing.xl }]}>
            <AmenityBadge
              label="Outlets"
              verified={cafe.outlets}
              icon={<Icon name="Outlet" size={30} color={colors.text} />}
            />
            <AmenityBadge
              label="Wi-Fi"
              verified={cafe.wifi}
              icon={<Icon name="Wifi" size={26} color={colors.text} />}
            />
            <AmenityBadge
              label="seats"
              count={cafe.seat_count != null ? `${cafe.seat_count}+` : '—'}
            />
          </View>

          {cafe.phone || cafe.website ? (
            <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
              {cafe.phone ? (
                <ContactRow
                  label={cafe.phone}
                  accessibilityLabel={`Call ${cafe.name}`}
                  onPress={() =>
                    Linking.openURL(`tel:${cafe.phone!.replace(/[^\d+]/g, '')}`).catch(
                      () => undefined
                    )
                  }
                />
              ) : null}
              {cafe.website ? (
                <ContactRow
                  label={cafe.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  accessibilityLabel={`Open ${cafe.name}'s website`}
                  onPress={() => Linking.openURL(cafe.website!).catch(() => undefined)}
                />
              ) : null}
            </View>
          ) : null}

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

/** A tappable phone/website line, styled as a link. */
function ContactRow({
  label,
  accessibilityLabel,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const { colors, typography } = useTheme();

  return (
    <Pressable onPress={onPress} accessibilityRole="link" accessibilityLabel={accessibilityLabel}>
      <Text
        style={{
          color: colors.primary,
          fontFamily: typography.family.regular,
          fontSize: typography.size.md,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** A small non-interactive map preview centred on the cafe, tapping through
 * to the device's Maps app for directions/full interaction. */
function CafeLocationCard({ cafe }: { cafe: Cafe }) {
  const { colors, radii, spacing, typography } = useTheme();

  if (cafe.lat == null || cafe.lng == null) return null;

  return (
    <Pressable
      onPress={() => openInMaps(cafe)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${cafe.name} in Maps`}
      style={[styles.mapCard, { height: MAP_HEIGHT, borderRadius: radii.lg }]}
    >
      <MapView
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        initialRegion={{
          latitude: cafe.lat,
          longitude: cafe.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: cafe.lat, longitude: cafe.lng }} title={cafe.name} />
      </MapView>

      <View
        style={[
          styles.mapCardLabel,
          {
            bottom: spacing.sm,
            left: spacing.sm,
            right: spacing.sm,
            borderRadius: radii.md,
            paddingVertical: spacing.sm,
            gap: spacing.xs,
          },
        ]}
      >
        <Icon name="LocationPin" size={16} color={colors.onPrimary} />
        <Text
          style={{
            color: colors.onPrimary,
            fontFamily: typography.family.bold,
            fontSize: typography.size.sm,
          }}
        >
          Open in Maps
        </Text>
      </View>
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
    alignItems: 'flex-start',
  },
  distanceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'flex-start',
  },
  distanceBadge: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  /** The PDF's distance badge is a ribbon with a pointed right edge, not a
   * plain pill — a CSS-triangle abutting the badge's rounded-rect body. */
  distanceBadgePoint: {
    width: 0,
    height: 0,
    alignSelf: 'center',
    borderTopWidth: 13,
    borderBottomWidth: 13,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  amenityRow: {
    flexDirection: 'row',
  },
  mapCard: {
    width: '100%',
    overflow: 'hidden',
  },
  mapCardLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
});
