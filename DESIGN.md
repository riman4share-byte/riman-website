---
name: Riman Fashion
description: Sharjah's premier luxury bridal and evening couture design system
colors:
  gold: "#B08D57"
  gold-light: "#C9A96F"
  gold-dark: "#8A6A3C"
  gold-ink: "#7A5D34"
  terracotta: "#A2492B"
  terracotta-light: "#C45A3C"
  terracotta-dark: "#7A3520"
  onyx: "#0F0D0A"
  bone: "#EFEAE2"
  ivory: "#EFEAE2"
  champagne: "#F6F0E6"
  pearl: "#E8E3D9"
  stone-500: "#6B6250"
typography:
  display:
    fontFamily: "Prata, serif"
    fontWeight: 400
    letterSpacing: "0.01em"
    textTransform: "uppercase"
  editorial:
    fontFamily: "Newsreader, serif"
    fontWeight: 400
    fontStyle: "italic"
  body:
    fontFamily: "Newsreader, serif"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Archivo, sans-serif"
    fontSize: "11px"
    letterSpacing: "0.25em"
    textTransform: "uppercase"
  arabic:
    fontFamily: "Cairo, IBM Plex Sans Arabic, sans-serif"
    fontWeight: 500
  arabicHeading:
    fontFamily: "Amiri, serif"
    fontWeight: 700
  jewelry:
    fontFamily: "Fraunces, serif"
rounded:
  sm: "0"
  md: "0"
  lg: "0"
motion:
  easing: "cubic-bezier(0.22, 1, 0.36, 1)"
  reveal: "600-900ms"
  imageHover: "1200-1600ms"
  press: "180ms"
components:
  button-primary:
    backgroundColor: "{colors.onyx}"
    textColor: "{colors.bone}"
    padding: "20px 40px"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
  button-primary-hover:
    backgroundColor: "{colors.onyx}"
    textColor: "{colors.bone}"
    padding: "20px 40px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.terracotta-dark}"
    borderColor: "{colors.stone-400}"
    padding: "20px 40px"
    rounded: "{rounded.sm}"
  button-secondary-hover:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.terracotta-dark}"
    padding: "20px 40px"
---

# Design System: Riman Fashion

## 1. Overview

**Creative North Star: "The Couture Atelier"**

A warm, handcrafted sanctuary where heritage meets contemporary luxury. Riman Fashion's visual language is built on deep warm dark, bone ivory, and two deliberately restrained accents — a brass-gold for ornament, a terracotta for interface — like a private fitting room bathed in candlelight. Every surface feels deliberate, tactile, and intimate. The system rejects mass-produced, fast-fashion aesthetics in favor of architectural precision softened by editorial elegance.

The experience is consultative rather than transactional: booking-first, with private viewings, rentals, and WhatsApp handoff at its core. English is the default language (bridal clientele for a UAE atelier is overwhelmingly international, so a first-time visitor should not land on a mirrored page); Arabic is fully supported and switches to RTL in place. Typography carries the brand's regal voice through a serif display face with italic editorial accents. Motion is slow, weighted, and never snappy.

**Key Characteristics:**
- Warm layered depth through tonal surfaces, never harsh shadows
- Gold and terracotta as restrained accents that signal luxury without excess
- Serif typographic hierarchy with editorial italic flourishes
- Deliberately slow motion — couture timing, not tech timing
- Bilingual, with RTL mirroring and enlarged Arabic type

## 2. Colors

Canonical truth is the `@theme` block in `src/index.css`. Everything below is a
transcription of it. Two distinct accent families exist and must not be confused.

