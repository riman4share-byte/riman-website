import { chromium } from 'playwright';
import { spawn, execSync } from 'node:child_process';

const BASE = 'http://localhost:3001';
const PRODUCT_URL = `${BASE}/product/17`;
const results = [];

function record(name, pass, detail = '') {
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function waitForServer(url, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status > 0 && res.status < 500) return true;
    } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

function killServerTree(proc) {
  try { if (proc?.pid) execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' }); } catch { /* already gone */ }
}

async function checkLocale(browser, locale) {
  const errors = [];
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`); });
  page.on('pageerror', err => errors.push(`[pageerror] ${err.message}`));

  await page.addInitScript(l => localStorage.setItem('riman_lang', l), locale);
  await page.goto(PRODUCT_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('[role="grid"]').waitFor({ state: 'visible', timeout: 30000 });

  const tag = `[${locale}]`;

  // A1: exactly one roving-tabindex day button
  const zeroTabCount = await page.locator('[role="grid"] button[tabindex="0"]').count();
  record(`${tag} exactly one [role=grid] button[tabindex=0]`, zeroTabCount === 1, `count=${zeroTabCount}`);
  if (zeroTabCount !== 1) { await context.close(); return errors; }

  const initialDate = await page.locator('[role="grid"] button[tabindex="0"]').getAttribute('data-date');

  // Focus + keyboard interaction, then outline check (:focus-visible needs real key input)
  await page.locator('[role="grid"] button[tabindex="0"]').focus();
  await page.keyboard.press('ArrowRight');
  const after = await page.evaluate(() => ({
    date: document.activeElement?.getAttribute('data-date') ?? null,
    outline: document.activeElement ? getComputedStyle(document.activeElement).outlineStyle : null,
  }));

  // A2: non-none outline after keyboard focus
  record(`${tag} focused day cell has visible outline after keyboard focus`,
    !!after.outline && after.outline !== 'none', `outlineStyle=${after.outline}`);

  // A3: ArrowRight moved focus to a different day
  record(`${tag} ArrowRight moves focus (data-date changes)`,
    !!after.date && after.date !== initialDate, `${initialDate} -> ${after.date}`);

  // Walk FORWARD to a selectable day before Enter. RTL inverts horizontal
  // arrows (documented spec behaviour), so ArrowRight can land on a past,
  // aria-disabled day where Enter correctly declines to select.
  const forwardKey = locale === 'ar' ? 'ArrowLeft' : 'ArrowRight';
  let cursor = after.date ?? initialDate;
  for (let i = 0; i < 5 && cursor <= (initialDate ?? ''); i++) {
    await page.keyboard.press(forwardKey);
    cursor = await page.evaluate(() => document.activeElement?.getAttribute('data-date') ?? '');
  }

  // A4: Enter selects -> localized summary visible
  await page.keyboard.press('Enter');
  let summaryOk = false;
  let summaryText = '';
  try {
    const summary = page.getByTestId('rental-summary');
    await summary.waitFor({ state: 'visible', timeout: 10000 });
    summaryText = (await summary.innerText()).trim();
    const prefix = locale === 'ar' ? 'المحدد:' : 'Selected:';
    summaryOk = summaryText.toLowerCase().includes(prefix.toLowerCase());
    record(`${tag} Enter selects, rental-summary visible with "${prefix}"`, summaryOk, JSON.stringify(summaryText));
  } catch {
    record(`${tag} Enter selects, rental-summary visible`, false, 'summary never became visible');
  }

  // A5: shortcut button jumps and keeps summary visible
  const shortcutName = locale === 'ar' ? /أقرب تاريخ متاح/ : /next available date/i;
  try {
    await page.getByRole('button', { name: shortcutName }).click({ timeout: 10000 });
    await page.getByTestId('rental-summary').waitFor({ state: 'visible', timeout: 10000 });
    record(`${tag} shortcut button click keeps rental-summary visible`, true);
  } catch (e) {
    record(`${tag} shortcut button click keeps rental-summary visible`, false, String(e).slice(0, 200));
  }

  await context.close();
  return errors;
}

let server;
try {
  server = spawn('npm run dev', { shell: true, stdio: 'ignore', cwd: process.cwd() });
  const up = await waitForServer(BASE);
  if (!up) throw new Error(`dev server did not become ready at ${BASE} within 120s`);
  console.log(`dev server ready at ${BASE}\n`);

  const browser = await chromium.launch();

  const enErrors = await checkLocale(browser, 'en');
  const arErrors = await checkLocale(browser, 'ar');
  const allErrors = [...enErrors, ...arErrors];

  // A6: zero console/page errors across both locales
  record('[both locales] zero console/page errors', allErrors.length === 0,
    allErrors.length ? `${allErrors.length} error(s):\n  ${allErrors.join('\n  ')}` : 'clean');

  await browser.close();
} catch (e) {
  record('script setup', false, String(e));
} finally {
  killServerTree(server);
}

const passed = results.filter(Boolean).length;
const total = results.length;
console.log(`\nVERDICT: ${passed === total ? 'PASS' : 'FAIL'} (${passed}/${total} assertions passed)`);
process.exit(passed === total ? 0 : 1);
