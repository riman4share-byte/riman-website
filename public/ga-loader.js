/*
 * Google Analytics bootstrap loaded as an external file so the page needs no
 * inline <script> (CSP: script-src has no 'unsafe-inline').
 * Usage: <script src="/ga-loader.js?id=G-XXXXXXXXXX" async></script>
 */
(function () {
  var script = document.currentScript;
  var id = script && new URL(script.src, location.href).searchParams.get('id');
  if (!id || !/^[A-Za-z0-9-]+$/.test(id)) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { page_path: location.pathname + location.search });
})();
