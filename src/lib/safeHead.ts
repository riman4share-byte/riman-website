/**
 * Safe custom <head> manager.
 *
 * Admin-configured "custom head" markup is parsed with DOMParser and only a
 * strict allowlist of inert tags (meta / link) is recreated with
 * document.createElement + setAttribute. Nothing ever touches innerHTML, and
 * disallowed tags (script, style, iframe, object, embed, form, svg, base...)
 * are dropped entirely. Managed nodes are marked with `data-riman-custom-head="true"`
 * so they can be removed atomically when configuration changes or unmounts.
 */

const MANAGED_ATTR = 'data-riman-custom-head';

const ALLOWED_META_ATTRS = new Set(['name', 'property', 'content']);
const ALLOWED_LINK_ATTRS = new Set(['rel', 'href', 'hreflang']);

const ALLOWED_LINK_RELS: Record<string, { requires: string[]; optional: string[] }> = {
  canonical: { requires: ['href'], optional: [] },
  alternate: { requires: ['href', 'hreflang'], optional: [] },
  preconnect: { requires: ['href'], optional: [] },
  'dns-prefetch': { requires: ['href'], optional: [] },
};

const MAX_CONTENT_LENGTH = 2000;

/** HTTPS absolute URLs, or same-origin relative URLs beginning with a single slash. */
export function isSafeHeadUrl(raw: string | null): raw is string {
  if (!raw) return false;
  const value = raw.trim();
  if (!value) return false;
  if (value.startsWith('/')) {
    // reject protocol-relative ("//host") and backslash tricks ("/\host")
    return !value.startsWith('//') && !value.startsWith('/\\');
  }
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function hasOnlyAllowedAttributes(el: Element, allowed: Set<string>): boolean {
  for (const attr of Array.from(el.attributes)) {
    if (!allowed.has(attr.name.toLowerCase())) return false; // blocks on*, style, id, integrity...
  }
  return true;
}

/** Validate a parsed element; returns a clean element to inject, or null. */
export function sanitizeHeadElement(el: Element): HTMLElement | null {
  const tag = el.tagName.toLowerCase();

  if (tag === 'meta') {
    if (!hasOnlyAllowedAttributes(el, ALLOWED_META_ATTRS)) return null;
    const name = el.getAttribute('name');
    const property = el.getAttribute('property');
    const content = el.getAttribute('content');
    if ((!name && !property) || !content) return null;
    if (content.length > MAX_CONTENT_LENGTH) return null;
    const clean = document.createElement('meta');
    if (name) clean.setAttribute('name', name);
    if (property) clean.setAttribute('property', property);
    clean.setAttribute('content', content);
    return clean;
  }

  if (tag === 'link') {
    if (!hasOnlyAllowedAttributes(el, ALLOWED_LINK_ATTRS)) return null;
    const rel = (el.getAttribute('rel') || '').trim().toLowerCase();
    const spec = ALLOWED_LINK_RELS[rel];
    if (!spec) return null; // rejects stylesheet, import, prefetch, manifest, anything else
    const href = el.getAttribute('href');
    const hreflang = el.getAttribute('hreflang');
    if (!isSafeHeadUrl(href)) return null;
    if (rel === 'alternate' && !hreflang) return null;
    const clean = document.createElement('link');
    clean.setAttribute('rel', rel);
    clean.setAttribute('href', href as string);
    if (hreflang) clean.setAttribute('hreflang', hreflang);
    return clean;
  }

  // script, style, iframe, object, embed, form, svg, base, everything else → dropped
  return null;
}

/** Remove all previously managed custom-head nodes (incl. legacy innerHTML wrappers). */
export function clearSafeCustomHead(): void {
  document.head.querySelectorAll(`[${MANAGED_ATTR}]`).forEach((el) => el.remove());
  // Legacy nodes created by the old innerHTML implementation.
  document.getElementById('custom-head-code')?.remove();
  document.getElementById('riman-custom-head')?.remove();
}

/**
 * Parse admin-provided head markup and apply only the allowlisted, inert
 * elements directly to document.head. Previously managed nodes are removed
 * first. Never uses innerHTML on document.
 */
export function applySafeCustomHead(raw: string): void {
  clearSafeCustomHead();
  if (!raw || !raw.trim()) return;

  const doc = new DOMParser().parseFromString(raw, 'text/html');
  const candidates = [...doc.head.children, ...doc.body.children];

  for (const el of candidates) {
    const clean = sanitizeHeadElement(el);
    if (!clean) continue;
    clean.setAttribute(MANAGED_ATTR, 'true');
    document.head.appendChild(clean);
  }
}
