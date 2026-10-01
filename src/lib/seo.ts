import { Product } from '../types';

// Injected at build time from the validated SITE_URL (see vite.config.ts).
declare const __SITE_URL__: string | undefined;
export const SITE_URL: string =
  (typeof __SITE_URL__ !== 'undefined' && __SITE_URL__) || 'http://localhost:3001';

/** Absolute, canonical URL for a path on this site. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === '/' ? '/' : path}`;
}

/** Pass CDN/absolute image URLs through untouched; prefix site-relative ones. */
export function resolveMediaUrl(src?: string): string | undefined {
  if (!src) return undefined;
  return /^https?:\/\//i.test(src) ? src : `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

// ────────────────────────────────
// Route-level metadata
// ────────────────────────────────

export interface RouteMeta {
  title: string;
  description: string;
  ogType?: string;
  noIndex?: boolean;
}

export const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    title: 'Riman Fashion | Sharjah Bridal & Evening Couture',
    description: 'Discover the zenith of Sharjah couture. Riman Fashion offers bespoke bridal gowns, evening wear, premium rentals, and fine jewelry at our flagship atelier.',
    ogType: 'website',
  },
  '/collection/all': {
    title: 'All Designs | Riman Fashion',
    description: 'Browse the complete Riman Fashion collection — bridal gowns, evening dresses, luxurious rentals, and fine jewelry. Each piece is handcrafted in Sharjah.',
    ogType: 'website',
  },
  '/collection/bridal': {
    title: 'Bridal Collection | Riman Fashion',
    description: 'Discover exquisite bridal gowns at Riman Fashion in Sharjah. From classic A-line to dramatic ballgowns — each gown is a masterpiece of couture craftsmanship.',
    ogType: 'website',
  },
  '/collection/evening': {
    title: 'Evening Gowns | Riman Fashion',
    description: 'Shop luxurious evening gowns and formal wear for galas, red carpets, and special occasions. Exclusive designs available for purchase and premium rental.',
    ogType: 'website',
  },
  '/collection/rental': {
    title: 'Premium Rentals | Riman Fashion',
    description: 'Rent designer bridal and evening gowns from Riman Fashion. 7-day premium rental includes dry cleaning and insurance. Perfect for your special occasion.',
    ogType: 'website',
  },
  '/collection/jewelry': {
    title: 'Fine Jewelry | Riman Fashion',
    description: 'Discover Riman Fashion\'s fine jewelry collection — handcrafted pieces that complement our bridal and evening couture. Gold, diamonds, and precious gems.',
    ogType: 'website',
  },
  '/about': {
    title: 'Our Story | Riman Fashion',
    description: 'Discover the heritage of Riman Fashion — Sharjah\'s premier bridal and evening couture house. Where tradition meets contemporary luxury.',
  },
  '/contact': {
    title: 'Contact | Riman Fashion',
    description: 'Visit our Sharjah atelier for a private consultation. Book an appointment to explore our bridal and evening collections with our master stylists.',
  },
  '/faq': {
    title: 'FAQ | Riman Fashion',
    description: 'Find answers to common questions about Riman Fashion\'s bridal and evening wear, including sizing, rentals, alterations, and ordering.',
  },
  '/alterations': {
    title: 'Bespoke Alterations | Riman Fashion',
    description: 'Expert bespoke tailoring and alterations at our Sharjah atelier. From hem adjustments to complete gown restructuring by our master seamstresses.',
  },
  '/gallery': {
    title: 'Gallery | Riman Fashion',
    description: 'Browse our gallery of Riman Fashion creations — bridal gowns, evening wear, and editorial features from our Sharjah atelier.',
  },
  '/style-quiz': {
    title: 'Style Quiz | Riman Fashion',
    description: 'Discover your perfect bridal or evening silhouette with Riman Fashion\'s style consultation quiz. Find the gown that matches your vision.',
  },
  '/appointment': {
    title: 'Book Appointment | Riman Fashion',
    description: 'Schedule a private consultation at our Sharjah atelier. Experience our bridal and evening collections with personalised styling guidance.',
  },
  '/wedding-checklist': {
    title: 'Wedding Checklist | Riman Fashion',
    description: 'Your complete wedding planning checklist from Riman Fashion. Stay organised from engagement to your grand entrance.',
  },
  '/collection/couture': {
    title: 'Couture Evening Wear | Riman Fashion',
    description: 'Couture evening silhouettes cut from silk and crystal — hand-finished in our Sharjah atelier for the grandest entrances.',
    ogType: 'website',
  },
  '/collection/accessories': {
    title: 'Accessories | Riman Fashion',
    description: 'Veils, straps and couture finishing details, hand-made in our Sharjah atelier alongside every gown.',
    ogType: 'website',
  },
  '/collections': {
    title: 'The Collections | Riman Fashion',
    description: 'Browse every Riman Fashion collection — bridal gowns, couture evening wear, premium rentals, accessories and fine jewelry.',
    ogType: 'website',
  },
  '/journal': {
    title: 'The Journal | Riman Fashion',
    description: 'Stories, styling notes and behind-the-scenes from the Riman Fashion Sharjah atelier.',
    ogType: 'website',
  },
  '/wishlist': {
    title: 'Your Wishlist | Riman Fashion',
    description: 'View your saved Riman Fashion designs. Create your personal collection of bridal and evening favourites.',
    noIndex: true,
  },
  '/profile': {
    title: 'My Account | Riman Fashion',
    description: 'Manage your Riman Fashion account, view orders, and update preferences.',
    noIndex: true,
  },
  '/checkout': {
    title: 'Checkout | Riman Fashion',
    description: 'Complete your purchase at Riman Fashion. Secure checkout for bridal gowns, evening wear, and rentals.',
    noIndex: true,
  },
  '/search': {
    title: 'Search | Riman Fashion',
    description: 'Search the complete Riman Fashion collection for the perfect bridal or evening ensemble.',
    noIndex: true,
  },
  '/privacy': {
    title: 'Privacy Policy | Riman Fashion',
    description: 'Riman Fashion privacy policy — how we protect and handle your personal information.',
  },
  '/terms': {
    title: 'Terms & Conditions | Riman Fashion',
    description: 'Riman Fashion terms and conditions for purchases, rentals, and appointments.',
  },
  '/auth': {
    title: 'Sign In | Riman Fashion',
    description: 'Sign in to your Riman Fashion account.',
    noIndex: true,
  },
  '/payment/success': {
    title: 'Payment | Riman Fashion',
    description: 'Riman Fashion payment confirmation.',
    noIndex: true,
  },
  '/payment/cancel': {
    title: 'Payment | Riman Fashion',
    description: 'Riman Fashion payment cancelled.',
    noIndex: true,
  },
  '/demo-21st': {
    title: 'Riman Fashion',
    description: 'Preview.',
    noIndex: true,
  },
};

