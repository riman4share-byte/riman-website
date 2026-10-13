import { describe, it, expect } from 'vitest';
import {
  MAX_IMAGE_BYTES,
  ALLOWED_IMAGE_MIME,
  MIN_DIMENSION,
  MAX_DIMENSION,
  isTryOnEligible,
  isSafeGarmentPath,
  resolveGarmentPath,
  parseTryOnRequest,
  validateImageDataUrl,
  parseGeminiResponse,
  toBase64,
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

describe('isSafeGarmentPath', () => {
  it('accepts a plain local asset path', () => {
    expect(isSafeGarmentPath('/assets/a.jpg')).toBe(true);
    expect(isSafeGarmentPath('/assets/nested/dress.jpg')).toBe(true);
  });

  it('accepts unencoded spaces and non-ascii in a filename', () => {
    // Neither of these needs percent-encoding in the catalogue value, so the
    // blanket `%` rejection below cannot collide with a legitimate path.
    expect(isSafeGarmentPath('/assets/summer dress.jpg')).toBe(true);
    expect(isSafeGarmentPath('/assets/piñata-de-noche.jpg')).toBe(true);
  });

  it('rejects percent-encoded traversal segments', () => {
    expect(isSafeGarmentPath('/assets/%2e%2e/%2e%2e/.env')).toBe(false);
    expect(isSafeGarmentPath('/assets/%2E%2E/.env')).toBe(false);
    expect(isSafeGarmentPath('/assets/.%2e/.env')).toBe(false);
  });

  it('rejects percent-encoded separators and double-encoding', () => {
    // WHATWG normalisation decodes %2e but not %2f / %5c / %25, so these three
    // survive normalisation unchanged and need the blanket `%` rejection.
    expect(isSafeGarmentPath('/assets/%2e%2e%2f%2e%2e%2f.env')).toBe(false);
    expect(isSafeGarmentPath('/assets/%2e%2e%5c.env')).toBe(false);
    expect(isSafeGarmentPath('/assets/%252e%252e%252f.env')).toBe(false);
  });

  it('rejects absolute urls and backslash paths', () => {
    expect(isSafeGarmentPath('https://evil.example.com/x.jpg')).toBe(false);
    expect(isSafeGarmentPath('//evil.example.com/x.jpg')).toBe(false);
    expect(isSafeGarmentPath('/assets/..\\.env')).toBe(false);
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

  it('refuses percent-encoded separators and double-encoding', () => {
    for (const image of [
      '/assets/%2e%2e%2f%2e%2e%2f.env',
      '/assets/%2e%2e%5c.env',
      '/assets/%252e%252e%252f.env',
    ]) {
      expect(resolveGarmentPath({ id: 'z', category: 'Bridal Gown', images: [image] }, 0)).toBeNull();
    }
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

  it('rejects a payload that decodes to zero bytes', () => {
    expect(validateImageDataUrl('data:image/jpeg;base64,A')).toMatchObject({
      ok: false,
      code: 'invalid_image',
    });
  });
});

describe('dimension constants', () => {
  it('matches the spec', () => {
    expect(MIN_DIMENSION).toBe(400);
    expect(MAX_DIMENSION).toBe(8000);
  });
});

describe('toBase64', () => {
  it('round-trips a small payload', () => {
    expect(toBase64(new TextEncoder().encode('hello world'))).toBe('aGVsbG8gd29ybGQ=');
  });

  it('round-trips a payload larger than 200 KB without throwing', () => {
    // Regression for the Critical review finding: the previous
    // `btoa(String.fromCharCode(...bytes))` encoder overflowed the engine's
    // argument/stack limit (bare Node throws around 125 KB; the vitest/jsdom
    // worker here throws between 300 KB and 500 KB), so this test fails against
    // the spread implementation. 1 MB is comfortably above both and above the
    // real largest catalogue asset (709 KB).
    const bytes = new Uint8Array(1024 * 1024 + 1);
    for (let i = 0; i < bytes.length; i++) bytes[i] = i % 256;

    const encoded = toBase64(bytes);
    expect(encoded.length).toBe(Math.ceil(bytes.length / 3) * 4);

    const decoded = atob(encoded);
    expect(decoded.length).toBe(bytes.length);
    expect(decoded.charCodeAt(0)).toBe(bytes[0]);
    expect(decoded.charCodeAt(12_345)).toBe(bytes[12_345]);
    expect(decoded.charCodeAt(bytes.length - 1)).toBe(bytes[bytes.length - 1]);
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

  it('accepts a mixed-case mime type and normalises it', () => {
    const json = {
      candidates: [
        { content: { parts: [{ inlineData: { mimeType: 'IMAGE/PNG', data: 'AAAA' } }] } },
      ],
    };
    const r = parseGeminiResponse(json);
    expect(r).toMatchObject({ ok: true });
    if (r.ok) expect(r.value).toEqual({ base64: 'AAAA', mime: 'image/png' });
  });

  it('rejects inline data that is not a supported image type', () => {
    const json = {
      candidates: [
        { content: { parts: [{ inlineData: { mimeType: 'text/plain', data: 'AAAA' } }] } },
      ],
    };
    expect(parseGeminiResponse(json)).toMatchObject({ ok: false, code: 'upstream_error' });
  });

  it('rejects inline data with no bytes', () => {
    const json = {
      candidates: [
        { content: { parts: [{ inlineData: { mimeType: 'image/png', data: '' } }] } },
      ],
    };
    expect(parseGeminiResponse(json)).toMatchObject({ ok: false, code: 'upstream_error' });
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
