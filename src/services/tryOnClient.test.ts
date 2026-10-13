import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validatePhotoFile,
  fileToDataUrl,
  requestTryOn,
  assertSendableDataUrl,
  TryOnError,
  TRY_ON_TIMEOUT_MS,
} from './tryOnClient';

const png = () => new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'me.png', { type: 'image/png' });

describe('validatePhotoFile', () => {
  it('accepts jpeg, png and webp within limits', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
      const f = new File([new Uint8Array(10)], `me.${type.slice(6)}`, { type });
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
});

describe('fileToDataUrl', () => {
  // jsdom implements neither createImageBitmap nor canvas rasterisation, so
  // both are injected: without the bitmap stub a case silently falls through
  // to the FileReader path and never exercises the downscale or the limits.
  function stubDecode(width: number, height: number) {
    const order: string[] = [];
    const bitmap = {
      width,
      height,
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
    return { canvas, order, bitmap };
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('downscales to the 1600px ceiling and re-encodes as jpeg', async () => {
    const { canvas, order } = stubDecode(4000, 2000);

    const out = await fileToDataUrl(png());

    expect(out.startsWith('data:image/jpeg;base64,')).toBe(true);
    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(800);
    expect(canvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.85);
    // The bitmap must stay open until drawImage has consumed it.
    expect(order).toEqual(['decode', 'draw', 'close']);
  });

  it('rejects a decoded bitmap below 400px', async () => {
    const { bitmap } = stubDecode(399, 399);
    await expect(fileToDataUrl(png())).rejects.toMatchObject({
      code: 'invalid_image',
      message: expect.stringContaining('400x400'),
    });
    expect(bitmap.close).toHaveBeenCalled();
  });

  it('rejects a decoded bitmap above 8000px', async () => {
    const { bitmap } = stubDecode(8001, 8001);
    await expect(fileToDataUrl(png())).rejects.toMatchObject({
      code: 'invalid_image',
      message: expect.stringContaining('8000x8000'),
    });
    expect(bitmap.close).toHaveBeenCalled();
  });

  it('accepts a bitmap at exactly the 400px floor', async () => {
    stubDecode(400, 400);
    await expect(fileToDataUrl(png())).resolves.toMatch(/^data:image\/jpeg;base64,/);
  });

  it('closes the bitmap even when drawImage throws', async () => {
    const { bitmap } = stubDecode(800, 600);
    vi.stubGlobal('document', {
      createElement: () => ({
        width: 0, height: 0,
        getContext: () => ({
          drawImage: () => { throw new Error('draw failed'); },
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        }),
        toDataURL: vi.fn(),
      }),
    });

    await expect(fileToDataUrl(png())).rejects.toThrow('draw failed');
    expect(bitmap.close).toHaveBeenCalled();
  });

  it('falls back to a plain read when createImageBitmap is unavailable', async () => {
    vi.stubGlobal('createImageBitmap', undefined);
    const out = await fileToDataUrl(png());
    // The canvas path always re-encodes to jpeg, so the input's own mime can
    // only come from the FileReader fallback.
    expect(out.startsWith('data:image/png;base64,')).toBe(true);
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

  it('maps an unmapped status to upstream_error', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false, status: 500, json: async () => ({ error: 'boom' }),
    });
    await expect(
      requestTryOn({ productId: '17', imageIndex: 0, image: base64, accessToken: 'tok' }),
    ).rejects.toMatchObject({ code: 'upstream_error' });
  });

  it('maps 401 to unauthorized rather than a malformed-request message', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false, status: 401, json: async () => ({ error: 'unauthorized' }),
    });
    await expect(
      requestTryOn({ productId: '17', imageIndex: 0, image: base64, accessToken: 'tok' }),
    ).rejects.toMatchObject({ code: 'unauthorized', message: 'Your session has expired. Please sign in again.' });
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

  it('clears the 60s timer once the request settles', async () => {
    vi.useFakeTimers();
    try {
      let sent: AbortSignal | undefined;
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation((_url, init) => {
        sent = (init as RequestInit).signal as AbortSignal;
        return Promise.resolve({ ok: true, status: 200, json: async () => ({ image: 'QUJD' }) });
      });

      await requestTryOn({ productId: '17', imageIndex: 0, image: base64, accessToken: 'tok' });

      expect(sent?.aborted).toBe(false);
      await vi.advanceTimersByTimeAsync(TRY_ON_TIMEOUT_MS * 2);
      // A timer that outlived the request would abort an already-finished one.
      expect(sent?.aborted).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('propagates an outer abort to the in-flight request', async () => {
    let sent: AbortSignal | undefined;
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation((_url, init) => {
      sent = (init as RequestInit).signal as AbortSignal;
      return new Promise((_resolve, reject) => {
        sent?.addEventListener('abort', () => reject(new DOMException('The user aborted a request.', 'AbortError')));
      });
    });

    const outer = new AbortController();
    const pending = requestTryOn({
      productId: '17', imageIndex: 0, image: base64, accessToken: 'tok', signal: outer.signal,
    });
    outer.abort();

    await expect(pending).rejects.toMatchObject({ code: 'upstream_timeout' });
    expect(sent?.aborted).toBe(true);
  });

  it('aborts immediately when the caller signal is already aborted', async () => {
    let sent: AbortSignal | undefined;
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation((_url, init) => {
      sent = (init as RequestInit).signal as AbortSignal;
      // A fetch handed an already-aborted signal rejects at once; without the
      // pre-abort check this never rejects and the request runs the full 60s.
      return sent.aborted
        ? Promise.reject(new DOMException('The user aborted a request.', 'AbortError'))
        : new Promise(() => {});
    });

    const outer = new AbortController();
    outer.abort();

    await expect(
      requestTryOn({
        productId: '17', imageIndex: 0, image: base64, accessToken: 'tok', signal: outer.signal,
      }),
    ).rejects.toMatchObject({ code: 'upstream_timeout' });
    expect(sent?.aborted).toBe(true);
  });
});

describe('assertSendableDataUrl', () => {
  it('accepts a well-formed base64 image data URL', () => {
    expect(() => assertSendableDataUrl('data:image/jpeg;base64,AAAA')).not.toThrow();
  });

  it('rejects a malformed data URL', () => {
    expect(() => assertSendableDataUrl('not-a-data-url')).toThrowError(TryOnError);
  });

  it('rejects an unsupported mime', () => {
    expect(() => assertSendableDataUrl('data:image/gif;base64,AAAA')).toThrowError(TryOnError);
  });

  it('rejects an oversized payload', () => {
    // 12 M base64 characters decode to 9 MB, past the 8 MB ceiling.
    const oversized = `data:image/jpeg;base64,${'A'.repeat(12 * 1024 * 1024)}`;
    expect(() => assertSendableDataUrl(oversized)).toThrowError(/exceeds the 8 MB limit/);
  });
});
