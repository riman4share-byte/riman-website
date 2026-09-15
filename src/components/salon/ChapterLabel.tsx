import { useLanguage } from '../../contexts/LanguageContext';

interface ChapterLabelProps {
  numeral: string;
  titleKey: string;
}

export default function ChapterLabel({ numeral, titleKey }: ChapterLabelProps) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-5 md:gap-7">
      <span
        aria-hidden="true"
        className="font-heading text-5xl md:text-7xl leading-none font-light text-stone-300 select-none"
      >
        {numeral}
      </span>
      <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
      <h2 className="font-heading text-3xl md:text-5xl font-light normal-case text-stone-800">
        {t(titleKey)}
      </h2>
    </div>
  );
}
