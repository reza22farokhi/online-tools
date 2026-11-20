const fs = require('node:fs');
const path = require('node:path');

const origin = 'http://127.0.0.1:4321';
const toolsDirectory = path.join(__dirname, 'dist', 'tools');

if (!fs.existsSync(toolsDirectory)) {
  throw new Error('Lighthouse route discovery failed: dist/tools does not exist. Build the site before running LHCI.');
}

const toolRoutes = fs.readdirSync(toolsDirectory, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .filter(slug => fs.existsSync(path.join(toolsDirectory, slug, 'index.html')))
  .sort();

if (toolRoutes.length < 43) {
  throw new Error(`Expected at least 43 built tool routes, found ${toolRoutes.length}. Check the Astro build output.`);
}

if (!toolRoutes.includes('jwt-inspector')) {
  throw new Error('The standalone JWT Inspector route is missing from the built site.');
}

const urls = [
  `${origin}/?lang=fa`,
  ...toolRoutes.map(slug => `${origin}/tools/${slug}/?lang=fa`)
];

module.exports = {
  ci: {
    collect: {
      // Discover every built tool page, including standalone routes, instead
      // of maintaining a fragile hand-written sample of URLs.
      url: urls,
      numberOfRuns: 1,
      settings: {
        throttlingMethod: 'simulate',
        chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': ['error', { minScore: 1 }],
        'label-content-name-mismatch': ['error', { minScore: 1 }],
        'categories:best-practices': ['warn', { minScore: 0.90 }],
        'categories:seo': ['warn', { minScore: 0.90 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.10 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports'
    }
  }
};
