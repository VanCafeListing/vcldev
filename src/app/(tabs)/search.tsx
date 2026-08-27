import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CafeCard } from '@/components/cafe-card';
import { Chip, Icon, TextInput } from '@/components/ui';
import { useFavouriteAction } from '@/lib/favourites';
import { useFilters } from '@/lib/filters-context';
import { getRecentSearches, getRecommendedCafes, recordSearch, searchCafes } from '@/lib/search';
import { useSession } from '@/lib/session';
import { useTheme } from '@/theme';

/** Figma 75:2474 "Search_home" — no PDF equivalent, so Figma stays primary here. */
const DEBOUNCE_MS = 350;

export default function SearchScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const router = useRouter();
  const { session, isGuest } = useSession();
  const { isFavourited, toggleFavourite } = useFavouriteAction();
  const { criteria } = useFilters();
  const queryClient = useQueryClient();

  const [input, setInput] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(input.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [input]);

  const isSearching = debounced.length > 0;

  const recentQuery = useQuery({
    queryKey: ['recent-searches', session?.user.id],
    queryFn: () => getRecentSearches(session!.user.id),
    enabled: Boolean(session) && !isGuest,
  });

  const recommendedQuery = useQuery({
    queryKey: ['recommended-cafes'],
    queryFn: getRecommendedCafes,
    enabled: !isSearching,
  });

  const resultsQuery = useQuery({
    queryKey: ['search-cafes', debounced, criteria],
    queryFn: () => searchCafes(debounced, criteria),
    enabled: isSearching,
  });

  function runSearch(term: string) {
    setInput(term);
    setDebounced(term);
    if (session && !isGuest) {
      recordSearch(session.user.id, term).then(() => {
        queryClient.invalidateQueries({ queryKey: ['recent-searches', session.user.id] });
      });
    }
  }

  const list = isSearching ? (resultsQuery.data ?? []) : (recommendedQuery.data ?? []);
  const loading = isSearching ? resultsQuery.isLoading : recommendedQuery.isLoading;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.searchBackground }]} edges={['top']}>
      <FlatList
        data={list}
        keyExtractor={(cafe) => cafe.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: spacing.xl,
          paddingBottom: spacing.xxxl + 90,
          gap: spacing.xl,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.lg, gap: spacing.lg }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: typography.family.bold,
                fontSize: typography.size.xl,
              }}
            >
              Tailored to your needs
            </Text>

            <View style={[styles.searchRow, { gap: spacing.md }]}>
              <TextInput
                label="Search"
                containerStyle={{ flex: 1, gap: spacing.xs }}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => runSearch(input.trim())}
                placeholder="Search cafes by name"
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                leading={<Icon name="TabSearch" size={18} color={colors.textMuted} />}
              />

              <Pressable
                onPress={() => router.push('/filters')}
                accessibilityRole="button"
                accessibilityLabel="Filters"
                style={[styles.filterButton, { borderColor: colors.border, borderRadius: radii.md }]}
              >
                <Icon name="FilterSliders" size={20} color={colors.text} />
              </Pressable>
            </View>

            {!isSearching && session && !isGuest && (recentQuery.data?.length ?? 0) > 0 ? (
              <View>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: typography.family.regular,
                    fontSize: typography.size.lg,
                    marginBottom: spacing.md,
                  }}
                >
                  Recent searches
                </Text>
                <View style={[styles.chipRow, { gap: spacing.sm }]}>
                  {recentQuery.data!.map((r) => (
                    <Chip
                      key={r.query}
                      label={r.query}
                      selected={false}
                      pill
                      onPress={() => runSearch(r.query)}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            <Text
              style={{
                color: colors.text,
                fontFamily: typography.family.regular,
                fontSize: typography.size.lg,
              }}
            >
              {isSearching ? 'Results' : 'Recommendation'}
            </Text>
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
              {isSearching ? 'No cafes found.' : 'No recommendations yet.'}
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  filterButton: {
    width: 46,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
