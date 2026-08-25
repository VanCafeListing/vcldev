import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { supabase } from './supabase';

type SessionState = {
  session: Session | null;
  /** True once the initial session lookup has finished. */
  ready: boolean;
  /** Set when the user chose "Start as a guest" on the splash screen. */
  isGuest: boolean;
  /** Either signed in or browsing as a guest — i.e. allowed into the tabs. */
  canEnterApp: boolean;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      // Signing in supersedes guest mode.
      if (nextSession) setIsGuest(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<SessionState>(
    () => ({
      session,
      ready,
      isGuest,
      canEnterApp: Boolean(session) || isGuest,
      continueAsGuest: () => setIsGuest(true),
      signOut: async () => {
        // Clear guest mode too, so signing out always lands back on the
        // splash screen rather than leaving the tabs reachable.
        setIsGuest(false);
        await supabase.auth.signOut();
      },
    }),
    [session, ready, isGuest]
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
