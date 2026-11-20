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
  expect(canonical).toBe(`https://abzar-tools.ir${route}${lang === 'en' ? '?lang=en' : ''}`);

  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', lang === 'fa' ? 'fa_IR' : 'en_US');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical!);
  await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveAttribute('href', `https://abzar-tools.ir${route}?lang=fa`);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `https://abzar-tools.ir${route}?lang=en`);
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', `https://abzar-tools.ir${route}`);

  const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(structuredData.length, `${slug} should expose structured data`).toBeGreaterThan(0);
  const schemas = structuredData.map(json => JSON.parse(json));
  for (const schema of schemas) {
    expect(schema.inLanguage, `${slug} ${lang} schema language`).toBe(lang);
  }
  const faq = schemas.find(schema => schema['@type'] === 'FAQPage');
  if (faq) {
    expect(faq.mainEntity.length).toBeGreaterThan(0);
    const faqText = JSON.stringify(faq.mainEntity);
    if (lang === 'en') expect(faqText).not.toMatch(/[\u0600-\u06FF]/);
    else expect(faqText).toMatch(/[\u0600-\u06FF]/);
  }
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


test('every sitemap entry resolves to a page with the same canonical URL', async ({ page }) => {
  test.setTimeout(120_000);
  const sitemapResponse = await page.request.get('/sitemap-0.xml');
  expect(sitemapResponse.ok()).toBeTruthy();
  const xml = await sitemapResponse.text();
  const urls = [...xml.matchAll(new RegExp('<loc>([^<]+)</loc>', 'g'))].map(match => match[1]);
  expect(urls.length).toBeGreaterThan(0);

  for (const url of urls) {
    const parsed = new URL(url);
    expect(parsed.origin).toBe('https://abzar-tools.ir');
    const response = await page.request.get(parsed.pathname);
    expect(response.status(), `Sitemap URL should resolve: ${url}`).toBe(200);
    const html = await response.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    expect(canonical?.[1], `Canonical should match sitemap URL: ${url}`).toBe(url);
  }
});


test('tool FAQ structured data matches the active language', async ({ page }) => {
  for (const lang of ['fa', 'en'] as const) {
    await page.goto(`/tools/word-counter/?lang=${lang}`);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faq = schemas.map(json => JSON.parse(json)).find(schema => schema['@type'] === 'FAQPage');
    expect(faq, `FAQPage should exist for ${lang}`).toBeTruthy();
    expect(faq.inLanguage).toBe(lang);
    const faqText = JSON.stringify(faq.mainEntity);
    if (lang === 'en') {
      expect(faqText).toContain('What does Word & Character Counter do?');
      expect(faqText).not.toMatch(/[\u0600-\u06FF]/);
    } else {
      expect(faqText).toContain('شمارش کلمات چگونه انجام می‌شود؟');
    }
  }
});

test('homepage WebSite structured data follows the selected locale', async ({ page }) => {
  for (const lang of ['fa', 'en'] as const) {
    await page.goto(`/?lang=${lang}`);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const website = schemas.map(json => JSON.parse(json)).find(schema => schema['@type'] === 'WebSite');
    expect(website).toBeTruthy();
    expect(website.inLanguage).toBe(lang);
    expect(website.name).toBe(lang === 'fa' ? 'ابزارهای آنلاین' : 'Online Tools');
  }
});


test('language toggle keeps structured data synchronized without reloading', async ({ page }) => {
  await page.goto('/tools/word-counter/?lang=en');
  const enSchema = page.locator('script[type="application/ld+json"][data-jsonld-lang="en"]');
  const faSchema = page.locator('script[type="application/json"][data-jsonld-lang="fa"]');
  await expect(enSchema).toHaveCount(3);
  await expect(faSchema).toHaveCount(3);

  await page.locator('[data-lang-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://abzar-tools.ir/tools/word-counter/');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://abzar-tools.ir/tools/word-counter/');

  await page.locator('[data-lang-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://abzar-tools.ir/tools/word-counter/?lang=en');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://abzar-tools.ir/tools/word-counter/?lang=en');
  await expect(page.locator('script[type="application/json"][data-jsonld-lang="fa"]')).toHaveCount(3);
  await expect(page.locator('script[type="application/ld+json"][data-jsonld-lang="en"]')).toHaveCount(3);
  const activeSchemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(activeSchemas.map(json => JSON.parse(json)).every(schema => schema.inLanguage === 'en')).toBeTruthy();
});
