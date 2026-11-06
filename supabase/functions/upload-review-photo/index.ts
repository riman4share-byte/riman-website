// Supabase Edge Function: upload-review-photo
// Deploy: supabase functions deploy upload-review-photo --no-verify-jwt
//
// Public review-photo upload endpoint. It replaces direct anon/authenticated
// writes to the public review-photos bucket. The function:
//  - enforces a 5 MB size limit and sniffs the image signature,
//  - generates the storage path itself (no caller-controlled filenames),
//  - rate-limits by client IP (failing closed),
//  - writes with the service role, so Storage RLS needs no public INSERT policy.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isAllowedOrigin, parseAllowedOrigins } from '../_shared/checkoutValidation.ts';
import { clientIp } from '../_shared/httpGuards.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const ALLOWED_ORIGINS = parseAllowedOrigins(Deno.env);
const RATE_LIMIT_MAX = Number(Deno.env.get('REVIEW_PHOTO_RATE_LIMIT_MAX') || 10);
const RATE_LIMIT_WINDOW_S = Number(Deno.env.get('REVIEW_PHOTO_RATE_LIMIT_WINDOW_S') || 3600);
const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = 'review-photos';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type ImageType = 'image/jpeg' | 'image/png' | 'image/webp';

function corsFor(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowed = isAllowedOrigin(origin, ALLOWED_ORIGINS) ? origin : (ALLOWED_ORIGINS[0] || '');
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function json(body: unknown, status: number, req: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsFor(req), 'Content-Type': 'application/json' },
  });
}

function detectImageType(bytes: Uint8Array): ImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  return null;
}

function extensionFor(type: ImageType): string {
  return type === 'image/jpeg' ? 'jpg' : type === 'image/png' ? 'png' : 'webp';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsFor(req) });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, req);
  }

  const origin = req.headers.get('origin');
  if (origin && !isAllowedOrigin(origin, ALLOWED_ORIGINS)) {
    return json({ error: 'Origin not allowed' }, 403, req);
  }

  if (!(await withinRateLimit(req))) {
    return json({ error: 'Too many uploads. Please try again later.' }, 429, req);
  }

  const contentType = (req.headers.get('content-type') || '').toLowerCase();
  if (!contentType.startsWith('multipart/form-data')) {
    return json({ error: 'Expected multipart/form-data' }, 400, req);
  }

  const declaredLength = Number(req.headers.get('content-length') || '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BYTES + 1024 * 1024) {
    return json({ error: 'Image must be under 5MB.' }, 413, req);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ error: 'Invalid form data' }, 400, req);
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return json({ error: 'No image provided' }, 400, req);
  }
  if (file.size > MAX_BYTES) {
    return json({ error: 'Image must be under 5MB.' }, 413, req);
  }

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    return json({ error: 'Could not read image' }, 400, req);
  }

  const imageType = detectImageType(bytes);
  if (!imageType) {
    return json({ error: 'Only JPEG, PNG, or WebP images are allowed.' }, 400, req);
  }

  const path = `reviews/${crypto.randomUUID()}.${extensionFor(imageType)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: imageType,
    upsert: false,
  });
  if (error) {
    console.error('review photo upload failed:', error.message);
    return json({ error: 'Upload is currently unavailable' }, 500, req);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    return json({ error: 'Upload is currently unavailable' }, 500, req);
  }
  return json({ url: data.publicUrl }, 200, req);
});

async function withinRateLimit(req: Request): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('try_rate_limit', {
      p_bucket: 'review_photo_upload',
      p_scope_key: clientIp(req.headers),
      p_limit: RATE_LIMIT_MAX,
      p_window_seconds: RATE_LIMIT_WINDOW_S,
    });
    if (error) {
      console.error('rate limit rpc failed (failing closed):', error.message);
      return false;
    }
    return data === true;
  } catch (err) {
    console.error('rate limit check threw (failing closed):', err);
    return false;
  }
}
