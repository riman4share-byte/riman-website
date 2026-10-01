import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Guards the failure mode where a translation key is added to one language
// block only, or an English value is written into the Arabic block. Both ship
// silently: the key falls back to its own name (or the visitor sees English on
// an Arabic-first page).

const source = readFileSync(resolve(__dirname, '../contexts/LanguageContext.tsx'), 'utf8');

function block(name: string): string {
  const key = `${name}: {`;
  const start = source.indexOf(key);
  if (start === -1) throw new Error(`could not find the ${name} block`);
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) return source.slice(braceStart, i);
    }
  }
  throw new Error(`unbalanced ${name} block`);
}

function entries(name: string): Map<string, string> {
  const map = new Map<string, string>();
  const entry = /^\s*'((?:[^'\\]|\\.)+)'\s*:\s*(.+?),?\s*$/;
  for (const line of block(name).split(/\r?\n/)) {
    const m = line.match(entry);
    if (!m) continue;
    let value: unknown;
    try {
      value = new Function(`return (${m[2]})`)();
    } catch {
      continue;
    }
    if (typeof value === 'string') map.set(m[1], value);
  }
  return map;
}

const en = entries('en');
const ar = entries('ar');

describe('translation dictionaries', () => {
  it('parses a substantial number of keys from both blocks', () => {
    expect(en.size).toBeGreaterThan(500);
    expect(ar.size).toBeGreaterThan(500);
  });

  it('defines exactly the same keys in both languages', () => {
    const missingInAr = [...en.keys()].filter((k) => !ar.has(k));
    const missingInEn = [...ar.keys()].filter((k) => !en.has(k));
    expect({ missingInAr, missingInEn }).toEqual({ missingInAr: [], missingInEn: [] });
  });

  it('has no empty values', () => {
    const empty = [
      ...[...en].filter(([, v]) => v.trim() === '').map(([k]) => `en:${k}`),
      ...[...ar].filter(([, v]) => v.trim() === '').map(([k]) => `ar:${k}`),
    ];
    expect(empty).toEqual([]);
  });

  it('has no untranslated English left in the Arabic block', () => {
    // Brand names, emails and URLs legitimately stay Latin. Anything long
    // enough to be a sentence should contain Arabic script.
    const allowList = /@|https?:|Riman|Atelier|AED|Sharjah|Dubai|Instagram|WhatsApp|PDF|FAQ|AI/i;
    const offenders = [...ar]
      .filter(([, value]) => value.length >= 25 && !/[\u0600-\u06FF]/.test(value))
      .filter(([, value]) => !allowList.test(value))
      .map(([key, value]) => `${key} = ${value.slice(0, 60)}`);
    expect(offenders).toEqual([]);
  });
});