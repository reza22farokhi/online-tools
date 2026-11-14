import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// برای GitHub Pages زیرمسیر:
//   SITE_URL=https://user.github.io BASE_PATH=/repo/ npm run build
// برای دامنه اصلی:
//   SITE_URL=https://example.com npm run build
const site = process.env.SITE_URL || 'https://abzar-tools.ir';
const isDev = process.env.NODE_ENV !== 'production';
const base = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH : '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
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
