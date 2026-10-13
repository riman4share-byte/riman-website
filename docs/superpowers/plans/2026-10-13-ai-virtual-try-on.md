# AI Virtual Try-On Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real Gemini-backed virtual dress try-on to eligible gown product pages, gated behind explicit per-visit consent, with customer photos never persisted anywhere.

**Architecture:** A new Supabase Edge Function (`virtual-tryon`) holds the Gemini key, requires an authenticated session, rate-limits per user via the existing `try_rate_limit` RPC, resolves the garment image server-side from `products.ts`, and calls `gemini-2.5-flash-image`. A React modal walks the customer through consent → upload → generating → result/error. Photos live in browser memory only and are base64-passed, never stored.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind v4, Supabase Edge Functions (Deno), `@supabase/supabase-js`, `motion`, `lucide-react`, vitest + jsdom + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-10-13-ai-virtual-try-on-design.md`

## Global Constraints

- Model id is exactly `gemini-2.5-flash-image`, called at `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`.
- Env var is `GEMINI_API_KEY`, set via `supabase secrets set`. It must NEVER appear in a `VITE_`-prefixed variable, in any file under `src/`, or in any commit.
- The Edge Function must be deployed **with** JWT verification enabled. Do **not** add a `[functions.virtual-tryon]` block to `supabase/config.toml` (absence of the block means `verify_jwt = true`, which is what we want).
- Client image limits: types `image/jpeg`, `image/png`, `image/webp`; max 8 MB; dimensions 400×400 to 8000×8000; downscale to 1600px longest edge and re-encode JPEG 0.85 before upload.
- Server request body cap is 10 MB (8 MB image plus envelope).
- Rate limit is 10 generations per authenticated user per hour, via the existing `try_rate_limit` RPC keyed on user id. It fails open with a loud `console.error`, matching `create-checkout`.
- No customer photo or generated result is ever written to Supabase Storage, any database table, or any log line. Edge Function logs contain status codes, durations and error classes only — never image bytes, never base64.
- Consent is required on the client AND enforced server-side (`consent === true`, else 400). It is `useState` only — never `localStorage`, never a cookie.
- Modal copy lives in `LanguageContext.tsx` under keys prefixed `tryon.`, added to **both** the `en` and `ar` blocks (there is an i18n test that fails if the key sets diverge or if Arabic values contain untranslated English).
- Style with existing tokens only: `btn-luxury`, `btn-luxury-outline`, `text-micro`, `font-heading`, `bg-ivory`, `text-terracotta-dark`.
- Analytics may record event **names** only (`tryon_opened`, `tryon_generated`, `tryon_error`). Never attach image data or base64.
- Eligibility: `category` is `'Bridal Gown'` or `'Evening Dress'`, and `product.images.length > 0`.
- `useFeature('virtualTryOn')` defaults to `false`. The button stays hidden until an operator flips it after deploy.
- Do not modify cart, checkout, payment, auth logic, routing, `products.ts`, or the styling system.
- Test command is `npm run test` (vitest). Lint command is `npm run lint` (`tsc --noEmit`). Build command is `npm run build`.

---

## File Structure

**New files**

| Path | Responsibility |
|---|---|
| `supabase/functions/virtual-tryon/tryOnValidation.ts` | Pure, dependency-free validation and garment resolution. Shared shape between the Edge Function and its vitest test — the repo already does this with `supabase/functions/_shared/checkoutValidation.ts`. |
| `supabase/functions/virtual-tryon/index.ts` | Deno entrypoint: auth, consent gate, rate limit, garment fetch, Gemini call. |
| `src/services/tryOnClient.ts` | Client-side file validation, canvas downscale, base64 encode, POST, timeout, error mapping. |
| `src/services/tryOnClient.test.ts` | Unit tests for the above. |
| `src/services/tryOnValidation.test.ts` | Unit tests for the pure validation module. |
| `src/components/VirtualTryOnModal.tsx` | Modal UI: consent, upload, generating, result, error. |
| `src/components/VirtualTryOnModal.test.tsx` | Component tests. |

**Modified files**

| Path | Change |
|---|---|
| `src/hooks/useFeature.ts` | Add `virtualTryOn: false` to `DEFAULT_FEATURES`. |
| `src/contexts/LanguageContext.tsx` | Add `tryon.*` keys to both `en` and `ar` blocks. |
| `src/services/analytics.ts` | Add the three event names to the `AnalyticsEvent` union. |
| `src/pages/ProductDetail.tsx` | Eligibility check, state, button in the desktop action column and mobile sticky bar, modal mount. |
| `.env.example` | Document `GEMINI_API_KEY` under section 3 (server-only). |
| `docs/CSP.md` | Add a note that Gemini is contacted server-side only, so `connect-src` needs no change. |

---

## Task 1: Pure validation module (shared by server and its tests)

This is first because everything else depends on its exact exported names and types.

**Files:**
- Create: `supabase/functions/virtual-tryon/tryOnValidation.ts`
- Create: `src/services/tryOnValidation.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  ```ts
  export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
  export const MAX_REQUEST_BYTES = 10 * 1024 * 1024;
  export const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'];
  export const MIN_DIMENSION = 400;
  export const MAX_DIMENSION = 8000;
  export const TRYON_CATEGORIES: ReadonlyArray<'Bridal Gown' | 'Evening Dress'>;
  export interface GarmentProduct { id: string; category: string; images: string[] }
  export function isTryOnEligible(product: GarmentProduct): boolean;
  export function resolveGarmentPath(product: GarmentProduct, imageIndex: number): string | null;
  export type TryOnErrorCode =
    | 'invalid_request' | 'consent_required' | 'not_configured' | 'rate_limited'
    | 'invalid_image' | 'upstream_timeout' | 'upstream_error';
  export interface TryOnRequestBody { productId: string; imageIndex: number; consent: boolean; image: string }
  export type ParseResult<T> = { ok: true; value: T } | { ok: false; code: TryOnErrorCode; message: string };
  export function parseTryOnRequest(raw: unknown): ParseResult<TryOnRequestBody>;
  export function validateImageDataUrl(dataUrl: string): ParseResult<{ mime: string; base64: string; bytes: number }>;
  export function parseGeminiResponse(json: unknown): ParseResult<{ base64: string; mime: string }>;
  ```

- [ ] **Step 1: Write the failing test**

Create `src/services/tryOnValidation.test.ts`. Note the import path: vitest's `include` is `['src/**/*.test.{ts,tsx}', 'vite/**/*.test.ts']`, and the repo already imports edge-function modules from tests via a relative path (see `src/services/edgeCheckout.test.ts`).

