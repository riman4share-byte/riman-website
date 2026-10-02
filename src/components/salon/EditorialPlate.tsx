import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn, formatPrice } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { translateProductValue, localizedContent } from '../../lib/productVocab';
import { Product } from '../../types';

interface EditorialPlateProps {
  product: Product;
  index: number;
  reverse?: boolean;
}

export default function EditorialPlate({ product, index, reverse }: EditorialPlateProps) {
  const { t, language } = useLanguage();
  const reduced = useReducedMotion();
  const { name: productName } = localizedContent(product, language);
  const lookNumber = String(index + 1).padStart(2, '0');

  return (
    <figure className="group relative grid gap-8 md:grid-cols-12 md:gap-10 items-end">
      {/* Ghosted oversized numeral — parallax at a different speed */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none select-none absolute -top-[0.4em] font-heading font-light leading-none text-stone-200/70 text-[clamp(7rem,16vw,15rem)]',
          reverse ? 'end-0 md:-end-8' : 'start-0 md:-start-8',
        )}
      >
        {lookNumber}
      </span>

      <motion.div
        className={cn('relative overflow-hidden md:col-span-7', reverse && 'md:order-2')}
        {...(!reduced ? {
          initial: { clipPath: 'inset(0 0 100% 0)' },
          whileInView: { clipPath: 'inset(0 0 0% 0)' },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        } : {})}
      >
        <Link to={`/product/${product.id}`} aria-label={productName}>
          <img
            src={product.images[0]}
            alt={language === 'ar' ? `${productName} — من ريمان للأزياء` : `${productName} — from the Riman atelier`}
            loading="lazy"
            decoding="async"
            className="aspect-[3/4] w-full object-cover object-[center_20%] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
          />
        </Link>
        <span className="absolute top-5 start-5 bg-ivory/90 backdrop-blur-[2px] px-3 py-1.5 font-label text-[11px] tracking-[0.3em] uppercase text-stone-800">
          RF-{String(product.id).padStart(4, '0')}
        </span>
      </motion.div>

      <figcaption className={cn('relative flex flex-col gap-4 md:col-span-5 md:pb-6', reverse && 'md:order-1')}>
        <span className="font-label text-[11px] tracking-[0.35em] uppercase text-terracotta-dark">
          {t('silhouettes.look')} {lookNumber}
        </span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading text-3xl md:text-4xl font-light text-stone-800 leading-tight group-hover:text-terracotta-dark transition-colors duration-700">
            {productName}
          </h3>
        </Link>
        {product.fabric && (
          <p className="font-editorial italic text-lg text-stone-600">{translateProductValue('fabric', product.fabric, language)}</p>
        )}
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 mt-1">
          {product.salePrice !== undefined && product.salePrice > 0 && (
            <p className="font-body text-sm text-stone-800">
              <span className="font-label text-[11px] tracking-[0.25em] uppercase text-stone-500 me-2">{t('product.purchase_value')}</span>
              {formatPrice(product.salePrice)}
            </p>
          )}
          {product.rentalPrice !== undefined && product.rentalPrice > 0 && (
            <p className="font-body text-sm text-terracotta-dark">
              <span className="font-label text-[11px] tracking-[0.25em] uppercase text-stone-500 me-2">{t('product.rent')}</span>
              {formatPrice(product.rentalPrice)}
            </p>
          )}
        </div>
        <Link
          to={`/product/${product.id}`}
          className="group/link inline-flex items-center gap-2 font-label text-[11px] tracking-[0.3em] uppercase text-stone-800 transition-colors duration-700 hover:text-terracotta-dark mt-2 min-h-[44px]"
        >
          {t('silhouettes.view_reserve')}
          <ArrowRight className="w-4 h-4 transition-transform duration-700 group-hover/link:translate-x-1 rtl:rotate-180" />
        </Link>
      </figcaption>
    </figure>
  );
}