// ────────────────────────────────
// JSON-LD Structured Data
// ────────────────────────────────

export const BASE_URL = SITE_URL;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Riman Fashion',
    url: BASE_URL,
    logo: `${BASE_URL}/riman-logo.png`,
    description: 'Sharjah\'s premier bridal and evening couture house. Bespoke gowns, premium rentals, and fine jewelry.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Al Zahra St',
      addressLocality: 'Sharjah',
      addressCountry: 'AE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+971-55-373-0792',
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic'],
    },
    sameAs: [
      'https://instagram.com/rimanfashion',
      'https://facebook.com/rimanfashion',
    ],
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Store', 'FashionStore'],
    '@id': `${BASE_URL}/#store`,
    parentOrganization: { '@id': `${BASE_URL}/#organization` },
    name: 'Riman Fashion - Sharjah Boutique',
    url: BASE_URL,
    image: `${BASE_URL}/riman-logo.png`,
    description: 'Premier bridal and evening couture atelier in Sharjah, UAE.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sharjah',
      addressCountry: 'AE',
    },
    telephone: '+971-55-373-0792',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '11:00',
      closes: '21:00',
    },
  };
}

export interface ProductRatingInput {
  ratingValue: number;
  reviewCount: number;
}

export function productSchema(product: Product, rating?: ProductRatingInput) {
  const productUrl = `${BASE_URL}/product/${product.id}`;
  const offers: Array<Record<string, string | number>> = [];
  if (product.productType === 'sale' || product.productType === 'both') {
    offers.push({
      '@type': 'Offer',
      name: 'Purchase',
      url: productUrl,
      price: product.salePrice || 0,
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    });
  }
  if (product.productType === 'rent' || product.productType === 'both') {
    offers.push({
      '@type': 'Offer',
      name: '7-Day Rental',
      url: productUrl,
      price: product.rentalPrice || 0,
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${BASE_URL}/product/${product.id}`,
    url: productUrl,
    name: product.name,
    description: product.description,
    image: (product.images || []).map(resolveMediaUrl).filter(Boolean),
    sku: `RF-${product.id.padStart(4, '0')}`,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Riman Fashion',
    },
    // Only emit when we have real, approved reviews. Never fabricate a rating.
    ...(rating && rating.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(rating.ratingValue.toFixed(1)),
        reviewCount: rating.reviewCount,
      },
    }),
    offers: offers.length === 1 ? offers[0] : offers,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      // Callers may pass either a root-relative path or an already absolute
      // URL. Prefixing unconditionally produced doubled hosts such as
      // "https://site.comhttps://site.com/collection/bridal".
      item: /^https?:\/\//i.test(item.url) ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Riman Fashion',
    description: 'Sharjah\'s premier bridal and evening couture house.',
    inLanguage: ['en', 'ar'],
    publisher: { '@id': `${BASE_URL}/#organization` },
  };
}

// ────────────────────────────────
// Helpers
// ────────────────────────────────

/** Resolve page meta from a pathname, falling back to the root defaults. */
export function resolveRouteMeta(pathname: string): RouteMeta {
  // Static route match first
  if (ROUTE_META[pathname]) return ROUTE_META[pathname];

  // Dynamic route patterns: /collection/:category, /product/:id
  if (pathname.startsWith('/collection/')) {
    const category = pathname.replace('/collection/', '');
    return {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Collection | Riman Fashion`,
      description: `Explore the ${category} collection at Riman Fashion. Exquisite gowns and formal wear crafted in our Sharjah atelier.`,
      ogType: 'website',
    };
  }
  if (pathname.startsWith('/product/')) {
    return {
      title: 'Design Detail | Riman Fashion',
      description: 'View this exclusive Riman Fashion creation. Discover the craftsmanship, fabrics, and details that define our couture.',
      ogType: 'product',
    };
  }
  if (pathname.startsWith('/admin')) {
    return {
      title: 'Admin | Riman Fashion',
      description: 'Riman Fashion administration panel.',
      noIndex: true,
    };
  }

  // Fallback
  return ROUTE_META['/'];
}

/**
 * Hreflang entries for the current path.
 * EN/AR is a client-side language switch inside a single bilingual app —
 * there are no /ar/* URLs, so emitting them would point crawlers at 404s.
 */
export function getHreflangEntries(pathname: string) {
  const url = `${BASE_URL}${pathname === '/' ? '/' : pathname}`;
  return [
    { rel: 'alternate', href: url, hreflang: 'en' },
    { rel: 'alternate', href: url, hreflang: 'x-default' },
  ];
}
