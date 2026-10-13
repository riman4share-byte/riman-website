// Supabase Edge Function: virtual-tryon
// Deploy: supabase functions deploy virtual-tryon
//   (NOTE: deliberately WITHOUT --no-verify-jwt. Unlike create-checkout and
//   create-order this endpoint is auth-gated; leaving verify_jwt at its
//   default of true means no [functions.virtual-tryon] block is added to
//   supabase/config.toml.)
// Secrets: supabase secrets set GEMINI_API_KEY=...
//
// PRIVACY CONTRACT (this is the whole point of the function):
//  - The customer's photo arrives as base64 in the request body, is forwarded
//    to Gemini, and is discarded when the function returns. It is NEVER written
//    to storage, to a table, or to a log line. Logs carry status codes,
//    durations and error classes only.
//  - The browser sends productId + imageIndex, never a URL. The garment image
//    is resolved here from the catalogue, so a crafted request cannot make the
//    server fetch an arbitrary host (SSRF).
//  - consent === true is required. This is a guardrail against a skipped UI
//    step and a contract for the endpoint, not an anti-abuse control.
//  - Public-by-token? No: a valid user JWT is required, and the rate limit is
//    keyed on the user id so one customer cannot drain the free tier.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { clientIp } from '../_shared/httpGuards.ts';
import { isAllowedOrigin } from '../_shared/checkoutValidation.ts';
import {
  type GarmentProduct,
  isTryOnEligible,
  MAX_REQUEST_BYTES,
  parseGeminiResponse,
  parseTryOnRequest,
  resolveGarmentPath,
  toBase64,
  validateImageDataUrl,
  type TryOnErrorCode,
} from './tryOnValidation.ts';

/**
 * Product rows come from the DATABASE, not from src/data/products.ts.
 *
 * Two reasons. First, Deno requires explicit file extensions and does no
 * directory-index resolution, so importing the browser catalogue (which does
 * `import { Product } from '../types'`) would not resolve in the edge runtime.
 * Second - and more importantly - create-checkout already establishes that
 * authoritative product data is read from the database with the service-role
 * client, never trusted from a client or a bundled copy. Same rule here.
 */
// Once normalised below, a row IS a GarmentProduct: images is always a real
// array, never the database's nullable column. Aliasing keeps that contract
// enforced by the compiler rather than by convention.
type GarmentRow = GarmentProduct;

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const SITE_URL = (Deno.env.get('SITE_URL') || '').replace(/\/+$/, '');
const RATE_LIMIT_MAX = Number(Deno.env.get('TRYON_RATE_LIMIT_MAX') || 10);
const RATE_LIMIT_WINDOW_S = Number(Deno.env.get('TRYON_RATE_LIMIT_WINDOW_S') || 3600);
const GEMINI_TIMEOUT_MS = 60_000;

const MODEL = 'gemini-2.5-flash-image';
const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const STATUS_BY_CODE: Record<TryOnErrorCode, number> = {
  invalid_request: 400,
  consent_required: 403,
  unauthorized: 401,
  not_configured: 503,
  rate_limited: 429,
  invalid_image: 400,
  upstream_timeout: 504,
  upstream_error: 502,
};

// NOTE: this is a Record over TryOnErrorCode, so it must stay exhaustive. Task 2
// added 'unauthorized' to that union; omitting it here is a compile error, not a
// silent fallback. If the union grows again, this record must grow with it.

function corsFor(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  // Exact-origin equality, matching create-checkout's isAllowedOrigin. A prefix
  // match would echo back any origin that merely starts with SITE_URL, e.g.
  // https://riman.ae.evil.com.
  const allowed = isAllowedOrigin(origin, [SITE_URL]) ? origin : SITE_URL;
  return {
    'Access-Control-Allow-Origin': allowed || '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function json(body: unknown, status: number, req: Request, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsFor(req), 'Content-Type': 'application/json', ...extra },
  });
}

function fail(req: Request, code: TryOnErrorCode, message: string, extra: Record<string, string> = {}) {
  return json({ error: code }, STATUS_BY_CODE[code], req, extra);
}

const admin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

