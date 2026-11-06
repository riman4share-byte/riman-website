#!/usr/bin/env node
// Generates AVIF + WebP variants of every product image under public/assets
// so components can serve modern, smaller encodings behind a <picture>
// fallback chain. Originals are left untouched as the last-resort fallback.
//
// Usage:
//   node scripts/optimize-images.mjs        # generate all missing variants
//   node scripts/optimize-images.mjs --force # regenerate every variant

import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, '..', 'public', 'assets');

const force = process.argv.includes('--force');

// Target display widths for the responsive srcset ladder (px). We re-encode
// each image at a small set of widths so the browser can pick the closest
// fit instead of downloading a full-resolution asset for a 480px card.
const WIDTHS = [480, 800, 1200, 1600];
const AVIF_QUALITY = 45;
const WEBP_QUALITY = 80;

/** Recursively list .jpg/.jpeg/.png files under dir. */
async function walkImageFiles(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkImageFiles(full)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Swap a known image extension for `ext`, preserving a width-suffixed stem. */
function variantPath(original, width, ext) {
  const abs = path.dirname(original);
  const { name } = path.parse(original);
  const suffix = width ? `-w${width}` : '';
  return path.join(abs, `${name}${suffix}.${ext}`);
}

async function ensureVariant(original, width, format) {
  const target = variantPath(original, width, format);
  try {
    await fs.access(target);
    return { target, skipped: true };
  } catch {
    const pipeline = sharp(original).rotate();
    if (width) pipeline.resize({ width, withoutEnlargement: true });
    if (format === 'avif') {
      await pipeline.avif({ quality: AVIF_QUALITY, effort: 4 }).toFile(target);
    } else {
      await pipeline.webp({ quality: WEBP_QUALITY }).toFile(target);
    }
    return { target, skipped: false };
  }
}

function sizeOf(file) {
  return fs.stat(file).then((s) => s.size).catch(() => 0);
}

async function main() {
  if (force) {
    // Remove existing variants so a stale ladder is never served.
    for (const entry of await fs.readdir(ASSETS_DIR, { withFileTypes: true })) {
      if (!entry.isDirectory() && /-w\d+\.(avif|webp)$/.test(entry.name)) {
        await fs.unlink(path.join(ASSETS_DIR, entry.name)).catch(() => {});
      }
      if (entry.isDirectory() && /^assets-(avif|webp)/.test(entry.name)) {
        await fs.rm(path.join(ASSETS_DIR, entry.name), { recursive: true, force: true });
      }
    }
  }

  const originals = await walkImageFiles(ASSETS_DIR);
  if (originals.length === 0) {
    console.log('No source images found under public/assets — nothing to do.');
    return;
  }

  // Mirror the directory tree under public/assets/assets-avif and
  // public/assets/assets-webp. Keeping variants in their own folders means the
  // <img src> fallback can stay the untouched original .jpg, and a missing
  // variant degrades to that original rather than a 404.
  const roots = {
    avif: path.resolve(__dirname, '..', 'public', 'assets', 'assets-avif'),
    webp: path.resolve(__dirname, '..', 'public', 'assets', 'assets-webp'),
  };

  let created = 0;
  let skipped = 0;
  for (const original of originals) {
    const rel = path.relative(ASSETS_DIR, original);
    for (const width of [0, ...WIDTHS]) {
      for (const [format, root] of Object.entries(roots)) {
        const target = path.join(
          root,
          path.dirname(rel),
          width ? `${path.parse(rel).name}-w${width}.${format}` : path.parse(rel).name + '.' + format,
        );
        if (!force) {
          try {
            await fs.access(target);
            skipped += 1;
            continue;
          } catch {
            /* not present yet */
          }
        }
        await fs.mkdir(path.dirname(target), { recursive: true });
        const pipeline = sharp(original).rotate();
        if (width) pipeline.resize({ width, withoutEnlargement: true });
        if (format === 'avif') {
          await pipeline
            .clone()
            .avif({ quality: AVIF_QUALITY, effort: 4 })
            .toFile(target);
        } else {
          await pipeline
            .clone()
            .webp({ quality: WEBP_QUALITY })
            .toFile(target);
        }
        created += 1;
      }
    }
  }

  console.log(`Done. ${created} variants generated, ${skipped} up-to-date (source images: ${originals.length}).`);
  console.log('Variants live under public/assets/assets-avif and public/assets/assets-webp.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