```ts
import { describe, it, expect } from 'vitest';
import {
  MAX_IMAGE_BYTES,
  ALLOWED_IMAGE_MIME,
  MIN_DIMENSION,
  MAX_DIMENSION,
  isTryOnEligible,
  resolveGarmentPath,
  parseTryOnRequest,
  validateImageDataUrl,
  parseGeminiResponse,
} from '../../supabase/functions/virtual-tryon/tryOnValidation';

const gown = {
  id: '17',
  category: 'Bridal Gown',
  images: ['/assets/a.jpg', '/assets/b.jpg'],
};
const evening = { id: '5', category: 'Evening Dress', images: ['/assets/c.jpg'] };
const ring = { id: '9', category: 'Fine Jewelry', images: ['/assets/d.jpg'] };
const noImages = { id: '20', category: 'Bridal Gown', images: [] };

describe('isTryOnEligible', () => {
  it('accepts bridal gowns and evening dresses', () => {
    expect(isTryOnEligible(gown)).toBe(true);
    expect(isTryOnEligible(evening)).toBe(true);
  });

  it('rejects jewelry, accessories and products with no images', () => {
    expect(isTryOnEligible(ring)).toBe(false);
    expect(isTryOnEligible({ id: '1', category: 'Accessory', images: ['/x.jpg'] })).toBe(false);
    expect(isTryOnEligible(noImages)).toBe(false);
  });
});

describe('resolveGarmentPath', () => {
  it('returns the image at the requested index', () => {
    expect(resolveGarmentPath(gown, 0)).toBe('/assets/a.jpg');
    expect(resolveGarmentPath(gown, 1)).toBe('/assets/b.jpg');
  });

  it('rejects out-of-range, negative and non-integer indices', () => {
    expect(resolveGarmentPath(gown, 2)).toBeNull();
    expect(resolveGarmentPath(gown, -1)).toBeNull();
    expect(resolveGarmentPath(gown, 1.5)).toBeNull();
  });

  it('refuses any path that is not a local /assets/ path', () => {
    const evil = { id: 'x', category: 'Bridal Gown', images: ['https://evil.example.com/x.jpg'] };
    expect(resolveGarmentPath(evil, 0)).toBeNull();
    const traversal = { id: 'y', category: 'Bridal Gown', images: ['/assets/../../.env'] };
    expect(resolveGarmentPath(traversal, 0)).toBeNull();
  });
});

describe('parseTryOnRequest', () => {
  const valid = {
    productId: '17',
    imageIndex: 0,
    consent: true,
    image: 'data:image/jpeg;base64,AAAA',
  };

  it('accepts a well-formed body', () => {
    const r = parseTryOnRequest(valid);
    expect(r.ok).toBe(true);
  });

  it('rejects a missing or false consent flag before anything else', () => {
    expect(parseTryOnRequest({ ...valid, consent: false })).toMatchObject({
      ok: false, code: 'consent_required',
    });
    expect(parseTryOnRequest({ ...valid, consent: undefined })).toMatchObject({
      ok: false, code: 'consent_required',
    });
  });

  it('rejects a missing or mistyped productId and imageIndex', () => {
    expect(parseTryOnRequest({ ...valid, productId: 17 })).toMatchObject({ ok: false });
    expect(parseTryOnRequest({ ...valid, imageIndex: '0' })).toMatchObject({ ok: false });
  });

  it('rejects non-object bodies', () => {
    expect(parseTryOnRequest(null)).toMatchObject({ ok: false, code: 'invalid_request' });
    expect(parseTryOnRequest('nope')).toMatchObject({ ok: false, code: 'invalid_request' });
    expect(parseTryOnRequest([valid])).toMatchObject({ ok: false, code: 'invalid_request' });
  });
});

describe('validateImageDataUrl', () => {
  it('accepts jpeg, png and webp data urls', () => {
    for (const mime of ALLOWED_IMAGE_MIME) {
      const r = validateImageDataUrl(`data:${mime};base64,AAAA`);
      expect(r.ok).toBe(true);
    }
  });

  it('rejects unsupported and malformed data urls', () => {
    expect(validateImageDataUrl('data:image/gif;base64,AAAA').ok).toBe(false);
    expect(validateImageDataUrl('data:text/html;base64,AAAA').ok).toBe(false);
    expect(validateImageDataUrl('https://example.com/x.jpg').ok).toBe(false);
    expect(validateImageDataUrl('').ok).toBe(false);
  });

  it('rejects a payload above the 8 MB ceiling', () => {
    // 8 MB of bytes encodes to roughly 11.2 MB of base64.
    const oversized = `data:image/jpeg;base64,${'A'.repeat(Math.ceil((MAX_IMAGE_BYTES + 1) * 1.34))}`;
    expect(validateImageDataUrl(oversized)).toMatchObject({ ok: false, code: 'invalid_image' });
  });

  it('rejects base64 that is not actually base64', () => {
    expect(validateImageDataUrl('data:image/jpeg;base64,!!!!not base64!!!!').ok).toBe(false);
  });
});

describe('dimension constants', () => {
  it('matches the spec', () => {
    expect(MIN_DIMENSION).toBe(400);
    expect(MAX_DIMENSION).toBe(8000);
  });
});

describe('parseGeminiResponse', () => {
  it('extracts inline image bytes', () => {
    const json = {
      candidates: [
        { content: { parts: [{ inlineData: { mimeType: 'image/png', data: 'AAAA' } }] } },
      ],
    };
    const r = parseGeminiResponse(json);
    expect(r).toMatchObject({ ok: true });
    if (r.ok) expect(r.value).toEqual({ base64: 'AAAA', mime: 'image/png' });
  });

  it('treats a text-only or blocked response as an upstream error', () => {
    expect(parseGeminiResponse({ candidates: [{ content: { parts: [{ text: 'sorry' }] } }] }))
      .toMatchObject({ ok: false, code: 'upstream_error' });
    expect(parseGeminiResponse({ candidates: [{ finishReason: 'SAFETY', content: {} }] }))
      .toMatchObject({ ok: false, code: 'upstream_error' });
    expect(parseGeminiResponse({})).toMatchObject({ ok: false, code: 'upstream_error' });
    expect(parseGeminiResponse(null)).toMatchObject({ ok: false, code: 'upstream_error' });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/services/tryOnValidation.test.ts`

Expected: FAIL with a module-resolution error — `Cannot find module '../../supabase/functions/virtual-tryon/tryOnValidation'`.

- [ ] **Step 3: Write the implementation**

Create `supabase/functions/virtual-tryon/tryOnValidation.ts`. Keep it free of any Deno or Node runtime API so vitest can import it directly — exactly the constraint documented at the top of `supabase/functions/_shared/httpGuards.ts`.

```ts
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
 * row make the server fetch an arbitrary host), and any traversal sequence.
 */
export function isSafeGarmentPath(path: unknown): path is string {
  if (typeof path !== 'string') return false;
  if (!path.startsWith('/assets/')) return false;
  if (path.includes('..') || path.includes('\\')) return false;
  if (/^[/\\]{2}/.test(path)) return false;
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
      if (inline && typeof inline.data === 'string' && typeof inline.mimeType === 'string') {
        return { ok: true, value: { base64: inline.data, mime: inline.mimeType } };
      }
    }
  }
  return fail('upstream_error', 'Generation returned no image.');
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/services/tryOnValidation.test.ts`

