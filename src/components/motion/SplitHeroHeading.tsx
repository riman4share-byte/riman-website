import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(useGSAP, SplitText);

type HeadingTag = 'h1' | 'h2' | 'h3';

interface SplitHeroHeadingProps {
  text: string;
  as?: HeadingTag;
  className?: string;
  emphasisChars?: string[];
  emphasisClassName?: string;
  delay?: number;
}

/**
 * GSAP SplitText hero reveal.
 *
 * Lines are split (never characters) so Arabic keeps its joined letterforms.
 * `autoSplit` re-splits after webfonts load and on resize, which is the whole
 * reason this beats manual word/char spans: the line boxes always match the
 * actual rendered type.
 */
export default function SplitHeroHeading({
  text,
  as: Tag = 'h1',
  className = '',
  emphasisChars = [],
  emphasisClassName = 'font-editorial italic text-terracotta-dark',
  delay = 0.2,
}: SplitHeroHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  const segments = useMemo(() => {
    if (emphasisChars.length === 0) return [{ value: text, emphasis: false }];
    const escaped = emphasisChars
      .map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('');
    const regex = new RegExp(`([${escaped}])`);
    return text
      .split(regex)
      .filter(Boolean)
      .map((value) => ({ value, emphasis: emphasisChars.includes(value) }));
  }, [text, emphasisChars]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;

      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            opacity: 0,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.09,
            delay,
          }),
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [reduced, text], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} className={className} data-heading>
      {segments.map((segment, i) =>
        segment.emphasis ? (
          <span key={i} className={emphasisClassName}>
            {segment.value}
          </span>
        ) : (
          segment.value
        ),
      )}
    </Tag>
  );
}
