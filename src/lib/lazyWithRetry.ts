import { lazy, type ComponentType } from 'react';

/**
 * Recovery for failed lazy route imports.
 *
 * The common cause is a stale deploy: the browser holds an old index.html that
 * requests hash-named chunks which no longer exist. A single reload fetches the
 * fresh index.html and its matching chunks, so we reload once (with a cooldown
 * guard that makes an infinite reload loop impossible) and only for genuine
 * module-loading failures — never for application errors.
 */

const GUARD_KEY = 'riman-last-chunk-reload-ts';
const DEFAULT_COOLDOWN_MS = 15_000;

const CHUNK_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /Unable to preload CSS/i,
  /ChunkLoadError/i,
  /Loading chunk \S+ failed/i,
];

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const haystack = `${error.name}: ${error.message}`;
  return CHUNK_ERROR_PATTERNS.some((re) => re.test(haystack));
}

export interface ReloadDeps {
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  reload: () => void;
  now: () => number;
  cooldownMs?: number;
}

function defaultDeps(): ReloadDeps | null {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return null;
  return {
    storage: sessionStorage,
    reload: () => window.location.reload(),
    now: () => Date.now(),
  };
}

/**
 * Reload once for fresh chunks. Returns true if a reload was triggered,
 * false if suppressed by the cooldown guard (loop protection).
 */
export function reloadForFreshChunks(deps?: ReloadDeps): boolean {
  const d = deps ?? defaultDeps();
  if (!d) return false;
  const cooldown = d.cooldownMs ?? DEFAULT_COOLDOWN_MS;
  try {
    const last = Number(d.storage.getItem(GUARD_KEY) || 0);
    if (d.now() - last < cooldown) return false;
    d.storage.setItem(GUARD_KEY, String(d.now()));
  } catch {
    // storage unavailable (private mode) — still attempt the reload
  }
  d.reload();
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadWithRetry<T>(
  factory: () => Promise<T>,
  deps?: ReloadDeps,
): Promise<T> {
  try {
    return await factory();
  } catch (error) {
    if (isChunkLoadError(error)) {
      console.error('[riman] Route module failed to load — attempting fresh-chunk reload.', error);
      reloadForFreshChunks(deps);
    }
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): ReturnType<typeof lazy<T>> {
  return lazy(() => loadWithRetry(factory));
}
