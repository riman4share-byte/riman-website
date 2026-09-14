import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { applySafeCustomHead, clearSafeCustomHead, isSafeHeadUrl, sanitizeHeadElement } from './safeHead';

const managed = () => document.head.querySelectorAll('[data-riman-custom-head="true"]');

beforeEach(() => {
  clearSafeCustomHead();
});

afterEach(() => {
  clearSafeCustomHead();
});

describe('applySafeCustomHead — injection resistance', () => {
  it('drops script tags entirely (stored XSS attempt)', () => {
    applySafeCustomHead('<script>window.__pwned = true</script><meta name="description" content="ok">');
    expect(document.head.querySelector('script[src], script:not([type])')).toBeNull();
    expect((window as any).__pwned).toBeUndefined();
    expect(managed().length).toBe(1);
    expect(managed()[0].getAttribute('content')).toBe('ok');
  });

  it('drops event handler attributes and the element carrying them', () => {
    applySafeCustomHead('<meta name="x" content="y" onclick="alert(1)"><link rel="canonical" href="https://e.com/a" onerror="alert(1)">');
    expect(document.querySelector('meta[onclick]')).toBeNull();
    expect(document.querySelector('link[onerror]')).toBeNull();
    expect(managed().length).toBe(0);
  });

  it('rejects javascript:, data:, blob: and http: URLs on links', () => {
    applySafeCustomHead([
      '<link rel="canonical" href="javascript:alert(1)">',
      '<link rel="canonical" href="data:text/html;base64,PHNjcmlwdD4=">',
      '<link rel="preconnect" href="blob:https://e.com/abc">',
      '<link rel="canonical" href="http://plain-text-ssl.com/">',
      '<link rel="preconnect" href="//protocol-relative.com">',
    ].join(''));
    expect(managed().length).toBe(0);
  });

  it('drops SVG, iframe, object, embed, form, style and base payloads', () => {
    applySafeCustomHead(`
      <svg><script>alert(1)</script></svg>
      <iframe src="https://evil.example"></iframe>
      <object data="x"></object>
      <embed src="x">
      <form action="https://evil.example"><input name="a"></form>
      <style>body{display:none}</style>
      <base href="https://evil.example">
    `);
    expect(managed().length).toBe(0);
    expect(document.head.querySelector('svg, iframe, object, embed, form, style, base')).toBeNull();
  });

  it('survives malformed markup without throwing', () => {
    expect(() => applySafeCustomHead('<<<meta name="broken" content=><link rel=canonical href=')).not.toThrow();
    expect(() => applySafeCustomHead('<meta name="x"><div class="y"><p>text</p>')).not.toThrow();
    expect(managed().length).toBe(0);
  });

  it('rejects unknown link rels and unlisted attributes', () => {
    applySafeCustomHead('<link rel="stylesheet" href="https://e.com/a.css"><meta name="a" content="b" id="x">');
    expect(managed().length).toBe(0);
  });
});

describe('applySafeCustomHead — allowlist', () => {
  it('applies valid meta and link elements to document.head directly', () => {
    applySafeCustomHead(`
      <meta name="referrer" content="no-referrer">
      <meta property="og:video" content="https://e.com/v.mp4">
      <link rel="canonical" href="https://e.com/page">
      <link rel="alternate" hreflang="ar" href="https://e.com/ar/page">
      <link rel="preconnect" href="https://fonts.e.com">
      <link rel="dns-prefetch" href="/static">
      <meta name="a" content="b"><meta name="c" content="d">
    `);
    expect(managed().length).toBe(8);
    const tags = Array.from(managed()).map((el) => el.tagName.toLowerCase());
    expect(tags.every((t) => t === 'meta' || t === 'link')).toBe(true);
    // added to document.head itself, not inside a wrapper div
    expect(document.head.querySelector('div')).toBeNull();
  });

  it('meta without content or without name/property is rejected', () => {
    applySafeCustomHead('<meta name="x"><meta content="y"><meta charset="utf-8">');
    expect(managed().length).toBe(0);
  });

  it('alternate links require hreflang', () => {
    applySafeCustomHead('<link rel="alternate" href="https://e.com/x">');
    expect(managed().length).toBe(0);
  });

  it('replaces previous configuration (no duplicates)', () => {
    applySafeCustomHead('<meta name="a" content="1">');
    applySafeCustomHead('<meta name="b" content="2"><meta name="a" content="1">');
    expect(managed().length).toBe(2);
  });

  it('clearSafeCustomHead removes only managed nodes', () => {
    const preexisting = document.createElement('meta');
    preexisting.setAttribute('name', 'static-meta');
    preexisting.setAttribute('content', 'keep me');
    document.head.appendChild(preexisting);
    applySafeCustomHead('<meta name="dyn" content="x">');
    clearSafeCustomHead();
    expect(managed().length).toBe(0);
    expect(document.querySelector('meta[name="static-meta"]')).not.toBeNull();
    preexisting.remove();
  });
});

describe('isSafeHeadUrl', () => {
  it('accepts https and same-origin relative URLs', () => {
    expect(isSafeHeadUrl('https://riman.ae/sitemap.xml')).toBe(true);
    expect(isSafeHeadUrl('/collection/bridal')).toBe(true);
    expect(isSafeHeadUrl('/a?b=1#c')).toBe(true);
  });

  it('rejects everything else', () => {
    expect(isSafeHeadUrl('http://riman.ae')).toBe(false);
    expect(isSafeHeadUrl('//cdn.example')).toBe(false);
    expect(isSafeHeadUrl('/\\evil.example')).toBe(false);
    expect(isSafeHeadUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeHeadUrl('')).toBe(false);
    expect(isSafeHeadUrl(null)).toBe(false);
  });
});

describe('sanitizeHeadElement', () => {
  it('normalizes attribute casing in rel matching', () => {
    const doc = new DOMParser().parseFromString('<link rel="CANONICAL" href="https://e.com/x">', 'text/html');
    const clean = sanitizeHeadElement(doc.head.children[0] || doc.body.children[0]);
    expect(clean?.getAttribute('rel')).toBe('canonical');
  });
});
