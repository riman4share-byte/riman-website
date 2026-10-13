# AI Virtual Dress Try-On — Design Spec

**Date:** 2026-10-13
**Status:** Approved
**Author:** AI Studio

## Overview

Add a real AI-powered virtual try-on to eligible gown product pages. A signed-in customer opens the try-on
modal, consents to their photo being processed, uploads a photo, and Gemini returns an image of them wearing
the gown they are currently viewing.

This is an additive feature. No existing page, cart, checkout, or design element is redesigned.

## Goals

- A "✨ Try It On" button on dress product pages that opens a real, working AI try-on.
- Genuine inference from a hosted model. No placeholder, no static image, no returning the input photo.
- Customer photo never persisted anywhere.
- Explicit, informed, revocable-per-visit consent before any photo is used.
- Gemini key never reaches the browser.
- Free to run. No paid tier, no credits, no charges.

## Non-goals

- No redesign of product pages, navigation, cart, or checkout.
- No storage or history of try-on images.
- No local model execution (see "Model selection — why not local").
- No multi-angle garment synthesis in one call.
- No public/anonymous access.
- No lead capture, email gate, or marketing opt-in as part of this feature.

## Model selection

**Chosen: `gemini-2.5-flash-image` ("Nano Banana"), via the Google Gemini API free tier.**

Free tier: approximately 500 requests/day and 10 requests/minute, no credit card required. This is genuine
API-tier free access, not website/demo credits — the same key works from `generativelanguage.googleapis.com`.

It accepts multiple input images plus text, which is exactly the shape required: one image of a person, one
image of a garment. It is a real image-generation model doing real synthesis.

**Why not local.** The development machine has an NVIDIA GeForce MX130 with 2 GB VRAM and 24 GB system RAM.
Every purpose-built open virtual try-on model is out of reach: IDM-VTON needs ~16 GB VRAM, StableVITON ~8 GB,
OOTDiffusion/try-on modules ~10-12 GB. None can run here, and downloading weights would be pointless. Hosted
inference is the only path.

**Why not Replicate/fal.ai.** They host dedicated try-on models (IDM-VTON, StableVITON) that generally
reproduce garment structure more faithfully than a general image model. But they offer only a small amount of
one-time trial credit and then charge per image. The brief forbids incurring charges, so these are out. If
garment fidelity later proves insufficient on the free tier, this adapter is the seam where a paid dedicated
model would be substituted — that is a future decision, not a blocker now.

**Known quality caveat, stated honestly.** This is a general-purpose multimodal image model, not a
garment-geometry try-on network. It reproduces silhouette, colour, and overall drape convincingly; it does not
guarantee accurate construction detail (seam placement, exact beadwork, hem finish). The UI must present the
result as a visualisation, never as a fit guarantee. See "Disclaimer".

## Architecture

The repository already has the correct seam: `supabase/functions/` contains four Deno Edge Functions that hold
secrets server-side. `create-checkout` holds `STRIPE_SECRET_KEY` behind the same boundary this feature needs
for the Gemini key. We add a fifth function; we introduce no new deployment target.

```
Browser                           Edge Function                     Google
────────                           ─────────────                     ──────
VirtualTryOnModal.tsx    ──POST──▶ virtual-tryon/index.ts    ──▶  generativelanguage
  ├ consent gate                    ├ require valid JWT                 .google.com
  ├ file picker                     ├ verify consent === true
  ├ client validation               ├ rate limit (try_rate_limit RPC)
  └ src/services/tryOn.ts          ├ resolve garment URL from products.ts
       │                           ├ fetch garment server-side
       │ base64 JPEG in memory      ├ call Gemini 2.5 Flash Image
       │                           └ return base64 result
       ▼
  React state (result image)
```

### The garment image is fetched server-side

The browser sends **only** `productId`, `imageIndex`, `consent`, and the person's photo. The Edge Function maps
`productId` + `imageIndex` to a URL from `src/data/products.ts` and fetches it itself.

This is a deliberate SSRF control: a crafted request can never instruct the server to fetch an arbitrary URL.
It mirrors the existing rule in `create-checkout`, which refuses client-supplied prices and derives them from
the database.

### Secrets

`GEMINI_API_KEY` is an Edge Function secret, set with `supabase secrets set GEMINI_API_KEY=...`. It has no
`VITE_` prefix and is never readable from the browser. The client calls
`${VITE_SUPABASE_URL}/functions/v1/virtual-tryon`, derived from `edgeFunctionsBase` in
`src/services/supabase.ts`.

