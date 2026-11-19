module.exports = {
  ci: {
    collect: {
      url: [
        'http://127.0.0.1:4321/?lang=fa',
        'http://127.0.0.1:4321/tools/word-counter/?lang=fa',
        'http://127.0.0.1:4321/tools/jwt-inspector/?lang=fa',
        'http://127.0.0.1:4321/tools/file-info/?lang=fa'
      ],
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
