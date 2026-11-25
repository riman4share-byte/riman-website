import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const CHAPTERS = ['I', 'II', 'III', 'IV'] as const;

function ChapterTick({ index, total, progress }: { index: number; total: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const threshold = index / (total - 1);
  const opacity = useTransform(progress, (v) => (v >= threshold - 0.05 ? 1 : 0.35));
  return (
    <motion.span className="font-label text-[10px] tracking-[0.2em] text-stone-400" style={{ opacity }}>
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
      className="fixed top-1/2 -translate-y-1/2 start-4 z-30 hidden lg:flex flex-col items-center gap-6"
    >
      <div className="relative h-40 w-px bg-stone-300/40 overflow-hidden">
        <motion.div
          className="absolute inset-x-0 top-0 w-px bg-terracotta origin-top"
          style={{ scaleY: scrollYProgress }}
        />
      </div>
      <div className="flex flex-col gap-4">
        {CHAPTERS.map((_, i) => (
          <ChapterTick key={i} index={i} total={CHAPTERS.length} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}