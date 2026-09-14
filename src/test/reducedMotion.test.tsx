/**
 * Reduced-motion guarantees:
 *  - the app tree is wrapped in <MotionConfig reducedMotion="user"> so every
 *    motion/react JS animation honors the OS setting (transform animations are
 *    dropped and durations collapse),
 *  - ScrollReveal bypasses its reveal animation entirely when the user
 *    prefers reduced motion,
 *  - a global CSS media block neutralizes CSS animations/transitions.
 */
import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../hooks/useFeature', () => ({
  useFeature: () => true,
}));

describe('MotionConfig wiring', () => {
  it('wraps the app in reducedMotion="user" so all JS animations respect the OS setting', () => {
    const src = readFileSync('src/App.tsx', 'utf8');
    expect(src).toContain('<MotionConfig reducedMotion="user">');
  });

  it('applies the reduced-motion opt-out before route/page animation components mount', () => {
    // MotionConfig must sit ABOVE AnimatedRoutes/PageWrapper in the tree.
    const src = readFileSync('src/App.tsx', 'utf8');
    expect(src.indexOf('<MotionConfig')).toBeLessThan(src.indexOf('<AnimatedRoutes />'));
  });
});

describe('ScrollReveal', () => {
  it('bypasses the reveal wrapper entirely when the OS prefers reduced motion', async () => {
    // Mock motion's own hook deterministically: the guarantee we test is that
    // ScrollReveal short-circuits on prefersReducedMotion (its import-time
    // media-query cache in jsdom is otherwise unreliable).
    vi.resetModules();
    vi.doMock('motion/react', async () => {
      const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
      return { ...actual, useReducedMotion: () => true };
    });
    const { default: ScrollReveal } = await import('../components/ScrollReveal');
    const { container } = render(
      <ScrollReveal><p id="probe">Revealed</p></ScrollReveal>,
    );
    expect(container.querySelector('#probe')).not.toBeNull();
    expect(container.firstChild).toBe(container.querySelector('#probe'));
    vi.doUnmock('motion/react');
  });
});

describe('global CSS reduced-motion block', () => {
  it('neutralizes CSS animation and transition durations', () => {
    const css = readFileSync('src/index.css', 'utf8');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation-duration:\s*0\.01ms/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition-duration:\s*0\.01ms/);
  });
});
