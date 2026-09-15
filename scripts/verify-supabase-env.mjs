#!/usr/bin/env node
/**
 * Supabase env contract check — catches the exact class of failure that
 * silently broke login for days (2026-09-16): a .env where the project URL
 * and the anon key belong to DIFFERENT projects (or the key was rotated /
 * corrupted). Run before deploy, or manually: npm run verify:env
 *
 * Exit 0 = key+URL are a matching, live pair. Non-zero = broken pair.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function envValue(name) {
  if (process.env[name]) return process.env[name].trim();
  const file = existsSync(join(root, '.env')) ? readFileSync(join(root, '.env'), 'utf8') : '';
  const m = file.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}

const url = envValue('VITE_SUPABASE_URL');
const key = envValue('VITE_SUPABASE_ANON_KEY');

const fail = (msg) => { console.error(`FAIL ${msg}`); process.exit(1); };

if (!url || !key) fail('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing (env or .env)');

let refInKey = null;
if (key.split('.').length === 3) {
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString('utf8'));
    refInKey = payload.ref || null;
  } catch { /* non-JWT key (new sb_ format) — skip ref cross-check */ }
} else if (key.startsWith('sb_publishable_') || key.startsWith('sb_secret_')) {
  refInKey = null; // publishable keys are project-scoped by the live probe below
}

const m = url.match(/^https:\/\/([a-z0-9]+)\.supabase\.(co|in|net|asia)$/i);
if (!m) fail(`VITE_SUPABASE_URL is not a supabase project URL: ${url.replace(/\/\/[^@]*@/, '//***@')}`);
const refInUrl = m[1];

if (refInKey && refInKey !== refInUrl) {
  fail(`anon key belongs to project "${refInKey}" but VITE_SUPABASE_URL points at "${refInUrl}" — mismatched pair`);
}

try {
  const res = await fetch(`${url}/rest/v1/products?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  if (res.status === 401 || res.status === 403) {
    fail(`Supabase refused the key (HTTP ${res.status}) — rotate/re-copy from Dashboard → Settings → API Keys`);
  }
  if (!res.ok) fail(`unexpected HTTP ${res.status} from ${url}`);
  console.log(`PASS Supabase env pair is live and consistent (project ${refInUrl})`);
} catch (err) {
  fail(`cannot reach ${url}: ${err.message}`);
}
