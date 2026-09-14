import { describe, expect, it } from 'vitest';
import {
  buildPrerenderPages,
  buildRobotsTxt,
  buildSitemapXml,
  escapeHtml,
  injectPrerenderPage,
  isPrivateRoute,
  resolveAssetUrl,
  resolveSiteUrl,
  routeToOutputFile,
  safeJsonLdScript,
  xmlEscape,
} from './static';

const SITE = 'https://riman.ae';

const seedProducts = [
  { id: '17', name: 'Aura Ballgown', description: 'Silk & crystal', images: ['/assets/aura.jpg'], category: 'bridal', salePrice: 18000, rentalPrice: 4500, productType: 'both', is_active: true },
  { id: '23', name: 'Noor Gown', description: '', images: ['https://cdn.example.com/noor.jpg'], category: 'evening', salePrice: 9500, productType: 'sale', is_active: true },
  { id: '99', name: 'Draft Piece', images: [], category: 'bridal', salePrice: 1, productType: 'sale', is_active: false },
];

function pages() {
  return buildPrerenderPages(SITE, seedProducts as never);
}

describe('xmlEscape / escapeHtml', () => {
  it('escapes XML special characters', () => {
    expect(xmlEscape(`a & b < c > d " e ' f`)).toBe('a &amp; b &lt; c &gt; d &quot; e &apos; f');
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });
});

describe('safeJsonLdScript', () => {
  it('escapes angle brackets so data cannot break out of the script element', () => {
    const html = safeJsonLdScript({ name: '</script><img src=x onerror=alert(1)>' });
    expect(html).not.toContain('</script><img');
    expect(html).toContain('\\u003c');
    expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
  });
});

describe('buildPrerenderPages', () => {
  it('covers every public route with absolute canonicals and no private routes', () => {
    const routes = pages().map((p) => p.route);
    expect(routes).toContain('/');
    for (const r of ['/about', '/collections', '/journal', '/collection/couture', '/privacy', '/terms']) {
      expect(routes).toContain(r);
    }
    expect(routes).not.toContain('/checkout');
    for (const p of pages()) {
      expect(p.canonical.startsWith(`${SITE}/`)).toBe(true);
      expect(isPrivateRoute(p.route)).toBe(false);
    }
  });

  it('prerenders active seeded products only, with absolute pass-through CDN images', () => {
    const routes = pages().map((p) => p.route);
    expect(routes).toContain('/product/17');
    expect(routes).toContain('/product/23');
    expect(routes).not.toContain('/product/99');
    const noor = pages().find((p) => p.route === '/product/23')!;
    expect(noor.ogImage).toBe('https://cdn.example.com/noor.jpg');
    const aura = pages().find((p) => p.route === '/product/17')!;
    expect(aura.ogImage).toBe(`${SITE}/assets/aura.jpg`);
  });

  it('escapes untrusted product text in prerendered body HTML', () => {
    const evil = buildPrerenderPages(SITE, [
      { id: 'x', name: '<img src=x onerror=alert(1)>', images: [], is_active: true },
    ] as never);
    const page = evil.find((p) => p.route === '/product/x')!;
    expect(page.bodyHtml).not.toContain('<img src=x');
    expect(page.bodyHtml).toContain('&lt;img');
  });
});

describe('buildSitemapXml', () => {
  it('dedupes, sorts, escapes and lists only absolute public URLs', () => {
    const xml = buildSitemapXml(SITE, [...pages(), ...pages()], '2026-09-14T10:00:00.000Z');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(new Set(locs).size).toBe(locs.length);
    expect(locs.every((l) => l.startsWith(`${SITE}/`))).toBe(true);
    expect(xml).not.toContain('/checkout');
    expect(xml).not.toContain('/admin');
    expect(xml).not.toContain('/search');
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<lastmod>2026-09-14</lastmod>');
  });

  it('escapes ampersands in URLs', () => {
    const page = pages().find((p) => p.route === '/');
    const xml = buildSitemapXml('https://ex.com/a&b', [page!], '2026-01-01T00:00:00.000Z');
    expect(xml).toContain('https://ex.com/a&amp;b/');
    expect(xml).not.toMatch(/a&b/);
  });
});

describe('buildRobotsTxt', () => {
  it('points at the absolute production sitemap and blocks private areas', () => {
    const txt = buildRobotsTxt(SITE);
    expect(txt).toContain('Sitemap: https://riman.ae/sitemap.xml');
    expect(txt).toContain('Disallow: /admin');
    expect(txt).toContain('Disallow: /payment/success');
    expect(txt).toContain('Disallow: /auth');
  });
});

