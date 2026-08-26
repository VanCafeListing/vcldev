import { supabase } from './supabase';

/**
 * Signs in with either a username or an email address.
 *
 * The work happens in the `sign-in` Edge Function: Supabase only accepts an
 * email, and resolving a username to one client-side would expose a lookup
 * anybody could use to harvest addresses. The function returns tokens, which
 * we adopt as the local session — that triggers `onAuthStateChange`, and the
 * session-aware root layout does the navigating.
 *
 * Throws a plain Error on any failure. The caller passes it to
 * `authErrorMessage`, which maps every credential failure to one message so
 * the screen cannot be used to probe which identifiers exist.
 */
export async function signInWithIdentifier(identifier: string, password: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke<{
    access_token: string;
    refresh_token: string;
  }>('sign-in', {
    body: { identifier, password },
  });

  if (error || !data?.access_token || !data?.refresh_token) {
    throw new Error('invalid_credentials');
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  if (sessionError) throw sessionError;
}
