import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { promptGuestToSignIn } from './guest-favourite-prompt';
import { supabase } from './supabase';
import { useSession } from './session';
import type { Cafe } from './cafes';

const CAFE_COLUMNS =
  'id, name, description, address, photo_url, price_range, wifi, outlets, seat_count, ' +
  'commuter_friendly, parking, seating_spacious, seating_wide_tables, seating_patio, ' +
  'atmosphere_quiet, atmosphere_lively, lat, lng';

/**
 * Every screen that shows a heart icon reads from this one query key, so
 * favouriting a cafe on the Home feed is immediately reflected on its detail
 * screen (and vice versa) without each screen tracking its own copy.
 */
const favouritesKey = (userId: string | undefined) => ['favourites', userId] as const;

/** The Favourites screen's full-card-data cache — kept in sync with the id-only cache above. */
const favouritedCafesKey = (userId: string | undefined) => ['favourites', userId, 'full'] as const;

async function fetchFavouriteCafeIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase.from('favourites').select('cafe_id').eq('user_id', userId);
  if (error) throw error;
  return new Set((data ?? []).map((row) => row.cafe_id));
}

/** The current user's favourited cafe ids. Empty (and disabled) for guests. */
export function useFavouriteIds() {
  const { session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: favouritesKey(userId),
    queryFn: () => fetchFavouriteCafeIds(userId as string),
    enabled: Boolean(userId),
  });
}

/** Full cafe records for the Favourites screen — a single join, not N+1 lookups off the id cache. */
async function getFavouritedCafes(userId: string): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from('favourites')
    .select(`cafe:cafes(${CAFE_COLUMNS})`)
    .eq('user_id', userId);
  if (error) throw error;
  return ((data ?? []) as unknown as { cafe: Cafe }[]).map((row) => row.cafe);
}

/** The Favourites screen's list. Empty (and disabled) for guests. */
export function useFavouritedCafes() {
  const { session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: favouritedCafesKey(userId),
    queryFn: () => getFavouritedCafes(userId as string),
    enabled: Boolean(userId),
  });
}

/**
 * Optimistic favourite/unfavourite toggle. Flips the icon immediately by
 * updating the shared cache, then rolls back if the write fails.
 */
export function useToggleFavourite() {
  const { session } = useSession();
  const userId = session?.user.id;
  const queryClient = useQueryClient();
  const key = favouritesKey(userId);
  const fullKey = favouritedCafesKey(userId);

  return useMutation({
    mutationFn: async ({ cafeId, isFavourited }: { cafeId: string; isFavourited: boolean }) => {
      if (!userId) throw new Error('Must be signed in to favourite a cafe');

      const { error } = isFavourited
        ? await supabase.from('favourites').delete().eq('user_id', userId).eq('cafe_id', cafeId)
        : await supabase.from('favourites').insert({ user_id: userId, cafe_id: cafeId });

      if (error) throw error;
    },
    onMutate: async ({ cafeId, isFavourited }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Set<string>>(key);

      queryClient.setQueryData<Set<string>>(key, (current) => {
        const next = new Set(current ?? []);
        if (isFavourited) next.delete(cafeId);
        else next.add(cafeId);
        return next;
      });

      // Optimistically drop the card from the Favourites screen's list too,
      // so unfavouriting there removes it without waiting on a refetch.
      if (isFavourited) {
        queryClient.setQueryData<Cafe[]>(fullKey, (current) =>
          current?.filter((cafe) => cafe.id !== cafeId)
        );
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: fullKey });
    },
  });
}

/**
 * The heart-tap handler shared by cafe cards and the Cafe detail screen: a
 * guest is prompted to sign in rather than the tap silently failing, and a
 * signed-in user's tap toggles the favourite.
 */
export function useFavouriteAction() {
  const { session, isGuest } = useSession();
  const router = useRouter();
  const { data: favouriteIds } = useFavouriteIds();
  const toggle = useToggleFavourite();

  function toggleFavourite(cafeId: string) {
    if (!session || isGuest) {
      promptGuestToSignIn(router);
      return;
    }
    toggle.mutate({ cafeId, isFavourited: favouriteIds?.has(cafeId) ?? false });
  }

  return {
    isFavourited: (cafeId: string) => favouriteIds?.has(cafeId) ?? false,
    toggleFavourite,
  };
}
