import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';

const BASE = 'http://localhost:3001';
const EN_LINE = /^[A-Za-z][A-Za-z0-9 ,.&'\u2019\u2014-]{8,}$/;
const ALLOW = /(Riman|Atelier Riman|Maison de Couture|Stripe|WhatsApp|3D)/i;

const SEED_CART = [
  {
    id: 'sweep-seed-1',
    name: 'فستان تجريبي',
    description: 'seed',
    productType: 'sale',
    salePrice: 100,
    images: ['data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'],
    category: 'Evening Dress',
    style: [],
    color: [],
    sizes: [],
    quantity: 1,
    intent: 'sale',
  },
];

function out(s) {
  process.stdout.write(s + '\n');
}

async function waitForServer(url, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

function killTree(pid) {
  try {
    spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], { shell: false });
  } catch {
    /* best effort */
  }
}

const server = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'ignore' });
let exitCode = 0;

try {
  const up = await waitForServer(BASE);
  if (!up) {
    out('SERVER_FAIL: dev server did not come up on ' + BASE);
    exitCode = 2;
  } else {
    out('SERVER_UP: ' + BASE);

    const pagesToVisit = [
      { label: '/payment/cancel', path: '/payment/cancel', seedCart: false },
      { label: '/timeline', path: '/timeline', seedCart: false },
      { label: '/wedding-checklist', path: '/wedding-checklist', seedCart: false },
      { label: '/', path: '/', seedCart: false },
      { label: '/checkout (seeded)', path: '/checkout', seedCart: true },
    ];

    const browser = await chromium.launch();
    const results = [];
    let totalConsoleErrors = 0;
    const consoleDetails = [];

    for (const target of pagesToVisit) {
      const context = await browser.newContext();
      await context.addInitScript(seed => {
        localStorage.setItem('riman_lang', 'ar');
        if (seed) localStorage.setItem('riman_cart', JSON.stringify(seed));
      }, target.seedCart ? SEED_CART : null);

      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push('pageerror: ' + err.message));

      let offending = [];
      let trustOk = null;
      let errorText = null;

      try {
        await page.goto(BASE + target.path, { waitUntil: 'load', timeout: 60000 });
        try {
          await page.waitForLoadState('networkidle', { timeout: 15000 });
        } catch {
          /* keep going with what we have */
        }
        await page.waitForTimeout(800);

        const text = await page.evaluate(() => document.body.innerText);
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        offending = lines.filter(l => EN_LINE.test(l) && !ALLOW.test(l));

        if (target.seedCart) {
          trustOk = text.includes('\u0637\u0644\u0628 \u0622\u0645\u0646'); // 'طلب آمن'
        }
      } catch (e) {
        errorText = e.message;
      }

      totalConsoleErrors += consoleErrors.length;
      if (consoleErrors.length > 0) {
        consoleDetails.push({ page: target.label, errors: consoleErrors });
      }

      const pass =
        errorText === null && offending.length === 0 && (trustOk === null || trustOk === true);
      results.push({
        label: target.label,
        pass,
        offending,
        trustOk,
        errorText,
        consoleErrorCount: consoleErrors.length,
      });

      await context.close();
    }
    await browser.close();

    out('');
    for (const r of results) {
      const parts = [r.pass ? 'PASS' : 'FAIL', r.label];
      if (r.trustOk !== null) parts.push(`trust-box['\u0637\u0644\u0628 \u0622\u0645\u0646']=${r.trustOk ? 'OK' : 'MISSING'}`);
      if (r.errorText) parts.push(`nav-error=${r.errorText}`);
      out(parts.join('  '));
      for (const line of r.offending) out('   OFFENDING: ' + line);
    }

    out('');
    out(`CONSOLE_ERRORS_TOTAL: ${totalConsoleErrors}`);
    for (const cd of consoleDetails) {
      out(`  [${cd.page}]`);
      for (const e of cd.errors) out('    ' + e.slice(0, 300));
    }

    const allPass = results.every(r => r.pass);
    out('');
    out(allPass && totalConsoleErrors === 0 ? 'OVERALL: PASS' : 'OVERALL: FAIL');
    if (!allPass || totalConsoleErrors !== 0) exitCode = 1;
  }
} catch (e) {
  out('SCRIPT_ERROR: ' + (e && e.stack ? e.stack : String(e)));
  exitCode = 3;
} finally {
  killTree(server.pid);
}

process.exit(exitCode);