Expected: PASS, all 5 describe blocks green.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/virtual-tryon/tryOnValidation.ts src/services/tryOnValidation.test.ts
git commit -m "feat(tryon): pure validation + garment resolution with unit tests"
```

---

## Task 2: Client service — validation, downscale, POST, error mapping

**Files:**
- Create: `src/services/tryOnClient.ts`
- Create: `src/services/tryOnClient.test.ts`

**Interfaces:**
- Consumes: `validateImageDataUrl`, `MAX_IMAGE_BYTES`, `MIN_DIMENSION`, `MAX_DIMENSION`, `ALLOWED_IMAGE_MIME`, `type TryOnErrorCode` from `supabase/functions/virtual-tryon/tryOnValidation`.
- Produces:
  ```ts
  export type TryOnStage = 'idle' | 'generating' | 'done' | 'error';
  export interface TryOnFailure { code: TryOnErrorCode; message: string }
  export class TryOnError extends Error { readonly code: TryOnErrorCode }
  export function validatePhotoFile(file: File): TryOnFailure | null;
  export async function fileToDataUrl(file: File): Promise<string>;
  export async function requestTryOn(args: {
    productId: string; imageIndex: number; image: string;
    accessToken: string; signal?: AbortSignal;
  }): Promise<{ base64: string; mime: string }>;
  export const TRY_ON_TIMEOUT_MS = 60_000;
  ```

- [ ] **Step 1: Write the failing test**

Create `src/services/tryOnClient.test.ts`. jsdom does not implement `createImageBitmap`, so downscale is exercised through an injected seam — that is what makes it testable rather than mocked away.

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validatePhotoFile,
  fileToDataUrl,
  requestTryOn,
  TryOnError,
  TRY_ON_TIMEOUT_MS,
} from './tryOnClient';

const png = () => new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'me.png', { type: 'image/png' });

function setDimensions(file: File, width: number, height: number) {
  (file as unknown as { width: number; height: number }).width = width;
  (file as unknown as { width: number; height: number }).height = height;
}

describe('validatePhotoFile', () => {
  it('accepts jpeg, png and webp within limits', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
      const f = new File([new Uint8Array(10)], `me.${type.slice(6)}`, { type });
      setDimensions(f, 1200, 1600);
      expect(validatePhotoFile(f)).toBeNull();
    }
  });

  it('rejects an unsupported type', () => {
    expect(validatePhotoFile(new File([new Uint8Array(10)], 'a.gif', { type: 'image/gif' })))
      .toMatchObject({ code: 'invalid_image' });
  });

  it('rejects a file over 8 MB', () => {
    const big = new File([new Uint8Array(9 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
    expect(validatePhotoFile(big)).toMatchObject({ code: 'invalid_image' });
  });

  it('rejects images below 400px or above 8000px', () => {
    const small = png();
    setDimensions(small, 200, 200);
    expect(validatePhotoFile(small)).toMatchObject({ code: 'invalid_image' });

    const huge = png();
    setDimensions(huge, 9000, 9000);
    expect(validatePhotoFile(huge)).toMatchObject({ code: 'invalid_image' });
  });
});

describe('fileToDataUrl', () => {
  it('downscales to the 1600px ceiling and re-encodes as jpeg', async () => {
    const canvas = {
      width: 0, height: 0,
      getContext: () => ({
        drawImage: vi.fn(),
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      }),
      toDataURL: vi.fn(() => 'data:image/jpeg;base64,AAAA'),
    };
    vi.stubGlobal('document', { createElement: () => canvas });

    const f = png();
    setDimensions(f, 4000, 2000);

    const out = await fileToDataUrl(f);
    expect(out.startsWith('data:image/jpeg;base64,')).toBe(true);
    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(800);
    expect(canvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.85);
  });

  it('falls back to a plain read when createImageBitmap is unavailable', async () => {
    vi.stubGlobal('createImageBitmap', undefined);
    const out = await fileToDataUrl(png());
    expect(out.startsWith('data:image/')).toBe(true);
  });
});

describe('requestTryOn', () => {
  const base64 = 'data:image/jpeg;base64,AAAA';
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('posts consent, productId and imageIndex, and returns the image', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ image: 'QUJD', mime: 'image/png' }),
    });

    const result = await requestTryOn({
      productId: '17', imageIndex: 1, image: base64, accessToken: 'tok',
    });

    expect(result).toEqual({ base64: 'QUJD', mime: 'image/png' });
    const [url, init] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toMatch(/functions\/v1\/virtual-tryon$/);
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({ productId: '17', imageIndex: 1, consent: true });
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
  });

  it('maps 429 to rate_limited', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false, status: 429, json: async () => ({ error: 'rate_limited' }),
    });
    await expect(
      requestTryOn({ productId: '17', imageIndex: 0, image: base64, accessToken: 'tok' }),
    ).rejects.toMatchObject({ code: 'rate_limited' });
  });

  it('maps 503 to not_configured', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false, status: 503, json: async () => ({ error: 'not_configured' }),
    });
    await expect(
      requestTryOn({ productId: '17', imageIndex: 0, image: base64, accessToken: 'tok' }),
    ).rejects.toMatchObject({ code: 'not_configured' });
  });

  it('maps an aborted request to upstream_timeout', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new DOMException('The user aborted a request.', 'AbortError'),
    );
    await expect(
      requestTryOn({ productId: '17', imageIndex: 0, image: base64, accessToken: 'tok' }),
    ).rejects.toMatchObject({ code: 'upstream_timeout' });
  });

  it('rejects a 200 response that carries no image', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true, status: 200, json: async () => ({ mime: 'image/png' }),
    });
    await expect(
      requestTryOn({ productId: '17', imageIndex: 0, image: base64, accessToken: 'tok' }),
    ).rejects.toBeInstanceOf(TryOnError);
  });

  it('exposes a 60 second timeout constant', () => {
    expect(TRY_ON_TIMEOUT_MS).toBe(60_000);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/services/tryOnClient.test.ts`

Expected: FAIL — `Cannot find module './tryOnClient'`.

- [ ] **Step 3: Write the implementation**

Create `src/services/tryOnClient.ts`.

