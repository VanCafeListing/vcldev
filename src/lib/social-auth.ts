import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { applyAuthSessionFromUrl, authRedirectUrl } from './auth-session-url';
import { supabase } from './supabase';

export type WebOAuthProvider = 'google' | 'facebook';

WebBrowser.maybeCompleteAuthSession();

/** Native Sign in with Apple for iOS, exchanged for a Supabase session. */
export async function signInWithApple(): Promise<'success' | 'cancelled'> {
  if (Platform.OS !== 'ios' || !(await AppleAuthentication.isAvailableAsync())) {
    throw new Error('Apple sign-in is available on iOS only.');
  }

  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!credential.identityToken) throw new Error('Apple did not return an identity token.');

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
      nonce: rawNonce,
    });
    if (error) throw error;

    // Apple supplies the name only on first consent. Preserve it immediately
    // because later Apple sign-ins return null for these fields.
    const name = credential.fullName
      ? AppleAuthentication.formatFullName(credential.fullName).trim()
      : '';
    if (name && data.user) {
      await Promise.all([
        supabase.auth.updateUser({ data: { full_name: name } }),
        supabase.from('profiles').update({ name }).eq('id', data.user.id),
      ]);
    }

    return 'success';
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as Error & { code?: string }).code === 'ERR_REQUEST_CANCELED'
    ) {
      return 'cancelled';
    }
    throw error;
  }
}

/** Browser OAuth for Google/Facebook, completed back into the app scheme. */
export async function signInWithWebProvider(
  provider: WebOAuthProvider
): Promise<'success' | 'cancelled'> {
  const redirectTo = authRedirectUrl('auth/callback');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error) throw error;
  if (!data.url) throw new Error(`No ${provider} authorization URL was returned.`);

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === 'cancel' || result.type === 'dismiss') return 'cancelled';
  if (result.type !== 'success') throw new Error(`${provider} sign-in did not complete.`);

  await applyAuthSessionFromUrl(result.url);
  return 'success';
}
