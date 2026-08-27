import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CafeCard } from '@/components/cafe-card';
import { Icon } from '@/components/ui';
import { getCafesFallback, getNearbyCafes } from '@/lib/cafes';
import { getFirstName } from '@/lib/display-name';
import { useFavouriteAction } from '@/lib/favourites';
import { useFilters } from '@/lib/filters-context';
import { useSession } from '@/lib/session';
import { useUserLocation } from '@/lib/use-user-location';
import { useTheme } from '@/theme';

/** PDF Home artboard: "Hi, {name}!" / "Cafes near you", cafe cards below. */
export default function HomeScreen() {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();
  const { session } = useSession();
  const location = useUserLocation();
  const { isFavourited, toggleFavourite } = useFavouriteAction();
  const { criteria, isActive } = useFilters();

  const cafesQuery = useQuery({
    queryKey: [
      'cafes',
      location.status === 'granted' ? location.coords : 'fallback',
      criteria,
    ],
    queryFn: () =>
      location.status === 'granted'
        ? getNearbyCafes(location.coords.lat, location.coords.lng, criteria)
        : getCafesFallback(criteria),
    enabled: location.status !== 'loading',
  });

  const loading = location.status === 'loading' || cafesQuery.isLoading;
  const firstName = getFirstName(session);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top']}>
      <FlatList
        data={cafesQuery.data ?? []}
        keyExtractor={(cafe) => cafe.id}
        contentContainerStyle={{
          padding: spacing.xl,
          paddingBottom: spacing.xxxl + 90,
          gap: spacing.xl,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.lg }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: typography.family.bold,
                fontSize: typography.size.xxl,
                marginBottom: spacing.xl,
              }}
            >
              {firstName ? `Hi, ${firstName}!` : 'Find a cafe'}
            </Text>

            <View style={styles.sectionRow}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.lg,
                }}
              >
                Cafes near you
              </Text>
              <Pressable
                onPress={() => router.push('/filters')}
                accessibilityRole="button"
                accessibilityLabel="Filters"
                hitSlop={8}
              >
                <Icon name="DotsFilled" size={24} color={colors.text} />
                {isActive ? (
                  <View
                    style={[styles.filterBadge, { backgroundColor: colors.primary }]}
                  />
                ) : null}
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <CafeCard
            cafe={item}
            isFavourited={isFavourited(item.id)}
            onPress={() => router.push(`/cafe/${item.id}`)}
            onToggleFavourite={() => toggleFavourite(item.id)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
          ) : (
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: typography.family.regular,
                fontSize: typography.size.md,
                textAlign: 'center',
                marginTop: spacing.xxl,
              }}
            >
              {isActive ? 'No cafes match these filters.' : 'No cafes to show yet.'}
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
