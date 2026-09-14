# Content Security Policy

## Where the policy lives

The **Nginx configuration is the single source of truth** for production
headers:

| File | Role |
| --- | --- |
| `security-headers.conf` | All security headers incl. the CSP. Included from **every** location block in `nginx.conf`. |
| `nginx.conf` | SPA routing, caching, include of the snippet. |
| `public/_headers` | Netlify deployment mirror — keep byte-identical CSP. |
| `index.html` | **No** `<meta http-equiv="Content-Security-Policy">` (it was removed: meta CSP cannot deliver `frame-ancestors`, cannot `upgrade-insecure-requests`, and drifted from the server policy). |

Why include-per-location: nginx drops inherited `add_header` directives as
soon as a location declares its own `add_header`. The per-location
`Cache-Control` lines would otherwise have silently removed the CSP from HTML
documents. A build test or PR check should always verify both `/` and
`/assets/*` responses carry the header.

## The policy

```
default-src 'self';
script-src  'self' 'wasm-unsafe-eval'
            https://challenges.cloudflare.com   # Turnstile captcha (Auth)
            https://www.googletagmanager.com    # Google Analytics (admin-set gaId)
            https://plausible.io                # Plausible (admin-set)
            https://cdn.usefathom.com;          # Fathom (admin-set)
style-src   'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src     'self' data: blob: https:;
font-src    'self' https://fonts.gstatic.com data:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co
            https://api.stripe.com
            https://challenges.cloudflare.com
            analytics hosts as above
            https://*.ingest.sentry.io          # error reporting (VITE_SENTRY_DSN)
            https://modelviewer.dev https://raw.githubusercontent.com;  # sample .glb models
frame-src   https://challenges.cloudflare.com https://www.google.com https://maps.google.com;  # Turnstile widget, Maps embed
media-src / worker-src / object-src 'none' / base-uri 'self' / form-action 'self' /
frame-ancestors 'self' / upgrade-insecure-requests
```

Deliberate decisions:

- **No `'unsafe-inline'` or `'unsafe-eval'` in `script-src`.** All app JS is
  bundled. The Google Analytics bootstrap (previously an inline snippet
  interpolating `pathname` into JS) moved to the external
  `public/ga-loader.js`. Admin "custom head code" can only ever inject
  allowlisted `<meta>`/`<link>` tags (`src/lib/safeHead.ts`) — scripts are
  discarded before the DOM is touched.
- **`'wasm-unsafe-eval'`** is required by `@google/model-viewer`
  (WebAssembly decoding for `.glb` models). It is strictly weaker than
  `unsafe-eval` (allows Wasm compilation, not arbitrary `eval`).
- **`style-src 'unsafe-inline'` is kept** because React writes inline `style`
  attributes on DOM nodes (and motion animates `filter`/`transform` via
  style attributes). Removing it would require nonces everywhere for limited
  gain; inline styles cannot execute script under the script policy.
- **`img-src https:` is intentionally broad**: gallery/product imagery is
  operator-controlled (Supabase Storage, legacy Unsplash URLs, arbitrary
  admin-entered URLs). Tightening it means also migrating every stored image
  host into an explicit list — do it in one coordinated change.
- Stripe's `js.stripe.com` was **removed**: checkout uses Stripe-hosted
  redirects (`create-checkout` edge function), the frontend never loads
  Stripe.js (`@stripe/react-stripe-js` was unused — see package cleanup).
- `X-XSS-Protection` was removed (deprecated; can introduce vulnerabilities
  in older browsers; CSP + `nosniff` supersede it).

## Changing the policy

1. Edit `security-headers.conf` **first**.
2. Mirror the exact CSP string into `public/_headers`.
3. Test with the built site (`docker build` + `docker run -p 8080:80`, or
   `vite preview` with the headers attached) and open DevTools → Network →
   check for `Content-Security-Policy-Report-Only` violations before and
   after each interactive flow (checkout, auth/Turnstile, admin upload, 3D
   viewer, analytics with IDs set).
4. If a new third party is needed, add the narrowest directive that works —
   never reintroduce `unsafe-inline`/`unsafe-eval` in `script-src`.

Consider switching to CSP nonces for scripts once the GA loader is the only
external need, and to a `report-to`/`Report-URI` endpoint for monitoring.
