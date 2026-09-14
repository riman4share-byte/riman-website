# Bundle / dist analysis

Measured on a production build (`SITE_URL=https://riman.ae npm run build`).

## dist composition

| Bucket | Size | Notes |
| --- | --- | --- |
| media (mp4/jpg/png in `dist/assets`) | ~338 MB | **Repo-tracked operator media** served as static files — not part of any JS payload. Biggest single win if migrated to a CDN/Supabase Storage. |
| JS + CSS chunks | ~2.8 MB (pre-gzip) | What browsers actually download per visit (below). |
| prerendered `index.html` copies | 57 pages | Public static routes + 36 seeded product pages; plain HTML, cache headers inherited from `/` location. |

## Largest JS chunks (pre-gzip)

| Chunk | Size | Why |
| --- | --- | --- |
| `model-viewer-*.js` | ~1.0 MB | `@google/model-viewer` behind lazy `ThreeDViewer` on product pages only. Causes the build's "500 kB" warning — expected and acceptable (code-split, not loaded by default). |
| `index-*.js` | ~740 kB | App shell: React + router + motion + contexts (`vendor`/`ui` manualChunks configured). |
| `recharts-*.js` | ~385 kB | Admin dashboard only. |
| `ui-*.js` | ~165 kB | Shared lucide/motion/date-fns surface. |
| route chunks | <50 kB each | Every page is lazy (`lazyWithRetry`). |

Effective first visit (landing page) ≈ index + vendor + ui chunks (gzipped far
below raw totals); checkout/auth/gallery pages only pay their route chunk.

## Keeping it honest

- `npm run build` warnings are re-checked after each dependency change; the
  only >500 kB warning should be `model-viewer`/`index`. New warnings = a
  regression signal (e.g. someone imported admin charts into the storefront).
- Bundle comparison locally:
  `npx vite build --mode production` then
  `Get-ChildItem dist/assets -File | Sort-Object Length -Descending`.
- `npm audit` must target `--registry=https://registry.npmjs.org` (the mirror
  in `.npmrc` implements no audit endpoint — CI already does this).

## Future candidates (not done here)

- Move operator mp4/video to CDN + poster images (biggest transfer win).
- Route-level `preconnect` hints for Supabase (already via admin head code).
- Sentry `bundle-visualizer` pass if the shell chunk grows past ~800 kB raw.

