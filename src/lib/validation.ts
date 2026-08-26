/**
 * Client-side form validation for the auth screens.
 *
 * These checks exist to give immediate feedback and to stop obviously-invalid
 * submissions; they are not a security boundary. Supabase re-validates
 * everything server-side, and its errors are surfaced through
 * `authErrorMessage`.
 */

/**
 * Deliberately permissive: something before an @, something after it, and a
 * dot in the domain. Stricter patterns reject addresses that are actually
 * valid, and only sending mail proves an address works.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Supabase's default minimum. The design specifies no stronger policy. */
export const MIN_PASSWORD_LENGTH = 6;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export type SignUpFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateSignUp(fields: SignUpFields): FieldErrors<SignUpFields> {
  const errors: FieldErrors<SignUpFields> = {};

  if (!fields.firstName.trim()) errors.firstName = 'Required';
  if (!fields.lastName.trim()) errors.lastName = 'Required';

  if (!fields.email.trim()) {
    errors.email = 'Required';
  } else if (!isValidEmail(fields.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!fields.password) {
    errors.password = 'Required';
  } else if (fields.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Required';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!fields.acceptedTerms) {
    errors.acceptedTerms = 'Please accept the Terms of Service to continue';
  }

  return errors;
}

export type LogInFields = {
  identifier: string;
  password: string;
};

export function validateLogIn(fields: LogInFields): FieldErrors<LogInFields> {
  const errors: FieldErrors<LogInFields> = {};

  if (!fields.identifier.trim()) errors.identifier = 'Required';
  if (!fields.password) errors.password = 'Required';

  return errors;
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
