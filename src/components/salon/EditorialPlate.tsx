import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
  const { name: productName } = localizedContent(product, language);
  const lookNumber = String(index + 1).padStart(2, '0');

  return (
    <figure className="group grid gap-6 md:grid-cols-12 md:gap-10 items-end">
      <div className={cn('relative overflow-hidden md:col-span-7', reverse && 'md:order-2')}>
        <img
          src={product.images[0]}
          alt={productName}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute top-4 left-4 font-heading text-6xl font-light text-white/90 drop-shadow-md">
          {lookNumber}
        </span>
      </div>
      <figcaption className={cn('flex flex-col gap-3 md:col-span-5', reverse && 'md:order-1')}>
        <span className="font-label text-xs tracking-[0.3em] uppercase text-terracotta-dark">
          {t('silhouettes.look')} {lookNumber}
        </span>
        <h3 className="font-heading text-2xl md:text-3xl font-light text-stone-800">{productName}</h3>
        {product.fabric && (
          <p className="font-editorial italic text-stone-600">{translateProductValue('fabric', product.fabric, language)}</p>
        )}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-1">
          {product.salePrice !== undefined && product.salePrice > 0 && (
            <p className="font-body text-sm text-stone-800">
              <span className="font-label text-caption tracking-[0.25em] uppercase text-stone-500 me-2">{t('product.purchase_value')}</span>
              <span className="font-label text-caption tracking-[0.25em] uppercase text-stone-500 me-1">{t('pricing.from')}</span>
              {formatPrice(product.salePrice)}
            </p>
          )}
          {product.rentalPrice !== undefined && product.rentalPrice > 0 && (
            <p className="font-body text-sm text-terracotta-dark">
              <span className="font-label text-caption tracking-[0.25em] uppercase text-stone-500 me-2">{t('product.rent')}</span>
              <span className="font-label text-caption tracking-[0.25em] uppercase text-stone-500 me-1">{t('pricing.from')}</span>
              {formatPrice(product.rentalPrice)}
            </p>
          )}
        </div>
        <Link
          to={`/product/${product.id}`}
          className="group/link inline-flex items-center gap-2 font-label text-xs tracking-[0.25em] uppercase text-stone-800 transition-colors duration-700 hover:text-terracotta-dark mt-2"
        >
          {t('silhouettes.view_reserve')}
          <ArrowRight className="w-4 h-4 transition-transform duration-700 group-hover/link:translate-x-1 rtl:rotate-180" />
        </Link>
      </figcaption>
    </figure>
  );
}
