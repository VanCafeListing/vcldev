import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { applyAuthSessionFromUrl } from './auth-session-url';
import { ensureProfile } from './ensure-profile';
import { supabase } from './supabase';

type SessionState = {
  session: Session | null;
  /** True once the initial session lookup has finished. */
  ready: boolean;
  /** Set when the user chose "Start as a guest" on the splash screen. */
  isGuest: boolean;
  /** Either signed in or browsing as a guest — i.e. allowed into the tabs. */
  canEnterApp: boolean;
  /**
   * True while the session came from a password-reset link. The session is
   * real, but the user must set a new password before being let into the app.
   */
  isRecovering: boolean;
  /** Called once the new password has been saved. */
  finishRecovery: () => void;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);

      // Opening a reset link establishes a real session. Flag it so routing
      // sends the user to set a new password rather than into the app.
      if (event === 'PASSWORD_RECOVERY') setIsRecovering(true);
      // Signing in supersedes guest mode.
      if (nextSession) {
        setIsGuest(false);
        // Fire-and-forget: repairs a missing profile row if the trigger never
        // ran. Never awaited, so it cannot delay entering the app.
        void ensureProfile(nextSession);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    const handleUrl = async (url: string | null) => {
      if (!url) return;

      try {
        const type = await applyAuthSessionFromUrl(url);
        if (active && type === 'recovery') setIsRecovering(true);
      } catch {
        // Auth screens surface errors for flows they launch. A malformed or
        // expired external link must not crash the app during cold start.
      }
    };

    void Linking.getInitialURL().then(handleUrl);
    const subscription = Linking.addEventListener('url', ({ url }) => void handleUrl(url));

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const value = useMemo<SessionState>(
    () => ({
      session,
      ready,
      isGuest,
      canEnterApp: (Boolean(session) && !isRecovering) || isGuest,
      isRecovering,
      finishRecovery: () => setIsRecovering(false),
      continueAsGuest: () => setIsGuest(true),
      signOut: async () => {
        // Clear guest mode too, so signing out always lands back on the
        // splash screen rather than leaving the tabs reachable.
        setIsGuest(false);
        setIsRecovering(false);
        await supabase.auth.signOut();
      },
    }),
    [session, ready, isGuest, isRecovering]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const state = useContext(SessionContext);

  if (!state) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return state;
}
