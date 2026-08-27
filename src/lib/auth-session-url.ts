import * as Linking from 'expo-linking';

import { supabase } from './supabase';

export type AuthLinkType = 'recovery' | 'signup' | 'invite' | 'magiclink' | null;

/** Stable callback URI used in Supabase's redirect allow list. */
export function authRedirectUrl(path: string): string {
  return Linking.createURL(path.replace(/^\//, ''), { scheme: 'vancafelisting' });
}

function authParams(url: string): URLSearchParams {
  const parsed = new URL(url);
  const params = new URLSearchParams(parsed.search);
  const fragment = new URLSearchParams(parsed.hash.replace(/^#/, ''));

  fragment.forEach((value, key) => params.set(key, value));
  return params;
}

/**
 * Adopts a Supabase session carried by an app deep link.
 *
 * Supabase's implicit mobile flow returns tokens in the URL fragment. PKCE
 * callbacks return a code instead, so both shapes are supported here. The
 * client deliberately has `detectSessionInUrl: false`; React Native has no
 * browser URL for supabase-js to inspect automatically.
 */
export async function applyAuthSessionFromUrl(url: string): Promise<AuthLinkType> {
  const params = authParams(url);
  const errorDescription = params.get('error_description');
  if (errorDescription) throw new Error(errorDescription);

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const code = params.get('code');

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
  } else {
    return null;
  }

  const type = params.get('type');
  return type === 'recovery' || type === 'signup' || type === 'invite' || type === 'magiclink'
    ? type
    : null;
}
