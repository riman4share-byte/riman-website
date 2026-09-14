## Commits
d409a50 docs: align DESIGN.md with shipped terracotta/Fraunces identity

## Stat
 DESIGN.md | 189 ++++++++++++++++++++++++++++++--------------------------------
 1 file changed, 91 insertions(+), 98 deletions(-)

## Diff
diff --git a/DESIGN.md b/DESIGN.md
index 702c4d6..a3300dd 100644
--- a/DESIGN.md
+++ b/DESIGN.md
@@ -2,34 +2,39 @@
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
@@ -43,9 +48,9 @@ spacing:
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
@@ -66,134 +71,122 @@ components:
 
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
