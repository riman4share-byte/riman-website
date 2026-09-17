import { useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface KineticHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  emphasisChars?: string[];
  emphasisClassName?: string;
  delay?: number;
}

const container: Variants = {
  hidden: {},
  show: (delay: number) => ({ transition: { staggerChildren: 0.028, delayChildren: delay } }),
};

const letter: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const MOTION_TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3 } as const;
const HTML_TAGS = { h1: 'h1', h2: 'h2', h3: 'h3' } as const;

export default function KineticHeading({
  text,
  as = 'h2',
  className = '',
  emphasisChars = [],
  emphasisClassName = 'font-editorial italic text-gold',
  delay = 0,
}: KineticHeadingProps) {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const chars = useMemo(() => Array.from(text), [text]);

  if (reduced || language === 'ar' || chars.length > 90) {
    const Tag = HTML_TAGS[as];
    return (
      <Tag
        className={`${className} transition-all duration-500 hover:[text-shadow:0_0_28px_rgba(212,175,55,0.35)] cursor-default`}
        data-heading
      >
        {text}
      </Tag>
    );
  }

  const MotionTag = MOTION_TAGS[as];
  return (
    <MotionTag
      className={`${className} cursor-default`}
      custom={delay}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      data-heading
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letter}
          whileHover={
            char.trim() !== ''
              ? {
                  y: -3,
                  scale: 1.06,
                  color: '#D4AF37',
                  transition: { type: 'spring', stiffness: 500, damping: 20 },
                }
              : undefined
          }
          className={
            emphasisChars.includes(char)
              ? `${emphasisClassName} inline-block whitespace-pre select-none transition-colors duration-300`
              : 'kin-letter inline-block whitespace-pre select-none transition-colors duration-300'
          }
        >
          {char}
        </motion.span>
      ))}
    </MotionTag>
  );
}
