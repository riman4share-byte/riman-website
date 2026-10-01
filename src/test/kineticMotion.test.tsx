import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import KineticHeading from '../components/motion/KineticHeading';
import RevealWords from '../components/motion/RevealWords';

const wrap = (ui: React.ReactNode) => <LanguageProvider>{ui}</LanguageProvider>;

describe('KineticHeading', () => {
  beforeEach(() => localStorage.setItem('riman_lang', 'en'));

  it('EN: splits into per-character spans and preserves textContent', () => {
    const { container } = render(wrap(<KineticHeading as="h2" text="Atelier & Grace" emphasisChars={['&']} />));
    const h2 = container.querySelector('h2')!;
    expect(h2.querySelectorAll('.kin-letter').length).toBe(14);
    expect(h2.textContent).toBe('Atelier & Grace');
    // Scoped to the letter spans: the emphasised letter uses emphasisClassName
    // instead of `kin-letter`, and now sits inside a per-word wrapper.
    const em = [...h2.querySelectorAll('span')].find(
      (s) => s.textContent === '&' && s.className.includes('inline-block') && !s.className.includes('whitespace-nowrap')
    );
    expect(em?.className).toContain('font-editorial');
  });

  it('wraps each word so the browser cannot break mid-word', () => {
    const { container } = render(
      wrap(<KineticHeading as="h1" text="Bridal Gowns Made to Measure" />)
    );
    const h1 = container.querySelector('h1')!;
    const wordSpans = [...h1.children].filter(
      (s) => s.tagName === 'SPAN' && s.className.includes('whitespace-nowrap')
    );
    // Word tokens plus the whitespace separators between them.
    expect(wordSpans.map((s) => s.textContent)).toEqual([
      'Bridal',
      ' ',
      'Gowns',
      ' ',
      'Made',
      ' ',
      'to',
      ' ',
      'Measure',
    ]);
    // Every letter span must live inside a nowrap word wrapper.
    const letters = [...h1.querySelectorAll('.kin-letter')];
    expect(letters.length).toBe('Bridal Gowns Made to Measure'.length);
    letters.forEach((l) => {
      expect(l.parentElement?.className).toContain('whitespace-nowrap');
    });
  });

  it('AR: renders zero letter spans, plain text', () => {
    localStorage.setItem('riman_lang', 'ar');
    const { container } = render(wrap(<KineticHeading as="h2" text="القصات" />));
    expect(container.querySelector('h2')!.querySelectorAll('.kin-letter').length).toBe(0);
    expect(container.querySelector('h2')!.textContent).toBe('القصات');
  });

  it('long text (>90 chars) is not letter-split', () => {
    const long = 'x'.repeat(91);
    const { container } = render(wrap(<KineticHeading as="h3" text={long} />));
    expect(container.querySelector('.kin-letter')).toBeNull();
  });
});

describe('RevealWords', () => {
  it('splits into word spans preserving words, never breaks Arabic', () => {
    const { container } = render(wrap(<RevealWords as="p" text="Grace held in tension" />));
    expect(container.querySelectorAll('.kin-word').length).toBe(4);
    expect(container.querySelector('p')!.textContent).toContain('Grace');
    expect(container.querySelector('p')!.textContent).toContain('tension');
  });
});