```ts
import { edgeFunctionsBase } from './supabase';
import {
  ALLOWED_IMAGE_MIME,
  MAX_DIMENSION,
  MAX_IMAGE_BYTES,
  MIN_DIMENSION,
  validateImageDataUrl,
  type TryOnErrorCode,
} from '../../supabase/functions/virtual-tryon/tryOnValidation';

export const TRY_ON_TIMEOUT_MS = 60_000;
const DOWNSCALE_MAX_EDGE = 1600;
const JPEG_QUALITY = 0.85;

export interface TryOnFailure {
  code: TryOnErrorCode;
  message: string;
}

export class TryOnError extends Error {
  readonly code: TryOnErrorCode;
  constructor(code: TryOnErrorCode, message: string) {
    super(message);
    this.name = 'TryOnError';
    this.code = code;
  }
}

const MESSAGES: Record<TryOnErrorCode, string> = {
  invalid_request: 'That request could not be understood. Please try again.',
  consent_required: 'We need your consent before using your photo.',
  not_configured: 'Virtual try-on is being set up. Please try again shortly.',
  rate_limited: 'You have reached the try-on limit for this hour. Please try again later.',
  invalid_image: 'That photo could not be used. Please choose a JPG, PNG or WebP image.',
  upstream_timeout: 'The try-on took too long. Please try again.',
  upstream_error: 'We could not create your try-on just now. Please try again.',
};

const STATUS_CODES: Record<number, TryOnErrorCode> = {
  400: 'invalid_request',
  401: 'invalid_request',
  403: 'consent_required',
  429: 'rate_limited',
  503: 'not_configured',
};

export function validatePhotoFile(file: File): TryOnFailure | null {
  if (!ALLOWED_IMAGE_MIME.includes(file.type as (typeof ALLOWED_IMAGE_MIME)[number])) {
    return { code: 'invalid_image', message: 'Please choose a JPG, PNG or WebP image.' };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { code: 'invalid_image', message: 'Please choose a photo under 8 MB.' };
  }
  const width = (file as File & { width?: number }).width ?? 0;
  const height = (file as File & { height?: number }).height ?? 0;
  if (width && (width < MIN_DIMENSION || height < MIN_DIMENSION)) {
    return { code: 'invalid_image', message: `Please choose a photo at least ${MIN_DIMENSION}x${MIN_DIMENSION} pixels.` };
  }
  if (width && (width > MAX_DIMENSION || height > MAX_DIMENSION)) {
    return { code: 'invalid_image', message: `Please choose a photo smaller than ${MAX_DIMENSION}x${MAX_DIMENSION} pixels.` };
  }
  return null;
}

export async function fileToDataUrl(file: File): Promise<string> {
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    bitmap = null;
  }

  if (!bitmap) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new TryOnError('invalid_image', MESSAGES.invalid_image));
      reader.readAsDataURL(file);
    });
  }

  const scale = Math.min(1, DOWNSCALE_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new TryOnError('invalid_image', MESSAGES.invalid_image);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap as unknown as CanvasImageSource, 0, 0, canvas.width, canvas.height);
  // Released only after the draw: closing first hands drawImage a dead handle.
  bitmap.close();
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

export async function requestTryOn(args: {
  productId: string;
  imageIndex: number;
  image: string;
  accessToken: string;
  signal?: AbortSignal;
}): Promise<{ base64: string; mime: string }> {
  if (!edgeFunctionsBase) {
    throw new TryOnError('not_configured', MESSAGES.not_configured);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TRY_ON_TIMEOUT_MS);
  const onOuterAbort = () => controller.abort();
  args.signal?.addEventListener('abort', onOuterAbort);

  try {
    const response = await fetch(`${edgeFunctionsBase}/virtual-tryon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${args.accessToken}`,
      },
      body: JSON.stringify({
        productId: args.productId,
        imageIndex: args.imageIndex,
        consent: true,
        image: args.image,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    if (!response.ok) {
      const code = STATUS_CODES[response.status] ?? 'upstream_error';
      throw new TryOnError(code, MESSAGES[code]);
    }

    if (typeof payload.image !== 'string' || payload.image.length === 0) {
      throw new TryOnError('upstream_error', MESSAGES.upstream_error);
    }
    return { base64: payload.image, mime: typeof payload.mime === 'string' ? payload.mime : 'image/png' };
  } catch (error) {
    if (error instanceof TryOnError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new TryOnError('upstream_timeout', MESSAGES.upstream_timeout);
    }
    throw new TryOnError('upstream_error', MESSAGES.upstream_error);
  } finally {
    clearTimeout(timer);
    args.signal?.removeEventListener('abort', onOuterAbort);
  }
}

/**
 * Re-validates the outbound data URL with the same rules the server applies, so
 * an oversized or malformed payload is caught before it costs a request.
 */
export function assertSendableDataUrl(dataUrl: string): void {
  const result = validateImageDataUrl(dataUrl);
  if (!result.ok) throw new TryOnError(result.code, result.message || MESSAGES[result.code]);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/services/tryOnClient.test.ts`

Expected: PASS. If the downscale test fails on `canvas.height`, confirm the assertion order — 4000×2000 at a 1600px ceiling is exactly 1600×800.

- [ ] **Step 5: Commit**

```bash
git add src/services/tryOnClient.ts src/services/tryOnClient.test.ts
git commit -m "feat(tryon): client validation, downscale and typed error mapping"
```

---

## Task 3: Translations and analytics event names

**Files:**
- Modify: `src/contexts/LanguageContext.tsx` (insert after line 217 in the `en` block; after line 1133 in the `ar` block)
- Modify: `src/services/analytics.ts:1-9`

- [ ] **Step 1: Add the English keys**

In `src/contexts/LanguageContext.tsx`, insert immediately after line 217 (`'product.reserve_viewing': 'Reserve a Private Viewing',`):

```ts
    'tryon.button': '✨ Try It On',
    'tryon.heading': 'See Yourself in This Dress',
    'tryon.consent_body': 'Upload a photo of yourself and our AI will show you wearing this gown.',
    'tryon.consent_processor': 'To create your try-on, your photo is sent to Google\'s Gemini AI, which processes it and returns the finished image to us. We use it only to generate your try-on.',
    'tryon.consent_not_saved': 'Your photo is never saved to our servers — neither the upload nor the result. They exist only while this window is open.',
    'tryon.consent_not_shared': 'Your photo is not shared with anyone else.',
    'tryon.consent_checkbox': 'I agree to my photo being processed by Google for this try-on.',
    'tryon.consent_continue': 'Continue',
    'tryon.consent_decline': 'Not now',
    'tryon.fit_disclaimer': 'This is a digital visualisation, not a guarantee of fit. Our atelier will confirm sizing with you in person.',
    'tryon.upload_heading': 'Choose your photo',
    'tryon.upload_hint': 'A clear, front-facing photo works best. JPG, PNG or WebP, up to 8 MB.',
    'tryon.upload_cta': 'Upload photo',
    'tryon.replace_photo': 'Choose a different photo',
    'tryon.clear_photo': 'Clear',
    'tryon.garment_heading': 'Which view of the gown?',
    'tryon.generate': 'Generate My Try-On',
    'tryon.generating': 'Creating your try-on…',
    'tryon.generating_hint': 'This usually takes under a minute. Please keep this window open.',
    'tryon.result_heading': 'Your try-on',
    'tryon.try_another': 'Try another photo',
    'tryon.continue_shopping': 'Continue shopping',
    'tryon.book_viewing': 'Book a private viewing',
    'tryon.close': 'Close',
    'tryon.error_heading': 'We could not create your try-on',
    'tryon.error_retry': 'Try again',
    'tryon.sign_in_required': 'Please sign in to create your try-on.',
    'tryon.sign_in_action': 'Sign in',
```

- [ ] **Step 2: Add the Arabic keys**

Insert immediately after line 1133 (`'product.reserve_viewing': 'احجزي مشاهدة خاصة',`):

