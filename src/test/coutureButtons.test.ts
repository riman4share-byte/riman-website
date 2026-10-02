import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * Guards the couture button interaction.
 *
 * These are CSS-only rules read by 53 call sites, so nothing in the type
 * checker or the component tests would notice if one were dropped or quietly
 * regressed into a plain colour swap.
 */
const css = readFileSync('src/index.css', 'utf8');

/**
 * Strip comments first. The prose above the button block names `.link-couture`
 * and friends while explaining what they are *not* used for, so a naive
 * indexOf() would happily match a selector that only exists in a comment.
 */
const code = css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Grab a rule block including its selector list, without a full CSS parser. */
function block(selector: string): string {
  const start = code.indexOf(selector);
  if (start === -1) throw new Error(`selector not found: ${selector}`);
  const open = code.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') {
      depth--;
      if (depth === 0) return code.slice(start, i + 1);
    }
  }
  throw new Error(`unterminated block: ${selector}`);
}

describe('couture buttons', () => {
  it('wipes a fill in from the inline-start edge rather than swapping colour', () => {
    for (const cls of ['.btn-luxury', '.btn-luxury-outline']) {
      const fill = block(`${cls}::before`);
      expect(fill).toMatch(/transform:\s*scaleX\(0\)/);
      expect(fill).toMatch(/transform-origin:\s*left center/);

      const hover = block(`${cls}:hover::before`);
      expect(hover).toMatch(/transform:\s*scaleX\(1\)/);
    }
  });

  it('mirrors the wipe direction under RTL', () => {
    for (const cls of ['.btn-luxury', '.btn-luxury-outline']) {
      const rtl = block(`[dir='rtl'] ${cls}::before`);
      expect(rtl).toMatch(/transform-origin:\s*right center/);
    }
  });

  it('isolates the button so the fill can sit behind a bare text label', () => {
    // Most CTA labels are a bare text node with no element to stack, so the
    // fill relies on z-index: -1 inside an isolated stacking context.
    for (const cls of ['.btn-luxury', '.btn-luxury-outline']) {
      expect(block(cls)).toMatch(/isolation:\s*isolate/);
      expect(block(`${cls}::before`)).toMatch(/z-index:\s*-1/);
    }
  });

  it('reads slow, not snappy', () => {
    // 700-800ms with the heavy ease-out. This is the couture timing; a value
    // in the 150-250ms range would read as a generic tech site.
    for (const cls of ['.btn-luxury', '.btn-luxury-outline', '.btn-couture-ghost']) {
      const durations = [...block(cls).matchAll(/(\d{3})ms/g)].map((m) => Number(m[1]));
      expect(durations.length).toBeGreaterThan(0);
      expect(Math.min(...durations)).toBeGreaterThanOrEqual(500);
    }
  });

  it('confirms a press, and does so faster than the hover', () => {
    for (const cls of ['.btn-luxury', '.btn-luxury-outline', '.btn-couture-ghost']) {
      const active = block(`${cls}:active`);
      expect(active).toMatch(/scale\(0\.9\d\d\)/);
      // Press feedback must be immediate; a slow press feels like lag.
      expect(active).toMatch(/transition-duration:\s*1[0-9]{2}ms/);
    }
  });

  it('does NOT animate tracking on the primary CTA', () => {
    // Opening letter-spacing reflows the label. On "REQUEST A PRIVATE VIEWING"
    // that is roughly 24px of width change the moment the pointer enters, which
    // reads as a jitter bug rather than as luxury. Tracking animation is
    // therefore reserved for .link-couture, whose labels are one word.
    const btn = block('.btn-luxury');
    expect(btn).toMatch(/letter-spacing:\s*0\.25em/);
    expect(btn).not.toMatch(/letter-spacing[^;]*700ms/);

    const link = block('.link-couture');
    expect(link).toMatch(/transition:\s*letter-spacing/);
    // Anchor on the trailing comma: `.link-couture:hover::after` appears first
    // in the stylesheet and would otherwise be matched instead.
    expect(block('.link-couture:hover,')).toMatch(/letter-spacing:\s*0\.32em/);
  });

  it('keeps the fill reachable for reduced-motion users', () => {
    // Removing the transition alone would leave ::before collapsed at scaleX(0)
    // and the hover looking broken. The reduced-motion block must therefore
    // force the fill to full scale as well as shortening the transition.
    const rm = block('@media (prefers-reduced-motion: reduce)');
    expect(rm).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    expect(rm).toMatch(/transform:\s*scaleX\(1\)/);
    expect(rm).toMatch(/transform:\s*none\s*!important/);
  });

  it('keeps a visible keyboard focus ring on every interactive variant', () => {
    const focus = block('.btn-luxury:focus-visible');
    expect(focus).toContain('outline: 2px solid var(--color-terracotta)');
    const combined = block('.btn-luxury:focus-visible');
    for (const cls of ['.btn-luxury-outline', '.btn-couture-ghost']) {
      expect(combined).toContain(cls);
    }
  });
});
