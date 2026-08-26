import { createClient } from 'jsr:@supabase/supabase-js@2';

/**
 * Signs a user in by username OR email.
 *
 * Supabase's `signInWithPassword` only accepts an email, so a username has to
 * be resolved first. That resolution deliberately stays here rather than being
 * exposed to the client: a public username -> email lookup, even one that only
 * answers exact matches, would let anyone walk a list of usernames and harvest
 * the matching email addresses. The client sends an identifier and a password
 * and gets back a session or a generic failure; it never learns an address it
 * did not already have.
 */

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/** One message for every credential failure, so nothing can be probed. */
const INVALID = { error: 'invalid_credentials' };

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let identifier: string;
  let password: string;
  try {
    const body = await req.json();
    identifier = String(body.identifier ?? '').trim();
    password = String(body.password ?? '');
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  if (!identifier || !password) return json(INVALID, 400);

  let email = identifier;

  // Anything without an "@" is treated as a username and resolved with the
  // service role, which bypasses RLS on profiles.
  if (!identifier.includes('@')) {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await admin
      .from('profiles')
      .select('email')
      .ilike('username', identifier)
      .maybeSingle();

    // An unknown username returns exactly what a wrong password returns, so
    // the two cases stay indistinguishable from outside.
    if (error || !data?.email) return json(INVALID, 400);
    email = data.email;
  }

  // Sign in with the anon key so the session that comes back is an ordinary
  // user session, not something minted with elevated privileges.
  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error || !data.session) return json(INVALID, 400);

  return json(
    {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
    200
  );
});
