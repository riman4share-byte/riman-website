/*
 * Google Analytics bootstrap loaded as an external file so the page needs no
 * inline <script> (CSP: script-src has no 'unsafe-inline').
 * Usage: <script src="/ga-loader.js?id=G-XXXXXXXXXX" async></script>
 */
(function () {
  var script = document.currentScript;
  var id = script && new URL(script.src, location.href).searchParams.get('id');
  if (!id || !/^[A-Za-z0-9-]+$/.test(id)) return;
  // Already loaded (this file can be evaluated twice on client navigation).
  if (window.__gaLoadedId === id) return;
  window.__gaLoadedId = id;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { page_path: location.pathname + location.search });

  // This line was missing: without appending gtag/js the queue was pushed but
  // never drained to Google, so no hits were ever recorded.
  var lib = document.createElement('script');
  lib.async = true;
  lib.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(lib);
})();