```ts
    'tryon.button': '✨ جرّبيها الآن',
    'tryon.heading': 'شاهدي نفسكِ في هذا الفستان',
    'tryon.consent_body': 'ارفعي صورة لكِ وسيقوم الذكاء الاصطناعي بإظهاركِ وهي ترتدين هذا الفستان.',
    'tryon.consent_processor': 'لإنشاء التجربة، تُرسَل صورتكِ إلى Gemini AI من Google، الذي يعالجها ويعيد الصورة النهائية إلينا. نستخدمها لإنشاء تجربتكِ فقط.',
    'tryon.consent_not_saved': 'لا تُحفظ صورتكِ على خوادمنا أبداً — لا الصورة المرفوعة ولا النتيجة. توجد فقط طوال فترة فتح هذه النافذة.',
    'tryon.consent_not_shared': 'لا تتم مشاركة صورتكِ مع أي شخص آخر.',
    'tryon.consent_checkbox': 'أوافق على معالجة صورتيِ بواسطة Google من أجل هذه التجربة.',
    'tryon.consent_continue': 'متابعة',
    'tryon.consent_decline': 'ليس الآن',
    'tryon.fit_disclaimer': 'هذه معاينة رقمية وليست ضماناً للمقاس. سيؤكد أتيليهنا المقاس معكِ شخصياً.',
    'tryon.upload_heading': 'اختاري صورتكِ',
    'tryon.upload_hint': 'الصورة الواضحة المواجهة للكاميرا هي الأفضل. JPG أو PNG أو WebP، حتى ٨ ميغابايت.',
    'tryon.upload_cta': 'ارفعي صورة',
    'tryon.replace_photo': 'اختاري صورة أخرى',
    'tryon.clear_photo': 'مسح',
    'tryon.garment_heading': 'أي زاوية من الفستان؟',
    'tryon.generate': 'أنشئي تجربتكِ',
    'tryon.generating': 'جارٍ إنشاء تجربتكِ…',
    'tryon.generating_hint': 'عادة يستغرق أقل من دقيقة. يُرجى إبقاء هذه النافذة مفتوحة.',
    'tryon.result_heading': 'تجربتكِ',
    'tryon.try_another': 'جرّبي صورة أخرى',
    'tryon.continue_shopping': 'متابعة التسوق',
    'tryon.book_viewing': 'احجزي مشاهدة خاصة',
    'tryon.close': 'إغلاق',
    'tryon.error_heading': 'تعذّر إنشاء التجربة',
    'tryon.error_retry': 'حاولي مرة أخرى',
    'tryon.sign_in_required': 'يُرجى تسجيل الدخول لإنشاء تجربتكِ.',
    'tryon.sign_in_action': 'تسجيل الدخول',
```

- [ ] **Step 3: Run the i18n test**

Run: `npx vitest run src/test/i18n.test.ts`

Expected: PASS. It fails if the key sets diverge, if any value is empty, or if an Arabic value of 25+ characters contains no Arabic script.

- [ ] **Step 4: Add the analytics event names**

In `src/services/analytics.ts`, replace the `AnalyticsEvent` union (lines 1–9) with:

```ts
export type AnalyticsEvent =
  | 'product_view'
  | 'add_to_selection'
  | 'remove_from_selection'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'request_viewing'
  | 'begin_checkout'
  | 'order_complete'
  | 'tryon_opened'
  | 'tryon_generated'
  | 'tryon_error';
```

Event names only. `AnalyticsPayload` has no field that could carry image data, and no field is added.

- [ ] **Step 5: Verify types**

Run: `npm run lint`

Expected: no output, exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/contexts/LanguageContext.tsx src/services/analytics.ts
git commit -m "feat(tryon): EN/AR strings and analytics event names"
```

---

## Task 4: The modal component

**Files:**
- Create: `src/components/VirtualTryOnModal.tsx`
- Create: `src/components/VirtualTryOnModal.test.tsx`

**Interfaces:**
- Consumes: `validatePhotoFile`, `fileToDataUrl`, `requestTryOn`, `TryOnError` from `src/services/tryOnClient`; `trackEvent` from `src/services/analytics`; `useLanguage`, `useAuth`, `useScrollLock`; `type Product` from `../types`.
- Produces:
  ```ts
  interface VirtualTryOnModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
  }
  ```

- [ ] **Step 1: Write the failing test**

Create `src/components/VirtualTryOnModal.test.tsx`. Read `src/components/SizeGuide.tsx` before writing this — the modal follows its structure. Mock the service and the auth context; assert on the consent contract, which is the part that must not regress.

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VirtualTryOnModal } from './VirtualTryOnModal';
import { useAuth } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';

vi.mock('../services/tryOnClient', () => ({
  validatePhotoFile: vi.fn(() => null),
  fileToDataUrl: vi.fn(async () => 'data:image/jpeg;base64,AAAA'),
  requestTryOn: vi.fn(async () => ({ base64: 'AAAA', mime: 'image/png' })),
  TryOnError: class extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  },
  assertSendableDataUrl: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({ useAuth: vi.fn() }));

const product = {
  id: '17',
  name: 'Fleur Eternelle Bridal Gown',
  description: 'A garden in full bloom.',
  productType: 'both' as const,
  images: ['/assets/a.jpg', '/assets/b.jpg'],
  category: 'Bridal Gown' as const,
  style: ['Floral'],
  color: ['Ivory'],
  sizes: ['S'],
};

function renderModal() {
  return render(
    <LanguageContext.Provider value={{ language: 'en', setLanguage: () => {}, isRtl: false, t: (k: string) => k }}>
      <VirtualTryOnModal product={product} isOpen onClose={() => {}} />
    </LanguageContext.Provider>
  );
}

const consentBox = () => screen.getByRole('checkbox') as HTMLInputElement;
const continueButton = () => screen.getByRole('button', { name: 'tryon.consent_continue' });

describe('VirtualTryOnModal consent gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { id: 'u1' }, session: { access_token: 'tok' },
    });
  });

  it('shows consent first and keeps Continue disabled until the box is ticked', () => {
    renderModal();
    expect(consentBox()).toBeTruthy();
    expect(continueButton().hasAttribute('disabled')).toBe(true);

    fireEvent.click(consentBox());
    expect(continueButton().hasAttribute('disabled')).toBe(false);
  });

  it('does not render the upload screen before consent', () => {
    renderModal();
    expect(screen.queryByRole('button', { name: 'tryon.generate' })).toBeNull();
  });

  it('reveals one thumbnail per product image after consent', () => {
    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());
    expect(screen.getAllByRole('button', { name: /view of the gown/i }).length).toBeGreaterThan(1);
  });
});

describe('VirtualTryOnModal generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { id: 'u1' }, session: { access_token: 'tok' },
    });
  });

  it('shows a result only after requestTryOn resolves', async () => {
    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([new Uint8Array([1, 2, 3])], 'me.jpg', { type: 'image/jpeg' });
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: 'tryon.generate' }));
    await waitFor(() => expect(screen.getByTestId('tryon-result')).toBeTruthy());
  });

  it('routes to sign-in instead of generating when signed out', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: null, session: null });
    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File([new Uint8Array([1])], 'me.jpg', { type: 'image/jpeg' })] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'tryon.generate' }));

    await waitFor(() => expect(screen.getByText('tryon.sign_in_required')).toBeTruthy());
  });
});
```

If `LanguageContext` does not export a `LanguageContext.Provider` with that shape, wrap the component in the app's existing test helper instead — `src/components/GalleryLightbox.test.tsx` and `src/components/SizeGuide.tsx` already show how modals are tested here. Check `src/test/setup.ts` for any global providers before adjusting.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/VirtualTryOnModal.test.tsx`

Expected: FAIL — `Cannot find module './VirtualTryOnModal'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/VirtualTryOnModal.tsx`.

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Sparkles, X, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { trackEvent } from '../services/analytics';
import { resolveMediaUrl } from '../lib/seo';
import type { Product } from '../types';
import {
  TryOnError,
  assertSendableDataUrl,
  fileToDataUrl,
  requestTryOn,
  validatePhotoFile,
} from '../services/tryOnClient';