describe('routeToOutputFile', () => {
  it('maps routes and refuses private routes', () => {
    expect(routeToOutputFile('/')).toBe('index.html');
    expect(routeToOutputFile('/about')).toBe('about/index.html');
    expect(routeToOutputFile('/product/17')).toBe('product/17/index.html');
    expect(() => routeToOutputFile('/admin')).toThrow(/private/i);
  });
});

describe('injectPrerenderPage', () => {
  const template = `<!doctype html><html lang="en"><head>
<title>Atelier Riman | Sharjah's Premier Bridal &amp; Evening Couture</title>
<meta name="description" content="Discover the zenith of Sharjah couture.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://riman.ae/" />
<meta property="og:title" content="Atelier Riman | Sharjah's Premier Bridal & Evening Couture">
<meta property="og:description" content="shell desc">
<meta property="og:type" content="website">
<meta property="og:url" content="https://riman.ae/">
<meta property="og:image" content="https://riman.ae/og-cover.png">
<meta name="twitter:title" content="Atelier Riman | Sharjah's Premier Bridal & Evening Couture">
<meta name="twitter:description" content="shell desc">
<meta name="twitter:image" content="https://riman.ae/og-cover.png">
<link rel="alternate" hreflang="en" href="https://riman.ae/" />
<!--prerender-jsonld--><script type="application/ld+json">{"a":1}</script><!--/prerender-jsonld-->
</head><body><div id="root"><!--prerender-body--><h1>shell</h1><!--/prerender-body--></div>
<script type="module" src="/assets/index.js"></script></body></html>`;

  it('rewrites title, metas, canonical, JSON-LD and body for a route page', () => {
    const about = pages().find((p) => p.route === '/about')!;
    const out = injectPrerenderPage(template, about);
    expect(out).toContain('<title>Our Story | Atelier Riman</title>');
    expect(out).toContain('<link rel="canonical" href="https://riman.ae/about" />');
    expect(out).toMatch(/property="og:url" content="https:\/\/riman\.ae\/about"/);
    expect(out).toContain(about.bodyHtml);
    expect(out).not.toContain('{"a":1}');
    expect(out).toContain('<script type="application/ld+json">');
    expect(out).toContain('BreadcrumbList');
    expect(out).toContain('<script type="module" src="/assets/index.js">');
    expect(out).not.toContain('prerender-jsonld');
  });

  it('keeps store + website schema on the home page', () => {
    const home = pages().find((p) => p.route === '/')!;
    const out = injectPrerenderPage(template, home);
    expect(out).toContain('ClothingStore');
    expect(out).toContain('"@type":"WebSite"');
    expect(out).toContain('Al Zahra St');
  });

  it('escapes quotes/ampersands in injected attribute content', () => {
    const page = { ...pages().find((p) => p.route === '/')!, title: 'A & B "C"', description: 'x "y" z' };
    const out = injectPrerenderPage(template, page);
    expect(out).toContain('A &amp; B &quot;C&quot;');
    expect(out).not.toMatch(/content="[^"]*"[^"]*"y/);
  });
});

describe('resolveSiteUrl', () => {
  it('fails production builds without a valid https SITE_URL', () => {
    expect(() => resolveSiteUrl({}, 'build')).toThrow(/SITE_URL is required/);
    expect(() => resolveSiteUrl({ SITE_URL: 'riman.ae' }, 'build')).toThrow(/absolute/);
    expect(() => resolveSiteUrl({ SITE_URL: 'http://riman.ae' }, 'build')).toThrow(/https/);
  });

  it('normalizes trailing slashes and subpaths', () => {
    expect(resolveSiteUrl({ SITE_URL: 'https://riman.ae/' }, 'build')).toBe('https://riman.ae');
    expect(resolveSiteUrl({ SITE_URL: 'https://shop.example.com/boutique/' }, 'build')).toBe('https://shop.example.com/boutique');
  });

  it('falls back to localhost in dev, honoring an explicit value', () => {
    expect(resolveSiteUrl({}, 'serve')).toBe('http://localhost:3001');
    expect(resolveSiteUrl({ SITE_URL: 'http://localhost:4000' }, 'serve')).toBe('http://localhost:4000');
  });
});

describe('resolveAssetUrl', () => {
  it('passes absolute URLs through and prefixes relative ones', () => {
    expect(resolveAssetUrl(SITE, 'https://x.y/a.jpg')).toBe('https://x.y/a.jpg');
    expect(resolveAssetUrl(SITE, '/a.jpg')).toBe(`${SITE}/a.jpg`);
    expect(resolveAssetUrl(`${SITE}/`, 'a.jpg')).toBe(`${SITE}/a.jpg`);
  });
});
