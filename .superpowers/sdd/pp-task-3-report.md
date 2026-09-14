# Task 3 Report: Migrate components to tokens + contrast lift

**Status:** DONE
**Commit:** `85250dd` — `a11y(components): 11px type floor + AA contrast on light surfaces`
**Branch:** salon-rebrand
**Scope:** 17 files under `src/components/` (76 insertions, 76 deletions — pure class swaps)

## Step 1: Size migration (all 17 files)

Every `text-[8px]`/`text-[9px]`/`text-[10px]`/`text-[11px]` → `text-micro`, every `text-[12px]` → `text-caption`. Size class only — tracking, casing, weight, and color untouched in this step.

| File | Occurrences migrated |
|---|---|
| AvailabilityCalendar.tsx | 4 (8px×3, 10px×1) |
| Footer.tsx | 5 (10px×5) |
| GalleryFilters.tsx | 1 (10px) |
| GalleryGrid.tsx | 2 (10px×2) |
| GalleryLightbox.tsx | 1 (10px) |
| GlobalFeatures.tsx | 2 (10px×2) |
| Header.tsx | 6 (9px×3, 10px×3) |
| ImmersiveUI.tsx | 1 (10px) |
| InstagramSection.tsx | 3 (12px×1, 10px×2) |
| MobileBottomNav.tsx | 2 (10px, 9px) |
| ProductCard.tsx | 12 (9px×5, 10px×7) |
| SizeGuide.tsx | 4 (10px×4) |
| ThreeDViewer.tsx | 5 (10px×4, 11px×1) |
| ToastContainer.tsx | 2 (11px, 10px) |
| luxury/HorizontalLookbook.tsx | 5 (10px×4, 11px×1) |
| luxury/Marquee.tsx | 2 (11px×2) |
| luxury/StatCounter.tsx | 1 (10px) |

Total: 58 size-class migrations.

## Step 2: Badge container fixes

- `Header.tsx` — both badges (Selection line 166, Bag line 177): `w-4` → `min-w-4 px-0.5 rounded-full leading-none`, exactly as specified.
- `MobileBottomNav.tsx` — badge span: `w-4` → `min-w-4 px-0.5` (already had `rounded-full leading-none`), exactly as specified.
- `ProductCard.tsx` — pills (`px-4 py-1.5`), no container change per brief.

## Step 3: Contrast lift

### Light surfaces (lifted)
- **AvailabilityCalendar** (bg-ivory): day headers `text-stone-400`→`text-stone-600`; legend "Available"/"Booked" `text-stone-400`→`text-stone-600`; booked/past day numbers `text-stone-300`→`text-stone-500` (per 300→500 rule; these are intentionally muted disabled dates, now ≥4.5:1 on stone-50).
- **GlobalFeatures** (bg-ivory cookie banner + newsletter dialog): close X `text-stone-400`→`text-stone-600`; newsletter body `text-stone-500`→`text-stone-600`; cookie eyebrow `text-stone-500`→`text-stone-600`. Cookie accept button text is `text-white` on bg-stone-900 → untouched.
- **Header**: logo wordmark (non-home, bg-ivory/98) `text-stone-500`→`text-stone-600`; mobile sidebar tagline (bg-ivory) `text-stone-400`→`text-stone-600`; 3× sidebar ChevronRight icons (bg-stone-50) `text-stone-300`→`text-stone-500`. Gold eyebrow labels and white-on-hero text untouched.
- **ProductCard** (info block on ivory): category `text-stone-500`→`text-stone-600`; fabric `text-stone-500`→`text-stone-600`; 2× "from" labels `text-stone-400`→`text-stone-600`; rent row `text-stone-500`→`text-stone-600`; wishlist heart idle `text-stone-300`→`text-stone-500`; size-selector header `text-stone-500`→`text-stone-600` and cancel button `text-stone-400`→`text-stone-600` (both on bg-ivory/95 panel). Dark surfaces left alone: mobile quick-shop trigger (bg-gold/onyx, text-white), slim action bar (bg-onyx/95, text-white/*).
- **SizeGuide** (bg-ivory dialog): close X `text-stone-400`→`text-stone-600`; description + 3 measure steps `text-stone-500`→`text-stone-600`; 4× table headers `text-stone-500`→`text-stone-600`.
- **ThreeDViewer** (bg-stone-50/100 light panels): loading label, error message, and poster "Initializing" `text-stone-400`→`text-stone-600`; error message 11px `text-stone-400`→`text-stone-600`. Gold "3D Perspective" chip untouched.
- **ToastContainer**: no stone-* text (titles/messages inherit emerald/rose/stone-800; `opacity-70` message left as-is — out of scope for gray-class rules).
- **GalleryFilters**: inactive state already `text-stone-600` — no lift needed.
- **InstagramSection** (mixed): no stone-* text anywhere (gold handle, white on onyx button, white on image overlay) — size migration only.

### Dark surfaces (left unchanged per rules)
- **Footer** (bg-onyx): `text-stone-400/500/600` body/link text, `placeholder:text-stone-700` newsletter input, `text-white/40` ascend button — all untouched. Size migration only.
- **GalleryGrid / GalleryLightbox**: text-white / text-gold on imagery and onyx overlay — untouched.
- **ImmersiveUI**: preloader is bg-onyx; `text-gold/60`, `text-ivory/40` untouched.
- **HorizontalLookbook / Marquee / StatCounter**: bg-onyx; `text-ivory/*`, `text-white/*`, `text-gold` untouched.

No `placeholder:text-stone-500` exists in any of the 17 files (Footer's is `placeholder:text-stone-700` on onyx → correctly left).

## Step 4: Verification

- Extinction grep `text-\[(8|9|10|11|12)px\]` over `src/components/**/*.tsx`: **0 matches**.
- `npm run lint` (tsc --noEmit): **clean, no errors**.

## Step 5: Commit

`git add src/components` + `git commit -m "a11y(components): 11px type floor + AA contrast on light surfaces"` → `85250dd`. Only the 17 component files staged; `.superpowers/sdd/*` scratch files left unstaged.

## Self-review

- No stone-* lifted on a dark surface: diff audit of all added lines containing `text-stone-(300|400|500)` shows only intentional light-surface lifts (300→500, 400→500/600, 500→600). Footer/GalleryGrid/GalleryLightbox/ImmersiveUI/luxury components have zero color-class changes.
- No size class missed: extinction grep returns zero.
- Badges still circular: Header badges gained `rounded-full` (previously square — the brief's target string adds it); MobileBottomNav retains `rounded-full`. `min-w-4 h-4 px-0.5` keeps single digits circular while allowing double digits to pill out gracefully.
- Uppercase/tracking/casing/font-family unchanged everywhere — diff is strictly size + gray-level swaps.

## Concerns

None.

---

## Review fix (finding: inactive mobile nav contrast)

- **Changed:** `src/components/MobileBottomNav.tsx:31` — inactive nav item color `text-stone-400` → `text-stone-600` (`isActive ? "text-gold" : "text-stone-600"`), per binding contrast rule for light (bg-ivory) surfaces. Nothing else touched.
- **Lint:** `npm run lint` (tsc --noEmit) — clean, no errors.
- **Commit:** `c6204e8` — `a11y(nav): lift inactive mobile nav items to stone-600 on ivory` (new commit, no amend; only that file staged).
