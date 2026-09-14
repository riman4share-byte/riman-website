import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/sentry';
import { reloadForFreshChunks } from './lib/lazyWithRetry';

initSentry();

// Stale-deploy recovery: hashed chunks that 404 after a new release trigger
// Vite preload errors; reload once to pick up the fresh index.html.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  reloadForFreshChunks();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);