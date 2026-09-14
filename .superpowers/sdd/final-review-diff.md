## Commits
269d2ba test(e2e): wait for wishlist hearts instead of silent-skip (suite-load flake)
d409a50 docs: align DESIGN.md with shipped terracotta/Fraunces identity
f80b93e a11y(admin): 11px type floor + AA contrast; drop dead RTL pixel overrides
5cba22d a11y(pages): 11px type floor + AA contrast on light surfaces
c6204e8 a11y(nav): lift inactive mobile nav items to stone-600 on ivory
85250dd a11y(components): 11px type floor + AA contrast on light surfaces
c8ecb22 feat(nav): remove Journal/blog dead-end surface and orphaned keys
39a7927 feat(theme): add text-micro/text-caption type tokens with RTL scaling
0cb0675 docs: perfect-polish implementation plan (7 tasks)
6cd8e66 docs: perfect-polish design spec (typography floor, contrast, dead-end removal, brand docs)
0e0ea58 test(e2e): selection-to-viewing conversion flow + RTL default
fa04689 fix(i18n): route PaymentSuccess, quick-add, checkout label through translations
8b869a3 feat(admin): display requested gowns on appointment cards
c2549ee feat(nav): promote Your Selection, demote bag
820b234 feat(booking): WhatsApp continue-handoff after viewing request
1fe6a2d feat(email): appointment confirmation + admin alert (fire-and-forget)
cf638ab feat(selection): Your Selection page with request-viewing CTA
0d594de feat(booking): Reserve-a-Viewing primary CTA with prefilled appointment
517a5ee feat(pricing): From-AED pricing copy + consultation note
74955a9 feat(i18n): Arabic as default language, locale-aware appointment dates
f393d42 feat(appointments): interested_gowns jsonb column + GownRef type
b664b48 docs: booking-first conversion implementation plan
d6f1c1b docs: booking-first conversion model design spec

## Stat
 DESIGN.md                                          | 189 ++---
 .../plans/2026-08-23-booking-first-conversion.md   | 932 +++++++++++++++++++++
 .../superpowers/plans/2026-08-23-perfect-polish.md | 600 +++++++++++++
 .../2026-08-23-booking-first-conversion-design.md  |  62 ++
 .../specs/2026-08-23-perfect-polish-design.md      | 158 ++++
 src/App.tsx                                        |   4 +-
 src/components/AvailabilityCalendar.tsx            |  10 +-
 src/components/Footer.tsx                          |  11 +-
 src/components/GalleryFilters.tsx                  |   2 +-
 src/components/GalleryGrid.tsx                     |   4 +-
 src/components/GalleryLightbox.tsx                 |   2 +-
 src/components/GlobalFeatures.tsx                  |   8 +-
 src/components/Header.tsx                          |  32 +-
 src/components/ImmersiveUI.tsx                     |   2 +-
 src/components/InstagramSection.tsx                |   6 +-
 src/components/MobileBottomNav.tsx                 |  12 +-
 src/components/ProductCard.tsx                     |  38 +-
 src/components/SizeGuide.tsx                       |  18 +-
 src/components/ThreeDViewer.tsx                    |  10 +-
 src/components/ToastContainer.tsx                  |   4 +-
 src/components/luxury/HorizontalLookbook.tsx       |  10 +-
 src/components/luxury/Marquee.tsx                  |   4 +-
 src/components/luxury/StatCounter.tsx              |   2 +-
 src/contexts/LanguageContext.tsx                   | 148 ++--
 src/index.css                                      |  11 +-
 src/lib/email.ts                                   |  76 ++
 src/lib/seo.ts                                     |   5 -
 src/lib/whatsapp.ts                                |   5 +
 src/pages/AboutPage.tsx                            |  12 +-
 src/pages/AlterationsPage.tsx                      |   8 +-
 src/pages/AppointmentPage.tsx                      | 108 ++-
 src/pages/Auth.tsx                                 |  16 +-
 src/pages/BlogPage.tsx                             | 152 ----
 src/pages/Checkout.tsx                             | 114 +--
 src/pages/CollectionPage.tsx                       |  30 +-
 src/pages/ContactPage.tsx                          |  28 +-
 src/pages/GalleryPage.tsx                          |   8 +-
 src/pages/Index.tsx                                |   6 +-
 src/pages/PaymentSuccess.tsx                       |  24 +-
 src/pages/ProductDetail.tsx                        | 209 +++--
 src/pages/ProfilePage.tsx                          |  28 +-
 src/pages/SearchPage.tsx                           |  16 +-
 src/pages/StyleQuiz.tsx                            |  14 +-
 src/pages/WeddingChecklist.tsx                     |   2 +-
 src/pages/WishlistPage.tsx                         |  50 +-
 src/pages/admin/AdminAppointments.tsx              |  38 +-
 src/pages/admin/AdminCalendar.tsx                  |  28 +-
 src/pages/admin/AdminContent.tsx                   |  16 +-
 src/pages/admin/AdminDashboard.tsx                 |  34 +-
 src/pages/admin/AdminGallery.tsx                   |  10 +-
 src/pages/admin/AdminLayout.tsx                    |   8 +-
 src/pages/admin/AdminOrders.tsx                    | 106 +--
 src/pages/admin/AdminPlaceholder.tsx               |   4 +-
 src/pages/admin/AdminProducts.tsx                  |  66 +-
 src/pages/admin/AdminSettings.tsx                  |   2 +-
 src/services/appointments.ts                       |   1 +
 src/types.ts                                       |   8 +
 ...0260823100000_appointments_interested_gowns.sql |   6 +
 tests/click-verification.spec.js                   |   9 +-
 tests/selection-to-viewing.spec.js                 |  60 ++
 60 files changed, 2713 insertions(+), 873 deletions(-)

## Minor findings roll-up (from per-task reviews, for triage)
# Salon Rebrand — SDD Progress Ledger
Branch: salon-rebrand
Plan: docs/superpowers/plans/2026-08-21-riman-salon-rebrand.md
Baseline: 50 tests passing @ 40aa7fe

Task 1: complete (40aa7fe..fae6abf, spec ✅, code quality Approved, motion-band note deferred to final review)
Task 2: complete (fae6abf..9a5105c, 4 files created, TDD RED→GREEN, 6 chapter keys en+ar, manual review PASS)
Task 3: complete (9a5105c..14d3bcd, InvitationRule, 3 tests passing, lint+build clean)
Task 4: complete (14d3bcd..3239084, EditorialPlate, 5 tests green, lint+build clean)
Task 5: complete (3239084..93065d9, Header restyle, text-sunset=0, lint+build clean)
Task 6: complete (93065d9..90306f4, homepage rewrite, 20 i18n keys, video adaptation, lint+build clean)
Task 7: complete (90306f4..7bac73d, ProductCard plate, lint+build clean, touch-hover concern flagged)
Task 8: complete (7bac73d..9fb50fb, AppointmentPage+Footer, lint+build clean, padding concern noted)
Task 9: complete (9fb50fb..d85e47e, 55/55 tests, lint+build clean, dead-class sweep clear)

ALL IMPLEMENTATION TASKS COMPLETE — FINAL REVIEW NEXT

# Booking-First Conversion - SDD Progress Ledger
Plan: docs/superpowers/plans/2026-08-23-booking-first-conversion.md
Baseline: b664b48
BF Task 1: complete (b664b48..f393d42, review clean)
BF Task 2: complete (f393d42..74955a9, review clean; minors: EN AM/PM slots in appt page, dup locale ternary)
BF Task 3: complete (74955a9..517a5ee, review clean; minors: note always renders, rental_period key unconsumed)
BF Task 4: complete (517a5ee..0d594de, lint clean; adaptations: merged GownRef import, compact mobile-bar sizing)
BF Task 4: complete (517a5ee..0d594de, review clean; minor: mobile sticky bar ~30px taller, pb-24 may need bump — check in T11)
BF Task 5: complete (0d594de..cf638ab, review clean; minors: dup CTA mapping x2, redundant cast)
BF Task 6: complete (cf638ab..1fe6a2d, review clean; minors: unescaped HTML interpolation house-wide (escapeHtml helper future), EOF newline)
BF Task 7: complete (1fe6a2d..820b234, review clean; minors: AR copy says follow-us vs continue, spacing above button, raw date in wa message)
BF Task 8: complete (820b234..c2549ee, review clean; minors: badge a11y parity w/ cart, mobile badge physical RTL positioning pre-existing)
BF Task 9: complete (c2549ee..8b869a3, review clean; select('*') confirmed; basis-full adaptation approved)
BF Task 10: complete (8b869a3..fa04689, review clean; minors: product.close follow-up for 'Close' literal + aria-labels, PaymentSuccess EOF newline pre-existing)
BF Task 11: complete (fa04689..0e0ea58, 73/73 green; minors: hardcoded EN placeholders in PDP test, silent-skip hearts backstop, waitForApp duplicate)
BF Task 12: PARTIAL - lint+build clean (index-DNQINdQg.js), deployed 6a8af36c, LIVE OK. BLOCKED: migration NOT applied - prod DB confirmed missing appointments.interested_gowns (42703 via REST check); no supabase access token on machine. Push held per brief order.

## Perfect-Polish Pass (plan 0cb0675, spec 6cd8e66)
Baseline: 0cb0675
PP Task 1: complete (0cb0675..39a7927, review clean; minors: blank-line offset cosmetic, no line-height companion token)
PP Task 2: complete (39a7927..c8ecb22, review clean; minors: stale 'Journal' word in click-verification.spec.js:172 section comment, report key-count typo)
PP Task 3: complete (c8ecb22..85250dd + fix c6204e8, re-review approved; minors: report count inaccuracies)
PP Task 4: complete (c6204e8..5cba22d, review clean; minors: SearchPage indent drift, ProductDetail EOF newline, report tally nit)
PP Task 5: complete (5cba22d..f80b93e, review clean; minors: 2 hover-state lifts beyond table (justified), text-[7px] in AdminProducts upload placeholder violates 11px-floor spirit - final review triage)
PP Task 6: complete (f80b93e..d409a50, review clean; minors: frontmatter label 11px vs buttons 12px inconsistency inherited from brief)
PP Task 7: PARTIAL - lint+build clean (index-CwHTfC6O.js), extinction zero, Playwright 72/72 (fixed suite-load flake 269d2ba), deployed 6a8b2051 LIVE OK. BLOCKED on push: appointments.interested_gowns still missing in prod (42703) - user SQL not yet applied.

## Diff
diff --git a/DESIGN.md b/DESIGN.md
index 702c4d6..a3300dd 100644
--- a/DESIGN.md
+++ b/DESIGN.md
@@ -1,37 +1,42 @@
 ---
 name: Atelier Riman
 description: Sharjah's premier luxury bridal and evening couture design system
 colors:
-  gold: "#D4AF37"
-  gold-light: "#F9E27E"
-  gold-dark: "#A67C00"
-  onyx: "#0A0A0A"
-  bone: "#FDFBF7"
-  ivory: "#FFFDF9"
-  pearl: "#F3F1ED"
+  gold: "#A2492B"
+  gold-light: "#C45A3C"
+  gold-dark: "#7A3520"
+  onyx: "#161513"
+  bone: "#EFEAE2"
+  ivory: "#EFEAE2"
+  champagne: "#F6F0E6"
+  pearl: "#E8E3D9"
 typography:
   display:
-    fontFamily: "Plus Jakarta Sans, sans-serif"
-    fontSize: "clamp(3rem, 8vw, 10rem)"
-    fontWeight: 700
-    lineHeight: 1.2
-    letterSpacing: "0.05em"
+    fontFamily: "Fraunces, serif"
+    fontWeight: 500
+    letterSpacing: "0.1em"
+    textTransform: "uppercase"
   editorial:
-    fontFamily: "Playfair Display, Georgia, serif"
+    fontFamily: "Newsreader, serif"
     fontWeight: 400
-    fontStyle: italic
-    letterSpacing: "normal"
+    fontStyle: "italic"
   body:
-    fontFamily: "Inter, sans-serif"
-    fontSize: "0.875rem"
+    fontFamily: "Newsreader, serif"
     fontWeight: 400
     lineHeight: 1.7
+  label:
+    fontFamily: "Archivo, sans-serif"
+    fontSize: "11px"
+    letterSpacing: "0.25em"
+    textTransform: "uppercase"
   arabic:
-    fontFamily: "IBM Plex Sans Arabic, sans-serif"
-    fontWeight: 600
-    fontSize: "1.25rem"
+    fontFamily: "Cairo, IBM Plex Sans Arabic, sans-serif"
+    fontWeight: 500
+  arabicHeading:
+    fontFamily: "Amiri, serif"
+    fontWeight: 700
 rounded:
   sm: "0"
   md: "0"
   lg: "0"
 spacing:
@@ -41,13 +46,13 @@ spacing:
   lg: "48px"
   xl: "80px"
 components:
   button-primary:
     backgroundColor: "{colors.onyx}"
-    textColor: "#FFFFFF"
+    textColor: "{colors.bone}"
     padding: "20px 40px"
-    typography: "{typography.display}"
+    typography: "{typography.label}"
     rounded: "{rounded.sm}"
   button-primary-hover:
     backgroundColor: "{colors.onyx}"
     textColor: "{colors.gold}"
     padding: "20px 40px"
@@ -64,136 +69,124 @@ components:
 
 # Design System: Atelier Riman
 
 ## 1. Overview
 
-**Creative North Star: "The Golden Atelier"**
+**Creative North Star: "The Terracotta Atelier"**
 
-A warm, handcrafted sanctuary where heritage meets contemporary luxury. Atelier Riman's visual language is built on the interplay of deep tonal dark, warm ivory, and accent gold ΓÇö like a private fitting room bathed in candlelight. Every surface feels deliberate, tactile, and intimate. The system rejects mass-produced, fast-fashion aesthetics in favor of architectural precision softened by editorial elegance.
+A warm, handcrafted sanctuary where heritage meets contemporary luxury. Atelier Riman's visual language is built on the interplay of deep warm dark, bone ivory, and a terracotta accent ΓÇö like a private fitting room bathed in candlelight. Every surface feels deliberate, tactile, and intimate. The system rejects mass-produced, fast-fashion aesthetics in favor of architectural precision softened by editorial elegance.
 
-The experience is designed to feel consultative rather than transactional. Typography carries the brand's regal voice through a pairing of sharp sans-serif headings with italic serif editorial accents. Motion is restrained but purposeful ΓÇö entrances feel choreographed, interactions feel responsive, nothing is gratuitous.
+The experience is consultative rather than transactional: booking-first, with private viewings, rentals, and WhatsApp handoff at its core. Arabic is the default language; English is fully supported. Typography carries the brand's regal voice through serif display headings with italic editorial accents. Motion is restrained but purposeful.
 
 **Key Characteristics:**
 - Warm layered depth through tonal surfaces, never harsh shadows
-- Gold as a restrained accent that signals luxury without excess
-- Sharp typographic hierarchy with editorial serif flourishes
+- Terracotta as a restrained accent that signals luxury without excess
+- Serif typographic hierarchy with editorial italic flourishes
 - Intimate, tactile component interactions
-- Arabic-first support alongside English
+- Arabic-first (RTL default) with full English support
 
-## 2. Colors: The Golden Atelier Palette
+## 2. Colors: The Terracotta Atelier Palette
 
-A warm, restrained palette centered on a single precious-metal accent against deep and light tonal neutrals. Gold is never used casually ΓÇö its rarity on the screen is its power.
+A warm, restrained palette centered on a single terracotta accent against deep and light tonal neutrals. The accent is never used casually ΓÇö its rarity on the screen is its power. All values below are the shipped `@theme` tokens in `src/index.css`.
 
 ### Primary
-- **Gold** (#D4AF37): The signature accent. Used for CTAs, badges, dividers, hover states, and editorial highlights. Never applied to body text or backgrounds. Appears on roughly 5ΓÇô10% of any given screen.
+- **Gold** (#A2492B, terracotta): The signature accent, exposed as the `gold` token. Used for CTAs, badges, dividers, hover states, and editorial highlights. Never applied to body text or large background fills. Appears on roughly 5ΓÇô10% of any given screen.
+- **Gold-light** (#C45A3C) and **Gold-dark** (#7A3520): hover/gradient companions.
 
 ### Neutral
-- **Onyx** (#0A0A0A): Primary dark surface. Used for hero overlays, dark section backgrounds, footer, and primary button base. Warm-black, never pure #000.
-- **Bone** (#FDFBF7): Warm off-white section background. Used for alternating content sections.
-- **Ivory** (#FFFDF9): Lightest surface ΓÇö the default page background. Slightly warm, never pure white.
-- **Pearl** (#F3F1ED): Subtle neutral used for image placeholders and secondary surface differentiation.
-- **Stone-800/500/400**: Tailwind stone scale used for body text (800: headings, 500: body, 400: labels).
+- **Onyx** (#161513): Primary dark surface ΓÇö hero overlays, dark sections, footer, primary button base. Warm-black, never pure #000.
+- **Bone / Ivory** (#EFEAE2): Default page background and alternating light sections. `ivory` aliases `bone`.
+- **Champagne** (#F6F0E6) and **Pearl** (#E8E3D9): Subtle secondary light surfaces.
+- **Stone scale**: Tailwind stone for text. Accessibility floor: informative text on light surfaces uses stone-600 or darker (WCAG AA at 11px); stone-400/500 are reserved for dark surfaces or purely decorative roles.
 
 ### Named Rules
 
-**The Gold Rarity Rule.** Gold occupies Γëñ10% of any given screen. Its scarcity is its weight. Never use gold as a background fill for large areas, as body text, or in gradients for text.
+**The Terracotta Rarity Rule.** The accent occupies Γëñ10% of any given screen. Its scarcity is its weight. Never use it as a large background fill or as body text.
 
-**The Warm-Black Rule.** Never use pure #000 or #fff. All dark surfaces are onyx (#0A0A0A); all light surfaces are ivory (#FFFDF9) or bone (#FDFBF7). The warmth is subtle but essential.
+**The Warm-Black Rule.** Never use pure #000 or #fff. All dark surfaces are onyx (#161513); all light surfaces are bone (#EFEAE2) or warmer. The warmth is subtle but essential.
 
 ## 3. Typography
 
-**Display Font:** Plus Jakarta Sans (sans-serif)
-**Editorial Font:** Playfair Display (serif, italic)
-**Body Font:** Inter (sans-serif)
-**Arabic Font:** IBM Plex Sans Arabic (sans-serif)
+**Display Font:** Fraunces (serif) ΓÇö `font-heading`
+**Editorial Font:** Newsreader (serif, italic) ΓÇö `font-editorial`
+**Body Font:** Newsreader (serif) ΓÇö `font-body`
+**Label/UI Font:** Archivo (sans-serif) ΓÇö `font-label`
+**Arabic Body:** Cairo, IBM Plex Sans Arabic ΓÇö `font-arabic`
+**Arabic Headings:** Amiri ΓÇö `font-arabic-heading`
 
-**Character:** A dialogue between architectural clarity and editorial warmth. Plus Jakarta Sans provides the structure ΓÇö tall, precise, uppercase with wide tracking. Playfair Display italic adds the ornament ΓÇö used sparingly for heritage, legacy, and poetic moments. Inter handles all body copy with quiet reliability.
+**Character:** A dialogue between editorial warmth and architectural clarity. Fraunces provides the structure ΓÇö uppercase with wide tracking. Newsreader italic adds the ornament ΓÇö used sparingly for heritage, legacy, and poetic moments. Archivo handles labels and UI with quiet precision.
 
 ### Hierarchy
-- **Display** (700, clamp(3rem, 8vw, 10rem), 1.2): Hero headlines and major section titles. Always uppercase with wide tracking. Never italic.
-- **Editorial** (400 italic, clamp(1.5rem, 4vw, 3rem), 1.3): Accent phrases within headings. Always italic, never uppercase. Gold-dark by default.
-- **Headline** (700, clamp(1.5rem, 3vw, 2.5rem), 1.2): Section subheadings. Uppercase, wide tracking.
-- **Title** (500, 1.25rem, 1.1): Product names, card titles. Sentence case.
-- **Body** (400, 0.875rem, 1.7): Paragraphs, descriptions. Max line length 70ch. Never uppercase.
-- **Label** (700, 0.625rem, 1, 0.3em letter-spacing, uppercase): Navigation, badges, metadata. Always uppercase.
-- **Arabic Body** (600, 1.25rem, 1.6): RTL content uses IBM Plex Sans Arabic with increased size and weight for readability.
+- **Display** (Fraunces 500, uppercase, wide tracking): Hero headlines and major section titles. Never italic.
+- **Editorial** (Newsreader italic, gold-dark): Accent phrases within headings. Always italic, never uppercase.
+- **Body** (Newsreader 400, 1.7): Paragraphs, descriptions. Max line length 70ch. Never uppercase.
+- **Label / Micro** (Archivo, `text-micro` = 11px, uppercase, 0.2ΓÇô0.3em tracking): Navigation, badges, metadata, form labels. 11px is the absolute size floor ΓÇö nothing renders smaller. `text-caption` (12px) is the secondary caption size.
+- **Arabic scaling:** RTL text renders ~25ΓÇô30% larger than its LTR counterpart (`text-micro` ΓåÆ 14px, `text-caption` ΓåÆ 15px, and the rem-scale overrides in index.css). Letter-spacing is forced to 0 in RTL.
 
 ### Named Rules
 
-**The Uppercase Rule.** Display, headline, and label text is always uppercase. Editorial accents and body text are never uppercase. This distinction creates the typographic hierarchy.
+**The Uppercase Rule.** Display, headline, and label text is always uppercase. Editorial accents and body text are never uppercase.
+
+**The 11px Floor Rule.** No text renders below 11px (LTR) / 14px (RTL). Use the `text-micro` and `text-caption` tokens; never arbitrary pixel values.
 
-**The Editorial Rule.** Playfair Display italic is reserved for single words or short phrases within headings. Never use it for body text, full paragraphs, or multiple consecutive lines.
+**The Editorial Rule.** Newsreader italic is reserved for single words or short phrases within headings. Never for body text or multiple consecutive lines.
 
 ## 4. Elevation
 
 Warm layered ΓÇö depth is conveyed through tonal surface stacking rather than drop shadows. Dark sections sit against light sections with no shadow border; the contrast itself provides the separation. When overlays are needed (modals, quick view), a gentle backdrop blur is preferred over shadow.
 
-### Shadow Vocabulary
-- No ambient shadows on surfaces. Cards and sections are flat by default.
-- Modal overlays use `bg-stone-900/40 backdrop-blur-sm` ΓÇö a tonal veil, not a shadow.
-- Button hover uses `box-shadow: 0 4px 20px rgba(212, 175, 55, 0.1)` ΓÇö a warm gold glow, not a gray shadow.
-
 ### Named Rules
 
-**The Flat-By-Default Rule.** Surfaces are flat at rest. Depth comes from tonal contrast and spacing, not from box-shadows. Shadows appear only as response to state (hover, focus) and are always gold-tinted.
+**The Flat-By-Default Rule.** Surfaces are flat at rest. Depth comes from tonal contrast and spacing, not from box-shadows. Shadows appear only as response to state (hover, focus) and are always accent-tinted.
 
 ## 5. Components
 
 ### Buttons
 - **Shape:** Sharp-edged (no border-radius). The absence of rounding reinforces architectural precision.
-- **Primary (btn-luxury):** Onyx background (#0A0A0A) with a subtle gradient. White text, 10px uppercase with 0.3em tracking. Padding 20px 40px. On hover: text turns gold, subtle scale transform (105%).
-- **Secondary (btn-luxury-outline):** Transparent background, gold border at 40% opacity, gold text. On hover: gold background, onyx text.
-- **Focus:** Visible outline ring matching gold.
+- **Primary (btn-luxury):** Onyx background (#161513), bone text, Archivo 12px uppercase with 0.25em tracking, padding 20px 40px. On hover: text turns terracotta.
+- **Secondary (btn-luxury-outline):** Transparent background, terracotta border at 40% opacity, terracotta text. On hover: terracotta background, onyx text.
+- **Focus:** Visible 2px outline ring in terracotta with 2px offset.
 
 ### Navigation (Header)
-- **Style:** Fixed top, full-width. Transparent at page top, transitions to white with backdrop-blur and subtle bottom border on scroll.
-- **Links:** 10px uppercase, 0.3em tracking. On hover: gold accent. RTL support with IBM Plex Sans Arabic.
-- **Mobile:** Full-height sidebar overlay from left (or right in RTL), spring-animated, with backdrop blur behind.
+- **Style:** Fixed top, full-width. Transparent at page top, transitions to bone with backdrop-blur and subtle bottom border on scroll.
+- **Links:** `text-micro` uppercase, wide tracking. On hover: terracotta accent. Count badges (Selection, Bag) are terracotta circles, `text-micro` bold, `min-w-4 h-4`.
+- **Mobile:** Bottom navigation bar (Home, Search, Selection, Bag, You) plus full-height sidebar overlay, spring-animated, with backdrop blur.
 
 ### Product Cards
 - **Shape:** Sharp-edged image container, aspect ratio 3:4. No border-radius.
-- **Background:** Stone-100 for image placeholder while loading.
-- **Hover:** Image scales up (105%), subtle gold border overlay appears, action buttons slide up from bottom.
-- **Badges:** Positioned top-left. Gold, onyx, or white backgrounds depending on badge type (new, featured, jewelry, 3D).
-- **Typography:** Category label (10px, uppercase, stone-400), product name (heading-xl, stone-900), price (body-sm, stone-600).
+- **Hover:** Image scales up, action buttons slide up from bottom.
+- **Badges:** Positioned top-left ΓÇö terracotta, onyx, or ivory backgrounds depending on badge type.
+- **Typography:** Category label (`text-micro`, uppercase, stone-600), product name (Fraunces, stone-900), price with "From" prefix (booking-first pricing honesty).
 
 ### Inputs / Fields
-- **Style:** Borderless with a single bottom border (border-b) in stone-800. Transparent background.
-- **Focus:** Border transitions to gold. No other focus ornament.
-- **Error:** Red text (red-500) in 10px uppercase below the field.
-- **Disabled:** Reduced opacity without specification.
+- **Style:** Borderless with a single bottom border (border-b) in stone-300. Transparent background.
+- **Focus:** Border transitions to terracotta. No other focus ornament.
+- **Labels:** `text-micro` uppercase, stone-600.
+- **Error:** red-500, `text-micro` uppercase below the field.
 
 ### Footer
-- **Style:** Full-width dark section (#0e0e0e) with a gold shimmer accent line at the top border. Gold accents on headings and interactive elements.
-- **Links:** Stone-500 text, uppercase, 0.15em tracking. On hover: gold color with expanding underline line animation.
-- **Social Icons:** Circular borders with stone-800. On hover: gold background and border.
-
-### Social Links
-- **Shape:** Circular (full border-radius, 44px diameter).
-- **Rest:** Border stone-800, icon stone-400.
-- **Hover:** Background and border gold, icon white.
-- **Transition:** 500ms ease.
+- **Style:** Full-width onyx section with a terracotta shimmer accent line at the top border.
+- **Links:** stone-400/500 text (dark surface ΓÇö AA compliant on onyx), uppercase. On hover: terracotta with expanding underline.
+- **Newsletter:** Working lead capture persisting to localStorage.
+- **Social Icons:** Circular borders, stone-800. On hover: terracotta background and border, white icon.
 
 ## 6. Do's and Don'ts
 
 ### Do:
-- **Do** use gold as a restrained accent (Γëñ10% of any screen). Its rarity is its power.
-- **Do** use onyx (#0A0A0A) for dark surfaces and ivory (#FFFDF9) for light surfaces ΓÇö never pure black or white.
-- **Do** use Plus Jakarta Sans uppercase with wide tracking for all headings and navigation.
-- **Do** use Playfair Display italic sparingly for editorial accent words within headings.
+- **Do** use terracotta as a restrained accent (Γëñ10% of any screen).
+- **Do** use onyx (#161513) for dark surfaces and bone (#EFEAE2) for light surfaces ΓÇö never pure black or white.
+- **Do** use Fraunces uppercase with wide tracking for display headings, Newsreader italic for editorial accents.
+- **Do** respect the 11px floor: `text-micro` / `text-caption` tokens only.
+- **Do** keep informative text on light surfaces at stone-600 or darker (WCAG AA).
 - **Do** use sharp edges (no border-radius) on buttons, cards, and containers.
-- **Do** use warm tonal layering for depth rather than box-shadows.
-- **Do** support RTL layout with IBM Plex Sans Arabic at increased size and weight.
-- **Do** use the `heading-editorial` class for italic serif accents and `heading-display` for structural headings.
+- **Do** support RTL-first layout with Cairo/Amiri at increased size and zero letter-spacing.
 
 ### Don't:
-- **Don't** use gold as a background fill for large areas or as body text.
-- **Don't** use gradient text (`background-clip: text` with gradients) ΓÇö decorative, never meaningful.
+- **Don't** use the accent as a large background fill or as body text.
+- **Don't** use gradient text (`background-clip: text`) ΓÇö decorative, never meaningful.
 - **Don't** use pure #000 or #fff anywhere ΓÇö tint neutrals toward the brand warmth.
-- **Don't** use border-radius on buttons, cards, or containers ΓÇö sharp edges are architectural.
-- **Don't** apply box-shadows as default surface treatment ΓÇö use tonal layering instead.
-- **Don't** use Playfair Display for body text, full paragraphs, or multiple consecutive lines.
-- **Don't** use glassmorphism or frosted-glass effects as default decorative treatment.
-- **Don't** create identical card grids with icon + heading + text repeated endlessly.
-- **Don't** use modal as first thought ΓÇö exhaust inline and progressive disclosure alternatives first.
-- **Don't** use side-stripe borders (border-left/right >1px colored accents on cards or callouts).
-- **Don't** do fast fashion aesthetics ΓÇö avoid anything mass-produced, trendy, or disposable-feeling.
+- **Don't** use border-radius on buttons, cards, or containers.
+- **Don't** apply box-shadows as default surface treatment ΓÇö use tonal layering.
+- **Don't** render text below the 11px floor or use arbitrary `text-[Npx]` values.
+- **Don't** place stone-400/500 informative text on light surfaces ΓÇö it fails WCAG AA.
+- **Don't** use glassmorphism as default decorative treatment.
+- **Don't** create dead-end links ΓÇö every navigable element must resolve to a real destination.
diff --git a/docs/superpowers/plans/2026-08-23-booking-first-conversion.md b/docs/superpowers/plans/2026-08-23-booking-first-conversion.md
new file mode 100644
index 0000000..c9829b3
--- /dev/null
+++ b/docs/superpowers/plans/2026-08-23-booking-first-conversion.md
@@ -0,0 +1,932 @@
+# Booking-First Conversion Implementation Plan
+
+> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
+
+**Goal:** Make "Reserve a Private Viewing" the primary conversion path (saved-gowns Selection ΓåÆ prefilled appointment ΓåÆ admin calendar + emails + WhatsApp), with Arabic as default language and "From AED X" pricing, keeping checkout functional but secondary.
+
+**Architecture:** Reuse the existing WishlistContext (renamed "Your Selection"), the existing AppointmentPage wizard (prefilled via router state), the lazy Resend client in `src/lib/email.ts`, and the admin Appointments calendar. One nullable `jsonb` column on `appointments`. No checkout changes beyond i18n fixes.
+
+**Tech Stack:** React 19 + Vite + TypeScript + Tailwind v4 + Supabase + Resend + Playwright.
+
+## Global Constraints
+
+- Spec: `docs/superpowers/specs/2026-08-23-booking-first-conversion-design.md`
+- Every new user-facing string gets BOTH English and Arabic entries in `src/contexts/LanguageContext.tsx` (en dict ~lines 190ΓÇô330, ar dict ~lines 890ΓÇô1030).
+- Emails are fire-and-forget (`.catch(console.error)`), never block UI, no-op safely when `RESEND_API_KEY` is unset (use existing `getResendClient()`).
+- WhatsApp number: `971553730792`.
+- Do NOT remove or restyle checkout, orders, Stripe readiness.
+- Dates: `toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-AE', ΓÇª)` ΓÇö never hardcoded `'en-US'` in touched files.
+- Verify each task with `npm run lint` (runs `tsc --noEmit`) before committing.
+- Final gate: full Playwright suite green (`npx playwright test`) before deploy; deploy only via `C:\Users\KAIS\AppData\Local\Temp\opencode\netlify-rest-deploy.ps1`; push pattern `git push origin salon-rebrand:main`.
+
+---
+
+### Task 1: Data foundation ΓÇö `interested_gowns` column, type, service
+
+**Files:**
+- Create: `supabase/migrations/20260823100000_appointments_interested_gowns.sql`
+- Modify: `src/types.ts` (Appointment interface, lines 36ΓÇô47)
+- Modify: `src/services/appointments.ts:19-45` (createAppointment insert)
+
+**Interfaces:**
+- Produces: `GownRef` type in `src/types.ts`: `{ id: string; name: string; size?: string; intent: 'sale' | 'rent' }`
+- Produces: `Appointment.interested_gowns?: GownRef[] | null`
+- Consumes (later tasks): `createAppointment` accepts and persists `interested_gowns`
+
+- [ ] **Step 1: Write the migration**
+
+```sql
+-- appointments.interested_gowns: gowns the client saved before requesting a viewing
+alter table public.appointments
+  add column if not exists interested_gowns jsonb;
+
+comment on column public.appointments.interested_gowns is
+  'Array of {id,name,size,intent} for gowns saved to the client''s selection';
+```
+
+- [ ] **Step 2: Extend types**
+
+In `src/types.ts`, above `export interface Appointment` add:
+
+```ts
+export interface GownRef {
+  id: string;
+  name: string;
+  size?: string;
+  intent: 'sale' | 'rent';
+}
+```
+
+Inside `interface Appointment` add as the last field:
+
+```ts
+  interested_gowns?: GownRef[] | null;
+```
+
+- [ ] **Step 3: Persist the column**
+
+In `src/services/appointments.ts` inside the Supabase insert object (line 27), after `notes: appointment.notes,` add:
+
+```ts
+        interested_gowns: appointment.interested_gowns ?? null,
+```
+
+Also in the local fallback function `createLocalAppointment`, ensure the created object spreads the input (it already persists the whole appointment object ΓÇö verify, no change needed if so).
+
+- [ ] **Step 4: Typecheck**
+
+Run: `npm run lint`
+Expected: no errors.
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add supabase/migrations/20260823100000_appointments_interested_gowns.sql src/types.ts src/services/appointments.ts
+git commit -m "feat(appointments): interested_gowns jsonb column + GownRef type"
+```
+
+---
+
+### Task 2: Arabic default language + locale-aware dates
+
+**Files:**
+- Modify: `src/contexts/LanguageContext.tsx:1414-1416`
+- Modify: `src/pages/AppointmentPage.tsx:109` (success date line)
+
+**Interfaces:**
+- Consumes: nothing new.
+- Produces: first-visit language = `'ar'`; pattern `lang === 'ar' ? 'ar-AE' : 'en-AE'` used in AppointmentPage.
+
+- [ ] **Step 1: Flip the fallback**
+
+Replace in `LanguageContext.tsx`:
+
+```ts
+    return (localStorage.getItem('riman_lang') as Language) || 'en';
+```
+
+with:
+
+```ts
+    return (localStorage.getItem('riman_lang') as Language) || 'ar';
+```
+
+(Returning visitors with a stored preference are unaffected.)
+
+- [ ] **Step 2: Locale-aware success date**
+
+In `AppointmentPage.tsx` the component already calls `useLanguage()` for `t`. Destructure also `isRtl`:
+
+```ts
+  const { t, isRtl } = useLanguage();
+```
+
+Replace line 109's `new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })` with:
+
+```tsx
+{new Date(form.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
+```
+
+Apply the same replacement to any other `'en-US'` occurrences inside `AppointmentPage.tsx` (grep the file).
+
+- [ ] **Step 3: Typecheck**
+
+Run: `npm run lint`
+Expected: no errors.
+
+- [ ] **Step 4: Commit**
+
+```bash
+git add src/contexts/LanguageContext.tsx src/pages/AppointmentPage.tsx
+git commit -m "feat(i18n): Arabic as default language, locale-aware appointment dates"
+```
+
+---
+
+### Task 3: "From" pricing copy
+
+**Files:**
+- Modify: `src/contexts/LanguageContext.tsx` (add keys to en + ar dicts)
+- Modify: `src/pages/ProductDetail.tsx:311` (sale price), `:321` (rental price), `:643` (mobile bar)
+- Modify: `src/components/ProductCard.tsx` (price line ΓÇö locate `formatPrice(` usage)
+
+**Interfaces:**
+- Produces translation keys: `pricing.from`, `pricing.rental_period`, `pricing.consultation_note`
+
+- [ ] **Step 1: Add translation keys**
+
+English dict (near other `product.` keys):
+
+```ts
+    // From-pricing
+    'pricing.from': 'From',
+    'pricing.rental_period': '3-day rental',
+    'pricing.consultation_note': 'Final quote confirmed at your consultation ΓÇö fitting and alterations included.',
+```
+
+Arabic dict:
+
+```ts
+    // From-pricing
+    'pricing.from': '┘è╪¿╪»╪ú ┘à┘å',
+    'pricing.rental_period': '╪¬╪ú╪¼┘è╪▒ ┘ú ╪ú┘è╪º┘à',
+    'pricing.consultation_note': '┘è╪¬┘à ╪¬╪ú┘â┘è╪» ╪º┘ä╪│╪╣╪▒ ╪º┘ä┘å┘ç╪º╪ª┘è ┘ü┘è ┘à┘ê╪╣╪» ╪º┘ä╪º╪│╪¬╪┤╪º╪▒╪⌐ ΓÇö ┘è╪┤┘à┘ä ╪º┘ä╪¬┘ü╪╡┘è┘ä ┘ê╪º┘ä╪¬╪╣╪»┘è┘ä╪º╪¬.',
+```
+
+(Do not write the `// From-pricing` comments into the dicts if comment style there differs ΓÇö match surrounding style; keys are what matter.)
+
+- [ ] **Step 2: Desktop PDP sale price (line 311)**
+
+Replace:
+
+```tsx
+<span className="font-heading text-3xl text-stone-800">{formatPrice(product.salePrice || 0)}</span>
+```
+
+with:
+
+```tsx
+<span className="font-heading text-3xl text-stone-800"><span className="text-sm font-body text-stone-500 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
+```
+
+- [ ] **Step 3: Desktop PDP rental price (line 321)**
+
+Replace:
+
+```tsx
+<span className="font-heading text-3xl text-gold">{formatPrice(product.rentalPrice || 0)}</span>
+```
+
+with:
+
+```tsx
+<span className="font-heading text-3xl text-gold"><span className="text-sm font-body text-stone-500 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
+```
+
+Directly under whichever price block closes (same parent container), append the note:
+
+```tsx
+<p className="font-body text-[11px] text-stone-400 italic mt-2 leading-relaxed">{t('pricing.consultation_note')}</p>
+```
+
+- [ ] **Step 4: Mobile sticky bar (line 643)**
+
+Wrap the existing price with the From prefix:
+
+```tsx
+<p className="font-heading text-sm text-gold"><span className="text-[10px] font-body text-stone-400 uppercase tracking-wider me-1">{t('pricing.from')}</span>{formatPrice(isSale ? (product.salePrice || 0) : (isRent ? (product.rentalPrice || 0) : 0))}</p>
+```
+
+- [ ] **Step 5: ProductCard price line**
+
+In `ProductCard.tsx`, find the rendered price (`formatPrice(...)`). Prefix it with `<span className="me-1 text-[9px] uppercase tracking-wider text-stone-400">{t('pricing.from')}</span>` inside the same element, keeping classes intact. `t` is already imported there.
+
+- [ ] **Step 6: Typecheck + visual sanity**
+
+Run: `npm run lint && npm run dev` then open `http://localhost:3001/product/<any-id>` in EN and AR.
+Expected: "From"/"┘è╪¿╪»╪ú ┘à┘å" prefixes render; note line visible under desktop price; no layout overflow at 1280px width.
+
+- [ ] **Step 7: Commit**
+
+```bash
+git add src/contexts/LanguageContext.tsx src/pages/ProductDetail.tsx src/components/ProductCard.tsx
+git commit -m "feat(pricing): From-AED pricing copy + consultation note"
+```
+
+---
+
+### Task 4: Prefilled viewing-request flow (PDP primary CTA)
+
+Implementation note vs spec: instead of building a modal panel, the PDP primary CTA navigates to the proven `/appointment` wizard carrying the gown list in router state. Same UX outcome, zero duplicated form logic.
+
+**Files:**
+- Modify: `src/contexts/LanguageContext.tsx` (keys below)
+- Modify: `src/pages/ProductDetail.tsx` (CTA block lines 368ΓÇô389, imports, handler)
+- Modify: `src/pages/AppointmentPage.tsx` (read `location.state`, chips, prefill)
+
+**Interfaces:**
+- Consumes: `GownRef` (Task 1), `addToWishlist` from WishlistContext.
+- Produces: route contract `/appointment` accepts `location.state = { gowns?: GownRef[] }`; AppointmentPage auto-selects `service_type: 'rental'` when any gown has `intent: 'rent'`, else `'bridal'`, and pre-fills notes with gown names.
+- Produces keys: `product.reserve_viewing`, `appointment.your_gowns`
+
+- [ ] **Step 1: Translation keys**
+
+English:
+
+```ts
+    'product.reserve_viewing': 'Reserve a Private Viewing',
+    'appointment.your_gowns': 'Your Selected Pieces',
+```
+
+Arabic:
+
+```ts
+    'product.reserve_viewing': '╪º╪¡╪¼╪▓┘è ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐',
+    'appointment.your_gowns': '┘é╪╖╪╣┘â ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐',
+```
+
+- [ ] **Step 2: PDP CTA block rewrite**
+
+In `ProductDetail.tsx`, add import near top:
+
+```ts
+import { useNavigate } from 'react-router-dom';
+import type { GownRef } from '../types';
+```
+
+Inside the component add `const navigate = useNavigate();` beside the other hooks, plus:
+
+```ts
+  const reserveViewing = () => {
+    if (product) {
+      if (!isInWishlist(product.id)) addToWishlist(product);
+      const gowns: GownRef[] = [{
+        id: product.id,
+        name: product.name,
+        size: selectedSize || undefined,
+        intent: isRent ? 'rent' : 'sale',
+      }];
+      navigate('/appointment', { state: { gowns } });
+    }
+  };
+```
+
+Replace the primary button block (lines 370ΓÇô379) so the flex-col contains TWO stacked buttons, heart button unchanged beside them:
+
+```tsx
+<div className="flex-1 flex flex-col gap-2">
+  <button onClick={reserveViewing} className="w-full btn-luxury flex items-center justify-center gap-3">
+    <Sparkles className="w-4 h-4" />
+    {t('product.reserve_viewing')}
+  </button>
+  <button onClick={handleAddToCart} disabled={isAddingToCart} className="w-full btn-luxury-outline !py-3 flex items-center justify-center gap-3">
+    {isAddingToCart ? (
+      <Loader2 className="w-4 h-4 animate-spin" />
+    ) : (
+      <>
+        <ShoppingBag className="w-3.5 h-3.5" />
+        {isRent ? t('product.book_rental') : t('product.add_to_collection')}
+      </>
+    )}
+  </button>
+  {errorMsg && (
+    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 uppercase tracking-widest text-center font-bold">
+      {errorMsg}
+    </motion.p>
+  )}
+</div>
+```
+
+Add `Sparkles` to the lucide-react import. If a second mobile CTA surface exists further down (~lines 700ΓÇô738), apply the same reserve-primary/bag-secondary ordering there.
+
+- [ ] **Step 3: AppointmentPage prefill**
+
+Add imports:
+
+```ts
+import { useLocation } from 'react-router-dom';
+import type { GownRef } from '../types';
+```
+
+In the component:
+
+```ts
+  const location = useLocation();
+  const incomingGowns: GownRef[] = (location.state as { gowns?: GownRef[] } | null)?.gowns ?? [];
+  const gownNames = incomingGowns.map(g => `${g.name}${g.size ? ` (${g.size})` : ''}`);
+```
+
+Change the `form` initial state to prefill:
+
+```ts
+  const [form, setForm] = useState(() => ({
+    name: '',
+    email: '',
+    phone: '',
+    date: '',
+    time: '',
+    service_type: incomingGowns.some(g => g.intent === 'rent') ? 'rental' : incomingGowns.length ? 'bridal' : '',
+    notes: gownNames.length ? `Interested in: ${gownNames.join(', ')}` : '',
+  }));
+```
+
+Above the form fields (inside step-1 render), when `incomingGowns.length > 0` show:
+
+```tsx
+<div className="mb-6 p-4 border border-gold/30 bg-gold/[0.04]">
+  <p className="text-[10px] tracking-widest uppercase text-stone-800 font-bold mb-2">{t('appointment.your_gowns')}</p>
+  <ul className="space-y-1">
+    {incomingGowns.map((g, i) => (
+      <li key={`${g.id}-${i}`} className="text-xs text-stone-600 italic">{g.name}{g.size ? ` ┬╖ ${g.size}` : ''}</li>
+    ))}
+  </ul>
+</div>
+```
+
+Pass gowns through submit: in `handleSubmit`, extend the `createAppointment({...})` argument with `interested_gowns: incomingGowns.length ? incomingGowns : null,`.
+
+- [ ] **Step 4: Manual verification**
+
+Run: `npm run dev`. Open a PDP, click "Reserve a Private Viewing".
+Expected: lands on /appointment with service preselected, notes prefilled, gold chips listing the gown; submitting creates an appointment row containing `interested_gowns` (check Supabase table editor or local storage fallback).
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add src/contexts/LanguageContext.tsx src/pages/ProductDetail.tsx src/pages/AppointmentPage.tsx
+git commit -m "feat(booking): Reserve-a-Viewing primary CTA with prefilled appointment"
+```
+
+---
+
+### Task 5: Your Selection page (wishlist rename + request CTA)
+
+**Files:**
+- Modify: `src/pages/WishlistPage.tsx`
+- Modify: `src/contexts/LanguageContext.tsx`
+
+**Interfaces:**
+- Consumes: route contract from Task 4 (`location.state.gowns`).
+- Produces keys: `selection.title`, `selection.subtitle`, `selection.empty`, `selection.empty_desc`, `selection.explore`, `selection.view`, `selection.add_to_bag`, `selection.request_viewing`, `selection.count`
+
+- [ ] **Step 1: Translation keys**
+
+English (replace the old `wishlist.*` values' usage ΓÇö keep old keys, add new):
+
+```ts
+    // Selection
+    'selection.title': 'Your Selection',
+    'selection.subtitle': 'Pieces kept aside for your private viewing',
+    'selection.empty': 'Your selection is empty',
+    'selection.empty_desc': 'Save the silhouettes that catch your eye ΓÇö we will have them ready for your visit.',
+    'selection.explore': 'Explore Atelier',
+    'selection.view': 'View',
+    'selection.add_to_bag': 'Add to Bag',
+    'selection.request_viewing': 'Request Private Viewing',
+    'selection.count': 'pieces selected',
+```
+
+Arabic:
+
+```ts
+    // Selection
+    'selection.title': '┘à╪«╪¬╪º╪▒╪º╪¬┘â',
+    'selection.subtitle': '┘é╪╖╪╣ ╪º┘å╪¬╪╕╪▒┘å╪º┘ç╪º ┘ä┘à╪┤╪º┘ç╪»╪¬┘â ╪º┘ä╪«╪º╪╡╪⌐',
+    'selection.empty': '┘à╪«╪¬╪º╪▒╪º╪¬┘â ┘ü╪º╪▒╪║╪⌐',
+    'selection.empty_desc': '╪º╪¡┘ü╪╕┘è ╪º┘ä╪¬╪╡╪º┘à┘è┘à ╪º┘ä╪¬┘è ╪ú╪│╪▒╪¬ ┘é┘ä╪¿┘â ΓÇö ┘ê╪│╪¬┘â┘ê┘å ╪¼╪º┘ç╪▓╪⌐ ╪╣┘å╪» ╪▓┘è╪º╪▒╪¬┘â.',
+    'selection.explore': '╪º╪│╪¬┘â╪┤┘ü┘è ╪º┘ä╪»╪º╪▒',
+    'selection.view': '╪╣╪▒╪╢',
+    'selection.add_to_bag': '╪ú╪╢┘ü ┘ä┘ä╪¡┘é┘è╪¿╪⌐',
+    'selection.request_viewing': '╪╖┘ä╪¿ ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐',
+    'selection.count': '┘é╪╖╪╣╪⌐ ┘à╪«╪¬╪º╪▒╪⌐',
+```
+
+- [ ] **Step 2: Page copy swap + request CTA**
+
+In `WishlistPage.tsx`: replace every `t('wishlist.ΓÇª')` with the matching `t('selection.ΓÇª')` (title/subtitle/empty/empty_desc/explore/view/add_to_bag). Under the header subtitle add the count line: `{wishlist.length} {t('selection.count')}` styled like the subtitle. Above the grid (and again below it), when `wishlist.length > 0` render:
+
+```tsx
+<button
+  onClick={() => navigate('/appointment', {
+    state: {
+      gowns: wishlist.map(p => ({ id: p.id, name: p.name, intent: (p.productType === 'rent' ? 'rent' : 'sale') as 'rent' | 'sale' })),
+    },
+  })}
+  className="btn-luxury px-12 w-full sm:w-auto"
+>
+  {t('selection.request_viewing')}
+</button>
+```
+
+Add `import { useNavigate } from 'react-router-dom';` and `const navigate = useNavigate();`. Check the actual field name for product type on the `Product` interface in `src/types.ts` (`product_type` vs `productType`) and map accordingly ΓÇö the mapping must compile.
+
+- [ ] **Step 3: Typecheck + manual verify**
+
+Run: `npm run lint`, then save two gowns and open `/wishlist`.
+Expected: new title/copy, count line, button navigates to prefilled appointment listing both gowns.
+
+- [ ] **Step 4: Commit**
+
+```bash
+git add src/pages/WishlistPage.tsx src/contexts/LanguageContext.tsx
+git commit -m "feat(selection): Your Selection page with request-viewing CTA"
+```
+
+---
+
+### Task 6: Emails ΓÇö appointment confirmation + admin alert
+
+**Files:**
+- Modify: `src/lib/email.ts`
+- Modify: `src/pages/AppointmentPage.tsx` (handleSubmit)
+
+**Interfaces:**
+- Consumes: `getResendClient()` (existing), `GownRef`.
+- Produces:
+  - `sendAppointmentConfirmationEmail(data: { name: string; email: string; date: string; time: string; gowns: string[] }): Promise<{ success: boolean; error?: string }>`
+  - `sendAppointmentAdminAlert(data: { name: string; email: string; phone: string; date: string; time: string; gowns: string[] }): Promise<{ success: boolean; error?: string }>`
+
+- [ ] **Step 1: Implement both functions**
+
+Append to `src/lib/email.ts` (match existing HTML style of `sendOrderConfirmationEmail`):
+
+```ts
+export async function sendAppointmentConfirmationEmail(data: {
+  name: string;
+  email: string;
+  date: string;
+  time: string;
+  gowns: string[];
+}): Promise<{ success: boolean; error?: string }> {
+  try {
+    const resend = getResendClient();
+    if (!resend) return { success: false, error: 'not-configured' };
+
+    const html = `
+      <!DOCTYPE html>
+      <html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1f1f1f;max-width:600px;margin:0 auto;padding:24px;">
+        <div style="text-align:center;margin-bottom:32px;">
+          <h1 style="font-family:'Playfair Display',Georgia,serif;color:#0a0a0a;margin:0 0 8px;font-size:28px;">Riman Fashion</h1>
+          <p style="color:#666;font-size:14px;margin:0;">Atelier Riman ΓÇö Sharjah</p>
+        </div>
+        <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;padding:24px;">
+          <h2 style="margin:0 0 16px;font-size:20px;">Your Private Viewing</h2>
+          <p>Dear <strong>${data.name}</strong>,</p>
+          <p>Your viewing request has been received for <strong>${new Date(data.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong> at <strong>${data.time}</strong>.</p>
+          ${data.gowns.length ? `<p>Pieces prepared for you:<br/><em>${data.gowns.join('<br/>')}</em></p>` : ''}
+          <p style="margin-bottom:0;">Al Zahra St, Sharjah, UAE. To reschedule, simply reply to this email.</p>
+        </div>
+        <p style="font-size:12px;color:#999;text-align:center;margin-top:32px;">Atelier Riman ┬╖ hello@rimanfashion.com</p>
+      </body></html>`;
+
+    const { error } = await resend.emails.send({
+      from: import.meta.env.RESEND_FROM_EMAIL || 'Riman Fashion <orders@rimanfashion.com>',
+      to: data.email,
+      subject: `Private Viewing Request ΓÇö ${data.date}`,
+      html,
+    });
+    if (error) return { success: false, error: error.message };
+    return { success: true };
+  } catch (err) {
+    console.error('sendAppointmentConfirmationEmail error:', err);
+    return { success: false, error: String(err) };
+  }
+}
+
+export async function sendAppointmentAdminAlert(data: {
+  name: string;
+  email: string;
+  phone: string;
+  date: string;
+  time: string;
+  gowns: string[];
+}): Promise<{ success: boolean; error?: string }> {
+  try {
+    const resend = getResendClient();
+    if (!resend) return { success: false, error: 'not-configured' };
+
+    const adminEmail = import.meta.env.RESEND_ADMIN_EMAIL || 'admin@rimanfashion.com';
+    const html = `
+      <h2>New Viewing Request</h2>
+      <p><strong>${data.name}</strong> ┬╖ ${data.phone} ┬╖ ${data.email}</p>
+      <p><strong>Requested:</strong> ${data.date} at ${data.time}</p>
+      ${data.gowns.length ? `<p><strong>Gowns:</strong> ${data.gowns.join(', ')}</p>` : ''}
+      <p><a href="https://riman-fashion-v2.netlify.app/admin/appointments">Open Admin Calendar</a></p>`;
+
+    const { error } = await resend.emails.send({
+      from: import.meta.env.RESEND_FROM_EMAIL || 'Riman Fashion <orders@rimanfashion.com>',
+      to: adminEmail,
+      subject: `≡ƒôà Viewing Request ΓÇö ${data.name}`,
+      html,
+    });
+    if (error) return { success: false, error: error.message };
+    return { success: true };
+  } catch (err) {
+    console.error('sendAppointmentAdminAlert error:', err);
+    return { success: false, error: String(err) };
+  }
+}
+```
+
+- [ ] **Step 2: Wire into handleSubmit (fire-and-forget)**
+
+In `AppointmentPage.tsx` after `await createAppointment({...})` succeeds and before `setIsSubmitted(true)`:
+
+```ts
+      const gownList = gownNames.length ? gownNames : [];
+      sendAppointmentConfirmationEmail({ name: form.name, email: form.email, date: form.date, time: form.time, gowns: gownList }).catch(err => console.error('Confirmation email failed:', err));
+      sendAppointmentAdminAlert({ name: form.name, email: form.email, phone: form.phone, date: form.date, time: form.time, gowns: gownList }).catch(err => console.error('Admin alert failed:', err));
+```
+
+Add the two imports from `'../lib/email'`.
+
+- [ ] **Step 3: Typecheck + manual verify**
+
+Run: `npm run lint`. Submit a booking in dev.
+Expected: no errors in UI without RESEND_API_KEY; console shows `[Riman] Email not configured` info only.
+
+- [ ] **Step 4: Commit**
+
+```bash
+git add src/lib/email.ts src/pages/AppointmentPage.tsx
+git commit -m "feat(email): appointment confirmation + admin alert (fire-and-forget)"
+```
+
+---
+
+### Task 7: WhatsApp handoff on success
+
+**Files:**
+- Create: `src/lib/whatsapp.ts`
+- Modify: `src/pages/AppointmentPage.tsx` (success branch, ~lines 92ΓÇô130)
+- Modify: `src/contexts/LanguageContext.tsx` (key `appointment.whatsapp_continue`)
+
+**Interfaces:**
+- Produces: `buildWhatsAppUrl(message: string): string` in `src/lib/whatsapp.ts`
+- Produces key: `appointment.whatsapp_continue`
+
+- [ ] **Step 1: Helper**
+
+```ts
+const WHATSAPP_NUMBER = '971553730792';
+
+export function buildWhatsAppUrl(message: string): string {
+  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
+}
+```
+
+- [ ] **Step 2: Key**
+
+English: `'appointment.whatsapp_continue': 'Continue on WhatsApp'`
+Arabic: `'appointment.whatsapp_continue': '╪¬╪º╪¿╪╣┘è┘å╪º ╪╣┘ä┘ë ┘ê╪º╪¬╪│╪º╪¿'`
+
+- [ ] **Step 3: Success view button**
+
+In the `if (isSubmitted)` success JSX, after the existing confirmation paragraph add:
+
+```tsx
+<a
+  href={buildWhatsAppUrl(
+    incomingGowns.length
+      ? `${t('appointment.booked')} ΓÇö ${form.name}, ${form.date} ${form.time}. ${t('appointment.your_gowns')}: ${gownNames.join(', ')}`
+      : `${t('appointment.booked')} ΓÇö ${form.name}, ${form.date} ${form.time}`
+  )}
+  target="_blank"
+  rel="noopener noreferrer"
+  className="btn-luxury-outline inline-block mt-4 px-10"
+>
+  {t('appointment.whatsapp_continue')}
+</a>
+```
+
+Import `buildWhatsAppUrl` from `'../lib/whatsapp'`.
+
+- [ ] **Step 4: Typecheck + manual verify**
+
+Run: `npm run lint`, submit a booking.
+Expected: success screen shows the button; link opens wa.me with encoded message including gown names.
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add src/lib/whatsapp.ts src/pages/AppointmentPage.tsx src/contexts/LanguageContext.tsx
+git commit -m "feat(booking): WhatsApp continue-handoff after viewing request"
+```
+
+---
+
+### Task 8: Nav promotion ΓÇö Selection over Bag
+
+**Files:**
+- Modify: `src/components/MobileBottomNav.tsx`
+- Modify: `src/components/Header.tsx:155-175` (icon cluster)
+
+**Interfaces:**
+- Consumes: `useWishlist().wishlist.length`, `useCart().totalItems`.
+
+- [ ] **Step 1: MobileBottomNav reorder + badges**
+
+Rewrite `navItems` (keep Home/Search/You entries unchanged otherwise):
+
+```ts
+  const { totalItems } = useCart();
+  const { wishlist } = useWishlist(); // add import from '../contexts/WishlistContext'
+  const navItems = [
+    { label: 'Home', path: '/', icon: Home },
+    { label: 'Search', path: '/search', icon: Search },
+    { label: 'Selection', path: '/wishlist', icon: Heart, badge: wishlist.length },
+    { label: 'Bag', path: '/checkout', icon: ShoppingBag, badge: totalItems },
+    { label: 'You', path: '/profile', icon: User },
+  ];
+```
+
+Badge rendering already handles any item with a numeric `badge`; the current code types items loosely enough ΓÇö if TypeScript complains about `badge` missing on some entries, give the array an explicit type: `{ label: string; path: string; icon: typeof Home; badge?: number }[]`.
+
+- [ ] **Step 2: Desktop header**
+
+In `Header.tsx` around line 161 the wishlist link exists. Give it a count badge and place it BEFORE the bag link in DOM order (both inside the icon cluster):
+
+```tsx
+<Link to="/wishlist" className="hidden lg:block relative hover:text-gold transition-colors" aria-label="Your Selection">
+  <Heart className="w-[18px] h-[18px]" />
+  {wishlistCount > 0 && (
+    <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full leading-none font-bold">{wishlistCount}</span>
+  </h2>
+  </Link>
+```
+
+(Copy the badge span markup exactly from the existing cart-icon badge in the same cluster; remove the stray `</h2>` typo if introduced ΓÇö the closing tag must be `</Link>`.) Wire `const { wishlist } = useWishlist();` and `const wishlistCount = wishlist.length;`. Match whatever icon component the current link uses.
+
+- [ ] **Step 3: Typecheck + manual verify**
+
+Run: `npm run lint`, save a gown, resize to mobile width.
+Expected: Selection tab shows count badge; header shows heart-with-badge left of bag.
+
+- [ ] **Step 4: Commit**
+
+```bash
+git add src/components/MobileBottomNav.tsx src/components/Header.tsx
+git commit -m "feat(nav): promote Your Selection, demote bag"
+```
+
+---
+
+### Task 9: Admin ΓÇö show requested gowns on booking cards
+
+**Files:**
+- Modify: `src/pages/admin/AdminAppointments.tsx:93-125` (card body)
+
+**Interfaces:**
+- Consumes: `Appointment.interested_gowns?: GownRef[] | null` (Task 1). Verify the admin fetch selects `*` (or add the column to its select list).
+
+- [ ] **Step 1: Render gown list**
+
+After the phone row (line 114) inside the card metadata block add:
+
+```tsx
+{(appt.interested_gowns?.length ?? 0) > 0 && (
+  <span className="flex items-start gap-1 col-span-full">
+    <Heart className="w-3 h-3 mt-0.5 shrink-0" />
+    <span className="italic">{appt.interested_gowns!.map(g => `${g.name}${g.size ? ` (${g.size})` : ''}`).join(' ┬╖ ')}</span>
+  </span>
+)}
+```
+
+Add `Heart` to the lucide-react import. If the grid parent constrains columns, `col-span-full` keeps it on its own row.
+
+- [ ] **Step 2: Typecheck + manual verify**
+
+Run: `npm run lint`. Open `/admin` ΓåÆ Appointments with a booking made in Task 4's manual test.
+Expected: gown names listed on the card.
+
+- [ ] **Step 3: Commit**
+
+```bash
+git add src/pages/admin/AdminAppointments.tsx
+git commit -m "feat(admin): display requested gowns on appointment cards"
+```
+
+---
+
+### Task 10: Bilingual leak fixes (audit P1s within scope)
+
+**Files:**
+- Modify: `src/pages/PaymentSuccess.tsx` (full `t()` routing)
+- Modify: `src/components/ProductCard.tsx:137,155` (quick-add strings)
+- Modify: `src/pages/Checkout.tsx:466` (summary "Name")
+
+**Interfaces:**
+- Produces keys: `payment.verifying`, `payment.success_title`, `payment.success_sub`, `payment.sent_to`, `payment.success_body`, `payment.dashboard`, `payment.error_title`, `payment.error_body`, `payment.contact`, `payment.home`, `product.select_size`, `product.cancel`, `checkout.name_label` (all EN + AR)
+
+- [ ] **Step 1: Keys**
+
+English:
+
+```ts
+    'payment.verifying': 'Verifying Payment',
+    'payment.please_wait': 'Please wait a moment...',
+    'payment.success_title': 'Payment Successful',
+    'payment.success_sub': 'Your investment has been received.',
+    'payment.sent_to': 'Confirmation sent to',
+    'payment.success_body': 'Our team will contact you within 24 hours to arrange fitting and delivery details.',
+    'payment.dashboard': 'View My Dashboard',
+    'payment.error_title': 'Payment Not Verified',
+    'payment.error_body': 'Please contact our atelier to confirm your order.',
+    'payment.contact': 'Contact Us',
+    'payment.home': 'Return Home',
+    'product.select_size': 'Select Size',
+    'product.cancel': 'Cancel',
+    'product.quick_shop': 'Quick Shop',
+    'checkout.name_label': 'Name',
+```
+
+Arabic:
+
+```ts
+    'payment.verifying': '╪¼╪º╪▒┘ì ╪¬╪ú┘â┘è╪» ╪º┘ä╪»┘ü╪╣',
+    'payment.please_wait': '╪º┘ä╪▒╪¼╪º╪í ╪º┘ä╪º┘å╪¬╪╕╪º╪▒ ┘é┘ä┘è┘ä╪º┘ï...',
+    'payment.success_title': '╪¬┘à ╪º┘ä╪»┘ü╪╣ ╪¿┘å╪¼╪º╪¡',
+    'payment.success_sub': '┘ä┘é╪» ╪º╪│╪¬┘ä┘à┘å╪º ╪╖┘ä╪¿┘â.',
+    'payment.sent_to': '╪¬┘à ╪Ñ╪▒╪│╪º┘ä ╪º┘ä╪¬╪ú┘â┘è╪» ╪Ñ┘ä┘ë',
+    'payment.success_body': '╪│┘è╪¬┘ê╪º╪╡┘ä ┘à╪╣┘â ┘ü╪▒┘è┘é┘å╪º ╪«┘ä╪º┘ä ┘ó┘ñ ╪│╪º╪╣╪⌐ ┘ä╪¬╪▒╪¬┘è╪¿ ╪º┘ä╪¬┘ü╪╡┘è┘ä ┘ê╪º┘ä╪¬┘ê╪╡┘è┘ä.',
+    'payment.dashboard': '┘ä┘ê╪¡╪⌐ ╪¡╪│╪º╪¿┘è',
+    'payment.error_title': '┘ä┘à ┘è╪¬┘à ╪¬╪ú┘â┘è╪» ╪º┘ä╪»┘ü╪╣',
+    'payment.error_body': '╪º┘ä╪▒╪¼╪º╪í ╪º┘ä╪¬┘ê╪º╪╡┘ä ┘à╪╣ ╪º┘ä╪»╪º╪▒ ┘ä╪¬╪ú┘â┘è╪» ╪╖┘ä╪¿┘â.',
+    'payment.contact': '╪¬┘ê╪º╪╡┘ä┘è ┘à╪╣┘å╪º',
+    'payment.home': '╪º┘ä╪╣┘ê╪»╪⌐ ┘ä┘ä╪▒╪ª┘è╪│┘è╪⌐',
+    'product.select_size': '╪º╪«╪¬╪º╪▒┘è ╪º┘ä┘à┘é╪º╪│',
+    'product.cancel': '╪Ñ┘ä╪║╪º╪í',
+    'product.quick_shop': '╪¬╪│┘ê┘é ╪│╪▒┘è╪╣',
+    'checkout.name_label': '╪º┘ä╪º╪│┘à',
+```
+
+- [ ] **Step 2: PaymentSuccess routing**
+
+Add `import { useLanguage } from '../contexts/LanguageContext';` and `const { t } = useLanguage();` inside the component. Replace every literal string: `"Verifying Payment"`ΓåÆ`{t('payment.verifying')}`, `"Please wait a moment..."`ΓåÆ`{t('payment.please_wait')}`, `"Payment Successful"`ΓåÆ`{t('payment.success_title')}`, `"Your investment has been received."`ΓåÆ`{t('payment.success_sub')}`, prefix `Confirmation sent to {email}`ΓåÆ`{t('payment.sent_to')} {email}`, the 24-hours paragraphΓåÆ`{t('payment.success_body')}`, `"View My Dashboard"`ΓåÆ`{t('payment.dashboard')}`, `"Payment Not Verified"`ΓåÆ`{t('payment.error_title')}`, contact-atelier paragraphΓåÆ`{t('payment.error_body')}`, `"Contact Us"`ΓåÆ`{t('payment.contact')}`, `"Return Home"`ΓåÆ`{t('payment.home')}`.
+
+- [ ] **Step 3: ProductCard quick-add + Checkout label**
+
+In `ProductCard.tsx` replace the literals `'Select Size'`/`'Cancel'`/`Quick Shop` (lines ~137,155) with `t('product.select_size')`, `t('product.cancel')`, `t('product.quick_shop')`. In `Checkout.tsx` line ~466 replace the summary label `"Name"` with `{t('checkout.name_label')}` (`t` already available via `useLanguage` there).
+
+- [ ] **Step 4: Typecheck + manual verify**
+
+Run: `npm run lint`, switch site to Arabic, open checkout summary and trigger the quick-add overlay on a product card.
+Expected: no English remnants in those surfaces.
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add src/pages/PaymentSuccess.tsx src/components/ProductCard.tsx src/pages/Checkout.tsx src/contexts/LanguageContext.tsx
+git commit -m "fix(i18n): route PaymentSuccess, quick-add, checkout label through translations"
+```
+
+---
+
+### Task 11: Playwright regression spec ΓÇö selection ΓåÆ viewing
+
+**Files:**
+- Create: `tests/selection-to-viewing.spec.js`
+
+**Interfaces:**
+- Consumes: running dev server (Playwright webServer config starts it), routes `/collection/all` (or any listing), `/product/:id`, `/appointment`, `/wishlist`.
+- Pattern reference: copy the app-mount wait (`waitForApp`) helper from `tests/helpers.js` if present, else from any existing spec.
+
+- [ ] **Step 1: Write the spec**
+
+```js
+import { test, expect } from '@playwright/test';
+
+async function waitForApp(page) {
+  await page.goto('/');
+  await page.waitForSelector('#root > *', { timeout: 45000 });
+}
+
+test.describe('Booking-first conversion', () => {
+  test('PDP reserve CTA prefills appointment', async ({ page }) => {
+    await waitForApp(page);
+    await page.goto('/collection/all');
+    await page.waitForSelector('#root > *');
+    const card = page.locator('a[href^="/product/"]').first();
+    await card.click();
+    await expect(page).toHaveURL(/\/product\//);
+
+    const reserve = page.getByRole('button', { name: /reserve a private viewing|╪º╪¡╪¼╪▓┘è ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐/i }).first();
+    await expect(reserve).toBeVisible();
+    await reserve.click();
+
+    await expect(page).toHaveURL(/\/appointment/);
+    await expect(page.locator('text=/your selected pieces|┘é╪╖╪╣┘â ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐/i')).toBeVisible();
+    await expect(page.locator('textarea, input[name="notes"]').first()).toHaveValue(/interested in:/i);
+  });
+
+  test('wishlist request CTA carries all saved gowns', async ({ page }) => {
+    await waitForApp(page);
+    await page.goto('/collection/all');
+    const cards = page.locator('a[href^="/product/"]');
+    await cards.nth(0).click();
+    const heart = page.getByRole('button', { name: /add to wishlist|╪ú╪╢┘ü/i }).first();
+    if (await heart.isVisible()) await heart.click();
+    await page.goBack();
+    await cards.nth(1).click();
+    const heart2 = page.getByRole('button', { name: /add to wishlist|╪ú╪╢┘ü/i }).first();
+    if (await heart2.isVisible()) await heart2.click();
+
+    await page.goto('/wishlist');
+    const req = page.getByRole('button', { name: /request private viewing|╪╖┘ä╪¿ ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐/i });
+    await expect(req).toBeVisible();
+    await req.click();
+    await expect(page).toHaveURL(/\/appointment/);
+    await expect(page.locator('text=/your selected pieces|┘é╪╖╪╣┘â ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐/i')).toBeVisible();
+  });
+
+  test('first visit defaults to Arabic RTL', async ({ page }) => {
+    await page.addInitScript(() => localStorage.removeItem('riman_lang'));
+    await waitForApp(page);
+    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
+  });
+});
+```
+
+Adjust selectors against reality while writing (aria-labels may differ); the assertions above are the contract.
+
+- [ ] **Step 2: Run the new spec**
+
+Run: `npx playwright test tests/selection-to-viewing.spec.js`
+Expected: 3 passed (fix selectors/code until green).
+
+- [ ] **Step 3: Full suite**
+
+Run: `npx playwright test`
+Expected: all pass including pre-existing suites; repair any click-verification specs broken by the new PDP button order (they may target the first `btn-luxury` button ΓÇö point them at the bag-secondary button by name `book rental|add to collection`).
+
+- [ ] **Step 4: Commit**
+
+```bash
+git add tests/selection-to-viewing.spec.js tests/
+git commit -m "test(e2e): selection-to-viewing conversion flow + RTL default"
+```
+
+---
+
+### Task 12: Ship ΓÇö verify, deploy, publish
+
+**Files:** none created; git + Netlify only.
+
+- [ ] **Step 1: Lint + production build**
+
+Run: `npm run lint && npm run build`
+Expected: clean; note the emitted `index-*.js` hash.
+
+- [ ] **Step 2: Deploy**
+
+Run: `& "C:\Users\KAIS\AppData\Local\Temp\opencode\netlify-rest-deploy.ps1"`
+Expected: `DEPLOY READY: ΓÇª -> https://riman-fashion-v2.netlify.app`
+
+- [ ] **Step 3: Verify live bundle**
+
+```powershell
+$html = Invoke-WebRequest -Uri "https://riman-fashion-v2.netlify.app/?cb=$(Get-Random)" -UseBasicParsing
+if ($html.Content -match 'index-<HASH>\.js') { 'LIVE OK' } else { 'STALE' }
+```
+
+Expected: `LIVE OK` (replace `<HASH>` with the hash from Step 1).
+
+- [ ] **Step 4: Apply DB migration**
+
+Follow `supabase/DEPLOY_RUNBOOK.md` to run `20260823100000_appointments_interested_gowns.sql` against project `vbuavhnpemnfsuguglqn` (SQL editor or CLI). Verify column exists in Table Editor ΓåÆ appointments.
+
+- [ ] **Step 5: Push**
+
+```bash
+git push origin salon-rebrand:main
+```
+
+Expected: push accepted.
+
+---
+
+## Self-Review Notes
+
+- Spec coverage: booking-first CTAs (T4), Selection bridge (T5), intakeΓåÆcalendar+email+WhatsApp (T1, T6, T7, T9), From-pricing (T3), Arabic default + leak fixes (T2, T10), nav promotion (T8), tests/rollout (T11, T12). Journal rebuild and typography ramp remain out of scope per spec.
+- Deviation documented: RequestViewingPanel implemented as prefilled `/appointment` navigation (Task 4 note) instead of a new modal component ΓÇö avoids duplicating the validated wizard form.
+- Type consistency: `GownRef` defined once (Task 1), consumed identically in Tasks 4/5/6/9; route-state contract `{ gowns: GownRef[] }` shared by Tasks 4/5/11.
diff --git a/docs/superpowers/plans/2026-08-23-perfect-polish.md b/docs/superpowers/plans/2026-08-23-perfect-polish.md
new file mode 100644
index 0000000..2339c41
--- /dev/null
+++ b/docs/superpowers/plans/2026-08-23-perfect-polish.md
@@ -0,0 +1,600 @@
+# Perfect-Polish Pass Implementation Plan
+
+> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
+
+**Goal:** Clear the remaining audit findings capping the site below 9/10 ΓÇö an 11px typography floor via semantic tokens, WCAG AA contrast on light surfaces, removal of the dead Journal/blog surface, and brand-doc alignment ΓÇö without losing the luxury uppercase aesthetic.
+
+**Architecture:** Tailwind v4 `@theme` tokens (`text-micro` 11px, `text-caption` 12px) replace all `text-[8..12px]` arbitrary values across 43 files, with matching RTL scale-up rules. Contrast fixes are applied per-element with light/dark-surface judgment rules. The `/blog` route, BlogPage, its nav/footer/seo links, and all orphaned `blog.*`/`journal.*` translation keys are deleted. DESIGN.md is rewritten to document the real shipped identity.
+
+**Tech Stack:** React 18 + TypeScript + Vite, Tailwind CSS v4 (`@theme` in src/index.css), Playwright (tests/*.spec.js), Netlify REST deploy.
+
+**Spec:** `docs/superpowers/specs/2026-08-23-perfect-polish-design.md`
+
+**Deviation from spec (documented):** Spec ┬º3.4 said to delete the Footer newsletter form. Code inspection shows it persists signups to `localStorage('riman_newsletter')` (Footer.tsx:60-61) ΓÇö it is working lead capture, not a dead-end. **The footer newsletter stays.** Only the BlogPage newsletter (deleted with the page) was truly dead.
+
+## Global Constraints
+
+- Token values are exact: `--text-micro: 11px`, `--text-caption: 12px`; RTL: `.text-micro` ΓåÆ 14px, `.text-caption` ΓåÆ 15px.
+- Migration table (no exceptions): `text-[8px]`ΓåÆ`text-micro`, `text-[9px]`ΓåÆ`text-micro`, `text-[10px]`ΓåÆ`text-micro`, `text-[11px]`ΓåÆ`text-micro`, `text-[12px]`ΓåÆ`text-caption`.
+- Contrast rules: on LIGHT surfaces (bg-ivory/bone/champagne/pearl/white/transparent-over-light) `text-stone-400`ΓåÆ`text-stone-600`, `text-stone-500`ΓåÆ`text-stone-600`, `text-stone-300`ΓåÆ`text-stone-500`, `placeholder:text-stone-500`ΓåÆ`placeholder:text-stone-600`. On DARK surfaces (bg-onyx, bg-stone-900/800, dark image overlays) leave stone-* unchanged. Gold (`text-gold*`) and `text-white/*` unchanged everywhere.
+- Uppercase + tracking aesthetic preserved ΓÇö only sizes and gray levels change, never casing, tracking, or font family.
+- `npm run lint` (tsc --noEmit) must pass after every task.
+- Commit messages exactly as specified per task; stage only listed files; leave `.superpowers/*` scratch unstaged.
+- The final push is BLOCKED until the production DB has `appointments.interested_gowns` (user is applying the SQL manually) ΓÇö see Task 7.
+
+---
+
+### Task 1: Typography tokens
+
+**Files:**
+- Modify: `src/index.css` (`@theme` block lines 4-38; RTL overrides lines 99-104)
+
+**Interfaces:**
+- Produces: Tailwind utilities `text-micro` and `text-caption` consumed by Tasks 3-5.
+
+- [ ] **Step 1: Add tokens to `@theme`**
+
+In `src/index.css`, inside the `@theme { ... }` block, immediately after the `--font-jewelry` line (line 11), add:
+
+```css
+  --text-micro: 11px;
+  --text-caption: 12px;
+```
+
+- [ ] **Step 2: Add RTL scale-up rules**
+
+In the same file, immediately AFTER the existing pixel-override block (after line 104, `[dir="rtl"] .text-\[12px\] { font-size: 15px; }`), add:
+
+```css
+  [dir="rtl"] .text-micro { font-size: 14px; }
+  [dir="rtl"] .text-caption { font-size: 15px; }
+```
+
+Do NOT delete the old `[dir="rtl"] .text-\[8px\]`-style overrides yet ΓÇö classes still reference them until Tasks 3-5 complete. Task 5 removes them.
+
+- [ ] **Step 3: Verify**
+
+Run: `npm run lint`
+Expected: clean.
+
+Run: `npm run build`
+Expected: build succeeds (tokens are valid Tailwind v4 theme entries).
+
+- [ ] **Step 4: Commit**
+
+```bash
+git add src/index.css
+git commit -m "feat(theme): add text-micro/text-caption type tokens with RTL scaling"
+```
+
+---
+
+### Task 2: Remove Journal/blog dead-end
+
+**Files:**
+- Delete: `src/pages/BlogPage.tsx`
+- Modify: `src/App.tsx` (import line 24, route line 206)
+- Modify: `src/components/Header.tsx` (nav entry line 17, dropdown entry line 258)
+- Modify: `src/components/Footer.tsx` (blog link line 127)
+- Modify: `src/lib/seo.ts` (`'/blog'` entry lines 53-56)
+- Modify: `src/contexts/LanguageContext.tsx` (orphaned keys, both dicts)
+- Modify: `tests/click-verification.spec.js` (route entry line 398, comment line 181)
+
+**Interfaces:**
+- Consumes: nothing.
+- Produces: BlogPage no longer exists, so Tasks 3-5 file lists exclude it.
+
+- [ ] **Step 1: Verify key consumers before deleting anything**
+
+Run (PowerShell):
+```powershell
+Get-ChildItem src -Recurse -Include *.tsx,*.ts | Select-String -Pattern "t\('blog\.|t\('journal\.|t\('nav\.blog'\)|t\('section\.journal'\)" | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
+```
+Expected: matches ONLY in `src\pages\BlogPage.tsx` (blog.* keys), `src\components\Header.tsx` (nav.blog key refs), `src\components\Footer.tsx` (nav.blog). If any OTHER file consumes these keys, STOP and report ΓÇö do not delete keys with live consumers.
+
+- [ ] **Step 2: Delete the page and its route**
+
+Delete `src/pages/BlogPage.tsx`.
+
+In `src/App.tsx` remove line 24:
+```tsx
+import BlogPage from './pages/BlogPage';
+```
+and remove the route (line 206):
+```tsx
+          <Route path="blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
+```
+
+- [ ] **Step 3: Remove nav entries**
+
+In `src/components/Header.tsx` remove line 17 from `navLinks`:
+```tsx
+  { label: "Journal", path: "/blog", key: 'nav.blog' },
+```
+and remove the dropdown entry near line 258:
+```tsx
+                      { label: 'Blog', path: '/blog', key: 'nav.blog' },
+```
+
+In `src/components/Footer.tsx` remove line 127:
+```tsx
+                <FooterLink to="/blog">{t('nav.blog')}</FooterLink>
+```
+
+- [ ] **Step 4: Remove SEO entry**
+
+In `src/lib/seo.ts` remove the `'/blog'` entry (lines 53-56):
+```ts
+  '/blog': {
+    title: 'Journal | Atelier Riman',
+    description: 'Explore the Atelier Riman journal ΓÇö bridal style guides, fashion insights, and the stories behind our collections.',
+  },
+```
+
+- [ ] **Step 5: Remove orphaned translation keys from BOTH dicts**
+
+In `src/contexts/LanguageContext.tsx`, from the EN dict remove: `'nav.blog'` (line 28), the `// Journal / Atelier` comment + all ten `'journal.*'` keys (lines 51-61), all `'blog.*'` keys (search `'blog.` ΓÇö includes `blog.title`, `blog.subtitle`, `blog.latest`, `blog.min_read`, `blog.read_editorial`, `blog.view_journal`, `blog.join_circle`, `blog.newsletter_desc`, `blog.email_placeholder`, `blog.subscribe`, `blog.article1_title`, `blog.article1_excerpt`, `blog.article1_category`, and the article2/article3 equivalents, ~lines 600-620), and `'section.journal'` (line 747).
+
+From the AR dict remove the exact same key set (search each key name: `'nav.blog'`, `'journal.*'` ~lines 785-795, `'blog.*'` ~lines 1335-1350 and the article keys, `'section.journal'` line 1481).
+
+Rule: delete a key from AR only if you deleted it from EN. Keep the two dicts' key sets identical.
+
+- [ ] **Step 6: Update tests**
+
+In `tests/click-verification.spec.js` remove line 398:
+```js
+    { path: '/blog', name: 'Blog' },
+```
+and update the comment at line 181 from:
+```js
+    // NOTE: Journal (/blog), Gallery (/gallery) and View All Products (/collection/all)
+```
+to (preserving whatever the rest of that comment sentence says, just dropping the Journal reference):
+```js
+    // NOTE: Gallery (/gallery) and View All Products (/collection/all)
+```
+
+- [ ] **Step 7: Verify**
+
+Run: `npm run lint`
+Expected: clean (no dangling imports/keys ΓÇö tsc won't catch missing dict keys, so also re-run the Step 1 grep and expect ZERO matches).
+
+- [ ] **Step 8: Commit**
+
+```bash
+git add -A src/App.tsx src/pages/BlogPage.tsx src/components/Header.tsx src/components/Footer.tsx src/lib/seo.ts src/contexts/LanguageContext.tsx tests/click-verification.spec.js
+git commit -m "feat(nav): remove Journal/blog dead-end surface and orphaned keys"
+```
+
+---
+
+### Task 3: Migrate components to tokens + contrast lift
+
+**Files (17):**
+- Modify: `src/components/AvailabilityCalendar.tsx`, `Footer.tsx`, `GalleryFilters.tsx`, `GalleryGrid.tsx`, `GalleryLightbox.tsx`, `GlobalFeatures.tsx`, `Header.tsx`, `ImmersiveUI.tsx`, `InstagramSection.tsx`, `MobileBottomNav.tsx`, `ProductCard.tsx`, `SizeGuide.tsx`, `ThreeDViewer.tsx`, `ToastContainer.tsx`, `luxury/HorizontalLookbook.tsx`, `luxury/Marquee.tsx`, `luxury/StatCounter.tsx`
+
+**Interfaces:**
+- Consumes: `text-micro` / `text-caption` utilities from Task 1.
+- Produces: zero `text-[8..12px]` occurrences in src/components/**.
+
+- [ ] **Step 1: Size migration**
+
+In each of the 17 files, apply the Global Constraints migration table to every occurrence:
+`text-[8px]`ΓåÆ`text-micro`, `text-[9px]`ΓåÆ`text-micro`, `text-[10px]`ΓåÆ`text-micro`, `text-[11px]`ΓåÆ`text-micro`, `text-[12px]`ΓåÆ`text-caption`.
+
+Change ONLY the size class ΓÇö leave tracking, casing, weight, and color classes untouched in this step.
+
+- [ ] **Step 2: Badge container fixes**
+
+Count badges must fit 11px digits. In `src/components/Header.tsx`, both badge spans (currently `absolute -top-1 -right-1 bg-gold text-white text-micro w-4 h-4 flex items-center justify-center font-bold shadow-sm` after Step 1) become:
+```tsx
+                <span className="absolute -top-1 -right-1 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center font-bold shadow-sm rounded-full leading-none">
+```
+(only the `w-4` ΓåÆ `min-w-4 px-0.5 rounded-full leading-none` portion changes; apply to BOTH the Selection and Bag badges).
+
+In `src/components/MobileBottomNav.tsx`, the badge span becomes:
+```tsx
+              <span className="absolute top-2 right-4 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full leading-none font-bold">
+```
+
+`ProductCard.tsx` badges are pills (`px-4 py-1.5`), not circles ΓÇö no container change needed there.
+
+- [ ] **Step 3: Contrast lift (components)**
+
+Apply the Global Constraints contrast rules in the same 17 files. Surface guide:
+- LIGHT-surface components (render on ivory/bone): AvailabilityCalendar, GalleryFilters, GlobalFeatures, Header (its dropdown panels are bg-white), ProductCard (info block), SizeGuide, ThreeDViewer, ToastContainer.
+- DARK-surface components (leave stone-* unchanged): Footer (bg-onyx), GalleryGrid/GalleryLightbox/ImmersiveUI/HorizontalLookbook/StatCounter/Marquee (text sits on images or dark overlays ΓÇö judge per element: `text-white`, `text-ivory`, `text-gold/60` on imagery stay; any `text-stone-400/500` that renders on a LIGHT background still lifts).
+- InstagramSection: mixed ΓÇö lift only stone-* text that sits on light surfaces.
+
+Also lift `placeholder:text-stone-500` ΓåÆ `placeholder:text-stone-600` wherever the input sits on a light surface (Footer's newsletter input is on bg-onyx ΓåÆ leave it).
+
+- [ ] **Step 4: Verify**
+
+Run (expect ZERO output lines):
+```powershell
+Get-ChildItem src/components -Recurse -Include *.tsx | Select-String -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
+```
+Run: `npm run lint`
+Expected: clean.
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add src/components
+git commit -m "a11y(components): 11px type floor + AA contrast on light surfaces"
+```
+
+---
+
+### Task 4: Migrate customer pages to tokens + contrast lift
+
+**Files (16):**
+- Modify: `src/App.tsx`, `src/pages/AboutPage.tsx`, `AlterationsPage.tsx`, `AppointmentPage.tsx`, `Auth.tsx`, `Checkout.tsx`, `CollectionPage.tsx`, `ContactPage.tsx`, `GalleryPage.tsx`, `Index.tsx`, `ProductDetail.tsx`, `ProfilePage.tsx`, `SearchPage.tsx`, `StyleQuiz.tsx`, `WeddingChecklist.tsx`, `WishlistPage.tsx`
+
+**Interfaces:**
+- Consumes: `text-micro` / `text-caption` from Task 1.
+- Produces: zero `text-[8..12px]` occurrences in src/pages/*.tsx (non-admin) and src/App.tsx.
+
+- [ ] **Step 1: Size migration**
+
+Apply the Global Constraints migration table to every occurrence in all 16 files. Size class only ΓÇö no color changes in this step.
+
+- [ ] **Step 2: Contrast lift (pages)**
+
+Apply the Global Constraints contrast rules. All 15 page files render on light ivory/bone sections except:
+- Dark sections to leave unchanged: any block inside `bg-onyx` / `bg-stone-900` / `bg-stone-800` wrappers, and text over dark hero imagery (e.g. Index.tsx hero overlays, WishlistPage empty-state if dark). Judge per element by its nearest background.
+- `App.tsx` line ~129 (`text-ivory/30` on dark footer-adjacent surface) ΓÇö leave.
+- Lift `placeholder:text-stone-500` ΓåÆ `placeholder:text-stone-600` on all light-surface inputs (AppointmentPage, ContactPage, Auth, Checkout, StyleQuiz, WeddingChecklist).
+
+- [ ] **Step 3: Verify**
+
+Run (expect ZERO output lines):
+```powershell
+Get-ChildItem src/pages -File -Filter *.tsx | Select-String -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
+Select-String -Path src/App.tsx -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
+```
+Run: `npm run lint`
+Expected: clean.
+
+- [ ] **Step 4: Commit**
+
+```bash
+git add src/App.tsx src/pages/AboutPage.tsx src/pages/AlterationsPage.tsx src/pages/AppointmentPage.tsx src/pages/Auth.tsx src/pages/Checkout.tsx src/pages/CollectionPage.tsx src/pages/ContactPage.tsx src/pages/GalleryPage.tsx src/pages/Index.tsx src/pages/ProductDetail.tsx src/pages/ProfilePage.tsx src/pages/SearchPage.tsx src/pages/StyleQuiz.tsx src/pages/WeddingChecklist.tsx src/pages/WishlistPage.tsx
+git commit -m "a11y(pages): 11px type floor + AA contrast on light surfaces"
+```
+
+---
+
+### Task 5: Migrate admin pages + remove dead RTL overrides
+
+**Files (11):**
+- Modify: `src/pages/admin/AdminAppointments.tsx`, `AdminCalendar.tsx`, `AdminContent.tsx`, `AdminDashboard.tsx`, `AdminGallery.tsx`, `AdminLayout.tsx`, `AdminOrders.tsx`, `AdminPlaceholder.tsx`, `AdminProducts.tsx`, `AdminSettings.tsx`
+- Modify: `src/index.css` (dead RTL overrides, lines 99-104)
+
+**Interfaces:**
+- Consumes: `text-micro` / `text-caption` from Task 1; requires Tasks 3-4 complete (so no `text-[8..12px]` classes remain anywhere).
+- Produces: zero `text-[8..12px]` occurrences in the entire src/ tree.
+
+- [ ] **Step 1: Size migration (admin)**
+
+Apply the Global Constraints migration table to every occurrence in the 10 admin files. Admin UI is light-surface throughout ΓÇö apply the contrast rules in the same pass (`text-stone-400/500` ΓåÆ `text-stone-600` on informative text; leave any sidebar/dark-header stone-* that sits on dark backgrounds, e.g. AdminLayout sidebar if dark ΓÇö judge per element).
+
+- [ ] **Step 2: Confirm the old pixel classes are extinct**
+
+Run (expect ZERO output lines):
+```powershell
+Get-ChildItem src -Recurse -Include *.tsx,*.ts | Select-String -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
+```
+If ANY match remains, migrate it now before proceeding.
+
+- [ ] **Step 3: Delete the dead RTL pixel overrides**
+
+In `src/index.css` delete these five rules (lines 99-104, now unreachable):
+```css
+  /* Pixel-based sizes: enlarge by ~25% */
+  [dir="rtl"] .text-\[8px\] { font-size: 11px; }
+  [dir="rtl"] .text-\[9px\] { font-size: 12px; }
+  [dir="rtl"] .text-\[10px\] { font-size: 13px; }
+  [dir="rtl"] .text-\[11px\] { font-size: 14px; }
+  [dir="rtl"] .text-\[12px\] { font-size: 15px; }
+```
+Keep the `[dir="rtl"] .text-micro` / `.text-caption` rules added in Task 1.
+
+- [ ] **Step 4: Verify**
+
+Run: `npm run lint && npm run build`
+Expected: clean.
+
+- [ ] **Step 5: Commit**
+
+```bash
+git add src/pages/admin src/index.css
+git commit -m "a11y(admin): 11px type floor + AA contrast; drop dead RTL pixel overrides"
+```
+
+---
+
+### Task 6: Rewrite DESIGN.md to the real brand
+
+**Files:**
+- Modify: `DESIGN.md` (full replacement)
+
+**Interfaces:**
+- Consumes: nothing. Independent of Tasks 1-5.
+
+- [ ] **Step 1: Replace DESIGN.md entirely with this content**
+
+````markdown
+---
+name: Atelier Riman
+description: Sharjah's premier luxury bridal and evening couture design system
+colors:
+  gold: "#A2492B"
+  gold-light: "#C45A3C"
+  gold-dark: "#7A3520"
+  onyx: "#161513"
+  bone: "#EFEAE2"
+  ivory: "#EFEAE2"
+  champagne: "#F6F0E6"
+  pearl: "#E8E3D9"
+typography:
+  display:
+    fontFamily: "Fraunces, serif"
+    fontWeight: 500
+    letterSpacing: "0.1em"
+    textTransform: "uppercase"
+  editorial:
+    fontFamily: "Newsreader, serif"
+    fontWeight: 400
+    fontStyle: "italic"
+  body:
+    fontFamily: "Newsreader, serif"
+    fontWeight: 400
+    lineHeight: 1.7
+  label:
+    fontFamily: "Archivo, sans-serif"
+    fontSize: "11px"
+    letterSpacing: "0.25em"
+    textTransform: "uppercase"
+  arabic:
+    fontFamily: "Cairo, IBM Plex Sans Arabic, sans-serif"
+    fontWeight: 500
+  arabicHeading:
+    fontFamily: "Amiri, serif"
+    fontWeight: 700
+rounded:
+  sm: "0"
+  md: "0"
+  lg: "0"
+spacing:
+  xs: "6px"
+  sm: "12px"
+  md: "24px"
+  lg: "48px"
+  xl: "80px"
+components:
+  button-primary:
+    backgroundColor: "{colors.onyx}"
+    textColor: "{colors.bone}"
+    padding: "20px 40px"
+    typography: "{typography.label}"
+    rounded: "{rounded.sm}"
+  button-primary-hover:
+    backgroundColor: "{colors.onyx}"
+    textColor: "{colors.gold}"
+    padding: "20px 40px"
+  button-secondary:
+    backgroundColor: "transparent"
+    textColor: "{colors.gold}"
+    borderColor: "{colors.gold}"
+    padding: "20px 40px"
+    rounded: "{rounded.sm}"
+  button-secondary-hover:
+    backgroundColor: "{colors.gold}"
+    textColor: "{colors.onyx}"
+---
+
+# Design System: Atelier Riman
+
+## 1. Overview
+
+**Creative North Star: "The Terracotta Atelier"**
+
+A warm, handcrafted sanctuary where heritage meets contemporary luxury. Atelier Riman's visual language is built on the interplay of deep warm dark, bone ivory, and a terracotta accent ΓÇö like a private fitting room bathed in candlelight. Every surface feels deliberate, tactile, and intimate. The system rejects mass-produced, fast-fashion aesthetics in favor of architectural precision softened by editorial elegance.
+
+The experience is consultative rather than transactional: booking-first, with private viewings, rentals, and WhatsApp handoff at its core. Arabic is the default language; English is fully supported. Typography carries the brand's regal voice through serif display headings with italic editorial accents. Motion is restrained but purposeful.
+
+**Key Characteristics:**
+- Warm layered depth through tonal surfaces, never harsh shadows
+- Terracotta as a restrained accent that signals luxury without excess
+- Serif typographic hierarchy with editorial italic flourishes
+- Intimate, tactile component interactions
+- Arabic-first (RTL default) with full English support
+
+## 2. Colors: The Terracotta Atelier Palette
+
+A warm, restrained palette centered on a single terracotta accent against deep and light tonal neutrals. The accent is never used casually ΓÇö its rarity on the screen is its power. All values below are the shipped `@theme` tokens in `src/index.css`.
+
+### Primary
+- **Gold** (#A2492B, terracotta): The signature accent, exposed as the `gold` token. Used for CTAs, badges, dividers, hover states, and editorial highlights. Never applied to body text or large background fills. Appears on roughly 5ΓÇô10% of any given screen.
+- **Gold-light** (#C45A3C) and **Gold-dark** (#7A3520): hover/gradient companions.
+
+### Neutral
+- **Onyx** (#161513): Primary dark surface ΓÇö hero overlays, dark sections, footer, primary button base. Warm-black, never pure #000.
+- **Bone / Ivory** (#EFEAE2): Default page background and alternating light sections. `ivory` aliases `bone`.
+- **Champagne** (#F6F0E6) and **Pearl** (#E8E3D9): Subtle secondary light surfaces.
+- **Stone scale**: Tailwind stone for text. Accessibility floor: informative text on light surfaces uses stone-600 or darker (WCAG AA at 11px); stone-400/500 are reserved for dark surfaces or purely decorative roles.
+
+### Named Rules
+
+**The Terracotta Rarity Rule.** The accent occupies Γëñ10% of any given screen. Its scarcity is its weight. Never use it as a large background fill or as body text.
+
+**The Warm-Black Rule.** Never use pure #000 or #fff. All dark surfaces are onyx (#161513); all light surfaces are bone (#EFEAE2) or warmer. The warmth is subtle but essential.
+
+## 3. Typography
+
+**Display Font:** Fraunces (serif) ΓÇö `font-heading`
+**Editorial Font:** Newsreader (serif, italic) ΓÇö `font-editorial`
+**Body Font:** Newsreader (serif) ΓÇö `font-body`
+**Label/UI Font:** Archivo (sans-serif) ΓÇö `font-label`
+**Arabic Body:** Cairo, IBM Plex Sans Arabic ΓÇö `font-arabic`
+**Arabic Headings:** Amiri ΓÇö `font-arabic-heading`
+
+**Character:** A dialogue between editorial warmth and architectural clarity. Fraunces provides the structure ΓÇö uppercase with wide tracking. Newsreader italic adds the ornament ΓÇö used sparingly for heritage, legacy, and poetic moments. Archivo handles labels and UI with quiet precision.
+
+### Hierarchy
+- **Display** (Fraunces 500, uppercase, wide tracking): Hero headlines and major section titles. Never italic.
+- **Editorial** (Newsreader italic, gold-dark): Accent phrases within headings. Always italic, never uppercase.
+- **Body** (Newsreader 400, 1.7): Paragraphs, descriptions. Max line length 70ch. Never uppercase.
+- **Label / Micro** (Archivo, `text-micro` = 11px, uppercase, 0.2ΓÇô0.3em tracking): Navigation, badges, metadata, form labels. 11px is the absolute size floor ΓÇö nothing renders smaller. `text-caption` (12px) is the secondary caption size.
+- **Arabic scaling:** RTL text renders ~25ΓÇô30% larger than its LTR counterpart (`text-micro` ΓåÆ 14px, `text-caption` ΓåÆ 15px, and the rem-scale overrides in index.css). Letter-spacing is forced to 0 in RTL.
+
+### Named Rules
+
+**The Uppercase Rule.** Display, headline, and label text is always uppercase. Editorial accents and body text are never uppercase.
+
+**The 11px Floor Rule.** No text renders below 11px (LTR) / 14px (RTL). Use the `text-micro` and `text-caption` tokens; never arbitrary pixel values.
+
+**The Editorial Rule.** Newsreader italic is reserved for single words or short phrases within headings. Never for body text or multiple consecutive lines.
+
+## 4. Elevation
+
+Warm layered ΓÇö depth is conveyed through tonal surface stacking rather than drop shadows. Dark sections sit against light sections with no shadow border; the contrast itself provides the separation. When overlays are needed (modals, quick view), a gentle backdrop blur is preferred over shadow.
+
+### Named Rules
+
+**The Flat-By-Default Rule.** Surfaces are flat at rest. Depth comes from tonal contrast and spacing, not from box-shadows. Shadows appear only as response to state (hover, focus) and are always accent-tinted.
+
+## 5. Components
+
+### Buttons
+- **Shape:** Sharp-edged (no border-radius). The absence of rounding reinforces architectural precision.
+- **Primary (btn-luxury):** Onyx background (#161513), bone text, Archivo 12px uppercase with 0.25em tracking, padding 20px 40px. On hover: text turns terracotta.
+- **Secondary (btn-luxury-outline):** Transparent background, terracotta border at 40% opacity, terracotta text. On hover: terracotta background, onyx text.
+- **Focus:** Visible 2px outline ring in terracotta with 2px offset.
+
+### Navigation (Header)
+- **Style:** Fixed top, full-width. Transparent at page top, transitions to bone with backdrop-blur and subtle bottom border on scroll.
+- **Links:** `text-micro` uppercase, wide tracking. On hover: terracotta accent. Count badges (Selection, Bag) are terracotta circles, `text-micro` bold, `min-w-4 h-4`.
+- **Mobile:** Bottom navigation bar (Home, Search, Selection, Bag, You) plus full-height sidebar overlay, spring-animated, with backdrop blur.
+
+### Product Cards
+- **Shape:** Sharp-edged image container, aspect ratio 3:4. No border-radius.
+- **Hover:** Image scales up, action buttons slide up from bottom.
+- **Badges:** Positioned top-left ΓÇö terracotta, onyx, or ivory backgrounds depending on badge type.
+- **Typography:** Category label (`text-micro`, uppercase, stone-600), product name (Fraunces, stone-900), price with "From" prefix (booking-first pricing honesty).
+
+### Inputs / Fields
+- **Style:** Borderless with a single bottom border (border-b) in stone-300. Transparent background.
+- **Focus:** Border transitions to terracotta. No other focus ornament.
+- **Labels:** `text-micro` uppercase, stone-600.
+- **Error:** red-500, `text-micro` uppercase below the field.
+
+### Footer
+- **Style:** Full-width onyx section with a terracotta shimmer accent line at the top border.
+- **Links:** stone-400/500 text (dark surface ΓÇö AA compliant on onyx), uppercase. On hover: terracotta with expanding underline.
+- **Newsletter:** Working lead capture persisting to localStorage.
+- **Social Icons:** Circular borders, stone-800. On hover: terracotta background and border, white icon.
+
+## 6. Do's and Don'ts
+
+### Do:
+- **Do** use terracotta as a restrained accent (Γëñ10% of any screen).
+- **Do** use onyx (#161513) for dark surfaces and bone (#EFEAE2) for light surfaces ΓÇö never pure black or white.
+- **Do** use Fraunces uppercase with wide tracking for display headings, Newsreader italic for editorial accents.
+- **Do** respect the 11px floor: `text-micro` / `text-caption` tokens only.
+- **Do** keep informative text on light surfaces at stone-600 or darker (WCAG AA).
+- **Do** use sharp edges (no border-radius) on buttons, cards, and containers.
+- **Do** support RTL-first layout with Cairo/Amiri at increased size and zero letter-spacing.
+
+### Don't:
+- **Don't** use the accent as a large background fill or as body text.
+- **Don't** use gradient text (`background-clip: text`) ΓÇö decorative, never meaningful.
+- **Don't** use pure #000 or #fff anywhere ΓÇö tint neutrals toward the brand warmth.
+- **Don't** use border-radius on buttons, cards, or containers.
+- **Don't** apply box-shadows as default surface treatment ΓÇö use tonal layering.
+- **Don't** render text below the 11px floor or use arbitrary `text-[Npx]` values.
+- **Don't** place stone-400/500 informative text on light surfaces ΓÇö it fails WCAG AA.
+- **Don't** use glassmorphism as default decorative treatment.
+- **Don't** create dead-end links ΓÇö every navigable element must resolve to a real destination.
+````
+
+- [ ] **Step 2: Verify no stale references remain**
+
+Run (expect ZERO output lines):
+```powershell
+Select-String -Path DESIGN.md -Pattern 'D4AF37|Plus Jakarta|Playfair|Inter,' | ForEach-Object { "$($_.LineNumber): $($_.Line)" }
+```
+
+- [ ] **Step 3: Commit**
+
+```bash
+git add DESIGN.md
+git commit -m "docs: align DESIGN.md with shipped terracotta/Fraunces identity"
+```
+
+---
+
+### Task 7: Verify + ship
+
+**Files:** none created; verification + git + Netlify only.
+
+**Interfaces:**
+- Consumes: all of Tasks 1-6 complete.
+- BLOCKER: the production DB migration `appointments.interested_gowns` must be applied (user pastes SQL manually) before Step 7's push.
+
+- [ ] **Step 1: Lint + production build**
+
+Run: `npm run lint && npm run build`
+Expected: clean; note the emitted `index-*.js` hash.
+
+- [ ] **Step 2: Extinction check**
+
+Run (expect ZERO output lines):
+```powershell
+Get-ChildItem src -Recurse -Include *.tsx,*.ts | Select-String -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
+```
+
+- [ ] **Step 3: Full Playwright suite**
+
+Start dev server (`npm run dev`, port 3001), run the full suite, kill the server.
+Expected: all tests pass (baseline 72 after the /blog route removal in Task 2 ΓÇö was 73).
+If failures appear, fix minimally and disclose; do not skip tests.
+
+- [ ] **Step 4: Deploy**
+
+Run: `& "C:\Users\KAIS\AppData\Local\Temp\opencode\netlify-rest-deploy.ps1"`
+Expected: `DEPLOY READY: ΓÇª -> https://riman-fashion-v2.netlify.app`
+
+- [ ] **Step 5: Verify live bundle**
+
+```powershell
+$html = Invoke-WebRequest -Uri "https://riman-fashion-v2.netlify.app/?cb=$(Get-Random)" -UseBasicParsing
+if ($html.Content -match 'index-<HASH>\.js') { 'LIVE OK' } else { 'STALE' }
+```
+(replace `<HASH>` with Step 1's hash). Expected: `LIVE OK`.
+
+- [ ] **Step 6: Verify DB migration landed**
+
+```powershell
+$url = (Select-String -Path .env -Pattern '^VITE_SUPABASE_URL=(.+)$').Matches[0].Groups[1].Value.Trim()
+$key = (Select-String -Path .env -Pattern '^VITE_SUPABASE_ANON_KEY=(.+)$').Matches[0].Groups[1].Value.Trim()
+try { Invoke-WebRequest -Uri "$url/rest/v1/appointments?select=interested_gowns&limit=1" -Headers @{ apikey = $key; Authorization = "Bearer $key" } -UseBasicParsing | Out-Null; 'COLUMN OK' } catch { $_.ErrorDetails.Message }
+```
+Expected: `COLUMN OK`. If a 42703 error returns, the user has not applied the SQL yet ΓÇö STOP and do not push; report and wait.
+
+- [ ] **Step 7: Push (only after Step 6 passes)**
+
+```bash
+git push origin salon-rebrand:main
+```
+Expected: push accepted (this publishes the booking-first branch AND the polish pass together).
+
+---
+
+## Self-Review Notes
+
+- Spec coverage: ┬º1 tokens ΓåÆ Tasks 1,3,4,5; ┬º2 contrast ΓåÆ Tasks 3,4,5; ┬º3 dead-ends ΓåÆ Task 2 (with documented footer-newsletter deviation); ┬º4 DESIGN.md ΓåÆ Task 6; ┬º5 verification/ship ΓåÆ Task 7; pending-DB dependency ΓåÆ Task 7 Step 6 gate.
+- Type consistency: `text-micro`/`text-caption` named identically in every task; RTL values (14px/15px) consistent between Task 1 and Task 6 docs.
+- Task 2 runs before Tasks 3-5 so BlogPage is never migrated then deleted.
+- Test baseline math: 73 tests ΓêÆ 1 (/blog route test) = 72 expected in Task 7 Step 3.
diff --git a/docs/superpowers/specs/2026-08-23-booking-first-conversion-design.md b/docs/superpowers/specs/2026-08-23-booking-first-conversion-design.md
new file mode 100644
index 0000000..4e5170b
--- /dev/null
+++ b/docs/superpowers/specs/2026-08-23-booking-first-conversion-design.md
@@ -0,0 +1,62 @@
+# Booking-First Conversion Model ΓÇö Atelier Riman
+
+Date: 2026-08-23
+Status: Approved (design sections confirmed by owner)
+
+## Problem
+
+The site's conversion spine is an e-commerce cart-to-checkout funnel with exact prices. The actual business is rental-led, appointment-only in spirit, and cannot quote exact prices (alterations, on-demand work). Most customers are Arabic speakers, yet the site defaults to English with Arabic as opt-in.
+
+## Goal
+
+Make "Reserve a Private Viewing" the primary conversion path while keeping online purchase functional but secondary. Bridge browsing to booking through a saved-gowns Selection that pre-fills the appointment request.
+
+## Decisions (owner-confirmed)
+
+1. Booking first, checkout secondary.
+2. "From" pricing (`From AED X`; rentals `From AED X ┬╖ 3 days`) ΓÇö never exact quotes.
+3. Arabic becomes the default language; English one tap away; choice remembered.
+4. Booking intake lands in the existing admin Appointments calendar + confirmation emails + WhatsApp handoff.
+
+## Customer Flow
+
+1. Collection cards: tap opens PDP (unchanged); card action saves gown to Selection ("Save").
+2. PDP primary CTA: "Reserve a Private Viewing" ΓÇö saves gown+size to Selection, opens request panel. Secondary CTA: "Add to Bag" (quieter).
+3. Selection drawer ("┘à╪«╪¬╪º╪▒╪º╪¬┘â / Your Selection"): saved gowns (thumbnail, name, size), count badge in header and mobile bottom nav; single primary CTA: Request Private Viewing. Empty state invites browsing.
+4. Request panel: name, phone, email, preferred date/time, note; saved gowns listed automatically. On submit:
+   - Creates appointment row incl. `interested_gowns`.
+   - Emails client confirmation + admin alert (fire-and-forget, no-op without RESEND_API_KEY).
+   - Success view shows "Continue on WhatsApp" deep link pre-filled with gowns, name, slot.
+   - On failure: panel state kept, retry shown, WhatsApp link always available. No dead ends.
+5. Pricing copy everywhere: "From AED X" (+ rental variant) and the line "Final quote confirmed at your consultation ΓÇö fitting and alterations included." Rental deposits disclosed within the request flow when rental gowns are selected.
+
+## Technical Design
+
+### Data
+- Migration: `appointments.interested_gowns jsonb` (nullable array of `{id, name, size, thumbnail, intent}`). Old rows unaffected.
+- Admin Appointments renders gown thumbnails inline per booking.
+
+### Components
+- `SelectionDrawer`: evolves existing wishlist drawer (renamed copy, gown metadata, single CTA).
+- `RequestViewingPanel`: wraps existing appointment form; injects selection; success hosts WhatsApp link (`wa.me/971553730792?text=ΓÇª` encoded).
+- `src/lib/email.ts`: add `sendAppointmentConfirmationEmail`, `sendAppointmentAdminAlert` using the existing lazy-client pattern.
+- Header / MobileBottomNav: promote Selection badge; demote bag icon.
+
+### i18n
+- Default language fallback `'en'` ΓåÆ `'ar'` in `LanguageContext.tsx:1415`.
+- New namespaces: `selection.*`, `request.*`, `pricing.from` (EN + AR complete).
+- Route PaymentSuccess, quick-add buttons, checkout summary labels through `t()`; dates via `toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-AE')`.
+
+### Error Handling
+- Submit failure keeps state + retry + WhatsApp alternative.
+- Email failures logged only, never block UI.
+- Empty-selection guard on the request CTA.
+
+### Testing & Rollout
+- New Playwright spec: save ΓåÆ drawer ΓåÆ request ΓåÆ success incl. WhatsApp link presence.
+- Update click-verification specs affected by label changes.
+- Full suite green before REST deploy; verify live bundle hash; commit/push.
+- TestSprite plan refresh deferred until after owner click-through.
+
+## Out of Scope
+- Removing checkout or Stripe readiness; Journal rebuild; broader audit fixes (typography ramp, brand-consistency tokens) ΓÇö separate workstream.
diff --git a/docs/superpowers/specs/2026-08-23-perfect-polish-design.md b/docs/superpowers/specs/2026-08-23-perfect-polish-design.md
new file mode 100644
index 0000000..ce99229
--- /dev/null
+++ b/docs/superpowers/specs/2026-08-23-perfect-polish-design.md
@@ -0,0 +1,158 @@
+# Perfect-Polish Pass ΓÇö Design Spec
+
+**Date:** 2026-08-23
+**Status:** Approved (approach A + 5-part design, "all above" scope)
+**Predecessor:** booking-first conversion (commits b664b48..0e0ea58)
+
+## Goal
+
+Clear the remaining audit findings that cap the site below 9/10:
+the P0 micro-typography/accessibility issues, brand-doc drift, and
+content dead-ends ΓÇö without losing the luxury uppercase aesthetic.
+
+Out of scope: Journal page build (decision: remove links), checkout
+review surface, state-color drift (no longer flagged after rebrand).
+
+## Background Facts
+
+- Tailwind **v4**: theme lives in `src/index.css` `@theme` block.
+  Custom font-size utilities are declared as `--text-*` tokens.
+- RTL overrides already exist: `[dir="rtl"] .text-\[8px\] { font-size: 11px }`
+  etc. (index.css:100-104). Arabic mode is already legible; **the P0 is
+  LTR/English rendering**. New tokens need matching RTL rules.
+- Brand colors in code: `--color-gold: #A2492B` (terracotta), fonts
+  Fraunces / Newsreader / Archivo / Cairo / Amiri. `DESIGN.md` still
+  documents a stale gold `#D4AF37` + Plus Jakarta/Playfair/Inter identity.
+- Journal: `BlogPage.tsx` served at `/blog`, linked from Header.tsx:17,
+  Header.tsx:258, Footer.tsx:127, App.tsx:24+206, seo.ts:53. Its buttons
+  navigate nowhere; its newsletter form has no backend. `journal.*`
+  translation keys are orphaned (no component consumes them).
+- Footer newsletter form (Footer.tsx ~85-98): validates email, shows
+  "submitted", persists nothing. Second dead-end.
+- Prior detector run: 408 findings ΓÇö 363├ù off-ramp font sizes, 24├ù color,
+  7├ù gray-on-color, 7├ù font, 4├ù radius, 2├ù bounce-easing, 1├ù overused-font.
+
+## Design
+
+### 1. Typography floor via semantic tokens
+
+Add to `@theme` in `src/index.css`:
+
+```css
+--text-micro: 11px;     /* eyebrow / label / metadata floor */
+--text-caption: 12px;   /* secondary caption text */
+```
+
+with RTL overrides following the existing +25-30% pattern:
+
+```css
+[dir="rtl"] .text-micro { font-size: 14px; }
+[dir="rtl"] .text-caption { font-size: 15px; }
+```
+
+Migration rules (all of src/, ~100+ instances across ~25 files):
+
+| Old | New |
+|---|---|
+| `text-[8px]` | `text-micro` |
+| `text-[9px]` | `text-micro` |
+| `text-[10px]` | `text-micro` |
+| `text-[11px]` | `text-micro` |
+| `text-[12px]` | `text-caption` |
+
+No exceptions. Count badges (Header, MobileBottomNav, ProductCard) move
+to `text-micro` too; their fixed `w-4 h-4` circles become
+`min-w-4 h-4 px-0.5` (or `w-5 h-5` where a 2-digit count must fit) so
+11px bold digits don't clip.
+
+The old `[dir="rtl"] .text-\[8px\]`-style overrides for 8/9/10/11/12px
+become dead code once no class uses them ΓÇö delete them in the same pass.
+
+### 2. Contrast lift (WCAG AA on light surfaces)
+
+Current failures: `stone-400` (#a8a29e) on bone (#EFEAE2) Γëê 2.3:1,
+`stone-500` (#78716c) Γëê 3.9:1 ΓÇö both below the 4.5:1 AA floor for
+11px text.
+
+Rules, applied per element with judgment (not blind find-replace):
+
+- **Informative text** on light backgrounds (form labels, metadata,
+  prices, descriptions, breadcrumbs, error hints): `stone-400`/`stone-500`
+  ΓåÆ `stone-600` (#57534e, Γëê 6.3:1 on bone).
+- **Decorative-only text** on light backgrounds (purely ornamental
+  eyebrows that duplicate a heading): `stone-400` ΓåÆ `stone-500` minimum.
+- **Text on dark surfaces** (onyx / stone-900 / stone-800 backgrounds,
+  e.g. Footer body, dark hero overlays): leave unchanged ΓÇö stone-400 on
+  stone-900 already passes (Γëê 6.7:1).
+- `text-stone-300` used as text on light surfaces ΓåÆ `stone-500`.
+- Gold (#A2492B) on bone Γëê 5:1 ΓÇö already passes; untouched.
+- `placeholder:text-stone-500` ΓåÆ `placeholder:text-stone-600` on light
+  inputs (placeholders must be readable).
+
+### 3. Dead-end removal (Journal + fake newsletter)
+
+Delete, in this order:
+
+1. `src/pages/BlogPage.tsx` (entire file).
+2. App.tsx: `BlogPage` import (line 24) and `<Route path="blog">` (line 206).
+3. Header.tsx: nav entry line 17 (`{ label: "Journal", path: "/blog" }`)
+   and dropdown entry line 258 (`{ label: 'Blog', path: '/blog' }`).
+4. Footer.tsx: `<FooterLink to="/blog">` (line 127) **and** the
+   newsletter form block (~lines 85-98) ΓÇö replace the newsletter area
+   with nothing (keep layout spacing intact); contact/WhatsApp links stay.
+5. seo.ts: the `'/blog'` entry (lines 53-56).
+6. LanguageContext.tsx: remove from **both** en and ar dicts ΓÇö
+   `nav.blog`, all `journal.*` keys (10 each), all `blog.*` keys,
+   `section.journal`. Verify zero remaining consumers first
+   (grep `t('blog.` / `t('journal.` / `t('nav.blog')` / `t('section.journal')`
+   must return only BlogPage + Footer + Header before deletion).
+7. Any Playwright spec asserting Journal/Blog/nav-blog elements ΓÇö
+   update or delete those assertions (check tests/*.spec.js).
+
+### 4. Brand documentation alignment
+
+Rewrite `DESIGN.md` to document the **actual** shipped identity:
+
+- Palette: terracotta `#A2492B` (primary "gold" token), light `#C45A3C`,
+  dark `#7A3520`, onyx `#161513`, bone/ivory `#EFEAE2`, champagne `#F6F0E6`,
+  pearl `#E8E3D9` ΓÇö copied from index.css `@theme`.
+- Typography: Fraunces (headings), Newsreader (editorial/body),
+  Archivo (labels/UI), Cairo + IBM Plex Sans Arabic (AR body),
+  Amiri (AR headings); the RTL +25-30% size scaling rule; the 11px
+  micro floor introduced by this spec.
+- Components: btn-luxury / btn-luxury-outline / heading-display /
+  heading-editorial definitions as implemented.
+- Delete every stale reference to `#D4AF37`, Plus Jakarta, Playfair, Inter.
+
+### 5. Verification & ship
+
+1. `npm run lint && npm run build` ΓÇö clean.
+2. Re-run the impeccable detector (`npx impeccable` or the same command
+   used on 2026-08-22) ΓÇö expect off-ramp font-size findings to drop from
+   363 to ~0 and gray-on-color from 7 to ~0. Record before/after counts.
+3. Full Playwright suite green (73 tests baseline; adjust for removed
+   Journal elements per ┬º3.7).
+4. Deploy via `C:\Users\KAIS\AppData\Local\Temp\opencode\netlify-rest-deploy.ps1`,
+   verify live bundle hash.
+5. Commit chain on `salon-rebrand`; push `origin salon-rebrand:main`
+   together with the still-pending booking-first push.
+
+## Pending External Dependency
+
+The booking-first DB migration (`appointments.interested_gowns`) is still
+unapplied in production; the user is pasting the SQL manually. The final
+push (┬º5.5) must not happen until that column is verified to exist
+(REST check: `GET /rest/v1/appointments?select=interested_gowns&limit=1`
+must not return 42703).
+
+## Risks
+
+- **Visual identity shift:** 8-10px ΓåÆ 11px is subtle but site-wide;
+  uppercase+tracking aesthetic is preserved. Mitigation: detector re-run
+  + visual spot-check of home/PDP/checkout/appointment pages.
+- **Wide mechanical migration** (~25 files): per-file commits and
+  per-task reviewer gates (SDD) keep regressions localized.
+- **Badge clipping** at 11px in 16px circles: container rule in ┬º1
+  handles it; Playwright visual pass confirms.
+- **Orphaned-key false positives:** ┬º3.6 requires a consumer grep before
+  deleting any translation key.
diff --git a/src/App.tsx b/src/App.tsx
index 378ae30..eaeeef8 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -19,11 +19,10 @@ import ProductDetail from './pages/ProductDetail';
 import AboutPage from './pages/AboutPage';
 import ContactPage from './pages/ContactPage';
 import SearchPage from './pages/SearchPage';
 import WishlistPage from './pages/WishlistPage';
 import ProfilePage from './pages/ProfilePage';
-import BlogPage from './pages/BlogPage';
 import FaqPage from './pages/FaqPage';
 import AlterationsPage from './pages/AlterationsPage';
 import PrivacyPage from './pages/PrivacyPage';
 import TermsPage from './pages/TermsPage';
 import Auth from './pages/Auth';
@@ -124,11 +123,11 @@ function MaintenanceGate({ children }: { children: React.ReactNode }) {
           <h1 className="font-heading text-4xl md:text-5xl text-gold uppercase tracking-widest mb-4">Atelier Riman</h1>
           <div className="w-16 h-px bg-gold mx-auto mb-8" />
           <p className="font-body text-ivory/60 text-sm tracking-widest uppercase mb-2">
             {settings.advanced.maintenanceMessage || 'We are currently updating our atelier.'}
           </p>
-          <p className="font-body text-ivory/30 text-[10px] tracking-widest uppercase mt-6">
+          <p className="font-body text-ivory/30 text-micro tracking-widest uppercase mt-6">
             Please check back soon.
           </p>
         </div>
       </div>
     );
@@ -201,11 +200,10 @@ function AnimatedRoutes() {
           <Route path="about" element={<PageWrapper><AboutPage /></PageWrapper>} />
           <Route path="contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
           <Route path="search" element={<PageWrapper><SearchPage /></PageWrapper>} />
           <Route path="wishlist" element={<PageWrapper><WishlistPage /></PageWrapper>} />
           <Route path="profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
-          <Route path="blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
           <Route path="faq" element={<PageWrapper><FaqPage /></PageWrapper>} />
           <Route path="alterations" element={<PageWrapper><AlterationsPage /></PageWrapper>} />
           <Route path="privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
           <Route path="terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
           <Route path="auth" element={<PageWrapper><Auth /></PageWrapper>} />
diff --git a/src/components/AvailabilityCalendar.tsx b/src/components/AvailabilityCalendar.tsx
index 8f1b70d..d2e7740 100644
--- a/src/components/AvailabilityCalendar.tsx
+++ b/src/components/AvailabilityCalendar.tsx
@@ -58,11 +58,11 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
   const renderDays = () => {
     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
     return (
       <div className="grid grid-cols-7 mb-2">
         {days.map(day => (
-          <div key={day} className="text-[8px] font-bold text-stone-400 uppercase tracking-widest text-center py-2">
+          <div key={day} className="text-micro font-bold text-stone-600 uppercase tracking-widest text-center py-2">
             {day}
           </div>
         ))}
       </div>
     );
@@ -90,14 +90,14 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
           return (
             <div
               key={i}
               onClick={() => !isBooked && !isPast && isCurrentMonth && onDateSelect?.(date)}
               className={cn(
-                "relative aspect-square flex flex-col items-center justify-center text-[10px] transition-all bg-ivory",
+                "relative aspect-square flex flex-col items-center justify-center text-micro transition-all bg-ivory",
                 loading && "opacity-50",
                 !isCurrentMonth && "text-stone-200",
-                (isBooked || isPast) && isCurrentMonth && "bg-stone-50 text-stone-300 cursor-not-allowed",
+                (isBooked || isPast) && isCurrentMonth && "bg-stone-50 text-stone-500 cursor-not-allowed",
                 isCurrentMonth && !isBooked && !isPast && "hover:bg-ivory cursor-pointer text-stone-700",
                 isSelected && "bg-gold text-white hover:bg-gold-dark"
               )}
             >
               <span>{format(date, 'd')}</span>
@@ -117,15 +117,15 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
       {renderDays()}
       {renderCells()}
       <div className="mt-6 flex flex-wrap gap-4 justify-center">
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-gold rounded-full" />
-          <span className="text-[8px] uppercase tracking-widest text-stone-400">Available</span>
+          <span className="text-micro uppercase tracking-widest text-stone-600">Available</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-stone-100 rounded-full" />
-          <span className="text-[8px] uppercase tracking-widest text-stone-400">Booked</span>
+          <span className="text-micro uppercase tracking-widest text-stone-600">Booked</span>
         </div>
       </div>
     </div>
   );
 }
\ No newline at end of file
diff --git a/src/components/Footer.tsx b/src/components/Footer.tsx
index 6bbab97..d79f16b 100644
--- a/src/components/Footer.tsx
+++ b/src/components/Footer.tsx
@@ -91,13 +91,13 @@ export default function Footer() {
                 type="email" 
                 placeholder={t('footer.newsletter_placeholder')}
                 className="w-full bg-transparent border-b border-stone-800 focus:border-gold py-3 md:py-4 pr-12 text-sm font-body tracking-[0.15em] outline-none transition-all placeholder:text-stone-700"
               />
               <button type="submit" className="absolute right-0 bottom-3 md:bottom-4 text-gold hover:translate-x-1 transition-transform">
-                {isSubmitSuccessful ? <span className="text-[10px] tracking-widest">{t('footer.submitted')}</span> : <ArrowRight className="w-5 h-5" />}
+                {isSubmitSuccessful ? <span className="text-micro tracking-widest">{t('footer.submitted')}</span> : <ArrowRight className="w-5 h-5" />}
               </button>
-              {errors.email && <p className="absolute top-full mt-2 text-red-500 text-[10px] uppercase tracking-widest">{errors.email.message}</p>}
+              {errors.email && <p className="absolute top-full mt-2 text-red-500 text-micro uppercase tracking-widest">{errors.email.message}</p>}
             </form>
           </div>
         </div>
 
         {/* Mobile: Collapsible Sections / Desktop: Grid */}
@@ -122,11 +122,10 @@ export default function Footer() {
             <CollapsibleSection title={t('footer.collections')} defaultOpen={false}>
               <ul className="space-y-3 pb-6 md:pb-0 md:mt-6 flex flex-col items-center md:items-start">
                 <FooterLink to="/collection/bridal">{t('nav.bridal')}</FooterLink>
                 <FooterLink to="/collection/evening">{t('nav.evening')}</FooterLink>
                 <FooterLink to="/collection/rental">{t('nav.rentals')}</FooterLink>
-                <FooterLink to="/blog">{t('nav.blog')}</FooterLink>
                 <FooterLink to="/gallery">{t('nav.gallery')}</FooterLink>
               </ul>
             </CollapsibleSection>
           </div>
 
@@ -180,16 +179,16 @@ export default function Footer() {
           </button>
         </div>
 
         {/* Bottom Bar */}
         <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
-          <p className="font-body text-[10px] text-stone-600 uppercase tracking-[0.2em] text-center md:text-left">
+          <p className="font-body text-micro text-stone-600 uppercase tracking-[0.2em] text-center md:text-left">
             ┬⌐ {new Date().getFullYear()} ATELIER RIMAN. {t('footer.rights')}
           </p>
           <div className="flex gap-6">
-            <Link to="/privacy" className="font-body text-[10px] text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.privacy')}</Link>
-            <Link to="/terms" className="font-body text-[10px] text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.legal')}</Link>
+            <Link to="/privacy" className="font-body text-micro text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.privacy')}</Link>
+            <Link to="/terms" className="font-body text-micro text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.legal')}</Link>
           </div>
         </div>
       </div>
     </footer>
   );
diff --git a/src/components/GalleryFilters.tsx b/src/components/GalleryFilters.tsx
index cc86718..3266fa1 100644
--- a/src/components/GalleryFilters.tsx
+++ b/src/components/GalleryFilters.tsx
@@ -24,11 +24,11 @@ export default function GalleryFilters({ activeCategory, onCategoryChange, class
       {CATEGORIES.map((cat) => (
         <button
           key={cat.key}
           onClick={() => onCategoryChange(cat.key)}
           className={cn(
-            'relative px-5 py-2 text-[10px] tracking-[0.3em] uppercase font-bold transition-all duration-300 border overflow-hidden',
+            'relative px-5 py-2 text-micro tracking-[0.3em] uppercase font-bold transition-all duration-300 border overflow-hidden',
             activeCategory === cat.key
               ? 'bg-gold text-onyx border-gold'
               : 'border-stone-200 text-stone-600 hover:border-gold hover:text-gold'
           )}
         >
diff --git a/src/components/GalleryGrid.tsx b/src/components/GalleryGrid.tsx
index 5077fc9..0592a2d 100644
--- a/src/components/GalleryGrid.tsx
+++ b/src/components/GalleryGrid.tsx
@@ -68,11 +68,11 @@ function GalleryVideoItem({ item, onClick, index }: { item: GalleryItem; onClick
         className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
       />
       <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-colors duration-300" />
       <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <Play className="w-4 h-4 text-white fill-white" />
-        <span className="text-white text-[10px] tracking-widest uppercase font-bold">{item.title}</span>
+        <span className="text-white text-micro tracking-widest uppercase font-bold">{item.title}</span>
       </div>
     </motion.div>
   );
 }
 
@@ -93,11 +93,11 @@ function GalleryPhotoItem({ item, onClick, index }: { item: GalleryItem; onClick
         className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
       />
       <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-colors duration-300" />
       <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <ImageIcon className="w-4 h-4 text-white" />
-        <span className="text-white text-[10px] tracking-widest uppercase font-bold">{item.title}</span>
+        <span className="text-white text-micro tracking-widest uppercase font-bold">{item.title}</span>
       </div>
     </motion.div>
   );
 }
 
diff --git a/src/components/GalleryLightbox.tsx b/src/components/GalleryLightbox.tsx
index d60d794..27e5128 100644
--- a/src/components/GalleryLightbox.tsx
+++ b/src/components/GalleryLightbox.tsx
@@ -138,11 +138,11 @@ export default function GalleryLightbox({ items, currentIndex, isOpen, onClose,
           {/* Caption */}
           <div className="absolute bottom-6 left-0 right-0 text-center z-[1001]">
             <h3 className="text-white font-heading text-lg tracking-widest uppercase mb-1">
               {currentItem.title}
             </h3>
-            <p className="text-gold text-[10px] tracking-[0.3em] uppercase">
+            <p className="text-gold text-micro tracking-[0.3em] uppercase">
               {currentItem.category.replace('_', ' ')}
             </p>
           </div>
         </motion.div>
       )}
diff --git a/src/components/GlobalFeatures.tsx b/src/components/GlobalFeatures.tsx
index 6c117d8..241a37c 100644
--- a/src/components/GlobalFeatures.tsx
+++ b/src/components/GlobalFeatures.tsx
@@ -66,22 +66,22 @@ export default function GlobalFeatures() {
             <div className="bg-ivory max-w-lg w-full p-10 relative overflow-hidden border border-stone-200"
                  role="dialog"
                  aria-modal="true">
               <button 
                 onClick={handleDismissNewsletter}
-                className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors"
+                className="absolute top-4 right-4 text-stone-600 hover:text-stone-800 transition-colors"
                 aria-label="Close"
               >
                 <X className="w-5 h-5" />
               </button>
               
               <div className="text-center">
                 <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                   <Mail className="w-8 h-8" />
                 </div>
                 <h3 className="font-heading text-3xl text-stone-800 mb-4 tracking-wider uppercase">The Atelier Circle</h3>
-                <p className="text-stone-500 text-sm mb-8 leading-relaxed italic">Join for exclusive previews of our new bridal collections and private viewings in Sharjah.</p>
+                <p className="text-stone-600 text-sm mb-8 leading-relaxed italic">Join for exclusive previews of our new bridal collections and private viewings in Sharjah.</p>
                 
                 <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleDismissNewsletter(); }}>
                   <input 
                     type="email" 
                     placeholder="E-mail Address" 
@@ -105,17 +105,17 @@ export default function GlobalFeatures() {
             exit={{ y: 100 }}
             className="fixed bottom-0 left-0 w-full z-[150] bg-ivory border-t border-stone-200 p-6 md:p-8"
           >
             <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="text-center md:text-left">
-                <p className="text-[10px] tracking-widest uppercase text-stone-500 mb-1">Privacy & Elegance</p>
+                <p className="text-micro tracking-widest uppercase text-stone-600 mb-1">Privacy & Elegance</p>
                 <p className="text-xs text-stone-800 tracking-wide">We use cookies to curate a personalized atelier experience. <Link to="/privacy" className="underline hover:text-gold">Learn details</Link>.</p>
               </div>
               <div className="flex gap-4">
                 <button 
                   onClick={handleAcceptCookies}
-                  className="px-8 py-3 bg-stone-900 text-white text-[10px] tracking-[0.2em] uppercase hover:bg-stone-800 transition-all font-bold"
+                  className="px-8 py-3 bg-stone-900 text-white text-micro tracking-[0.2em] uppercase hover:bg-stone-800 transition-all font-bold"
                 >
                   Accept & Explore
                 </button>
               </div>
             </div>
diff --git a/src/components/Header.tsx b/src/components/Header.tsx
index ce8491b..99cd957 100644
--- a/src/components/Header.tsx
+++ b/src/components/Header.tsx
@@ -3,26 +3,28 @@ import { Link, useLocation } from 'react-router-dom';
 import { Search, Heart, User, ShoppingBag, Menu, X, Globe, Sparkles, ChevronRight, Calendar, Scissors, HelpCircle, Phone } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { cn } from '../lib/utils';
 import { useLanguage } from '../contexts/LanguageContext';
 import { useCart } from '../contexts/CartContext';
+import { useWishlist } from '../contexts/WishlistContext';
 import { useScrollLock } from '../hooks/useScrollLock';
 import Logo from './Logo';
 
 const navLinks = [
   { label: "Our Story", path: "/about", key: 'nav.about' },
   { label: "Bridal", path: "/collection/bridal", key: 'nav.bridal' },
   { label: "Evening", path: "/collection/evening", key: 'nav.evening' },
   { label: "Rentals", path: "/collection/rental", key: 'nav.rentals' },
-  { label: "Journal", path: "/blog", key: 'nav.blog' },
   { label: "Contact", path: "/contact", key: 'nav.contact' },
   { label: "Private Viewing", path: "/appointment", key: 'nav.private_viewing' },
 ];
 
 export default function Header() {
   const { language, setLanguage, t, isRtl } = useLanguage();
   const { totalItems } = useCart();
+  const { wishlist } = useWishlist();
+  const wishlistCount = wishlist.length;
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
 
   const location = useLocation();
   const isHome = location.pathname === '/';
@@ -125,11 +127,11 @@ export default function Header() {
                 className={cn("transition-all duration-700", !isHome ? "w-10" : "w-14")}
                 showText={false}
               />
               <span className={cn(
                 "text-xs tracking-[0.5em] uppercase mt-2 transition-all duration-700 font-heading font-bold",
-                (!isHome) ? "text-stone-500 opacity-100" : "text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
+                (!isHome) ? "text-stone-600 opacity-100" : "text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
               )}>
                 {isHome ? 'Atelier' : 'Riman'}
               </span>
             </Link>
           </motion.div>
@@ -156,20 +158,25 @@ export default function Header() {
 
           <div className="flex items-center gap-3 md:gap-4">
             <Link to="/style-quiz" className="hover:text-gold transition-colors" aria-label="Style Quiz">
               <Sparkles className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
             </Link>
-            <Link to="/wishlist" className="hidden lg:block hover:text-gold transition-colors" aria-label="Wishlist">
-              <Heart className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
+            <Link to="/wishlist" className="hidden lg:block relative group/wishlist hover:text-gold transition-colors" aria-label="Your Selection">
+              <Heart className={cn("w-6 h-6 transition-transform group-hover/wishlist:scale-110", (!isHome) ? "text-stone-800" : "text-white")} />
+              {wishlistCount > 0 && (
+                <span className="absolute -top-1 -right-1 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center font-bold shadow-sm rounded-full leading-none">
+                  {wishlistCount}
+                </span>
+              )}
             </Link>
             <Link to="/profile" className="hidden md:block hover:text-gold transition-colors" aria-label="Account">
               <User className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
             </Link>
             <Link to="/checkout" className="hidden md:block relative group/cart">
               <ShoppingBag className={cn("w-6 h-6 transition-transform group-hover/cart:scale-110", (!isHome) ? "text-stone-800" : "text-white")} />
               {totalItems > 0 && (
-                <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold shadow-sm">
+                <span className="absolute -top-1 -right-1 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center font-bold shadow-sm rounded-full leading-none">
                   {totalItems}
                 </span>
               )}
             </Link>
           </div>
@@ -213,11 +220,11 @@ export default function Header() {
               <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
 
                <div className="flex-1 overflow-y-auto px-5 py-6">
                 {/* Primary Navigation */}
                 <div className="mb-5">
-                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.collections')}</p>
+                  <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.collections')}</p>
                   <nav className="flex flex-col gap-1">
                     {[
                       { label: 'Bridal', path: '/collection/bridal', key: 'nav.bridal' },
                       { label: 'Evening', path: '/collection/evening', key: 'nav.evening' },
                       { label: 'Rentals', path: '/collection/rental', key: 'nav.rentals' },
@@ -232,24 +239,23 @@ export default function Header() {
                           to={link.path}
                           onClick={() => setIsMenuOpen(false)}
                           className="group flex items-center justify-between font-heading text-xs tracking-wide text-stone-800 py-2.5 px-3 border border-stone-100 hover:border-gold hover:bg-gold/5 transition-all"
                         >
                           <span>{link.key ? t(link.key) : link.label}</span>
-                          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-gold transition-colors" />
+                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold transition-colors" />
                         </Link>
                       </motion.div>
                     ))}
                   </nav>
                 </div>
 
                 {/* Atelier Links */}
                 <div className="mb-5">
-                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.atelier')}</p>
+                  <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.atelier')}</p>
                   <nav className="flex flex-col gap-1">
                     {[
                       { label: 'Our Story', path: '/about', key: 'nav.about' },
-                      { label: 'Blog', path: '/blog', key: 'nav.blog' },
                       { label: 'Gallery', path: '/gallery', key: 'nav.gallery' },
                       { label: 'Style Quiz', path: '/style-quiz', key: 'nav.style_quiz', icon: Sparkles },
                     ].map((link, idx) => (
                       <motion.div
                         key={link.path}
@@ -264,20 +270,20 @@ export default function Header() {
                         >
                           <span className="flex items-center gap-2">
                             {link.icon && <link.icon className="w-3.5 h-3.5 text-gold" />}
                             {link.key ? t(link.key) : link.label}
                           </span>
-                          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-gold transition-colors" />
+                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold transition-colors" />
                         </Link>
                       </motion.div>
                     ))}
                   </nav>
                 </div>
 
                 {/* Services */}
                 <div className="mb-5">
-                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.services')}</p>
+                  <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.services')}</p>
                   <nav className="flex flex-col gap-1">
                     {[
                       { label: 'Book Appointment', path: '/appointment', key: 'nav.appointment', icon: Calendar },
                       { label: 'Alterations', path: '/alterations', key: 'nav.alterations', icon: Scissors },
                       { label: 'FAQ', path: '/faq', key: 'nav.faq', icon: HelpCircle },
@@ -296,11 +302,11 @@ export default function Header() {
                         >
                           <span className="flex items-center gap-2">
                             {link.icon && <link.icon className="w-3.5 h-3.5 text-gold" />}
                             {link.key ? t(link.key) : link.label}
                           </span>
-                          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-gold transition-colors" />
+                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold transition-colors" />
                         </Link>
                       </motion.div>
                     ))}
                   </nav>
                 </div>
@@ -314,11 +320,11 @@ export default function Header() {
                   {t('cta.appointment')}
                 </Link>
               </div>
 
               <div className="p-4 mt-auto bg-ivory border-t border-stone-100">
-                <span className="text-[9px] tracking-widest uppercase text-stone-400 block text-center">{t('header.tagline')}</span>
+                <span className="text-micro tracking-widest uppercase text-stone-600 block text-center">{t('header.tagline')}</span>
               </div>
             </motion.div>
           </>
         )}
       </AnimatePresence>
diff --git a/src/components/ImmersiveUI.tsx b/src/components/ImmersiveUI.tsx
index 4a0bb07..b3ea02a 100644
--- a/src/components/ImmersiveUI.tsx
+++ b/src/components/ImmersiveUI.tsx
@@ -132,11 +132,11 @@ export default function ImmersiveUI() {
                     {letter}
                   </motion.span>
                 ))}
               </h1>
             </div>
-            <div className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.35em] text-gold/60">
+            <div className="absolute bottom-8 left-8 text-micro uppercase tracking-[0.35em] text-gold/60">
               Maison de Couture
             </div>
             <div className="absolute bottom-8 right-8 text-sm tabular-nums text-ivory">
               {String(count).padStart(2, '0')}<span className="text-ivory/40"> / 100</span>
             </div>
diff --git a/src/components/InstagramSection.tsx b/src/components/InstagramSection.tsx
index eba891c..32ceef7 100644
--- a/src/components/InstagramSection.tsx
+++ b/src/components/InstagramSection.tsx
@@ -17,22 +17,22 @@ export default function InstagramSection() {
   return (
     <section className="py-32 bg-ivory overflow-hidden">
       <div className="container mx-auto px-6 mb-16 text-center">
         <div className="flex items-center justify-center gap-3 text-gold mb-4">
            <Instagram className="w-5 h-5" />
-           <span className="text-[12px] tracking-[0.4em] uppercase font-bold">@rimanfashion</span>
+           <span className="text-caption tracking-[0.4em] uppercase font-bold">@rimanfashion</span>
         </div>
         <h2 className="heading-display text-4xl md:text-6xl text-stone-900 tracking-tight">{t('instagram.title')}</h2>
         <div className="flex justify-center mt-10">
           <a 
             href="https://www.instagram.com/rimanfashion/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="group flex items-center gap-3 px-10 py-4 bg-onyx text-white hover:text-gold transition-all duration-500"
           >
             <Instagram className="w-4 h-4" />
-            <span className="text-[10px] tracking-[0.3em] uppercase font-bold transition-colors">
+            <span className="text-micro tracking-[0.3em] uppercase font-bold transition-colors">
               {t('instagram.follow')}
             </span>
           </a>
         </div>
         <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent mx-auto mt-12" />
@@ -59,11 +59,11 @@ export default function InstagramSection() {
                 alt={`Riman Fashion gallery ${idx + 1}`} 
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Instagram className="text-white w-8 h-8" />
-                 <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">{t('instagram.view_aura')}</span>
+                 <span className="text-micro text-white uppercase tracking-[0.2em] font-bold">{t('instagram.view_aura')}</span>
               </div>
             </a>
           ))}
         </motion.div>
       </div>
diff --git a/src/components/MobileBottomNav.tsx b/src/components/MobileBottomNav.tsx
index 19bcb5e..435f077 100644
--- a/src/components/MobileBottomNav.tsx
+++ b/src/components/MobileBottomNav.tsx
@@ -1,19 +1,21 @@
 import { Link, useLocation } from 'react-router-dom';
 import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react';
 import { cn } from '../lib/utils';
 import { useCart } from '../contexts/CartContext';
+import { useWishlist } from '../contexts/WishlistContext';
 
 export default function MobileBottomNav() {
   const location = useLocation();
   const { totalItems } = useCart();
+  const { wishlist } = useWishlist();
 
   const navItems = [
     { label: 'Home', path: '/', icon: Home },
     { label: 'Search', path: '/search', icon: Search },
-    { label: 'Wishlist', path: '/wishlist', icon: Heart },
-    { label: 'Cart', path: '/checkout', icon: ShoppingBag, badge: totalItems },
+    { label: 'Selection', path: '/wishlist', icon: Heart, badge: wishlist.length },
+    { label: 'Bag', path: '/checkout', icon: ShoppingBag, badge: totalItems },
     { label: 'You', path: '/profile', icon: User },
   ];
 
   return (
     <nav className="fixed bottom-0 left-0 w-full bg-ivory border-t border-stone-100 z-[100] grid grid-cols-5 md:hidden h-16 safe-area-bottom">
@@ -24,17 +26,17 @@ export default function MobileBottomNav() {
           <Link 
             key={item.path} 
             to={item.path}
             className={cn(
               "flex flex-col items-center justify-center gap-1 transition-colors relative",
-              isActive ? "text-gold" : "text-stone-400"
+              isActive ? "text-gold" : "text-stone-600"
             )}
           >
             <Icon className="w-5 h-5" />
-            <span className="text-[10px] uppercase tracking-tighter font-black">{item.label}</span>
+            <span className="text-micro uppercase tracking-tighter font-black">{item.label}</span>
             {item.badge !== undefined && item.badge > 0 && (
-              <span className="absolute top-2 right-4 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full leading-none font-bold">
+              <span className="absolute top-2 right-4 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full leading-none font-bold">
                 {item.badge}
               </span>
             )}
           </Link>
         );
diff --git a/src/components/ProductCard.tsx b/src/components/ProductCard.tsx
index 20e39ee..e52c132 100644
--- a/src/components/ProductCard.tsx
+++ b/src/components/ProductCard.tsx
@@ -99,21 +99,21 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
         </Link>
         
         {/* Badges ΓÇö above link, pointer-events-none so clicks pass through */}
         <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
           {product.isNew && (
-            <span className="bg-gold text-white text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 font-bold">
+            <span className="bg-gold text-white text-micro tracking-[0.3em] uppercase px-4 py-1.5 font-bold">
               {t('badge.new')}
             </span>
           )}
           {product.isFeatured && (
-            <span className="bg-onyx text-white text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 font-bold">
+            <span className="bg-onyx text-white text-micro tracking-[0.3em] uppercase px-4 py-1.5 font-bold">
               {t('badge.featured')}
             </span>
           )}
           {product.glbUrl && (
-            <span className="bg-ivory/90 backdrop-blur-md text-onyx text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 flex items-center gap-2 font-bold border border-onyx/10">
+            <span className="bg-ivory/90 backdrop-blur-md text-onyx text-micro tracking-[0.3em] uppercase px-4 py-1.5 flex items-center gap-2 font-bold border border-onyx/10">
               <Box className="w-3 h-3 text-gold" />
               {t('badge.3d')}
             </span>
           )}
         </div>
@@ -124,19 +124,19 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
             e.preventDefault();
             e.stopPropagation();
             setShowMobileActions(!showMobileActions);
           }}
           className={cn(
-            "md:hidden absolute bottom-0 left-0 right-0 z-20 py-3 text-[10px] tracking-[0.2em] uppercase font-body flex items-center justify-center gap-2 transition-all duration-300",
+            "md:hidden absolute bottom-0 left-0 right-0 z-20 py-3 text-micro tracking-[0.2em] uppercase font-body flex items-center justify-center gap-2 transition-all duration-300",
             showMobileActions 
               ? "bg-onyx text-white" 
               : "bg-gold/90 text-white backdrop-blur-sm"
           )}
           aria-label={showMobileActions ? 'Close quick shop' : 'Open quick shop'}
         >
           <ShoppingBag className="w-3 h-3" />
-          {showMobileActions ? 'Close' : 'Quick Shop'}
+          {showMobileActions ? 'Close' : t('product.quick_shop')}
         </button>
 
         {/* Quick Actions ΓÇö slim slide-up bar on hover */}
         <div className={cn(
           "absolute bottom-0 left-0 right-0 z-10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
@@ -150,22 +150,22 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full bg-ivory/95 backdrop-blur-sm p-3 flex flex-col gap-2"
             >
               <div className="flex items-center justify-between mb-1">
-                <span className="text-[9px] tracking-[0.2em] uppercase text-stone-500 font-bold">Select Size</span>
-                <button onClick={cancelSizeSelection} className="text-stone-400 hover:text-stone-800 transition-colors">
-                  <span className="text-[9px] tracking-widest uppercase">Cancel</span>
+                <span className="text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('product.select_size')}</span>
+                <button onClick={cancelSizeSelection} className="text-stone-600 hover:text-stone-800 transition-colors">
+                  <span className="text-micro tracking-widest uppercase">{t('product.cancel')}</span>
                 </button>
               </div>
               <div className="flex flex-wrap gap-1.5">
                 {product.sizes.map((size) => (
                   <button
                     key={size}
                     onClick={(e) => handleSizeSelect(size, e)}
                     className={cn(
-                      "min-w-[2.5rem] h-9 px-2 flex items-center justify-center border text-[10px] tracking-wider transition-all",
+                      "min-w-[2.5rem] h-9 px-2 flex items-center justify-center border text-micro tracking-wider transition-all",
                       selectedSize === size
                         ? "border-gold bg-gold text-white"
                         : "border-stone-300 text-stone-600 hover:border-gold hover:text-gold"
                     )}
                   >
@@ -183,11 +183,11 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
             "md:group-hover:opacity-100 md:group-hover:translate-y-0"
           )}>
             <button
               onClick={handleQuickAdd}
               className={cn(
-                "flex-1 py-3 text-[10px] tracking-[0.2em] uppercase font-body transition-all duration-300 flex items-center justify-center gap-1.5",
+                "flex-1 py-3 text-micro tracking-[0.2em] uppercase font-body transition-all duration-300 flex items-center justify-center gap-1.5",
                 isAdded
                   ? "text-emerald-400"
                   : "text-white hover:text-gold"
               )}
             >
@@ -205,11 +205,11 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
             </button>
             <div className="w-px bg-white/10" />
             <button
               onClick={toggleWishlist}
               className={cn(
-                "flex-1 py-3 text-[10px] tracking-[0.2em] uppercase font-body transition-colors duration-300 flex items-center justify-center gap-1.5",
+                "flex-1 py-3 text-micro tracking-[0.2em] uppercase font-body transition-colors duration-300 flex items-center justify-center gap-1.5",
                 saved
                   ? "text-rose-400"
                   : "text-white/70 hover:text-rose-400"
               )}
             >
@@ -220,53 +220,53 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
         </div>
       </div>
 
       <div className="flex justify-between items-start">
         <div>
-          <p className="text-[10px] tracking-widest text-stone-500 uppercase mb-1">{product.category}</p>
+          <p className="text-micro tracking-widest text-stone-600 uppercase mb-1">{product.category}</p>
         {lookNumber && (
-          <span className="font-label text-[10px] tracking-[0.3em] uppercase text-gold">
+          <span className="font-label text-micro tracking-[0.3em] uppercase text-gold">
             {t('silhouettes.look')} {lookNumber}
           </span>
         )}
           <Link to={`/product/${product.id}`} className="block font-heading text-xl text-stone-900 tracking-tight hover:text-gold transition-colors leading-[1.1]">
             {product.name}
         </Link>
         {product.fabric && (
-          <p className="font-editorial italic text-sm text-stone-500">{product.fabric}</p>
+          <p className="font-editorial italic text-sm text-stone-600">{product.fabric}</p>
         )}
 
         {/* Expanding gold frame ΓÇö couture hover detail */}
         <span className="absolute inset-3 border border-gold/0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:inset-4 group-hover:border-gold/40 pointer-events-none z-10" aria-hidden="true" />
         
           <div className="mt-2 flex flex-col gap-1">
             {isSale && (
               <p className="text-xs tracking-wider text-stone-600">
-                {t('product.purchase')}: <span className="font-semibold text-stone-800">{formatPrice(product.salePrice || 0)}</span>
+                {t('product.purchase')}: <span className="font-semibold text-stone-800"><span className="me-1 text-micro uppercase tracking-wider text-stone-600">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
               </p>
             )}
             {isRent && (
-              <p className="text-xs tracking-wider text-stone-500">
-                {t('product.rent')}: <span className="text-stone-700">{formatPrice(product.rentalPrice || 0)}</span>
+              <p className="text-xs tracking-wider text-stone-600">
+                {t('product.rent')}: <span className="text-stone-700"><span className="me-1 text-micro uppercase tracking-wider text-stone-600">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
               </p>
             )}
           </div>
 
           <Link
             to={`/product/${product.id}`}
-            className="inline-flex items-center gap-1.5 font-label text-[10px] tracking-[0.25em] uppercase text-stone-800 hover:text-gold transition-colors duration-500 mt-2"
+            className="inline-flex items-center gap-1.5 font-label text-micro tracking-[0.25em] uppercase text-stone-800 hover:text-gold transition-colors duration-500 mt-2"
           >
             {t('silhouettes.enquire')}
             <ArrowRight className="w-3 h-3" />
           </Link>
         </div>
         
         <button 
           onClick={toggleWishlist}
           className={cn(
             "p-2 transition-colors",
-            saved ? "text-rose-400" : "text-stone-300 hover:text-rose-400"
+            saved ? "text-rose-400" : "text-stone-500 hover:text-rose-400"
           )}
           aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
         >
           <Heart className={cn("w-5 h-5", saved && "fill-current")} />
         </button>
diff --git a/src/components/SizeGuide.tsx b/src/components/SizeGuide.tsx
index 2f43f5b..f88e70a 100644
--- a/src/components/SizeGuide.tsx
+++ b/src/components/SizeGuide.tsx
@@ -38,28 +38,28 @@ export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
             role="dialog"
             aria-modal="true"
           >
             <div className="sticky top-0 bg-ivory border-b border-stone-100 px-6 py-4 flex items-center justify-between z-10">
               <h3 className="font-heading text-lg text-stone-800 tracking-widest uppercase">{t('size_guide.title')}</h3>
-              <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-800 transition-colors" aria-label="Close size guide">
+              <button onClick={onClose} className="p-2 text-stone-600 hover:text-stone-800 transition-colors" aria-label="Close size guide">
                 <X className="w-5 h-5" />
               </button>
             </div>
 
             <div className="p-6">
-              <p className="font-body text-stone-500 text-sm leading-relaxed mb-6">
+              <p className="font-body text-stone-600 text-sm leading-relaxed mb-6">
                 {t('size_guide.desc')}
               </p>
 
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="border-b border-stone-200">
-                      <th className="text-left py-3 px-2 font-heading text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('size_guide.size')}</th>
-                      <th className="text-left py-3 px-2 font-heading text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('size_guide.bust')}</th>
-                      <th className="text-left py-3 px-2 font-heading text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('size_guide.waist')}</th>
-                      <th className="text-left py-3 px-2 font-heading text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('size_guide.hips')}</th>
+                      <th className="text-left py-3 px-2 font-heading text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('size_guide.size')}</th>
+                      <th className="text-left py-3 px-2 font-heading text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('size_guide.bust')}</th>
+                      <th className="text-left py-3 px-2 font-heading text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('size_guide.waist')}</th>
+                      <th className="text-left py-3 px-2 font-heading text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('size_guide.hips')}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {sizes.map(s => (
                       <tr key={s.label} className="border-b border-stone-100 hover:bg-ivory/50 transition-colors">
@@ -76,19 +76,19 @@ export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
               <div className="mt-6 pt-6 border-t border-stone-100">
                 <h4 className="font-heading text-xs tracking-widest uppercase text-stone-800 font-bold mb-3">{t('size_guide.how_to_measure')}</h4>
                 <div className="space-y-3">
                   <div className="flex gap-3">
                     <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
-                    <p className="font-body text-stone-500 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_bust')}</span> {t('size_guide.measure_bust_desc')}</p>
+                    <p className="font-body text-stone-600 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_bust')}</span> {t('size_guide.measure_bust_desc')}</p>
                   </div>
                   <div className="flex gap-3">
                     <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
-                    <p className="font-body text-stone-500 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_waist')}</span> {t('size_guide.measure_waist_desc')}</p>
+                    <p className="font-body text-stone-600 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_waist')}</span> {t('size_guide.measure_waist_desc')}</p>
                   </div>
                   <div className="flex gap-3">
                     <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
-                    <p className="font-body text-stone-500 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_hips')}</span> {t('size_guide.measure_hips_desc')}</p>
+                    <p className="font-body text-stone-600 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_hips')}</span> {t('size_guide.measure_hips_desc')}</p>
                   </div>
                 </div>
               </div>
 
               <div className="mt-6 p-4 bg-gold/5 border border-gold/20">
diff --git a/src/components/ThreeDViewer.tsx b/src/components/ThreeDViewer.tsx
index 3171eab..73ecedd 100644
--- a/src/components/ThreeDViewer.tsx
+++ b/src/components/ThreeDViewer.tsx
@@ -118,11 +118,11 @@ const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ src, poster, alt, className
                         initial={{ width: 0 }}
                         animate={{ width: `${loadingProgress}%` }}
                         className="h-full bg-gold"
                       />
                     </div>
-                    <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
+                    <span className="mt-2 text-micro uppercase tracking-[0.2em] text-stone-600 font-bold">
                       Loading detail {Math.round(loadingProgress)}%
                     </span>
                   </div>
                 </motion.div>
               )}
@@ -138,16 +138,16 @@ const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ src, poster, alt, className
                   <div className="relative flex flex-col items-center text-center max-w-xs">
                     <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                       <AlertTriangle className="w-6 h-6 text-rose-400" />
                     </div>
                     <p className="text-sm font-semibold text-stone-700 mb-2">3D viewer unavailable</p>
-                    <p className="text-[11px] text-stone-400 leading-relaxed mb-4">
+                    <p className="text-micro text-stone-600 leading-relaxed mb-4">
                       {errorMessage}
                     </p>
                     <button
                       onClick={handleRetry}
-                      className="btn-luxury !py-2 !px-6 text-[10px]"
+                      className="btn-luxury !py-2 !px-6 text-micro"
                     >
                       Retry
                     </button>
                   </div>
                 </motion.div>
@@ -158,11 +158,11 @@ const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ src, poster, alt, className
             {poster ? (
               <img src={poster} alt={alt || '3D model poster'} className="w-full h-full object-cover opacity-50" />
             ) : (
               <div className="flex flex-col items-center gap-3">
                 <Box className="w-8 h-8 text-gold/30 animate-pulse" />
-                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Initializing 3D Detail</span>
+                <span className="text-micro uppercase tracking-[0.2em] text-stone-600">Initializing 3D Detail</span>
               </div>
             )}
           </div>
 
           <div className="absolute bottom-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
@@ -185,11 +185,11 @@ const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ src, poster, alt, className
           </div>
 
           <div className="absolute top-6 left-6 pointer-events-none">
             <div className="flex items-center gap-2 px-3 py-1 bg-gold/10 backdrop-blur-sm border border-gold/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
-              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">3D Perspective</span>
+              <span className="text-micro font-bold uppercase tracking-[0.2em] text-gold">3D Perspective</span>
             </div>
           </div>
         </model-viewer>
         </div>
       </motion.div>
diff --git a/src/components/ToastContainer.tsx b/src/components/ToastContainer.tsx
index ad1bec8..5340c5a 100644
--- a/src/components/ToastContainer.tsx
+++ b/src/components/ToastContainer.tsx
@@ -42,12 +42,12 @@ export default function ToastContainer() {
                 COLORS[toast.type]
               )}
             >
               <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", ICON_COLORS[toast.type])} />
               <div className="flex-1 min-w-0">
-                <p className="text-[11px] font-bold uppercase tracking-widest">{toast.title}</p>
-                {toast.message && <p className="text-[10px] mt-0.5 opacity-70">{toast.message}</p>}
+                <p className="text-micro font-bold uppercase tracking-widest">{toast.title}</p>
+                {toast.message && <p className="text-micro mt-0.5 opacity-70">{toast.message}</p>}
               </div>
               <button
                 onClick={() => removeToast(toast.id)}
                 className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
                 aria-label="Dismiss"
diff --git a/src/components/luxury/HorizontalLookbook.tsx b/src/components/luxury/HorizontalLookbook.tsx
index 44031b0..02fc987 100644
--- a/src/components/luxury/HorizontalLookbook.tsx
+++ b/src/components/luxury/HorizontalLookbook.tsx
@@ -13,11 +13,11 @@ function Panel({ item, offset }: { item: GalleryItem; offset?: boolean }) {
           alt={item.title}
           loading="lazy"
           className="h-[52vh] md:h-[62vh] w-full md:w-[32vw] object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
         />
       </div>
-      <figcaption className="flex justify-between mt-4 text-[10px] uppercase tracking-[0.3em] text-ivory">
+      <figcaption className="flex justify-between mt-4 text-micro uppercase tracking-[0.3em] text-ivory">
         <span>{item.title}</span>
         <span className="text-ivory/40">{item.category}</span>
       </figcaption>
     </figure>
   );
@@ -43,17 +43,17 @@ function LookbookContent({ items }: { items: GalleryItem[] }) {
       {/* Desktop: pinned horizontal scroll */}
       <section ref={targetRef} className="relative hidden md:block h-[320vh] bg-onyx">
         <div className="sticky top-0 h-screen flex items-center overflow-hidden">
           <motion.div style={{ x }} className="flex items-center gap-[6vw] px-[8vw] will-change-transform">
             <div className="shrink-0 w-[34vw]">
-              <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40 mb-6">
+              <p className="text-micro uppercase tracking-[0.35em] text-ivory/40 mb-6">
                 ( 02 ) ΓÇö {t('lookbook.eyebrow')}
               </p>
               <h2 className="font-heading font-medium text-6xl md:text-[5.5vw] leading-[0.9] text-white mb-8">
                 {t('lookbook.heading')}
               </h2>
-              <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">
+              <span className="text-micro uppercase tracking-[0.3em] text-ivory/40">
                 {t('hero.discover')} ΓåÆ
               </span>
             </div>
 
             {items.map((item, i) => (
@@ -78,20 +78,20 @@ function LookbookContent({ items }: { items: GalleryItem[] }) {
         </div>
       </section>
 
       {/* Mobile: vertical stack */}
       <section className="md:hidden bg-onyx px-6 py-24">
-        <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40 mb-4">( 02 ) ΓÇö {t('lookbook.eyebrow')}</p>
+        <p className="text-micro uppercase tracking-[0.35em] text-ivory/40 mb-4">( 02 ) ΓÇö {t('lookbook.eyebrow')}</p>
         <h2 className="font-heading font-medium text-5xl leading-[0.9] text-white mb-10">{t('lookbook.heading')}</h2>
         <div className="flex flex-col gap-14">
           {items.map((item) => (
             <div key={item.id}>
               <Panel item={item} />
             </div>
           ))}
         </div>
-        <Link to="/collection/all" className="inline-block mt-12 text-gold text-[11px] uppercase tracking-[0.3em] border-b border-gold/40 pb-1">
+        <Link to="/collection/all" className="inline-block mt-12 text-gold text-micro uppercase tracking-[0.3em] border-b border-gold/40 pb-1">
           {t('lookbook.cta')} ΓåÆ
         </Link>
       </section>
     </>
   );
diff --git a/src/components/luxury/Marquee.tsx b/src/components/luxury/Marquee.tsx
index 4189e5e..320d936 100644
--- a/src/components/luxury/Marquee.tsx
+++ b/src/components/luxury/Marquee.tsx
@@ -24,14 +24,14 @@ export default function Marquee({ items, className }: MarqueeProps) {
         className
       )}
       aria-hidden="true"
     >
       <div className="marquee-track flex w-max">
-        <div className="flex items-center text-[11px] uppercase tracking-[0.35em] whitespace-nowrap text-ivory/80">
+        <div className="flex items-center text-micro uppercase tracking-[0.35em] whitespace-nowrap text-ivory/80">
           {half}
         </div>
-        <div className="flex items-center text-[11px] uppercase tracking-[0.35em] whitespace-nowrap text-ivory/80">
+        <div className="flex items-center text-micro uppercase tracking-[0.35em] whitespace-nowrap text-ivory/80">
           {half}
         </div>
       </div>
     </div>
   );
diff --git a/src/components/luxury/StatCounter.tsx b/src/components/luxury/StatCounter.tsx
index 77f9576..02c2193 100644
--- a/src/components/luxury/StatCounter.tsx
+++ b/src/components/luxury/StatCounter.tsx
@@ -27,9 +27,9 @@ export default function StatCounter({ value, suffix, label, duration = 1.6 }: St
     <div>
       <p className="font-heading text-5xl md:text-7xl text-white font-medium">
         <span ref={ref} data-testid="stat-value">{display}</span>
         {suffix && <span className="text-gold text-3xl md:text-5xl align-top">{suffix}</span>}
       </p>
-      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-3">{label}</p>
+      <p className="text-micro uppercase tracking-[0.3em] text-white/40 mt-3">{label}</p>
     </div>
   );
 }
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index d2f2016..9e648c3 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -23,11 +23,10 @@ const translations: Record<Language, Record<string, string>> = {
     'nav.contact': 'Contact',
     'nav.timeline': 'Timeline',
     'nav.style_quiz': 'Style Quiz',
     'nav.jewelry': 'Fine Jewelry',
     'nav.accessories': 'Accessories',
-    'nav.blog': 'Journal',
     'nav.gallery': 'Gallery',
     'nav.alterations': 'Alterations',
     'nav.faq': 'FAQ',
     'nav.appointment': 'Book Now',
 
@@ -46,22 +45,10 @@ const translations: Record<Language, Record<string, string>> = {
     'cat.rental_title': 'Premium Rentals',
     'cat.jewelry_title': 'Majestic Jewelry',
     'cat.accessories_title': 'Accessories',
     'cat.subtitle': 'Exquisite silhouettes and premium fabrics selected for the modern visionary.',
 
-    // Journal / Atelier
-    'journal.title': 'The Riman Journal',
-    'journal.finding': 'Finding Your Silhouette',
-    'journal.guide': 'Royal Geometry & Proportion Guide',
-    'journal.btn': 'Read The Full Guide',
-    'journal.heading': 'Mastering The Legacy Icon',
-    'journal.quote': 'Exquisitely crafted for the modern muse. Each piece is a woven story of elegance and royal substance.',
-    'journal.fabric_title': 'The Fabric of Dreams',
-    'journal.fabric_desc': 'Understanding the drape of Mikado Silk versus the airy lightness of French Tulle.',
-    'journal.artisan_title': 'Artisan Details',
-    'journal.artisan_desc': 'How hand-sewn Swarovski elements catch the light for a radiant glow.',
-
     // Hero
     'hero.title': 'Reverie & Essence',
     'hero.subtitle': "Sharjah's Premier Couture Atelier",
     'hero.discover': 'Discover',
 
@@ -208,10 +195,11 @@ const translations: Record<Language, Record<string, string>> = {
     'product.refundable_deposit': '+ Refundable Deposit Required',
     'product.select_size_label': 'Select Size',
     'product.size_guide': 'Size Guide',
     'product.book_rental': 'Book Rental',
     'product.add_to_collection': 'Add to Collection',
+    'product.reserve_viewing': 'Reserve a Private Viewing',
     'product.error_no_date': 'Please select a preferred rental date.',
     'product.error_no_size': 'Please select your size.',
     'product.rental_availability': 'Rental Availability',
     'product.fast_booking': 'Fast-Booking Recommended',
     'product.select_date_hint': 'Select a date to check 7-day premier hire availability.',
@@ -274,10 +262,18 @@ const translations: Record<Language, Record<string, string>> = {
     'product.care_handle_desc': 'Avoid direct contact with perfumes, cosmetics, and sharp accessories.',
     'product.care_steam': 'Professional Steaming',
     'product.care_steam_desc': 'Use low-heat steaming to remove wrinkles. Never iron directly on embellishments.',
     'product.ask_stylist': 'Ask a Stylist',
     'product.ask_stylist_desc': 'Book a complimentary consultation with our styling experts.',
+    'product.select_size': 'Select Size',
+    'product.cancel': 'Cancel',
+    'product.quick_shop': 'Quick Shop',
+
+    // Pricing
+    'pricing.from': 'From',
+    'pricing.rental_period': '3-day rental',
+    'pricing.consultation_note': 'Final quote confirmed at your consultation ΓÇö fitting and alterations included.',
 
     // Badges
     'badge.new': 'Majestic New',
     'badge.featured': 'Atelier Choice',
     'badge.gold': 'Pure Gold',
@@ -314,10 +310,21 @@ const translations: Record<Language, Record<string, string>> = {
     'wishlist.empty_desc': 'Begin your journey by curating your favorite silhouettes.',
     'wishlist.explore': 'Explore Atelier',
     'wishlist.view': 'View',
     'wishlist.add_to_bag': 'Add to Bag',
 
+    // Selection
+    'selection.title': 'Your Selection',
+    'selection.subtitle': 'Pieces kept aside for your private viewing',
+    'selection.empty': 'Your selection is empty',
+    'selection.empty_desc': 'Save the silhouettes that catch your eye ΓÇö we will have them ready for your visit.',
+    'selection.explore': 'Explore Atelier',
+    'selection.view': 'View',
+    'selection.add_to_bag': 'Add to Bag',
+    'selection.request_viewing': 'Request Private Viewing',
+    'selection.count': 'pieces selected',
+
     // Checkout
     'checkout.empty': 'Your Bag is Empty',
     'checkout.empty_desc': 'Please select pieces from our collection first.',
     'checkout.explore': 'Explore Collection',
     'checkout.step_identity': 'Identity',
@@ -378,10 +385,24 @@ const translations: Record<Language, Record<string, string>> = {
     'checkout.val_phone': 'Please enter a valid phone number',
     'checkout.val_name': 'Please enter your name',
     'checkout.val_address': 'Please enter your street address',
     'checkout.val_city': 'Please enter your city',
     'checkout.val_country': 'Please select your country',
+    'checkout.name_label': 'Name',
+
+    // Payment
+    'payment.verifying': 'Verifying Payment',
+    'payment.please_wait': 'Please wait a moment...',
+    'payment.success_title': 'Payment Successful',
+    'payment.success_sub': 'Your investment has been received.',
+    'payment.sent_to': 'Confirmation sent to',
+    'payment.success_body': 'Our team will contact you within 24 hours to arrange fitting and delivery details.',
+    'payment.dashboard': 'View My Dashboard',
+    'payment.error_title': 'Payment Not Verified',
+    'payment.error_body': 'Please contact our atelier to confirm your order.',
+    'payment.contact': 'Contact Us',
+    'payment.home': 'Return Home',
 
     // Auth
     'auth.signin': 'Sign In',
     'auth.signup': 'Create Account',
     'auth.welcome_back': 'Welcome back to the Atelier',
@@ -415,10 +436,11 @@ const translations: Record<Language, Record<string, string>> = {
     'appointment.full_name': 'Full Name *',
     'appointment.email': 'Email Address *',
     'appointment.phone': 'Phone Number *',
     'appointment.service_type': 'Service Type *',
     'appointment.select_service': 'Select a service',
+    'appointment.your_gowns': 'Your Selected Pieces',
     'appointment.select_date': 'Select Date *',
     'appointment.select_time': 'Select Time *',
     'appointment.special_requests': 'Special Requests (Optional)',
     'appointment.notes_placeholder': 'Anything specific you\'d like us to prepare for your visit...',
     'appointment.continue_scheduling': 'Continue to Scheduling',
@@ -437,10 +459,11 @@ const translations: Record<Language, Record<string, string>> = {
     'appointment.appointment_booked_for': 'appointment is booked for',
     'appointment.at': 'at',
     'appointment.confirmation_sent': 'A confirmation will be sent to',
     'appointment.our_team_reach': 'Our team will reach out to confirm details.',
     'appointment.explore_collection': 'Explore Collection',
+    'appointment.whatsapp_continue': 'Continue on WhatsApp',
     'appointment.error_name': 'Please enter your name',
     'appointment.error_email': 'Please enter a valid email',
     'appointment.error_phone': 'Please enter your phone number',
     'appointment.error_service': 'Please select a service type',
     'appointment.error_date': 'Please select a date',
@@ -560,31 +583,10 @@ const translations: Record<Language, Record<string, string>> = {
     'quiz.based_on_answers': 'Based on your answers, we think you will love these designs.',
     'quiz.browse_collection': 'Browse our curated collection to find your perfect piece.',
     'quiz.try_different': 'Try different options to discover more styles.',
     'quiz.view_all': 'View Full Collection',
 
-    // Blog
-    'blog.title': 'The Riman Journal',
-    'blog.subtitle': 'Style & Substance',
-    'blog.latest': 'Latest Release',
-    'blog.min_read': 'min read',
-    'blog.read_editorial': 'Read Editorial',
-    'blog.view_journal': 'View Journal',
-    'blog.join_circle': 'Join the Circle',
-    'blog.newsletter_desc': 'Receive exclusive invitations to atelier reveals and seasonal style insights.',
-    'blog.email_placeholder': 'EMAIL ADDRESS',
-    'blog.subscribe': 'Subscribe',
-    'blog.article1_title': 'The Rise of Minimalist Sharjah Couture',
-    'blog.article1_excerpt': 'Exploring the shift towards clean lines and architectural silhouettes in the 2026 bridal season.',
-    'blog.article1_category': 'Trends',
-    'blog.article2_title': 'Gala Ready: The Rental Revolution',
-    'blog.article2_excerpt': 'How premium rental collections are changing the high-fashion landscape for evening wear.',
-    'blog.article2_category': 'Insights',
-    'blog.article3_title': 'Crafting the Noor Kaftan',
-    'blog.article3_excerpt': 'A behind-the-scenes look at the 400 hours of hand-embroidery required for our latest masterpiece.',
-    'blog.article3_category': 'Craftsmanship',
-
     // FAQ
     'faq.category_rental': 'Rental Services',
     'faq.q_rental_1': 'How long is the standard rental period?',
     'faq.a_rental_1': "Our standard 'Premier Hire' period is 7 days. Extensions can be arranged for an additional fee, subject to availability. We recommend booking at least 4 weeks in advance for your desired dates.",
     'faq.q_rental_2': 'Is dry cleaning included in the rental price?',
@@ -704,13 +706,10 @@ const translations: Record<Language, Record<string, string>> = {
     'gallery.admin_upload': 'Upload Media',
     'gallery.admin_edit': 'Edit Item',
     'gallery.admin_delete': 'Delete Item',
     'gallery.admin_featured': 'Featured',
     'gallery.admin_sort': 'Sort Order',
-
-    // Misc
-    'section.journal': 'The Riman Journal',
   },
 
   ar: {
     // Navigation
     'nav.home': '╪º┘ä╪▒╪ª┘è╪│┘è╪⌐',
@@ -721,11 +720,10 @@ const translations: Record<Language, Record<string, string>> = {
     'nav.contact': '╪¬┘ê╪º╪╡┘ä ┘à╪╣┘å╪º',
     'nav.timeline': '╪º┘ä╪¼╪»┘ê┘ä ╪º┘ä╪▓┘à┘å┘è',
     'nav.style_quiz': '╪º╪«╪¬╪¿╪º╪▒ ╪º┘ä╪ú┘å╪º┘é╪⌐',
     'nav.jewelry': '╪º┘ä┘à╪¼┘ê┘ç╪▒╪º╪¬ ╪º┘ä╪▒╪º┘é┘è╪⌐',
     'nav.accessories': '╪º┘ä╪Ñ┘â╪│╪│┘ê╪º╪▒╪º╪¬',
-    'nav.blog': '╪º┘ä┘à╪¼┘ä╪⌐',
     'nav.gallery': '╪º┘ä┘à╪╣╪▒╪╢',
     'nav.alterations': '╪º┘ä╪¬╪╣╪»┘è┘ä╪º╪¬',
     'nav.faq': '╪º┘ä╪ú╪│╪ª┘ä╪⌐ ╪º┘ä╪┤╪º╪ª╪╣╪⌐',
     'nav.appointment': '╪º╪¡╪¼╪▓ ╪º┘ä╪ó┘å',
 
@@ -744,22 +742,10 @@ const translations: Record<Language, Record<string, string>> = {
     'cat.rental_title': '╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘à╪¬┘à┘è╪▓',
     'cat.jewelry_title': '╪º┘ä┘à╪¼┘ê┘ç╪▒╪º╪¬ ╪º┘ä┘à┘ç┘è╪¿╪⌐',
     'cat.accessories_title': '╪º┘ä╪Ñ┘â╪│╪│┘ê╪º╪▒╪º╪¬',
     'cat.subtitle': '╪¬╪╡╪º┘à┘è┘à ╪▒╪º┘é┘è╪⌐ ┘ê╪ú┘é┘à╪┤╪⌐ ┘ü╪º╪«╪▒╪⌐ ┘à╪«╪¬╪º╪▒╪⌐ ╪¿╪╣┘å╪º┘è╪⌐ ┘ä┘ä┘à╪▒╪ú╪⌐ ╪º┘ä╪╣╪╡╪▒┘è╪⌐ ╪º┘ä┘ê╪º╪╣┘è╪⌐.',
 
-    // Journal / Atelier
-    'journal.title': '┘à╪¼┘ä╪⌐ ╪▒┘è┘à╪º┘å',
-    'journal.finding': '╪º┘â╪¬╪┤╪º┘ü ╪╖┘ä╪¬┘â ╪º┘ä┘à╪½╪º┘ä┘è╪⌐',
-    'journal.guide': '╪»┘ä┘è┘ä ╪º┘ä┘ç┘å╪»╪│╪⌐ ╪º┘ä┘à┘ä┘â┘è╪⌐ ┘ê╪º┘ä╪¬┘å╪º╪│╪¿',
-    'journal.btn': '╪º┘é╪▒╪ú ╪º┘ä╪»┘ä┘è┘ä ╪º┘ä┘â╪º┘à┘ä',
-    'journal.heading': '╪Ñ╪¬┘é╪º┘å ╪ú┘è┘é┘ê┘å╪⌐ ╪º┘ä╪Ñ╪▒╪½',
-    'journal.quote': '┘à╪╡┘å┘ê╪╣╪⌐ ╪¿╪Ñ╪¬┘é╪º┘å ┘ä┘ä┘à┘ä┘ç┘à╪⌐ ╪º┘ä╪╣╪╡╪▒┘è╪⌐. ┘â┘ä ┘é╪╖╪╣╪⌐ ┘ç┘è ┘é╪╡╪⌐ ┘à┘å╪│┘ê╪¼╪⌐ ┘à┘å ╪º┘ä╪ú┘å╪º┘é╪⌐ ┘ê╪º┘ä╪¼┘ê┘ç╪▒ ╪º┘ä┘à┘ä┘â┘è.',
-    'journal.fabric_title': '┘å╪│┘è╪¼ ╪º┘ä╪ú╪¡┘ä╪º┘à',
-    'journal.fabric_desc': '┘ü┘ç┘à ╪¬╪»┘ü┘é ╪¡╪▒┘è╪▒ ╪º┘ä┘à┘è┘â╪º╪»┘ê ┘à┘é╪º╪¿┘ä ╪«┘ü╪⌐ ╪º┘ä╪¬┘ê┘ä ╪º┘ä┘ü╪▒┘å╪│┘è.',
-    'journal.artisan_title': '╪¬┘ü╪º╪╡┘è┘ä ╪º┘ä╪¡╪▒┘ü┘è╪⌐',
-    'journal.artisan_desc': '┘â┘è┘ü ╪¬┘ä╪¬┘é╪╖ ╪╣┘å╪º╪╡╪▒ ╪º┘ä╪│┘ê╪º╪▒┘ê┘ü╪│┘â┘è ╪º┘ä┘à╪«┘è╪╖╪⌐ ┘è╪»┘ê┘è╪º┘ï ╪º┘ä╪╢┘ê╪í ┘ä╪¬┘ê┘ç╪¼ ┘à╪┤╪▒┘é.',
-
     // Hero
     'hero.title': '╪¡┘ä┘à┘î ┘ê╪¼┘ê┘ç╪▒',
     'hero.subtitle': '╪»╪º╪▒ ╪º┘ä╪ú╪▓┘è╪º╪í ╪º┘ä╪▒╪º╪ª╪»╪⌐ ┘ü┘è ╪º┘ä╪┤╪º╪▒┘é╪⌐',
     'hero.discover': '╪º┘â╪¬╪┤┘ü',
 
@@ -906,10 +892,11 @@ const translations: Record<Language, Record<string, string>> = {
     'product.refundable_deposit': '+ ┘ê╪»┘è╪╣╪⌐ ┘é╪º╪¿┘ä╪⌐ ┘ä┘ä╪º╪│╪¬╪▒╪»╪º╪»',
     'product.select_size_label': '╪º╪«╪¬╪▒ ╪º┘ä┘à┘é╪º╪│',
     'product.size_guide': '╪»┘ä┘è┘ä ╪º┘ä┘à┘é╪º╪│╪º╪¬',
     'product.book_rental': '╪º╪¡╪¼╪▓ ╪º┘ä╪Ñ┘è╪¼╪º╪▒',
     'product.add_to_collection': '╪ú╪╢┘ü ┘ä┘ä┘à╪¼┘à┘ê╪╣╪⌐',
+    'product.reserve_viewing': '╪º╪¡╪¼╪▓┘è ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐',
     'product.error_no_date': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪¬╪º╪▒┘è╪« ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘à┘ü╪╢┘ä.',
     'product.error_no_size': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ┘à┘é╪º╪│┘â.',
     'product.rental_availability': '╪¬┘ê┘ü╪▒ ╪º┘ä╪Ñ┘è╪¼╪º╪▒',
     'product.fast_booking': '┘è┘Å┘ê╪╡┘ë ╪¿╪º┘ä╪¡╪¼╪▓ ╪º┘ä╪│╪▒┘è╪╣',
     'product.select_date_hint': '╪º╪«╪¬╪▒ ╪¬╪º╪▒┘è╪«╪º┘ï ┘ä┘ä╪¬╪¡┘é┘é ┘à┘å ╪¬┘ê┘ü╪▒ ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ┘ä┘à╪»╪⌐ ┘º ╪ú┘è╪º┘à.',
@@ -972,10 +959,18 @@ const translations: Record<Language, Record<string, string>> = {
     'product.care_handle_desc': '╪¬╪¼┘å╪¿┘è┘ä╪º┘à╪│ ╪º┘ä┘à╪¿╪º╪┤╪▒ ┘ä┘ä╪╣╪╖┘ê╪▒ ┘ê┘à╪│╪¬╪¡╪╢╪▒╪º╪¬ ╪º┘ä╪¬╪¼┘à┘è┘ä ┘ê╪º┘ä╪Ñ┘â╪│╪│┘ê╪º╪▒╪º╪¬ ╪º┘ä╪¡╪º╪»╪⌐.',
     'product.care_steam': '╪¿╪«╪º╪▒ ╪º╪¡╪¬╪▒╪º┘ü┘è',
     'product.care_steam_desc': '╪º╪│╪¬╪«╪»┘à┘è ╪º┘ä╪¿╪«╪º╪▒ ┘à┘å╪«┘ü╪╢ ╪º┘ä╪¡╪▒╪º╪▒╪⌐ ┘ä╪Ñ╪▓╪º┘ä╪⌐ ╪º┘ä╪¬╪¼╪º╪╣┘è╪». ┘ä╪º ╪¬┘â┘ê┘è ┘à╪¿╪º╪┤╪▒╪⌐ ╪╣┘ä┘ë ╪º┘ä╪¬╪╖╪▒┘è╪▓.',
     'product.ask_stylist': '╪º╪│╪ú┘ä┘è ╪º┘ä╪«╪¿┘è╪▒╪⌐',
     'product.ask_stylist_desc': '╪º╪¡╪¼╪▓┘è ╪º╪│╪¬╪┤╪º╪▒╪⌐ ┘à╪¼╪º┘å┘è╪⌐ ┘à╪╣ ╪«╪¿╪▒╪º╪í ╪º┘ä╪¬╪╡┘à┘è┘à ┘ä╪»┘è┘å╪º.',
+    'product.select_size': '╪º╪«╪¬╪º╪▒┘è ╪º┘ä┘à┘é╪º╪│',
+    'product.cancel': '╪Ñ┘ä╪║╪º╪í',
+    'product.quick_shop': '╪¬╪│┘ê┘é ╪│╪▒┘è╪╣',
+
+    // Pricing
+    'pricing.from': '┘è╪¿╪»╪ú ┘à┘å',
+    'pricing.rental_period': '╪¬╪ú╪¼┘è╪▒ ┘ú ╪ú┘è╪º┘à',
+    'pricing.consultation_note': '┘è╪¬┘à ╪¬╪ú┘â┘è╪» ╪º┘ä╪│╪╣╪▒ ╪º┘ä┘å┘ç╪º╪ª┘è ┘ü┘è ┘à┘ê╪╣╪» ╪º┘ä╪º╪│╪¬╪┤╪º╪▒╪⌐ ΓÇö ┘è╪┤┘à┘ä ╪º┘ä╪¬┘ü╪╡┘è┘ä ┘ê╪º┘ä╪¬╪╣╪»┘è┘ä╪º╪¬.',
 
     // Badges
     'badge.new': '╪¼╪»┘è╪» ┘à┘ç┘è╪¿',
     'badge.featured': '╪º╪«╪¬┘è╪º╪▒ ╪º┘ä╪»╪º╪▒',
     'badge.gold': '╪░┘ç╪¿ ╪«╪º┘ä╪╡',
@@ -1012,10 +1007,21 @@ const translations: Record<Language, Record<string, string>> = {
     'wishlist.empty_desc': '╪º╪¿╪»╪ú ╪▒╪¡┘ä╪¬┘â ╪¿╪º╪«╪¬┘è╪º╪▒ ╪¬╪╡╪º┘à┘è┘à┘â ╪º┘ä┘à┘ü╪╢┘ä╪⌐.',
     'wishlist.explore': '╪º╪│╪¬┘â╪┤┘ü ╪º┘ä╪»╪º╪▒',
     'wishlist.view': '╪╣╪▒╪╢',
     'wishlist.add_to_bag': '╪ú╪╢┘ü ┘ä┘ä╪¡┘é┘è╪¿╪⌐',
 
+    // Selection
+    'selection.title': '┘à╪«╪¬╪º╪▒╪º╪¬┘â',
+    'selection.subtitle': '┘é╪╖╪╣ ╪º┘å╪¬╪╕╪▒┘å╪º┘ç╪º ┘ä┘à╪┤╪º┘ç╪»╪¬┘â ╪º┘ä╪«╪º╪╡╪⌐',
+    'selection.empty': '┘à╪«╪¬╪º╪▒╪º╪¬┘â ┘ü╪º╪▒╪║╪⌐',
+    'selection.empty_desc': '╪º╪¡┘ü╪╕┘è ╪º┘ä╪¬╪╡╪º┘à┘è┘à ╪º┘ä╪¬┘è ╪ú╪│╪▒╪¬ ┘é┘ä╪¿┘â ΓÇö ┘ê╪│╪¬┘â┘ê┘å ╪¼╪º┘ç╪▓╪⌐ ╪╣┘å╪» ╪▓┘è╪º╪▒╪¬┘â.',
+    'selection.explore': '╪º╪│╪¬┘â╪┤┘ü┘è ╪º┘ä╪»╪º╪▒',
+    'selection.view': '╪╣╪▒╪╢',
+    'selection.add_to_bag': '╪ú╪╢┘ü ┘ä┘ä╪¡┘é┘è╪¿╪⌐',
+    'selection.request_viewing': '╪╖┘ä╪¿ ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐',
+    'selection.count': '┘é╪╖╪╣╪⌐ ┘à╪«╪¬╪º╪▒╪⌐',
+
     // Checkout
     'checkout.empty': '╪¡┘é┘è╪¿╪¬┘â ┘ü╪º╪▒╪║╪⌐',
     'checkout.empty_desc': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪º┘ä┘é╪╖╪╣ ┘à┘å ┘à╪¼┘à┘ê╪╣╪¬┘å╪º ╪ú┘ê┘ä╪º┘ï.',
     'checkout.explore': '╪º╪│╪¬┘â╪┤┘ü ╪º┘ä┘à╪¼┘à┘ê╪╣╪⌐',
     'checkout.step_identity': '╪º┘ä┘ç┘ê┘è╪⌐',
@@ -1076,10 +1082,24 @@ const translations: Record<Language, Record<string, string>> = {
     'checkout.val_phone': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪▒┘é┘à ┘ç╪º╪¬┘ü ╪╡╪¡┘è╪¡',
     'checkout.val_name': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪º╪│┘à┘â',
     'checkout.val_address': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪╣┘å┘ê╪º┘å┘â',
     'checkout.val_city': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ┘à╪»┘è┘å╪¬┘â',
     'checkout.val_country': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪¿┘ä╪»┘â',
+    'checkout.name_label': '╪º┘ä╪º╪│┘à',
+
+    // Payment
+    'payment.verifying': '╪¼╪º╪▒┘ì ╪¬╪ú┘â┘è╪» ╪º┘ä╪»┘ü╪╣',
+    'payment.please_wait': '╪º┘ä╪▒╪¼╪º╪í ╪º┘ä╪º┘å╪¬╪╕╪º╪▒ ┘é┘ä┘è┘ä╪º┘ï...',
+    'payment.success_title': '╪¬┘à ╪º┘ä╪»┘ü╪╣ ╪¿┘å╪¼╪º╪¡',
+    'payment.success_sub': '┘ä┘é╪» ╪º╪│╪¬┘ä┘à┘å╪º ╪╖┘ä╪¿┘â.',
+    'payment.sent_to': '╪¬┘à ╪Ñ╪▒╪│╪º┘ä ╪º┘ä╪¬╪ú┘â┘è╪» ╪Ñ┘ä┘ë',
+    'payment.success_body': '╪│┘è╪¬┘ê╪º╪╡┘ä ┘à╪╣┘â ┘ü╪▒┘è┘é┘å╪º ╪«┘ä╪º┘ä ┘ó┘ñ ╪│╪º╪╣╪⌐ ┘ä╪¬╪▒╪¬┘è╪¿ ╪º┘ä╪¬┘ü╪╡┘è┘ä ┘ê╪º┘ä╪¬┘ê╪╡┘è┘ä.',
+    'payment.dashboard': '┘ä┘ê╪¡╪⌐ ╪¡╪│╪º╪¿┘è',
+    'payment.error_title': '┘ä┘à ┘è╪¬┘à ╪¬╪ú┘â┘è╪» ╪º┘ä╪»┘ü╪╣',
+    'payment.error_body': '╪º┘ä╪▒╪¼╪º╪í ╪º┘ä╪¬┘ê╪º╪╡┘ä ┘à╪╣ ╪º┘ä╪»╪º╪▒ ┘ä╪¬╪ú┘â┘è╪» ╪╖┘ä╪¿┘â.',
+    'payment.contact': '╪¬┘ê╪º╪╡┘ä┘è ┘à╪╣┘å╪º',
+    'payment.home': '╪º┘ä╪╣┘ê╪»╪⌐ ┘ä┘ä╪▒╪ª┘è╪│┘è╪⌐',
 
     // Auth
     'auth.signin': '╪¬╪│╪¼┘è┘ä ╪º┘ä╪»╪«┘ê┘ä',
     'auth.signup': '╪Ñ┘å╪┤╪º╪í ╪¡╪│╪º╪¿',
     'auth.welcome_back': '┘à╪▒╪¡╪¿╪º┘ï ╪¿╪╣┘ê╪»╪¬┘â ╪Ñ┘ä┘ë ╪º┘ä╪»╪º╪▒',
@@ -1113,10 +1133,11 @@ const translations: Record<Language, Record<string, string>> = {
     'appointment.full_name': '╪º┘ä╪º╪│┘à ╪º┘ä┘â╪º┘à┘ä *',
     'appointment.email': '╪º┘ä╪¿╪▒┘è╪» ╪º┘ä╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è *',
     'appointment.phone': '╪▒┘é┘à ╪º┘ä┘ç╪º╪¬┘ü *',
     'appointment.service_type': '┘å┘ê╪╣ ╪º┘ä╪«╪»┘à╪⌐ *',
     'appointment.select_service': '╪º╪«╪¬╪▒ ╪«╪»┘à╪⌐',
+    'appointment.your_gowns': '┘é╪╖╪╣┘â ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐',
     'appointment.select_date': '╪º╪«╪¬╪▒ ╪º┘ä╪¬╪º╪▒┘è╪« *',
     'appointment.select_time': '╪º╪«╪¬╪▒ ╪º┘ä┘ê┘é╪¬ *',
     'appointment.special_requests': '╪╖┘ä╪¿╪º╪¬ ╪«╪º╪╡╪⌐ (╪º╪«╪¬┘è╪º╪▒┘è)',
     'appointment.notes_placeholder': '╪ú┘è ╪┤┘è╪í ╪¬┘ê╪»┘æ ╪ú┘å ┘å╪¼┘ç╪▓┘ç ┘ä╪▓┘è╪º╪▒╪¬┘â...',
     'appointment.continue_scheduling': '┘à╪¬╪º╪¿╪╣╪⌐ ╪Ñ┘ä┘ë ╪¬╪¡╪»┘è╪» ╪º┘ä┘à┘ê╪╣╪»',
@@ -1135,10 +1156,11 @@ const translations: Record<Language, Record<string, string>> = {
     'appointment.appointment_booked_for': '┘à╪¡╪¼┘ê╪▓ ┘ü┘è',
     'appointment.at': '┘ü┘è',
     'appointment.confirmation_sent': '╪│┘è╪¬┘à ╪Ñ╪▒╪│╪º┘ä ╪º┘ä╪¬╪ú┘â┘è╪» ╪Ñ┘ä┘ë',
     'appointment.our_team_reach': '╪│┘è╪¬┘ê╪º╪╡┘ä ┘ü╪▒┘è┘é┘å╪º ┘ä╪¬╪ú┘â┘è╪» ╪º┘ä╪¬┘ü╪º╪╡┘è┘ä.',
     'appointment.explore_collection': '╪º╪│╪¬┘â╪┤┘ü ╪º┘ä┘à╪¼┘à┘ê╪╣╪⌐',
+    'appointment.whatsapp_continue': '╪¬╪º╪¿╪╣┘è┘å╪º ╪╣┘ä┘ë ┘ê╪º╪¬╪│╪º╪¿',
     'appointment.error_name': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪º╪│┘à┘â',
     'appointment.error_email': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪¿╪▒┘è╪» ╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è ╪╡╪¡┘è╪¡',
     'appointment.error_phone': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪▒┘é┘à ┘ç╪º╪¬┘ü┘â',
     'appointment.error_service': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ┘å┘ê╪╣ ╪º┘ä╪«╪»┘à╪⌐',
     'appointment.error_date': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪¬╪º╪▒┘è╪«',
@@ -1258,31 +1280,10 @@ const translations: Record<Language, Record<string, string>> = {
     'quiz.based_on_answers': '╪¿┘å╪º╪í┘ï ╪╣┘ä┘ë ╪Ñ╪¼╪º╪¿╪º╪¬┘â╪î ┘å╪╣╪¬┘é╪» ╪ú┘å┘â ╪│╪¬╪¡╪¿ ┘ç╪░┘ç ╪º┘ä╪¬╪╡╪º┘à┘è┘à.',
     'quiz.browse_collection': '╪¬╪╡┘ü╪¡ ┘à╪¼┘à┘ê╪╣╪¬┘å╪º ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐ ┘ä╪Ñ┘è╪¼╪º╪» ┘é╪╖╪╣╪¬┘â ╪º┘ä┘à╪½╪º┘ä┘è╪⌐.',
     'quiz.try_different': '╪¼╪▒┘æ╪¿ ╪«┘è╪º╪▒╪º╪¬ ┘à╪«╪¬┘ä┘ü╪⌐ ┘ä╪º┘â╪¬╪┤╪º┘ü ╪º┘ä┘à╪▓┘è╪» ┘à┘å ╪º┘ä╪ú┘å┘à╪º╪╖.',
     'quiz.view_all': '╪╣╪▒╪╢ ╪º┘ä┘à╪¼┘à┘ê╪╣╪⌐ ╪º┘ä┘â╪º┘à┘ä╪⌐',
 
-    // Blog
-    'blog.title': '┘à╪¼┘ä╪⌐ ╪▒┘è┘à╪º┘å',
-    'blog.subtitle': '╪º┘ä╪ú┘å╪º┘é╪⌐ ┘ê╪º┘ä┘à╪¡╪¬┘ê┘ë',
-    'blog.latest': '╪ú╪¡╪»╪½ ╪Ñ╪╡╪»╪º╪▒',
-    'blog.min_read': '╪»┘é╪º╪ª┘é ┘é╪▒╪º╪í╪⌐',
-    'blog.read_editorial': '╪º┘é╪▒╪ú ╪º┘ä┘à┘é╪º┘ä',
-    'blog.view_journal': '╪╣╪▒╪╢ ╪º┘ä┘à╪¼┘ä╪⌐',
-    'blog.join_circle': '╪º┘å╪╢┘à ┘ä┘ä╪»╪º╪ª╪▒╪⌐',
-    'blog.newsletter_desc': '╪¬┘ä┘é┘ë ╪»╪╣┘ê╪º╪¬ ╪¡╪╡╪▒┘è╪⌐ ┘ä┘â╪┤┘ü ╪º┘ä┘à╪¼┘à┘ê╪╣╪º╪¬ ┘ê╪ú┘ü┘â╪º╪▒ ╪º┘ä┘à┘ê╪╢╪⌐ ╪º┘ä┘à┘ê╪│┘à┘è╪⌐.',
-    'blog.email_placeholder': '╪º┘ä╪¿╪▒┘è╪» ╪º┘ä╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è',
-    'blog.subscribe': '╪º╪┤╪¬╪▒┘â',
-    'blog.article1_title': '╪╡╪╣┘ê╪» ╪ú╪▓┘è╪º╪í ╪º┘ä╪┤╪º╪▒┘é╪⌐ ╪º┘ä╪¿╪│┘è╪╖╪⌐',
-    'blog.article1_excerpt': '╪º╪│╪¬┘â╪┤╪º┘ü ╪º┘ä╪¬╪¡┘ê┘ä ┘å╪¡┘ê ╪º┘ä╪«╪╖┘ê╪╖ ╪º┘ä┘å╪╕┘è┘ü╪⌐ ┘ê╪º┘ä┘é╪╡╪º╪¬ ╪º┘ä┘à╪╣┘à╪º╪▒┘è╪⌐ ┘ü┘è ┘à┘ê╪│┘à ╪╣╪▒╪º╪ª╪│ ┘ó┘á┘ó┘ª.',
-    'blog.article1_category': '╪º╪¬╪¼╪º┘ç╪º╪¬',
-    'blog.article2_title': '╪¼╪º┘ç╪▓╪⌐ ┘ä┘ä╪¡┘ü┘ä: ╪½┘ê╪▒╪⌐ ╪º┘ä╪Ñ┘è╪¼╪º╪▒',
-    'blog.article2_excerpt': '┘â┘è┘ü ╪¬╪║┘è╪▒ ┘à╪¼┘à┘ê╪╣╪º╪¬ ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘ü╪º╪«╪▒╪⌐ ┘à╪┤┘ç╪» ╪º┘ä╪ú╪▓┘è╪º╪í ╪º┘ä╪▒╪º┘é┘è╪⌐ ┘ä┘ä╪│┘ç╪▒╪⌐.',
-    'blog.article2_category': '╪▒╪ñ┘ë',
-    'blog.article3_title': '╪╡┘å╪º╪╣╪⌐ ┘â┘ü╪¬╪º┘å ┘å┘ê╪▒',
-    'blog.article3_excerpt': '┘å╪╕╪▒╪⌐ ╪«┘ä┘ü ╪º┘ä┘â┘ê╪º┘ä┘è╪│ ╪╣┘ä┘ë ┘ñ┘á┘á ╪│╪º╪╣╪⌐ ┘à┘å ╪º┘ä╪¬╪╖╪▒┘è╪▓ ╪º┘ä┘è╪»┘ê┘è ╪º┘ä┘à╪╖┘ä┘ê╪¿╪⌐ ┘ä latest ╪¬╪¡┘ü╪¬┘å╪º.',
-    'blog.article3_category': '╪º┘ä╪¡╪▒┘ü┘è╪⌐',
-
     // FAQ
     'faq.category_rental': '╪«╪»┘à╪º╪¬ ╪º┘ä╪Ñ┘è╪¼╪º╪▒',
     'faq.q_rental_1': '┘à╪º ┘à╪»╪⌐ ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘à╪╣┘è╪º╪▒┘è╪⌐╪ƒ',
     'faq.a_rental_1': '┘ü╪¬╪▒╪⌐ ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘à╪╣┘è╪º╪▒┘è╪⌐ "╪º┘ä╪¬┘ê╪╕┘è┘ü ╪º┘ä┘à╪¬┘à┘è╪▓" ┘ç┘è 7 ╪ú┘è╪º┘à. ┘è┘à┘â┘å ╪¬╪▒╪¬┘è╪¿ ╪º┘ä╪º┘à╪¬╪»╪º╪»╪º╪¬ ┘à┘é╪º╪¿┘ä ╪▒╪│┘ê┘à ╪Ñ╪╢╪º┘ü┘è╪⌐╪î ╪¡╪│╪¿ ╪º┘ä╪¬┘ê┘ü╪▒. ┘å┘ê╪╡┘è ╪¿╪º┘ä╪¡╪¼╪▓ ┘é╪¿┘ä 4 ╪ú╪│╪º╪¿┘è╪╣ ╪╣┘ä┘ë ╪º┘ä╪ú┘é┘ä.',
     'faq.q_rental_2': '┘ç┘ä ╪º┘ä╪¬╪╕┘è┘ü ╪º┘ä╪¼╪º┘ü ┘à╪┤┘à┘ê┘ä ┘ü┘è ╪│╪╣╪▒ ╪º┘ä╪Ñ┘è╪¼╪º╪▒╪ƒ',
@@ -1402,19 +1403,16 @@ const translations: Record<Language, Record<string, string>> = {
     'gallery.admin_upload': '╪▒┘ü╪╣ ┘ê╪│╪º╪ª╪╖',
     'gallery.admin_edit': '╪¬╪╣╪»┘è┘ä ╪º┘ä╪╣┘å╪╡╪▒',
     'gallery.admin_delete': '╪¡╪░┘ü ╪º┘ä╪╣┘å╪╡╪▒',
     'gallery.admin_featured': '┘à┘à┘è╪▓',
     'gallery.admin_sort': '╪¬╪▒╪¬┘è╪¿ ╪º┘ä╪╣╪▒╪╢',
-
-    // Misc
-    'section.journal': '┘à╪¼┘ä╪⌐ ╪▒┘è┘à╪º┘å',
   }
 };
 
 export function LanguageProvider({ children }: { children: ReactNode }) {
   const [language, setLanguage] = useState<Language>(() => {
-    return (localStorage.getItem('riman_lang') as Language) || 'en';
+    return (localStorage.getItem('riman_lang') as Language) || 'ar';
   });
 
   useEffect(() => {
     localStorage.setItem('riman_lang', language);
     document.dir = language === 'ar' ? 'rtl' : 'ltr';
diff --git a/src/index.css b/src/index.css
index a4a4228..c379de1 100644
--- a/src/index.css
+++ b/src/index.css
@@ -8,10 +8,13 @@
   --font-label: "Archivo", sans-serif;
   --font-arabic: "Cairo", "IBM Plex Sans Arabic", sans-serif;
   --font-arabic-heading: "Amiri", serif;
   --font-jewelry: "Fraunces", serif;
 
+  --text-micro: 11px;
+  --text-caption: 12px;
+
   --color-gold: #A2492B;
   --color-gold-light: #C45A3C;
   --color-gold-dark: #7A3520;
   --color-onyx: #161513;
   --color-bone: #EFEAE2;
@@ -94,16 +97,12 @@
   [dir="rtl"] .text-5xl { font-size: 3.25rem; }
   [dir="rtl"] .text-6xl { font-size: 4rem; }
   [dir="rtl"] .text-7xl { font-size: 5rem; }
   [dir="rtl"] .text-8xl { font-size: 6.5rem; }
   [dir="rtl"] .text-9xl { font-size: 8.5rem; }
-  /* Pixel-based sizes: enlarge by ~25% */
-  [dir="rtl"] .text-\[8px\] { font-size: 11px; }
-  [dir="rtl"] .text-\[9px\] { font-size: 12px; }
-  [dir="rtl"] .text-\[10px\] { font-size: 13px; }
-  [dir="rtl"] .text-\[11px\] { font-size: 14px; }
-  [dir="rtl"] .text-\[12px\] { font-size: 15px; }
+  [dir="rtl"] .text-micro { font-size: 14px; }
+  [dir="rtl"] .text-caption { font-size: 15px; }
   /* Tracking is meaningless in Arabic and causes rendering issues */
   [dir="rtl"] .tracking-widest { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-wider { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.3em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.2em\] { letter-spacing: 0 !important; }
diff --git a/src/lib/email.ts b/src/lib/email.ts
index 729798f..433159c 100644
--- a/src/lib/email.ts
+++ b/src/lib/email.ts
@@ -206,6 +206,82 @@ export async function sendRentalReminderEmail(
     if (error) return { success: false, error: error.message };
     return { success: true };
   } catch (err) {
     return { success: false, error: String(err) };
   }
+}
+
+export async function sendAppointmentConfirmationEmail(data: {
+  name: string;
+  email: string;
+  date: string;
+  time: string;
+  gowns: string[];
+}): Promise<{ success: boolean; error?: string }> {
+  try {
+    const resend = getResendClient();
+    if (!resend) return { success: false, error: 'not-configured' };
+
+    const html = `
+      <!DOCTYPE html>
+      <html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1f1f1f;max-width:600px;margin:0 auto;padding:24px;">
+        <div style="text-align:center;margin-bottom:32px;">
+          <h1 style="font-family:'Playfair Display',Georgia,serif;color:#0a0a0a;margin:0 0 8px;font-size:28px;">Riman Fashion</h1>
+          <p style="color:#666;font-size:14px;margin:0;">Atelier Riman ΓÇö Sharjah</p>
+        </div>
+        <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;padding:24px;">
+          <h2 style="margin:0 0 16px;font-size:20px;">Your Private Viewing</h2>
+          <p>Dear <strong>${data.name}</strong>,</p>
+          <p>Your viewing request has been received for <strong>${new Date(data.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong> at <strong>${data.time}</strong>.</p>
+          ${data.gowns.length ? `<p>Pieces prepared for you:<br/><em>${data.gowns.join('<br/>')}</em></p>` : ''}
+          <p style="margin-bottom:0;">Al Zahra St, Sharjah, UAE. To reschedule, simply reply to this email.</p>
+        </div>
+        <p style="font-size:12px;color:#999;text-align:center;margin-top:32px;">Atelier Riman ┬╖ hello@rimanfashion.com</p>
+      </body></html>`;
+
+    const { error } = await resend.emails.send({
+      from: import.meta.env.RESEND_FROM_EMAIL || 'Riman Fashion <orders@rimanfashion.com>',
+      to: data.email,
+      subject: `Private Viewing Request ΓÇö ${data.date}`,
+      html,
+    });
+    if (error) return { success: false, error: error.message };
+    return { success: true };
+  } catch (err) {
+    console.error('sendAppointmentConfirmationEmail error:', err);
+    return { success: false, error: String(err) };
+  }
+}
+
+export async function sendAppointmentAdminAlert(data: {
+  name: string;
+  email: string;
+  phone: string;
+  date: string;
+  time: string;
+  gowns: string[];
+}): Promise<{ success: boolean; error?: string }> {
+  try {
+    const resend = getResendClient();
+    if (!resend) return { success: false, error: 'not-configured' };
+
+    const adminEmail = import.meta.env.RESEND_ADMIN_EMAIL || 'admin@rimanfashion.com';
+    const html = `
+      <h2>New Viewing Request</h2>
+      <p><strong>${data.name}</strong> ┬╖ ${data.phone} ┬╖ ${data.email}</p>
+      <p><strong>Requested:</strong> ${data.date} at ${data.time}</p>
+      ${data.gowns.length ? `<p><strong>Gowns:</strong> ${data.gowns.join(', ')}</p>` : ''}
+      <p><a href="https://riman-fashion-v2.netlify.app/admin/appointments">Open Admin Calendar</a></p>`;
+
+    const { error } = await resend.emails.send({
+      from: import.meta.env.RESEND_FROM_EMAIL || 'Riman Fashion <orders@rimanfashion.com>',
+      to: adminEmail,
+      subject: `≡ƒôà Viewing Request ΓÇö ${data.name}`,
+      html,
+    });
+    if (error) return { success: false, error: error.message };
+    return { success: true };
+  } catch (err) {
+    console.error('sendAppointmentAdminAlert error:', err);
+    return { success: false, error: String(err) };
+  }
 }
\ No newline at end of file
diff --git a/src/lib/seo.ts b/src/lib/seo.ts
index a72f162..2a693f2 100644
--- a/src/lib/seo.ts
+++ b/src/lib/seo.ts
@@ -48,15 +48,10 @@ export const ROUTE_META: Record<string, RouteMeta> = {
   },
   '/contact': {
     title: 'Contact | Atelier Riman',
     description: 'Visit our Sharjah atelier for a private consultation. Book an appointment to explore our bridal and evening collections with our master stylists.',
   },
-  '/blog': {
-    title: 'Journal | Atelier Riman',
-    description: 'Explore the Atelier Riman journal ΓÇö bridal style guides, fashion insights, and the stories behind our collections.',
-    ogType: 'article',
-  },
   '/faq': {
     title: 'FAQ | Atelier Riman',
     description: 'Find answers to common questions about Atelier Riman\'s bridal and evening wear, including sizing, rentals, alterations, and ordering.',
   },
   '/alterations': {
diff --git a/src/lib/whatsapp.ts b/src/lib/whatsapp.ts
new file mode 100644
index 0000000..acedfef
--- /dev/null
+++ b/src/lib/whatsapp.ts
@@ -0,0 +1,5 @@
+const WHATSAPP_NUMBER = '971553730792';
+
+export function buildWhatsAppUrl(message: string): string {
+  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
+}
diff --git a/src/pages/AboutPage.tsx b/src/pages/AboutPage.tsx
index d292f86..bb11c22 100644
--- a/src/pages/AboutPage.tsx
+++ b/src/pages/AboutPage.tsx
@@ -21,11 +21,11 @@ export default function AboutPage() {
         
         <div className="container mx-auto px-6 relative z-10 text-center">
           <motion.span 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
-            className="text-[10px] text-white/70 uppercase tracking-[0.5em] mb-6 block"
+            className="text-micro text-white/70 uppercase tracking-[0.5em] mb-6 block"
           >
             {t('about.hero_subtitle')}
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
@@ -77,11 +77,11 @@ export default function AboutPage() {
             <div className="absolute -bottom-10 -left-10 bg-ivory p-10 hidden md:block border border-stone-100 max-w-xs">
               <Quote className="text-gold w-8 h-8 mb-4" />
               <p className="font-body text-stone-800 italic text-sm mb-4">
                 "{t('about.quote')}"
               </p>
-              <span className="text-[10px] uppercase tracking-widest text-stone-400">{t('about.quote_author')}</span>
+              <span className="text-micro uppercase tracking-widest text-stone-600">{t('about.quote_author')}</span>
             </div>
           </motion.div>
         </div>
       </section>
 
@@ -121,11 +121,11 @@ export default function AboutPage() {
       {/* The Design Team Section */}
       <section className="section-padding bg-ivory">
         <ScrollReveal>
           <div className="container mx-auto">
             <div className="flex flex-col items-center text-center mb-16">
-              <h2 className="heading-editorial text-stone-400 text-sm mb-4">{t('about.visionaries')}</h2>
+              <h2 className="heading-editorial text-stone-600 text-sm mb-4">{t('about.visionaries')}</h2>
               <h3 className="font-heading text-4xl text-stone-800 tracking-wide">{t('about.collective')}</h3>
               <div className="divider-gold mt-6" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
@@ -154,16 +154,16 @@ export default function AboutPage() {
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
             <img src="/assets/rimanfashion_3542687554351211237_227867687_2_2025-01-10.jpg" className="w-full aspect-square object-cover" alt="Riman atelier beadwork detail" loading="lazy" />
             <div className="bg-ivory flex flex-col justify-center p-8 text-center border border-stone-50">
                <h4 className="font-heading text-3xl text-gold mb-2">10k+</h4>
-                <p className="text-[10px] text-stone-400 uppercase tracking-widest">{t('about.stat_beads')}</p>
+                <p className="text-micro text-stone-600 uppercase tracking-widest">{t('about.stat_beads')}</p>
             </div>
             <img src="/assets/rimanfashion_3638158883472325906_1739454936_2_2025-05-22.jpg" className="w-full aspect-square object-cover" alt="Riman couture runway collection" loading="lazy" />
             <div className="bg-stone-900 text-ivory flex flex-col justify-center p-8 text-center">
                <h4 className="font-heading text-3xl text-gold mb-2">120</h4>
-                <p className="text-[10px] text-ivory/40 uppercase tracking-widest">{t('about.stat_runways')}</p>
+                <p className="text-micro text-ivory/40 uppercase tracking-widest">{t('about.stat_runways')}</p>
             </div>
           </div>
         </div>
       </section>
     </div>
@@ -183,11 +183,11 @@ function TeamMember({ name, role, image }: { name: string, role: string, image:
         <div className="absolute inset-0 bg-onyx/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <span className="w-12 h-px bg-gold" />
         </div>
       </div>
       <h4 className="font-heading text-lg text-stone-800 mb-1">{name}</h4>
-      <p className="text-[10px] tracking-widest text-gold uppercase">{role}</p>
+      <p className="text-micro tracking-widest text-gold uppercase">{role}</p>
     </div>
   );
 }
 
 function Pillar({ icon: Icon, title, desc }: any) {
diff --git a/src/pages/AlterationsPage.tsx b/src/pages/AlterationsPage.tsx
index 6ef9721..c2134e7 100644
--- a/src/pages/AlterationsPage.tsx
+++ b/src/pages/AlterationsPage.tsx
@@ -24,11 +24,11 @@ export default function AlterationsPage() {
             animate={{ opacity: 1, y: 0 }}
             className="font-heading text-5xl md:text-7xl text-stone-800 tracking-tight mb-8"
           >
             {t('alt.hero_title')}
           </motion.h1>
-          <p className="font-body text-stone-500 text-sm md:text-base tracking-widest uppercase mb-12 max-w-2xl mx-auto leading-relaxed">
+          <p className="font-body text-stone-600 text-sm md:text-base tracking-widest uppercase mb-12 max-w-2xl mx-auto leading-relaxed">
             {t('alt.hero_desc')}
           </p>
           <div className="flex flex-wrap justify-center gap-6">
             <Link to="/contact" className="btn-luxury px-12 italic">{t('alt.book_fitting')}</Link>
           </div>
@@ -95,22 +95,22 @@ export default function AlterationsPage() {
            />
           <div className="p-12 md:p-20 flex flex-col justify-center">
             <h3 className="font-heading text-3xl md:text-4xl text-stone-800 mb-8 leading-tight">
               {t('alt.cta_heading')}
             </h3>
-            <p className="font-body text-stone-500 mb-10 text-sm leading-loose">
+            <p className="font-body text-stone-600 mb-10 text-sm leading-loose">
               {t('alt.cta_desc')}
             </p>
             <div className="space-y-4">
               <div className="flex items-center gap-4 text-xs tracking-widest text-stone-800 uppercase font-bold">
                  <Calendar className="w-4 h-4 text-gold" /> {t('alt.available')}
               </div>
               <div className="flex items-center gap-4 text-xs tracking-widest text-stone-800 uppercase font-bold">
                  <Ruler className="w-4 h-4 text-gold" /> {t('alt.guarantee')}
               </div>
             </div>
-            <Link to="/contact" className="mt-12 group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-gold font-black transition-all hover:gap-6">
+            <Link to="/contact" className="mt-12 group flex items-center gap-4 text-micro uppercase tracking-[0.4em] text-gold font-black transition-all hover:gap-6">
               {t('alt.inquire')} <ArrowRight className="w-4 h-4" />
             </Link>
           </div>
         </div>
       </section>
@@ -128,9 +128,9 @@ function ServiceCard({ icon: Icon, title, desc }: any) {
     <div className="bg-ivory p-12 border border-stone-100 hover:border-gold/30 transition-all duration-500 group">
       <div className="w-12 h-12 bg-ivory text-gold flex items-center justify-center mb-8 rounded-sm group-hover:bg-gold group-hover:text-white transition-colors">
         <Icon className="w-5 h-5" />
       </div>
       <h3 className="font-heading text-xl mb-4 tracking-widest uppercase text-stone-800">{title}</h3>
-      <p className="font-body text-xs text-stone-400 leading-relaxed uppercase tracking-wider">{desc}</p>
+      <p className="font-body text-xs text-stone-600 leading-relaxed uppercase tracking-wider">{desc}</p>
     </div>
   );
 }
diff --git a/src/pages/AppointmentPage.tsx b/src/pages/AppointmentPage.tsx
index c2e3fd3..00fb36e 100644
--- a/src/pages/AppointmentPage.tsx
+++ b/src/pages/AppointmentPage.tsx
@@ -1,10 +1,13 @@
 import { useState } from 'react';
-import { Link } from 'react-router-dom';
+import { Link, useLocation } from 'react-router-dom';
+import type { GownRef } from '../types';
 import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { createAppointment } from '../services/appointments';
+import { sendAppointmentConfirmationEmail, sendAppointmentAdminAlert } from '../lib/email';
+import { buildWhatsAppUrl } from '../lib/whatsapp';
 import { useLanguage } from '../contexts/LanguageContext';
 
 const SERVICE_TYPES = [
   { value: 'bridal', label: 'Bridal Consultation', icon: '≡ƒæ░' },
   { value: 'evening', label: 'Evening Wear Styling', icon: '≡ƒæù' },
@@ -32,23 +35,26 @@ const SLOT_PERIOD: Record<string, 'AM' | 'PM'> = {
 
 const formatSlot = (slot: string) => `${slot} ${SLOT_PERIOD[slot]}`;
 
 export default function AppointmentPage() {
   const [step, setStep] = useState(1);
-  const { t } = useLanguage();
+  const { t, isRtl } = useLanguage();
+  const location = useLocation();
+  const incomingGowns: GownRef[] = (location.state as { gowns?: GownRef[] } | null)?.gowns ?? [];
+  const gownNames = incomingGowns.map(g => `${g.name}${g.size ? ` (${g.size})` : ''}`);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [error, setError] = useState('');
-  const [form, setForm] = useState({
+  const [form, setForm] = useState(() => ({
     name: '',
     email: '',
     phone: '',
     date: '',
     time: '',
-    service_type: '',
-    notes: '',
-  });
+    service_type: incomingGowns.some(g => g.intent === 'rent') ? 'rental' : incomingGowns.length ? 'bridal' : '',
+    notes: gownNames.length ? `Interested in: ${gownNames.join(', ')}` : '',
+  }));
 
   const updateForm = (field: string, value: string) => {
     setForm(prev => ({ ...prev, [field]: value }));
     if (error) setError('');
   };
@@ -77,11 +83,15 @@ export default function AppointmentPage() {
         phone: form.phone,
         date: form.date,
         time: form.time,
         service_type: form.service_type,
         notes: form.notes,
+        interested_gowns: incomingGowns.length ? incomingGowns : null,
       });
+      const gownList = gownNames.length ? gownNames : [];
+      sendAppointmentConfirmationEmail({ name: form.name, email: form.email, date: form.date, time: form.time, gowns: gownList }).catch(err => console.error('Confirmation email failed:', err));
+      sendAppointmentAdminAlert({ name: form.name, email: form.email, phone: form.phone, date: form.date, time: form.time, gowns: gownList }).catch(err => console.error('Admin alert failed:', err));
       setIsSubmitted(true);
     } catch (err) {
       console.error('[Riman] Appointment booking failed:', err);
       setError(t('appointment.something_wrong'));
     } finally {
@@ -100,28 +110,40 @@ export default function AppointmentPage() {
           <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8">
             <CheckCircle2 className="w-10 h-10 text-gold" />
           </div>
           <h1 className="font-heading text-4xl font-light text-stone-800 mb-4">{t('appointment.booked')}</h1>
           <div className="w-12 h-px bg-gold mx-auto mb-6" />
-          <p className="font-body text-stone-500 leading-relaxed mb-2">
+          <p className="font-body text-stone-600 leading-relaxed mb-2">
             {t('appointment.thank_you')}, <span className="text-stone-800 font-semibold">{form.name}</span>.
           </p>
-          <p className="font-body text-stone-500 leading-relaxed mb-8">
-            {t('appointment.appointment_booked_for')} <span className="text-stone-800 font-semibold">{new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> {t('appointment.at')} <span className="text-stone-800 font-semibold">{form.time}</span>.
+          <p className="font-body text-stone-600 leading-relaxed mb-8">
+            {t('appointment.appointment_booked_for')} <span className="text-stone-800 font-semibold">{new Date(form.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> {t('appointment.at')} <span className="text-stone-800 font-semibold">{form.time}</span>.
           </p>
           <div className="w-12 h-px bg-gold mx-auto mb-6" />
-          <p className="font-body text-sm text-stone-400 mb-10">{t('appointment.confirmation_sent')} {form.email}. {t('appointment.our_team_reach')}</p>
+          <p className="font-body text-sm text-stone-600 mb-10">{t('appointment.confirmation_sent')} {form.email}. {t('appointment.our_team_reach')}</p>
+          <a
+            href={buildWhatsAppUrl(
+              incomingGowns.length
+                ? `${t('appointment.booked')} ΓÇö ${form.name}, ${form.date} ${form.time}. ${t('appointment.your_gowns')}: ${gownNames.join(', ')}`
+                : `${t('appointment.booked')} ΓÇö ${form.name}, ${form.date} ${form.time}`
+            )}
+            target="_blank"
+            rel="noopener noreferrer"
+            className="btn-luxury-outline inline-block mt-4 px-10"
+          >
+            {t('appointment.whatsapp_continue')}
+          </a>
           <Link to="/collection/all" className="btn-luxury">{t('appointment.explore_collection')}</Link>
         </motion.div>
       </div>
     );
   }
 
   return (
     <div className="pt-24 min-h-screen bg-champagne">
       <div className="container mx-auto px-6 py-16 max-w-4xl">
-        <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-400 mb-8">
+        <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-600 mb-8">
           <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
           <span>/</span>
           <span className="text-stone-800 font-medium">{t('cta.appointment')}</span>
         </nav>
 
@@ -131,23 +153,23 @@ export default function AppointmentPage() {
               <span className="w-8 h-px bg-gold" />
               <Sparkles className="w-4 h-4 text-gold" />
               <span className="w-8 h-px bg-gold" />
             </div>
             <h1 className="font-heading text-4xl md:text-5xl font-light text-stone-800 mb-4">{t('appointment.heading')}</h1>
-            <p className="font-body text-stone-500 max-w-xl mx-auto leading-relaxed">
+            <p className="font-body text-stone-600 max-w-xl mx-auto leading-relaxed">
               {t('appointment.desc')}
             </p>
           </div>
 
           {/* Progress Steps */}
           <div className="flex items-center justify-center gap-4 mb-12">
             {[1, 2, 3].map(s => (
               <button key={s} onClick={() => { if (s < step) setStep(s); }} className="flex items-center gap-3">
-                <div className={step >= s ? "w-10 h-10 bg-gold text-white flex items-center justify-center text-xs font-bold transition-all" : "w-10 h-10 border border-stone-200 text-stone-400 flex items-center justify-center text-xs font-bold"}>
+                <div className={step >= s ? "w-10 h-10 bg-gold text-white flex items-center justify-center text-xs font-bold transition-all" : "w-10 h-10 border border-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold"}>
                   {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                 </div>
-                <span className={step >= s ? "text-xs tracking-widest uppercase font-bold text-stone-800 hidden md:block" : "text-xs tracking-widest uppercase text-stone-400 hidden md:block"}>
+                <span className={step >= s ? "text-xs tracking-widest uppercase font-bold text-stone-800 hidden md:block" : "text-xs tracking-widest uppercase text-stone-600 hidden md:block"}>
                   {s === 1 ? t('appointment.step_details') : s === 2 ? t('appointment.step_schedule') : t('appointment.step_confirm')}
                 </span>
                 {s < 3 && <div className={step > s ? "w-12 h-px bg-gold hidden md:block" : "w-12 h-px bg-stone-200 hidden md:block"} />}
               </button>
             ))}
@@ -158,35 +180,45 @@ export default function AppointmentPage() {
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-ivory p-8 md:p-12 border border-stone-100">
                 <div className="mb-8">
                   <h2 className="font-heading text-2xl font-light text-stone-800">{t('appointment.your_details')}</h2>
                   <div className="w-8 h-px bg-gold mt-3" />
                 </div>
+                {incomingGowns.length > 0 && (
+                  <div className="mb-6 p-4 border border-gold/30 bg-gold/[0.04]">
+                    <p className="text-micro tracking-widest uppercase text-stone-800 font-bold mb-2">{t('appointment.your_gowns')}</p>
+                    <ul className="space-y-1">
+                      {incomingGowns.map((g, i) => (
+                        <li key={`${g.id}-${i}`} className="text-xs text-stone-600 italic">{g.name}{g.size ? ` ┬╖ ${g.size}` : ''}</li>
+                      ))}
+                    </ul>
+                  </div>
+                )}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.full_name')}</label>
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">{t('appointment.full_name')}</label>
                     <div className="relative">
-                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
-                      <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your full name" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
+                      <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your full name" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                     </div>
                   </div>
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.email')}</label>
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">{t('appointment.email')}</label>
                     <div className="relative">
-                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
-                      <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="your@email.com" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
+                      <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="your@email.com" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                     </div>
                   </div>
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.phone')}</label>
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">{t('appointment.phone')}</label>
                     <div className="relative">
-                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
-                      <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+971 50 000 0000" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
+                      <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+971 50 000 0000" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                     </div>
                   </div>
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.service_type')}</label>
-                    <select value={form.service_type} onChange={e => updateForm('service_type', e.target.value)} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500">
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">{t('appointment.service_type')}</label>
+                    <select value={form.service_type} onChange={e => updateForm('service_type', e.target.value)} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600">
                       <option value="">{t('appointment.select_service')}</option>
                       {SERVICE_TYPES.map(s => (
                         <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
                       ))}
                     </select>
@@ -203,18 +235,18 @@ export default function AppointmentPage() {
                   <h2 className="font-heading text-2xl font-light text-stone-800">{t('appointment.choose_datetime')}</h2>
                   <div className="w-8 h-px bg-gold mt-3" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-4">
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-4">
                       <Calendar className="w-4 h-4 inline mr-2" />
                       {t('appointment.select_date')}
                     </label>
-                    <input type="date" value={form.date} onChange={e => updateForm('date', e.target.value)} min={today} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                    <input type="date" value={form.date} onChange={e => updateForm('date', e.target.value)} min={today} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                   </div>
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-4">
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-4">
                       <Clock className="w-4 h-4 inline mr-2" />
                       {t('appointment.select_time')}
                     </label>
                     <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                       {TIME_SLOTS.map(slot => (
@@ -230,15 +262,15 @@ export default function AppointmentPage() {
                       ))}
                     </div>
                   </div>
                 </div>
                 <div className="mt-6">
-                  <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">
+                  <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">
                     <MessageSquare className="w-4 h-4 inline mr-2" />
                     {t('appointment.special_requests')}
                   </label>
-                  <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)} rows={3} placeholder={t('appointment.notes_placeholder')} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                  <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)} rows={3} placeholder={t('appointment.notes_placeholder')} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                 </div>
                 {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                 <div className="flex gap-4 mt-8">
                   <button onClick={() => setStep(1)} className="btn-luxury-outline">{t('appointment.back')}</button>
                   <button onClick={() => { if (form.date && form.time) { setError(''); setStep(3); } else setError(t('appointment.select_date_time')); }} className="btn-luxury">{t('appointment.review_booking')}</button>
@@ -253,37 +285,37 @@ export default function AppointmentPage() {
                   <div className="w-8 h-px bg-gold mt-3" />
                 </div>
                 <div className="bg-ivory p-8 border border-stone-100 mb-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.name')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.name')}</p>
                       <p className="font-heading text-stone-800">{form.name}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.email_label')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.email_label')}</p>
                       <p className="font-heading text-stone-800">{form.email}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.phone_label')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.phone_label')}</p>
                       <p className="font-heading text-stone-800">{form.phone}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.service_label')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.service_label')}</p>
                       <p className="font-heading text-stone-800">{SERVICE_TYPES.find(s => s.value === form.service_type)?.label}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.date_label')}</p>
-                      <p className="font-heading text-stone-800">{form.date ? new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.date_label')}</p>
+                      <p className="font-heading text-stone-800">{form.date ? new Date(form.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.time_label')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.time_label')}</p>
                       <p className="font-heading text-stone-800">{form.time}</p>
                     </div>
                   </div>
                   {form.notes && (
                     <div className="mt-6 pt-6 border-t border-stone-200">
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.special_requests')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.special_requests')}</p>
                       <p className="font-body text-stone-600 text-sm">{form.notes}</p>
                     </div>
                   )}
                 </div>
                 {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
diff --git a/src/pages/Auth.tsx b/src/pages/Auth.tsx
index 7ea996d..e0f8f84 100644
--- a/src/pages/Auth.tsx
+++ b/src/pages/Auth.tsx
@@ -75,11 +75,11 @@ export default function Auth() {
           <Logo variant="gold" className="w-20 mb-6" />
           <h1 className="font-heading text-3xl text-stone-800 tracking-wider uppercase mb-3">
             {isLogin ? t('auth.signin') : t('auth.signup')}
           </h1>
           <div className="w-12 h-px bg-gold mb-3" />
-          <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase">
+          <p className="font-body text-stone-600 text-micro tracking-[0.2em] uppercase">
             {isLogin ? t('auth.welcome_back') : t('auth.join')}
           </p>
         </div>
 
         <AnimatePresence mode="wait">
@@ -93,11 +93,11 @@ export default function Auth() {
               <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-8 h-8" />
               </div>
               <h3 className="font-heading text-xl text-stone-800 mb-2 uppercase tracking-widest">{t('auth.authenticated')}</h3>
               <div className="w-12 h-px bg-gold mx-auto mb-3" />
-              <p className="text-stone-400 text-[10px] tracking-widest uppercase">{t('auth.redirecting')}</p>
+              <p className="text-stone-600 text-micro tracking-widest uppercase">{t('auth.redirecting')}</p>
             </motion.div>
           ) : (
             <motion.form
               key="form"
               initial={{ opacity: 0 }}
@@ -106,11 +106,11 @@ export default function Auth() {
               onSubmit={handleSubmit}
               className="space-y-6 relative z-10"
             >
               {!isLogin && (
                 <div className="space-y-2">
-                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
+                  <label className="text-micro font-bold text-stone-600 uppercase tracking-widest flex items-center gap-2">
                     <User className="w-3 h-3 text-gold" /> {t('auth.full_name')}
                   </label>
                   <input
                     type="text"
                     required
@@ -121,11 +121,11 @@ export default function Auth() {
                   />
                 </div>
               )}
 
               <div className="space-y-2">
-                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
+                <label className="text-micro font-bold text-stone-600 uppercase tracking-widest flex items-center gap-2">
                   <Mail className="w-3 h-3 text-gold" /> {t('auth.email')}
                 </label>
                 <input
                   type="email"
                   required
@@ -135,11 +135,11 @@ export default function Auth() {
                   placeholder={t('auth.email_placeholder')}
                 />
               </div>
 
               <div className="space-y-2">
-                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
+                <label className="text-micro font-bold text-stone-600 uppercase tracking-widest flex items-center gap-2">
                   <Lock className="w-3 h-3 text-gold" /> {t('auth.password')}
                 </label>
                 <input
                   type="password"
                   required
@@ -149,22 +149,22 @@ export default function Auth() {
                   className="w-full bg-stone-50 border-stone-100 p-4 text-xs tracking-widest outline-none focus:bg-ivory focus:border-gold transition-all"
                   placeholder={t('auth.password_placeholder')}
                 />
               </div>
 
-              {displayError && <p className="text-[10px] text-rose-500 uppercase tracking-widest text-center">{displayError}</p>}
+              {displayError && <p className="text-micro text-rose-500 uppercase tracking-widest text-center">{displayError}</p>}
 
               <button type="submit" className="w-full btn-luxury group flex items-center justify-center gap-3 !py-5">
                 {isLogin ? t('auth.enter_atelier') : t('auth.create_profile')}
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
 
               <div className="pt-6 border-t border-stone-100 text-center space-y-4">
                 <button
                   type="button"
                   onClick={() => { setIsLogin(!isLogin); setLocalError(''); }}
-                  className="text-[10px] text-stone-400 uppercase tracking-[0.2em] hover:text-gold transition-colors block w-full"
+                  className="text-micro text-stone-600 uppercase tracking-[0.2em] hover:text-gold transition-colors block w-full"
                 >
                   {isLogin ? t('auth.no_account') : t('auth.has_account')}
                 </button>
 
                 <button
@@ -173,11 +173,11 @@ export default function Auth() {
                     localStorage.clear();
                     sessionStorage.clear();
                     navigate('/auth', { replace: true });
                     window.location.reload();
                   }}
-                  className="text-[8px] text-stone-300 uppercase tracking-[0.3em] hover:text-rose-400 transition-colors"
+                  className="text-micro text-stone-500 uppercase tracking-[0.3em] hover:text-rose-400 transition-colors"
                 >
                   {t('auth.clear_session')}
                 </button>
               </div>
             </motion.form>
diff --git a/src/pages/BlogPage.tsx b/src/pages/BlogPage.tsx
deleted file mode 100644
index 6803391..0000000
--- a/src/pages/BlogPage.tsx
+++ /dev/null
@@ -1,152 +0,0 @@
-import { motion } from 'motion/react';
-import { ArrowRight, Clock, User, Tag } from 'lucide-react';
-import { useLanguage } from '../contexts/LanguageContext';
-
-export default function BlogPage() {
-  const { t } = useLanguage();
-
-  const articles = [
-    {
-      id: 1,
-      title: t('blog.article1_title'),
-      excerpt: t('blog.article1_excerpt'),
-      image: "/images/journal-featured.jpg",
-      date: "April 15, 2026",
-      author: "Fatma Al-Zahra",
-      category: t('blog.article1_category')
-    },
-    {
-      id: 2,
-      title: t('blog.article2_title'),
-      excerpt: t('blog.article2_excerpt'),
-      image: "/images/journal-rental.jpg",
-      date: "March 28, 2026",
-      author: "Sarah Mansour",
-      category: t('blog.article2_category')
-    },
-    {
-      id: 3,
-      title: t('blog.article3_title'),
-      excerpt: t('blog.article3_excerpt'),
-      image: "/images/journal-craft.jpg",
-      date: "March 10, 2026",
-      author: "Atelier Team",
-      category: t('blog.article3_category')
-    }
-  ];
-  return (
-    <div className="pt-24 bg-ivory min-h-screen">
-      {/* Editorial Header */}
-      <header className="py-24 border-b border-stone-200 bg-ivory">
-        <div className="container mx-auto px-6 text-center">
-          <motion.span 
-            initial={{ opacity: 0 }}
-            animate={{ opacity: 1 }}
-            className="text-[10px] text-gold uppercase tracking-[0.6em] mb-4 block"
-          >
-            {t('blog.title')}
-          </motion.span>
-          <motion.h1 
-            initial={{ opacity: 0, scale: 0.98 }}
-            animate={{ opacity: 1, scale: 1 }}
-            className="font-heading text-5xl md:text-7xl text-stone-800 tracking-tight"
-          >
-            {t('blog.subtitle')}
-          </motion.h1>
-        </div>
-      </header>
-
-      {/* Featured Article */}
-      <section className="py-20 lg:py-32 container mx-auto px-6">
-        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
-          <motion.div 
-            initial={{ opacity: 0, x: -20 }}
-            whileInView={{ opacity: 1, x: 0 }}
-            className="relative group cursor-pointer"
-          >
-            <div className="overflow-hidden">
-               <img src={articles[0].image} alt={articles[0].title} className="w-full aspect-[16/9] object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
-            </div>
-            <div className="absolute top-6 left-6 bg-ivory px-4 py-2 text-[10px] uppercase font-bold tracking-widest">
-              {t('blog.latest')}
-            </div>
-          </motion.div>
-          <motion.div
-            initial={{ opacity: 0, x: 20 }}
-            whileInView={{ opacity: 1, x: 0 }}
-          >
-            <span className="text-[10px] text-gold uppercase tracking-widest font-bold mb-4 block">{articles[0].category}</span>
-            <h2 className="font-heading text-4xl text-stone-800 mb-6 leading-tight hover:text-gold transition-colors cursor-pointer">
-              {articles[0].title}
-            </h2>
-            <p className="font-body text-stone-500 mb-8 leading-relaxed italic">
-              "{articles[0].excerpt}"
-            </p>
-            <div className="flex items-center gap-6 mb-10 text-[10px] text-stone-400 uppercase tracking-widest border-y border-stone-100 py-4">
-              <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> 5 {t('blog.min_read')}</span>
-              <span className="flex items-center gap-2"><User className="w-3 h-3" /> By {articles[0].author}</span>
-            </div>
-            <button className="btn-luxury italic !px-12">{t('blog.read_editorial')}</button>
-          </motion.div>
-        </div>
-      </section>
-
-      {/* Grid Articles */}
-      <section className="pb-32 container mx-auto px-6">
-        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
-          {articles.slice(1).map((article) => (
-            <motion.article 
-              key={article.id}
-              initial={{ opacity: 0, y: 20 }}
-              whileInView={{ opacity: 1, y: 0 }}
-              className="group"
-            >
-              <div className="relative aspect-[4/3] overflow-hidden mb-8">
-                <img 
-                  src={article.image} 
-                  alt={article.title} 
-                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
-                  loading="lazy"
-                />
-                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors" />
-              </div>
-              <div className="flex items-center gap-3 mb-4">
-                 <Tag className="w-3 h-3 text-gold" />
-                 <span className="text-[10px] text-gold font-bold uppercase tracking-widest">{article.category}</span>
-              </div>
-              <h3 className="font-heading text-2xl text-stone-800 mb-4 group-hover:text-gold transition-colors leading-tight">
-                {article.title}
-              </h3>
-              <p className="font-body text-xs text-stone-400 uppercase tracking-wider mb-8 italic">
-                {article.date} ΓÇö By {article.author}
-              </p>
-              <div className="w-full h-px bg-stone-200 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mb-6" />
-              <button className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black group-hover:gap-6 transition-all">
-                {t('blog.view_journal')} <ArrowRight className="w-4 h-4 text-gold" />
-              </button>
-            </motion.article>
-          ))}
-        </div>
-
-        {/* Newsletter Teaser */}
-        <div className="mt-32 bg-stone-900 p-12 md:p-24 text-center relative overflow-hidden">
-           <div className="absolute inset-0 opacity-10 blur-3xl bg-gold/20" />
-           <div className="relative z-10 max-w-xl mx-auto">
-              <h3 className="font-heading text-3xl text-white mb-6 uppercase tracking-widest">{t('blog.join_circle')}</h3>
-              <p className="font-body text-ivory text-sm mb-10 leading-relaxed uppercase tracking-widest">
-                {t('blog.newsletter_desc')}
-             </p>
-             <div className="flex flex-col sm:flex-row gap-4">
-               <input 
-                type="email" 
-                 placeholder={t('blog.email_placeholder')}
-                className="flex-1 bg-white/5 border border-white/10 p-5 text-[10px] tracking-widest text-white outline-none focus:border-gold transition-colors" 
-              />
-              <button className="btn-luxury !whitespace-nowrap">{t('blog.subscribe')}</button>
-             </div>
-           </div>
-        </div>
-      </section>
-    </div>
-  );
-}
diff --git a/src/pages/Checkout.tsx b/src/pages/Checkout.tsx
index 4dcf3e7..621e04f 100644
--- a/src/pages/Checkout.tsx
+++ b/src/pages/Checkout.tsx
@@ -260,11 +260,11 @@ export default function Checkout() {
   if (items.length === 0 && !orderComplete) {
     return (
       <div className="pt-8 pb-20 px-6 min-h-[60vh] flex flex-col items-center justify-center text-center bg-ivory">
         <h1 className="font-heading text-4xl text-stone-800 uppercase mb-4">{t('checkout.empty')}</h1>
         <div className="w-12 h-px bg-gold mx-auto mb-6" />
-        <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-12 italic">{t('checkout.empty_desc')}</p>
+        <p className="font-body text-stone-600 text-sm tracking-widest uppercase mb-12 italic">{t('checkout.empty_desc')}</p>
         <Link to="/search" className="btn-luxury px-12">{t('checkout.explore')}</Link>
       </div>
     );
   }
 
@@ -278,13 +278,13 @@ export default function Checkout() {
         >
           <Check className="w-12 h-12" />
         </motion.div>
         <h1 className="font-heading text-4xl md:text-6xl text-stone-800 uppercase mb-4">{t('checkout.order_received')}</h1>
         <div className="w-12 h-px bg-gold mx-auto mb-6" />
-        <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-4">{t('checkout.order_preparing')}</p>
-        <p className="font-body text-stone-400 text-xs mb-4 uppercase italic">{t('checkout.confirmation_email')} {formData.email}</p>
-        <p className="font-body text-stone-400 text-xs mb-12 uppercase tracking-widest max-w-md">{t('checkout.contact_24h')}</p>
+        <p className="font-body text-stone-600 text-sm tracking-widest uppercase mb-4">{t('checkout.order_preparing')}</p>
+        <p className="font-body text-stone-600 text-xs mb-4 uppercase italic">{t('checkout.confirmation_email')} {formData.email}</p>
+        <p className="font-body text-stone-600 text-xs mb-12 uppercase tracking-widest max-w-md">{t('checkout.contact_24h')}</p>
         <div className="flex flex-col sm:flex-row gap-4">
           <Link to="/profile" className="btn-luxury px-12 italic">{t('checkout.view_dashboard')}</Link>
           <Link to="/search" className="btn-luxury-outline px-12">{t('checkout.back_to_shop')}</Link>
         </div>
       </div>
@@ -294,13 +294,13 @@ export default function Checkout() {
   return (
     <div className="bg-ivory min-h-screen">
       {/* Minimal top bar (replaces header on checkout) */}
       <div className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-sm border-b border-stone-100">
         <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
-          <Link to="/search" className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors">
+          <Link to="/search" className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors">
             <ArrowLeft className={cn("w-4 h-4", isRtl && "rotate-180")} />
-            <span className="text-[10px] tracking-[0.2em] uppercase font-bold hidden sm:inline">{t('checkout.back_to_shop')}</span>
+            <span className="text-micro tracking-[0.2em] uppercase font-bold hidden sm:inline">{t('checkout.back_to_shop')}</span>
           </Link>
           <Link to="/" className="font-heading text-sm tracking-[0.3em] uppercase text-stone-800">Atelier Riman</Link>
           <div className="w-20" />
         </div>
       </div>
@@ -455,29 +455,29 @@ export default function Checkout() {
 
                     {/* Details summary */}
                     <div className="bg-ivory/50 p-5 border border-gold/10 space-y-4">
                       <div className="flex items-center justify-between">
                         <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-stone-600">{t('checkout.your_details')}</h3>
-                        <button onClick={() => setStep(1)} className="text-[10px] tracking-widest uppercase text-gold font-bold hover:text-gold-dark transition-colors">
+                        <button onClick={() => setStep(1)} className="text-micro tracking-widest uppercase text-gold font-bold hover:text-gold-dark transition-colors">
                           {t('checkout.previous')}
                         </button>
                       </div>
-                      <div className="grid grid-cols-2 gap-4 text-[11px] tracking-wider uppercase">
+                      <div className="grid grid-cols-2 gap-4 text-micro tracking-wider uppercase">
                         <div>
-                          <span className="text-stone-400 block mb-0.5">Name</span>
+                          <span className="text-stone-600 block mb-0.5">{t('checkout.name_label')}</span>
                           <span className="text-stone-800 font-medium">{formData.firstName} {formData.lastName}</span>
                         </div>
                         <div>
-                          <span className="text-stone-400 block mb-0.5">{t('checkout.email')}</span>
+                          <span className="text-stone-600 block mb-0.5">{t('checkout.email')}</span>
                           <span className="text-stone-800 font-medium">{formData.email}</span>
                         </div>
                         <div>
-                          <span className="text-stone-400 block mb-0.5">{t('checkout.address')}</span>
+                          <span className="text-stone-600 block mb-0.5">{t('checkout.address')}</span>
                           <span className="text-stone-800 font-medium">{formData.address}</span>
                         </div>
                         <div>
-                          <span className="text-stone-400 block mb-0.5">{t('checkout.city')}</span>
+                          <span className="text-stone-600 block mb-0.5">{t('checkout.city')}</span>
                           <span className="text-stone-800 font-medium">{formData.city}, {formData.country}</span>
                         </div>
                       </div>
                     </div>
 
@@ -488,27 +488,27 @@ export default function Checkout() {
                         <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 items-center p-3 border border-stone-100">
                           <div className="w-14 h-18 bg-stone-100 flex-shrink-0 overflow-hidden">
                             <img src={item.images?.[0]} className="w-full h-full object-cover" alt={item.name} />
                           </div>
                           <div className="flex-1 min-w-0">
-                            <p className="text-[10px] text-stone-400 uppercase tracking-widest">{item.category}</p>
+                            <p className="text-micro text-stone-600 uppercase tracking-widest">{item.category}</p>
                             <p className="text-xs uppercase tracking-wider font-bold truncate">{item.name}</p>
-                            {item.selectedSize && <p className="text-[9px] text-stone-400 uppercase">{t('checkout.size')}: {item.selectedSize}</p>}
-                            {item.selectedDate && <p className="text-[9px] text-gold uppercase">{t('checkout.date')}: {new Date(item.selectedDate).toLocaleDateString()}</p>}
+                            {item.selectedSize && <p className="text-micro text-stone-600 uppercase">{t('checkout.size')}: {item.selectedSize}</p>}
+                            {item.selectedDate && <p className="text-micro text-gold uppercase">{t('checkout.date')}: {new Date(item.selectedDate).toLocaleDateString()}</p>}
                           </div>
                           <p className="text-xs text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
                         </div>
                       ))}
                     </div>
 
                     {/* Pricing (visible on mobile, hidden on desktop where sidebar shows it) */}
                     <div className="lg:hidden space-y-2 pt-4 border-t border-stone-100">
-                      <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+                      <div className="flex justify-between text-micro tracking-widest uppercase text-stone-600">
                         <span>{t('checkout.subtotal')}</span>
                         <span>{formatPrice(subtotal)}</span>
                       </div>
-                      <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+                      <div className="flex justify-between text-micro tracking-widest uppercase text-stone-600">
                         <span>{t('checkout.delivery')}</span>
                         <span>{t('checkout.complimentary')}</span>
                       </div>
                       <div className="flex justify-between font-heading text-xl pt-4 border-t border-stone-100 mt-4">
                         <span className="uppercase text-sm tracking-widest pt-1">{t('checkout.total')}</span>
@@ -516,11 +516,11 @@ export default function Checkout() {
                       </div>
                     </div>
 
                     {/* Order notes */}
                     <div className="space-y-3">
-                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-2">
+                      <label className="text-micro uppercase tracking-widest text-stone-600 font-bold flex items-center gap-2">
                         <MessageSquare className="w-3 h-3 text-gold" /> {t('checkout.order_notes')}
                       </label>
                       <textarea
                         value={orderNotes}
                         onChange={(e) => setOrderNotes(e.target.value)}
@@ -539,46 +539,46 @@ export default function Checkout() {
                           onClick={() => setPaymentMethod('atelier')}
                           className={cn(
                             "flex items-center gap-4 p-4 border text-left transition-all",
                             paymentMethod === 'atelier'
                               ? "bg-gold/5 border-gold/30 text-stone-800"
-                              : "bg-ivory border-stone-100 text-stone-400 hover:border-stone-300"
+                              : "bg-ivory border-stone-100 text-stone-600 hover:border-stone-300"
                           )}
                         >
-                          <Building2 className={cn("w-5 h-5 shrink-0", paymentMethod === 'atelier' ? 'text-gold' : 'text-stone-300')} />
+                          <Building2 className={cn("w-5 h-5 shrink-0", paymentMethod === 'atelier' ? 'text-gold' : 'text-stone-500')} />
                           <div>
-                            <p className="text-[10px] tracking-widest uppercase font-bold">{t('checkout.pay_atelier')}</p>
-                            <p className="text-[9px] text-stone-400 mt-0.5 tracking-wide">{t('checkout.pay_atelier_desc')}</p>
+                            <p className="text-micro tracking-widest uppercase font-bold">{t('checkout.pay_atelier')}</p>
+                            <p className="text-micro text-stone-600 mt-0.5 tracking-wide">{t('checkout.pay_atelier_desc')}</p>
                           </div>
                         </button>
                         <button
                           type="button"
                           onClick={() => setPaymentMethod('card')}
                           className={cn(
                             "flex items-center gap-4 p-4 border text-left transition-all",
                             paymentMethod === 'card'
                               ? "bg-gold/5 border-gold/30 text-stone-800"
-                              : "bg-ivory border-stone-100 text-stone-400 hover:border-stone-300"
+                              : "bg-ivory border-stone-100 text-stone-600 hover:border-stone-300"
                           )}
                         >
-                          <CreditCard className={cn("w-5 h-5 shrink-0", paymentMethod === 'card' ? 'text-gold' : 'text-stone-300')} />
+                          <CreditCard className={cn("w-5 h-5 shrink-0", paymentMethod === 'card' ? 'text-gold' : 'text-stone-500')} />
                           <div>
-                            <p className="text-[10px] tracking-widest uppercase font-bold">{t('checkout.pay_online')}</p>
-                            <p className="text-[9px] text-stone-400 mt-0.5 tracking-wide">{t('checkout.pay_online_desc')}</p>
+                            <p className="text-micro tracking-widest uppercase font-bold">{t('checkout.pay_online')}</p>
+                            <p className="text-micro text-stone-600 mt-0.5 tracking-wide">{t('checkout.pay_online_desc')}</p>
                           </div>
                         </button>
                       </div>
                     </div>
 
                     {/* Payment info box */}
                     <div className={cn("p-4 border flex items-start gap-3", paymentMethod === 'card' ? 'bg-emerald-50/50 border-emerald-200/50' : 'bg-gold/5 border-gold/10')}>
                       {paymentMethod === 'card' ? <CreditCard className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <Truck className="w-5 h-5 text-gold shrink-0 mt-0.5" />}
                       <div>
-                        <p className="text-[10px] tracking-widest text-stone-600 uppercase font-bold">
+                        <p className="text-micro tracking-widest text-stone-600 uppercase font-bold">
                           {paymentMethod === 'card' ? t('checkout.secure_online') : t('checkout.instore_payment')}
                         </p>
-                        <p className="text-[10px] text-stone-400 mt-1">
+                        <p className="text-micro text-stone-600 mt-1">
                           {paymentMethod === 'card'
                             ? t('checkout.secure_online_desc')
                             : t('checkout.instore_desc')}
                         </p>
                       </div>
@@ -587,11 +587,11 @@ export default function Checkout() {
                     {/* WhatsApp help */}
                     <a
                       href={`https://wa.me/${WHATSAPP_NUMBER}`}
                       target="_blank"
                       rel="noreferrer"
-                      className="flex items-center justify-center gap-2 py-3 border border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold hover:border-gold/30 hover:text-gold transition-all"
+                      className="flex items-center justify-center gap-2 py-3 border border-stone-200 text-micro tracking-[0.2em] uppercase text-stone-600 font-bold hover:border-gold/30 hover:text-gold transition-all"
                     >
                       <MessageCircle className="w-3.5 h-3.5" />
                       {t('checkout.whatsapp_support')}
                     </a>
 
@@ -612,16 +612,16 @@ export default function Checkout() {
                         )}
                       </button>
                     </div>
                     {submitError && (
                       <div className="p-4 border border-rose-200 bg-rose-50/50 text-center">
-                        <p className="text-rose-600 text-[10px] tracking-widest uppercase font-bold mb-2">{submitError}</p>
+                        <p className="text-rose-600 text-micro tracking-widest uppercase font-bold mb-2">{submitError}</p>
                         <a
                           href={`https://wa.me/${WHATSAPP_NUMBER}`}
                           target="_blank"
                           rel="noreferrer"
-                          className="text-[10px] tracking-widest uppercase text-gold font-bold hover:text-gold-dark transition-colors"
+                          className="text-micro tracking-widest uppercase text-gold font-bold hover:text-gold-dark transition-colors"
                         >
                           {t('checkout.whatsapp_support')} &rarr;
                         </a>
                       </div>
                     )}
@@ -639,14 +639,14 @@ export default function Checkout() {
                 onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                 className="w-full bg-onyx text-white p-4 flex items-center justify-between"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-1 h-5 bg-gold" />
-                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold">
+                  <span className="text-micro tracking-[0.2em] uppercase font-bold">
                     {t('checkout.order_summary')}
                   </span>
-                  <span className="text-[10px] text-stone-400">
+                  <span className="text-micro text-stone-400">
                     ({t('checkout.items_count').replace('{count}', String(items.length))})
                   </span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-gold text-sm font-heading">{formatPrice(subtotal)}</span>
@@ -666,26 +666,26 @@ export default function Checkout() {
                         <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3 items-center">
                           <div className="w-12 h-16 bg-stone-800 flex-shrink-0 overflow-hidden">
                             <img src={item.images?.[0]} className="w-full h-full object-cover grayscale-[0.3]" alt={item.name} />
                           </div>
                           <div className="flex-1 min-w-0">
-                            <p className="text-[9px] text-stone-500 uppercase tracking-widest">{item.category}</p>
-                            <p className="text-[11px] uppercase tracking-wider font-bold truncate text-white">{item.name}</p>
+                            <p className="text-micro text-stone-500 uppercase tracking-widest">{item.category}</p>
+                            <p className="text-micro uppercase tracking-wider font-bold truncate text-white">{item.name}</p>
                             <div className="flex flex-wrap gap-1.5 mt-1">
-                              {item.selectedSize && <span className="text-[9px] border border-stone-700 px-1.5 py-0.5 text-stone-400">{item.selectedSize}</span>}
-                              {item.selectedDate && <span className="text-[9px] border border-gold/30 px-1.5 py-0.5 text-gold">{new Date(item.selectedDate).toLocaleDateString()}</span>}
+                              {item.selectedSize && <span className="text-micro border border-stone-700 px-1.5 py-0.5 text-stone-400">{item.selectedSize}</span>}
+                              {item.selectedDate && <span className="text-micro border border-gold/30 px-1.5 py-0.5 text-gold">{new Date(item.selectedDate).toLocaleDateString()}</span>}
                             </div>
                           </div>
-                          <p className="text-[11px] text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
+                          <p className="text-micro text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
                         </div>
                       ))}
                       <div className="space-y-2 pt-3 border-t border-stone-800">
-                        <div className="flex justify-between text-[9px] tracking-widest uppercase text-stone-400">
+                        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
                           <span>{t('checkout.subtotal')}</span>
                           <span>{formatPrice(subtotal)}</span>
                         </div>
-                        <div className="flex justify-between text-[9px] tracking-widest uppercase text-stone-400">
+                        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
                           <span>{t('checkout.delivery')}</span>
                           <span>{t('checkout.complimentary')}</span>
                         </div>
                         <div className="flex justify-between font-heading text-lg pt-3 border-t border-stone-800">
                           <span className="uppercase text-xs tracking-widest">{t('checkout.total')}</span>
@@ -720,17 +720,17 @@ export default function Checkout() {
 function StepStep({ num, label, active, completed }: { num: number; label: string; active: boolean; completed: boolean }) {
   return (
     <div className="flex items-center gap-2.5">
       <div className={cn(
         "w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs transition-all duration-300 font-bold shrink-0",
-        completed ? "bg-gold border-gold text-white" : active ? "bg-gold/10 border-gold text-gold" : "border-stone-200 text-stone-300"
+        completed ? "bg-gold border-gold text-white" : active ? "bg-gold/10 border-gold text-gold" : "border-stone-200 text-stone-500"
       )}>
         {completed ? <Check className="w-4 h-4" /> : num}
       </div>
       <span className={cn(
-        "text-[10px] tracking-[0.15em] uppercase font-bold transition-colors hidden sm:inline",
-        active ? "text-stone-800" : "text-stone-300"
+        "text-micro tracking-[0.15em] uppercase font-bold transition-colors hidden sm:inline",
+        active ? "text-stone-800" : "text-stone-500"
       )}>{label}</span>
     </div>
   );
 }
 
@@ -743,13 +743,13 @@ function SectionHeading({ title }: { title: string }) {
   );
 }
 
 function TrustBadge({ icon, label }: { icon: ReactNode; label: string }) {
   return (
-    <div className="flex items-center gap-2 text-stone-400">
+    <div className="flex items-center gap-2 text-stone-600">
       <div className="text-gold">{icon}</div>
-      <span className="text-[9px] tracking-[0.2em] uppercase font-bold">{label}</span>
+      <span className="text-micro tracking-[0.2em] uppercase font-bold">{label}</span>
     </div>
   );
 }
 
 function OrderSidebar({ items, subtotal, paymentMethod, removeItem, t }: {
@@ -776,19 +776,19 @@ function OrderSidebar({ items, subtotal, paymentMethod, removeItem, t }: {
             >
               <div className="w-14 h-18 bg-stone-800 flex-shrink-0 overflow-hidden">
                 <img src={item.images?.[0]} className="w-full h-full object-cover grayscale-[0.3]" alt={item.name} />
               </div>
               <div className="flex-1 min-w-0">
-                <p className="text-[9px] text-stone-500 uppercase tracking-widest mb-0.5">{item.category}</p>
-                <h4 className="text-[11px] uppercase tracking-wider font-bold mb-1 truncate">{item.name}</h4>
+                <p className="text-micro text-stone-500 uppercase tracking-widest mb-0.5">{item.category}</p>
+                <h4 className="text-micro uppercase tracking-wider font-bold mb-1 truncate">{item.name}</h4>
                 <div className="flex flex-wrap gap-1.5 mb-1.5">
-                  {item.selectedSize && <span className="text-[9px] border border-stone-700 px-1.5 py-0.5 text-stone-400">{t('checkout.size')}: {item.selectedSize}</span>}
-                  {item.selectedDate && <span className="text-[9px] border border-gold/30 px-1.5 py-0.5 text-gold"><Calendar className="w-2 h-2 inline mr-0.5" />{new Date(item.selectedDate).toLocaleDateString()}</span>}
+                  {item.selectedSize && <span className="text-micro border border-stone-700 px-1.5 py-0.5 text-stone-400">{t('checkout.size')}: {item.selectedSize}</span>}
+                  {item.selectedDate && <span className="text-micro border border-gold/30 px-1.5 py-0.5 text-gold"><Calendar className="w-2 h-2 inline mr-0.5" />{new Date(item.selectedDate).toLocaleDateString()}</span>}
                 </div>
                 <div className="flex justify-between items-center">
-                  <p className="text-[11px] text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
-                  {item.quantity > 1 && <span className="text-[9px] text-stone-500">{t('checkout.qty')}: {item.quantity}</span>}
+                  <p className="text-micro text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
+                  {item.quantity > 1 && <span className="text-micro text-stone-500">{t('checkout.qty')}: {item.quantity}</span>}
                 </div>
               </div>
               <button
                 onClick={() => removeItem(item.id, item.selectedSize, item.intent)}
                 className="absolute -top-2 -right-2 w-5 h-5 bg-stone-800 text-stone-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all"
@@ -799,19 +799,19 @@ function OrderSidebar({ items, subtotal, paymentMethod, removeItem, t }: {
           ))}
         </AnimatePresence>
       </div>
 
       <div className="space-y-3 border-t border-stone-800 pt-6">
-        <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
           <span>{t('checkout.subtotal')}</span>
           <span>{formatPrice(subtotal)}</span>
         </div>
-        <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
           <span>{t('checkout.delivery')}</span>
           <span>{t('checkout.complimentary')}</span>
         </div>
-        <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
           <span>{t('checkout.vat')}</span>
           <span>{t('checkout.included')}</span>
         </div>
         <div className="flex justify-between font-heading text-lg pt-4 border-t border-stone-800 mt-3">
           <span className="uppercase text-xs tracking-widest">{t('checkout.total')}</span>
@@ -819,11 +819,11 @@ function OrderSidebar({ items, subtotal, paymentMethod, removeItem, t }: {
         </div>
       </div>
 
       <div className="mt-8 flex items-center gap-3 p-3 border border-white/5 bg-white/5">
         <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
-        <p className="text-[9px] tracking-widest leading-relaxed text-stone-400 uppercase">
+        <p className="text-micro tracking-widest leading-relaxed text-stone-400 uppercase">
           {paymentMethod === 'card' ? 'Secured by Stripe' : 'Secure Order ΓÇö Payment at Atelier'}
         </p>
       </div>
     </div>
   );
@@ -842,12 +842,12 @@ function Input({ label, value, onChange, onBlur, placeholder, className, disable
   autoComplete?: string;
 }) {
   return (
     <div className={cn("flex flex-col gap-2", className)}>
       <div className="flex justify-between items-center">
-        <label className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block">{label}</label>
-        {error && <span className="text-[9px] text-rose-500 uppercase tracking-widest font-bold">{error}</span>}
+        <label className="text-micro tracking-widest uppercase font-bold text-stone-600 block">{label}</label>
+        {error && <span className="text-micro text-rose-500 uppercase tracking-widest font-bold">{error}</span>}
       </div>
       <input
         type={type}
         value={value}
         onChange={(e) => onChange(e.target.value)}
diff --git a/src/pages/CollectionPage.tsx b/src/pages/CollectionPage.tsx
index 2f04350..99bdcee 100644
--- a/src/pages/CollectionPage.tsx
+++ b/src/pages/CollectionPage.tsx
@@ -103,17 +103,17 @@ export default function CollectionPage() {
 
   return (
     <div id="collection-page" className="pt-24 min-h-screen bg-ivory">
       <header className="section-padding !py-12 bg-ivory border-b border-stone-100">
         <div className="container mx-auto">
-          <nav className="flex gap-2 text-xs tracking-widest uppercase text-stone-400 mb-4">
+          <nav className="flex gap-2 text-xs tracking-widest uppercase text-stone-600 mb-4">
             <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
             <span>/</span>
             <span className="text-stone-800 font-medium">{t('cat.collection')}</span>
           </nav>
           <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider uppercase mb-4 leading-tight">{categoryTitle}</h1>
-          <p className="text-stone-500 font-body text-base tracking-wide max-w-2xl italic leading-relaxed">
+          <p className="text-stone-600 font-body text-base tracking-wide max-w-2xl italic leading-relaxed">
             {t('cat.subtitle')}
           </p>
         </div>
       </header>
 
@@ -126,12 +126,12 @@ export default function CollectionPage() {
                 {YEARS.map(year => (
                   <button
                     key={year}
                     onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                     className={cn(
-                      "px-4 py-2 text-[10px] tracking-widest uppercase font-bold transition-all border",
-                      selectedYear === year ? "border-gold text-gold" : "border-stone-200 text-stone-500 hover:border-gold hover:text-gold"
+                      "px-4 py-2 text-micro tracking-widest uppercase font-bold transition-all border",
+                      selectedYear === year ? "border-gold text-gold" : "border-stone-200 text-stone-600 hover:border-gold hover:text-gold"
                     )}
                   >
                     {year}
                   </button>
                 ))}
@@ -141,22 +141,22 @@ export default function CollectionPage() {
                 {SILHOUETTES.map(sil => (
                   <button
                     key={sil.value}
                     onClick={() => setSelectedSilhouette(sil.value === selectedSilhouette ? '' : sil.value)}
                     className={cn(
-                      "px-3 py-2 text-[10px] tracking-widest uppercase font-bold transition-all whitespace-nowrap",
-                      selectedSilhouette === sil.value ? "text-gold border-b-2 border-gold" : "text-stone-400 hover:text-gold"
+                      "px-3 py-2 text-micro tracking-widest uppercase font-bold transition-all whitespace-nowrap",
+                      selectedSilhouette === sil.value ? "text-gold border-b-2 border-gold" : "text-stone-600 hover:text-gold"
                     )}
                   >
                     {sil.label}
                   </button>
                 ))}
               </div>
             </div>
 
             <div className="flex items-center gap-4 flex-shrink-0">
-              <button onClick={() => setShowFilters(!showFilters)} className={cn("p-2 transition-colors", showFilters ? "text-gold" : "text-stone-400 hover:text-gold")}>
+              <button onClick={() => setShowFilters(!showFilters)} className={cn("p-2 transition-colors", showFilters ? "text-gold" : "text-stone-600 hover:text-gold")}>
                 <SlidersHorizontal className="w-5 h-5" />
               </button>
 
               <div className="relative">
                 <button 
@@ -205,11 +205,11 @@ export default function CollectionPage() {
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                 <div className="pt-4 pb-2 border-t border-stone-100 mt-4">
                   <div className="flex items-center gap-4">
-                    <span className="text-xs tracking-widest uppercase text-stone-400 font-bold">{t('collection.colors')}</span>
+                    <span className="text-xs tracking-widest uppercase text-stone-600 font-bold">{t('collection.colors')}</span>
                     <div className="flex items-center gap-2.5 flex-wrap">
                       {allAvailableColors.map(color => (
                         <button
                           key={color}
                           onClick={() => toggleColor(color)}
@@ -228,19 +228,19 @@ export default function CollectionPage() {
                         </button>
                       ))}
                     </div>
                   </div>
                   <div className="md:hidden mt-4">
-                    <span className="text-xs tracking-widest uppercase text-stone-400 font-bold block mb-2">{t('collection.silhouette')}</span>
+                    <span className="text-xs tracking-widest uppercase text-stone-600 font-bold block mb-2">{t('collection.silhouette')}</span>
                     <div className="flex flex-wrap gap-2">
                       {SILHOUETTES.map(sil => (
                         <button
                           key={sil.value}
                           onClick={() => setSelectedSilhouette(sil.value === selectedSilhouette ? '' : sil.value)}
                           className={cn(
-                            "px-3 py-2 text-[10px] tracking-widest uppercase font-bold transition-all border",
-                            selectedSilhouette === sil.value ? "bg-onyx text-white border-onyx" : "border-stone-200 text-stone-500 hover:border-gold"
+                            "px-3 py-2 text-micro tracking-widest uppercase font-bold transition-all border",
+                            selectedSilhouette === sil.value ? "bg-onyx text-white border-onyx" : "border-stone-200 text-stone-600 hover:border-gold"
                           )}
                         >
                           {sil.label}
                         </button>
                       ))}
@@ -251,12 +251,12 @@ export default function CollectionPage() {
             )}
           </AnimatePresence>
 
           {hasActiveFilters && (
             <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
-              <span className="text-[10px] tracking-widest uppercase text-stone-500">{filteredProducts.length} {t('collection.results')}</span>
-              <button onClick={clearFilters} className="text-[10px] tracking-[0.2em] uppercase text-gold hover:text-stone-800 transition-colors font-bold">{t('collection.clear_all')}</button>
+              <span className="text-micro tracking-widest uppercase text-stone-600">{filteredProducts.length} {t('collection.results')}</span>
+              <button onClick={clearFilters} className="text-micro tracking-[0.2em] uppercase text-gold hover:text-stone-800 transition-colors font-bold">{t('collection.clear_all')}</button>
             </div>
           )}
         </div>
       </div>
 
@@ -271,12 +271,12 @@ export default function CollectionPage() {
             ))
           ) : (
             <div className="col-span-full py-24 text-center">
               <div className="max-w-md mx-auto mb-10">
                 <div className="w-16 h-px bg-gold mx-auto mb-8" />
-                <p className="heading-editorial text-stone-400 text-2xl italic mb-4">{t('collection.empty_heading')}</p>
-                <p className="font-body text-xs text-stone-400 tracking-[0.2em] uppercase leading-relaxed">
+                <p className="heading-editorial text-stone-600 text-2xl italic mb-4">{t('collection.empty_heading')}</p>
+                <p className="font-body text-xs text-stone-600 tracking-[0.2em] uppercase leading-relaxed">
                   {t('collection.empty_desc')}
                 </p>
                 <div className="w-16 h-px bg-gold mx-auto mt-8" />
               </div>
               <Link to="/collection/all" className="btn-luxury">{t('collection.view_all')}</Link>
diff --git a/src/pages/ContactPage.tsx b/src/pages/ContactPage.tsx
index 00c7ff5..19320a3 100644
--- a/src/pages/ContactPage.tsx
+++ b/src/pages/ContactPage.tsx
@@ -60,11 +60,11 @@ export default function ContactPage() {
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
         >
           <h1 className="font-heading text-5xl md:text-6xl text-stone-800 tracking-widest uppercase mb-4">{t('nav.contact')}</h1>
-          <p className="font-body text-stone-500 text-sm tracking-[0.2em] uppercase">{t('footer.consultation')}</p>
+          <p className="font-body text-stone-600 text-sm tracking-[0.2em] uppercase">{t('footer.consultation')}</p>
         </motion.div>
       </header>
 
       <section className="section-padding container mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
@@ -91,11 +91,11 @@ export default function ContactPage() {
                 icon={<Clock className="w-5 h-5" />}
                 title={t('contact.hours')}
                 content={t('contact.hours_detail')}
               />
               <div className="bg-stone-50 p-6 border border-stone-100 flex flex-col justify-center">
-                <p className="font-body text-[10px] text-stone-400 uppercase tracking-widest mb-2 italic">{t('contact.special_note')}</p>
+                <p className="font-body text-micro text-stone-600 uppercase tracking-widest mb-2 italic">{t('contact.special_note')}</p>
                 <p className="font-body text-xs text-stone-600 leading-relaxed">{t('contact.special_note_desc')}</p>
               </div>
             </div>
           </div>
 
@@ -109,25 +109,25 @@ export default function ContactPage() {
               >
                 <h2 className="font-heading text-3xl mb-8 tracking-wide">{t('contact.request_consultation')}</h2>
                   <form className="space-y-6 relative z-10" onSubmit={handleSubmit(onSubmit)}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
-                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('form.name')}</label>
+                        <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('form.name')}</label>
                         <input 
                           {...register('name')}
                           disabled={isSubmitted}
                           className={cn(
                             "bg-stone-50 border border-stone-100 focus:bg-ivory focus:border-gold outline-none p-4 text-sm transition-all",
                             errors.name && "border-red-300",
                             isSubmitted && "opacity-50 cursor-not-allowed"
                           )} 
                           placeholder="Sarah Al-Maktoum" 
                         />
-                        {errors.name && <span className="text-red-500 text-[10px] tracking-widest uppercase">{errors.name.message}</span>}
+                        {errors.name && <span className="text-red-500 text-micro tracking-widest uppercase">{errors.name.message}</span>}
                       </div>
                       <div className="flex flex-col gap-2">
-                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('form.email')}</label>
+                        <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('form.email')}</label>
                         <input 
                           {...register('email')}
                           type="email" 
                           disabled={isSubmitted}
                           className={cn(
@@ -135,15 +135,15 @@ export default function ContactPage() {
                             errors.email && "border-red-300",
                             isSubmitted && "opacity-50 cursor-not-allowed"
                           )}
                           placeholder="sarah@example.com" 
                         />
-                        {errors.email && <span className="text-red-500 text-[10px] tracking-widest uppercase">{errors.email.message}</span>}
+                        {errors.email && <span className="text-red-500 text-micro tracking-widest uppercase">{errors.email.message}</span>}
                       </div>
                     </div>
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('nav.contact')}</label>
+                      <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('nav.contact')}</label>
                       <input 
                         {...register('phone')}
                         type="tel" 
                         disabled={isSubmitted}
                         className={cn(
@@ -151,14 +151,14 @@ export default function ContactPage() {
                           errors.phone && "border-red-300",
                           isSubmitted && "opacity-50 cursor-not-allowed"
                         )}
                         placeholder="+971 -- --- ----" 
                       />
-                      {errors.phone && <span className="text-red-500 text-[10px] tracking-widest uppercase">{errors.phone.message}</span>}
+                      {errors.phone && <span className="text-red-500 text-micro tracking-widest uppercase">{errors.phone.message}</span>}
                     </div>
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('contact.inquiry_type')}</label>
+                      <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('contact.inquiry_type')}</label>
                       <div className="relative">
                         <select 
                           {...register('type')}
                           disabled={isSubmitted}
                           className={cn(
@@ -169,15 +169,15 @@ export default function ContactPage() {
                           <option value="Bridal Consultation">{t('contact.bridal_consultation')}</option>
                           <option value="Evening Wear Inquiry">{t('contact.evening_inquiry')}</option>
                           <option value="Rental Booking">{t('contact.rental_booking')}</option>
                           <option value="Bespoke Alterations">{t('contact.bespoke_alterations')}</option>
                         </select>
-                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-stone-400 pointer-events-none" />
+                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-stone-600 pointer-events-none" />
                       </div>
                     </div>
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('contact.vision_prefs')}</label>
+                      <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('contact.vision_prefs')}</label>
                       <textarea 
                         {...register('message')}
                         rows={4} 
                         disabled={isSubmitted}
                         className={cn(
@@ -185,11 +185,11 @@ export default function ContactPage() {
                           errors.message && "border-red-300",
                           isSubmitted && "opacity-50 cursor-not-allowed"
                         )}
                         placeholder={t('contact.vision_placeholder')}
                       ></textarea>
-                      {errors.message && <span className="text-red-500 text-[10px] tracking-widest uppercase">{errors.message.message}</span>}
+                      {errors.message && <span className="text-red-500 text-micro tracking-widest uppercase">{errors.message.message}</span>}
                     </div>
 
                     <div className="pt-4">
                       <AnimatePresence mode="wait">
                         {!isSubmitted ? (
@@ -217,11 +217,11 @@ export default function ContactPage() {
                             animate={{ opacity: 1, y: 0 }}
                             className="space-y-4"
                           >
                             <div className="flex items-center justify-center gap-2 text-gold py-2">
                               <CheckCircle2 className="w-5 h-5" />
-                              <span className="font-body text-[10px] font-bold tracking-[0.3em] uppercase">{t('contact.success_title')}</span>
+                              <span className="font-body text-micro font-bold tracking-[0.3em] uppercase">{t('contact.success_title')}</span>
                             </div>
                             <button 
                               type="button"
                               onClick={handleReset}
                               className="w-full btn-luxury !py-5 flex items-center justify-center gap-3 bg-stone-800"
@@ -266,11 +266,11 @@ function ContactInfoItem({ icon, title, content }: { icon: React.ReactNode, titl
     <div className="flex gap-6 group">
       <div className="w-12 h-12 bg-ivory border border-stone-100 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 rounded-sm shrink-0">
         {icon}
       </div>
       <div>
-        <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2 font-bold">{title}</h4>
+        <h4 className="font-body text-micro tracking-[0.3em] uppercase text-stone-600 mb-2 font-bold">{title}</h4>
         <div className="font-body text-sm text-stone-800 leading-relaxed italic">
           {content}
         </div>
       </div>
     </div>
diff --git a/src/pages/GalleryPage.tsx b/src/pages/GalleryPage.tsx
index 89be448..d1f9442 100644
--- a/src/pages/GalleryPage.tsx
+++ b/src/pages/GalleryPage.tsx
@@ -32,11 +32,11 @@ export default function GalleryPage() {
       <div className="container mx-auto px-6">
         <div className="text-center mb-16">
           <motion.h2
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
-            className="heading-editorial text-gold text-[10px] mb-4 uppercase tracking-[0.4em]"
+            className="heading-editorial text-gold text-micro mb-4 uppercase tracking-[0.4em]"
           >
             {t('gallery.title')}
           </motion.h2>
           <motion.h1
             initial={{ opacity: 0, y: 10 }}
@@ -45,11 +45,11 @@ export default function GalleryPage() {
             className="font-heading text-4xl md:text-6xl text-stone-800 tracking-wider mb-6"
           >
             {t('gallery.subtitle')}
           </motion.h1>
           <div className="w-16 h-px bg-gold mx-auto mb-8" />
-          <p className="text-stone-500 text-sm tracking-wide max-w-xl mx-auto">
+          <p className="text-stone-600 text-sm tracking-wide max-w-xl mx-auto">
             {t('gallery.description')}
           </p>
         </div>
 
         <GalleryFilters
@@ -64,15 +64,15 @@ export default function GalleryPage() {
               <div key={i} className="break-inside-avoid mb-4 bg-stone-100 animate-pulse" style={{ height: `${200 + (i % 3) * 100}px` }} />
             ))}
           </div>
         ) : error ? (
           <div className="text-center py-20">
-            <p className="text-stone-500 text-sm">{error}</p>
+            <p className="text-stone-600 text-sm">{error}</p>
           </div>
         ) : items.length === 0 ? (
           <div className="text-center py-20">
-            <p className="text-stone-500 text-sm">{t('gallery.no_items')}</p>
+            <p className="text-stone-600 text-sm">{t('gallery.no_items')}</p>
           </div>
         ) : (
           <>
             <GalleryGrid items={items} onItemClick={handleItemClick} />
 
diff --git a/src/pages/Index.tsx b/src/pages/Index.tsx
index 55e894a..28e7ccb 100644
--- a/src/pages/Index.tsx
+++ b/src/pages/Index.tsx
@@ -41,11 +41,11 @@ export default function Index() {
         <CalligraphicAccent
           word="╪ú┘å╪º┘é╪⌐"
           className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(10rem,30vw,28rem)]"
         />
         <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-in">
-          <p className="font-label text-[11px] md:text-xs tracking-[0.35em] uppercase text-white/90 mb-8">
+          <p className="font-label text-micro md:text-xs tracking-[0.35em] uppercase text-white/90 mb-8">
             {t('hero.subtitle')}
           </p>
           <h1 className="font-heading text-white font-light leading-[0.95] text-[clamp(3.5rem,11vw,9rem)] mb-12">
             {t('hero.title').split('&').map((part, i, arr) => (
               <span key={i}>
@@ -64,11 +64,11 @@ export default function Index() {
             >
               {t('cta.explore')}
             </a>
           </div>
         </div>
-        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-label text-[10px] tracking-[0.3em] uppercase text-white/60">
+        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-label text-micro tracking-[0.3em] uppercase text-white/60">
           {t('hero.discover')}
         </span>
       </section>
 
       {/* CHAPTER I ΓÇö L'ATELIER */}
@@ -181,11 +181,11 @@ export default function Index() {
           )}
           <div className="mt-12 flex flex-col items-center gap-6">
             <Link to="/appointment" className="btn-luxury" aria-label={t('cta.viewing')}>
               {t('cta.viewing')}
             </Link>
-            <p className="font-label text-[11px] tracking-[0.3em] uppercase text-stone-500">
+            <p className="font-label text-micro tracking-[0.3em] uppercase text-stone-600">
               {t('invitation.contact_line')}
             </p>
           </div>
         </div>
       </section>
diff --git a/src/pages/PaymentSuccess.tsx b/src/pages/PaymentSuccess.tsx
index d71047c..15975eb 100644
--- a/src/pages/PaymentSuccess.tsx
+++ b/src/pages/PaymentSuccess.tsx
@@ -3,17 +3,19 @@ import { useSearchParams, Link } from 'react-router-dom';
 import { motion } from 'motion/react';
 import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
 import { verifyCheckoutSession } from '../services/payment';
 import { sendOrderConfirmationEmail } from '../lib/email';
 import { useCart } from '../contexts/CartContext';
+import { useLanguage } from '../contexts/LanguageContext';
 
 export default function PaymentSuccess() {
   const [searchParams] = useSearchParams();
   const sessionId = searchParams.get('session_id');
   const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
   const [email, setEmail] = useState('');
   const { clearCart } = useCart();
+  const { t } = useLanguage();
 
   useEffect(() => {
     if (!sessionId) {
       setStatus('error');
       return;
@@ -54,38 +56,38 @@ export default function PaymentSuccess() {
   return (
     <div className="pt-40 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center bg-ivory">
       {status === 'verifying' && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
           <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-8" />
-          <h1 className="font-heading text-3xl text-stone-800 uppercase mb-4">Verifying Payment</h1>
-          <p className="font-body text-stone-400 text-xs tracking-widest uppercase">Please wait a moment...</p>
+          <h1 className="font-heading text-3xl text-stone-800 uppercase mb-4">{t('payment.verifying')}</h1>
+          <p className="font-body text-stone-400 text-xs tracking-widest uppercase">{t('payment.please_wait')}</p>
         </motion.div>
       )}
 
       {status === 'success' && (
         <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
           <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-8 mx-auto">
             <CheckCircle2 className="w-12 h-12" />
           </div>
-          <h1 className="font-heading text-4xl md:text-6xl text-stone-800 uppercase mb-4">Payment Successful</h1>
-          <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-4">Your investment has been received.</p>
-          {email && <p className="font-body text-stone-400 text-xs mb-4 uppercase italic">Confirmation sent to {email}</p>}
-          <p className="font-body text-stone-400 text-xs mb-12 uppercase tracking-widest max-w-md mx-auto">Our team will contact you within 24 hours to arrange fitting and delivery details.</p>
-          <Link to="/profile" className="btn-luxury px-12 italic">View My Dashboard</Link>
+          <h1 className="font-heading text-4xl md:text-6xl text-stone-800 uppercase mb-4">{t('payment.success_title')}</h1>
+          <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-4">{t('payment.success_sub')}</p>
+          {email && <p className="font-body text-stone-400 text-xs mb-4 uppercase italic">{t('payment.sent_to')} {email}</p>}
+          <p className="font-body text-stone-400 text-xs mb-12 uppercase tracking-widest max-w-md mx-auto">{t('payment.success_body')}</p>
+          <Link to="/profile" className="btn-luxury px-12 italic">{t('payment.dashboard')}</Link>
         </motion.div>
       )}
 
       {status === 'error' && (
         <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
           <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-8 mx-auto">
             <XCircle className="w-12 h-12" />
           </div>
-          <h1 className="font-heading text-3xl text-stone-800 uppercase mb-4">Payment Not Verified</h1>
-          <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-8">Please contact our atelier to confirm your order.</p>
+          <h1 className="font-heading text-3xl text-stone-800 uppercase mb-4">{t('payment.error_title')}</h1>
+          <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-8">{t('payment.error_body')}</p>
           <div className="flex gap-4 justify-center">
-            <Link to="/contact" className="btn-luxury-outline px-8">Contact Us</Link>
-            <Link to="/" className="btn-luxury px-8">Return Home</Link>
+            <Link to="/contact" className="btn-luxury-outline px-8">{t('payment.contact')}</Link>
+            <Link to="/" className="btn-luxury px-8">{t('payment.home')}</Link>
           </div>
         </motion.div>
       )}
     </div>
   );
diff --git a/src/pages/ProductDetail.tsx b/src/pages/ProductDetail.tsx
index f356f5c..9e440ea 100644
--- a/src/pages/ProductDetail.tsx
+++ b/src/pages/ProductDetail.tsx
@@ -1,12 +1,12 @@
-import { useParams, Link } from 'react-router-dom';
+import { useParams, Link, useNavigate } from 'react-router-dom';
 import { useState, useMemo, useRef, MouseEvent, Suspense, lazy, useEffect } from 'react';
 import { ShoppingBag, Heart, ChevronRight, ChevronLeft, ChevronDown, Share2, Ruler, ShieldCheck, Truck, Search, Star, CheckCircle2, X, Calendar, Info, Loader2, RotateCcw, Box, Sparkles, MessageCircle, Gem, Wind } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { products } from '../data/products';
 import { formatPrice, cn, categoryToSlug } from '../lib/utils';
-import { Product } from '../types';
+import { Product, type GownRef } from '../types';
 import { useData } from '../contexts/DataContext';
 import { useCart } from '../contexts/CartContext';
 import { useWishlist } from '../contexts/WishlistContext';
 import { useLanguage } from '../contexts/LanguageContext';
 import { useScrollLock } from '../hooks/useScrollLock';
@@ -31,10 +31,11 @@ export default function ProductDetail() {
   const { products: dynamicProducts, isLoading } = useData();
   const { id } = useParams();
   const { addItem } = useCart();
   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
   const { t } = useLanguage();
+  const navigate = useNavigate();
   const threeDViewerEnabled = useFeature('threeDViewer');
   const { addToast } = useToast();
   const [selectedSize, setSelectedSize] = useState('');
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
@@ -129,16 +130,29 @@ export default function ProductDetail() {
   };
 
   const isRent = product.productType === 'rent' || product.productType === 'both';
   const isSale = product.productType === 'sale' || product.productType === 'both';
 
+  const reserveViewing = () => {
+    if (product) {
+      if (!isInWishlist(product.id)) addToWishlist(product);
+      const gowns: GownRef[] = [{
+        id: product.id,
+        name: product.name,
+        size: selectedSize || undefined,
+        intent: isRent ? 'rent' : 'sale',
+      }];
+      navigate('/appointment', { state: { gowns } });
+    }
+  };
+
   return (
     <>
       <div id="product-detail-page" className="pt-24 bg-ivory min-h-screen pb-24 lg:pb-12">
         <div className="container mx-auto px-5 py-10">
           {/* Breadcrumbs */}
-          <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-400 mb-10">
+          <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-600 mb-10">
             <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
             <ChevronRight className="w-3 h-3" />
             <Link to={`/collection/${categoryToSlug(product.category)}`} className="hover:text-gold transition-colors">{product.category}</Link>
             <ChevronRight className="w-3 h-3" />
             <span className="text-stone-800 font-medium">{product.name}</span>
@@ -195,11 +209,11 @@ export default function ProductDetail() {
                     </motion.div>
                   )}
                 </AnimatePresence>
 
                 {/* Image Counter Badge */}
-                <div className="absolute bottom-5 left-5 z-20 bg-ivory/90 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-widest uppercase text-stone-700 font-bold">
+                <div className="absolute bottom-5 left-5 z-20 bg-ivory/90 backdrop-blur-sm px-3 py-1.5 text-micro tracking-widest uppercase text-stone-700 font-bold">
                   {currentImageIndex + 1} / {totalAssets}
                 </div>
 
                 {/* Nav Arrows */}
                 {totalAssets > 1 && (
@@ -214,15 +228,15 @@ export default function ProductDetail() {
                 )}
 
                 {/* Perspective Toggle */}
                 {product.glbUrl && (
                   <div className="absolute top-5 right-5 z-30 flex gap-2">
-                    <button onClick={() => setIs3DMode(false)} className={cn("p-2.5 transition-all backdrop-blur border", !is3DMode ? "bg-gold text-white border-gold" : "bg-ivory/80 text-stone-500 border-stone-100 hover:border-stone-300")} title={t('product.classic_view')}>
+                    <button onClick={() => setIs3DMode(false)} className={cn("p-2.5 transition-all backdrop-blur border", !is3DMode ? "bg-gold text-white border-gold" : "bg-ivory/80 text-stone-600 border-stone-100 hover:border-stone-300")} title={t('product.classic_view')}>
                       <Search className="w-3.5 h-3.5" />
                     </button>
                     {threeDViewerEnabled && (
-                      <button onClick={() => setIs3DMode(true)} className={cn("p-2.5 transition-all backdrop-blur border", is3DMode ? "bg-gold text-white border-gold scale-105" : "bg-ivory/80 text-stone-500 border-stone-100 hover:border-stone-300")} title={t('product.view_3d')}>
+                      <button onClick={() => setIs3DMode(true)} className={cn("p-2.5 transition-all backdrop-blur border", is3DMode ? "bg-gold text-white border-gold scale-105" : "bg-ivory/80 text-stone-600 border-stone-100 hover:border-stone-300")} title={t('product.view_3d')}>
                         <Box className="w-3.5 h-3.5" />
                       </button>
                     )}
                   </div>
                 )}
@@ -232,14 +246,14 @@ export default function ProductDetail() {
                   <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2.5 bg-ivory/90 text-stone-800 hover:bg-gold hover:text-white transition-all" aria-label="Share this product">
                     <Share2 className="w-3.5 h-3.5" />
                   </button>
                   {showShareMenu && (
                     <div className="absolute bottom-12 right-0 bg-ivory border border-stone-100 p-2 w-44">
-                      <a href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} at Riman Fashion: ${window.location.origin}/product/${product.id}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-[10px] tracking-wider uppercase text-stone-700 hover:bg-pearl transition-colors">
+                      <a href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} at Riman Fashion: ${window.location.origin}/product/${product.id}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-micro tracking-wider uppercase text-stone-700 hover:bg-pearl transition-colors">
                         WhatsApp
                       </a>
-                      <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] tracking-wider uppercase text-stone-700 hover:bg-pearl transition-colors">
+                      <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-micro tracking-wider uppercase text-stone-700 hover:bg-pearl transition-colors">
                         {t('product.copy_link')}
                       </button>
                     </div>
                   )}
                 </div>
@@ -267,64 +281,65 @@ export default function ProductDetail() {
 
               {/* Quick Specs Bar */}
               <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-100">
                 <div className="flex flex-col items-center gap-1.5 py-3">
                   <Gem className="w-4 h-4 text-gold" />
-                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">{t('product.fabric')}</span>
-                  <span className="text-[10px] text-stone-700 font-medium tracking-wide">{product.fabric || 'Luxury Blend'}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.fabric')}</span>
+                  <span className="text-micro text-stone-700 font-medium tracking-wide">{product.fabric || 'Luxury Blend'}</span>
                 </div>
                 <div className="flex flex-col items-center gap-1.5 py-3 border-x border-stone-100">
                   <Sparkles className="w-4 h-4 text-gold" />
-                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">{t('product.silhouette')}</span>
-                  <span className="text-[10px] text-stone-700 font-medium tracking-wide">{product.category}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.silhouette')}</span>
+                  <span className="text-micro text-stone-700 font-medium tracking-wide">{product.category}</span>
                 </div>
                 <div className="flex flex-col items-center gap-1.5 py-3">
                   <Wind className="w-4 h-4 text-gold" />
-                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">{t('product.color')}</span>
-                  <span className="text-[10px] text-stone-700 font-medium tracking-wide">{product.style[0] || 'Signature'}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.color')}</span>
+                  <span className="text-micro text-stone-700 font-medium tracking-wide">{product.style[0] || 'Signature'}</span>
                 </div>
               </div>
             </div>
 
             {/* Info ΓÇö Sticky on Desktop */}
             <div className="flex flex-col lg:sticky lg:top-28 lg:self-start">
               <header className="mb-8">
-                <span className="text-[10px] tracking-[0.3em] uppercase text-gold block mb-2 font-bold">{product.designer || 'Riman Atelier'}</span>
+                <span className="text-micro tracking-[0.3em] uppercase text-gold block mb-2 font-bold">{product.designer || 'Riman Atelier'}</span>
                 <h1 className="font-heading text-3xl md:text-4xl text-stone-800 tracking-wider mb-3 leading-tight">{product.name}</h1>
                 <div className="flex gap-3">
-                  {product.isNew && <span className="text-gold text-[10px] uppercase tracking-widest border border-gold/30 px-3 py-1 font-bold">{t('product.limited_edition')}</span>}
-                  <span className="text-stone-400 text-[10px] uppercase tracking-widest border border-stone-200 px-3 py-1 font-medium">SKU: RF-{product.id.padStart(4, '0')}</span>
+                  {product.isNew && <span className="text-gold text-micro uppercase tracking-widest border border-gold/30 px-3 py-1 font-bold">{t('product.limited_edition')}</span>}
+                  <span className="text-stone-600 text-micro uppercase tracking-widest border border-stone-200 px-3 py-1 font-medium">SKU: RF-{product.id.padStart(4, '0')}</span>
                 </div>
               </header>
 
               {/* Editorial Quote */}
               <div className="mb-8 pl-5 border-l-2 border-gold/40">
-                <p className="font-editorial italic text-sm text-stone-500 leading-relaxed">
+                <p className="font-editorial italic text-sm text-stone-600 leading-relaxed">
                   "A study in refined elegance ΓÇö where artisanal precision meets contemporary silhouette, crafted for the woman who commands quiet luxury."
                 </p>
               </div>
 
               {/* Pricing */}
               <div className="mb-8 p-5 bg-gold/5 border border-gold/20 flex flex-col gap-4">
                 {isSale && (
                   <div className="flex justify-between items-baseline">
-                    <span className="font-body text-[10px] tracking-widest uppercase text-stone-500 font-medium">{t('product.purchase_value')}</span>
-                    <span className="font-heading text-3xl text-stone-800">{formatPrice(product.salePrice || 0)}</span>
+                    <span className="font-body text-micro tracking-widest uppercase text-stone-600 font-medium">{t('product.purchase_value')}</span>
+                    <span className="font-heading text-3xl text-stone-800"><span className="text-sm font-body text-stone-600 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
                   </div>
                 )}
                 {isRent && (
                   <div className="flex justify-between items-baseline pt-4 border-t border-stone-200/60">
                     <div>
-                      <span className="font-body text-[10px] tracking-widest uppercase text-stone-500 block font-medium">{t('product.rental_7day')}</span>
-                      <span className="text-[10px] text-stone-400 uppercase tracking-wider italic">({t('product.rental_includes')})</span>
+                      <span className="font-body text-micro tracking-widest uppercase text-stone-600 block font-medium">{t('product.rental_7day')}</span>
+                      <span className="text-micro text-stone-600 uppercase tracking-wider italic">({t('product.rental_includes')})</span>
                     </div>
                     <div className="text-right">
-                      <span className="font-heading text-3xl text-gold">{formatPrice(product.rentalPrice || 0)}</span>
-                      <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{t('product.refundable_deposit')}</p>
+                      <span className="font-heading text-3xl text-gold"><span className="text-sm font-body text-stone-600 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
+                      <p className="text-micro text-stone-600 uppercase tracking-widest mt-1">{t('product.refundable_deposit')}</p>
                     </div>
                   </div>
                 )}
+                <p className="font-body text-micro text-stone-600 italic mt-2 leading-relaxed">{t('pricing.consultation_note')}</p>
               </div>
 
               <p className="font-body text-sm text-stone-600 leading-relaxed tracking-wide mb-8">
                 {product.description}
                 <br /><br />
@@ -334,108 +349,112 @@ export default function ProductDetail() {
               {/* Selection */}
               <div className="space-y-6 mb-10">
                 {isRent && (
                   <div className="p-5 bg-stone-50 border border-stone-200">
                     <div className="flex justify-between items-center mb-3">
-                      <span className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-800">{t('product.rental_availability')}</span>
-                      <span className="text-[9px] text-gold uppercase tracking-widest font-bold">{t('product.fast_booking')}</span>
+                      <span className="font-body text-micro tracking-[0.2em] uppercase text-stone-800">{t('product.rental_availability')}</span>
+                      <span className="text-micro text-gold uppercase tracking-widest font-bold">{t('product.fast_booking')}</span>
                     </div>
                     <AvailabilityCalendar productId={product.id} selectedDate={bookingDate} onDateSelect={setBookingDate} />
-                    <p className="text-[9px] text-stone-400 leading-relaxed italic text-center mt-3">
+                    <p className="text-micro text-stone-600 leading-relaxed italic text-center mt-3">
                       {bookingDate ? `${t('product.selected_date')}: ${bookingDate.toLocaleDateString()}` : t('product.select_date_hint')}
                     </p>
                   </div>
                 )}
 
                 <div>
                   <div className="flex justify-between items-center mb-3">
-                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-800">{t('product.select_size_label')}</span>
-                    <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase hover:underline">
+                    <span className="font-body text-micro tracking-[0.2em] uppercase text-stone-800">{t('product.select_size_label')}</span>
+                    <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-2 text-micro tracking-widest text-gold uppercase hover:underline">
                       <Ruler className="w-3 h-3" /> {t('product.size_guide')}
                     </button>
                   </div>
                   <div className="flex flex-wrap gap-2.5">
                     {['XS', 'S', 'M', 'L', 'XL'].map((size) => {
                       const isAvailable = product.sizes.includes(size);
                       return (
-                        <button key={size} disabled={!isAvailable} onClick={() => setSelectedSize(size)} className={cn("w-11 h-11 flex items-center justify-center border text-[10px] tracking-widest transition-all", !isAvailable ? "border-stone-100 text-stone-200 cursor-not-allowed" : selectedSize === size ? "border-gold bg-gold text-white" : "border-stone-200 text-stone-600 hover:border-gold")}>
+                        <button key={size} disabled={!isAvailable} onClick={() => setSelectedSize(size)} className={cn("w-11 h-11 flex items-center justify-center border text-micro tracking-widest transition-all", !isAvailable ? "border-stone-100 text-stone-200 cursor-not-allowed" : selectedSize === size ? "border-gold bg-gold text-white" : "border-stone-200 text-stone-600 hover:border-gold")}>
                           {size}
                         </button>
                       );
                     })}
                   </div>
                 </div>
 
                 <div className="flex flex-col sm:flex-row gap-3">
                   <div className="flex-1 flex flex-col gap-2">
-                    <button onClick={handleAddToCart} disabled={isAddingToCart} className="w-full btn-luxury flex items-center justify-center gap-3 relative overflow-hidden">
+                    <button onClick={reserveViewing} className="w-full btn-luxury flex items-center justify-center gap-3">
+                      <Sparkles className="w-4 h-4" />
+                      {t('product.reserve_viewing')}
+                    </button>
+                    <button onClick={handleAddToCart} disabled={isAddingToCart} className="w-full btn-luxury-outline !py-3 flex items-center justify-center gap-3">
                       {isAddingToCart ? (
-                        <Loader2 className="w-4 h-4 animate-spin text-white" />
+                        <Loader2 className="w-4 h-4 animate-spin" />
                       ) : (
                         <>
-                          <ShoppingBag className="w-4 h-4" />
+                          <ShoppingBag className="w-3.5 h-3.5" />
                           {isRent ? t('product.book_rental') : t('product.add_to_collection')}
                         </>
                       )}
                     </button>
                     {errorMsg && (
-                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 uppercase tracking-widest text-center font-bold">
+                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-micro text-rose-500 uppercase tracking-widest text-center font-bold">
                         {errorMsg}
                       </motion.p>
                     )}
                   </div>
-                  <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-12 h-12 flex items-center justify-center border transition-all", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-500 hover:text-rose-500 hover:border-rose-200")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
+                  <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-12 h-12 flex items-center justify-center border transition-all", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-600 hover:text-rose-500 hover:border-rose-200")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
                     <Heart className={cn("w-4 h-4", saved && "fill-current")} />
                   </button>
                 </div>
               </div>
 
               {/* Trust Badges ΓÇö 3-column grid */}
               <div className="grid grid-cols-3 gap-4 py-8 border-t border-b border-stone-100 mb-10 bg-gold/[0.03]">
                 <div className="flex flex-col items-center text-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-gold" />
-                  <span className="text-[9px] font-bold text-stone-800 tracking-wider leading-tight">{t('product.couture_care')}</span>
-                  <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold">{t('product.cleaning_included')}</span>
+                  <span className="text-micro font-bold text-stone-800 tracking-wider leading-tight">{t('product.couture_care')}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.cleaning_included')}</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-2 border-x border-stone-100">
                   <Truck className="w-5 h-5 text-gold" />
-                  <span className="text-[9px] font-bold text-stone-800 tracking-wider leading-tight">{t('product.secure_delivery')}</span>
-                  <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold">{t('product.uae_gcc')}</span>
+                  <span className="text-micro font-bold text-stone-800 tracking-wider leading-tight">{t('product.secure_delivery')}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.uae_gcc')}</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-2">
                   <Ruler className="w-5 h-5 text-gold" />
-                  <span className="text-[9px] font-bold text-stone-800 tracking-wider leading-tight">{t('product.bespoke_fit')}</span>
-                  <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold">{t('product.custom_tailoring')}</span>
+                  <span className="text-micro font-bold text-stone-800 tracking-wider leading-tight">{t('product.bespoke_fit')}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.custom_tailoring')}</span>
                 </div>
               </div>
 
               {/* Specifications Accordion */}
               <div className="border border-stone-100 mb-4">
                 <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between p-5 bg-ivory hover:bg-ivory transition-colors">
-                  <span className="font-body text-[10px] font-bold tracking-widest uppercase text-stone-800">{t('product.specifications')}</span>
-                  <ChevronDown className={cn("w-4 h-4 text-stone-400 transition-transform duration-300", showDetails && "rotate-180")} />
+                  <span className="font-body text-micro font-bold tracking-widest uppercase text-stone-800">{t('product.specifications')}</span>
+                  <ChevronDown className={cn("w-4 h-4 text-stone-600 transition-transform duration-300", showDetails && "rotate-180")} />
                 </button>
                 <AnimatePresence>
                   {showDetails && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                       <div className="border-t border-stone-100">
                         <div className="flex justify-between py-3.5 px-5 bg-ivory">
-                          <span className="text-[10px] text-gold uppercase tracking-widest font-bold">{t('product.fabric')}</span>
+                          <span className="text-micro text-gold uppercase tracking-widest font-bold">{t('product.fabric')}</span>
                           <span className="text-xs text-stone-800 font-medium tracking-wide">{product.fabric || 'Luxury Blend'}</span>
                         </div>
                         <div className="flex justify-between py-3.5 px-5 bg-stone-50/50">
-                          <span className="text-[10px] text-gold uppercase tracking-widest font-bold">{t('product.designer')}</span>
+                          <span className="text-micro text-gold uppercase tracking-widest font-bold">{t('product.designer')}</span>
                           <span className="text-xs text-stone-800 font-medium tracking-wide">{product.designer || 'Riman Atelier'}</span>
                         </div>
                         <div className="py-3.5 px-5 bg-ivory">
-                          <span className="text-[10px] text-gold uppercase tracking-widest font-bold block mb-2">{t('product.style_elements')}</span>
+                          <span className="text-micro text-gold uppercase tracking-widest font-bold block mb-2">{t('product.style_elements')}</span>
                           <div className="flex flex-wrap gap-2">
                             {product.style.map((tag, i) => (
-                              <span key={i} className="text-[10px] px-3 py-1 bg-stone-50 border border-stone-100 text-stone-500 uppercase tracking-[0.15em] font-medium">{tag}</span>
+                              <span key={i} className="text-micro px-3 py-1 bg-stone-50 border border-stone-100 text-stone-600 uppercase tracking-[0.15em] font-medium">{tag}</span>
                             ))}
                             {product.category && (
-                              <span className="text-[10px] px-3 py-1 bg-gold/5 border border-gold/10 text-gold uppercase tracking-[0.15em] font-bold">{product.category}</span>
+                              <span className="text-micro px-3 py-1 bg-gold/5 border border-gold/10 text-gold uppercase tracking-[0.15em] font-bold">{product.category}</span>
                             )}
                           </div>
                         </div>
                       </div>
                     </motion.div>
@@ -444,43 +463,43 @@ export default function ProductDetail() {
               </div>
 
               {/* Care Instructions Accordion */}
               <div className="border border-stone-100 mb-4">
                 <button onClick={() => setShowCare(!showCare)} className="w-full flex items-center justify-between p-5 bg-ivory hover:bg-ivory transition-colors">
-                  <span className="font-body text-[10px] font-bold tracking-widest uppercase text-stone-800">{t('product.care_instructions')}</span>
-                  <ChevronDown className={cn("w-4 h-4 text-stone-400 transition-transform duration-300", showCare && "rotate-180")} />
+                  <span className="font-body text-micro font-bold tracking-widest uppercase text-stone-800">{t('product.care_instructions')}</span>
+                  <ChevronDown className={cn("w-4 h-4 text-stone-600 transition-transform duration-300", showCare && "rotate-180")} />
                 </button>
                 <AnimatePresence>
                   {showCare && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                       <div className="p-5 pt-0 space-y-3">
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.care_dry_clean')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.care_dry_clean_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.care_dry_clean')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.care_dry_clean_desc')}</p>
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.care_store')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.care_store_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.care_store')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.care_store_desc')}</p>
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.care_handle')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.care_handle_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.care_handle')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.care_handle_desc')}</p>
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.care_steam')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.care_steam_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.care_steam')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.care_steam_desc')}</p>
                           </div>
                         </div>
                       </div>
                     </motion.div>
                   )}
@@ -493,38 +512,38 @@ export default function ProductDetail() {
                   <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
                     <MessageCircle className="w-5 h-5 text-gold" />
                   </div>
                   <div>
                     <h4 className="font-heading text-xs tracking-[0.15em] uppercase text-stone-800 mb-1 group-hover:text-gold transition-colors">{t('product.ask_stylist')}</h4>
-                    <p className="text-[10px] text-stone-500 tracking-wide">{t('product.ask_stylist_desc')}</p>
+                    <p className="text-micro text-stone-600 tracking-wide">{t('product.ask_stylist_desc')}</p>
                   </div>
                   <ChevronRight className="w-4 h-4 text-gold ml-auto group-hover:translate-x-1 transition-transform" />
                 </div>
               </Link>
 
               {/* Artistry & Essence ΓÇö collapsible */}
               <div className="border border-stone-100">
                 <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between p-5 bg-ivory hover:bg-ivory transition-colors">
-                  <span className="font-body text-[10px] font-bold tracking-widest uppercase text-stone-800">{t('product.artistry_essence')}</span>
-                  <ChevronDown className={cn("w-4 h-4 text-stone-400 transition-transform duration-300", showDetails && "rotate-180")} />
+                  <span className="font-body text-micro font-bold tracking-widest uppercase text-stone-800">{t('product.artistry_essence')}</span>
+                  <ChevronDown className={cn("w-4 h-4 text-stone-600 transition-transform duration-300", showDetails && "rotate-180")} />
                 </button>
                 <AnimatePresence>
                   {showDetails && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                       <div className="p-5 pt-0 space-y-5">
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.fitting_title')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.fitting_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.fitting_title')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.fitting_desc')}</p>
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.texture_title')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.texture_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.texture_title')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.texture_desc')}</p>
                           </div>
                         </div>
                       </div>
                     </motion.div>
                   )}
@@ -542,13 +561,13 @@ export default function ProductDetail() {
                   <div className="flex">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <Star key={star} className={cn("w-4 h-4", star <= 4.5 ? "text-gold fill-gold" : "text-stone-200")} />
                     ))}
                   </div>
-                  <span className="text-xs text-stone-500 font-bold tracking-widest">(4.8)</span>
+                  <span className="text-xs text-stone-600 font-bold tracking-widest">(4.8)</span>
                 </div>
-                <ChevronDown className={cn("w-5 h-5 text-stone-400 transition-transform duration-300", showReviews && "rotate-180")} />
+                <ChevronDown className={cn("w-5 h-5 text-stone-600 transition-transform duration-300", showReviews && "rotate-180")} />
               </div>
             </button>
             <AnimatePresence>
               {showReviews && (
                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
@@ -557,18 +576,18 @@ export default function ProductDetail() {
                       <div className="space-y-8">
                         {reviews.map((review) => (
                           <div key={review.id} className="pb-8 border-b border-stone-50 last:border-0">
                             <div className="flex justify-between items-start mb-3">
                               <div>
-                                <p className="text-[10px] font-bold text-stone-800 uppercase tracking-widest mb-1">{review.name}</p>
+                                <p className="text-micro font-bold text-stone-800 uppercase tracking-widest mb-1">{review.name}</p>
                                 <div className="flex gap-1 mb-2">
                                   {[1, 2, 3, 4, 5].map((star) => (
                                     <Star key={star} className={cn("w-3 h-3", star <= review.rating ? "text-gold fill-gold" : "text-stone-200")} />
                                   ))}
                                 </div>
                               </div>
-                              <span className="text-[9px] text-stone-400 uppercase tracking-widest">{review.date}</span>
+                              <span className="text-micro text-stone-600 uppercase tracking-widest">{review.date}</span>
                             </div>
                             <p className="text-sm text-stone-600 leading-relaxed italic">"{review.comment}"</p>
                           </div>
                         ))}
                       </div>
@@ -579,12 +598,12 @@ export default function ProductDetail() {
                       <h4 className="font-heading text-lg text-stone-800 tracking-widest uppercase mb-6">{t('product.leave_reflection')}</h4>
                       <AnimatePresence mode="wait">
                         {reviewSuccess ? (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                             <CheckCircle2 className="w-12 h-12 text-green-500" />
-                            <p className="text-[10px] tracking-widest text-stone-600 uppercase font-bold">{t('product.reflection_curated')}</p>
-                            <button onClick={() => setReviewSuccess(false)} className="text-[9px] text-gold uppercase tracking-widest border-b border-gold/30 pb-1">{t('product.write_another')}</button>
+                            <p className="text-micro tracking-widest text-stone-600 uppercase font-bold">{t('product.reflection_curated')}</p>
+                            <button onClick={() => setReviewSuccess(false)} className="text-micro text-gold uppercase tracking-widest border-b border-gold/30 pb-1">{t('product.write_another')}</button>
                           </motion.div>
                         ) : (
                           <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6" onSubmit={(e) => {
                             e.preventDefault();
                             if (!newReview.name || !newReview.comment) return;
@@ -592,25 +611,25 @@ export default function ProductDetail() {
                             setReviews([review, ...reviews]);
                             setNewReview({ name: '', rating: 5, comment: '' });
                             setReviewSuccess(true);
                           }}>
                             <div>
-                              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{t('product.rating')}</label>
+                              <label className="block text-micro font-bold text-stone-600 uppercase tracking-widest mb-2">{t('product.rating')}</label>
                               <div className="flex gap-2">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                   <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className="transition-transform hover:scale-110">
                                     <Star className={cn("w-7 h-7", star <= newReview.rating ? "text-gold fill-gold" : "text-stone-200")} />
                                   </button>
                                 ))}
                               </div>
                             </div>
                             <div>
-                              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{t('product.your_name')}</label>
+                              <label className="block text-micro font-bold text-stone-600 uppercase tracking-widest mb-2">{t('product.your_name')}</label>
                               <input type="text" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} className="w-full px-5 py-4 bg-ivory border border-stone-100 text-xs tracking-widest outline-none focus:border-gold transition-colors" placeholder={t('product.enter_name')} />
                             </div>
                             <div>
-                              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{t('product.your_reflection')}</label>
+                              <label className="block text-micro font-bold text-stone-600 uppercase tracking-widest mb-2">{t('product.your_reflection')}</label>
                               <textarea rows={4} value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className="w-full px-5 py-4 bg-ivory border border-stone-100 text-xs tracking-widest outline-none focus:border-gold transition-colors resize-none" placeholder={t('product.share_experience')}></textarea>
                             </div>
                             <button type="submit" className="w-full btn-luxury">{t('product.submit_review')}</button>
                           </motion.form>
                         )}
@@ -624,11 +643,11 @@ export default function ProductDetail() {
 
           {/* Related Products */}
           {relatedProducts.length > 0 && (
             <section className="pt-16 border-t border-stone-100">
               <div className="flex flex-col items-center text-center mb-12">
-                <h2 className="heading-editorial text-stone-400 text-sm mb-3">{t('product.complementary_picks')}</h2>
+                <h2 className="heading-editorial text-stone-600 text-sm mb-3">{t('product.complementary_picks')}</h2>
                 <h3 className="font-heading text-3xl text-stone-800 tracking-wide">{t('product.curated_for_you')}</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
               </div>
@@ -637,18 +656,24 @@ export default function ProductDetail() {
         </div>
 
         {/* Mobile Sticky Bottom Bar */}
         <div className="fixed bottom-0 left-0 right-0 z-50 bg-ivory border-t border-stone-200 p-4 flex items-center gap-4 lg:hidden">
           <div className="flex-1 min-w-0">
-            <p className="font-heading text-[11px] tracking-wider uppercase text-stone-800 truncate">{product.name}</p>
-            <p className="font-heading text-sm text-gold">{formatPrice(isSale ? (product.salePrice || 0) : (isRent ? (product.rentalPrice || 0) : 0))}</p>
+            <p className="font-heading text-micro tracking-wider uppercase text-stone-800 truncate">{product.name}</p>
+            <p className="font-heading text-sm text-gold"><span className="text-micro font-body text-stone-600 uppercase tracking-wider me-1">{t('pricing.from')}</span>{formatPrice(isSale ? (product.salePrice || 0) : (isRent ? (product.rentalPrice || 0) : 0))}</p>
           </div>
-          <button onClick={handleAddToCart} disabled={isAddingToCart} className="btn-luxury !py-3 !px-5 text-[10px] flex items-center gap-2 whitespace-nowrap">
-            {isAddingToCart ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <ShoppingBag className="w-3.5 h-3.5" />}
-            {isRent ? t('product.book_rental') : t('product.add_to_collection')}
-          </button>
-          <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-10 h-10 flex items-center justify-center border transition-all shrink-0", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-500")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
+          <div className="flex flex-col gap-1.5 shrink-0">
+            <button onClick={reserveViewing} className="btn-luxury !py-2.5 !px-5 text-micro flex items-center justify-center gap-2 whitespace-nowrap">
+              <Sparkles className="w-3.5 h-3.5" />
+              {t('product.reserve_viewing')}
+            </button>
+            <button onClick={handleAddToCart} disabled={isAddingToCart} className="btn-luxury-outline !py-2.5 !px-5 text-micro flex items-center justify-center gap-2 whitespace-nowrap">
+              {isAddingToCart ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingBag className="w-3.5 h-3.5" />}
+              {isRent ? t('product.book_rental') : t('product.add_to_collection')}
+            </button>
+          </div>
+          <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-10 h-10 flex items-center justify-center border transition-all shrink-0", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-600")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
             <Heart className={cn("w-4 h-4", saved && "fill-current")} />
           </button>
         </div>
 
         {/* Reservation Confirmation Modal */}
@@ -679,30 +704,30 @@ function BookingConfirmationModal({ product, date, onClose }: { product: Product
         animate={{ opacity: 1, scale: 1, y: 0 }}
         className="bg-ivory max-w-lg w-full p-8 md:p-12 relative border border-stone-200 max-h-[90vh] overflow-y-auto"
         role="dialog"
         aria-modal="true"
       >
-        <button onClick={onClose} className="sticky top-0 float-right p-2 text-stone-400 hover:text-stone-800 transition-colors">
+        <button onClick={onClose} className="sticky top-0 float-right p-2 text-stone-600 hover:text-stone-800 transition-colors">
           <X className="w-5 h-5" />
         </button>
 
         <div className="text-center">
           <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
             <CheckCircle2 className="w-10 h-10" />
           </div>
 
           <h3 className="font-heading text-3xl text-stone-800 mb-2 uppercase tracking-widest">{t('product.reservation_secured')}</h3>
           <div className="w-12 h-px bg-gold mx-auto my-4" />
-          <p className="text-stone-400 text-[10px] tracking-widest uppercase mb-10">{t('product.atelier_moment_booked')}</p>
+          <p className="text-stone-600 text-micro tracking-widest uppercase mb-10">{t('product.atelier_moment_booked')}</p>
 
           <div className="bg-stone-50 p-6 mb-10 text-left space-y-4">
             <div className="flex justify-between items-center text-xs pb-4 border-b border-stone-100">
-              <span className="text-stone-400 uppercase tracking-widest">{t('product.selection')}</span>
+              <span className="text-stone-600 uppercase tracking-widest">{t('product.selection')}</span>
               <span className="font-bold text-stone-800">{product.name}</span>
             </div>
             <div className="flex justify-between items-center text-xs pb-4 border-b border-stone-100">
-              <span className="text-stone-400 uppercase tracking-widest">{t('product.period_starts')}</span>
+              <span className="text-stone-600 uppercase tracking-widest">{t('product.period_starts')}</span>
               <div className="flex items-center gap-2 font-bold text-stone-800">
                 <Calendar className="w-3 h-3 text-gold" />
                 {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </div>
             </div>
@@ -710,26 +735,26 @@ function BookingConfirmationModal({ product, date, onClose }: { product: Product
 
           <div className="text-left space-y-6 mb-10">
             <div className="flex gap-3">
               <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
               <div>
-                <p className="text-[10px] font-bold text-stone-800 uppercase tracking-widest mb-1">{t('product.rental_policy')}</p>
-                <p className="text-xs text-stone-500 leading-relaxed italic">{t('product.rental_policy_desc')}</p>
+                <p className="text-micro font-bold text-stone-800 uppercase tracking-widest mb-1">{t('product.rental_policy')}</p>
+                <p className="text-xs text-stone-600 leading-relaxed italic">{t('product.rental_policy_desc')}</p>
               </div>
             </div>
             <div className="flex gap-3">
               <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
               <div>
-                <p className="text-[10px] font-bold text-stone-800 uppercase tracking-widest mb-1">{t('product.security_deposit')}</p>
-                <p className="text-xs text-stone-500 leading-relaxed italic">{t('product.security_deposit_desc')} {formatPrice(product.securityDeposit || 5000)} {t('product.will_be_held')}</p>
+                <p className="text-micro font-bold text-stone-800 uppercase tracking-widest mb-1">{t('product.security_deposit')}</p>
+                <p className="text-xs text-stone-600 leading-relaxed italic">{t('product.security_deposit_desc')} {formatPrice(product.securityDeposit || 5000)} {t('product.will_be_held')}</p>
               </div>
             </div>
           </div>
 
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
-            <button onClick={onClose} className="btn-luxury-outline w-full !py-4 text-[10px]">{t('product.continue_exploring')}</button>
-            <Link to="/checkout" className="btn-luxury w-full !py-4 text-[10px] flex items-center justify-center gap-2">
+            <button onClick={onClose} className="btn-luxury-outline w-full !py-4 text-micro">{t('product.continue_exploring')}</button>
+            <Link to="/checkout" className="btn-luxury w-full !py-4 text-micro flex items-center justify-center gap-2">
               <ShoppingBag className="w-4 h-4" /> {t('product.go_to_checkout')}
             </Link>
           </div>
         </div>
       </motion.div>
diff --git a/src/pages/ProfilePage.tsx b/src/pages/ProfilePage.tsx
index 2497ea8..fa2aa22 100644
--- a/src/pages/ProfilePage.tsx
+++ b/src/pages/ProfilePage.tsx
@@ -54,22 +54,22 @@ export default function ProfilePage() {
                  <div className="w-16 h-16 bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg text-stone-800 tracking-wide">{user.name}</h2>
-                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">{user.role} {t('profile.member')}</p>
+                    <p className="text-micro text-stone-600 uppercase tracking-widest">{user.role} {t('profile.member')}</p>
                  </div>
                </div>
 
                <nav className="space-y-1 relative z-10">
                    <ProfileLink icon={ShoppingBag} label={t('profile.orders')} active onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                    <Link to="/wishlist"><ProfileLink icon={Heart} label={t('wishlist.title')} /></Link>
                    <Link to="/appointment"><ProfileLink icon={Calendar} label={t('profile.appointments')} /></Link>
                    <ProfileLink icon={Settings} label={t('profile.preferences')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                  <button 
                     onClick={async () => { await signOut(); navigate('/'); }}
-                   className="w-full flex items-center gap-4 p-4 text-[10px] text-stone-400 uppercase tracking-[0.2em] hover:text-rose-500 hover:bg-rose-50/30 transition-all text-left mt-8 border-t border-stone-50 pt-8"
+                   className="w-full flex items-center gap-4 p-4 text-micro text-stone-600 uppercase tracking-[0.2em] hover:text-rose-500 hover:bg-rose-50/30 transition-all text-left mt-8 border-t border-stone-50 pt-8"
                  >
                     <LogOut className="w-4 h-4" /> {t('profile.sign_out')}
                  </button>
                </nav>
             </div>
@@ -78,11 +78,11 @@ export default function ProfilePage() {
           {/* Main Content */}
           <main className="flex-1 space-y-12">
             <header>
                <h1 className="font-heading text-4xl text-stone-800 tracking-wider uppercase mb-3">{t('profile.dashboard')}</h1>
                <div className="w-12 h-px bg-gold mb-3" />
-               <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase italic">{t('profile.welcome')}</p>
+               <p className="font-body text-stone-600 text-micro tracking-[0.2em] uppercase italic">{t('profile.welcome')}</p>
             </header>
 
             {/* Quick Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <StatBox label={t('profile.total_investments')} value={isSupabaseConfigured ? formatPrice(totalInvested) : 'ΓÇö'} />
@@ -106,33 +106,33 @@ export default function ProfilePage() {
                    ))}
                  </div>
                ) : !isSupabaseConfigured ? (
                  <div className="bg-ivory p-12 text-center border border-stone-100">
                    <Package className="w-10 h-10 text-stone-200 mx-auto mb-4" />
-                    <p className="text-[10px] tracking-widest text-stone-400 uppercase">{t('profile.backend_not_connected')}</p>
+                    <p className="text-micro tracking-widest text-stone-600 uppercase">{t('profile.backend_not_connected')}</p>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="bg-ivory p-12 text-center border border-stone-100">
                    <Package className="w-10 h-10 text-stone-200 mx-auto mb-4" />
-                    <p className="text-[10px] tracking-widest text-stone-400 uppercase mb-6">{t('profile.no_orders')}</p>
-                    <Link to="/collection/bridal" className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold underline underline-offset-4">{t('profile.explore_new')}</Link>
+                    <p className="text-micro tracking-widest text-stone-600 uppercase mb-6">{t('profile.no_orders')}</p>
+                    <Link to="/collection/bridal" className="text-micro text-gold uppercase tracking-[0.3em] font-bold underline underline-offset-4">{t('profile.explore_new')}</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.id} className="bg-ivory p-6 border border-stone-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold/20 transition-colors">
                        <div>
-                         <h4 className="text-[11px] font-bold text-stone-800 uppercase tracking-widest mb-1">
+                         <h4 className="text-micro font-bold text-stone-800 uppercase tracking-widest mb-1">
                             {order.type === 'rental' ? t('profile.rental_booking') : order.type === 'mixed' ? t('profile.combined_order') : t('profile.purchase_order')} ΓÇö {order.id?.slice(0, 8)}
                          </h4>
-                         <p className="text-[12px] text-stone-500 italic mb-1">{order.items?.map(i => i.product_name).join(', ') || 'Order items'}</p>
-                         <p className="text-[9px] text-stone-300 uppercase tracking-widest">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</p>
+                         <p className="text-caption text-stone-600 italic mb-1">{order.items?.map(i => i.product_name).join(', ') || 'Order items'}</p>
+                         <p className="text-micro text-stone-500 uppercase tracking-widest">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gold font-heading text-sm font-bold">{formatPrice(order.subtotal)}</span>
                          <span className={cn(
-                           "px-3 py-1 text-[9px] font-bold uppercase tracking-widest border",
+                           "px-3 py-1 text-micro font-bold uppercase tracking-widest border",
                            order.status === 'cancelled' ? 'text-rose-400 border-rose-100 bg-rose-50/30' :
                            order.status === 'completed' || order.status === 'delivered' ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30' :
                            'text-gold border-gold/10 bg-ivory'
                          )}>
                            {order.status}
@@ -141,11 +141,11 @@ export default function ProfilePage() {
                      </div>
                    ))}
                  </div>
                )}
                {recentOrders.length > 0 && (
-                 <Link to="/collection/bridal" className="inline-flex items-center gap-3 text-[10px] text-gold uppercase tracking-[0.3em] font-bold mt-8 hover:gap-5 transition-all">
+                 <Link to="/collection/bridal" className="inline-flex items-center gap-3 text-micro text-gold uppercase tracking-[0.3em] font-bold mt-8 hover:gap-5 transition-all">
                     {t('profile.explore_new')} <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
             </section>
           </main>
@@ -158,22 +158,22 @@ export default function ProfilePage() {
 function ProfileLink({ icon: Icon, label, active, onClick }: any) {
   return (
     <button
       onClick={onClick}
       className={cn(
-        "w-full flex items-center gap-4 p-4 text-[10px] uppercase tracking-[0.2em] transition-all text-left border-l-2",
-        active ? "bg-gold/5 text-gold font-bold border-gold" : "text-stone-400 hover:text-stone-800 hover:bg-stone-50 border-transparent"
+        "w-full flex items-center gap-4 p-4 text-micro uppercase tracking-[0.2em] transition-all text-left border-l-2",
+        active ? "bg-gold/5 text-gold font-bold border-gold" : "text-stone-600 hover:text-stone-800 hover:bg-stone-50 border-transparent"
       )}
     >
       <Icon className="w-4 h-4" /> {label}
     </button>
   );
 }
 
 function StatBox({ label, value }: any) {
   return (
     <div className="bg-ivory p-8 border border-stone-100">
-      <p className="text-[9px] text-stone-400 uppercase tracking-widest mb-2">{label}</p>
+      <p className="text-micro text-stone-600 uppercase tracking-widest mb-2">{label}</p>
       <p className="font-heading text-2xl text-stone-800 tracking-wide">{value}</p>
     </div>
   );
 }
diff --git a/src/pages/SearchPage.tsx b/src/pages/SearchPage.tsx
index 5fd8cd4..02b83cd 100644
--- a/src/pages/SearchPage.tsx
+++ b/src/pages/SearchPage.tsx
@@ -33,11 +33,11 @@ export default function SearchPage() {
       {/* Search Header */}
       <section className="bg-ivory py-20 border-b border-stone-100 z-40">
         <div className="container mx-auto px-6">
           <div className="max-w-4xl mx-auto">
              <div className="relative group">
-                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-gold transition-colors" />
+                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-gold transition-colors" />
                 <input 
                   type="text" 
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder={t('search.placeholder')}
@@ -45,11 +45,11 @@ export default function SearchPage() {
                   autoFocus
                 />
                 {query && (
                   <button 
                     onClick={() => setQuery('')}
-                    className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800"
+                    className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800"
                     aria-label="Clear search"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 )}
@@ -60,12 +60,12 @@ export default function SearchPage() {
                 {categories.map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                     className={cn(
-                      "px-6 py-2 text-[10px] tracking-[0.2em] uppercase transition-all border",
-                      activeCategory === cat ? "bg-onyx text-white border-onyx" : "bg-ivory text-stone-400 border-stone-100 hover:border-gold"
+                      "px-6 py-2 text-micro tracking-[0.2em] uppercase transition-all border",
+                      activeCategory === cat ? "bg-onyx text-white border-onyx" : "bg-ivory text-stone-600 border-stone-100 hover:border-gold"
                     )}
                   >
                     {categoryLabel(cat)}
                   </button>
                 ))}
@@ -76,13 +76,13 @@ export default function SearchPage() {
 
       {/* Results */}
       <section className="section-padding container mx-auto px-6">
         <div className="flex justify-between items-center mb-12 border-b border-stone-200 pb-6">
            <h2 className="font-heading text-lg text-stone-800 tracking-widest uppercase">
-             {t('search.results')} <span className="text-stone-300 font-normal ml-2">({filteredProducts.length})</span>
+             {t('search.results')} <span className="text-stone-500 font-normal ml-2">({filteredProducts.length})</span>
            </h2>
-           <button className="flex items-center gap-2 text-[10px] text-stone-400 tracking-widest uppercase hover:text-gold transition-colors">
+           <button className="flex items-center gap-2 text-micro text-stone-600 tracking-widest uppercase hover:text-gold transition-colors">
               <SlidersHorizontal className="w-3 h-3" /> {t('search.advanced_filters')}
            </button>
         </div>
 
         <AnimatePresence mode="popLayout">
@@ -107,15 +107,15 @@ export default function SearchPage() {
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="text-center py-20"
               >
                  <div className="w-20 h-20 bg-stone-50 flex items-center justify-center mx-auto mb-8 border border-stone-100">
-                   <SearchIcon className="w-8 h-8 text-stone-300" />
+                   <SearchIcon className="w-8 h-8 text-stone-500" />
                  </div>
                   <h3 className="font-heading text-2xl text-stone-800 mb-4 tracking-widest uppercase">{t('search.empty_heading')}</h3>
                  <div className="w-12 h-px bg-gold mx-auto mb-4" />
-                  <p className="font-body text-stone-400 text-xs uppercase tracking-widest mb-10 max-w-md mx-auto leading-relaxed italic">
+                   <p className="font-body text-stone-600 text-xs uppercase tracking-widest mb-10 max-w-md mx-auto leading-relaxed italic">
                     {t('search.empty_desc')}
                   </p>
                  <button
                    onClick={() => {setQuery(''); setActiveCategory(null);}}
                    className="btn-luxury px-12"
diff --git a/src/pages/StyleQuiz.tsx b/src/pages/StyleQuiz.tsx
index 5bf699f..844aaba 100644
--- a/src/pages/StyleQuiz.tsx
+++ b/src/pages/StyleQuiz.tsx
@@ -131,11 +131,11 @@ export default function StyleQuiz() {
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-widest uppercase mb-4">{t('quiz.title')}</h1>
-            <p className="font-body text-stone-500 text-[10px] tracking-[0.4em] uppercase">{t('quiz.subtitle')}</p>
+            <p className="font-body text-stone-600 text-micro tracking-[0.4em] uppercase">{t('quiz.subtitle')}</p>
             <div className="w-16 h-px bg-gold mx-auto mt-6" />
           </motion.div>
         </header>
 
         {/* Progress Bar */}
@@ -158,15 +158,15 @@ export default function StyleQuiz() {
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="w-full"
               >
                 <div className="mb-8 flex items-center justify-between">
-                   <span className="text-[10px] tracking-widest text-gold font-bold uppercase">{t('quiz.progress')} {step + 1} / {questions.length}</span>
+                   <span className="text-micro tracking-widest text-gold font-bold uppercase">{t('quiz.progress')} {step + 1} / {questions.length}</span>
                    {step > 0 && (
                      <button 
                        onClick={() => setStep(step - 1)}
-                       className="text-stone-400 hover:text-stone-800 transition-colors"
+                       className="text-stone-600 hover:text-stone-800 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                 </div>
@@ -181,11 +181,11 @@ export default function StyleQuiz() {
                       key={option}
                       onClick={() => handleAnswer(option)}
                       className="group flex items-center justify-between p-6 border border-stone-100 bg-stone-50/50 hover:bg-ivory hover:border-gold hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 text-left"
                     >
                       <span className="font-body text-sm text-stone-700 group-hover:text-stone-900 group-hover:pl-2 transition-all duration-300">{option}</span>
-                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-gold transition-colors" />
+                      <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-gold transition-colors" />
                     </button>
                   ))}
                 </div>
               </motion.div>
             ) : (
@@ -194,16 +194,16 @@ export default function StyleQuiz() {
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="w-full"
               >
                 <div className="text-center mb-12">
-                  <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-bold">{t('quiz.your_aesthetic')}</span>
+                  <span className="text-micro tracking-[0.5em] uppercase text-gold font-bold">{t('quiz.your_aesthetic')}</span>
                   <h2 className="font-heading text-3xl md:text-4xl text-stone-800 mt-3 mb-4">
                     {recommendations.length > 0 ? t('quiz.your_matches') : t('quiz.no_matches')}
                   </h2>
                   <div className="w-16 h-px bg-gold mx-auto mb-5" />
-                  <p className="font-body text-sm text-stone-500">
+                  <p className="font-body text-sm text-stone-600">
                     {recommendations.length > 0 
                       ? t('quiz.based_on_answers')
                       : t('quiz.browse_collection')
                     }
                   </p>
@@ -215,11 +215,11 @@ export default function StyleQuiz() {
                       <ProductCard key={product.id} product={product} />
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-10">
-                    <p className="font-body text-stone-500 italic">{t('quiz.try_different')}</p>
+                    <p className="font-body text-stone-600 italic">{t('quiz.try_different')}</p>
                   </div>
                 )}
 
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link to="/collection/all" className="btn-luxury flex items-center gap-2 justify-center">
diff --git a/src/pages/WeddingChecklist.tsx b/src/pages/WeddingChecklist.tsx
index 07141a1..6e0a613 100644
--- a/src/pages/WeddingChecklist.tsx
+++ b/src/pages/WeddingChecklist.tsx
@@ -9,11 +9,11 @@ export default function WeddingChecklist() {
   ];
 
   return (
     <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
       <div className="text-center mb-20">
-        <h2 className="heading-editorial text-gold text-[10px] mb-4">The Road to I Do</h2>
+        <h2 className="heading-editorial text-gold text-micro mb-4">The Road to I Do</h2>
         <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider mb-6">Wedding Planning Checklist</h1>
         <div className="divider-gold" />
       </div>
 
       <div className="space-y-12">
diff --git a/src/pages/WishlistPage.tsx b/src/pages/WishlistPage.tsx
index 5425788..ee24a10 100644
--- a/src/pages/WishlistPage.tsx
+++ b/src/pages/WishlistPage.tsx
@@ -1,18 +1,19 @@
 import { useWishlist } from '../contexts/WishlistContext';
 import { useCart } from '../contexts/CartContext';
 import { useLanguage } from '../contexts/LanguageContext';
 import { ShoppingBag, X, Heart, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
 import { formatPrice } from '../lib/utils';
-import { Link } from 'react-router-dom';
+import { Link, useNavigate } from 'react-router-dom';
 import { motion, AnimatePresence } from 'motion/react';
 import { useState } from 'react';
 
 export default function WishlistPage() {
   const { wishlist, removeFromWishlist, isLoading } = useWishlist();
   const { addItem } = useCart();
   const { t } = useLanguage();
+  const navigate = useNavigate();
   const [addedId, setAddedId] = useState<string | null>(null);
 
   const handleMoveToBag = (product: any) => {
     const defaultSize = product.sizes?.[0] || undefined;
     addItem(product, 'sale', defaultSize);
@@ -22,19 +23,33 @@ export default function WishlistPage() {
 
   return (
     <div className="pt-32 pb-20 bg-ivory min-h-screen">
       <div className="container mx-auto px-6">
         <header className="text-center mb-20">
-           <h1 className="font-heading text-4xl md:text-6xl text-stone-800 tracking-wider uppercase mb-4">{t('wishlist.title')}</h1>
-           <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase italic">{t('wishlist.subtitle')}</p>
+           <h1 className="font-heading text-4xl md:text-6xl text-stone-800 tracking-wider uppercase mb-4">{t('selection.title')}</h1>
+           <p className="font-body text-stone-600 text-micro tracking-[0.2em] uppercase italic">{t('selection.subtitle')}</p>
+           <p className="font-body text-stone-600 text-micro tracking-[0.2em] uppercase italic">{wishlist.length} {t('selection.count')}</p>
         </header>
 
         {isLoading ? (
           <div className="flex items-center justify-center py-32">
             <Loader2 className="w-8 h-8 text-gold animate-spin" />
           </div>
         ) : wishlist.length > 0 ? (
+          <>
+          <div className="flex justify-center mb-12">
+            <button
+              onClick={() => navigate('/appointment', {
+                state: {
+                  gowns: wishlist.map(p => ({ id: p.id, name: p.name, intent: (p.productType === 'rent' ? 'rent' : 'sale') as 'rent' | 'sale' })),
+                },
+              })}
+              className="btn-luxury px-12 w-full sm:w-auto"
+            >
+              {t('selection.request_viewing')}
+            </button>
+          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             <AnimatePresence mode="popLayout">
               {wishlist.map((product) => (
                 <motion.div 
                   key={product.id}
@@ -44,11 +59,11 @@ export default function WishlistPage() {
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="bg-ivory border border-stone-100 group relative"
                 >
                   <button 
                     onClick={() => removeFromWishlist(product.id)}
-                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-ivory/80 backdrop-blur-sm flex items-center justify-center text-stone-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
+                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-ivory/80 backdrop-blur-sm flex items-center justify-center text-stone-600 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                   >
                     <X className="w-4 h-4" />
                   </button>
 
                   <Link to={`/product/${product.id}`} className="block overflow-hidden aspect-[4/5]">
@@ -59,39 +74,52 @@ export default function WishlistPage() {
                       loading="lazy"
                     />
                   </Link>
 
                   <div className="p-8 text-center border-t border-stone-50">
-                    <span className="text-[10px] text-stone-300 uppercase tracking-widest mb-2 block">{product.category}</span>
+                    <span className="text-micro text-stone-500 uppercase tracking-widest mb-2 block">{product.category}</span>
                     <h3 className="font-heading text-lg text-stone-800 mb-4 tracking-wide group-hover:text-gold transition-colors">{product.name}</h3>
 <p className="font-body text-sm text-gold mb-8">{formatPrice(product.salePrice || product.rentalPrice || 0)}</p>
 
                      <div className="flex gap-2">
-                        <Link to={`/product/${product.id}`} className="flex-1 btn-luxury !py-3 !px-4 text-[10px]">{t('wishlist.view')}</Link>
+                        <Link to={`/product/${product.id}`} className="flex-1 btn-luxury !py-3 !px-4 text-micro">{t('selection.view')}</Link>
                         <button
                           onClick={() => handleMoveToBag(product)}
-                          className="flex-1 btn-luxury-outline !py-3 !px-4 text-[10px] flex items-center justify-center gap-2"
+                          className="flex-1 btn-luxury-outline !py-3 !px-4 text-micro flex items-center justify-center gap-2"
                         >
                           {addedId === product.id ? (
                             <><CheckCircle2 className="w-3.5 h-3.5" /> {t('product.added')}</>
                           ) : (
-                            <><ShoppingBag className="w-3.5 h-3.5" /> {t('wishlist.add_to_bag')}</>
+                            <><ShoppingBag className="w-3.5 h-3.5" /> {t('selection.add_to_bag')}</>
                           )}
                         </button>
                      </div>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
+          <div className="flex justify-center mt-12">
+            <button
+              onClick={() => navigate('/appointment', {
+                state: {
+                  gowns: wishlist.map(p => ({ id: p.id, name: p.name, intent: (p.productType === 'rent' ? 'rent' : 'sale') as 'rent' | 'sale' })),
+                },
+              })}
+              className="btn-luxury px-12 w-full sm:w-auto"
+            >
+              {t('selection.request_viewing')}
+            </button>
+          </div>
+          </>
         ) : (
           <div className="text-center py-32 bg-ivory border border-stone-100">
 <Heart className="w-16 h-16 text-stone-100 mx-auto mb-8" />
-              <h3 className="font-heading text-2xl text-stone-800 mb-4 tracking-widest uppercase">{t('wishlist.empty')}</h3>
-              <p className="font-body text-stone-400 text-xs uppercase tracking-widest mb-10 italic">{t('wishlist.empty_desc')}</p>
+              <h3 className="font-heading text-2xl text-stone-800 mb-4 tracking-widest uppercase">{t('selection.empty')}</h3>
+              <p className="font-body text-stone-600 text-xs uppercase tracking-widest mb-10 italic">{t('selection.empty_desc')}</p>
               <Link to="/search" className="btn-luxury px-12 group flex items-center gap-3 mx-auto w-fit">
-                {t('wishlist.explore')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
+                {t('selection.explore')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
           </div>
         )}
       </div>
     </div>
diff --git a/src/pages/admin/AdminAppointments.tsx b/src/pages/admin/AdminAppointments.tsx
index b126cb6..fdf639c 100644
--- a/src/pages/admin/AdminAppointments.tsx
+++ b/src/pages/admin/AdminAppointments.tsx
@@ -1,7 +1,7 @@
 import { useState, useEffect } from 'react';
-import { Calendar, Clock, Mail, Phone, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
+import { Calendar, Clock, Mail, Phone, Heart, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { cn } from '../../lib/utils';
 import { fetchAppointments, updateAppointmentStatus } from '../../services/appointments';
 import { isSupabaseConfigured } from '../../services/supabase';
 import { Appointment } from '../../types';
@@ -69,11 +69,11 @@ export default function AdminAppointments() {
   return (
     <div>
       <div className="flex items-center justify-between mb-8">
         <div>
           <h1 className="font-heading text-2xl text-stone-800 tracking-wider uppercase">Appointments</h1>
-          <p className="text-stone-500 text-sm mt-1">{appointments.length} total bookings</p>
+          <p className="text-stone-600 text-sm mt-1">{appointments.length} total bookings</p>
         </div>
       </div>
 
       {error && (
           <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
@@ -83,12 +83,12 @@ export default function AdminAppointments() {
         )}
 
       {appointments.length === 0 ? (
         <div className="text-center py-20 bg-ivory border border-stone-100">
           <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
-          <p className="font-heading text-stone-400">No appointments yet</p>
-          <p className="text-stone-400 text-sm mt-2">Bookings from the appointment page will appear here.</p>
+          <p className="font-heading text-stone-600">No appointments yet</p>
+          <p className="text-stone-600 text-sm mt-2">Bookings from the appointment page will appear here.</p>
         </div>
       ) : (
         <div className="space-y-3">
           {appointments.map(appt => (
             <motion.div
@@ -99,21 +99,27 @@ export default function AdminAppointments() {
               onClick={() => setSelectedAppt(appt)}
             >
               <div className="flex items-start justify-between">
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
-                    <span className={cn("text-[10px] tracking-widest uppercase font-bold px-3 py-1 border", STATUS_COLORS[appt.status || 'pending'])}>
+                    <span className={cn("text-micro tracking-widest uppercase font-bold px-3 py-1 border", STATUS_COLORS[appt.status || 'pending'])}>
                       {appt.status || 'pending'}
                     </span>
-                    <span className="text-[10px] tracking-widest uppercase text-gold font-bold">{SERVICE_LABELS[appt.service_type] || appt.service_type}</span>
+                    <span className="text-micro tracking-widest uppercase text-gold font-bold">{SERVICE_LABELS[appt.service_type] || appt.service_type}</span>
                   </div>
                   <h3 className="font-heading text-stone-800 text-lg">{appt.name}</h3>
-                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-500">
+                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-600">
                     <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {appt.date}</span>
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.time}</span>
                     <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {appt.email}</span>
                     <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {appt.phone}</span>
+                    {(appt.interested_gowns?.length ?? 0) > 0 && (
+                      <span className="flex items-start gap-1 basis-full">
+                        <Heart className="w-3 h-3 mt-0.5 shrink-0" />
+                        <span className="italic">{appt.interested_gowns!.map(g => `${g.name}${g.size ? ` (${g.size})` : ''}`).join(' ┬╖ ')}</span>
+                      </span>
+                    )}
                   </div>
                 </div>
                 <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                   <button onClick={() => handleStatusChange(appt.id!, 'confirmed')} className="p-2 text-emerald-500 hover:bg-emerald-50 transition-colors" aria-label="Confirm appointment" title="Confirm">
                     <CheckCircle2 className="w-4 h-4" />
@@ -135,22 +141,22 @@ export default function AdminAppointments() {
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-ivory p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
               <button onClick={() => setSelectedAppt(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800" aria-label="Close"><XCircle className="w-5 h-5" /></button>
               <h2 className="font-heading text-xl text-stone-800 tracking-wider uppercase mb-6">Appointment Details</h2>
               <div className="space-y-4 text-sm">
                 <div className="grid grid-cols-2 gap-4">
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Client</span><span className="text-stone-800 font-medium">{selectedAppt.name}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Service</span><span className="text-stone-800 font-medium">{SERVICE_LABELS[selectedAppt.service_type] || selectedAppt.service_type}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Date</span><span className="text-stone-800 font-medium">{selectedAppt.date}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Time</span><span className="text-stone-800 font-medium">{selectedAppt.time}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Email</span><span className="text-stone-800 font-medium">{selectedAppt.email}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Phone</span><span className="text-stone-800 font-medium">{selectedAppt.phone}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Client</span><span className="text-stone-800 font-medium">{selectedAppt.name}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Service</span><span className="text-stone-800 font-medium">{SERVICE_LABELS[selectedAppt.service_type] || selectedAppt.service_type}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Date</span><span className="text-stone-800 font-medium">{selectedAppt.date}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Time</span><span className="text-stone-800 font-medium">{selectedAppt.time}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Email</span><span className="text-stone-800 font-medium">{selectedAppt.email}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Phone</span><span className="text-stone-800 font-medium">{selectedAppt.phone}</span></div>
                 </div>
                 {selectedAppt.notes && (
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Notes</span><p className="text-stone-600">{selectedAppt.notes}</p></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Notes</span><p className="text-stone-600">{selectedAppt.notes}</p></div>
                 )}
-                <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Status</span>
-                  <span className={cn("text-[10px] tracking-widest uppercase font-bold px-3 py-1 border", STATUS_COLORS[selectedAppt.status || 'pending'])}>
+                <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Status</span>
+                  <span className={cn("text-micro tracking-widest uppercase font-bold px-3 py-1 border", STATUS_COLORS[selectedAppt.status || 'pending'])}>
                     {selectedAppt.status || 'pending'}
                   </span>
                 </div>
               </div>
               <div className="flex gap-3 mt-6">
diff --git a/src/pages/admin/AdminCalendar.tsx b/src/pages/admin/AdminCalendar.tsx
index 5097aec..4321ece 100644
--- a/src/pages/admin/AdminCalendar.tsx
+++ b/src/pages/admin/AdminCalendar.tsx
@@ -43,17 +43,17 @@ export default function AdminCalendar() {
               {format(currentMonth, 'MMMM yyyy')}
             </h3>
             <div className="flex gap-2">
               <button onClick={() => navigateMonth(-1)} className="px-3 py-2 border border-stone-200 hover:bg-stone-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
               <button onClick={() => navigateMonth(1)} className="px-3 py-2 border border-stone-200 hover:bg-stone-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
-              <button onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} className="px-4 py-2 text-[10px] tracking-widest uppercase border border-stone-200 hover:bg-stone-50 transition-colors">Today</button>
+              <button onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} className="px-4 py-2 text-micro tracking-widest uppercase border border-stone-200 hover:bg-stone-50 transition-colors">Today</button>
             </div>
           </div>
           
           <div className="grid grid-cols-7 border-b border-stone-100 bg-stone-50">
             {dayLabels.map(label => (
-              <div key={label} className="py-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center border-r border-stone-100 last:border-r-0">
+              <div key={label} className="py-3 text-micro font-bold text-stone-600 uppercase tracking-widest text-center border-r border-stone-100 last:border-r-0">
                 {label}
               </div>
             ))}
           </div>
 
@@ -72,19 +72,19 @@ export default function AdminCalendar() {
                     isSelected ? "ring-2 ring-inset ring-gold z-10" : "hover:bg-ivory",
                     !isCurrentMonth && "opacity-30"
                   )}
                 >
                   <span className={cn(
-                    "text-[10px] font-bold px-2 py-1",
-                    isSelected ? "bg-gold text-white" : "text-stone-400 group-hover:text-stone-800"
+                    "text-micro font-bold px-2 py-1",
+                    isSelected ? "bg-gold text-white" : "text-stone-600 group-hover:text-stone-800"
                   )}>
                     {format(day, 'd')}
                   </span>
                   
                   <div className="mt-2 space-y-1">
                     {reservations.map(res => (
-                      <div key={res.id} className="text-[8px] bg-gold/5 border border-gold/10 px-2 py-1 flex items-center justify-between">
+                      <div key={res.id} className="text-micro bg-gold/5 border border-gold/10 px-2 py-1 flex items-center justify-between">
                          <span className="font-bold text-stone-800 truncate">{res.customer}</span>
                          <span className={cn(
                            "px-1",
                            res.service === 'Rental' ? 'text-blue-600' : 'text-gold'
                          )}>ΓùÅ</span>
@@ -99,53 +99,53 @@ export default function AdminCalendar() {
 
         {/* Sidebar Details */}
         <div className="space-y-6">
           <div className="bg-ivory border border-stone-200 p-8">
             <h4 className="font-heading text-lg text-stone-800 uppercase tracking-widest mb-6">Day Agenda</h4>
-            <p className="text-[10px] tracking-widest text-stone-400 uppercase mb-8">{selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'No date selected'}</p>
+            <p className="text-micro tracking-widest text-stone-600 uppercase mb-8">{selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'No date selected'}</p>
             
             <div className="space-y-6">
               {selectionsForDay.length > 0 ? selectionsForDay.map(res => (
                 <div key={res.id} className="p-4 bg-ivory border-l-2 border-gold space-y-3">
-                  <div className="flex items-center gap-2 text-[10px] font-bold text-stone-800 uppercase tracking-widest">
+                  <div className="flex items-center gap-2 text-micro font-bold text-stone-800 uppercase tracking-widest">
                     <User className="w-3 h-3 text-gold" /> {res.customer}
                   </div>
-                  <div className="flex items-center gap-2 text-[9px] text-stone-500 uppercase tracking-widest">
+                  <div className="flex items-center gap-2 text-micro text-stone-600 uppercase tracking-widest">
                     <Clock className="w-3 h-3" /> 10:30 AM - {res.service}
                   </div>
-                  <div className="flex items-center gap-2 text-[9px] text-stone-500 uppercase tracking-widest">
+                  <div className="flex items-center gap-2 text-micro text-stone-600 uppercase tracking-widest">
                     <Package className="w-3 h-3" /> {res.item}
                   </div>
-                  <button onClick={() => setSelectedDate(null)} className="w-full mt-2 py-2 text-[8px] tracking-[0.2em] font-bold uppercase border border-gold/20 text-gold hover:bg-gold hover:text-white transition-all">
+                  <button onClick={() => setSelectedDate(null)} className="w-full mt-2 py-2 text-micro tracking-[0.2em] font-bold uppercase border border-gold/20 text-gold hover:bg-gold hover:text-white transition-all">
                     View Dossier
                   </button>
                 </div>
               )) : (
                 <div className="py-20 text-center">
-                  <p className="text-[10px] text-stone-400 uppercase tracking-widest italic">No bookings on this date</p>
+                  <p className="text-micro text-stone-600 uppercase tracking-widest italic">No bookings on this date</p>
                 </div>
               )}
             </div>
             
             <button onClick={() => navigate('/appointment')} className="w-full mt-8 btn-luxury flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" /> New Booking
             </button>
           </div>
 
           <div className="bg-stone-900 p-8 text-white">
-            <h4 className="text-[10px] tracking-widest uppercase text-gold mb-4">Capacity Insight</h4>
+            <h4 className="text-micro tracking-widest uppercase text-gold mb-4">Capacity Insight</h4>
             <div className="space-y-4">
               <div>
-                <div className="flex justify-between text-[8px] uppercase tracking-widest mb-2 font-bold">
+                <div className="flex justify-between text-micro uppercase tracking-widest mb-2 font-bold">
                   <span>Atelier Slots</span>
                   <span>80%</span>
                 </div>
                 <div className="h-1 bg-stone-800 overflow-hidden">
                   <div className="h-full bg-gold w-4/5" />
                 </div>
               </div>
-              <p className="text-[9px] text-stone-400 leading-relaxed italic">The Sharjah boutique is nearing capacity for bridal consultations in April.</p>
+              <p className="text-micro text-stone-400 leading-relaxed italic">The Sharjah boutique is nearing capacity for bridal consultations in April.</p>
             </div>
           </div>
         </div>
       </div>
     </div>
diff --git a/src/pages/admin/AdminContent.tsx b/src/pages/admin/AdminContent.tsx
index c57b29d..7edd8df 100644
--- a/src/pages/admin/AdminContent.tsx
+++ b/src/pages/admin/AdminContent.tsx
@@ -49,11 +49,11 @@ export default function AdminContent() {
   return (
     <div className="space-y-8 animate-fade-in h-[calc(100vh-9rem)] flex flex-col">
       <div className="flex justify-between items-center bg-ivory p-8 border border-stone-200 shrink-0">
         <div>
           <h2 className="font-heading text-2xl text-stone-800 tracking-wide uppercase">Artisan CMS</h2>
-          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mt-1">Curation & Creative Control</p>
+          <p className="text-micro tracking-[0.3em] text-stone-600 uppercase mt-1">Curation & Creative Control</p>
         </div>
         <div className="flex items-center gap-4">
           <AnimatePresence>
             {showSuccess && (
               <motion.div 
@@ -61,21 +61,21 @@ export default function AdminContent() {
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 border border-green-100"
               >
                 <CheckCircle2 className="w-4 h-4" />
-                <span className="text-[10px] uppercase tracking-widest font-bold">Changes Published</span>
+                <span className="text-micro uppercase tracking-widest font-bold">Changes Published</span>
               </motion.div>
             )}
             {saveError && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 border border-rose-100"
               >
-                <span className="text-[10px] uppercase tracking-widest font-bold">{saveError}</span>
+                <span className="text-micro uppercase tracking-widest font-bold">{saveError}</span>
               </motion.div>
             )}
           </AnimatePresence>
           <button 
             onClick={handleSave}
@@ -159,12 +159,12 @@ interface CMSNavLinkProps {
 function CMSNavLink({ label, active, onClick, icon: Icon }: CMSNavLinkProps) {
   return (
     <button 
       onClick={onClick}
       className={cn(
-        "w-full flex items-center justify-between px-4 py-3 text-[10px] tracking-widest uppercase transition-all group",
-        active ? "bg-stone-900 text-white font-bold" : "text-stone-400 hover:text-stone-800 hover:bg-stone-50"
+        "w-full flex items-center justify-between px-4 py-3 text-micro tracking-widest uppercase transition-all group",
+        active ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:text-stone-800 hover:bg-stone-50"
       )}
     >
       <div className="flex items-center gap-3">
         <Icon className="w-3 h-3" />
         {label}
@@ -181,11 +181,11 @@ interface EditorHeaderProps {
 
 function EditorHeader({ title, subtitle }: EditorHeaderProps) {
   return (
     <div className="border-b border-stone-100 pb-4">
       <h4 className="font-heading text-lg text-stone-800 tracking-wide uppercase">{title}</h4>
-      <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] italic mt-1">{subtitle}</p>
+      <p className="text-micro text-stone-600 uppercase tracking-[0.2em] italic mt-1">{subtitle}</p>
     </div>
   );
 }
 
 interface CMSInputProps {
@@ -195,11 +195,11 @@ interface CMSInputProps {
 }
 
 function CMSInput({ label, name, defaultValue }: CMSInputProps) {
   return (
     <div className="space-y-2">
-      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{label}</label>
+      <label className="text-micro font-black text-stone-600 uppercase tracking-widest">{label}</label>
       <input 
         type="text" 
         name={name}
         defaultValue={defaultValue}
         className="w-full bg-stone-50 border border-stone-100 p-4 text-xs tracking-widest outline-none focus:border-gold transition-colors font-medium text-stone-800"
@@ -215,11 +215,11 @@ interface CMSTextareaProps {
 }
 
 function CMSTextarea({ label, name, defaultValue }: CMSTextareaProps) {
   return (
     <div className="space-y-2">
-      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{label}</label>
+      <label className="text-micro font-black text-stone-600 uppercase tracking-widest">{label}</label>
       <textarea 
         name={name}
         defaultValue={defaultValue}
         rows={6}
         className="w-full bg-stone-50 border border-stone-100 p-4 text-xs tracking-widest leading-relaxed outline-none focus:border-gold transition-colors font-medium text-stone-800 resize-none shadow-inner"
diff --git a/src/pages/admin/AdminDashboard.tsx b/src/pages/admin/AdminDashboard.tsx
index 82416f3..5c30a07 100644
--- a/src/pages/admin/AdminDashboard.tsx
+++ b/src/pages/admin/AdminDashboard.tsx
@@ -96,11 +96,11 @@ export default function AdminDashboard() {
   if (!isSupabaseConfigured) {
     return (
       <div className="flex flex-col items-center justify-center h-[60vh] text-center">
         <ShoppingCart className="w-12 h-12 text-stone-300 mb-4" />
         <h3 className="font-heading text-xl text-stone-800 uppercase tracking-widest mb-2">Dashboard Requires Backend</h3>
-        <p className="text-sm text-stone-400">Connect Supabase to see real analytics.</p>
+        <p className="text-sm text-stone-600">Connect Supabase to see real analytics.</p>
       </div>
     );
   }
 
   if (isLoading) {
@@ -113,11 +113,11 @@ export default function AdminDashboard() {
 
   if (error) {
     return (
       <div className="flex flex-col items-center justify-center h-[60vh] text-center">
         <p className="text-rose-500 text-sm mb-4">{error}</p>
-        <button onClick={loadDashboard} className="btn-luxury text-[10px]">Retry</button>
+        <button onClick={loadDashboard} className="btn-luxury text-micro">Retry</button>
       </div>
     );
   }
 
   const s = stats!;
@@ -134,11 +134,11 @@ export default function AdminDashboard() {
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 bg-ivory p-8 border border-stone-200">
           <div className="flex justify-between items-center mb-10">
             <div>
               <h3 className="font-heading text-xl text-stone-800 tracking-wide uppercase">Performance Overview</h3>
-              <p className="text-[10px] tracking-widest text-stone-400 uppercase mt-1">Monthly Revenue (Paid Orders)</p>
+              <p className="text-micro tracking-widest text-stone-600 uppercase mt-1">Monthly Revenue (Paid Orders)</p>
             </div>
           </div>
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={s.monthlyRevenue}>
@@ -177,11 +177,11 @@ export default function AdminDashboard() {
           <div className="space-y-4">
             {s.categoryBreakdown.map((cat) => (
               <div key={cat.name} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3" style={{ backgroundColor: cat.color }} />
-                  <span className="text-[10px] tracking-widest text-stone-600 uppercase font-bold">{cat.name}</span>
+                  <span className="text-micro tracking-widest text-stone-600 uppercase font-bold">{cat.name}</span>
                 </div>
                 <span className="text-xs text-stone-800">{cat.value}%</span>
               </div>
             ))}
           </div>
@@ -190,30 +190,30 @@ export default function AdminDashboard() {
 
       <div className="bg-ivory border border-stone-200 overflow-hidden shadow-sm">
         <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
           <div>
             <h3 className="font-heading text-xl text-stone-800 tracking-wide uppercase">Recent Orders</h3>
-            <p className="text-[10px] tracking-widest text-stone-400 uppercase mt-1">Latest order activity</p>
+            <p className="text-micro tracking-widest text-stone-600 uppercase mt-1">Latest order activity</p>
           </div>
-          <Link to="/admin/orders" className="group flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gold hover:text-stone-800 transition-colors">
+          <Link to="/admin/orders" className="group flex items-center gap-2 text-micro tracking-[0.2em] uppercase text-gold hover:text-stone-800 transition-colors">
             Manage All Orders <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
           </Link>
         </div>
         <div className="overflow-x-auto">
           {s.recentOrders.length === 0 ? (
             <div className="p-12 text-center">
-              <p className="text-stone-400 text-sm">No orders yet.</p>
+              <p className="text-stone-600 text-sm">No orders yet.</p>
             </div>
           ) : (
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-ivory border-b border-stone-100">
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Client</th>
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Items</th>
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Type</th>
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Amount</th>
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold text-center">Status</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold">Client</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold">Items</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold">Type</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold">Amount</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold text-center">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-stone-100">
                 {s.recentOrders.map((order) => (
                   <OrderRow key={order.id} order={order} />
@@ -233,11 +233,11 @@ function StatCard({ title, value, icon: Icon }: { title: string; value: string;
       <div className="flex justify-between items-start mb-4">
         <div className="p-3 bg-ivory text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
           <Icon className="w-5 h-5" />
         </div>
       </div>
-      <p className="text-[10px] tracking-widest text-stone-400 uppercase mb-1">{title}</p>
+      <p className="text-micro tracking-widest text-stone-600 uppercase mb-1">{title}</p>
       <h4 className="text-xl font-heading text-stone-800 tracking-wide">{value}</h4>
     </div>
   );
 }
 
@@ -256,24 +256,24 @@ function OrderRow({ order }: { key?: React.Key; order: Order }) {
 
   return (
     <tr className="hover:bg-stone-50 transition-colors">
       <td className="px-8 py-5">
         <p className="text-xs font-bold text-stone-800">{order.customer_name || 'Guest'}</p>
-        <p className="text-[8px] text-stone-400 uppercase tracking-widest mt-1">{shortDate}</p>
+        <p className="text-micro text-stone-600 uppercase tracking-widest mt-1">{shortDate}</p>
       </td>
       <td className="px-8 py-5 text-stone-600 text-xs max-w-[200px] truncate">{itemNames}</td>
       <td className="px-8 py-5 translate-y-[2px]">
         <span className={cn(
-          "text-[8px] tracking-[0.2em] uppercase px-2 py-1 border",
-          order.type === 'sale' ? "border-gold text-gold" : "border-stone-300 text-stone-400"
+          "text-micro tracking-[0.2em] uppercase px-2 py-1 border",
+          order.type === 'sale' ? "border-gold text-gold" : "border-stone-300 text-stone-600"
         )}>
           {order.type}
         </span>
       </td>
       <td className="px-8 py-5 text-xs text-stone-800 font-medium">AED {(order.subtotal || 0).toLocaleString()}</td>
       <td className="px-8 py-5 text-center">
-        <span className={cn("inline-block text-[8px] tracking-widest uppercase px-3 py-1 font-bold", statusColors[order.status] || 'bg-stone-100 text-stone-600')}>
+        <span className={cn("inline-block text-micro tracking-widest uppercase px-3 py-1 font-bold", statusColors[order.status] || 'bg-stone-100 text-stone-600')}>
           {order.status}
         </span>
       </td>
     </tr>
   );
diff --git a/src/pages/admin/AdminGallery.tsx b/src/pages/admin/AdminGallery.tsx
index 5b1a077..32e384f 100644
--- a/src/pages/admin/AdminGallery.tsx
+++ b/src/pages/admin/AdminGallery.tsx
@@ -165,11 +165,11 @@ export default function AdminGallery() {
       </div>
 
       <div className="bg-white border border-stone-200 overflow-hidden">
         <table className="w-full">
           <thead>
-            <tr className="border-b border-stone-200 text-[10px] tracking-widest uppercase text-stone-500">
+            <tr className="border-b border-stone-200 text-micro tracking-widest uppercase text-stone-600">
               <th className="text-left p-4 w-16"></th>
               <th className="text-left p-4">Media</th>
               <th className="text-left p-4">Title</th>
               <th className="text-left p-4">Category</th>
               <th className="text-left p-4">Type</th>
@@ -212,17 +212,17 @@ export default function AdminGallery() {
                       {CATEGORIES.map((c) => (
                         <option key={c.value} value={c.value}>{c.label}</option>
                       ))}
                     </select>
                   ) : (
-                    <span className="inline-block px-2 py-1 bg-stone-100 text-[10px] tracking-widest uppercase">
+                    <span className="inline-block px-2 py-1 bg-stone-100 text-micro tracking-widest uppercase">
                       {item.category.replace('_', ' ')}
                     </span>
                   )}
                 </td>
                 <td className="p-4">
-                  <span className="text-[10px] tracking-widest uppercase">{item.media_type}</span>
+                  <span className="text-micro tracking-widest uppercase">{item.media_type}</span>
                 </td>
                 <td className="p-4">
                   {editingId === item.id ? (
                     <input
                       type="number"
@@ -242,11 +242,11 @@ export default function AdminGallery() {
                 <td className="p-4">
                   <div className="flex items-center gap-2">
                     {editingId === item.id ? (
                       <>
                         <button onClick={handleSave} className="text-xs text-gold hover:text-gold/70 font-bold">Save</button>
-                        <button onClick={() => setEditingId(null)} className="text-xs text-stone-400 hover:text-stone-600">Cancel</button>
+                        <button onClick={() => setEditingId(null)} className="text-xs text-stone-600 hover:text-stone-800">Cancel</button>
                       </>
                     ) : (
                       <>
                         <button onClick={() => handleEdit(item)} className="text-stone-400 hover:text-gold transition-colors">
                           <Edit2 className="w-4 h-4" />
@@ -279,11 +279,11 @@ export default function AdminGallery() {
               exit={{ scale: 0.95 }}
               className="bg-white p-8 max-w-sm w-full"
               onClick={(e) => e.stopPropagation()}
             >
               <h3 className="font-heading text-lg tracking-widest uppercase mb-4">Delete Item?</h3>
-              <p className="text-stone-500 text-sm mb-6">This action cannot be undone.</p>
+              <p className="text-stone-600 text-sm mb-6">This action cannot be undone.</p>
               <div className="flex gap-4">
                 <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-stone-200 text-xs tracking-widest uppercase hover:border-gold">
                   Cancel
                 </button>
                 <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-rose-500 text-white text-xs tracking-widest uppercase hover:bg-rose-600">
diff --git a/src/pages/admin/AdminLayout.tsx b/src/pages/admin/AdminLayout.tsx
index 7b32028..7921eb8 100644
--- a/src/pages/admin/AdminLayout.tsx
+++ b/src/pages/admin/AdminLayout.tsx
@@ -24,11 +24,11 @@ function SidebarContent({ onNav }: { onNav: () => void }) {
     <>
       <div className="p-6 border-b border-stone-800">
         <Link to="/" onClick={onNav} className="font-heading text-xl tracking-[0.2em] uppercase text-gold block">
           Riman Admin
         </Link>
-        <p className="text-[8px] tracking-[0.3em] text-stone-500 uppercase mt-2">Boutique Management</p>
+        <p className="text-micro tracking-[0.3em] text-stone-500 uppercase mt-2">Boutique Management</p>
       </div>
 
       <nav className="flex-grow py-6 px-4 space-y-1 overflow-y-auto">
         {adminNav.map((item) => {
           const isActive = location.pathname === item.path;
@@ -116,21 +116,21 @@ export default function AdminLayout() {
                 <rect width="18" height="18" x="3" y="3" rx="2"/>
                 <path d="M9 3v18"/>
                 <path d="m14 9-3 3 3 3"/>
               </svg>
             </button>
-            <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-stone-400">
+            <div className="flex items-center gap-2 text-micro tracking-widest uppercase text-stone-600">
               <span className="hidden sm:inline">Admin</span>
               <ChevronRight className="w-3 h-3 hidden sm:inline" />
               <span className="text-stone-800 font-bold truncate max-w-[200px]">{adminNav.find(n => n.path === location.pathname)?.label || 'Overview'}</span>
             </div>
           </div>
 
           <div className="flex items-center gap-4 shrink-0">
             <div className="text-right hidden sm:block">
-              <p className="text-[10px] font-bold text-stone-800 uppercase tracking-wider">{user?.name || 'Admin'}</p>
-              <p className="text-[8px] text-stone-400 uppercase tracking-widest">{user?.role === 'admin' ? 'Administrator' : 'Manager'}</p>
+              <p className="text-micro font-bold text-stone-800 uppercase tracking-wider">{user?.name || 'Admin'}</p>
+              <p className="text-micro text-stone-600 uppercase tracking-widest">{user?.role === 'admin' ? 'Administrator' : 'Manager'}</p>
             </div>
             <div className="w-10 h-10 bg-ivory border border-stone-200 flex items-center justify-center text-gold font-heading font-bold text-sm">
               {(user?.name || 'R')[0].toUpperCase()}
             </div>
           </div>
diff --git a/src/pages/admin/AdminOrders.tsx b/src/pages/admin/AdminOrders.tsx
index 22c7015..263a236 100644
--- a/src/pages/admin/AdminOrders.tsx
+++ b/src/pages/admin/AdminOrders.tsx
@@ -108,22 +108,22 @@ export default function AdminOrders() {
 
   if (!isSupabaseConfigured) {
     return (
       <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-ivory border border-stone-200">
         <ShoppingCart className="w-12 h-12 text-stone-300 mb-4" />
-        <h2 className="font-heading text-xl text-stone-400 tracking-widest uppercase mb-2">Orders Require Backend</h2>
-        <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase italic">Configure Supabase to manage orders</p>
+        <h2 className="font-heading text-xl text-stone-600 tracking-widest uppercase mb-2">Orders Require Backend</h2>
+        <p className="text-micro tracking-[0.3em] text-stone-600 uppercase italic">Configure Supabase to manage orders</p>
       </div>
     );
   }
 
   return (
     <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ivory p-8 border border-stone-200">
         <div>
           <h2 className="font-heading text-2xl text-stone-800 tracking-wide uppercase">Order Management</h2>
-          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mt-1">Track & fulfill customer investments</p>
+          <p className="text-micro tracking-[0.3em] text-stone-600 uppercase mt-1">Track & fulfill customer investments</p>
         </div>
         <button onClick={loadOrders} className="btn-luxury-outline flex items-center gap-2 text-xs">
           <RefreshCw className="w-3 h-3" /> Refresh
         </button>
       </div>
@@ -144,12 +144,12 @@ export default function AdminOrders() {
             {['all', ...STATUS_OPTIONS].map(s => (
               <button
                 key={s}
                 onClick={() => setStatusFilter(s)}
                 className={cn(
-                  "text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-colors",
-                  statusFilter === s ? "bg-stone-800 text-white border-stone-800" : "text-stone-400 border-stone-200 hover:border-stone-400"
+                  "text-micro tracking-widest uppercase px-3 py-1.5 border transition-colors",
+                  statusFilter === s ? "bg-stone-800 text-white border-stone-800" : "text-stone-600 border-stone-200 hover:border-stone-400"
                 )}
               >
                 {s === 'all' ? 'All' : s}
               </button>
             ))}
@@ -157,71 +157,71 @@ export default function AdminOrders() {
         </div>
 
         {isLoading ? (
           <div className="p-12 text-center">
             <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
-            <p className="text-[10px] tracking-widest text-stone-400 uppercase">Loading orders...</p>
+            <p className="text-micro tracking-widest text-stone-600 uppercase">Loading orders...</p>
           </div>
         ) : error ? (
           <div className="p-12 text-center">
             <p className="text-rose-500 text-xs tracking-widest uppercase mb-4">{error}</p>
             <button onClick={loadOrders} className="btn-luxury-outline text-xs">Retry</button>
           </div>
         ) : filteredOrders.length === 0 ? (
           <div className="p-12 text-center">
             <ShoppingCart className="w-10 h-10 text-stone-200 mx-auto mb-4" />
-            <p className="text-[10px] tracking-widest text-stone-400 uppercase">No orders found</p>
+            <p className="text-micro tracking-widest text-stone-600 uppercase">No orders found</p>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-stone-50/50 border-b border-stone-100">
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Order ID</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Date</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Customer</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Type</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Status</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Total</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Payment</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Actions</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Order ID</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Date</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Customer</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Type</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Status</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Total</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Payment</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-stone-100">
                 {filteredOrders.map(order => {
                   const StatusIcon = STATUS_ICONS[order.status] || Clock;
                   return (
                     <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                       <td className="px-6 py-4">
-                        <code className="text-[9px] text-stone-400 font-mono">{order.id?.slice(0, 8)}...</code>
+                        <code className="text-micro text-stone-600 font-mono">{order.id?.slice(0, 8)}...</code>
                       </td>
                       <td className="px-6 py-4">
-                        <span className="text-[10px] text-stone-600">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</span>
+                        <span className="text-micro text-stone-600">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</span>
                       </td>
                       <td className="px-6 py-4">
-                        <p className="text-[11px] font-bold text-stone-800">{order.customer_name || 'Unknown'}</p>
-                        <p className="text-[8px] text-stone-400">{order.customer_email}</p>
+                        <p className="text-micro font-bold text-stone-800">{order.customer_name || 'Unknown'}</p>
+                        <p className="text-micro text-stone-600">{order.customer_email}</p>
                       </td>
                       <td className="px-6 py-4">
-                        <span className="text-[9px] tracking-widest uppercase text-stone-500">{order.type}</span>
+                        <span className="text-micro tracking-widest uppercase text-stone-600">{order.type}</span>
                       </td>
                       <td className="px-6 py-4">
-                        <span className={cn("text-[9px] tracking-widest uppercase font-bold px-2 py-1 border flex items-center gap-1.5 w-fit", STATUS_COLORS[order.status])}>
+                        <span className={cn("text-micro tracking-widest uppercase font-bold px-2 py-1 border flex items-center gap-1.5 w-fit", STATUS_COLORS[order.status])}>
                           <StatusIcon className="w-2.5 h-2.5" />
                           {order.status}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <span className="text-xs font-bold text-stone-800">{formatPrice(order.subtotal)}</span>
                       </td>
                       <td className="px-6 py-4">
                         <span className={cn(
-                          "text-[8px] tracking-widest uppercase font-bold px-2 py-1 border flex items-center gap-1 w-fit",
+                          "text-micro tracking-widest uppercase font-bold px-2 py-1 border flex items-center gap-1 w-fit",
                           order.payment_status === 'paid' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' :
                           order.payment_status === 'processing' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                           order.payment_status === 'failed' ? 'text-rose-600 border-rose-200 bg-rose-50' :
-                          'text-stone-400 border-stone-200 bg-stone-50'
+                          'text-stone-600 border-stone-200 bg-stone-50'
                         )}>
                           {order.payment_method === 'card' ? <CreditCard className="w-2 h-2" /> : <Building2 className="w-2 h-2" />}
                           {order.payment_status || 'ΓÇö'}
                         </span>
                       </td>
@@ -266,58 +266,58 @@ export default function AdminOrders() {
               aria-modal="true"
             >
               <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 sticky top-0 z-10">
                 <div className="flex items-center gap-4">
                   <h3 className="font-heading text-xl text-stone-800 tracking-wide uppercase">Order Details</h3>
-                  <code className="text-[9px] text-stone-400 font-mono bg-stone-100 px-2 py-1">{selectedOrder.id}</code>
+                  <code className="text-micro text-stone-600 font-mono bg-stone-100 px-2 py-1">{selectedOrder.id}</code>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} aria-label="Close" className="text-stone-400 hover:text-stone-800 transition-colors">
                   <X className="w-5 h-5" />
                 </button>
               </div>
 
               <div className="p-8 space-y-8">
                 {/* Customer Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Customer</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Customer</h4>
                     <div className="space-y-2 text-xs">
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Name</span><span className="font-bold text-stone-800">{selectedOrder.customer_name || '-'}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Email</span><span className="text-stone-600">{selectedOrder.customer_email || '-'}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Phone</span><span className="text-stone-600">{selectedOrder.customer_phone || '-'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Name</span><span className="font-bold text-stone-800">{selectedOrder.customer_name || '-'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Email</span><span className="text-stone-600">{selectedOrder.customer_email || '-'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Phone</span><span className="text-stone-600">{selectedOrder.customer_phone || '-'}</span></p>
                     </div>
                   </div>
                   <div className="space-y-4">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Order Info</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Order Info</h4>
                     <div className="space-y-2 text-xs">
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Date</span><span className="text-stone-800 font-bold">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '-'}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Type</span><span className="text-[10px] tracking-widest uppercase text-stone-600 font-medium">{selectedOrder.type}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Payment Method</span><span className="text-[10px] tracking-widest uppercase text-stone-600 font-medium flex items-center gap-1.5">{selectedOrder.payment_method === 'card' ? <><CreditCard className="w-3 h-3" /> Card</> : <><Building2 className="w-3 h-3" /> Atelier</>}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Payment Status</span><span className={cn("text-[9px] tracking-widest uppercase font-bold", selectedOrder.payment_status === 'paid' ? 'text-emerald-600' : selectedOrder.payment_status === 'failed' ? 'text-rose-600' : 'text-stone-600')}>{selectedOrder.payment_status || 'pending'}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Total</span><span className="text-gold font-heading font-bold">{formatPrice(selectedOrder.subtotal)}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Date</span><span className="text-stone-800 font-bold">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '-'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Type</span><span className="text-micro tracking-widest uppercase text-stone-600 font-medium">{selectedOrder.type}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Payment Method</span><span className="text-micro tracking-widest uppercase text-stone-600 font-medium flex items-center gap-1.5">{selectedOrder.payment_method === 'card' ? <><CreditCard className="w-3 h-3" /> Card</> : <><Building2 className="w-3 h-3" /> Atelier</>}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Payment Status</span><span className={cn("text-micro tracking-widest uppercase font-bold", selectedOrder.payment_status === 'paid' ? 'text-emerald-600' : selectedOrder.payment_status === 'failed' ? 'text-rose-600' : 'text-stone-600')}>{selectedOrder.payment_status || 'pending'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Total</span><span className="text-gold font-heading font-bold">{formatPrice(selectedOrder.subtotal)}</span></p>
                     </div>
                   </div>
                 </div>
 
                 {/* Status & Notes */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Status</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Status</h4>
                     <div className="flex flex-wrap gap-2">
                       {STATUS_OPTIONS.map(status => {
                         const Icon = STATUS_ICONS[status] || Clock;
                         const isActive = selectedOrder.status === status;
                         return (
                           <button
                             key={status}
                             onClick={() => handleStatusUpdate(selectedOrder.id!, status)}
                             disabled={updating === selectedOrder.id}
                             className={cn(
-                              "text-[9px] tracking-widest uppercase px-3 py-2 border flex items-center gap-1.5 transition-all",
+                              "text-micro tracking-widest uppercase px-3 py-2 border flex items-center gap-1.5 transition-all",
                               isActive
                                 ? "bg-stone-800 text-white border-stone-800"
-                                : "text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-600",
+                                : "text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800",
                               updating === selectedOrder.id && "opacity-50 cursor-not-allowed"
                             )}
                           >
                             <Icon className="w-2.5 h-2.5" />
                             {status}
@@ -325,19 +325,19 @@ export default function AdminOrders() {
                         );
                       })}
                     </div>
                     {selectedOrder.notes && (
                       <div className="mt-4 p-4 bg-stone-50 border border-stone-100">
-                        <p className="text-[9px] tracking-widest uppercase text-stone-400 font-bold flex items-center gap-1.5 mb-2">
+                        <p className="text-micro tracking-widest uppercase text-stone-600 font-bold flex items-center gap-1.5 mb-2">
                           <MessageSquare className="w-3 h-3" /> Customer Notes
                         </p>
                         <p className="text-xs text-stone-600 italic">{selectedOrder.notes}</p>
                       </div>
                     )}
                   </div>
                   <div className="space-y-4">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Admin Notes</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Admin Notes</h4>
                     <textarea
                       value={adminNotes}
                       onChange={e => setAdminNotes(e.target.value)}
                       rows={4}
                       className="w-full bg-stone-50 border border-stone-100 p-4 text-xs tracking-widest outline-none focus:border-gold transition-all resize-none"
@@ -353,44 +353,44 @@ export default function AdminOrders() {
                   </div>
                 </div>
 
                 {/* Items */}
                 <div className="space-y-4">
-                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Items ({selectedOrder.items?.length || 0})</h4>
+                  <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Items ({selectedOrder.items?.length || 0})</h4>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead>
                         <tr className="bg-stone-50/50 border-b border-stone-100">
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Product</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Type</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Size</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Qty</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Price</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Rental Dates</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Product</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Type</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Size</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Qty</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Price</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Rental Dates</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-stone-100">
                         {selectedOrder.items?.map((item, i) => (
                           <tr key={item.id || i} className="hover:bg-stone-50/50">
                             <td className="px-4 py-3">
-                              <p className="text-[11px] font-bold text-stone-800">{item.product_name}</p>
-                              <code className="text-[8px] text-stone-400 font-mono">{item.product_id}</code>
+                              <p className="text-micro font-bold text-stone-800">{item.product_name}</p>
+                              <code className="text-micro text-stone-600 font-mono">{item.product_id}</code>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[9px] tracking-widest uppercase text-stone-500">{item.product_type}</span>
+                              <span className="text-micro tracking-widest uppercase text-stone-600">{item.product_type}</span>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[10px] text-stone-600">{item.size || '-'}</span>
+                              <span className="text-micro text-stone-600">{item.size || '-'}</span>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[10px] text-stone-600">{item.quantity}</span>
+                              <span className="text-micro text-stone-600">{item.quantity}</span>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[10px] font-bold text-stone-800">{formatPrice(item.unit_price)}</span>
+                              <span className="text-micro font-bold text-stone-800">{formatPrice(item.unit_price)}</span>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[9px] text-stone-500">
+                              <span className="text-micro text-stone-600">
                                 {item.rental_start_date ? `${item.rental_start_date} ΓåÆ ${item.rental_end_date}` : '-'}
                               </span>
                             </td>
                           </tr>
                         ))}
diff --git a/src/pages/admin/AdminPlaceholder.tsx b/src/pages/admin/AdminPlaceholder.tsx
index 97dba82..8be6fa4 100644
--- a/src/pages/admin/AdminPlaceholder.tsx
+++ b/src/pages/admin/AdminPlaceholder.tsx
@@ -1,8 +1,8 @@
 export default function AdminPlaceholder({ title }: { title: string }) {
   return (
     <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-ivory border border-dashed border-stone-200">
-      <h2 className="font-heading text-2xl text-stone-300 tracking-widest uppercase mb-4">{title}</h2>
-      <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase italic">Management Interface Under Development</p>
+      <h2 className="font-heading text-2xl text-stone-500 tracking-widest uppercase mb-4">{title}</h2>
+      <p className="text-micro tracking-[0.3em] text-stone-600 uppercase italic">Management Interface Under Development</p>
     </div>
   );
 }
diff --git a/src/pages/admin/AdminProducts.tsx b/src/pages/admin/AdminProducts.tsx
index 5527b61..c9408c2 100644
--- a/src/pages/admin/AdminProducts.tsx
+++ b/src/pages/admin/AdminProducts.tsx
@@ -70,11 +70,11 @@ export default function AdminProducts() {
   return (
     <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ivory p-8 border border-stone-200">
         <div>
           <h2 className="font-heading text-2xl text-stone-800 tracking-wide uppercase">Collection Inventory</h2>
-          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mt-1">Manage physical & digital assets</p>
+          <p className="text-micro tracking-[0.3em] text-stone-600 uppercase mt-1">Manage physical & digital assets</p>
         </div>
         <button 
           onClick={() => {
             setEditingProduct(null);
             setProductImages([]);
@@ -102,16 +102,16 @@ export default function AdminProducts() {
 
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-stone-50/50 border-b border-stone-100">
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Image</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Design Details</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Category</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Tags</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Sale/Rent</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Management</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Image</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Design Details</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Category</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Tags</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Sale/Rent</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Management</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-stone-100">
               {filteredProducts.map((p) => (
                 <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
@@ -120,28 +120,28 @@ export default function AdminProducts() {
                       <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                     </div>
                   </td>
                   <td className="px-8 py-4">
                     <p className="text-xs font-bold text-stone-800 uppercase tracking-widest">{p.name}</p>
-                    <p className="text-[9px] text-stone-400 mt-1 italic">{p.fabric}</p>
+                    <p className="text-micro text-stone-600 mt-1 italic">{p.fabric}</p>
                   </td>
                   <td className="px-8 py-4">
-                    <span className="text-[10px] tracking-widest uppercase text-stone-500 font-medium">{p.category}</span>
+                    <span className="text-micro tracking-widest uppercase text-stone-600 font-medium">{p.category}</span>
                   </td>
                   <td className="px-8 py-4">
                     <div className="flex flex-wrap gap-1">
                       {p.tags?.map(tag => (
-                        <span key={tag} className="text-[8px] bg-stone-100 text-stone-500 px-1.5 py-0.5 tracking-tighter uppercase">
+                        <span key={tag} className="text-micro bg-stone-100 text-stone-600 px-1.5 py-0.5 tracking-tighter uppercase">
                           {tag}
                         </span>
-                      )) || <span className="text-[8px] text-stone-300 italic">No tags</span>}
+                      )) || <span className="text-micro text-stone-500 italic">No tags</span>}
                     </div>
                   </td>
                   <td className="px-8 py-4">
                     <div className="space-y-1">
-                      {p.salePrice && <p className="text-[10px] font-bold text-stone-800">{formatPrice(p.salePrice)}</p>}
-                      {p.rentalPrice && <p className="text-[10px] text-gold uppercase tracking-widest">Rent: {formatPrice(p.rentalPrice)}</p>}
+                      {p.salePrice && <p className="text-micro font-bold text-stone-800">{formatPrice(p.salePrice)}</p>}
+                      {p.rentalPrice && <p className="text-micro text-gold uppercase tracking-widest">Rent: {formatPrice(p.rentalPrice)}</p>}
                     </div>
                   </td>
                   <td className="px-8 py-4">
                     <div className="flex gap-2">
                       <button 
@@ -201,25 +201,25 @@ export default function AdminProducts() {
 
               <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Basic Info */}
                   <div className="space-y-6">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Artistry Details</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Artistry Details</h4>
                     <InputField label="Piece Name" name="name" defaultValue={editingProduct?.name} required />
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Description</label>
+                      <label className="text-micro uppercase tracking-widest text-stone-600 font-bold">Description</label>
                       <textarea 
                         name="description" 
                         defaultValue={editingProduct?.description}
                         required
-                        className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] tracking-widest outline-none focus:border-gold transition-colors resize-none h-32"
+                        className="w-full bg-stone-50 border border-stone-100 p-4 text-micro tracking-widest outline-none focus:border-gold transition-colors resize-none h-32"
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-2">
-                        <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Category</label>
-                        <select name="category" defaultValue={editingProduct?.category || 'Bridal Gown'} required className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] tracking-widest outline-none focus:border-gold cursor-pointer">
+                        <label className="text-micro uppercase tracking-widest text-stone-600 font-bold">Category</label>
+                        <select name="category" defaultValue={editingProduct?.category || 'Bridal Gown'} required className="w-full bg-stone-50 border border-stone-100 p-4 text-micro tracking-widest outline-none focus:border-gold cursor-pointer">
                           <option value="Bridal Gown">Bridal Gown</option>
                           <option value="Evening Dress">Evening Dress</option>
                           <option value="Accessory">Accessory</option>
                           <option value="Fine Jewelry">Fine Jewelry</option>
                         </select>
@@ -228,20 +228,20 @@ export default function AdminProducts() {
                     </div>
                   </div>
 
                   {/* Pricing & Types */}
                   <div className="space-y-6">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Investment & Types</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Investment & Types</h4>
                     <div className="grid grid-cols-2 gap-4">
                       <InputField label="Sale Price (AED)" name="salePrice" type="number" defaultValue={editingProduct?.salePrice} />
                       <InputField label="Rental Price (AED)" name="rentalPrice" type="number" defaultValue={editingProduct?.rentalPrice} />
                     </div>
                     <InputField label="Refundable Deposit (AED)" name="securityDeposit" type="number" defaultValue={editingProduct?.securityDeposit} />
                     
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Service Type</label>
-                      <select name="productType" defaultValue={editingProduct?.productType || 'both'} className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] tracking-widest outline-none focus:border-gold cursor-pointer">
+                      <label className="text-micro uppercase tracking-widest text-stone-600 font-bold">Service Type</label>
+                      <select name="productType" defaultValue={editingProduct?.productType || 'both'} className="w-full bg-stone-50 border border-stone-100 p-4 text-micro tracking-widest outline-none focus:border-gold cursor-pointer">
                         <option value="both">Sale & Rental</option>
                         <option value="sale">Exclusive Sale</option>
                         <option value="rent">Boutique Rental</option>
                       </select>
                     </div>
@@ -250,27 +250,27 @@ export default function AdminProducts() {
                   </div>
                 </div>
 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
-                     <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Configuration</h4>
+                     <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Configuration</h4>
                      <InputField label="Available Sizes (comma separated)" name="sizes" defaultValue={editingProduct?.sizes.join(', ') || 'XS, S, M, L, XL'} />
                      <InputField label="Style Tags (comma separated)" name="style" defaultValue={editingProduct?.style.join(', ') || 'Modern, Luxury'} />
                      <InputField label="Product Tags (comma separated)" name="tags" defaultValue={editingProduct?.tags?.join(', ') || ''} placeholder="e.g. Vintage, Hand-stitched, Cathedral" />
                   </div>
                   <div className="space-y-6">
-                     <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Flags</h4>
+                     <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Flags</h4>
                      <div className="flex items-center gap-8 pt-4">
                         <Checkbox label="Featured Design" name="isFeatured" defaultChecked={editingProduct?.isFeatured} />
                         <Checkbox label="New Arrival" name="isNew" defaultChecked={editingProduct?.isNew} />
                      </div>
                   </div>
                 </div>
 
                 {/* Images */}
                 <div className="space-y-6">
-                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Images</h4>
+                  <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Images</h4>
                   <div className="flex flex-wrap gap-3">
                     {productImages.map((url, i) => (
                       <div key={i} className="relative group w-20 h-24 bg-stone-100 border border-stone-200 overflow-hidden">
                         <img src={url} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
                         <button
@@ -281,11 +281,11 @@ export default function AdminProducts() {
                         >
                           <X className="w-3 h-3" />
                         </button>
                       </div>
                     ))}
-                    <div className="w-20 h-24 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 gap-1 cursor-pointer hover:border-gold/50 transition-colors relative" onClick={() => document.getElementById('product-image-upload')?.click()}>
+                    <div className="w-20 h-24 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-600 gap-1 cursor-pointer hover:border-gold/50 transition-colors relative" onClick={() => document.getElementById('product-image-upload')?.click()}>
                       <Plus className="w-4 h-4" />
                       <span className="text-[7px] tracking-widest uppercase">Upload</span>
                     </div>
                   </div>
                   <input
@@ -312,40 +312,40 @@ export default function AdminProducts() {
                     <input
                       type="url"
                       value={imageUrlInput}
                       onChange={e => setImageUrlInput(e.target.value)}
                       placeholder="Paste image URL..."
-                      className="flex-1 bg-stone-50 border border-stone-100 p-3 text-[10px] tracking-widest outline-none focus:border-gold transition-colors"
+                      className="flex-1 bg-stone-50 border border-stone-100 p-3 text-micro tracking-widest outline-none focus:border-gold transition-colors"
                     />
                     <button
                       type="button"
                       onClick={() => {
                         if (imageUrlInput.trim()) {
                           setProductImages(prev => [...prev, imageUrlInput.trim()]);
                           setImageUrlInput('');
                         }
                       }}
                       disabled={!imageUrlInput.trim()}
-                      className="px-4 py-3 bg-stone-800 text-white text-[10px] tracking-widest uppercase hover:bg-gold transition-colors disabled:opacity-40 flex items-center gap-2"
+                      className="px-4 py-3 bg-stone-800 text-white text-micro tracking-widest uppercase hover:bg-gold transition-colors disabled:opacity-40 flex items-center gap-2"
                     >
                       <LinkIcon className="w-3 h-3" /> Add
                     </button>
                   </div>
-                  {isUploading && <p className="text-[9px] text-stone-400 italic">Uploading image...</p>}
+                  {isUploading && <p className="text-micro text-stone-600 italic">Uploading image...</p>}
                 </div>
 
                 <div className="p-8 bg-onyx border-t border-stone-100 flex justify-end gap-4 -mx-8 -mb-8 mt-12">
                    <button 
                     type="button" 
                     onClick={() => setIsFormOpen(false)}
-                    className="px-8 py-3 text-[10px] tracking-widest uppercase text-stone-400 hover:text-white transition-colors"
+                    className="px-8 py-3 text-micro tracking-widest uppercase text-stone-400 hover:text-white transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
-                    className="bg-gold text-white px-10 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-gold-dark transition-all flex items-center gap-2"
+                    className="bg-gold text-white px-10 py-3 text-micro tracking-[0.2em] font-bold uppercase hover:bg-gold-dark transition-all flex items-center gap-2"
                   >
                     {isUploading ? (
                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <Save className="w-4 h-4" />
@@ -371,18 +371,18 @@ interface InputFieldProps {
 }
 
 function InputField({ label, name, type = "text", defaultValue, required, placeholder }: InputFieldProps) {
   return (
     <div className="flex flex-col gap-2">
-      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{label}</label>
+      <label className="text-micro uppercase tracking-widest text-stone-600 font-bold">{label}</label>
       <input 
         type={type}
         name={name}
         defaultValue={defaultValue}
         required={required}
         placeholder={placeholder}
-        className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] tracking-widest outline-none focus:border-gold transition-colors"
+        className="w-full bg-stone-50 border border-stone-100 p-4 text-micro tracking-widest outline-none focus:border-gold transition-colors"
       />
     </div>
   );
 }
 
@@ -403,9 +403,9 @@ function Checkbox({ label, name, defaultChecked }: CheckboxProps) {
           className="peer sr-only"
         />
         <div className="w-5 h-5 border border-stone-300 bg-white group-hover:border-gold transition-all peer-checked:bg-gold peer-checked:border-gold" />
         <Plus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
       </div>
-      <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{label}</span>
+      <span className="text-micro uppercase tracking-widest text-stone-600 font-bold">{label}</span>
     </label>
   );
 }
diff --git a/src/pages/admin/AdminSettings.tsx b/src/pages/admin/AdminSettings.tsx
index ad0576c..a8a749b 100644
--- a/src/pages/admin/AdminSettings.tsx
+++ b/src/pages/admin/AdminSettings.tsx
@@ -1 +1 @@
-import { useState, useEffect } from 'react';import { useToast } from '../../contexts/ToastContext';import { Download, Upload, CheckCircle2, AlertTriangle, Eye, Smartphone, Mail, Globe, Camera, Search, Palette, Code, Shield, ShoppingBag, Gem, RefreshCw, PenTool, Layout as LayoutIcon, Home, BookOpen, Truck, FileText } from 'lucide-react';import { isSupabaseConfigured } from '../../services/supabase';import { useData } from '../../contexts/DataContext';import { useSettings } from '../../contexts/SettingsContext';import { cn } from '../../lib/utils';import { motion } from 'motion/react';export default function AdminSettings() {  const { updateContent } = useData();  const { settings, updateSetting } = useSettings();  const [saved, setSaved] = useState(false);  const [tab, setTab] = useState<'brand' | 'homepage' | 'policies' | 'features' | 'advanced'>('brand');  const [importData, setImportData] = useState('');  const { addToast } = useToast();  useEffect(() => { if (saved) { const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t); } }, [saved]);  const update = async <K extends keyof typeof settings>(section: K, key: string, value: any) => {    await updateSetting(section, key, value);    setSaved(true);  };  const syncToDataContext = async () => {    await updateContent({      hero: { title: settings.homepage.heroTitle, subtitle: settings.homepage.heroSubtitle, cta: settings.homepage.heroCta, bgImage: settings.homepage.heroBgImage },      about: { title: settings.homepage.aboutTitle, description: settings.homepage.aboutDescription },      quote: settings.homepage.brandQuote,    });  };  const handleExport = () => {    const data = JSON.stringify({ settings }, null, 2);    const blob = new Blob([data], { type: 'application/json' });    const url = URL.createObjectURL(blob);    const a = document.createElement('a'); a.href = url; a.download = 'riman-settings-backup.json'; a.click();    URL.revokeObjectURL(url);  };  const handleImport = () => {    try {      const data = JSON.parse(importData);      if (data.settings) {        Object.entries(data.settings).forEach(([section, values]) => {          if (typeof values === 'object' && values !== null) {            Object.entries(values as Record<string, any>).forEach(([key, value]) => {              updateSetting(section as any, key, value);            });          }        });      }      setSaved(true); setImportData('');      addToast({ type: 'success', title: 'Import Complete', message: 'Settings imported successfully.' });    } catch { addToast({ type: 'error', title: 'Import Failed', message: 'Invalid JSON format.' }); }  };  const handleReset = async () => {    const defaults = {      branding: { siteName: 'Atelier Riman', tagline: "Sharjah's Most Majestic Couture", logoText: 'Riman' },      contact: { email: 'hello@rimanfashion.com', phone: '+971 50 123 4567', address: 'Al Zahra St, Sharjah, UAE', hours: 'SatΓÇôThu, 10am ΓÇô 8pm' },      social: { instagram: '@rimanfashion', whatsapp: '+971501234567', facebook: 'rimanfashion', twitter: 'rimanfashion', youtube: 'rimanfashion', tiktok: '@rimanfashion', pinterest: 'rimanfashion' },      homepage: { heroTitle: 'Reverie & Essence', heroSubtitle: "Sharjah's Most Majestic Couture", heroCta: 'Request A Private Viewing', heroBgImage: '/images/hero-default.jpg', aboutTitle: 'The Riman Legacy', aboutDescription: 'Founded in the vibrant cultural landscape of Sharjah.', brandQuote: 'In the heart of Sharjah, we weave dreams into silk.', featuredTitle: 'Featured Designs' },      features: { newsletter: true, whatsappBtn: true, preloader: true, instagramFeed: true, cookieBanner: true, scrollReveal: true, threeDViewer: true },      policies: { rentalPeriodDays: 7, depositAmount: 5000, insuranceText: '7-day hire period includes eco-friendly dry cleaning.', lateReturnFee: 'AED 500 per day', shippingInfo: 'Complimentary delivery within UAE and GCC.', returnPolicy: 'All sales are final.' },      advanced: { metaDescription: "Atelier Riman ΓÇö Sharjah's premier bridal and evening couture.", ogImageUrl: '', keywords: 'bridal gowns, evening dresses, couture, Sharjah, UAE', gaId: '', plausibleDomain: '', fathomSiteId: '', maintenanceMode: false, maintenanceMessage: 'Our atelier is currently being curated.', customHeadCode: '' },    };    for (const [section, values] of Object.entries(defaults)) {      for (const [key, value] of Object.entries(values as Record<string, any>)) {        await updateSetting(section as any, key, value);      }    }    setSaved(true);    addToast({ type: 'info', title: 'Settings Reset', message: 'Restored to factory defaults.' });  };  const inputCls = "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs tracking-widest outline-none focus:border-gold transition-colors";  const labelCls = "text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1.5";  const textareaCls = "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-gold transition-colors resize-none";  const tabs = [    { id: 'brand' as const, label: 'Branding', icon: <Palette className="w-4 h-4" /> },    { id: 'homepage' as const, label: 'Homepage', icon: <Home className="w-4 h-4" /> },    { id: 'policies' as const, label: 'Policies', icon: <Shield className="w-4 h-4" /> },    { id: 'features' as const, label: 'Features', icon: <LayoutIcon className="w-4 h-4" /> },    { id: 'advanced' as const, label: 'Advanced', icon: <Code className="w-4 h-4" /> },  ];  return (    <div className="space-y-8 max-w-5xl">      <div className="flex items-center justify-between flex-wrap gap-4">        <div>          <h1 className="font-heading text-2xl text-stone-800 tracking-wider uppercase">Control Panel</h1>          <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 italic">Manage every aspect of the Riman boutique experience</p>        </div>        <div className="flex items-center gap-4">          {saved && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-600 text-[10px] tracking-widest uppercase font-bold"><CheckCircle2 className="w-4 h-4" /> Saved</motion.div>}          <button onClick={syncToDataContext} className="btn-luxury text-[10px] !py-3 !px-6 flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Publish to Site</button>        </div>      </div>      {/* Tabs */}      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto no-scrollbar">        {tabs.map(t => (          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 px-5 py-3 text-[10px] tracking-[0.2em] uppercase font-bold transition-colors border-b-2 -mb-px shrink-0", tab === t.id ? "border-gold text-gold" : "border-transparent text-stone-400 hover:text-stone-600")}>            {t.icon} {t.label}          </button>        ))}      </div>      {/* Branding */}      {tab === 'brand' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><PenTool className="w-4 h-4 text-gold" /> Brand Identity</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Site Name</label><input className={inputCls} value={settings.branding.siteName} onChange={e => update('branding', 'siteName', e.target.value)} /></div>              <div><label className={labelCls}>Navigation Logo Text</label><input className={inputCls} value={settings.branding.logoText} onChange={e => update('branding', 'logoText', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Tagline</label><input className={inputCls} value={settings.branding.tagline} onChange={e => update('branding', 'tagline', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> Contact</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Email</label><input className={inputCls} value={settings.contact.email} onChange={e => update('contact', 'email', e.target.value)} /></div>              <div><label className={labelCls}>Phone</label><input className={inputCls} value={settings.contact.phone} onChange={e => update('contact', 'phone', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} value={settings.contact.address} onChange={e => update('contact', 'address', e.target.value)} /></div>              <div><label className={labelCls}>Hours</label><input className={inputCls} value={settings.contact.hours} onChange={e => update('contact', 'hours', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Globe className="w-4 h-4 text-gold" /> Social Links</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              {([                { key: 'instagram', icon: '≡ƒô╖', placeholder: '@rimanfashion' },                { key: 'facebook', icon: '≡ƒæì', placeholder: 'rimanfashion' },                { key: 'twitter', icon: '≡ƒÉª', placeholder: 'rimanfashion' },                { key: 'youtube', icon: 'Γû╢', placeholder: 'rimanfashion' },                { key: 'tiktok', icon: '≡ƒÄ╡', placeholder: '@rimanfashion' },                { key: 'pinterest', icon: '≡ƒôî', placeholder: 'rimanfashion' },                { key: 'whatsapp', icon: '≡ƒÆ¼', placeholder: '+971501234567' },              ] as const).map(s => (                <div key={s.key}><label className={labelCls}>{s.key.charAt(0).toUpperCase() + s.key.slice(1)}</label><input className={inputCls} value={(settings.social as any)[s.key]} placeholder={s.placeholder} onChange={e => update('social', s.key, e.target.value)} /></div>              ))}            </div>          </section>        </div>      )}      {/* Homepage */}      {tab === 'homepage' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Camera className="w-4 h-4 text-gold" /> Hero Section</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>Hero Title</label><input className={inputCls} value={settings.homepage.heroTitle} onChange={e => update('homepage', 'heroTitle', e.target.value)} /></div>              <div><label className={labelCls}>Subtitle</label><input className={inputCls} value={settings.homepage.heroSubtitle} onChange={e => update('homepage', 'heroSubtitle', e.target.value)} /></div>              <div><label className={labelCls}>CTA Button Text</label><input className={inputCls} value={settings.homepage.heroCta} onChange={e => update('homepage', 'heroCta', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Background Image URL</label><input className={inputCls} value={settings.homepage.heroBgImage} onChange={e => update('homepage', 'heroBgImage', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><BookOpen className="w-4 h-4 text-gold" /> About & Quote</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>About Title</label><input className={inputCls} value={settings.homepage.aboutTitle} onChange={e => update('homepage', 'aboutTitle', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>About Description</label><textarea className={textareaCls} rows={4} value={settings.homepage.aboutDescription} onChange={e => update('homepage', 'aboutDescription', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Brand Quote</label><textarea className={textareaCls} rows={3} value={settings.homepage.brandQuote} onChange={e => update('homepage', 'brandQuote', e.target.value)} /></div>              <div><label className={labelCls}>Featured Section Title</label><input className={inputCls} value={settings.homepage.featuredTitle} onChange={e => update('homepage', 'featuredTitle', e.target.value)} /></div>            </div>            <div className="mt-6 p-4 bg-gold/5 border border-gold/20">              <p className="text-[10px] text-stone-500 italic">Changes here take effect after clicking <strong>"Publish to Site"</strong>.</p>            </div>          </section>        </div>      )}      {/* Policies */}      {tab === 'policies' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-gold" /> Rental Policy</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Rental Period (days)</label><input className={inputCls} type="number" value={settings.policies.rentalPeriodDays} onChange={e => update('policies', 'rentalPeriodDays', Number(e.target.value))} /></div>              <div><label className={labelCls}>Security Deposit (AED)</label><input className={inputCls} type="number" value={settings.policies.depositAmount} onChange={e => update('policies', 'depositAmount', Number(e.target.value))} /></div>              <div className="md:col-span-2"><label className={labelCls}>Insurance & Cleaning Text</label><textarea className={textareaCls} rows={3} value={settings.policies.insuranceText} onChange={e => update('policies', 'insuranceText', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Late Return Fee</label><input className={inputCls} value={settings.policies.lateReturnFee} onChange={e => update('policies', 'lateReturnFee', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Truck className="w-4 h-4 text-gold" /> Shipping & Returns</h3>            <div className="grid grid-cols-1 gap-6">              <div><label className={labelCls}>Shipping Information</label><textarea className={textareaCls} rows={3} value={settings.policies.shippingInfo} onChange={e => update('policies', 'shippingInfo', e.target.value)} /></div>              <div><label className={labelCls}>Return Policy</label><textarea className={textareaCls} rows={3} value={settings.policies.returnPolicy} onChange={e => update('policies', 'returnPolicy', e.target.value)} /></div>            </div>          </section>        </div>      )}      {/* Features */}      {tab === 'features' && (        <section>          <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6">Site Features</h3>          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            {[              { key: 'newsletter' as const, label: 'Newsletter Popup', desc: 'Show the Atelier Circle signup popup', icon: <Mail className="w-4 h-4" /> },              { key: 'whatsappBtn' as const, label: 'WhatsApp Button', desc: 'Floating WhatsApp for inquiries', icon: <Smartphone className="w-4 h-4" /> },              { key: 'preloader' as const, label: 'Preloader', desc: 'Emblem animation on first homepage visit', icon: <Eye className="w-4 h-4" /> },              { key: 'instagramFeed' as const, label: 'Instagram Feed', desc: 'Instagram section on homepage', icon: <Camera className="w-4 h-4" /> },              { key: 'cookieBanner' as const, label: 'Cookie Consent', desc: 'GDPR cookie consent banner', icon: <FileText className="w-4 h-4" /> },              { key: 'scrollReveal' as const, label: 'Scroll Animations', desc: 'Fade-in effects as user scrolls', icon: <RefreshCw className="w-4 h-4" /> },              { key: 'threeDViewer' as const, label: '3D Product Viewer', desc: 'Interactive 3D model viewer on products', icon: <Gem className="w-4 h-4" /> },            ].map(f => (              <div key={f.key} className="flex items-center justify-between p-5 bg-ivory border border-stone-100">                <div className="flex items-center gap-3">                  <div className="w-9 h-9 bg-gold/10 text-gold flex items-center justify-center">{f.icon}</div>                  <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">{f.label}</p><p className="text-[9px] text-stone-400 italic mt-0.5">{f.desc}</p></div>                </div>                <button onClick={() => update('features', f.key, !settings.features[f.key])} className={cn("relative w-11 h-5 transition-colors duration-300 shrink-0", settings.features[f.key] ? "bg-gold" : "bg-stone-200")} aria-label={`Toggle ${f.label}`}>                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white transition-transform duration-300", settings.features[f.key] ? "translate-x-6" : "translate-x-0.5")} />                </button>              </div>            ))}          </div>        </section>      )}      {/* Advanced */}      {tab === 'advanced' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Search className="w-4 h-4 text-gold" /> SEO</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>Default Meta Description</label><textarea className={textareaCls} rows={3} value={settings.advanced.metaDescription} onChange={e => update('advanced', 'metaDescription', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>OG Image URL</label><input className={inputCls} value={settings.advanced.ogImageUrl} onChange={e => update('advanced', 'ogImageUrl', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Meta Keywords</label><input className={inputCls} value={settings.advanced.keywords} onChange={e => update('advanced', 'keywords', e.target.value)} /></div>              <div><label className={labelCls}>Google Analytics ID</label><input className={inputCls} value={settings.advanced.gaId} placeholder="G-XXXXXXXXXX" onChange={e => update('advanced', 'gaId', e.target.value)} /></div>              <div><label className={labelCls}>Plausible Domain</label><input className={inputCls} value={settings.advanced.plausibleDomain} placeholder="yourdomain.com" onChange={e => update('advanced', 'plausibleDomain', e.target.value)} /></div>              <div><label className={labelCls}>Fathom Site ID</label><input className={inputCls} value={settings.advanced.fathomSiteId} placeholder="XXXXXXXXX" onChange={e => update('advanced', 'fathomSiteId', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-gold" /> Maintenance Mode</h3>            <div className="p-6 bg-ivory border border-stone-100">              <div className="flex items-center justify-between mb-6">                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Maintenance Mode</p><p className="text-[10px] text-stone-400 italic mt-1">Show a maintenance page to visitors while you make changes</p></div>                <button onClick={() => update('advanced', 'maintenanceMode', !settings.advanced.maintenanceMode)} className={cn("relative w-11 h-5 transition-colors duration-300", settings.advanced.maintenanceMode ? "bg-rose-500" : "bg-stone-200")} aria-label="Toggle maintenance mode">                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white transition-transform duration-300", settings.advanced.maintenanceMode ? "translate-x-6" : "translate-x-0.5")} />                </button>              </div>              <label className={labelCls}>Maintenance Message</label>              <textarea className={textareaCls} rows={3} value={settings.advanced.maintenanceMessage} onChange={e => update('advanced', 'maintenanceMessage', e.target.value)} />            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Code className="w-4 h-4 text-gold" /> Custom Code</h3>            <div><label className={labelCls}>Custom &lt;head&gt; Code</label><textarea className={textareaCls + " font-mono text-[10px]"} rows={6} value={settings.advanced.customHeadCode} placeholder="<!-- Google Tag Manager, custom fonts, meta tags -->&#10;" onChange={e => update('advanced', 'customHeadCode', e.target.value)} /></div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Download className="w-4 h-4 text-gold" /> Backup & System</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <button onClick={handleExport} className="flex items-center gap-3 px-6 py-5 border border-stone-200 bg-ivory hover:border-gold/30 transition-colors text-left">                <Download className="w-5 h-5 text-gold" />                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Export Data</p><p className="text-[9px] text-stone-400">Download all settings as JSON</p></div>              </button>              <div className="border border-stone-200 bg-ivory p-5">                <div className="flex items-center gap-3 mb-3"><Upload className="w-5 h-5 text-gold" /><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Import Data</p></div>                <textarea className="w-full bg-stone-50 border border-stone-100 p-3 text-[10px] outline-none focus:border-gold font-mono resize-none h-20" placeholder="Paste exported JSON..." value={importData} onChange={e => setImportData(e.target.value)} />                {importData && <button onClick={handleImport} className="mt-3 btn-luxury text-[10px] !py-3 w-full">Import</button>}              </div>              <div className="p-6 bg-ivory border border-stone-100"><p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Supabase</p>{isSupabaseConfigured ? <span className="inline-flex items-center gap-2 text-[10px] text-emerald-600 font-bold"><div className="w-2 h-2 bg-emerald-500" /> Connected</span> : <span className="inline-flex items-center gap-2 text-[10px] text-stone-400 font-bold"><AlertTriangle className="w-3 h-3" /> Offline</span>}</div>              <button onClick={handleReset} className="flex items-center gap-3 px-6 py-5 border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-colors text-left">                <AlertTriangle className="w-5 h-5 text-rose-500" />                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Factory Reset</p><p className="text-[9px] text-stone-400">Restore all settings to defaults</p></div>              </button>            </div>          </section>        </div>      )}    </div>  );}
\ No newline at end of file
+import { useState, useEffect } from 'react';import { useToast } from '../../contexts/ToastContext';import { Download, Upload, CheckCircle2, AlertTriangle, Eye, Smartphone, Mail, Globe, Camera, Search, Palette, Code, Shield, ShoppingBag, Gem, RefreshCw, PenTool, Layout as LayoutIcon, Home, BookOpen, Truck, FileText } from 'lucide-react';import { isSupabaseConfigured } from '../../services/supabase';import { useData } from '../../contexts/DataContext';import { useSettings } from '../../contexts/SettingsContext';import { cn } from '../../lib/utils';import { motion } from 'motion/react';export default function AdminSettings() {  const { updateContent } = useData();  const { settings, updateSetting } = useSettings();  const [saved, setSaved] = useState(false);  const [tab, setTab] = useState<'brand' | 'homepage' | 'policies' | 'features' | 'advanced'>('brand');  const [importData, setImportData] = useState('');  const { addToast } = useToast();  useEffect(() => { if (saved) { const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t); } }, [saved]);  const update = async <K extends keyof typeof settings>(section: K, key: string, value: any) => {    await updateSetting(section, key, value);    setSaved(true);  };  const syncToDataContext = async () => {    await updateContent({      hero: { title: settings.homepage.heroTitle, subtitle: settings.homepage.heroSubtitle, cta: settings.homepage.heroCta, bgImage: settings.homepage.heroBgImage },      about: { title: settings.homepage.aboutTitle, description: settings.homepage.aboutDescription },      quote: settings.homepage.brandQuote,    });  };  const handleExport = () => {    const data = JSON.stringify({ settings }, null, 2);    const blob = new Blob([data], { type: 'application/json' });    const url = URL.createObjectURL(blob);    const a = document.createElement('a'); a.href = url; a.download = 'riman-settings-backup.json'; a.click();    URL.revokeObjectURL(url);  };  const handleImport = () => {    try {      const data = JSON.parse(importData);      if (data.settings) {        Object.entries(data.settings).forEach(([section, values]) => {          if (typeof values === 'object' && values !== null) {            Object.entries(values as Record<string, any>).forEach(([key, value]) => {              updateSetting(section as any, key, value);            });          }        });      }      setSaved(true); setImportData('');      addToast({ type: 'success', title: 'Import Complete', message: 'Settings imported successfully.' });    } catch { addToast({ type: 'error', title: 'Import Failed', message: 'Invalid JSON format.' }); }  };  const handleReset = async () => {    const defaults = {      branding: { siteName: 'Atelier Riman', tagline: "Sharjah's Most Majestic Couture", logoText: 'Riman' },      contact: { email: 'hello@rimanfashion.com', phone: '+971 50 123 4567', address: 'Al Zahra St, Sharjah, UAE', hours: 'SatΓÇôThu, 10am ΓÇô 8pm' },      social: { instagram: '@rimanfashion', whatsapp: '+971501234567', facebook: 'rimanfashion', twitter: 'rimanfashion', youtube: 'rimanfashion', tiktok: '@rimanfashion', pinterest: 'rimanfashion' },      homepage: { heroTitle: 'Reverie & Essence', heroSubtitle: "Sharjah's Most Majestic Couture", heroCta: 'Request A Private Viewing', heroBgImage: '/images/hero-default.jpg', aboutTitle: 'The Riman Legacy', aboutDescription: 'Founded in the vibrant cultural landscape of Sharjah.', brandQuote: 'In the heart of Sharjah, we weave dreams into silk.', featuredTitle: 'Featured Designs' },      features: { newsletter: true, whatsappBtn: true, preloader: true, instagramFeed: true, cookieBanner: true, scrollReveal: true, threeDViewer: true },      policies: { rentalPeriodDays: 7, depositAmount: 5000, insuranceText: '7-day hire period includes eco-friendly dry cleaning.', lateReturnFee: 'AED 500 per day', shippingInfo: 'Complimentary delivery within UAE and GCC.', returnPolicy: 'All sales are final.' },      advanced: { metaDescription: "Atelier Riman ΓÇö Sharjah's premier bridal and evening couture.", ogImageUrl: '', keywords: 'bridal gowns, evening dresses, couture, Sharjah, UAE', gaId: '', plausibleDomain: '', fathomSiteId: '', maintenanceMode: false, maintenanceMessage: 'Our atelier is currently being curated.', customHeadCode: '' },    };    for (const [section, values] of Object.entries(defaults)) {      for (const [key, value] of Object.entries(values as Record<string, any>)) {        await updateSetting(section as any, key, value);      }    }    setSaved(true);    addToast({ type: 'info', title: 'Settings Reset', message: 'Restored to factory defaults.' });  };  const inputCls = "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs tracking-widest outline-none focus:border-gold transition-colors";  const labelCls = "text-micro font-bold text-stone-600 uppercase tracking-widest block mb-1.5";  const textareaCls = "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-gold transition-colors resize-none";  const tabs = [    { id: 'brand' as const, label: 'Branding', icon: <Palette className="w-4 h-4" /> },    { id: 'homepage' as const, label: 'Homepage', icon: <Home className="w-4 h-4" /> },    { id: 'policies' as const, label: 'Policies', icon: <Shield className="w-4 h-4" /> },    { id: 'features' as const, label: 'Features', icon: <LayoutIcon className="w-4 h-4" /> },    { id: 'advanced' as const, label: 'Advanced', icon: <Code className="w-4 h-4" /> },  ];  return (    <div className="space-y-8 max-w-5xl">      <div className="flex items-center justify-between flex-wrap gap-4">        <div>          <h1 className="font-heading text-2xl text-stone-800 tracking-wider uppercase">Control Panel</h1>          <p className="text-micro text-stone-600 uppercase tracking-widest mt-1 italic">Manage every aspect of the Riman boutique experience</p>        </div>        <div className="flex items-center gap-4">          {saved && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-600 text-micro tracking-widest uppercase font-bold"><CheckCircle2 className="w-4 h-4" /> Saved</motion.div>}          <button onClick={syncToDataContext} className="btn-luxury text-micro !py-3 !px-6 flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Publish to Site</button>        </div>      </div>      {/* Tabs */}      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto no-scrollbar">        {tabs.map(t => (          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 px-5 py-3 text-micro tracking-[0.2em] uppercase font-bold transition-colors border-b-2 -mb-px shrink-0", tab === t.id ? "border-gold text-gold" : "border-transparent text-stone-600 hover:text-stone-800")}>            {t.icon} {t.label}          </button>        ))}      </div>      {/* Branding */}      {tab === 'brand' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><PenTool className="w-4 h-4 text-gold" /> Brand Identity</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Site Name</label><input className={inputCls} value={settings.branding.siteName} onChange={e => update('branding', 'siteName', e.target.value)} /></div>              <div><label className={labelCls}>Navigation Logo Text</label><input className={inputCls} value={settings.branding.logoText} onChange={e => update('branding', 'logoText', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Tagline</label><input className={inputCls} value={settings.branding.tagline} onChange={e => update('branding', 'tagline', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> Contact</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Email</label><input className={inputCls} value={settings.contact.email} onChange={e => update('contact', 'email', e.target.value)} /></div>              <div><label className={labelCls}>Phone</label><input className={inputCls} value={settings.contact.phone} onChange={e => update('contact', 'phone', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} value={settings.contact.address} onChange={e => update('contact', 'address', e.target.value)} /></div>              <div><label className={labelCls}>Hours</label><input className={inputCls} value={settings.contact.hours} onChange={e => update('contact', 'hours', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Globe className="w-4 h-4 text-gold" /> Social Links</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              {([                { key: 'instagram', icon: '≡ƒô╖', placeholder: '@rimanfashion' },                { key: 'facebook', icon: '≡ƒæì', placeholder: 'rimanfashion' },                { key: 'twitter', icon: '≡ƒÉª', placeholder: 'rimanfashion' },                { key: 'youtube', icon: 'Γû╢', placeholder: 'rimanfashion' },                { key: 'tiktok', icon: '≡ƒÄ╡', placeholder: '@rimanfashion' },                { key: 'pinterest', icon: '≡ƒôî', placeholder: 'rimanfashion' },                { key: 'whatsapp', icon: '≡ƒÆ¼', placeholder: '+971501234567' },              ] as const).map(s => (                <div key={s.key}><label className={labelCls}>{s.key.charAt(0).toUpperCase() + s.key.slice(1)}</label><input className={inputCls} value={(settings.social as any)[s.key]} placeholder={s.placeholder} onChange={e => update('social', s.key, e.target.value)} /></div>              ))}            </div>          </section>        </div>      )}      {/* Homepage */}      {tab === 'homepage' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Camera className="w-4 h-4 text-gold" /> Hero Section</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>Hero Title</label><input className={inputCls} value={settings.homepage.heroTitle} onChange={e => update('homepage', 'heroTitle', e.target.value)} /></div>              <div><label className={labelCls}>Subtitle</label><input className={inputCls} value={settings.homepage.heroSubtitle} onChange={e => update('homepage', 'heroSubtitle', e.target.value)} /></div>              <div><label className={labelCls}>CTA Button Text</label><input className={inputCls} value={settings.homepage.heroCta} onChange={e => update('homepage', 'heroCta', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Background Image URL</label><input className={inputCls} value={settings.homepage.heroBgImage} onChange={e => update('homepage', 'heroBgImage', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><BookOpen className="w-4 h-4 text-gold" /> About & Quote</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>About Title</label><input className={inputCls} value={settings.homepage.aboutTitle} onChange={e => update('homepage', 'aboutTitle', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>About Description</label><textarea className={textareaCls} rows={4} value={settings.homepage.aboutDescription} onChange={e => update('homepage', 'aboutDescription', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Brand Quote</label><textarea className={textareaCls} rows={3} value={settings.homepage.brandQuote} onChange={e => update('homepage', 'brandQuote', e.target.value)} /></div>              <div><label className={labelCls}>Featured Section Title</label><input className={inputCls} value={settings.homepage.featuredTitle} onChange={e => update('homepage', 'featuredTitle', e.target.value)} /></div>            </div>            <div className="mt-6 p-4 bg-gold/5 border border-gold/20">              <p className="text-micro text-stone-600 italic">Changes here take effect after clicking <strong>"Publish to Site"</strong>.</p>            </div>          </section>        </div>      )}      {/* Policies */}      {tab === 'policies' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-gold" /> Rental Policy</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Rental Period (days)</label><input className={inputCls} type="number" value={settings.policies.rentalPeriodDays} onChange={e => update('policies', 'rentalPeriodDays', Number(e.target.value))} /></div>              <div><label className={labelCls}>Security Deposit (AED)</label><input className={inputCls} type="number" value={settings.policies.depositAmount} onChange={e => update('policies', 'depositAmount', Number(e.target.value))} /></div>              <div className="md:col-span-2"><label className={labelCls}>Insurance & Cleaning Text</label><textarea className={textareaCls} rows={3} value={settings.policies.insuranceText} onChange={e => update('policies', 'insuranceText', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Late Return Fee</label><input className={inputCls} value={settings.policies.lateReturnFee} onChange={e => update('policies', 'lateReturnFee', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Truck className="w-4 h-4 text-gold" /> Shipping & Returns</h3>            <div className="grid grid-cols-1 gap-6">              <div><label className={labelCls}>Shipping Information</label><textarea className={textareaCls} rows={3} value={settings.policies.shippingInfo} onChange={e => update('policies', 'shippingInfo', e.target.value)} /></div>              <div><label className={labelCls}>Return Policy</label><textarea className={textareaCls} rows={3} value={settings.policies.returnPolicy} onChange={e => update('policies', 'returnPolicy', e.target.value)} /></div>            </div>          </section>        </div>      )}      {/* Features */}      {tab === 'features' && (        <section>          <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6">Site Features</h3>          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            {[              { key: 'newsletter' as const, label: 'Newsletter Popup', desc: 'Show the Atelier Circle signup popup', icon: <Mail className="w-4 h-4" /> },              { key: 'whatsappBtn' as const, label: 'WhatsApp Button', desc: 'Floating WhatsApp for inquiries', icon: <Smartphone className="w-4 h-4" /> },              { key: 'preloader' as const, label: 'Preloader', desc: 'Emblem animation on first homepage visit', icon: <Eye className="w-4 h-4" /> },              { key: 'instagramFeed' as const, label: 'Instagram Feed', desc: 'Instagram section on homepage', icon: <Camera className="w-4 h-4" /> },              { key: 'cookieBanner' as const, label: 'Cookie Consent', desc: 'GDPR cookie consent banner', icon: <FileText className="w-4 h-4" /> },              { key: 'scrollReveal' as const, label: 'Scroll Animations', desc: 'Fade-in effects as user scrolls', icon: <RefreshCw className="w-4 h-4" /> },              { key: 'threeDViewer' as const, label: '3D Product Viewer', desc: 'Interactive 3D model viewer on products', icon: <Gem className="w-4 h-4" /> },            ].map(f => (              <div key={f.key} className="flex items-center justify-between p-5 bg-ivory border border-stone-100">                <div className="flex items-center gap-3">                  <div className="w-9 h-9 bg-gold/10 text-gold flex items-center justify-center">{f.icon}</div>                  <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">{f.label}</p><p className="text-micro text-stone-600 italic mt-0.5">{f.desc}</p></div>                </div>                <button onClick={() => update('features', f.key, !settings.features[f.key])} className={cn("relative w-11 h-5 transition-colors duration-300 shrink-0", settings.features[f.key] ? "bg-gold" : "bg-stone-200")} aria-label={`Toggle ${f.label}`}>                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white transition-transform duration-300", settings.features[f.key] ? "translate-x-6" : "translate-x-0.5")} />                </button>              </div>            ))}          </div>        </section>      )}      {/* Advanced */}      {tab === 'advanced' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Search className="w-4 h-4 text-gold" /> SEO</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>Default Meta Description</label><textarea className={textareaCls} rows={3} value={settings.advanced.metaDescription} onChange={e => update('advanced', 'metaDescription', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>OG Image URL</label><input className={inputCls} value={settings.advanced.ogImageUrl} onChange={e => update('advanced', 'ogImageUrl', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Meta Keywords</label><input className={inputCls} value={settings.advanced.keywords} onChange={e => update('advanced', 'keywords', e.target.value)} /></div>              <div><label className={labelCls}>Google Analytics ID</label><input className={inputCls} value={settings.advanced.gaId} placeholder="G-XXXXXXXXXX" onChange={e => update('advanced', 'gaId', e.target.value)} /></div>              <div><label className={labelCls}>Plausible Domain</label><input className={inputCls} value={settings.advanced.plausibleDomain} placeholder="yourdomain.com" onChange={e => update('advanced', 'plausibleDomain', e.target.value)} /></div>              <div><label className={labelCls}>Fathom Site ID</label><input className={inputCls} value={settings.advanced.fathomSiteId} placeholder="XXXXXXXXX" onChange={e => update('advanced', 'fathomSiteId', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-gold" /> Maintenance Mode</h3>            <div className="p-6 bg-ivory border border-stone-100">              <div className="flex items-center justify-between mb-6">                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Maintenance Mode</p><p className="text-micro text-stone-600 italic mt-1">Show a maintenance page to visitors while you make changes</p></div>                <button onClick={() => update('advanced', 'maintenanceMode', !settings.advanced.maintenanceMode)} className={cn("relative w-11 h-5 transition-colors duration-300", settings.advanced.maintenanceMode ? "bg-rose-500" : "bg-stone-200")} aria-label="Toggle maintenance mode">                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white transition-transform duration-300", settings.advanced.maintenanceMode ? "translate-x-6" : "translate-x-0.5")} />                </button>              </div>              <label className={labelCls}>Maintenance Message</label>              <textarea className={textareaCls} rows={3} value={settings.advanced.maintenanceMessage} onChange={e => update('advanced', 'maintenanceMessage', e.target.value)} />            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Code className="w-4 h-4 text-gold" /> Custom Code</h3>            <div><label className={labelCls}>Custom &lt;head&gt; Code</label><textarea className={textareaCls + " font-mono text-micro"} rows={6} value={settings.advanced.customHeadCode} placeholder="<!-- Google Tag Manager, custom fonts, meta tags -->&#10;" onChange={e => update('advanced', 'customHeadCode', e.target.value)} /></div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Download className="w-4 h-4 text-gold" /> Backup & System</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <button onClick={handleExport} className="flex items-center gap-3 px-6 py-5 border border-stone-200 bg-ivory hover:border-gold/30 transition-colors text-left">                <Download className="w-5 h-5 text-gold" />                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Export Data</p><p className="text-micro text-stone-600">Download all settings as JSON</p></div>              </button>              <div className="border border-stone-200 bg-ivory p-5">                <div className="flex items-center gap-3 mb-3"><Upload className="w-5 h-5 text-gold" /><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Import Data</p></div>                <textarea className="w-full bg-stone-50 border border-stone-100 p-3 text-micro outline-none focus:border-gold font-mono resize-none h-20" placeholder="Paste exported JSON..." value={importData} onChange={e => setImportData(e.target.value)} />                {importData && <button onClick={handleImport} className="mt-3 btn-luxury text-micro !py-3 w-full">Import</button>}              </div>              <div className="p-6 bg-ivory border border-stone-100"><p className="text-micro font-bold text-stone-600 uppercase tracking-widest mb-2">Supabase</p>{isSupabaseConfigured ? <span className="inline-flex items-center gap-2 text-micro text-emerald-600 font-bold"><div className="w-2 h-2 bg-emerald-500" /> Connected</span> : <span className="inline-flex items-center gap-2 text-micro text-stone-600 font-bold"><AlertTriangle className="w-3 h-3" /> Offline</span>}</div>              <button onClick={handleReset} className="flex items-center gap-3 px-6 py-5 border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-colors text-left">                <AlertTriangle className="w-5 h-5 text-rose-500" />                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Factory Reset</p><p className="text-micro text-stone-600">Restore all settings to defaults</p></div>              </button>            </div>          </section>        </div>      )}    </div>  );}
\ No newline at end of file
diff --git a/src/services/appointments.ts b/src/services/appointments.ts
index 6ab9be1..7ea9d73 100644
--- a/src/services/appointments.ts
+++ b/src/services/appointments.ts
@@ -30,10 +30,11 @@ export async function createAppointment(appointment: Omit<Appointment, 'id' | 's
         phone: appointment.phone,
         date: appointment.date,
         time: appointment.time,
         service_type: appointment.service_type,
         notes: appointment.notes,
+        interested_gowns: appointment.interested_gowns ?? null,
         status: 'pending',
       })
       .select()
       .single();
 
diff --git a/src/types.ts b/src/types.ts
index e745470..156aa55 100644
--- a/src/types.ts
+++ b/src/types.ts
@@ -31,10 +31,17 @@ export interface Testimonial {
   authorRole: string;
   content: string;
   rating: number;
 }
 
+export interface GownRef {
+  id: string;
+  name: string;
+  size?: string;
+  intent: 'sale' | 'rent';
+}
+
 export interface Appointment {
   id?: string;
   name: string;
   email: string;
   phone: string;
@@ -42,6 +49,7 @@ export interface Appointment {
   time: string;
   service_type: string;
   notes?: string;
   status?: string;
   created_at?: string;
+  interested_gowns?: GownRef[] | null;
 }
\ No newline at end of file
diff --git a/supabase/migrations/20260823100000_appointments_interested_gowns.sql b/supabase/migrations/20260823100000_appointments_interested_gowns.sql
new file mode 100644
index 0000000..4f73b41
--- /dev/null
+++ b/supabase/migrations/20260823100000_appointments_interested_gowns.sql
@@ -0,0 +1,6 @@
+-- appointments.interested_gowns: gowns the client saved before requesting a viewing
+alter table public.appointments
+  add column if not exists interested_gowns jsonb;
+
+comment on column public.appointments.interested_gowns is
+  'Array of {id,name,size,intent} for gowns saved to the client''s selection';
diff --git a/tests/click-verification.spec.js b/tests/click-verification.spec.js
index fb7bbb4..f3b3a5c 100644
--- a/tests/click-verification.spec.js
+++ b/tests/click-verification.spec.js
@@ -64,11 +64,12 @@ test.describe('Header Icon Links', () => {
     await goHome(page);
   });
 
   const iconLinks = [
     { name: 'Search', path: '/search', ariaLabel: 'Search' },
-    { name: 'Wishlist', path: '/wishlist', ariaLabel: 'Wishlist' },
+    // Wishlist icon was rebranded to "Your Selection" ΓÇö match by href instead of aria-label.
+    { name: 'Wishlist', path: '/wishlist', ariaLabel: null },
     { name: 'Account', path: '/profile', ariaLabel: 'Account' },
     { name: 'Cart', path: '/checkout', ariaLabel: null },
   ];
 
   for (const { name, path, ariaLabel } of iconLinks) {
@@ -175,11 +176,11 @@ test.describe('Homepage Additional CTAs', () => {
   test.beforeEach(async ({ page }) => {
     await goHome(page);
   });
 
   const ctas = [
-    // NOTE: Journal (/blog), Gallery (/gallery) and View All Products (/collection/all)
+    // NOTE: Gallery (/gallery) and View All Products (/collection/all)
     // were removed from the homepage during the salon rebrand ΓÇö no longer linked from here.
     { name: 'About', path: '/about' },
   ];
 
   for (const { name, path } of ctas) {
@@ -322,11 +323,12 @@ test.describe('Product Detail Page', () => {
     await page.goto('/collection/all', { waitUntil: 'domcontentloaded' });
     const card = page.locator('a[href^="/product/"]').first();
     await expect(card).toBeVisible({ timeout: 30000 });
     await card.click();
     await waitForApp(page);
-    const addBtn = page.locator('button:has-text("Add to Collection"), button:has-text("Book Rental")').first();
+    // Bag-secondary CTA ΓÇö bilingual (site defaults to Arabic).
+    const addBtn = page.getByRole('button', { name: /book rental|add to collection|╪º╪¡╪¼╪▓ ╪º┘ä╪Ñ┘è╪¼╪º╪▒|╪ú╪╢┘ü ┘ä┘ä┘à╪¼┘à┘ê╪╣╪⌐/i }).first();
     await expect(addBtn).toBeVisible({ timeout: 15000 });
   });
 
   test('Wishlist button toggles', async ({ page }) => {
     await page.goto('/product/prod-001', { waitUntil: 'domcontentloaded' });
@@ -391,11 +393,10 @@ test.describe('Direct Route Navigation', () => {
     { path: '/about', name: 'About' },
     { path: '/contact', name: 'Contact' },
     { path: '/search', name: 'Search' },
     { path: '/wishlist', name: 'Wishlist' },
     { path: '/profile', name: 'Profile' },
-    { path: '/blog', name: 'Blog' },
     { path: '/faq', name: 'FAQ' },
     { path: '/alterations', name: 'Alterations' },
     { path: '/gallery', name: 'Gallery' },
     { path: '/style-quiz', name: 'Style Quiz' },
     { path: '/appointment', name: 'Appointment' },
diff --git a/tests/selection-to-viewing.spec.js b/tests/selection-to-viewing.spec.js
new file mode 100644
index 0000000..f15c3c7
--- /dev/null
+++ b/tests/selection-to-viewing.spec.js
@@ -0,0 +1,60 @@
+import { test, expect } from '@playwright/test';
+
+async function waitForApp(page) {
+  await page.goto('/');
+  await page.waitForSelector('#root > *', { timeout: 45000 });
+}
+
+test.describe('Booking-first conversion', () => {
+  test('PDP reserve CTA prefills appointment', async ({ page }) => {
+    await waitForApp(page);
+    await page.goto('/collection/all');
+    await page.waitForSelector('#root > *');
+    const card = page.locator('a[href^="/product/"]').first();
+    await card.click();
+    await expect(page).toHaveURL(/\/product\//);
+
+    const reserve = page.getByRole('button', { name: /reserve a private viewing|╪º╪¡╪¼╪▓┘è ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐/i }).first();
+    await expect(reserve).toBeVisible();
+    await reserve.click();
+
+    await expect(page).toHaveURL(/\/appointment/);
+    await expect(page.locator('text=/your selected pieces|┘é╪╖╪╣┘â ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐/i')).toBeVisible();
+
+    // Notes field mounts on scheduling step; details must be filled to reach it.
+    await page.fill('input[placeholder="Your full name"]', 'Test Client');
+    await page.fill('input[placeholder="your@email.com"]', 'client@example.com');
+    await page.fill('input[placeholder="+971 50 000 0000"]', '+971500000001');
+    await page.getByRole('button', { name: /continue to scheduling|┘à╪¬╪º╪¿╪╣╪⌐ ╪Ñ┘ä┘ë ╪¬╪¡╪»┘è╪» ╪º┘ä┘à┘ê╪╣╪»/i }).first().click();
+    await expect(page.locator('textarea').first()).toBeVisible();
+    await expect(page.locator('textarea, input[name="notes"]').first()).toHaveValue(/interested in:/i);
+  });
+
+  test('wishlist request CTA carries all saved gowns', async ({ page }) => {
+    await waitForApp(page);
+    await page.goto('/collection/all');
+    const cards = page.locator('a[href^="/product/"]');
+    await cards.nth(0).click();
+    const heart = page.locator('button[aria-label="Add to wishlist"]').first();
+    await expect(heart).toBeVisible({ timeout: 15000 });
+    await heart.click();
+    await page.goBack();
+    await cards.nth(1).click();
+    const heart2 = page.locator('button[aria-label="Add to wishlist"]').first();
+    await expect(heart2).toBeVisible({ timeout: 15000 });
+    await heart2.click();
+
+    await page.goto('/wishlist');
+    const req = page.getByRole('button', { name: /request private viewing|╪╖┘ä╪¿ ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐/i }).first();
+    await expect(req).toBeVisible();
+    await req.click();
+    await expect(page).toHaveURL(/\/appointment/);
+    await expect(page.locator('text=/your selected pieces|┘é╪╖╪╣┘â ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐/i')).toBeVisible();
+  });
+
+  test('first visit defaults to Arabic RTL', async ({ page }) => {
+    await page.addInitScript(() => localStorage.removeItem('riman_lang'));
+    await waitForApp(page);
+    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
+  });
+});
