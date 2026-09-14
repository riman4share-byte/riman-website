/**
 * Build-time static SEO generation: sitemap, robots.txt, and per-route
 * prerendered index.html copies (head metadata + crawler-visible body
 * content). Node-safe module (no Vite/browser imports) so it can be unit
 * tested directly with vitest.
 *
 * Prerendered bodies are replaced client-side by React's createRoot() —
 * they exist for crawlers and no-JS requests, not for hydration.
 */

interface SeedProduct {
  id: string;
  name: string;
  description?: string;
  images: string[];
  category?: string;
  salePrice?: number;
  rentalPrice?: number;
  productType?: string;
  is_active?: boolean;
}

export interface PrerenderPage {
  /** URL path, e.g. '/about' or '/product/17'. '/' for the home page. */
  route: string;
  title: string;
  description: string;
  ogType: 'website' | 'product';
  /** Absolute URLs built from the validated SITE_URL. */
  canonical: string;
  ogImage: string;
  /** JSON-LD objects injected into the prerendered page (data, not code). */
  jsonLd: Record<string, unknown>[];
  /** Static HTML placed inside <div id="root"> for crawlers. */
  bodyHtml: string;
}

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Never break out of a <script type="application/ld+json"> element. */
export function safeJsonLdScript(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
  return `<script type="application/ld+json">${json}</script>`;
}

const PUBLIC_STATIC_ROUTES: { route: string; title: string; description: string }[] = [
  { route: '/', title: 'Atelier Riman | Sharjah Bridal & Evening Couture', description: 'Discover the zenith of Sharjah couture. Riman Fashion offers bespoke bridal gowns, evening wear, premium rentals, and fine jewelry at our flagship atelier.' },
  { route: '/about', title: 'Our Story | Atelier Riman', description: 'Discover the heritage of Atelier Riman — Sharjah\'s premier bridal and evening couture house. Where tradition meets contemporary luxury.' },
  { route: '/contact', title: 'Contact | Atelier Riman', description: 'Visit our Sharjah atelier for a private consultation. Book an appointment to explore our bridal and evening collections with our master stylists.' },
  { route: '/collections', title: 'The Collections | Atelier Riman', description: 'Browse every Atelier Riman collection — bridal gowns, couture evening wear, premium rentals, accessories and fine jewelry.' },
  { route: '/journal', title: 'The Journal | Atelier Riman', description: 'Stories, styling notes and behind-the-scenes from the Atelier Riman Sharjah atelier.' },
  { route: '/collection/all', title: 'All Designs | Atelier Riman', description: 'Browse the complete Atelier Riman collection — bridal gowns, evening dresses, luxurious rentals, and fine jewelry. Each piece is handcrafted in Sharjah.' },
  { route: '/collection/bridal', title: 'Bridal Collection | Atelier Riman', description: 'Discover exquisite bridal gowns at Atelier Riman in Sharjah. From classic A-line to dramatic ballgowns — each gown is a masterpiece of couture craftsmanship.' },
  { route: '/collection/evening', title: 'Evening Gowns | Atelier Riman', description: 'Shop luxurious evening gowns and formal wear for galas, red carpets, and special occasions. Exclusive designs available for purchase and premium rental.' },
  { route: '/collection/couture', title: 'Couture Evening Wear | Atelier Riman', description: 'Couture evening silhouettes cut from silk and crystal — hand-finished in our Sharjah atelier for the grandest entrances.' },
  { route: '/collection/rental', title: 'Premium Rentals | Atelier Riman', description: 'Rent designer bridal and evening gowns from Atelier Riman. 7-day premium rental includes dry cleaning and insurance. Perfect for your special occasion.' },
  { route: '/collection/accessories', title: 'Accessories | Atelier Riman', description: 'Veils, straps and couture finishing details, hand-made in our Sharjah atelier alongside every gown.' },
  { route: '/collection/jewelry', title: 'Fine Jewelry | Atelier Riman', description: 'Discover Atelier Riman\'s fine jewelry collection — handcrafted pieces that complement our bridal and evening couture. Gold, diamonds, and precious gems.' },
  { route: '/faq', title: 'FAQ | Atelier Riman', description: 'Find answers to common questions about Atelier Riman\'s bridal and evening wear, including sizing, rentals, alterations, and ordering.' },
  { route: '/alterations', title: 'Bespoke Alterations | Atelier Riman', description: 'Expert bespoke tailoring and alterations at our Sharjah atelier. From hem adjustments to complete gown restructuring by our master seamstresses.' },
  { route: '/gallery', title: 'Gallery | Atelier Riman', description: 'Browse our gallery of Atelier Riman creations — bridal gowns, evening wear, and editorial features from our Sharjah atelier.' },
  { route: '/style-quiz', title: 'Style Quiz | Atelier Riman', description: 'Discover your perfect bridal or evening silhouette with Atelier Riman\'s style consultation quiz. Find the gown that matches your vision.' },
  { route: '/appointment', title: 'Book Appointment | Atelier Riman', description: 'Schedule a private consultation at our Sharjah atelier. Experience our bridal and evening collections with personalised styling guidance.' },
  { route: '/timeline', title: 'Bridal Timeline | Atelier Riman', description: 'Plan your wedding journey with Atelier Riman\'s bridal concierge. From your first consultation to your final fitting — we guide every step.' },
  { route: '/wedding-checklist', title: 'Wedding Checklist | Atelier Riman', description: 'Your complete wedding planning checklist from Atelier Riman. Stay organised from engagement to your grand entrance.' },
  { route: '/privacy', title: 'Privacy Policy | Atelier Riman', description: 'Atelier Riman privacy policy — how we protect and handle your personal information.' },
  { route: '/terms', title: 'Terms & Conditions | Atelier Riman', description: 'Atelier Riman terms and conditions for purchases, rentals, and appointments.' },
];

