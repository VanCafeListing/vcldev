import type { Session } from '@supabase/supabase-js';

import { supabase } from './supabase';

/**
 * Belt-and-braces check that the signed-in user has a profile row.
 *
 * The `handle_new_user` trigger is the real mechanism and runs for every
 * sign-up path. This exists only for the case where the trigger is missing —
 * a database reset during local development, most plausibly — so the app does
 * not silently operate against an account with no profile.
 *
 * Deliberately best-effort: it never throws and never blocks the caller. If it
 * cannot write, the user still has a working session and RLS still protects
 * everything; the profile screen will simply have nothing to show.
 */
export async function ensureProfile(session: Session): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error || data) return;

    const meta = session.user.user_metadata ?? {};
    const builtName = [meta.first_name, meta.last_name].filter(Boolean).join(' ').trim();

    await supabase.from('profiles').insert({
      id: session.user.id,
      email: session.user.email,
      name: builtName || meta.full_name || meta.name || null,
      // Mirrors the trigger's fallback shape. The trigger owns the nice
      // email-derived handles; this only has to be unique and present.
      username: `user${session.user.id.replace(/-/g, '').slice(0, 12)}`,
    });
  } catch {
    // Never let a defensive repair break sign-in.
  }
}
