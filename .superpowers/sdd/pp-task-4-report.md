# Task 4 Report: Migrate customer pages to tokens + contrast lift

**Status:** DONE
**Commit:** `5cba22d` — `a11y(pages): 11px type floor + AA contrast on light surfaces`
**Branch:** salon-rebrand
**Scope:** 16 files — `src/App.tsx` + 15 non-admin pages (266 insertions, 266 deletions — pure class swaps)

## Step 1: Size migration (all 16 files)

Every `text-[8px]`/`text-[9px]`/`text-[10px]`/`text-[11px]` → `text-micro`, every `text-[12px]` → `text-caption`. Size class only — tracking, casing, weight, and color untouched in this step. Applied via scripted replacement (encoding-preserving `ReadAllText`/`WriteAllText`).

| File | Occurrences migrated |
|---|---|
| App.tsx | 1 (10px) |
| AboutPage.tsx | 5 (10px×5) |
| AlterationsPage.tsx | 1 (10px) |
| AppointmentPage.tsx | 15 (10px×14, 11px×1) |
| Auth.tsx | 8 (10px×7, 8px×1) |
| Checkout.tsx | 41 (10px×38, 9px×2, 8px×1) |
| CollectionPage.tsx | 5 (10px×5) |
| ContactPage.tsx | 12 (10px×12) |
| GalleryPage.tsx | 1 (10px) |
| Index.tsx | 3 (11px×2, 10px×1) |
| ProductDetail.tsx | 67 (10px×44, 9px×10, 8px×6, 11px×7) |
| ProfilePage.tsx | 13 (10px×11, 12px×1, 8px×1) |
| SearchPage.tsx | 2 (10px×2) |
| StyleQuiz.tsx | 3 (10px×3) |
| WeddingChecklist.tsx | 1 (10px) |
| WishlistPage.tsx | 5 (10px×5) |

Total: 183 size-class migrations.

## Step 2: Contrast lift (pages)

Judged per element by nearest background. Icons (lucide) lifted on light surfaces per Task 3 precedent.

### Light surfaces (lifted)

- **AboutPage** (bg-ivory): quote author 400→600; "Visionaries" editorial heading 400→600; stat_beads 400→600. Dark left: hero `text-white/70` over imagery+stone-900/40 overlay; pillars section (bg-stone-900) uses ivory only; stat_runways `text-ivory/40` on bg-stone-900 tile.
- **AlterationsPage** (bg-ivory): hero desc 500→600; CTA desc 500→600; ServiceCard desc 400→600. Dark left: process timeline step desc `text-stone-400` inside `bg-stone-900` section (line 80).
- **AppointmentPage** (bg-champagne / bg-ivory cards): confirmation paragraphs 500→600 (×2), confirmation-sent line 400→600, breadcrumb 400→600, page desc 500→600, inactive step circle 400→600, inactive step label 400→600, 10× form labels 400→600, 3× input icons 300→500, 6× `placeholder:text-stone-500`→`placeholder:text-stone-600`. Dark left: bg-onyx atelier block lines 334-335 (`text-stone-400` Sharjah/hours).
- **Auth** (bg-ivory): 6× labels/links 400→600; clear-session button 300→500. No `placeholder:text-stone-500` present (inputs use browser default placeholder color).
- **Checkout** (bg-ivory main flow): empty-state desc 500→600; order-complete 500→600 + 2× 400→600; back-to-shop link 500→600; details-summary 4× labels 400→600; item category/size 2× 400→600; mobile-inline pricing 2× 400→600; order-notes label 400→600; payment-option blocks (bg-ivory inactive state) 2× text 400→600, 2× icons 300→500, 2× desc 400→600; payment-info-box desc 400→600; WhatsApp help 500→600; stepper inactive circle+label 300→500 (×2); TrustBadge 400→600; Input label 400→600. Dark left (bg-onyx mobile summary + OrderSidebar): lines 647, 653, 671, 674, 682, 686, 781, 784, 789, 794, 804, 808, 812, 824 — all stone-400/500 unchanged.
- **CollectionPage** (bg-ivory): breadcrumb 400→600; subtitle 500→600; year buttons 500→600; silhouette tabs 400→600; filter toggle 400→600; colors/silhouette headers 2× 400→600; mobile silhouette buttons 500→600; results count 500→600; empty heading+desc 2× 400→600.
- **ContactPage** (bg-ivory): header sub 500→600; special note 400→600; 5× form labels 400→600; select chevron icon 400→600; ContactInfoItem title 400→600. No `placeholder:text-stone-500` present (inputs use defaults).
- **GalleryPage** (bg-ivory): description 500→600; error 500→600; no-items 500→600.
- **Index.tsx**: invitation contact line (bg-champagne) 500→600. Dark left: hero `text-white/90` and `text-white/60` over video + black gradient (lines 46, 69).
- **ProductDetail** (bg-ivory throughout, incl. bg-pearl review form and bg-ivory modal): breadcrumb 400→600; 2× view-toggle icons 500→600; 3× quick-spec labels 400→600; SKU chip 400→600; editorial quote 500→600; 2× "from" labels 500→600; purchase/rental labels 2× 500→600; rental-includes 400→600; refundable-deposit 400→600; consultation note 400→600; date hint 400→600; 2× wishlist hearts 500→600; 3× trust-badge sublabels 400→600; 3× accordion chevrons 400→600; style tags 500→600; 6× care/artistry descs 500→600; ask-stylist desc 500→600; rating "(4.8)" 500→600; reviews chevron 400→600; review date 400→600; 3× review-form labels 400→600; related heading 400→600; mobile-bar "from" 400→600; modal close X 400→600; modal eyebrow 400→600; modal selection/period labels 2× 400→600; modal policy/deposit descs 2× 500→600.
- **ProfilePage** (bg-ivory): role line 400→600; sign-out 400→600; welcome 400→600; backend-not-connected 400→600; no-orders 400→600; order items 500→600; order date 300→500; inactive ProfileLink 400→600; StatBox label 400→600.
- **SearchPage** (bg-ivory): search icon 300→500; clear-X 400→600; inactive category chips 400→600; results count 300→500; advanced-filters button 400→600; empty-state icon 300→500; empty desc 400→600.
- **StyleQuiz** (bg-ivory): subtitle 500→600; back button 400→600; option chevron 300→500; results sub 500→600; try-different 500→600. No `placeholder:text-stone-500` present (no text inputs).
- **WishlistPage** (bg-ivory; empty state is bg-ivory, not dark): subtitle+count 2× 400→600; remove-X button 400→600; category 300→500; empty desc 400→600.
- **WeddingChecklist**: no stone-300/400/500 text — size migration only.
- **App.tsx**: line 128 `text-ivory/30` on bg-onyx maintenance screen — left per brief exception. No stone-* text.