async function withinRateLimit(userId: string): Promise<boolean> {
  if (!admin) {
    console.error('tryon rate limit skipped (no service role key)');
    return true;
  }
  const { data, error } = await admin.rpc('try_rate_limit', {
    p_bucket: 'virtual-tryon',
    p_scope_key: userId,
    p_limit: RATE_LIMIT_MAX,
    p_window_seconds: RATE_LIMIT_WINDOW_S,
  });
  if (error) {
    // Fail open but loud: a missing migration must not take try-on down.
    console.error('tryon rate limit rpc failed (failing open):', error.message);
    return true;
  }
  return data === true;
}

/** Resolves a validated /assets/ path against the deployment origin. */
function absoluteAssetUrl(path: string): string {
  return SITE_URL ? `${SITE_URL}${path}` : path;
}

/**
 * Authoritative garment row from the database, mirroring create-checkout's
 * "products come from the database, never from the client" rule. The lookup is
 * by primary key and selects only the three columns we need - never `select('*')`,
 * so a future column addition cannot silently widen what leaves the server.
 */
async function fetchGarmentRow(
  productId: string,
): Promise<{ ok: true; value: GarmentRow } | { ok: false; code: TryOnErrorCode; message: string }> {
  if (!admin) {
    console.error('virtual-tryon: no service role client; cannot resolve garment');
    return { ok: false, code: 'not_configured', message: 'Virtual try-on is not configured.' };
  }
  const { data, error } = await admin
    .from('products')
    .select('id, category, images')
    .eq('id', productId)
    .maybeSingle();

  if (error) {
    console.error('virtual-tryon: product lookup failed:', error.code);
    return { ok: false, code: 'upstream_error', message: 'That gown could not be loaded.' };
  }
  if (!data) {
    return { ok: false, code: 'invalid_request', message: 'That gown is not available for virtual try-on.' };
  }

  const row: GarmentRow = {
    id: String(data.id),
    category: String(data.category ?? ''),
    images: Array.isArray(data.images) ? data.images.map(String) : [],
  };

  // Same eligibility rule the client applies; the server does not take it on trust.
  if (!isTryOnEligible(row)) {
    return { ok: false, code: 'invalid_request', message: 'That gown is not available for virtual try-on.' };
  }
  return { ok: true, value: row };
}

async function fetchGarment(path: string, signal: AbortSignal): Promise<{ base64: string; mime: string }> {
  // Defence in depth on this function's own contract: it may only read a
  // catalogue asset. resolveGarmentPath already enforces this, but pinning it
  // to the input here means the check can genuinely fail if a future caller
  // passes something else - unlike a check against the url just built below.
  if (!path.startsWith('/assets/')) {
    throw new Error('garment path left the catalogue root');
  }
  const url = absoluteAssetUrl(path);
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`garment fetch failed: ${response.status}`);
  const buffer = new Uint8Array(await response.arrayBuffer());
  const mime = response.headers.get('content-type') || 'image/jpeg';
  return { base64: toBase64(buffer), mime };
}

/**
 * Reads the request body as text, refusing to buffer more than MAX_REQUEST_BYTES.
 *
 * Content-Length is client-controlled and absent on a chunked/streamed request,
 * so it is only a fast-path rejection: a missing header must not skip the bound.
 * The stream is counted as it arrives, which is what actually caps memory.
 * Returns null when the ceiling is exceeded.
 */
