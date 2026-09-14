### Task 2: Remove Journal/blog dead-end

**Files:**
- Delete: `src/pages/BlogPage.tsx`
- Modify: `src/App.tsx` (import line 24, route line 206)
- Modify: `src/components/Header.tsx` (nav entry line 17, dropdown entry line 258)
- Modify: `src/components/Footer.tsx` (blog link line 127)
- Modify: `src/lib/seo.ts` (`'/blog'` entry lines 53-56)
- Modify: `src/contexts/LanguageContext.tsx` (orphaned keys, both dicts)
- Modify: `tests/click-verification.spec.js` (route entry line 398, comment line 181)

**Interfaces:**
- Consumes: nothing.
- Produces: BlogPage no longer exists, so Tasks 3-5 file lists exclude it.

- [ ] **Step 1: Verify key consumers before deleting anything**

Run (PowerShell):
```powershell
Get-ChildItem src -Recurse -Include *.tsx,*.ts | Select-String -Pattern "t\('blog\.|t\('journal\.|t\('nav\.blog'\)|t\('section\.journal'\)" | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
```
Expected: matches ONLY in `src\pages\BlogPage.tsx` (blog.* keys), `src\components\Header.tsx` (nav.blog key refs), `src\components\Footer.tsx` (nav.blog). If any OTHER file consumes these keys, STOP and report — do not delete keys with live consumers.

- [ ] **Step 2: Delete the page and its route**

Delete `src/pages/BlogPage.tsx`.

In `src/App.tsx` remove line 24:
```tsx
import BlogPage from './pages/BlogPage';
```
and remove the route (line 206):
```tsx
          <Route path="blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
```

- [ ] **Step 3: Remove nav entries**

In `src/components/Header.tsx` remove line 17 from `navLinks`:
```tsx
  { label: "Journal", path: "/blog", key: 'nav.blog' },
```
and remove the dropdown entry near line 258:
```tsx
                      { label: 'Blog', path: '/blog', key: 'nav.blog' },
```

In `src/components/Footer.tsx` remove line 127:
```tsx
                <FooterLink to="/blog">{t('nav.blog')}</FooterLink>
```

- [ ] **Step 4: Remove SEO entry**

In `src/lib/seo.ts` remove the `'/blog'` entry (lines 53-56):
```ts
  '/blog': {
    title: 'Journal | Atelier Riman',
    description: 'Explore the Atelier Riman journal — bridal style guides, fashion insights, and the stories behind our collections.',
  },
```

- [ ] **Step 5: Remove orphaned translation keys from BOTH dicts**

In `src/contexts/LanguageContext.tsx`, from the EN dict remove: `'nav.blog'` (line 28), the `// Journal / Atelier` comment + all ten `'journal.*'` keys (lines 51-61), all `'blog.*'` keys (search `'blog.` — includes `blog.title`, `blog.subtitle`, `blog.latest`, `blog.min_read`, `blog.read_editorial`, `blog.view_journal`, `blog.join_circle`, `blog.newsletter_desc`, `blog.email_placeholder`, `blog.subscribe`, `blog.article1_title`, `blog.article1_excerpt`, `blog.article1_category`, and the article2/article3 equivalents, ~lines 600-620), and `'section.journal'` (line 747).

From the AR dict remove the exact same key set (search each key name: `'nav.blog'`, `'journal.*'` ~lines 785-795, `'blog.*'` ~lines 1335-1350 and the article keys, `'section.journal'` line 1481).

Rule: delete a key from AR only if you deleted it from EN. Keep the two dicts' key sets identical.

- [ ] **Step 6: Update tests**

In `tests/click-verification.spec.js` remove line 398:
```js
    { path: '/blog', name: 'Blog' },
```
and update the comment at line 181 from:
```js
    // NOTE: Journal (/blog), Gallery (/gallery) and View All Products (/collection/all)
```
to (preserving whatever the rest of that comment sentence says, just dropping the Journal reference):
```js
    // NOTE: Gallery (/gallery) and View All Products (/collection/all)
```

- [ ] **Step 7: Verify**

Run: `npm run lint`
Expected: clean (no dangling imports/keys — tsc won't catch missing dict keys, so also re-run the Step 1 grep and expect ZERO matches).

- [ ] **Step 8: Commit**

```bash
git add -A src/App.tsx src/pages/BlogPage.tsx src/components/Header.tsx src/components/Footer.tsx src/lib/seo.ts src/contexts/LanguageContext.tsx tests/click-verification.spec.js
git commit -m "feat(nav): remove Journal/blog dead-end surface and orphaned keys"
```

---