### Dark surfaces (left unchanged per rules)

- Checkout: bg-onyx mobile summary bar + collapsible panel, and `OrderSidebar` (bg-onyx) — all `text-stone-400/500` untouched.
- AppointmentPage: bg-onyx atelier info block (lines 334-335).
- AlterationsPage: bg-stone-900 process timeline (line 80).
- AboutPage: hero overlay text-white/70; bg-stone-900 pillars/stat tiles (ivory-based, no stone-*).
- Index.tsx: hero video overlays text-white/90, text-white/60.
- App.tsx: bg-onyx maintenance screen text-ivory/30.

## Step 3: Verification

- Extinction grep `text-\[(8|9|10|11|12)px\]` over `src/pages/*.tsx` (top-level, non-recursive per brief) + `src/App.tsx`: **0 matches**. (`src/pages/admin/*.tsx` still contains matches — untouched per scope; that is Task 5.)
- `npm run lint` (tsc --noEmit): **clean, no errors**.

## Step 4: Commit

`git add` of exactly the 16 listed files + `git commit -m "a11y(pages): 11px type floor + AA contrast on light surfaces"` → `5cba22d`. 16 files changed, 266 insertions(+), 266 deletions(-). `.superpowers/sdd/*` scratch files left unstaged.

## Self-review

- **No dark-surface stone-* lifted by mistake:** post-edit audit of all remaining `text-stone-(300|400|500)` in the 16 files shows only (a) dark-surface elements correctly left (Checkout onyx blocks, AppointmentPage onyx block, AlterationsPage stone-900 timeline) and (b) intentional 300→500 lift targets. No stone-* change inside any bg-onyx/bg-stone-900/bg-stone-800 wrapper or dark hero overlay.
- **No size class missed:** extinction grep returns zero across src/pages and App.tsx.
- **Uppercase/tracking/casing/font-family unchanged everywhere** — diff is strictly size + gray-level swaps (266/266 line-for-line).
- **Brief exceptions respected:** App.tsx `text-ivory/30` untouched; WishlistPage empty state confirmed light (bg-ivory) and lifted accordingly.

## Concerns

None.
