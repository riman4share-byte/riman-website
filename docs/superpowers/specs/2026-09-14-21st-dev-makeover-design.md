# 21st.dev Makeover Design Spec

## Overview
This spec details the implementation of a 21st.dev-inspired makeover for the Riman Fashion website, preserving the existing Terracotta Atelier design system while incorporating 21st.dev component patterns and motion language.

## Goals
- Replace homepage and key templates with 21st.dev components
- Keep Terracotta Atelier tokens, typography, and RTL-first approach
- Use 21st.dev MCP to fetch live components where possible
- Maintain accessibility, performance, and existing functionality

## Architecture
1. **Component Library**: New `src/components/ui-21st/` directory for 21st-derived components
2. **MCP Integration**: Configure `@21st-dev/magic` MCP server with API key from environment
3. **Preview Route**: `/demo-21st` remains as staging; final changes merge to `/` and other routes
4. **Token Compliance**: All components must adhere to DESIGN.md tokens and rules

## Scope
### In Scope
- Homepage (Index.tsx) hero, chapters, call-to-action sections
- Collection and product listing pages (grid, filters, product cards)
- Product detail page (gallery, WhatsApp deep-link, size guide)
- Header and footer navigation components
- Appointment, alterations, and checkout CTA buttons
- Testimonial wall and editorial plate variants
- Search, wishlist, profile states
- Responsive breakpoints and mobile navigation
- Reduced motion and data-saver preferences

### Out of Scope
- Admin dashboard and admin pages
- Checkout flow (Stripe integration remains unchanged)
- Email templates and transactional emails
- Blog or CMS content pages

## Design Details

### Tokens & Constraints (Non-Negotiable)
- Colors: `--color-gold` (#A2492B), `--color-onyx` (#161513), `--color-bone` (#EFEAE2), `--color-champagne` (#F6F0E6), `--color-pearl` (#E8E3D9)
- Typography: Fraunces (display/heading), Newsreader (body/editorial), Archivo (label), Cairo/Amiri (Arabic)
- Spacing: Use `text-micro` (11px) as minimum, 44px touch targets
- Layout: Sharp edges (no border-radius), terracotta ≤10% screen coverage, flat-by-default elevation
- Direction: RTL-first with logical props (`start`/`end`, `flex-row-reverse`), letter-spacing zero in Arabic
- Accessibility: WCAG AA contrast, focus rings visible, reduced motion respected

### Component Specifications

#### Hero21st
- Source: 21st Magic `hero` block or hand-built equivalent
- Features: Video/poster with `prefers-reduced-motion` and `saveData` fallback, calligraphic accent, booking CTA, WhatsApp deep-link with dress code
- Tokens: Background `bg-onyx`, text `text-ivory`, accent `text-gold`, button `btn-luxury` variants
- Motion: Fade-in, scale animation on image container, reduced-motion safe

#### LookbookCarousel21st
- Source: 21st Magic `horizontal lookbook` or adapted `RimanLookbook21st`
- Features: Logical RTL, 44px targets, lazy images, snap scrolling, hover scale
- Tokens: Background `bg-ivory`, text `text-stone-600/500`, hover effects with gold accent
- Motion: Snap-x, hover scale 1.05, focus ring gold

#### EditorialPlate21st
- Source: 21st Magic `editorial plate` or current `salon/EditorialPlate`
- Features: Product image with hover scale, category label, product name, reverse layout alternating
- Tokens: Image container `bg-stone-100 border-stone-200`, text per DESIGN.md
- Motion: Group hover scale 1.05, transition-transform duration-700

#### TestimonialWall21st
- Source: 21st Magic `testimonial wall` or hand-built
- Features: Grid of testimonials, avatar optional, quote styling, attribution
- Tokens: Background alternates `bg-bone`/`bg-champagne`, text `text-stone-600`, accent `text-gold`
- Motion: Stagger fade-in on reveal

#### BookingCTA21st
- Source: 21st Magic `booking CTA` or current button patterns
- Features: Primary and outline variants, icon pairing (calendar/check, message circle)
- Tokens: `btn-luxury` (onyx/bone → gold hover), `btn-luxury-outline` (transparent/gold border → gold/onyx hover)
- Motion: Scale on press, focus ring 2px gold

#### Footer21st
- Source: 21st Magic `mega footer` or current `Footer.tsx`
- Features: Newsletter capture, social icons, quick links, terracotta accent line
- Tokens: Background `bg-onyx`, accent line `bg-gold`, text `text-stone-400/500`, hover `text-gold`
- Motion: Expanding underline on hover

## Data Flow & Error Handling
- No changes to Supabase or Stripe integrations
- Product data flows via existing `DataContext` and `useData` hook
- Language via `LanguageContext` and `useLanguage`
- Missing image fallback to poster or placeholder
- MCP fetch failures fall back to hand-built components in `ui-21st/`
- Form validation unchanged (react-hook-form + zod)

## Implementation Plan (High-Level)
1. **Setup**: Add 21st.dev MCP to opencode/IDE, verify API key in `.env`
2. **Fetch Components**: Use MCP to pull hero, lookbook, testimonial wall, booking CTA, footer blocks
3. **Build Library**: Create `src/components/ui-21st/` with token-compliant wrappers around fetched components
4. **Preview**: Wire components into `/demo-21st` route for review
5. **Migrate Pages**: Replace homepage sections, then collection/product pages, then header/footer
6. **Polish**: Address RTL, accessibility, motion preferences, test across breakpoints
7. **Test**: Run `vite build`, `tsc --noEmit`, `vitest`, Playwright smoke tests
8. **Flip**: Once approved, change root route to use new homepage, deprecate `/demo-21st` preview
9. **Cleanup**: Remove unused `salon/` and `luxury/` components after full migration

## Success Criteria
- Build succeeds with zero TypeScript errors
- Lint passes (`npm run lint` or equivalent)
- Vitest tests pass
- Playwright smoke tests load homepage, collection, product detail in LTR and RTL
- Manual audit confirms token usage matches DESIGN.md
- Performance: LCP under 2.5s on 3G simulated
- Accessibility: No WCAG AA violations on key pages
- User can book appointment and initiate WhatsApp chat from new components

## Resolved Open Questions
- **API key**: `21ST_API_KEY` in `.env` (never committed). MCP server: `npx -y @21st-dev/magic@latest` stdio.
- **Fallback**: If MCP unavailable, build `ui-21st/` components by hand from existing `demo/` and `luxury/` patterns — no 21st fetches.
- **Dress code**: WhatsApp deep-link uses the first featured product's `code` field; if absent, falls back to constant `RF-BR-2514`.