import { describe, expect, it, vi } from 'vitest';
import { isChunkLoadError, loadWithRetry, reloadForFreshChunks } from './lazyWithRetry';

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => { map.set(k, v); },
  };
}

describe('isChunkLoadError', () => {
  it('recognizes Vite/webpack module loading failures', () => {
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: https://x/app-legacyhash.js'))).toBe(true);
    expect(isChunkLoadError(new Error('Unable to preload CSS for /assets/Index-abc.css'))).toBe(true);
    expect(isChunkLoadError(Object.assign(new Error('req failed'), { name: 'ChunkLoadError' }))).toBe(true);
  });

  it('does not treat application errors as chunk failures', () => {
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false);
    expect(isChunkLoadError('Failed to fetch dynamically imported module')).toBe(false);
    expect(isChunkLoadError(null)).toBe(false);
  });
});

describe('reloadForFreshChunks', () => {
  it('reloads once, then blocks repeat reloads inside the cooldown window', () => {
    const storage = memoryStorage();
    const reload = vi.fn();
    let now = 1_000_000;
    const deps = { storage, reload, now: () => now };

    expect(reloadForFreshChunks(deps)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);

    now += 5_000; // still cooling down
    expect(reloadForFreshChunks(deps)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);

    now += 20_000; // cooldown expired (new failure later)
    expect(reloadForFreshChunks(deps)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });
});

describe('loadWithRetry', () => {
  it('resolves with the module on success and never reloads', async () => {
    const storage = memoryStorage();
    const reload = vi.fn();
    const mod = { default: () => null };
    await expect(loadWithRetry(() => Promise.resolve(mod), { storage, reload, now: Date.now }))
      .resolves.toBe(mod);
    expect(reload).not.toHaveBeenCalled();
  });

  it('triggers a guarded reload for stale-chunk failures and still rejects', async () => {
    const storage = memoryStorage();
    const reload = vi.fn();
    const failure = new TypeError('Failed to fetch dynamically imported module: /assets/Index-old.js');
    await expect(loadWithRetry(() => Promise.reject(failure), { storage, reload, now: Date.now }))
      .rejects.toBe(failure);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload for application errors thrown by the factory', async () => {
    const storage = memoryStorage();
    const reload = vi.fn();
    const failure = new Error('SyntaxError in route component');
    await expect(loadWithRetry(() => Promise.reject(failure), { storage, reload, now: Date.now }))
      .rejects.toBe(failure);
    expect(reload).not.toHaveBeenCalled();
  });
});
