import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const CHAPTERS = ['I', 'II', 'III', 'IV'] as const;

/**
 * Chapter rail (brief 9.2).
 *
 * A fixed hairline at the inline-start edge that draws itself with scroll.
 * The four roman ticks sit alongside the line; the one the reader has
 * reached fills, the rest stay quiet.
 *
 * Desktop only and hidden under reduced motion, per the brief.
 */
function ChapterTick({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const threshold = index / (total - 1);
  const opacity = useTransform(progress, (v) => (v >= threshold - 0.04 ? 1 : 0.45));
  const color = useTransform(
    progress,
    (v) => (v >= threshold - 0.04 ? 'var(--color-terracotta)' : 'var(--color-stone-300)'),
  );

  return (
    <motion.span
      className="font-label text-[11px] tracking-[0.2em] leading-none"
      style={{ opacity, color }}
    >
      {CHAPTERS[index]}
    </motion.span>
  );
}

export default function ChapterRail() {
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll();

  if (reduced || !desktop) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-1/2 -translate-y-1/2 start-6 z-30 hidden lg:flex items-center gap-3"
    >
      <svg width="2" height="160" viewBox="0 0 2 160" className="overflow-visible shrink-0">
        <line x1="1" y1="0" x2="1" y2="160" stroke="var(--color-stone-300)" strokeOpacity="0.45" strokeWidth="1" />
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="160"
          stroke="var(--color-terracotta)"
          strokeWidth="1"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>

      <div className="relative h-40">
        {CHAPTERS.map((_, i) => (
          <span
            key={i}
            className="absolute start-0 -translate-y-1/2 flex items-center gap-2"
            style={{ top: `${(i / (CHAPTERS.length - 1)) * 100}%` }}
          >
            <span className="h-px w-3 bg-stone-300/50" />
            <ChapterTick index={i} total={CHAPTERS.length} progress={scrollYProgress} />
          </span>
        ))}
      </div>
    </div>
  );
}
