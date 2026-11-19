import { test, expect } from '@playwright/test';

const toolSlugs = [
  'date-converter', 'password-generator', 'qr-code-generator', 'word-counter',
  'case-converter', 'remove-extra-spaces', 'line-sorter', 'remove-duplicates',
  'slug-generator', 'json-formatter', 'base64', 'html-escape', 'url-encoder',
  'uuid-generator', 'hash-generator', 'regex-tester', 'jwt-decoder', 'percentage',
  'age', 'date-diff', 'unit-converter', 'meta-tag-generator', 'serp-preview',
  'robots-txt-generator', 'og-preview', 'image-resizer', 'image-compressor',
  'format-converter', 'color-picker', 'file-info', 'file-to-base64',
  'palette-generator', 'gradient-generator', 'contrast-checker', 'box-shadow',
  'multi-calendar-converter', 'unix-timestamp', 'date-calculator', 'date-info',
  'csv-json-converter', 'text-diff', 'persian-text-refiner', 'jwt-inspector'
];

async function assertSeoMetadata(page: import('@playwright/test').Page, slug: string, lang: 'fa' | 'en') {
  const route = slug === 'home' ? '/' : `/tools/${slug}/`;
  await page.goto(`${route}?lang=${lang}`);
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
  await expect(page.locator('h1')).toHaveCount(1);

  const title = await page.title();
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(title.length, `${slug} ${lang} title length: ${title}`).toBeGreaterThanOrEqual(30);
  expect(title.length, `${slug} ${lang} title length: ${title}`).toBeLessThanOrEqual(60);
  expect(description?.length, `${slug} ${lang} description length`).toBeGreaterThanOrEqual(120);
  expect(description?.length, `${slug} ${lang} description length`).toBeLessThanOrEqual(155);

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBe(`https://abzar-tools.ir${route}`);

  const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(structuredData.length, `${slug} should expose structured data`).toBeGreaterThan(0);
  for (const json of structuredData) expect(() => JSON.parse(json)).not.toThrow();
}

test('homepage has valid Persian and English SEO metadata', async ({ page }) => {
  await assertSeoMetadata(page, 'home', 'fa');
  await assertSeoMetadata(page, 'home', 'en');
});

test('all registered tool pages and standalone JWT Inspector have valid Persian SEO metadata', async ({ page }) => {
  for (const slug of toolSlugs) await assertSeoMetadata(page, slug, 'fa');
});

test('all registered tool pages and standalone JWT Inspector have valid English SEO metadata', async ({ page }) => {
  for (const slug of toolSlugs) await assertSeoMetadata(page, slug, 'en');
});
