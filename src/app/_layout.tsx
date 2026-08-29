import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
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
  return (
    <>
      {canEnterApp ? <AppPreloader /> : null}
      <Slot />
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
