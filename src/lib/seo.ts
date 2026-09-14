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
    title: 'Atelier Riman | Sharjah Bridal & Evening Couture',
    description: 'Discover the zenith of Sharjah couture. Riman Fashion offers bespoke bridal gowns, evening wear, premium rentals, and fine jewelry at our flagship atelier.',
    ogType: 'website',
  },
  '/collection/all': {
    title: 'All Designs | Atelier Riman',
    description: 'Browse the complete Atelier Riman collection — bridal gowns, evening dresses, luxurious rentals, and fine jewelry. Each piece is handcrafted in Sharjah.',
    ogType: 'website',
  },
  '/collection/bridal': {
    title: 'Bridal Collection | Atelier Riman',
    description: 'Discover exquisite bridal gowns at Atelier Riman in Sharjah. From classic A-line to dramatic ballgowns — each gown is a masterpiece of couture craftsmanship.',
    ogType: 'website',
  },
  '/collection/evening': {
    title: 'Evening Gowns | Atelier Riman',
    description: 'Shop luxurious evening gowns and formal wear for galas, red carpets, and special occasions. Exclusive designs available for purchase and premium rental.',
    ogType: 'website',
  },
  '/collection/rental': {
    title: 'Premium Rentals | Atelier Riman',
    description: 'Rent designer bridal and evening gowns from Atelier Riman. 7-day premium rental includes dry cleaning and insurance. Perfect for your special occasion.',
    ogType: 'website',
  },
  '/collection/jewelry': {
    title: 'Fine Jewelry | Atelier Riman',
    description: 'Discover Atelier Riman\'s fine jewelry collection — handcrafted pieces that complement our bridal and evening couture. Gold, diamonds, and precious gems.',
    ogType: 'website',
  },
  '/about': {
    title: 'Our Story | Atelier Riman',
    description: 'Discover the heritage of Atelier Riman — Sharjah\'s premier bridal and evening couture house. Where tradition meets contemporary luxury.',
  },
  '/contact': {
    title: 'Contact | Atelier Riman',
    description: 'Visit our Sharjah atelier for a private consultation. Book an appointment to explore our bridal and evening collections with our master stylists.',
  },
  '/faq': {
    title: 'FAQ | Atelier Riman',
    description: 'Find answers to common questions about Atelier Riman\'s bridal and evening wear, including sizing, rentals, alterations, and ordering.',
  },
  '/alterations': {
    title: 'Bespoke Alterations | Atelier Riman',
    description: 'Expert bespoke tailoring and alterations at our Sharjah atelier. From hem adjustments to complete gown restructuring by our master seamstresses.',
  },
  '/gallery': {
    title: 'Gallery | Atelier Riman',
    description: 'Browse our gallery of Atelier Riman creations — bridal gowns, evening wear, and editorial features from our Sharjah atelier.',
  },
  '/style-quiz': {
    title: 'Style Quiz | Atelier Riman',
    description: 'Discover your perfect bridal or evening silhouette with Atelier Riman\'s style consultation quiz. Find the gown that matches your vision.',
  },
  '/appointment': {
    title: 'Book Appointment | Atelier Riman',
    description: 'Schedule a private consultation at our Sharjah atelier. Experience our bridal and evening collections with personalised styling guidance.',
  },
  '/timeline': {
    title: 'Bridal Timeline | Atelier Riman',
    description: 'Plan your wedding journey with Atelier Riman\'s bridal concierge. From your first consultation to your final fitting — we guide every step.',
  },
  '/wedding-checklist': {
    title: 'Wedding Checklist | Atelier Riman',
    description: 'Your complete wedding planning checklist from Atelier Riman. Stay organised from engagement to your grand entrance.',
  },
  '/collection/couture': {
    title: 'Couture Evening Wear | Atelier Riman',
    description: 'Couture evening silhouettes cut from silk and crystal — hand-finished in our Sharjah atelier for the grandest entrances.',
    ogType: 'website',
  },
  '/collection/accessories': {
    title: 'Accessories | Atelier Riman',
    description: 'Veils, straps and couture finishing details, hand-made in our Sharjah atelier alongside every gown.',
    ogType: 'website',
  },
  '/collections': {
    title: 'The Collections | Atelier Riman',
    description: 'Browse every Atelier Riman collection — bridal gowns, couture evening wear, premium rentals, accessories and fine jewelry.',
    ogType: 'website',
  },
  '/journal': {
    title: 'The Journal | Atelier Riman',
    description: 'Stories, styling notes and behind-the-scenes from the Atelier Riman Sharjah atelier.',
    ogType: 'website',
  },
  '/wishlist': {
    title: 'Your Wishlist | Atelier Riman',
    description: 'View your saved Atelier Riman designs. Create your personal collection of bridal and evening favourites.',
    noIndex: true,
  },
  '/profile': {
    title: 'My Account | Atelier Riman',
    description: 'Manage your Atelier Riman account, view orders, and update preferences.',
    noIndex: true,
  },
  '/checkout': {
    title: 'Checkout | Atelier Riman',
    description: 'Complete your purchase at Atelier Riman. Secure checkout for bridal gowns, evening wear, and rentals.',
    noIndex: true,
  },
  '/search': {
    title: 'Search | Atelier Riman',
    description: 'Search the complete Atelier Riman collection for the perfect bridal or evening ensemble.',
    noIndex: true,
  },
  '/privacy': {
    title: 'Privacy Policy | Atelier Riman',
    description: 'Atelier Riman privacy policy — how we protect and handle your personal information.',
  },
  '/terms': {
    title: 'Terms & Conditions | Atelier Riman',
    description: 'Atelier Riman terms and conditions for purchases, rentals, and appointments.',
  },
  '/auth': {
    title: 'Sign In | Atelier Riman',
    description: 'Sign in to your Atelier Riman account.',
    noIndex: true,
  },
  '/payment/success': {
    title: 'Payment | Atelier Riman',
    description: 'Atelier Riman payment confirmation.',
    noIndex: true,
  },
  '/payment/cancel': {
    title: 'Payment | Atelier Riman',
    description: 'Atelier Riman payment cancelled.',
    noIndex: true,
  },
  '/demo-21st': {
    title: 'Atelier Riman',
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
    name: 'Atelier Riman',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
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
    name: 'Atelier Riman - Sharjah Boutique',
    url: BASE_URL,
    image: `${BASE_URL}/logo.png`,
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

export function productSchema(product: Product) {
  const offers: Array<Record<string, string | number>> = [];
  if (product.productType === 'sale' || product.productType === 'both') {
    offers.push({
      '@type': 'Offer',
      name: 'Purchase',
      price: product.salePrice || 0,
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
    });
  }
  if (product.productType === 'rent' || product.productType === 'both') {
    offers.push({
      '@type': 'Offer',
      name: '7-Day Rental',
      price: product.rentalPrice || 0,
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${BASE_URL}/product/${product.id}`,
    name: product.name,
    description: product.description,
    image: (product.images || []).map(resolveMediaUrl).filter(Boolean),
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Atelier Riman',
    },
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
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Atelier Riman',
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
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Collection | Atelier Riman`,
      description: `Explore the ${category} collection at Atelier Riman. Exquisite gowns and formal wear crafted in our Sharjah atelier.`,
      ogType: 'website',
    };
  }
  if (pathname.startsWith('/product/')) {
    return {
      title: 'Design Detail | Atelier Riman',
      description: 'View this exclusive Atelier Riman creation. Discover the craftsmanship, fabrics, and details that define our couture.',
      ogType: 'product',
    };
  }
  if (pathname.startsWith('/admin')) {
    return {
      title: 'Admin | Atelier Riman',
      description: 'Atelier Riman administration panel.',
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
