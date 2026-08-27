import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CafeCard } from '@/components/cafe-card';
import { Button } from '@/components/ui';
import { useFavouriteAction, useFavouritedCafes } from '@/lib/favourites';
import { useSession } from '@/lib/session';
import { useTheme } from '@/theme';

/**
 * Pushed from the Profile menu's "♥ Favourites" button (wired by
 * `profile-settings`, not this change) — not a bottom-nav tab. Reuses
 * `cafe-discovery`'s card and toggle mutation rather than duplicating
 * either.
 */
export default function FavouritesScreen() {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();
  const { session, isGuest } = useSession();
  const { isFavourited, toggleFavourite } = useFavouriteAction();
  const isSignedIn = Boolean(session) && !isGuest;
  const favouritesQuery = useFavouritedCafes();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl, paddingTop: spacing.md }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
        >
          <Text style={{ color: colors.text, fontSize: typography.size.lg }}>‹ Back</Text>
        </Pressable>
        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.bold,
            fontSize: typography.size.xl,
          }}
        >
          Favourites
        </Text>
      </View>

      {!isSignedIn ? (
        <View style={[styles.centered, { padding: spacing.xl, gap: spacing.lg }]}>
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.bold,
              fontSize: typography.size.lg,
              textAlign: 'center',
            }}
          >
            Sign in to see your favourites
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: typography.family.regular,
              fontSize: typography.size.md,
              textAlign: 'center',
            }}
          >
            Create an account or log in to save and view your favourite cafes.
          </Text>
          <Button label="Log In" onPress={() => router.push('/(auth)/log-in')} fullWidth={false} />
          <Button
            label="Sign Up"
            variant="secondary"
            onPress={() => router.push('/(auth)/sign-up')}
            fullWidth={false}
          />
        </View>
      ) : (
        <FlatList
          data={favouritesQuery.data ?? []}
          keyExtractor={(cafe) => cafe.id}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl }}
          renderItem={({ item }) => (
            <CafeCard
              cafe={item}
              isFavourited={isFavourited(item.id)}
              onPress={() => router.push(`/cafe/${item.id}`)}
              onToggleFavourite={() => toggleFavourite(item.id)}
            />
          )}
          ListEmptyComponent={
            favouritesQuery.isLoading ? (
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
                No favourites yet.
              </Text>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
