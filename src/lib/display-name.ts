import type { Session } from '@supabase/supabase-js';

/**
 * First name for the Home feed's "Hi, {name}!" greeting (PDF: 402x874 Home
 * artboard). Returns null for a guest or a session with no name on record —
 * callers fall back to a name-less heading rather than inventing one.
 */
export function getFirstName(session: Session | null): string | null {
  if (!session) return null;

  const meta = session.user.user_metadata ?? {};
  const source = meta.first_name || meta.full_name || meta.name;
  if (!source) return null;

  return String(source).trim().split(/\s+/)[0] || null;
}