/** Routes that must NEVER be prerendered or listed in the sitemap. */
export const PRIVATE_ROUTES = [
  '/admin', '/auth', '/profile', '/checkout', '/payment/success', '/payment/cancel',
  '/wishlist', '/search', '/demo-21st',
];

export function isPrivateRoute(route: string): boolean {
  return PRIVATE_ROUTES.some((p) => route === p || route.startsWith(p + '/'));
}

function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/+$/, '')}${path === '/' ? '/' : path}`;
}

/** Pass absolute URLs (CDN images) through untouched; prefix relative ones. */
export function resolveAssetUrl(siteUrl: string, src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return absoluteUrl(siteUrl, src.startsWith('/') ? src : `/${src}`);
}

export function buildPrerenderPages(siteUrl: string, products: SeedProduct[]): PrerenderPage[] {
  const pages: PrerenderPage[] = PUBLIC_STATIC_ROUTES.map((entry) => ({
    route: entry.route,
    title: entry.title,
    description: entry.description,
    ogType: 'website',
    canonical: absoluteUrl(siteUrl, entry.route),
    ogImage: absoluteUrl(siteUrl, '/og-cover.png'),
    jsonLd: entry.route === '/' ? siteSchemas(siteUrl) : [{
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(siteUrl, '/') }, ...(entry.route !== '/' ? [{ '@type': 'ListItem', position: 2, name: entry.title.split(' | ')[0], item: absoluteUrl(siteUrl, entry.route) }] : [])],
    }],
    bodyHtml: staticBody(entry.title.split(' | ')[0], entry.description, SITE_NAV),
  }));

  for (const product of products) {
    if (product.is_active === false) continue;
    const offers: Record<string, unknown>[] = [];
    const pushOffer = (name: string, price: number | undefined) => {
      if (!price || price <= 0) return;
      offers.push({ '@type': 'Offer', name, priceCurrency: 'AED', price, availability: 'https://schema.org/InStock', url: absoluteUrl(siteUrl, `/product/${product.id}`) });
    };
    const type = product.productType ?? 'sale';
    if (type === 'sale' || type === 'both') pushOffer('Purchase', product.salePrice);
    if (type === 'rent' || type === 'both') pushOffer('7-Day Rental', product.rentalPrice);

    const route = `/product/${product.id}`;
    const image = product.images?.[0] ? resolveAssetUrl(siteUrl, product.images[0]) : absoluteUrl(siteUrl, '/og-cover.png');
    pages.push({
      route,
      title: `${product.name} | Atelier Riman`,
      description: (product.description || `${product.name} — hand-finished couture from the Atelier Riman Sharjah atelier.`).slice(0, 300),
      ogType: 'product',
      canonical: absoluteUrl(siteUrl, route),
      ogImage: image,
      jsonLd: [{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || '',
        image,
        category: product.category || '',
        brand: { '@type': 'Brand', name: 'Atelier Riman' },
        offers: offers.length === 1 ? offers[0] : offers,
      }],
      bodyHtml: staticBody(product.name, product.description || '', [{ label: 'Back to the collection', href: '/collections' }], product.images?.[0]),
    });
  }

  return pages;
}

/** Business facts kept in sync with index.html and src/lib/seo.ts. */
export function siteSchemas(siteUrl: string): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: 'Atelier Riman',
      description: "Sharjah's premier bridal and evening couture house. Bespoke gowns, premium rentals, and fine jewelry.",
      url: absoluteUrl(siteUrl, '/'),
      image: absoluteUrl(siteUrl, '/og-cover.png'),
      telephone: '+971553730792',
      address: { '@type': 'PostalAddress', streetAddress: 'Al Zahra St', addressLocality: 'Sharjah', addressCountry: 'AE' },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '11:00',
        closes: '21:00',
      },
      sameAs: ['https://instagram.com/rimanfashion', 'https://facebook.com/rimanfashion'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Atelier Riman',
      url: absoluteUrl(siteUrl, '/'),
      inLanguage: ['en', 'ar'],
      publisher: { '@type': 'ClothingStore', name: 'Atelier Riman', '@id': `${absoluteUrl(siteUrl, '/')}#store` },
    },
  ];
}

