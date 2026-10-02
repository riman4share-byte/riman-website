/**
 * Stub Stripe gateway for the browser tests.
 *
 * Playwright's request interception is unreliable for same-origin `fetch` in
 * WebKit - the request reaches the dev server and 404s - so the tests point the
 * app at this real HTTP server instead. That behaves identically in every
 * engine and mirrors production more closely: a genuine network round trip.
 *
 * Behaviour is steered by identifiers the client actually sends, so tests stay
 * independent and parallel-safe without shared mutable state:
 *
 * POST /create-checkout   customerEmail fail@...   -> HTTP 500
 *                         customerEmail unpaid@... -> paid:false on verify
 * GET  /create-checkout   session_id contains      -> paid:false
 *                           "unpaid"
 *
 * Zero dependencies. Started automatically by Playwright (see webServer in
 * playwright.config.ts); not used by the app or by production builds.
 */

import { createServer } from 'node:http';

const PORT = Number(process.env.STUB_STRIPE_PORT || 3199);
const ORIGIN = `http://localhost:${PORT}`;

const json = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Cache-Control': 'no-store',
  });
  res.end(payload);
};

const server = createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    });
    return res.end();
  }

  const url = new URL(req.url || '/', ORIGIN);

  // Hosted Stripe page the app redirects to.
  if (url.pathname === '/hosted-checkout') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<!doctype html><html><head><title>Stripe (stub)</title></head><body><h1>Stripe test checkout</h1></body></html>');
  }

  if (url.pathname === '/create-checkout') {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => {
      const email = (() => {
        try { return JSON.parse(raw || '{}').customerEmail || ''; } catch { return ''; }
      })();

      if (email.startsWith('fail@')) {
        return json(res, 500, { message: 'Simulated gateway failure' });
      }
      if (email.startsWith('unpaid@')) {
        return json(res, 200, { paid: false });
      }

      if (req.method === 'GET') {
        // Session verification after the redirect back to /payment/success. The
        // client only sends the session id, so that is the control channel.
        const sessionId = url.searchParams.get('session_id') || '';
        if (sessionId.includes('unpaid') || email.startsWith('unpaid@')) {
          return json(res, 200, { paid: false });
        }
        return json(res, 200, {
          paid: true,
          orderId: 'order_test_1',
          customerEmail: email || 'amira@example.com',
        });
      }

      // Create session.
      return json(res, 200, {
        url: `${ORIGIN}/hosted-checkout`,
        orderId: 'order_test_1',
      });
    });
    return;
  }

  json(res, 404, { message: 'stub: not found' });
});

server.listen(PORT, () => {
  console.log(`[stub-stripe] listening on ${ORIGIN}`);
});