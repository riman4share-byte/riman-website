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
    const em = [...h2.querySelectorAll('span')].find((s) => s.textContent === '&');
    expect(em?.className).toContain('font-editorial');
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
