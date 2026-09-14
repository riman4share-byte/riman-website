import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { products } from './src/data/products';
import {
  buildPrerenderPages,
  buildRobotsTxt,
  buildSitemapXml,
  injectPrerenderPage,
  resolveSiteUrl,
  routeToOutputFile,
} from './vite/static';

function staticSeoPlugin(siteUrl: string): Plugin {
  let resolvedOutDir = 'dist';
  return {
    name: 'riman-static-seo',
    configResolved(config) {
      resolvedOutDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      // Root index.html: absolute placeholder URLs for the homepage shell.
      return html.replace(/%SITE_URL%/g, siteUrl);
    },
    closeBundle() {
      const indexPath = path.join(resolvedOutDir, 'index.html');
      const html = fs.readFileSync(indexPath, 'utf8');

      const pages = buildPrerenderPages(siteUrl, products as never[]);
      const lastmod = new Date().toISOString();

      fs.writeFileSync(path.join(resolvedOutDir, 'sitemap.xml'), buildSitemapXml(siteUrl, pages, lastmod), 'utf8');
      fs.writeFileSync(path.join(resolvedOutDir, 'robots.txt'), buildRobotsTxt(siteUrl), 'utf8');

      for (const page of pages) {
        const outFile = routeToOutputFile(page.route);
        const target = path.join(resolvedOutDir, ...outFile.split('/'));
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, injectPrerenderPage(html, page), 'utf8');
      }
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = resolveSiteUrl(env, command === 'build' ? 'build' : 'serve');

  return {
    plugins: [react(), tailwindcss(), staticSeoPlugin(siteUrl)],
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react', 'motion', 'date-fns'],
            recharts: ['recharts'],
            'model-viewer': ['@google/model-viewer'],
          },
        },
      },
    },
  };
});
