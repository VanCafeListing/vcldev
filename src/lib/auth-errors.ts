import { AuthError } from '@supabase/supabase-js';

/**
 * Maps Supabase Auth failures to copy we control.
 *
 * Two reasons not to surface Supabase's own strings: they are not written in
 * our voice, and some of them leak more than we want. In particular, a failed
 * sign-in must not reveal whether the email exists — so a wrong password and
 * an unknown email collapse to the same message here.
 */

/** Shown when sign-in fails for any credential reason. Deliberately vague. */
const INVALID_CREDENTIALS = 'That email and password combination is not correct.';

const GENERIC = 'Something went wrong. Please try again.';

const NETWORK = 'Could not reach the server. Check your connection and try again.';

export function authErrorMessage(error: unknown): string {
  if (!error) return GENERIC;

  // A dropped request surfaces as a TypeError from fetch, not an AuthError.
  if (error instanceof TypeError) return NETWORK;

  if (error instanceof AuthError) {
    if (error.status === 0) return NETWORK;

    switch (error.code) {
      case 'invalid_credentials':
      case 'user_not_found':
        return INVALID_CREDENTIALS;
      case 'user_already_exists':
      case 'email_exists':
        return 'An account already exists for that email.';
      case 'weak_password':
        return 'That password is too short. Use at least 6 characters.';
      case 'validation_failed':
        return 'Please check the details you entered and try again.';
      case 'over_request_rate_limit':
      case 'over_email_send_rate_limit':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'email_not_confirmed':
        return 'That email has not been confirmed yet.';
      default:
        return GENERIC;
    }
  }

  return GENERIC;
}
