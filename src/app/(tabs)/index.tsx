import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CafeCard } from '@/components/cafe-card';
import { Icon } from '@/components/ui';
import { getCafesFallback, getNearbyCafes } from '@/lib/cafes';
import { useFavouriteAction } from '@/lib/favourites';
import { useUserLocation } from '@/lib/use-user-location';
import { useTheme } from '@/theme';

/** Figma (70:2397): "Find a cafe" / "Cafes near you", cafe cards below. */
export default function HomeScreen() {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();
  const location = useUserLocation();
  const { isFavourited, toggleFavourite } = useFavouriteAction();

  const cafesQuery = useQuery({
    queryKey: ['cafes', location.status === 'granted' ? location.coords : 'fallback'],
    queryFn: () =>
      location.status === 'granted'
        ? getNearbyCafes(location.coords.lat, location.coords.lng)
        : getCafesFallback(),
    enabled: location.status !== 'loading',
  });

  const loading = location.status === 'loading' || cafesQuery.isLoading;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.surface }]} edges={['top']}>
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
              Find a cafe
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
              <Icon name="DotsFilled" size={24} color={colors.text} />
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
              No cafes to show yet.
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
});
