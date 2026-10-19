# Riman Fashion — Website Audit

> Audit date: 2026-10-19
> Audited by: opencode (UX, Content & Search Audit)
> Pages reviewed: 17 rendered routes (home, collections ×5, product, about, contact, appointment, faq, alterations, gallery, journal, style-quiz, timeline, wedding-checklist, privacy, terms, 404) + source for meta/copy/translation truth
> Site URL: http://localhost:3001 (dev build of the production SPA)
> Brand: Sharjah luxury bridal + evening couture; buy · rent · bespoke; EN + AR

**Scope caveat.** The dev build has no Supabase configured, so data-driven
surfaces (gallery, live reviews, availability) render their **empty/error**
states. Where a finding is caused by that, it is marked *(env)*. Everything else
is copy, structure or SEO and is true in production too.

---

## Executive Summary

This is a genuinely well-made site with a real voice — "Fewer gowns, finer
gowns", "A gown is only as beautiful as its fit", the product page's honesty
about lead times and refundable deposits. Technical SEO is better than most
agencies ship: JSON-LD `ClothingStore`, canonical, OG/Twitter, hreflang, a
prerender shell, and a consent module with tests.

Three things are actively capping its credibility, and all three are content, not
code:

1. **The team is fake.** Three named "visionaries" with photos that are reused
   product shots. For a business whose entire proposition is *trust the people
   who will make your wedding dress*, this is the single most damaging thing on
   the site.
2. **There is no social proof anywhere.** The component literally called
   `TestimonialWall` contains no testimonials, and the reviews that do exist are
   collapsed shut on the product page.
3. **The Arabic copy has two outright errors** — a bride reading Arabic meets a
   machine-translation feel the English site never has (see §3).

Fix those and the same site reads as a real luxury house instead of a beautiful
mock-up.

---

## 1. Clarity & First Impression (5 seconds)

**What it is:** A Sharjah couture atelier you can buy from, rent from, or have
make you a bespoke bridal/evening gown. Within 5 seconds the hero delivers:
"SHARJAH'S PREMIER COUTURE ATELIER", "Bridal Gowns Made to Measure in Sharjah —
Since 2011", "BUY · RENT · BESPOKE", "REQUEST A PRIVATE VIEWING". That is clear,
local and specific. **This is a strength.**

**What muddies it:**

- The strongest differentiators arrive *after* the art. "Fewer gowns, finer
  gowns" and the rental proposition (7-day hire, insurance, dry-cleaning
  included) are buried mid-page. A bride deciding between 40 boutiques needs to
  know "you can *rent* couture here" in the first screen, not the sixth.
- 🟡 The homepage nav reads **Bridal · Couture · Collections · About** — "Couture"
  and "Collections" are near-synonyms to a visitor and both lead into the same
  product set. One of them should be "Rentals" or "Book".

---

## 2. Target Audience & Value

**Does it solve a problem immediately?** Partly. It answers *what* (gowns,
rentals, bespoke) and *where* (Sharjah). It does **not** answer the two questions
a bride actually arrives with:

