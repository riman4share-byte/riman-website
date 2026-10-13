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