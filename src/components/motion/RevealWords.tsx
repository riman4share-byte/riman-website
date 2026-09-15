import { useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

interface RevealWordsProps {
  text: string;
  as?: 'p' | 'span' | 'blockquote';
  className?: string;
  stagger?: number;
}

const container: Variants = {
  hidden: {},
  show: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};

const word: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const MOTION_TAGS = { p: motion.p, span: motion.span, blockquote: motion.blockquote } as const;
const HTML_TAGS = { p: 'p', span: 'span', blockquote: 'blockquote' } as const;

export default function RevealWords({ text, as = 'p', className = '', stagger = 0.04 }: RevealWordsProps) {
  const reduced = useReducedMotion();
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  if (reduced) {
    const Tag = HTML_TAGS[as];
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = MOTION_TAGS[as];
  return (
    <MotionTag
      className={className}
      custom={stagger}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} variants={word} className="kin-word inline-block whitespace-pre me-[0.25em]">
          {w}
        </span>
      ))}
    </MotionTag>
  );
}
