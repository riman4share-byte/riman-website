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
    // jsdom implements neither createImageBitmap nor canvas rasterisation, so
    // both are injected: without the bitmap stub this case silently falls
    // through to the FileReader path and never exercises the downscale.
    const order: string[] = [];
    const bitmap = {
      width: 4000,
      height: 2000,
      close: vi.fn(() => order.push('close')),
    };
    vi.stubGlobal('createImageBitmap', vi.fn(async () => {
      order.push('decode');
      return bitmap;
    }));

    const canvas = {
      width: 0, height: 0,
      getContext: () => ({
        drawImage: vi.fn(() => order.push('draw')),
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
    // The bitmap must stay open until drawImage has consumed it.
    expect(order).toEqual(['decode', 'draw', 'close']);
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