### Task 1: Typography tokens

**Files:**
- Modify: `src/index.css` (`@theme` block lines 4-38; RTL overrides lines 99-104)

**Interfaces:**
- Produces: Tailwind utilities `text-micro` and `text-caption` consumed by Tasks 3-5.

- [ ] **Step 1: Add tokens to `@theme`**

In `src/index.css`, inside the `@theme { ... }` block, immediately after the `--font-jewelry` line (line 11), add:

```css
  --text-micro: 11px;
  --text-caption: 12px;
```

- [ ] **Step 2: Add RTL scale-up rules**

In the same file, immediately AFTER the existing pixel-override block (after line 104, `[dir="rtl"] .text-\[12px\] { font-size: 15px; }`), add:

```css
  [dir="rtl"] .text-micro { font-size: 14px; }
  [dir="rtl"] .text-caption { font-size: 15px; }
```

Do NOT delete the old `[dir="rtl"] .text-\[8px\]`-style overrides yet — classes still reference them until Tasks 3-5 complete. Task 5 removes them.

- [ ] **Step 3: Verify**

Run: `npm run lint`
Expected: clean.

Run: `npm run build`
Expected: build succeeds (tokens are valid Tailwind v4 theme entries).

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat(theme): add text-micro/text-caption type tokens with RTL scaling"
```

---


