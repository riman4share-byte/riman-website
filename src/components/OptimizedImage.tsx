import { useMemo } from 'react';
import { modernImageSources } from '../lib/modernImage';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  className?: string;
  /** Responsive width ladder; defaults to [480,800,1200,1600]. */
  widths?: number[];
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'auto' | 'sync';
  width?: number;
  height?: number;
  [key: string]: unknown;
}

/**
 * Renders a <picture> chain — AVIF → WebP → original JPEG fallback — for local
 * product media. Remote (Supabase) URLs render as a plain <img>. The original
 * path is always the <img src> fallback so a missing variant degrades
 * gracefully rather than 404ing.
 */
export default function OptimizedImage({
  src,
  alt = '',
  className,
  widths = [0, 480, 800, 1200, 1600],
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  width,
  height,
  ...rest
}: OptimizedImageProps) {
  const sources = useMemo(() => modernImageSources(src, widths), [src, widths]);

  const img = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      referrerPolicy="no-referrer"
      className={className}
      {...rest}
    />
  );

  if (!sources || sources.sources.length === 0) return img;

  return (
    <picture>
      {sources.sources.map((s) => (
        <source key={s.type} type={s.type} srcSet={s.srcSet} />
      ))}
      {img}
    </picture>
  );
}
