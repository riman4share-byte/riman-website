/**
 * Pure request-validation and garment-resolution helpers for the virtual-tryon
 * edge function. No runtime APIs beyond the Web standard, so vitest (Node) can
 * import this file directly - the same arrangement as _shared/httpGuards.ts.
 */

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_REQUEST_BYTES = 10 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MIN_DIMENSION = 400;
export const MAX_DIMENSION = 8000;

export const TRYON_CATEGORIES = ['Bridal Gown', 'Evening Dress'] as const;

export interface GarmentProduct {
  id: string;
  category: string;
  images: string[];
}

export type TryOnErrorCode =
  | 'invalid_request'
  | 'unauthorized'
  | 'consent_required'
  | 'not_configured'
  | 'rate_limited'
  | 'invalid_image'
  | 'upstream_timeout'
  | 'upstream_error';

export interface TryOnRequestBody {
  productId: string;
  imageIndex: number;
  consent: boolean;
  image: string;
}

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: TryOnErrorCode; message: string };

function fail(code: TryOnErrorCode, message: string): ParseResult<never> {
  return { ok: false, code, message };
}

/**
 * A garment path is only usable if it is a local, forward-slashed path under
 * /assets/. This rejects absolute URLs (which would let a poisoned catalogue
 * row make the server fetch an arbitrary host), and any traversal sequence -
 * including percent-encoded dot segments such as %2e%2e, which only surface as
 * dot-segments after WHATWG URL normalisation.
 */
export function isSafeGarmentPath(path: unknown): path is string {
  if (typeof path !== 'string') return false;
  if (!path.startsWith('/assets/')) return false;
  if (path.includes('..') || path.includes('\\')) return false;

  // A legitimate catalogue asset path is a plain, already-encoded filesystem
  // path. Any percent-encoding here is either redundant or an attempt to smuggle
  // an encoded separator (%2f / %5c) or dot segment past the checks below -
  // WHATWG normalisation decodes %2e but leaves %2f, %5c and %25 intact, so a
  // single later decode by nginx or a static server turns them back into
  // separators and dot segments.
  if (path.includes('%')) return false;

  let normalised: string;
  try {
    normalised = new URL(path, 'https://guard.invalid').pathname;
  } catch {
    return false;
  }
  if (!normalised.startsWith('/assets/')) return false;
  if (normalised.split('/').some((segment) => segment === '..' || segment === '.')) return false;
  return true;
}

export function isTryOnEligible(product: GarmentProduct): boolean {
  if (!product) return false;
  if (!(TRYON_CATEGORIES as ReadonlyArray<string>).includes(product.category)) return false;
  return Array.isArray(product.images) && product.images.length > 0;
}

export function resolveGarmentPath(product: GarmentProduct, imageIndex: number): string | null {
  if (!isTryOnEligible(product)) return null;
  if (!Number.isInteger(imageIndex)) return null;
  if (imageIndex < 0 || imageIndex >= product.images.length) return null;
  const path = product.images[imageIndex];
  return isSafeGarmentPath(path) ? path : null;
}

const BASE64_CHARS = /^[A-Za-z0-9+/]+={0,2}$/;

/** Decodes byte length without allocating the full buffer. */
function base64ByteLength(b64: string): number {
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
}

export function validateImageDataUrl(
  dataUrl: string,
): ParseResult<{ mime: string; base64: string; bytes: number }> {
  if (typeof dataUrl !== 'string' || dataUrl.length === 0) {
    return fail('invalid_image', 'Image payload is empty.');
  }
  const match = dataUrl.match(/^data:([a-z]+\/[a-z0-9.+-]+);base64,([\s\S]+)$/i);
  if (!match) return fail('invalid_image', 'Image payload is not a base64 data URL.');

  const mime = match[1].toLowerCase();
  const base64 = match[2];

  if (!(ALLOWED_IMAGE_MIME as ReadonlyArray<string>).includes(mime)) {
    return fail('invalid_image', `Unsupported image type: ${mime}`);
  }
  // Spot-check the head and tail rather than running a strict O(n) test over an
  // 11 MB string on every request. The head catches a non-base64 prefix; the
  // tail catches a truncated or corrupt end.
  if (!BASE64_CHARS.test(base64.slice(0, 256)) || !BASE64_CHARS.test(base64.slice(-4))) {
    return fail('invalid_image', 'Image payload is not valid base64.');
  }
  const bytes = base64ByteLength(base64);
  if (bytes > MAX_IMAGE_BYTES) {
    return fail('invalid_image', 'Image exceeds the 8 MB limit.');
  }
  if (bytes <= 0) return fail('invalid_image', 'Image payload is empty.');
  return { ok: true, value: { mime, base64, bytes } };
}

export function parseTryOnRequest(raw: unknown): ParseResult<TryOnRequestBody> {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return fail('invalid_request', 'Request body must be a JSON object.');
  }
  const body = raw as Record<string, unknown>;

  if (body.consent !== true) {
    return fail('consent_required', 'Explicit photo-processing consent is required.');
  }
  if (typeof body.productId !== 'string' || body.productId.length === 0) {
    return fail('invalid_request', 'productId is required.');
  }
  if (typeof body.imageIndex !== 'number' || !Number.isInteger(body.imageIndex)) {
    return fail('invalid_request', 'imageIndex must be an integer.');
  }
  if (typeof body.image !== 'string') {
    return fail('invalid_request', 'image is required.');
  }
  return {
    ok: true,
    value: {
      productId: body.productId,
      imageIndex: body.imageIndex,
      consent: true,
      image: body.image,
    },
  };
}

/**
 * Pulls inline image bytes out of a generateContent response. Anything that is
 * not an image - prose, a refusal, a blocked candidate, an empty envelope -
 * is an upstream error. This is the last guard before a result reaches the
 * customer, so it is deliberately strict.
 */
export function parseGeminiResponse(json: unknown): ParseResult<{ base64: string; mime: string }> {
  const candidates = (json as { candidates?: unknown })?.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return fail('upstream_error', 'Generation returned no candidates.');
  }
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue;
    const parts = (candidate as { content?: { parts?: unknown } })?.content?.parts;
    if (!Array.isArray(parts)) continue;
    for (const part of parts) {
      const inline = (part as { inlineData?: { mimeType?: unknown; data?: unknown } })?.inlineData;
      if (
        inline &&
        typeof inline.data === 'string' &&
        inline.data.length > 0 &&
        typeof inline.mimeType === 'string' &&
        (ALLOWED_IMAGE_MIME as ReadonlyArray<string>).includes(inline.mimeType.toLowerCase())
      ) {
        return { ok: true, value: { base64: inline.data, mime: inline.mimeType.toLowerCase() } };
      }
    }
  }
  return fail('upstream_error', 'Generation returned no image.');
}
