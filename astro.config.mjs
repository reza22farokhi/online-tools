import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'https://abzar-tools.ir';
const base = '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  // Preserve the HTML-aware whitespace behavior from Astro 5 during the v7 migration.
  compressHTML: true,
  build: {
    format: 'directory',
    inlineStylesheets: 'auto'
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/share-target') &&
        !page.includes('/offline')
    })
  ],
  vite: {
    build: {
      assetsInlineLimit: 2048
    }
  }
});