1. **"How long does this take, and can you meet my date?"** The real answer
   exists but only on the product page ("Allow 6–8 weeks for a first fitting and
   a further 2–3 weeks for final handling") and the checklist page. It is absent
   from the homepage and from the FAQ — the two places a visitor looks.
2. **"Who am I trusting with my wedding?"** No named reviews, no real faces, no
   award/press, no Instagram proof. See §4.

🟡 The site tries to be both "appointment-only luxury atelier" and "rent it for a
night, walk-in friendly". Those are different customers with different urgency.
The copy mostly holds it together, but the **nav and homepage never let the
renter self-select early** — a renter has to scroll past a AED 42,000 purchase
price before learning a AED 4,200 rental exists.

---

## 3. Copy & Tone

**Voice:** editorial, warm, slightly literary. It mostly works and should be
protected. Lines that earn their place:

- "Fewer gowns, finer gowns."
- "A gown is only as beautiful as its fit."
- "The security deposit is returned in full within 5 working days of the gown
  being returned." ← *specific* beats *flattering*. More of this.

**Lines that undermine it or read as filler:**

| Location | Current | Problem | Suggested |
|---|---|---|---|
| Home, ch. I h3 | "Mastering The Legacy Icon" | Garbled; means nothing | "The atelier" or delete the heading |
| Home, atelier body | "It begins with a tension—the architecture of Mikado silk against the whisper of French tulle." | Beautiful but abstract; a first-time visitor learns nothing actionable | Keep, but follow it with the plain fact: "Two hundred hours of handwork, from first sketch to final stitch." |
| Home, quiz CTA | "Not sure where to start?" | Weak for the one self-selection tool you have | "Find your silhouette in 4 questions" |
| Home, hero sub | "L'Atelier / Les Silhouettes / Le Savoir-Faire" | French chapter labels are decorative, not navigational — fine as art, but they do double duty as your section names | OK, but add an English gloss in the ChapterLabel |
| About | "a testament to sleepless nights at the sewing table" | "sewing table" deflates the register the rest of the page maintains | "sleepless nights at the atelier table" |
| About/page/footer | "weave dreams into silk" (×3: quote, frame caption, About) | Same phrase three times — reads as template repetition | Vary two of the three |
| Footer | "WE WILL OPEN WHATSAPP TO CONFIRM YOUR ADDRESS." | Terse and slightly alarming out of context | "We confirm your subscription on WhatsApp." |

⚠️ **Arabic translation is broken in two places** (`LanguageContext.tsx`):

- `faq.a_rental_1`: "Premier Hire" → **"التوظيف المتميز"** = *premium employment
  / recruitment*. Should be **"الإيجار المتميز"**.
- `faq.a_rental_2`: **"التظيف الجاف"** is a misspelling of **"التنظيف الجاف"**
  (missing ن) — appears twice.
- **Content parity:** the Arabic FAQ answers are materially *shorter* than the
  English (the AR `a_rental_2`, `a_rental_3`, `a_bespoke_2` drop the
  objection-handling that makes the EN versions good). Arabic readers get a
  thinner, less reassuring site.

---

## 4. Trust & E-E-A-T

**What builds credibility (keep it):**

- The product page: reality about **6–8 week** lead times, a **refundable
  8,400 AED** deposit with a stated 5-working-day return, "**3 Fitting
  Guarantee**", "complimentary alterations … no matter how many times we re-pin
  it". This is exactly how a trustworthy atelier talks.
- A real, verifiable phone number (+971 55 373 0792) and a physical address.
- The virtual-try-on consent copy is exemplary: it names Google/Gemini, states
  the photo is never stored, and requires an explicit checkbox.
- Cookie consent is genuinely wired (verified: banner appears on first visit,
  "Privacy & Elegance → Reject / Accept & Explore").

**What destroys it:**

- 🔴 **Fake team.** `AboutPage.tsx:133–147` lists *Sarah Mansour — Founder &
  Chief Designer*, *Layla Al-Farsi — Head of Embroidery*, *Mona Qureshi — Gilded
  Jewelry Lead*. Their photos are not people — "Sarah" uses
  `rimanfashion_3542687554351211237…jpg`, the **same file as the home "Bridal"
  category image and the About hero poster**. Any bride who has browsed three
  pages has the same woman in three roles.
- 🔴 **No social proof.** `TestimonialWall21st.tsx` contains a `PILLARS` grid and
  one `content.quote` — zero customer testimonials. Real reviews exist but
  `ProductDetail.tsx:82` initialises `showReviews = false`, so the rating and
  reviews are collapsed behind a toggle, and the star rating is not surfaced next
  to the price where it would do work.
- 🟡 **Unverifiable statistics.** "10k+" (beads) and "**120 runway presentations
  since 2011**" (`AboutPage.tsx:159–165`) with no press, no event, no source.
  Numbers with no provenance read as invented — the opposite of E-E-A-T.
- 🟡 **`RIMAN®`** in the footer asserts a registered trademark. If it is not
  registered in the UAE, drop the ®.
- 🟡 Opening hours contradict each other (§Technical) — a small inconsistency
  that signals "nobody is minding the shop".

---

## 5. Conversion & Flow

**What works:** Every CTA is specific ("Request a Private Viewing", "Book a
Fitting", "Send Us Your Picks") and never a bare "Submit". Objection-handling is
placed *at* the decision point ("No deposit to book. Consultation and styling are
complimentary" sits under the appointment form). The four-step "Fitting Journey"
on /alterations is a model of reducing anxiety. A single in-flow CTA band now
replaces the old sticky one (good).

**What stops the visitor:**

- 🟡 **No persistent booking CTA on desktop.** The header's desktop nav is
  Bridal / Couture / Collections / About plus icon-only utility links. The
  "Book appointment" button exists — but only inside the **mobile drawer**
  (`Header.tsx:459`). The highest-intent users get no always-visible way to book.
- 🟡 **Reviews hidden at the moment of decision** (see §4).
- 🟡 **Renters can't self-select early** (§2).
- 🟡 **Gallery is a dead end in this env** *(env)*: `/gallery` renders
  **"Failed to fetch gallery"** with no fallback content. Even in production,
  there is no offline/empty fallback — if the fetch fails, a visitor sees an error
  string in the middle of a luxury brand.
- 🟢 The #1 unanswered FAQ ("How long does it take?") should be the *first*
  question in the rental/bespoke list.

---

## Critical Issues (fix before launch)

| # | Issue | Where | Why it's critical |
|---|---|---|---|
| C1 | Fake named team with reused product photos — **decision: remove the section** | `AboutPage.tsx:133–147` | Destroys the trust the whole brand depends on |
| C2 | Zero customer testimonials; rating/reviews collapsed | `TestimonialWall21st.tsx`, `ProductDetail.tsx:82,728` | No social proof at the decision point |
| C3 | Arabic FAQ uses the wrong word ("التوظيف" = employment, not hire) and a misspelling | `LanguageContext.tsx` | Wrong words, visible to the brand's core local audience |

---

## Content & Copy Issues

### Global / i18n
- ⚠️ **AR** `faq.a_rental_1` "التوظيف المتميز" → "الإيجار المتميز" (wrong word:
  "employment").
- ⚠️ **AR** `التظيف` → `التنظيف` (×2).
- ⚠️ **AR parity**: `a_rental_2`, `a_rental_3`, `a_bespoke_2` are truncated
  versions of the English. Bring them to parity.
- 🟡 Duplicate paragraph: `AboutPage.tsx:62` renders `t('footer.about')` — the
  exact footer string — so the About page opens with text the visitor just read.

### Home
- 🟡 `"Mastering The Legacy Icon"` — garbled heading; replace or delete.
- 🟢 Two `<h1>`s ("RIMAN" wordmark + the hero line). The wordmark should not be
  an `<h1>`.
- 🟡 "Not sure where to start?" is too soft for the Style Quiz entry.

### Collections
- ⚠️ **"1 PIECES FINE JEWELRY"** on `/collections` — should be "1 PIECE". Same
  plural bug renders "1 PIECES" anywhere a count of 1 occurs (needs a singular
  branch).
- 🟡 Verify counts: the page advertises **BRIDAL · 21 PIECES** but the bridal
  listing surfaces ~14. Either paginate honestly or fix the count.

### About
- 🟡 Stats "10k+" and "120" with no source.
- 🟡 "sewing table" register break.
- 🟢 `AboutPage.tsx:42` italicises word index 2 via `.split(' ')[2]` — brittle;
  breaks for any translation (certainly Arabic) whose word order differs.

### FAQ
- 🟡 The single most-asked bridal question — **lead time** — is not in the FAQ.
- 🟡 Hours stated here ("9 AM - 9 PM GST") contradict the footer/contact/JSON-LD
  ("Sat–Thu, 10am–10pm").

---

## UX & Structure Issues

- 🟡 **`/timeline` is an orphan duplicate of `/wedding-checklist`.** Both render
  the same content *and the same `<title>`* ("Wedding Checklist | Riman
  Fashion"). `/timeline` is linked from nowhere. Remove it or 301 it.
- 🟡 **IA gap:** Gallery, Journal, Alterations, FAQ and the Style Quiz are
  reachable only from the footer. Gallery and the Style Quiz are top-of-funnel
  assets sitting in the basement.
- 🟢 Home silhouette chapter was trimmed from 6 → 4 plates this session
  (15,507 → 12,617px, −18.6%); still long but now in line with the "slow couture"
  intent.
- 🟢 404 page exists, is on-brand, and offers three real exits ("Beyond Our
  Collection"). *(Its `meta description` is the homepage's — minor.)*

---

## Conversion Issues

- 🟡 No always-visible booking CTA on desktop header.
- 🟡 Rating not shown near price; reviews collapsed by default.
- 🟡 Rental path not teased above the fold.
- 🟢 Strong: "No deposit to book", "3 Fitting Guarantee", deposit-return terms,
  free alterations stated at the point of decision.

---

## Technical Issues

- 🟡 **Hours inconsistency** across four sources but JSON-LD is the one Google
  reads. Make the FAQ match `10:00–22:00`.
- 🟡 **Three different meta descriptions for `/`**: static `index.html:17`
  ("…premium rentals."), runtime SEOHead ("…and fine jewelry at our flagship
  atelier."), and `og:description` ("Bespoke bridal gowns… hand-finished in our
  Sharjah atelier."). Pick one, inject it from a single source.
- 🟢 **Actually good:** `%SITE_URL%` *is* substituted at build (verified:
  `canonical" href="https://riman-website.pages.dev/"` — owner-confirmed as the
  intended production host), `og-cover.png` exists
  (18 KB), JSON-LD is valid `ClothingStore` with hours and `sameAs`, hreflang is
  correctly limited to `en` + `x-default` with the reason documented in-source,
  and a consent module (`src/lib/consent.ts`) gates analytics with tests.
- ⚠️ *(env)* `/gallery` shows `Failed to fetch gallery` (`useGallery.ts:86`) with
  no fallback. Add a curated fallback set so a backend hiccup never shows an
  error string to a luxury buyer.
- ⚠️ *(env)* Product page shows a bare **"Retry"** control when availability
  fails — confirm production behaviour and wrap it in on-brand copy.

---

## Priority Action Plan

| Priority | Action | Type | Where |
|---|---|---|---|
| **P0** | Remove the fake team section; replace with atelier/craft imagery + a founder quote | Trust | `AboutPage.tsx:133–147` |
| **P0** | Put social proof to work: show the average rating beside the price, default reviews open, and lift 3 named reviews + the rating onto the homepage | Conversion/Trust | `TestimonialWall21st.tsx`, `ProductDetail.tsx:82,728` |
| **P0** | Fix the AR errors ("التوظيف"→"الإيجار", "التظيف"→"التنظيف") and bring AR FAQ answers to parity | Copy/i18n | `LanguageContext.tsx` |
| P1 | Unify opening hours (FAQ → 10:00–22:00) and unify the three home meta descriptions | SEO/Trust | `LanguageContext.tsx`, `index.html`, SEOHead |
| P1 | Add a persistent "Book" CTA to the desktop header | Conversion | `Header.tsx` |
| P1 | Add lead time ("6–8 weeks") to the homepage and as FAQ #1 | Copy/Conversion | `Index.tsx`, `FaqPage.tsx` |
| P2 | Fix "1 PIECES" → "1 PIECE"; verify the 21-vs-14 bridal count | Copy | `CollectionsPage.tsx` |
| P2 | 301/remove the orphan `/timeline`; give `/gallery` a fallback set | SEO/UX | router, `useGallery.ts` |
| P2 | Source or remove "10k+" and "120 runways"; reconsider `RIMAN®` | Trust | `AboutPage.tsx` |
| P2 | Surface Gallery + Style Quiz in the primary nav | IA | `Header.tsx` |
| P3 | Rewrite "Mastering The Legacy Icon"; kill the "weave dreams into silk" triple; fix the `.split(' ')[2]` italic | Copy | `Index.tsx`, `AboutPage.tsx` |

### The top 3 to change immediately

1. **Kill the fake team (C1).** Either publish real names with real photos, or
   remove "The Riman Collective" entirely and replace it with a founder quote and
   genuine atelier imagery. Nothing else you do matters as much if a bride
   catches three different "designers" who are the same photographed model.
2. **Make the proof visible (C2).** Open the reviews by default, show the
   average rating next to the price, and pull 3 real, named reviews onto the
   homepage. You already collect and moderate reviews (`AdminReviews`) — they are
   simply invisible.
3. **Fix the Arabic errors (C3).** "التوظيف المتميز" says *premium employment*
   where it means *premium hire*, and "التظيف الجاف" is missing a letter. Your
   core audience is local — this is the first thing an Arabic reader notices.

---

## Resolution Log

### 2026-10-19 — Top 3 addressed

| Finding | Change | Verified |
|---|---|---|
| **C1** Fake team | Removed "The Design Team Section" + the `TeamMember` component and its unused `ScrollReveal` import from `AboutPage.tsx`. Replaced by nothing (the Pillars and Aesthetic Mosaic sections carry the page). No fabricated founder quote was substituted — inventing one would have repeated the original sin. | `/about` renders 4 sections; no "Sarah Mansour / Layla Al-Farsi / Mona Qureshi"; Pillars + "10k+" mosaic intact; no page errors |
| **C2** No social proof | Product page: `showReviews` defaults to `true`, and a compact star row + average now sits directly under the product `<h1>` (`product.review_count` / `review_count_singular` added in EN + AR). Homepage: `TestimonialWall21st` now fetches **approved** reviews only and renders the aggregate rating plus up to 3 quotes under an "In Their Words" heading — and renders nothing at all when there are none. | Product page shows `4.5 / 5 — 2 verified reviews`, review visible without a click; pending reviews excluded; home strip hides cleanly with zero reviews; product empty state ("New in the atelier") still clean |
| **C3** Arabic errors | Fixed `التوظيف`→`الإيجار`, `التظيف`→`التنظيف` (×2), repaired the corrupted string `غير الم mặcة` (Latin/Vietnamese characters embedded mid-word) → `غير الملبوسة`, and restored the clauses dropped from the Arabic FAQ answers (rental care, deposit transparency, bespoke assessment, rental pickup/delivery, full return policy). | Source-level; `npm run lint` clean, 331/331 tests pass |

**Not done (deferred):** C3's *scope* turned out larger than the audit listed —
only one corrupted string existed, but four Arabic FAQ answers were materially
thinner than their English counterparts; all four were brought to parity.
The P1/P2/P3 items below remain open.

**Gate:** `npm run lint` clean · `npm run build` OK · `npm test` 331/331.

### 2026-10-19 — P1 addressed

| Finding | Change | Verified |
|---|---|---|
| Hours conflict | `faq.still_unsure_desc` "9 AM - 9 PM" → "Saturday to Thursday, 10 AM – 10 PM GST" (EN **and** AR), now matching footer, contact page, `appointment.atelier_hours` and the JSON-LD `openingHoursSpecification` (10:00–22:00). | FAQ shows 10 AM – 10 PM; the 9–9 string is gone from the rendered page |
| Three home meta descriptions | One canonical string now used in all five places: `index.html` `meta[name=description]` + `og:description` + `twitter:description`, `SEOHead.tsx` `DEFAULT_DESCRIPTION`, and `seo.ts` home `routeMeta`. | Rendered `description`, `og:description` and `twitter:description` are byte-identical |
| No desktop Book CTA | Added a tone-aware `/appointment` CTA (new `Tone.cta` on all three tones) to the header's `lg`-and-up utility cluster in `Header.tsx`, so the primary action is persistent on desktop instead of living only in the mobile drawer. | "Book Appointment" visible at 1024 / 1280 / 1440; hidden at 900 (drawer takes over); no horizontal overflow; header height unchanged (97px) |
| Lead time absent from home + FAQ | New line in the home CTA band (`home.leadtime`, EN+AR) and lead time as the **first** question in the FAQ's Bespoke group (`faq.q_bespoke_lead` / `faq.a_bespoke_lead`). | Home renders "6–8 weeks"; FAQ's first bespoke question is "How long does a bespoke gown take?" |

**Gate:** `npm run lint` clean · `npm run build` OK · `npm test` 331/331.

### 2026-10-19 — P2 addressed

| Finding | Change | Verified |
|---|---|---|
| `"1 PIECES FINE JEWELRY"` | New `collections.count_singular` (EN `piece` / AR `قطعة`); `CollectionsPage` now picks the singular branch when the filtered count is exactly 1. | `/collections` reads "1 piece" |
| Advertised count vs listing | Measured the bridal listing directly and deduped the product cards: **21 rendered / 21 advertised**. Both come from the same `products.filter(def.match)`, so the earlier "~14" was a miscount, not a mismatch. No change needed. | 21 distinct products in `main`, matching the card |
| `/timeline` duplicate | Added `/timeline /wedding-checklist 301` to `public/_redirects`, ahead of the SPA catch-all, so the pair is a true server-side 301 on Cloudflare Pages. The in-app `<Navigate>` stays as the dev/off-Pages fallback. | `_redirects` line present; dev still resolves `/timeline` → `/wedding-checklist` |
| `/gallery` error string | New `src/data/galleryFallback.ts` — 12 curated house photographs from assets already shipped in `public/assets`. `GalleryPage` renders the live feed when it has rows, and the curated set (filtered by the active tab) otherwise; the raw `error` string is gone from the render. Items are untitled and fall through to the localised `gallery.untitled`, so no new per-item translation is needed. | No "Failed to fetch gallery"; 12/12 fallback images load; skeleton clears |
| Unverifiable statistics | Replaced `10k+` and `120` with qualitative label + caption pairs: **Handwork** ("Every bead set by hand in the atelier") and **Runway** ("Our couture, presented season after season"), EN + AR. Nothing on the page now asserts a number a reader cannot check. | `/about` has no "10k+" / "120"; EN + AR labels render (RTL confirmed) |
| Gallery + Style Quiz buried | Both added to `PRIMARY_LINKS` (`Header.tsx`): desktop nav is now Bridal · Couture · Collections · Gallery · Style Quiz · About. | 6 links at 1024/1280/1440; nav clears the centred logo by 24px at 1024; no horizontal overflow |
| `RIMAN®` | Confirmed with the owner as registered — finding **closed**, footer unchanged. | — |

**Gate:** `npm run lint` clean · `npm run build` OK · `npm test` 331/331. Entry bundle 703.45 → 705.48 kB (+2.03 kB: fallback data + new strings).

### 2026-10-19 — P3 addressed

| Finding | Change | Verified |
|---|---|---|
| "Mastering The Legacy Icon" | `atelier.heading` rewritten to **"The Slow Work Of Couture"** (AR `أزياء راقية، على مهل`). It heads the paragraph about cutting by hand and "fewer gowns, finer gowns" instead of reading as machine-assembled brand-speak. | Home Chapter I renders the new heading; the old string is gone from the bundle |
| "weave dreams into silk" ×3 | The phrase now renders **once** — the admin-editable `content.quote` blockquote. The FrameSequence caption was the second on-page instance and is now **"Each gown begins by hand"** (AR `كل فستان يبدأ باليد`). The remaining source copies are non-rendered defaults in `SettingsContext.homepage.brandQuote` and its admin reset field. | Home contains the phrase exactly 1×; new caption present in EN and AR |
| Brittle `.split(' ')[2]` italic | Emphasis is marked explicitly instead of by word index: new `about.hero_title_italic` (`Heritage` / `تراث`), located with `indexOf` and wrapped in the italic span, falling back to plain text when the marker is absent. | EN renders "The Riman *Heritage*" (`font-style: italic` confirmed on the span); AR renders "*تراث* ريمان" with no word dropped |
| Leftover fabricated founder | `about.quote` / `about.quote_author` ("— Sarah Mansour, Founder") were unreferenced but still shipped the name removed with the fake team section. Deleted in EN and AR. | No reference anywhere in `src`; gate green |

**Gate:** `npm run lint` clean · `npm run build` OK · `npm test` 331/331. Entry 705.48 → 705.19 kB.

**Status: the audit is fully resolved** — C1–C3, P1, P2 and P3 are all closed and
verified. Open questions that remain are owner decisions, not defects (real
gallery/review content behind Supabase, and any new copy the house wants to add).

### 2026-10-20 — publish-readiness verification (live Supabase)

Backend confirmed live after the owner restored project `vbuavhnpemnfsuguglqn`.
The earlier `521`/`502` from Cloudflare's edge was a paused origin, not a site bug.

| Area | Evidence |
|---|---|
| Live data | `products` 38 · `site_settings` 6 · `site_content` 3 · `reviews` 0 · `gallery_items` 0 · `appointments` 0 · `contact_submissions` 0 · `orders` 0 |
| Rendering | `/`, `/collections`, `/collection/bridal`, `/gallery`, `/faq` → 0 console errors, 0 broken images; `/collections` 11 cards, bridal 21 products, all from live rows |
| Edge functions | all five deployed — `create-checkout` answers; `create-order`, `send-notification`, `stripe-webhook`, `process-outbox` return 405 to GET |
| Write RLS | `appointments` and `contact_submissions` permit anon INSERT (`WITH CHECK (true)`); `orders` is server-only, with no client insert path |
| Later found | The Arabic `<h1>` on `/faq` read `concierge الخدمة` → **`خدمة الكونسيرج`**; a quiz option read `فستان سlip عصري`, carrying Latin letters mid-word (same class as C3) → **`فستان سليب عصري`**. A full AR re-scan is clean; the remaining Latin-in-Arabic matches are brand tokens followed by an Arabic comma. |

**Gate:** `npm run lint` clean · `npm test` 331/331.

**Still owner-side, not code:** one real checkout (proves `STRIPE_SECRET_KEY`), one
real appointment and contact submission (proves `send-notification` delivery), and
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` set in Cloudflare Pages. `reviews`
and `gallery_items` are empty by content, not by defect: the review strip hides
itself and `/gallery` serves the 12-photo curated fallback.
