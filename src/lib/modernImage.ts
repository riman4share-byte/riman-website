/**
 * Modern-encoding delivery for local product media.
 *
 * `scripts/optimize-images.mjs` mirrors `public/assets/**` into
 * `public/assets/assets-avif/**` and `public/assets/assets-webp/**`, writing
 * same-file-structure `.avif` / `.webp` encodings. This module knows how to
 * turn a source path (as stored on `Product.images`) into those variant URLs,
 * so a component can render a <picture> chain: AVIF → WebP → original fallback.
 *
 * Anything that is not a local `/assets/**` path (e.g. a Supabase Storage URL)
 * is returned as-is with no variants, so remote media keeps working.
 */

export interface ModernImageSources {
  /** Source URLs for the <picture> chain, in preference order. */
  sources: { srcSet: string; type: string }[];
  /** The original image — used as the <img> fallback / src. */
  fallback: string;
}

function relAssetsDir(src: string): string | null {
  // Accept both "/assets/foo/bar.jpg" and "assets/foo/bar.jpg".
  const m = src.replace(/^\/?/, '').match(/^assets\/(.+)$/);
  return m ? m[1] : null;
}

/**
 * Build the <picture> source ladder for a product image path.
 *
 * @param src      The original image path (e.g. "/assets/foo.jpg").
 * @param widths   Responsive width ladder for the srcset. Each entry also
 *                 produces an AVIF + WebP encoding at that width; the first
 *                 (full-resolution) entry has no width suffix.
 */
export function modernImageSources(
  src: string,
  widths: number[] = [0, 480, 800, 1200, 1600],
): ModernImageSources | null {
  const rel = relAssetsDir(src);
  if (!rel) return null;

  const stem = rel.replace(/\.[^.]+$/, '');
  const dir = pathDir(stem);

  const variantsFor = (format: 'avif' | 'webp') =>
    widths
      .map((w) => (w > 0 ? `/assets/assets-${format}/${dir ? `${dir}/` : ''}${stem}-w${w}.${format}` : `/assets/assets-${format}/${dir ? `${dir}/` : ''}${stem}.${format}`))
      .join(', ');

  return {
    sources: [
      { srcSet: variantsFor('avif'), type: 'image/avif' },
      { srcSet: variantsFor('webp'), type: 'image/webp' },
    ],
    fallback: src,
  };
}

/** Directory prefix of an assets-relative path, without a trailing slash. */
function pathDir(relStem: string): string {
  const idx = relStem.lastIndexOf('/');
  return idx === -1 ? '' : relStem.slice(0, idx);
}

/** Convenience guard: is this a local asset we can optimize? */
export function isLocalAsset(src: string): boolean {
  return relAssetsDir(src) !== null;
}
