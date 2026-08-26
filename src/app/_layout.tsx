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
  const { ready, canEnterApp, isRecovering } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;

    const inAuthGroup = segments[0] === '(auth)';
    const onResetScreen = segments[1] === 'reset-password';

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
