import { useLanguage } from '../../contexts/LanguageContext';
import KineticHeading from '../motion/KineticHeading';

interface ChapterLabelProps {
  numeral: string;
  titleKey: string;
}

export default function ChapterLabel({ numeral, titleKey }: ChapterLabelProps) {
  const { t } = useLanguage();
  return (
    <div className="flex items-baseline gap-5 md:gap-7">
      <span
        aria-hidden="true"
        className="font-heading text-6xl md:text-8xl leading-none font-light text-stone-200 select-none"
      >
        {numeral}
      </span>
      <span className="h-px w-10 bg-terracotta/40 self-center" aria-hidden="true" />
      <KineticHeading
        as="h2"
        text={t(titleKey)}
        delay={0.15}
        className="font-heading text-3xl md:text-5xl font-light normal-case text-stone-800"
      />
    </div>
  );
}