### Accent — brass gold (ornament)
- **Gold** (`--color-gold`, #B08D57): The metal of the house. Gold rule underlines, jewelry accents, ornamental rules. On light surfaces it fails AA as text — use `--color-gold-ink` (#7A5D34, 5.09:1 on ivory) instead.
- **Gold-light** (#C9A96F) / **Gold-dark** (#8A6A3C): hover and stepped companions.

### Accent — terracotta (interface)
- **Terracotta** (`--color-terracotta`, #A2492B): The functional accent — focus rings, badges, active states, the button fill.
- **Terracotta-light** (#C45A3C) and **Terracotta-dark** (#7A3520): the text-safe and hover steps.

Terracotta is the only accent step that clears 3:1 against **both** bone and onyx,
which is why focus rings and borders can use it on any surface. `terracotta-dark`
is the text step on light surfaces; it collapses to 2.18:1 inside a dark panel, so
dark containers fall back to `brass-light` (index.css carries guards for this).

### Neutral
- **Onyx** (`--color-onyx`, #0F0D0A): Primary dark surface — hero, dark sections, footer, the mobile bottom nav. Warm-black, never pure #000.
- **Bone / Ivory** (#EFEAE2): Default page background. `ivory` aliases `bone`.
- **Champagne** (#F6F0E6) and **Pearl** (#E8E3D9): Secondary light surfaces.
- **Stone scale**: a warm remap of Tailwind's stone. `stone-500` is #6B6250 (not the default cool #78716c). Informative text on light surfaces uses stone-600 or darker.

### Named Rules

**The Accent Rarity Rule.** Gold and terracotta together occupy ≤10% of any given screen. Their scarcity is their weight. Never use either as a large background fill or as body text.

**The Warm-Black Rule.** Never use pure #000 or #fff. All dark surfaces are onyx (#0F0D0A); all light surfaces are bone (#EFEAE2) or warmer.

## 3. Typography

**Display Font:** Prata (serif) — `--font-heading`
**Editorial Font:** Newsreader (serif, italic) — `--font-editorial`
**Body Font:** Newsreader (serif) — `--font-body`
**Label/UI Font:** Archivo (sans-serif) — `--font-label`
**Arabic Body:** Cairo, IBM Plex Sans Arabic — `--font-arabic`
**Arabic Headings:** Amiri — `--font-arabic-heading`
**Jewelry accent:** Fraunces — `--font-jewelry` (ornamental use only)

> Prata **must never render Arabic.** The `[dir="rtl"]` heading rules in
> index.css swap in Amiri; do not remove them.

**Character:** A dialogue between editorial warmth and architectural clarity. Prata provides the structure — uppercase, tightly tracked. Newsreader italic adds the ornament, used sparingly for heritage and poetic moments. Archivo handles labels and UI with quiet precision.

### Hierarchy
- **Display** (Prata, uppercase, 0.01em tracking): Hero headlines and major section titles. Never italic.
- **Editorial** (Newsreader italic, terracotta-dark): Accent phrases within headings. Always italic, never uppercase.
- **Body** (Newsreader 400, 1.7): Paragraphs and descriptions. Never uppercase.
- **Label / Micro** (Archivo, `text-micro` = 11px, uppercase, 0.18–0.25em tracking): Navigation, badges, metadata, form labels. 11px is the absolute floor. `text-caption` (12px) is the secondary size.
- **Arabic scaling:** RTL text renders ~25–30% larger (`text-micro` → 14px, `text-caption` → 15px, plus the rem-scale overrides). Letter-spacing is forced to 0 in RTL.

### Named Rules

**The Uppercase Rule.** Display, headline, and label text is uppercase. Editorial accents and body text are never uppercase.

**The 11px Floor Rule.** No text renders below 11px (LTR) / 14px (RTL). Use the `text-micro` and `text-caption` tokens; never arbitrary pixel values.

**The Editorial Rule.** Newsreader italic is reserved for single words or short phrases within headings. Never for body text.

## 4. Motion

Motion in this system is **weighted, not snappy.** This is deliberate and
test-guarded — do not "fix" it toward typical UI timings.

### The tokens
- **Easing:** one curve everywhere — `cubic-bezier(0.22, 1, 0.36, 1)`. It is
  authored in `src/lib/motion.ts` as `EASE_COUTURE`. Where an arbitrary Tailwind
  value is needed: `ease-[cubic-bezier(0.22,1,0.36,1)]`.
- **Reveals and fades:** 600–900ms.
- **Image hover zoom:** 1200–1600ms, scale ≤1.05. Slow is the point.
- **Press feedback:** 180ms — deliberately faster than hover, so a press reads as
  immediate response while the hover remains languid.

### The rules
- **No bounce, no float, no shimmer** as ambient decoration. (The `shimmer` and
  `float` keyframes that survive in index.css are unused.)
- **No springs on couture moments.** Springs are permitted only for
  infrastructure that is not brand surface — the mobile drawer, the custom cursor.
- **Transform and opacity only.** Nothing animates layout properties.
- **Never animate letter-spacing on a long label.** Opening the tracking reflows
  the text; on "REQUEST A PRIVATE VIEWING" that is ~24px of width change the
  moment the pointer enters, which reads as a jitter bug rather than as luxury.
  This is why `.btn-luxury` does not animate tracking while `.link-couture` does
  (its labels are one or two words).

### Reduced motion
Honoured in three layers, all required:
1. The global CSS neutraliser in index.css collapses animation/transition
   durations to `0.01ms !important`.
2. JS components call `useReducedMotion()` and render **plain static markup**
   with identical className and textContent.
3. Per-feature `@media (prefers-reduced-motion: reduce)` blocks handle effects
   that need a real resting value rather than a collapsed duration.

The app is wrapped in `<MotionConfig reducedMotion="user">`.

### Arabic
**Arabic is never letter-split.** Letter-level animation breaks Arabic joining.
`KineticHeading` detects `language === 'ar'`, non-Latin text, or >90 characters
and renders a whole-heading rise or plain text instead. Word-level reveal is
safe and is used for body copy.

## 5. Elevation

Warm layered — depth is conveyed through tonal surface stacking rather than drop shadows. Dark sections sit against light sections with no shadow border; the contrast itself provides the separation. When overlays are needed, a gentle backdrop blur is preferred over shadow.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Depth comes from tonal contrast and spacing, not from box-shadows.

## 6. Components

### Buttons
All three variants are sharp-edged (no border-radius), Archivo 11–12px uppercase
at 0.25em tracking, and share one interaction grammar: a **scaleX fill wiping in
from the inline-start edge** (mirrored to the right under RTL) plus a 180ms
press confirm.

- **Primary (`.btn-luxury`):** stone-800 hairline border and label, with a
  stone-800 fill behind the label on hover and the label inverting to ivory. A
  champagne sheen (`::after`) sweeps across on hover and focus — 60% wide,
  skewed 14°, 900ms. It rides on `::after` rather than `::before` because
  `::before` already carries the fill that the ivory hover label depends on for
  contrast; one pseudo-element cannot hold both transforms.
- **Secondary (`.btn-luxury-outline`):** transparent, stone-400 border at 60%,
  terracotta-dark text, with the same wipe in a 12% terracotta tint so the label
  keeps contrast instead of inverting.
- **Hero CTA (`.btn-couture-ghost`):** Borderless and unfilled, a gold rule
  sweeps out from the centre on hover. Used over imagery where any fill would
  read as a box.
- **Micro-link (`.link-couture`):** gold underline at resting `scaleX(0.25)`
  growing to full on hover/focus, with a 0.25em → 0.32em tracking shift.
- **Focus:** 2px terracotta outline, 4px offset on buttons, 2px elsewhere.

### Navigation (Header)
- **Style:** Fixed top, full-width. Transparent over the homepage hero at page top; on scroll it becomes a translucent ink band (`bg-onyx/95`). Away from home it is bone. Three equal columns (nav / logo / actions) keep the mark optically centred.
- **Links:** `text-micro` uppercase, wide tracking, with a hairline rule that grows on hover.
- **Mobile:** Bottom navigation bar (Home, Search, Selection, Bag, You) padded by `env(safe-area-inset-bottom)`, plus a full-height sidebar drawer with a spring slide and backdrop blur.

### Product Cards
- **Shape:** Sharp-edged image container, aspect 3:4. No border-radius.
- **Hover:** Image scales over 1600ms; action bar slides up from the bottom edge.
- **Badges:** Inline-start inset so RTL mirrors correctly.
- **Typography:** Category label (`text-micro`, stone-600), product name (Prata, stone-900), "From" pricing.

### Inputs / Fields
- **Style:** Borderless with a single bottom border in stone-300, transparent background. 400ms border-colour transition.
- **Focus:** Border transitions to gold-dark; a 2px terracotta outline supplies focus visibility.
- **Labels:** `text-micro` uppercase, stone-600, turning stone-900 on focus.
- **Mobile:** Inputs are forced to 16px on coarse pointers so iOS does not zoom on focus and leave the page cropped.

### Footer
- **Style:** Full-width onyx section with a terracotta hairline accent at the top border.
- **Links:** stone-500 text on a dark surface (AA compliant), uppercase, terracotta with an expanding underline on hover.

### Email Templates (src/lib/email.ts)
Email clients strip webfonts, so transactional email carries documented substitutions:
- **Display:** `Georgia, 'Times New Roman', serif` stands in for Prata.
- **Body:** system sans stack for deliverability.
- **Surfaces:** bone page, champagne panels, pearl borders — sharp edges.

## 7. Do's and Don'ts

### Do:
- **Do** use gold for ornament and terracotta for interface, each ≤10% of a screen.
- **Do** use onyx (#0F0D0A) for dark surfaces and bone (#EFEAE2) for light.
- **Do** use Prata uppercase for display, Newsreader italic for editorial accents.
- **Do** respect the 11px floor: `text-micro` / `text-caption` only.
- **Do** keep informative text on light surfaces at stone-600 or darker.
- **Do** keep motion slow — reveals 600–900ms, image hover 1200–1600ms.
- **Do** route every easing through `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Do** support RTL with Amiri headings, enlarged type, and zero letter-spacing.
- **Do** never letter-split Arabic text.

### Don't:
- **Don't** use an accent as a large background fill or as body text.
- **Don't** use gold (#B08D57) as text on a light surface — it fails AA; use `--color-gold-ink`.
- **Don't** use gradient text (`background-clip: text`).
- **Don't** use pure #000 or #fff, or border-radius on buttons, cards, containers.
- **Don't** apply box-shadows as default surface treatment.
- **Don't** speed up motion to "fix" it as sluggish. The sluggishness is couture.
- **Don't** animate letter-spacing on long labels.
- **Don't** add bounce, float, or ambient shimmer.
- **Don't** render text below the 11px floor.
- **Don't** create dead-end links — every navigable element resolves.