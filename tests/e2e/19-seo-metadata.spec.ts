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
  const baseRoute = slug === 'home' ? '/' : `/tools/${slug}/`;
  const route = lang === 'en' ? `/en${baseRoute}` : baseRoute;
  await page.goto(route);
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
  await expect(page.locator('html')).toHaveAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', lang === 'fa' ? 'fa_IR' : 'en_US');
  await expect(page.locator('h1')).toHaveCount(1);

  const title = await page.title();
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(title.length, `${slug} ${lang} title length: ${title}`).toBeGreaterThanOrEqual(30);
  expect(title.length, `${slug} ${lang} title length: ${title}`).toBeLessThanOrEqual(60);
  expect(description?.length, `${slug} ${lang} description length`).toBeGreaterThanOrEqual(120);
  expect(description?.length, `${slug} ${lang} description length`).toBeLessThanOrEqual(155);

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBe(`https://abzar-tools.ir${route}`);
  await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveAttribute('href', `https://abzar-tools.ir${baseRoute}`);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `https://abzar-tools.ir/en${baseRoute}`);

  const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(structuredData.length, `${slug} should expose structured data`).toBeGreaterThan(0);
  const parsedStructuredData = structuredData.map(json => JSON.parse(json) as { inLanguage?: string });
  expect(
    parsedStructuredData.some(item => item.inLanguage === lang),
    `${slug} should expose a locale-matched structured-data entity`
  ).toBe(true);
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

test('English informational and category routes are statically localized', async ({ page }) => {
  const routes = ['/en/tools/', '/en/blog/', '/en/about/', '/en/privacy/', '/en/contact/', '/en/categories/text/', '/en/blog/base64-guide/'];
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`https://abzar-tools.ir${route}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveAttribute('href', `https://abzar-tools.ir${route.replace('/en', '')}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `https://abzar-tools.ir${route}`);
  }
});

test('legacy language query links redirect to static locale routes', async ({ page }) => {
  await page.goto('/?lang=en');
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});


test('English static HTML contains localized metadata before JavaScript runs', async ({ page }) => {
  const response = await page.request.get('/en/tools/word-counter/');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('<html lang="en" dir="ltr">');
  expect(html).toContain('href="https://abzar-tools.ir/en/tools/word-counter/"');
  expect(html).toContain('hreflang="en"');
  expect(html).toContain('content="en_US"');
  expect(html).toContain('Frequently asked questions');
  expect(html).not.toContain('سوالات متداول');
  expect(html).toContain('href="/en/"');
});

test('legacy language query URLs redirect to crawlable locale paths', async ({ page }) => {
  await page.goto('/tools/word-counter/?lang=en');
  await expect(page).toHaveURL(/\/en\/tools\/word-counter\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
