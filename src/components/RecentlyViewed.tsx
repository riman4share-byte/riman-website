import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-champagne">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mb-8 tracking-widest uppercase">
          Recently Viewed
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recentlyViewed.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}