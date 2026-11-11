import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// برای GitHub Pages زیرمسیر:
//   SITE_URL=https://user.github.io BASE_PATH=/repo/ npm run build
// برای دامنه اصلی:
//   SITE_URL=https://example.com npm run build
const site = process.env.SITE_URL || 'https://example.com';
const base = process.env.BASE_PATH || '/';

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
      filter: (page) => !page.includes('/404')
    })
  ],
  vite: {
    build: {
      assetsInlineLimit: 2048
    }
  }
});
