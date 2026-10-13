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

  it('rejects percent-encoded traversal segments', () => {
    expect(isSafeGarmentPath('/assets/%2e%2e/%2e%2e/.env')).toBe(false);
    expect(isSafeGarmentPath('/assets/%2E%2E/.env')).toBe(false);
    expect(isSafeGarmentPath('/assets/.%2e/.env')).toBe(false);
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
