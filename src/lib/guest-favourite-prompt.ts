import { Alert } from 'react-native';
import type { useRouter } from 'expo-router';

/**
 * Shown when a guest taps a heart icon. An in-place prompt rather than an
 * automatic redirect, so a guest browsing the Home feed or a cafe's detail
 * screen isn't yanked away from what they're looking at.
 */
export function promptGuestToSignIn(router: ReturnType<typeof useRouter>) {
  Alert.alert('Sign in to save favourites', 'Create an account or log in to favourite cafes.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Log In', onPress: () => router.push('/(auth)/log-in') },
    { text: 'Sign Up', onPress: () => router.push('/(auth)/sign-up') },
  ]);
}
