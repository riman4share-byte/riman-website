import { motion, useReducedMotion } from 'motion/react';

/**
 * A 1px terracotta rule that draws itself in from the centre (brief 9.8).
 *
 * Used as a chapter divider in place of some InvitationRules, so not every
 * chapter ends the same way.
 *
 * `surface` sets the ground the rule sits on. It is a separate prop rather
 * than a className because the rule itself is always terracotta - passing a
 * background through className would collide with the rule's own background
 * colour and the winner would depend on CSS source order, not intent.
 */
export default function GoldThread({ surface = '' }: { surface?: string }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={`h-px ${surface}`} aria-hidden="true">
        <div className="h-px bg-terracotta/20" />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${surface}`} aria-hidden="true">
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-terracotta/60 to-transparent origin-center"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
