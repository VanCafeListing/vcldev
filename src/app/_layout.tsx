import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider, useSession } from '@/lib/session';
import { ThemeProvider } from '@/theme';

/**
 * Sends the user to the auth stack or the tab shell depending on whether they
 * have a session (or chose to browse as a guest).
 */
function SessionRouter() {
  const { ready, canEnterApp } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!canEnterApp && !inAuthGroup) {
      router.replace('/(auth)/splash');
    } else if (canEnterApp && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [ready, canEnterApp, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  // One client for the app's lifetime; recreating it on render would drop the cache.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SessionProvider>
            <StatusBar style="dark" />
            <SessionRouter />
          </SessionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
