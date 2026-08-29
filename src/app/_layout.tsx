import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppPreloader } from '@/lib/app-preload';
import { FiltersProvider } from '@/lib/filters-context';
import { SessionProvider, useSession } from '@/lib/session';
import { ThemeProvider } from '@/theme';

/**
 * Sends the user to the auth stack or the tab shell depending on whether they
 * have a session (or chose to browse as a guest).
 */
function SessionRouter() {
  const { ready, canEnterApp, isRecovering } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;

    // `segments` is typed per-route, so index 1 is absent from the narrowest
    // variant even though it exists at runtime on nested routes.
    const path = segments as string[];
    const inAuthGroup = path[0] === '(auth)';
    const onResetScreen = path[1] === 'reset-password';

    // Legal documents sit outside the auth boundary: they must open for a
    // signed-out user reading the terms from Sign Up (who would otherwise be
    // thrown back to the splash mid-signup) AND for a signed-in user opening
    // them from the Profile tab (who would otherwise be thrown into the tabs).
    // Both redirects below therefore skip this segment.
    if (path[0] === 'legal') return;

    // A password-reset link produces a real session, but the user has to set a
    // new password before going anywhere else — so this case is handled ahead
    // of the ordinary signed-in routing below.
    if (isRecovering) {
      if (!onResetScreen) router.replace('/(auth)/reset-password');
      return;
    }

    if (!canEnterApp && !inAuthGroup) {
      router.replace('/(auth)/splash');
    } else if (canEnterApp && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [ready, canEnterApp, isRecovering, segments, router]);

  // Only once the user is actually in scope (signed in or guest) — mounting
  // this earlier would request location permission while still on the
  // splash/auth screens, before the user has even signed up or logged in.
  // A Stack, not a Slot: `Slot` renders one root-level route at a time with no
  // stack of its own, so navigating from `(auth)/sign-up` to a sibling route
  // (e.g. the legal documents) unmounted the whole `(auth)` Stack — going back
  // remounted it at its initial route and dumped the user on the splash with a
  // part-filled Sign Up form discarded. A Stack keeps the group mounted
  // underneath and pops back to exactly where the user left.
  return (
    <>
      {canEnterApp ? <AppPreloader /> : null}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  // One client for the app's lifetime; recreating it on render would drop the cache.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          // Cafe/favourite data doesn't change from under the user mid-session,
          // so a screen that already has (prefetched or previously-fetched)
          // data within this window renders it immediately instead of
          // refetching-and-flashing a spinner on every mount/tab switch.
          queries: { staleTime: 2 * 60 * 1000, gcTime: 30 * 60 * 1000 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SessionProvider>
            <FiltersProvider>
              <StatusBar style="dark" />
              <SessionRouter />
            </FiltersProvider>
          </SessionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