type Screen = 'consent' | 'upload' | 'generating' | 'result' | 'error';

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function VirtualTryOnModal({ product, isOpen, onClose }: Props) {
  useScrollLock(isOpen);
  const { t } = useLanguage();
  const { session, user } = useAuth();

  const [screen, setScreen] = useState<Screen>('consent');
  const [consented, setConsented] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [garmentIndex, setGarmentIndex] = useState(0);
  const [resultUrl, setResultUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Every visit re-asks. Consent is deliberately never persisted: a stored
  // "yes" is not consent, it only hides the question.
  useEffect(() => {
    if (!isOpen) return;
    setScreen('consent');
    setConsented(false);
    setErrorMessage('');
    setInputError('');
  }, [isOpen]);

  const releaseResult = useCallback(() => {
    setResultUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return '';
    });
  }, []);

  useEffect(() => releaseResult, [releaseResult]);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPhotoDataUrl('');
    setInputError('');
    setErrorMessage('');
    releaseResult();
    setGarmentIndex(0);
    setConsented(false);
    setScreen('consent');
    trackEvent({ event: 'tryon_error', productId: product.id, productName: product.name });
    onClose();
  }, [onClose, product.id, product.name, releaseResult]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  const handleFile = useCallback(async (file: File) => {
    const invalid = validatePhotoFile(file);
    if (invalid) {
      setInputError(invalid.message);
      return;
    }
    setInputError('');
    try {
      const encoded = await fileToDataUrl(file);
      assertSendableDataUrl(encoded);
      releaseResult();
      setPhotoDataUrl(encoded);
    } catch {
      setInputError(t('tryon.upload_hint'));
    }
  }, [releaseResult, t]);

  const handleGenerate = useCallback(async () => {
    if (!session?.access_token) {
      setErrorMessage(t('tryon.sign_in_required'));
      setScreen('error');
      return;
    }
    setScreen('generating');
    setErrorMessage('');
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await requestTryOn({
        productId: product.id,
        imageIndex: garmentIndex,
        image: photoDataUrl,
        accessToken: session.access_token,
        signal: controller.signal,
      });
      releaseResult();
      setResultUrl(`data:${result.mime};base64,${result.base64}`);
      setScreen('result');
      trackEvent({ event: 'tryon_generated', productId: product.id, productName: product.name, category: product.category });
    } catch (error) {
      const message = error instanceof TryOnError ? error.message : t('tryon.error_heading');
      setErrorMessage(message);
      setScreen('error');
      trackEvent({ event: 'tryon_error', productId: product.id, productName: product.name, category: product.category });
    } finally {
      abortRef.current = null;
    }
  }, [garmentIndex, photoDataUrl, product.category, product.id, product.name, releaseResult, session?.access_token, t]);

  const busy = screen === 'generating';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('tryon.heading')}
            className="relative bg-ivory w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-10"
          >
            <button
              onClick={handleClose}
              aria-label={t('tryon.close')}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-stone-200 text-stone-500 hover:text-terracotta-dark transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-heading text-xl md:text-2xl tracking-wide text-stone-800 pr-10">
              {t('tryon.heading')}
            </h2>

            {screen === 'consent' && (
              <div className="mt-6 space-y-4">
                <p className="text-micro leading-relaxed text-stone-600">{t('tryon.consent_body')}</p>
                <p className="text-micro leading-relaxed text-stone-600">{t('tryon.consent_processor')}</p>
                <ul className="space-y-2 text-micro leading-relaxed text-stone-600">
                  <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-terracotta-dark" />{t('tryon.consent_not_saved')}</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-terracotta-dark" />{t('tryon.consent_not_shared')}</li>
                </ul>
                <p className="text-micro leading-relaxed text-stone-500 italic">{t('tryon.fit_disclaimer')}</p>

                <label className="flex items-start gap-3 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={consented}
                    onChange={(e) => setConsented(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-terracotta"
                  />
                  <span className="text-micro leading-relaxed text-stone-700">{t('tryon.consent_checkbox')}</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setScreen('upload')}
                    disabled={!consented}
                    className="btn-luxury flex-1 !py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('tryon.consent_continue')}
                  </button>
                  <button onClick={handleClose} className="btn-luxury-outline flex-1 !py-3">
                    {t('tryon.consent_decline')}
                  </button>
                </div>
              </div>
            )}

            {screen === 'upload' && (
              <div className="mt-6 space-y-5">
                <p className="text-micro text-stone-600">{t('tryon.upload_hint')}</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  data-testid="tryon-file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFile(file);
                  }}
                />

                {photoDataUrl ? (
                  <div className="space-y-3">
                    <img src={photoDataUrl} alt={t('tryon.upload_heading')} className="w-full max-h-64 object-contain bg-stone-50" />
                    <div className="flex gap-3">
                      <button onClick={() => fileInputRef.current?.click()} className="btn-luxury-outline flex-1 !py-2.5 text-micro">
                        {t('tryon.replace_photo')}
                      </button>
                      <button
                        onClick={() => { setPhotoDataUrl(''); setInputError(''); }}
                        className="btn-luxury-outline flex-1 !py-2.5 text-micro"
                      >
                        {t('tryon.clear_photo')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-stone-300 py-10 text-micro uppercase tracking-widest text-stone-500 hover:border-terracotta/50 transition-colors"
                  >
                    {t('tryon.upload_cta')}
                  </button>
                )}

                {inputError && <p className="text-micro text-rose-600">{inputError}</p>}

                <div>
                  <p className="text-micro uppercase tracking-widest text-stone-500 mb-2">{t('tryon.garment_heading')}</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((image, index) => (
                      <button
                        key={image}
                        onClick={() => setGarmentIndex(index)}
                        aria-label={`${t('tryon.garment_heading')} ${index + 1}`}
                        aria-pressed={garmentIndex === index}
                        className={`w-16 h-20 shrink-0 border transition-colors ${garmentIndex === index ? 'border-terracotta' : 'border-stone-200'}`}
                      >
                        <img src={resolveMediaUrl(image)} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => void handleGenerate()}
                  disabled={!photoDataUrl || busy}
                  className="btn-luxury w-full !py-3 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  {t('tryon.generate')}
                </button>
              </div>
            )}

            {screen === 'generating' && (
              <div className="mt-8 flex flex-col items-center gap-4 text-center py-6">
                <Loader2 className="w-7 h-7 animate-spin text-terracotta-dark" />
                <p className="text-micro uppercase tracking-widest text-stone-700">{t('tryon.generating')}</p>
                <p className="text-micro text-stone-500 max-w-xs">{t('tryon.generating_hint')}</p>
              </div>
            )}

            {screen === 'result' && (
              <div className="mt-6 space-y-4">
                <p className="text-micro uppercase tracking-widest text-stone-500">{t('tryon.result_heading')}</p>
                <img
                  data-testid="tryon-result"
                  src={resultUrl}
                  alt={`${product.name} ${t('tryon.result_heading')}`}
                  className="w-full max-h-[60vh] object-contain bg-stone-50"
                />
                <p className="text-micro leading-relaxed text-stone-500 italic">{t('tryon.fit_disclaimer')}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => { setScreen('upload'); releaseResult(); }} className="btn-luxury-outline flex-1 !py-2.5 text-micro">
                    {t('tryon.try_another')}
                  </button>
                  <a href={`/appointment?product=${encodeURIComponent(product.id)}`} className="btn-luxury-outline flex-1 !py-2.5 text-micro text-center">
                    {t('tryon.book_viewing')}
                  </a>
                  <button onClick={handleClose} className="btn-luxury flex-1 !py-2.5 text-micro flex items-center justify-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {t('tryon.continue_shopping')}
                  </button>
                </div>
              </div>
            )}

            {screen === 'error' && (
              <div className="mt-6 space-y-4">
                <p className="text-micro uppercase tracking-widest text-stone-500">{t('tryon.error_heading')}</p>
                <p className="text-micro leading-relaxed text-stone-700">{errorMessage}</p>
                {user ? (
                  <button onClick={() => setScreen('upload')} className="btn-luxury w-full !py-3">
                    {t('tryon.error_retry')}
                  </button>
                ) : (
                  <a href="/auth" className="btn-luxury w-full !py-3 block text-center">
                    {t('tryon.sign_in_action')}
                  </a>
                )}
                <button onClick={handleClose} className="btn-luxury-outline w-full !py-3 text-micro">
                  {t('tryon.close')}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/components/VirtualTryOnModal.test.tsx`

Expected: PASS. If the thumbnail query fails, the buttons are labelled `${t('tryon.garment_heading')} ${index + 1}` — under the test's identity `t`, that is `tryon.garment_heading 1`, not a phrase containing "view of the gown". Adjust the assertion to `screen.getAllByRole('button', { name: /tryon\.garment_heading/ })`.

- [ ] **Step 5: Commit**

```bash
git add src/components/VirtualTryOnModal.tsx src/components/VirtualTryOnModal.test.tsx
git commit -m "feat(tryon): consent-first try-on modal with upload, result and error states"
```

---

## Task 5: Wire the button into the product page and the feature flag

**Files:**
- Modify: `src/hooks/useFeature.ts:3-13`
- Modify: `src/pages/ProductDetail.tsx:1-25` (imports), `:37-38` (state), `:522-545` (desktop button), `:900-909` (mobile bar), `:915-920` (modal mount)

- [ ] **Step 1: Add the feature flag**

In `src/hooks/useFeature.ts`, change `DEFAULT_FEATURES` to:

```ts
const DEFAULT_FEATURES: Record<string, boolean> = {
  newsletter: true,
  whatsappBtn: true,
  preloader: true,
  instagramFeed: true,
  cookieBanner: true,
  scrollReveal: true,
  threeDViewer: true,
  customCursor: true,
  virtualTryOn: false,
};
```

`false` on purpose. The button stays hidden until the Edge Function is deployed and the secret is set, so an unconfigured deployment shows nothing rather than a broken feature.

- [ ] **Step 2: Add imports to ProductDetail**

In `src/pages/ProductDetail.tsx`, add after line 24 (`import { ProductDetailSkeleton } from '../components/Skeleton';`):

```ts
import VirtualTryOnModal from '../components/VirtualTryOnModal';
```

and add `Sparkles`-adjacent imports as needed — `Sparkles` is already imported on line 3.

- [ ] **Step 3: Add state and the eligibility check**

After line 38 (`const { addToast } = useToast();`), add:

```ts
  const tryOnEnabled = useFeature('virtualTryOn');
  const [showTryOn, setShowTryOn] = useState(false);
```

The eligibility check is derived, not stored, and is placed immediately after the `product` memo (which ends at line 88):

```ts
  const tryOnEligible = tryOnEnabled
    && (product.category === 'Bridal Gown' || product.category === 'Evening Dress')
    && product.images.length > 0;
```

- [ ] **Step 4: Add the desktop button**

In the desktop action column, insert immediately before `<button onClick={reserveViewing}` at line 524:

```tsx
                    {tryOnEligible && (
                      <button onClick={() => setShowTryOn(true)} className="w-full btn-luxury-outline !py-3 flex items-center justify-center gap-3">
                        <Sparkles className="w-4 h-4" />
                        {t('tryon.button')}
                      </button>
                    )}
```

- [ ] **Step 5: Add the mobile sticky bar button**

In the mobile sticky bar, add a third button above the existing reserve-viewing button at line 901, inside the `<div className="flex flex-col gap-1.5 shrink-0">` block:

```tsx
                    {tryOnEligible && (
                      <button onClick={() => setShowTryOn(true)} className="btn-luxury-outline !py-2.5 !px-5 text-micro flex items-center justify-center gap-2 whitespace-nowrap">
                        <Sparkles className="w-3.5 h-3.5" />
                        {t('tryon.button')}
                      </button>
                    )}
```

- [ ] **Step 6: Mount the modal**

In the `AnimatePresence` block at lines 915–920, add alongside the booking confirmation:

```tsx
        {showTryOn && tryOnEligible && (
          <VirtualTryOnModal product={product} isOpen={showTryOn} onClose={() => setShowTryOn(false)} />
        )}
```

Also track the open event, immediately after the state declaration from Step 3:

```ts
  useEffect(() => {
    if (showTryOn) {
      analytics.trackEvent({ event: 'tryon_opened', productId: product?.id, productName: product?.name });
    }
  }, [showTryOn, product?.id, product?.name]);
```

- [ ] **Step 7: Verify types and existing tests**

Run: `npm run lint`

Expected: no output, exit 0.

Run: `npm run test`

Expected: all suites PASS, including `src/test/i18n.test.ts` and the pre-existing suites.

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useFeature.ts src/pages/ProductDetail.tsx
git commit -m "feat(tryon): gated try-on button on gown product pages"
```

---

## Task 6: The Edge Function

**Files:**
- Create: `supabase/functions/virtual-tryon/index.ts`
- Modify: `.env.example` (section 3)
- Modify: `docs/CSP.md`

- [ ] **Step 1: Write the Edge Function**

Create `supabase/functions/virtual-tryon/index.ts`.

```ts
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
import { products } from '../../../src/data/products.ts';
import {
  isTryOnEligible,
  MAX_REQUEST_BYTES,
  parseGeminiResponse,
  parseTryOnRequest,
  resolveGarmentPath,
  validateImageDataUrl,
  type TryOnErrorCode,
} from './tryOnValidation.ts';

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
  not_configured: 503,
  rate_limited: 429,
  invalid_image: 400,
  upstream_timeout: 504,
  upstream_error: 502,
};

function corsFor(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowed = SITE_URL && origin.startsWith(SITE_URL) ? origin : SITE_URL;
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

async function fetchGarment(path: string): Promise<{ base64: string; mime: string }> {
  const url = absoluteAssetUrl(path);
  // Belt and braces: the path is already known to be a local /assets/ path.
  if (!url.startsWith(SITE_URL || ' ')) {
    throw new Error('garment url left the deployment origin');
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`garment fetch failed: ${response.status}`);
  const buffer = new Uint8Array(await response.arrayBuffer());
  const mime = response.headers.get('content-type') || 'image/jpeg';
  return { base64: btoa(String.fromCharCode(...buffer)), mime };
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

  // 1. Authenticate. verify_jwt already ran at the gateway; this resolves the
  //    user id we rate limit on.
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token || !SUPABASE_ANON_KEY) return fail(req, 'invalid_request', 'Sign in required.');

  const { data: userData, error: userError } = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  }).auth.getUser(token);

  if (userError || !userData?.user?.id) {
    console.error('virtual-tryon: auth rejected', userError?.message ?? 'no user');
    return fail(req, 'invalid_request', 'Sign in required.');
  }
  const userId = userData.user.id;

  // 2. Reject oversize bodies before reading them into anything.
  const declaredLength = Number(req.headers.get('content-length') || 0);
  if (declaredLength > MAX_REQUEST_BYTES) {
    return fail(req, 'invalid_image', 'Request body too large.');
  }

  // 3. Parse and validate. Consent is checked before anything else.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return fail(req, 'invalid_request', 'Body must be JSON.');
  }
  const parsed = parseTryOnRequest(raw);
  if (!parsed.ok) return fail(req, parsed.code, parsed.message);

  const image = validateImageDataUrl(parsed.value.image);
  if (!image.ok) return fail(req, image.code, image.message);

  // 4. Resolve the garment server-side. Never trust a client-supplied URL.
  const product = products.find((candidate) => candidate.id === parsed.value.productId);
  if (!product || !isTryOnEligible(product)) {
    return fail(req, 'invalid_request', 'That gown is not available for virtual try-on.');
  }
  const garmentPath = resolveGarmentPath(product, parsed.value.imageIndex);
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
    const garment = await fetchGarment(garmentPath);
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: image.value.mime, data: image.value.base64 } },
              { inline_data: { mime_type: garment.mime, data: garment.base64 } },
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
    return json({ image: generated.value.base64, mime: generated.value.mime }, 200, req);
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === 'AbortError';
    // Log the class, never the message payload.
    console.error(`virtual-tryon: ${aborted ? 'timeout' : 'fetch failure'} ip=${clientIp(req.headers)}`);
    return fail(req, aborted ? 'upstream_timeout' : 'upstream_error', 'Generation failed.');
  } finally {
    clearTimeout(timer);
  }
});
```

Note on `btoa(String.fromCharCode(...buffer))` in `fetchGarment`: this is safe for the catalogue's image sizes (well under the argument-count limit) but will throw on an unexpectedly large file. If a garment asset ever grows past roughly 500 KB, replace it with a chunked encoder:

```ts
function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
```

- [ ] **Step 2: Document the secret in .env.example**

In `.env.example`, append to section 3 (after the Turnstile secret block):

```
# AI virtual try-on (virtual-tryon edge function only).
# Free tier, no credit card: https://aistudio.google.com/apikey
# Model: gemini-2.5-flash-image  (~500 requests/day, 10/min on the free tier)
# NEVER add a VITE_ prefix here - that would publish it in the browser bundle.
GEMINI_API_KEY=AIza_your_key_here

# Optional try-on throttles (defaults: 10 per user per hour)
# TRYON_RATE_LIMIT_MAX=10
# TRYON_RATE_LIMIT_WINDOW_S=3600
```

- [ ] **Step 3: Note the CSP position in docs/CSP.md**

Append a short section to `docs/CSP.md`:

```markdown
## Virtual try-on

The browser calls only `<SUPABASE_URL>/functions/v1/virtual-tryon`. The Gemini
endpoint (`generativelanguage.googleapis.com`) is contacted **server-side only**,
from the Edge Function, so `connect-src` needs no change. The result is returned
to the browser as a base64 data URL, which the existing `img-src ... data:` entry
already permits.
```

- [ ] **Step 4: Verify nothing in src/ references the key**

Run: `Select-String -Path src\**\*.ts,src\**\*.tsx -Pattern 'GEMINI_API_KEY|generativelanguage'`

Expected: no matches. If any appear, that is a secret-leak regression — remove them.

- [ ] **Step 5: Run the full check suite**

Run: `npm run lint`

Expected: no output, exit 0.

Run: `npm run test`

Expected: all suites PASS.

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/virtual-tryon/index.ts .env.example docs/CSP.md
git commit -m "feat(tryon): auth-gated Gemini edge function; no photo is ever persisted"
```

---

## Task 7: Real end-to-end verification

This task cannot be completed by writing tests. It requires a real key and a real generation. Do not report the feature as working unless this task passes.

- [ ] **Step 1: Get the key**

Ask the user for a free Gemini API key from `https://aistudio.google.com/apikey` if they have not already supplied one. Do not write it into any tracked file.

- [ ] **Step 2: Deploy**

```bash
supabase secrets set GEMINI_API_KEY=<key>
supabase functions deploy virtual-tryon
```

Confirm the deploy output does not mention `--no-verify-jwt`, and confirm `supabase/config.toml` still has no `[functions.virtual-tryon]` block.

- [ ] **Step 3: Flip the feature flag for local testing**

In `src/hooks/useFeature.ts`, temporarily change `virtualTryOn: false` to `virtualTryOn: true`. Do not commit this change if production should stay gated — leave it for the operator to flip.

- [ ] **Step 4: Verify by hand**

```bash
npm run dev
```

Then confirm each of these:

1. A Bridal Gown product page shows the "✨ Try It On" button in both the desktop action column and the mobile sticky bar.
2. A Fine Jewelry product page does not show it.
3. Opening the modal shows the consent screen, with `Continue` disabled until the box is ticked.
4. Declining consent returns to the product page without ever showing a file picker.
5. After consent, selecting a photo shows a preview; choosing a different thumbnail is reflected.
6. Clicking `Generate My Try-On` shows the loading state; the button is disabled, and a second click does nothing.
7. **The result is a genuine synthesis.** Compare it against both the uploaded photo and the product image. It must be a different image showing the customer's person wearing the gown. If it returns the input photo, or a stock image, stop — the feature is broken and this must not be reported as working.
8. `Clear` empties the preview and the result.
9. Closing and reopening the modal asks for consent again.
10. Signed out: the consent screen is reachable, and `Generate` shows the sign-in prompt instead of generating.
11. Signed in but no quota: after 10 generations in an hour, the 11th shows the rate-limit message.
12. Uploading a `.gif` is rejected inline before any upload.
13. A photo over 8 MB is rejected inline.

- [ ] **Step 5: Regression check**

Confirm Add to Cart works, the cart drawer updates, checkout loads and reaches payment, the wishlist still toggles, and private viewing booking still opens its confirmation modal. Confirm the mobile sticky bar still shows price and both existing buttons.

- [ ] **Step 6: Restore the flag if appropriate**

If the operator wants the feature live, leave `virtualTryOn: true` and note in the final report that flipping the admin setting has the same effect. Otherwise restore `virtualTryOn: false` and commit that revert.

- [ ] **Step 7: Commit any remaining changes**

```bash
git add -A
git commit -m "chore(tryon): enable feature flag after successful end-to-end verification"
```

---

## Final Report Checklist

Per the task brief, the closing report must state:

1. Files changed.
2. How the feature works.
3. The model chosen and why, including why local execution was ruled out.
4. **Whether real AI generation actually works** — the verified answer from Task 7, not an assumption.
5. Required hardware, env vars, credentials and costs (free tier; ~500 requests/day; no credit card).
6. How to run and test locally.
7. Remaining limitations — garment fidelity is that of a general multimodal image model, not a dedicated try-on network, and product imagery varies in framing.