## Consent

Consent is the **first screen of the modal**, shown before any file picker opens. This is a requirement, not
styling.

Requirements:

- The disclosure names **Google's Gemini AI** explicitly as the processor. "Processed by AI" is not a
  disclosure.
- It states plainly that the photo is **not saved** — neither upload nor result.
- It states that the result is a visualisation and not a fit guarantee, pointing to the atelier's in-person
  sizing confirmation.
- `Continue` is disabled until the checkbox is ticked.
- Consent is `useState` inside the modal. It is **not** persisted to `localStorage`, cookies, or the database.
  Closing the modal discards it; reopening asks again.
- The client sends `consent: true` in the request body, and the Edge Function rejects any request where it is
  not `true`.

The server-side check is a guardrail against an accidentally-skipped step and a clear contract for the
endpoint. It is not an anti-abuse control: an attacker holding a valid key can bypass any client logic.

## Eligibility

The button renders only when all are true:

- `product.category` is `'Bridal Gown'` or `'Evening Dress'` — 32 of 36 products qualify. The 3 Accessories
  and 1 Fine Jewelry item do not.
- `useFeature('virtualTryOn')` is true. Default is `false` until the Edge Function is deployed and the secret
  is set, so an unconfigured deployment shows no button rather than a broken feature.
- The product has at least one image.

The button is **visible to signed-out visitors** and reads "✨ Try It On". Clicking it while signed out opens
the consent screen, then routes to sign-in at the point of generation rather than at the point of entry — so
the feature is discoverable and the customer understands what they are being offered before being asked to log
in. It never opens the file picker for a signed-out customer.

## UI

Modal component `src/components/VirtualTryOnModal.tsx`, following the established `SizeGuide.tsx` pattern:
`AnimatePresence`, `useScrollLock(isOpen)`, `role="dialog"`, `aria-modal="true"`, `z-[200]`, motion
fade/scale entry.

Screens, in order:

1. **Consent** — heading "See Yourself in This Dress", disclosure text, checkbox, `Continue`, `Not now`.
2. **Upload** — drop zone or file input, preview of the chosen photo, garment thumbnail strip (one small
   thumbnail per `product.images` entry, chosen image highlighted), `Generate My Try-On`.
3. **Generating** — spinner plus status text. Button disabled, no double submission.
4. **Result** — generated image, `Try another photo`, `Clear`, `Close`, `Continue shopping`, and the fit
   disclaimer.
5. **Error** — friendly message with `Try again`, for validation failure, rate limit, timeout, and upstream
   failure. Distinct messages for rate-limit and not-configured; a generic message for everything else.

Styling uses existing tokens (`btn-luxury`, `btn-luxury-outline`, `text-micro`, `font-heading`, `bg-ivory`,
`text-terracotta-dark`) so it matches the existing luxury aesthetic. Mobile: full-width sheet, single column,
thumbnails scroll horizontally. Desktop: centred, max-width ~lg.

### Garment image selection

The customer picks which angle of the gown to try on, from a thumbnail strip. This exists because real product
imagery is inconsistent: some gowns' first image is a full-length studio shot (ideal), while others are a
face-and-bodice portrait close-up (poor as a garment reference, since the silhouette is not visible). Default
selection is `images[0]`. Only the chosen index is sent.

## Data flow

1. Customer opens modal → consent screen.
2. Ticks consent → upload screen.
3. Chooses file → client validates: type in `image/jpeg`, `image/png`, `image/webp`; size ≤ 8 MB; dimensions
   between 400×400 and 8000×8000. On success, the client downscales via canvas to max 1600px longest edge and
   re-encodes as JPEG 0.85, reducing both payload and cost.
4. Chooses garment thumbnail → clicks `Generate My Try-On` → button disabled, `AbortController` armed.
5. `services/tryOn.ts` POSTs JSON `{ productId, imageIndex, consent: true, image: <base64> }` with the
   Supabase session bearer token.
6. Edge Function: validates auth → validates consent → validates payload shape and size → rate limits via
   `try_rate_limit` → resolves garment URL → fetches garment → calls Gemini → returns `{ image: <base64> }`.
7. Client decodes into an object URL, displays it, revokes the previous URL on replace/clear/unmount.

## Security and privacy

- `GEMINI_API_KEY` server-side only, never in a `VITE_` variable.
- Edge Function requires a valid Supabase JWT; it is **not** deployed with `--no-verify-jwt`.
- Rate limit via the existing `try_rate_limit` RPC, keyed on the authenticated user id: **10 generations per
  user per hour**. Reuses the established primitive and its service-role grant. Fails open with a loud log, as
  `create-checkout` does.
