// Bump when the precache list changes: the install handler only re-runs when
// sw.js itself is byte-different, so a stale name would keep serving the old
// shell indefinitely.
const CACHE_NAME = 'riman-v2';
const SHELL_URLS = ['/', '/index.html', '/apple-touch-icon.png', '/favicon.ico'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // Add entries individually. addAll() is atomic: one 404 anywhere in the
      // list rejects the whole promise, the install fails, and the worker is
      // never activated — so a single renamed asset silently disables offline
      // support for every visitor.
      .then(cache => Promise.all(
        SHELL_URLS.map(url =>
          cache.add(new Request(url, { cache: 'reload' })).catch(err => {
            console.warn('[sw] precache skipped', url, err);
          })
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Cross-origin requests (e.g. Google Fonts CSS) must go through the browser
  // directly: re-fetching them here applies the document's connect-src CSP
  // (which blocks them) and caches non-cacheable opaque responses.
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            // cache.put rejects 206 partial responses (Range requests from
            // media/video elements); response.ok is true for those.
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  if (url.pathname === '/' || url.pathname.startsWith('/collection') || url.pathname.startsWith('/product/')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.open(CACHE_NAME).then(cache => cache.match('/index.html'))
      )
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(cached => cached || Response.error())
    )
  );
});