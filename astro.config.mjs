import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'https://abzar-tools.ir';
const base = '/';

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