- Server-side validation of image type, byte size, and base64 shape is independent of the client checks.
- Request body size capped at **10 MB** (8 MB image plus JSON envelope overhead); oversize payloads are
  rejected before any upstream call. Client and server enforce the same 8 MB image ceiling.
- Garment URLs are resolved from `products.ts` server-side. The client cannot supply a URL.
- **No photo or result is written to Supabase Storage, any database table, or any log line.** The Edge Function
  logs only status codes, durations, and error classes — never image bytes, never base64.
- Object URLs are revoked on replace, clear, and unmount so images do not linger in memory.
- No analytics event captures the photo or the result. Event names only, no image payload.
- Garment images are fetched from the site's own public asset origin, allowlisted server-side.

## Error handling

| Condition | Behaviour |
|---|---|
| Unsupported type / too large / too small | Rejected client-side before upload, inline message |
| Not signed in | Consent screen still shows; `Generate` routes to sign-in and preserves the selected photo in memory so it is not lost |
| Consent not given | Server rejects 400 |
| Feature not configured (no key) | Server returns 503; button hidden by feature flag |
| Rate limit hit | Server returns 429 with retry-after; specific UI message |
| Gemini timeout (> 60s) | `AbortController` fires; retryable error |
| Gemini upstream error / malformed response | Generic retryable error; details server-side only |
| Non-image response from Gemini | Treated as error; result never displays |

The result panel renders **only** after a successful response containing valid image bytes. There is no code
path that displays a result without real inference behind it.

## Files

**New**

- `supabase/functions/virtual-tryon/index.ts` — Edge Function
- `supabase/functions/virtual-tryon/tryOnValidation.ts` — pure validation + garment lookup, unit-testable
- `src/services/tryOn.ts` — client service: validate, downscale, POST, abort, error mapping
- `src/services/tryOnValidation.test.ts` — unit tests
- `src/components/VirtualTryOnModal.tsx` — modal UI
- `src/components/VirtualTryOnModal.test.tsx` — component tests

**Modified**

- `src/pages/ProductDetail.tsx` — eligibility check, feature flag, button, modal mount
- `src/hooks/useFeature.ts` — add `virtualTryOn: false` default
- `src/contexts/LanguageContext.tsx` — en + ar strings
- `.env.example` — document `GEMINI_API_KEY` under server-only secrets
- `docs/CSP.md` — document the new Edge Function and Gemini endpoint if CSP enumerates connect-src

**Not modified**

Cart, checkout, payment, auth logic, routing, product data, styling system, admin dashboard.

## Deployment

```
supabase secrets set GEMINI_API_KEY=<key>
supabase functions deploy virtual-tryon
```

Deploy **without** `--no-verify-jwt` — this function requires an authenticated session.

Then flip the feature flag default in `useFeature.ts` from `false` to `true`, or enable `virtualTryOn` in the
admin settings panel via `SettingsContext`.

## Testing

- `npm run lint` (`tsc --noEmit`) clean.
- `npm run test` (vitest) passes, including new tests.
- `npm run build` succeeds.
- Unit: client and server validation accept/reject cases; garment URL resolution is allowlisted.
- Component: consent gates the upload screen; Continue disabled until ticked; generating state disables
  submit; clear revokes and resets; error states render.
- Manual, with a real key: real try-on succeeds on a full-length garment image; the result is a genuinely
  synthesised image, not the input; signed-out users cannot generate; rate limit triggers after the limit.
- Regression: product pages render, Add to Cart works, cart and checkout work, mobile sticky bar unaffected.

## Limitations

- Garment fidelity is that of a general multimodal image model, not a dedicated try-on network. Seam and
  embellishment detail will not be exact. The UI must not imply otherwise.
- Free tier caps usage at roughly 500 generations/day site-wide, and Gemini may tighten it. The per-user
  hourly limit is the primary control.
- Product imagery is inconsistent in framing, so try-on quality will vary by product. The thumbnail strip lets
  the customer pick a better angle, but cannot fix a garment photographed only as a close-up.
- Gemini is a third-party processor in another jurisdiction; the consent disclosure names this explicitly.
- The photo is tied to a signed-in account, which raises the stakes on the "never saved" promise. That promise
  is what this design guarantees, and it should not be weakened later without revisiting consent.
- If Gemini changes its free-tier terms, the adapter needs a paid key or a different provider. That is the one
  external dependency.
