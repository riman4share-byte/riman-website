import { supabase, isSupabaseConfigured, edgeFunctionsBase, supabaseAnonKey } from './supabase';

const BUCKET_NAME = 'review-photos';
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function validateImage(file: File): void {
  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Only JPEG, PNG, or WebP images are allowed.');
  if (file.size > MAX_FILE_BYTES) throw new Error('Image must be under 5MB.');
}

// Admin product images: direct Storage write. RLS only permits admins to
// insert under the products/ prefix, and the bucket enforces size/MIME.
export async function uploadImage(file: File): Promise<string> {
  validateImage(file);
  if (isSupabaseConfigured) return uploadProductImageToSupabase(file);
  return uploadToFallback(file);
}

async function uploadProductImageToSupabase(file: File): Promise<string> {
  const ext = EXTENSIONS[file.type] || 'jpg';
  const fileName = `products/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, { contentType: file.type, upsert: false });
  if (error) throw error;

  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
  if (!urlData?.publicUrl) throw new Error('Upload failed. Please try again.');
  return urlData.publicUrl;
}

// Public review photos: go through the upload-review-photo edge function,
// which sniffs the file signature, enforces 5 MB, and rate-limits the caller.
// Direct anonymous Storage writes are not permitted.
export async function uploadReviewPhoto(file: File): Promise<string> {
  validateImage(file);
  if (isSupabaseConfigured && edgeFunctionsBase) return uploadToEdgeFunction(file);
  return uploadToFallback(file);
}

async function uploadToEdgeFunction(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);

  const headers: Record<string, string> = {};
  if (supabaseAnonKey) {
    headers.apikey = supabaseAnonKey;
    headers.Authorization = `Bearer ${supabaseAnonKey}`;
  }

  const res = await fetch(`${edgeFunctionsBase}/upload-review-photo`, {
    method: 'POST',
    headers,
    body: form,
  });

  if (!res.ok) {
    const message = await res.json().catch(() => null);
    throw new Error(message?.error || 'Upload failed. Please try again.');
  }

  const data = await res.json().catch(() => null);
  if (!data?.url) throw new Error('Upload failed. Please try again.');
  return data.url as string;
}

async function uploadToFallback(file: File): Promise<string> {
  // Cap fallback payloads: localStorage quota (~5MB) can't hold 5MB base64 (~6.6MB).
  // Downscale via canvas to max 1200px / JPEG 0.8 before DataURL.
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
  const maxDim = 1200;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to process image');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.8);
}
