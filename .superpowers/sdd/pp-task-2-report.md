# Task 2 Report: Remove Journal/blog dead-end

**Status:** DONE
**Commit:** `c8ecb22` — feat(nav): remove Journal/blog dead-end surface and orphaned keys
**Branch:** salon-rebrand

## Step 1: Consumer grep (pre-delete safety check)

Ran the brief's PowerShell grep. Matches found ONLY in:
- `src/pages/BlogPage.tsx` (19 matches — blog.* keys)
- `src/components/Footer.tsx:127` (nav.blog)

Header.tsx did not appear in the grep because it consumes keys indirectly via `t(link.key)` on the `navLinks` array and the mobile dropdown array — both entries located by content search and removed. No unexpected consumers. Safe to proceed.

## Changes

| File | Change |
|---|---|
| `src/pages/BlogPage.tsx` | Deleted |
| `src/App.tsx` | Removed import (line 24) and `<Route path="blog">` (line 206) |
| `src/components/Header.tsx` | Removed `navLinks` entry (line 17) and mobile dropdown entry (line 258) |
| `src/components/Footer.tsx` | Removed `<FooterLink to="/blog">` (line 127) |
| `src/lib/seo.ts` | Removed `'/blog'` entry (lines 53-57; included an `ogType: 'article'` line not shown in the brief — removed as part of the entry) |
| `src/contexts/LanguageContext.tsx` | Removed from BOTH dicts: `nav.blog`, `// Journal / Atelier` comment + 10 `journal.*` keys, `// Blog` comment + 19 `blog.*` keys, `// Misc` comment + `section.journal` (32 keys per dict, 64 total) |
| `tests/click-verification.spec.js` | Removed `{ path: '/blog', name: 'Blog' }` route entry (line 398); updated comment (line 181) to drop Journal reference |

All brief line numbers matched actual file content exactly.

## Key removal detail (both dicts, identical set)

- `nav.blog`
- `journal.title`, `journal.finding`, `journal.guide`, `journal.btn`, `journal.heading`, `journal.quote`, `journal.fabric_title`, `journal.fabric_desc`, `journal.artisan_title`, `journal.artisan_desc`
- `blog.title`, `blog.subtitle`, `blog.latest`, `blog.min_read`, `blog.read_editorial`, `blog.view_journal`, `blog.join_circle`, `blog.newsletter_desc`, `blog.email_placeholder`, `blog.subscribe`, `blog.article1_title`, `blog.article1_excerpt`, `blog.article1_category`, `blog.article2_title`, `blog.article2_excerpt`, `blog.article2_category`, `blog.article3_title`, `blog.article3_excerpt`, `blog.article3_category`
- `section.journal`

## Verification

1. `npm run lint` (tsc --noEmit): **clean, no errors**
2. Re-ran Step 1 consumer grep: **zero matches**
3. Grep for `'nav.blog'|'journal.|'blog.|'section.journal'` in LanguageContext.tsx: **zero matches**
4. Grep for `BlogPage|/blog` across src/ and tests/: **zero matches** (no dangling imports, routes, links, or test entries)
5. Dict symmetry check: EN 617 keys, AR 617 keys, `Compare-Object` → **identical key sets**

## Self-review

- No dangling imports (BlogPage import removed; no other file imported it)
- Both dicts symmetric (verified programmatically)
- Test route entry and comment updated
- Commit staged only the 7 listed files; `.superpowers/sdd/*` scratch files left unstaged

## Concerns

None.
