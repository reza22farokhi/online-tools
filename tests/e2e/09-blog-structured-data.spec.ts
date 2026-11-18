import { test, expect } from '@playwright/test';

const blogSlugs = [
  'age-calculation-guide',
  'base64-guide',
  'best-online-tools-2026',
  'color-palette-guide',
  'color-palette-selection-guide',
  'color-picker-guide',
  'csv-to-json-guide',
  'date-calculation-guide',
  'date-conversion-guide',
  'hashing-vs-base64',
  'image-compression-guide',
  'image-formats-comparison',
  'image-optimization-guide',
  'json-guide',
  'jwt-security-guide',
  'mastering-date-and-time',
  'online-security-guide',
  'percentage-calculation-guide',
  'qr-code-guide',
  'regex-guide',
  'seo-meta-tags-guide',
  'slug-generation-guide',
  'strong-password-guide',
  'unit-converter-guide',
  'website-speed-optimization',
  'what-is-json-guide',
  'what-is-jwt-guide',
  'why-client-side-tools-matter',
  'word-count-guide',
];

test.describe('blog structured data', () => {
  for (const slug of blogSlugs) {
    test(`${slug} publishes one valid BlogPosting date`, async ({ page }) => {
      const response = await page.goto(`/blog/${slug}/`, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      const schemas = scripts.map((raw) => JSON.parse(raw));
      const articles = schemas.filter((schema) => schema['@type'] === 'BlogPosting');
      expect(articles).toHaveLength(1);
      expect(articles[0].datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      const faqCount = schemas.filter((schema) => schema['@type'] === 'FAQPage').length;
      const visibleFaqCount = await page.locator('.blog-faq').count();
      expect(faqCount).toBe(visibleFaqCount > 0 ? 1 : 0);
    });
  }
});
