import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const edgeFunctionsBase = supabaseUrl ? `${supabaseUrl.replace(/\/+$/, '')}/functions/v1` : '';
export { supabaseUrl, supabaseAnonKey };

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        fetch: (...args: [input: RequestInfo | URL, init?: RequestInit]) => {
          const arg = args[0];
          const url =
            typeof arg === 'string'
              ? arg
              : arg instanceof URL
                ? arg.toString()
                : (arg as Request).url;
          return fetch(...args).catch(err => {
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
              console.error(
                `%c[Riman] Network Error: Failed to fetch from: ${url}\n` +
                'This usually means the URL is unreachable, blocked by CSP/CORS, or you are offline.',
                'color: #ff4d4d; font-weight: bold;'
              );
            }
            throw err;
          });
        }
      }
    })
  : (null as unknown as SupabaseClient);

export const isSupabaseConfigured = isConfigured;

// Self-heal stale sessions: an expired/invalid refresh token otherwise poisons
// every REST call with a bad Bearer JWT -> PostgREST 401 (e.g. booking form).
// Clear it once so the client falls back to the pure anon key.
if (isConfigured && typeof window !== 'undefined') {
  const clearStaleSession = () => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) localStorage.removeItem(k);
      }
    } catch { /* storage unavailable */ }
  };
  supabase.auth.getSession().then(({ error }) => {
    if (error && /refresh.*token|invalid.*token/i.test(error.message)) {
      clearStaleSession();
      supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);
    }
  }).catch(() => undefined);
}

if (isConfigured) {
  const maskedUrl = supabaseUrl.replace(/(https?:\/\/).{5}/, '$1*****');
  console.info(`%c[Riman] Connecting to Supabase: ${maskedUrl}`, 'color: #A2492B; font-weight: bold;');
}

if (!isConfigured) {
  console.warn(
    '[Riman] Supabase is not configured. Using offline/local mode. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable the backend.'
  );
}