import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface WordRevealProps {
  text: string;
  className?: string;
}

export default function WordReveal({ text, className }: WordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { isRtl } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.45'],
  });

  // Arabic must never be split (breaks letter joining) — simple fade instead
  if (isRtl) {
    return (
      <motion.p
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className={className}
      >
        {text}
      </motion.p>
    );
  }

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} index={i} total={words.length}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, index, total }: { children: string; progress: any; index: number; total: number }) {
  // Each word gets its own useTransform, but we batch the output ranges
  const start = index / total;
  const end = Math.min(1, (index + 1) / total + 0.05);
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  return (
    <motion.span data-word style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}
