import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.stubEnv('VITE_SUPABASE_URL', '');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
  global.fetch = vi.fn();
});

describe('uploadReviewPhoto', () => {
  it('rejects non-image files before any network call', async () => {
    const { uploadReviewPhoto } = await import('./upload');
    const file = new File(['x'], 'notes.pdf', { type: 'application/pdf' });

    await expect(uploadReviewPhoto(file)).rejects.toThrow('Only JPEG, PNG, or WebP images are allowed.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('rejects files over 5MB before any network call', async () => {
    const { uploadReviewPhoto } = await import('./upload');
    const file = new File(['x'], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 + 1 });

    await expect(uploadReviewPhoto(file)).rejects.toThrow('Image must be under 5MB.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uploads through the edge function and returns its public URL', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://example.supabase.co/storage/v1/object/public/review-photos/reviews/a.jpg' }),
    });

    const { uploadReviewPhoto } = await import('./upload');
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });

    await expect(uploadReviewPhoto(file)).resolves.toBe(
      'https://example.supabase.co/storage/v1/object/public/review-photos/reviews/a.jpg',
    );

    const [url, init] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('https://example.supabase.co/functions/v1/upload-review-photo');
    expect(init.method).toBe('POST');
    expect(init.headers.apikey).toBe('anon-key');
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.body as FormData).get('file')).toBe(file);
  });

  it('surfaces the edge function error message', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 413,
      json: () => Promise.resolve({ error: 'Image must be under 5MB.' }),
    });

    const { uploadReviewPhoto } = await import('./upload');
    const file = new File(['x'], 'photo.png', { type: 'image/png' });

    await expect(uploadReviewPhoto(file)).rejects.toThrow('Image must be under 5MB.');
  });
});