/** Shared crawler navigation used inside prerendered bodies. */
const SITE_NAV = [
  { label: 'Collections', href: '/collections' },
  { label: 'Bridal', href: '/collection/bridal' },
  { label: 'Evening', href: '/collection/evening' },
  { label: 'Rentals', href: '/collection/rental' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
  { label: 'Book a private viewing', href: '/appointment' },
  { label: 'Contact', href: '/contact' },
];

function staticBody(title: string, description: string, links: { label: string; href: string }[], imageUrl?: string): string {
  const img = imageUrl
    ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" width="480" height="640" style="max-width:480px" />`
    : '';
  return [
    `<header class="prerender-shell" style="font-family:Georgia,serif;max-width:880px;margin:0 auto;padding:64px 24px;">`,
    `<p style="letter-spacing:0.3em;text-transform:uppercase;font-size:12px;">Atelier Riman — Sharjah</p>`,
    `<h1 style="font-size:40px;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(title)}</h1>`,
    `<p style="font-size:16px;line-height:1.7;">${escapeHtml(description)}</p>`,
    img,
    `<nav>${links.map(l => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`).join(' · ')}</nav>`,
    `</header>`,
  ].join('');
}

// ─── Sitemap & robots ────────────────────────────────────────────

export function buildSitemapXml(siteUrl: string, pages: PrerenderPage[], lastmod: string): string {
  const unique = [...new Set(pages.map(p => absoluteUrl(siteUrl, p.route)))].sort();
  const today = lastmod.slice(0, 10);
  const urls = unique
    .filter(u => !isPrivateRoute(new URL(u).pathname))
    .map(u => `  <url>\n    <loc>${xmlEscape(u)}</loc>\n    <lastmod>${xmlEscape(today)}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildRobotsTxt(siteUrl: string): string {
  const origin = siteUrl.replace(/\/+$/, '');
  return [
    'User-agent: *',
    'Allow: /',
    ...PRIVATE_ROUTES.filter(r => !['/search', '/wishlist'].includes(r)).map(r => `Disallow: ${r}`),
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');
}

// ─── index.html injection ────────────────────────────────────────

/** Replace the marked regions of the built index.html for a given route. */
export function injectPrerenderPage(html: string, page: PrerenderPage): string {
  let out = html;
  const setMeta = (selector: string, content: string) => {
    // selector like: meta[property="og:title"]
    const re = new RegExp(`(<${selector}[^>]*content=")[^"]*(")`);
    out = out.replace(re, (_m, pre, post) => `${pre}${attrEscape(content)}${post}`);
  };

  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  setMeta('meta name="description"', page.description);
  setMeta('meta property="og:title"', page.title);
  setMeta('meta property="og:description"', page.description);
  setMeta('meta property="og:type"', page.ogType);
  setMeta('meta property="og:url"', page.canonical);
  setMeta('meta property="og:image"', page.ogImage);
  setMeta('meta name="twitter:title"', page.title);
  setMeta('meta name="twitter:description"', page.description);
  setMeta('meta name="twitter:image"', page.ogImage);
  setMeta('meta name="robots"', 'index, follow');

  out = out.replace(
    /(<link rel="canonical"[^>]*href=")[^"]*(")/,
    (_m, pre, post) => `${pre}${attrEscape(page.canonical)}${post}`,
  );

  out = out.replace(
    /<!--prerender-jsonld-->[\s\S]*?<!--\/prerender-jsonld-->/,
    () => page.jsonLd.map(safeJsonLdScript).join('\n'),
  );

  out = out.replace(
    /<div id="root"><!--prerender-body-->[\s\S]*?<!--\/prerender-body--><\/div>/,
    () => `<div id="root"><!--prerender-body-->${page.bodyHtml}<!--/prerender-body--></div>`,
  );

  return out;
}

/** Escape a value for use inside a double-quoted HTML attribute. */
function attrEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** dist route → output file path. '/' keeps index.html at root. */
export function routeToOutputFile(route: string): string {
  if (route === '/') return 'index.html';
  if (isPrivateRoute(route)) throw new Error(`Refusing to prerender private route ${route}`);
  return `${route.replace(/^\/+/, '')}/index.html`;
}

/**
 * Resolve and VALIDATE the canonical site URL.
 *  - Production builds MUST have SITE_URL set to an absolute https:// URL —
 *    the build fails with a clear message otherwise (never silently skip SEO).
 *  - Dev / preview fall back to http://localhost:3001.
 */
export function resolveSiteUrl(env: Record<string, string | undefined>, command: 'build' | 'serve'): string {
  const raw = (env.SITE_URL || '').trim().replace(/\/+$/, '');
  if (command === 'build') {
    if (!raw) {
      throw new Error(
        'SITE_URL is required for production builds (e.g. SITE_URL=https://riman.ae npm run build). ' +
        'Set it in the environment or a .env.production file.',
      );
    }
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      throw new Error(`SITE_URL must be an absolute URL, got "${raw}" (e.g. https://riman.ae)`);
    }
    if (url.protocol !== 'https:') {
      throw new Error(`SITE_URL must be an https:// absolute URL, got "${raw}"`);
    }
    const pathPart = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '');
    return url.origin + pathPart;
  }
  return raw || 'http://localhost:3001';
}

