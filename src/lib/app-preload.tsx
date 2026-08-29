import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';

import { cafesQueryOptions, type Cafe } from './cafes';
import { favouritedCafesQueryOptions, favouritesQueryOptions } from './favourites';
import { useFilters } from './filters-context';
import { getRecommendedCafes } from './search';
import { useSession } from './session';
import { useUserLocation } from './use-user-location';

/**
 * Mounted once, above the tab navigator, as soon as the user is let into the
 * app. Renders nothing — it just warms the caches Home, Map, Search, and the
 * Cafe detail screen are about to need, so those screens open with data
 * already in place instead of each showing its own spinner.
 */
export function AppPreloader() {
  const { ready, canEnterApp, session } = useSession();
  const location = useUserLocation();
  const { criteria } = useFilters();
  const queryClient = useQueryClient();
  const seededCafeIds = useRef(new Set<string>());
  const userId = session?.user.id;

  // The cafe list: Home and Map's shared query. Once it lands, seed each
  // cafe's detail-screen cache and warm its image so both are instant too.
  useEffect(() => {
    if (!ready || !canEnterApp || location.status === 'loading') return;

    const options = cafesQueryOptions(location, criteria);

    queryClient.prefetchQuery(options).then(() => {
      const cafes = queryClient.getQueryData<Cafe[]>(options.queryKey);
      if (!cafes) return;

      for (const cafe of cafes) {
        if (seededCafeIds.current.has(cafe.id)) continue;
        seededCafeIds.current.add(cafe.id);

        queryClient.setQueryData(['cafe', cafe.id], cafe);
        if (cafe.photo_url) void Image.prefetch(cafe.photo_url);
      }
    });
  }, [ready, canEnterApp, location, criteria, queryClient]);

  // Search tab's "Recommended" list — no arguments, safe to warm unconditionally.
  useEffect(() => {
    if (!ready || !canEnterApp) return;
    void queryClient.prefetchQuery({ queryKey: ['recommended-cafes'], queryFn: getRecommendedCafes });
  }, [ready, canEnterApp, queryClient]);

  // Favourites: only meaningful once signed in (guests have none).
  useEffect(() => {
    if (!userId) return;
    void queryClient.prefetchQuery(favouritesQueryOptions(userId));
    void queryClient.prefetchQuery(favouritedCafesQueryOptions(userId));
  }, [userId, queryClient]);

  return null;
}