async function readBoundedBody(req: Request): Promise<string | null> {
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared > MAX_REQUEST_BYTES) return null;
  if (!req.body) return '';

  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_REQUEST_BYTES) {
        await reader.cancel().catch(() => {});
        return null;
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

const PROMPT =
  'Create a realistic virtual try-on photograph. Take the person in the FIRST image and ' +
  'dress them in the gown shown in the SECOND image. Preserve the person\'s face, hair, skin ' +
  'tone, body proportions and pose. Reproduce the gown\'s silhouette, colour, fabric and drape ' +
  'faithfully. Keep the background simple and unobtrusive. Return only the edited photograph.';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsFor(req) });
  if (req.method !== 'POST') return json({ error: 'invalid_request' }, 400, req);

  const startedAt = Date.now();

  if (!GEMINI_API_KEY) {
    console.error('virtual-tryon: GEMINI_API_KEY is not set');
    return fail(req, 'not_configured', 'Virtual try-on is not configured.');
  }
  // SITE_URL is required to build the garment asset URL. Without it every
  // request would fail later at fetch time as a misleading 502; reject up front
  // as the configuration problem it is.
  if (!SITE_URL) {
    console.error('virtual-tryon: SITE_URL is not set');
    return fail(req, 'not_configured', 'Virtual try-on is not configured.');
  }

  // 1. Authenticate. verify_jwt already ran at the gateway; this resolves the
  //    user id we rate limit on.
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  // A missing anon key is a server misconfiguration, not a rejected caller.
  if (!SUPABASE_ANON_KEY) {
    console.error('virtual-tryon: SUPABASE_ANON_KEY is not set');
    return fail(req, 'not_configured', 'Virtual try-on is not configured.');
  }
  if (!token) return fail(req, 'unauthorized', 'Sign in required.');

  const { data: userData, error: userError } = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  }).auth.getUser(token);

  if (userError || !userData?.user?.id) {
    console.error('virtual-tryon: auth rejected', userError?.message ?? 'no user');
    return fail(req, 'unauthorized', 'Sign in required.');
  }
  const userId = userData.user.id;

  // 2. Read the body under a hard ceiling. Content-Length is only trusted as a
  //    fast path; the stream itself is counted so a chunked request cannot slip
  //    an unbounded body past it.
  const bodyText = await readBoundedBody(req);
  if (bodyText === null) return fail(req, 'invalid_image', 'Request body too large.');

  // 3. Parse and validate. Consent is enforced before the photo is used.
  let raw: unknown;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    return fail(req, 'invalid_request', 'Body must be JSON.');
  }
  const parsed = parseTryOnRequest(raw);
  if (!parsed.ok) return fail(req, parsed.code, parsed.message);

  const image = validateImageDataUrl(parsed.value.image);
  if (!image.ok) return fail(req, image.code, image.message);

  // 4. Resolve the garment server-side. Never trust a client-supplied URL.
  const garment = await fetchGarmentRow(parsed.value.productId);
  if (!garment.ok) return fail(req, garment.code, garment.message);
  const garmentPath = resolveGarmentPath(garment.value, parsed.value.imageIndex);
  if (!garmentPath) return fail(req, 'invalid_request', 'That garment view is not available.');

  // 5. Rate limit, keyed on the authenticated user.
  if (!(await withinRateLimit(userId))) {
    return fail(req, 'rate_limited', 'Too many try-ons this hour.', {
      'Retry-After': String(RATE_LIMIT_WINDOW_S),
    });
  }

  // 6. Call Gemini.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    // The same signal covers the garment fetch, so a hung asset download is
    // bounded by the timeout rather than hanging the request indefinitely.
    const garmentImage = await fetchGarment(garmentPath, controller.signal);
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: image.value.mime, data: image.value.base64 } },
              { inline_data: { mime_type: garmentImage.mime, data: garmentImage.base64 } },
              { text: PROMPT },
            ],
          },
        ],
        generationConfig: { responseModalities: ['IMAGE'] },
      }),
    });

    if (response.status === 429) {
      console.error('virtual-tryon: gemini rate limited us');
      return fail(req, 'rate_limited', 'Try-on service is busy.', {
        'Retry-After': String(RATE_LIMIT_WINDOW_S),
      });
    }
    if (!response.ok) {
      // Status only. The upstream body is never echoed and never logged, since
      // it can contain fragments of the customer's photo.
      console.error(`virtual-tryon: gemini returned ${response.status}`);
      return fail(req, 'upstream_error', 'Generation failed upstream.');
    }

    const generated = parseGeminiResponse(await response.json().catch(() => null));
    if (!generated.ok) {
      console.error(`virtual-tryon: ${generated.message}`);
      return fail(req, 'upstream_error', generated.message);
    }

    console.log(`virtual-tryon: ok in ${Date.now() - startedAt}ms ip=${clientIp(req.headers)}`);
    // The result is derived from the customer's photo; it must never be stored
    // by a browser or an intermediary.
    return json({ image: generated.value.base64, mime: generated.value.mime }, 200, req, {
      'Cache-Control': 'no-store',
    });
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === 'AbortError';
    // Log the class, never the message payload.
    console.error(`virtual-tryon: ${aborted ? 'timeout' : 'fetch failure'} ip=${clientIp(req.headers)}`);
    return fail(req, aborted ? 'upstream_timeout' : 'upstream_error', 'Generation failed.');
  } finally {
    clearTimeout(timer);
  }
});
