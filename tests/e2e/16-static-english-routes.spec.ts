import { test, expect } from '@playwright/test';

const origin = 'https://abzar-tools.ir';

test('static English homepage is fully localized and has reciprocal SEO URLs', async ({ page }) => {
  const response = await page.goto('/en/');
  expect(response?.status()).toBe(200);

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page).toHaveTitle('Professional Online Tools | Text, Code, SEO & Images');
  await expect(page.locator('h1').first()).toHaveText('Professional Online Tools');
  await expect(page.locator('#tool-search')).toHaveAttribute('placeholder', 'Search tools...');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + '/en/');
  await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveAttribute('href', origin + '/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', origin + '/en/');
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', origin + '/');

  const internalLinks = await page.locator('a[href^="/"]').evaluateAll(links =>
    links.map(link => (link as HTMLAnchorElement).getAttribute('href') || '')
      .filter(href => !href.startsWith('/en/') && !href.startsWith('#'))
  );
  expect(internalLinks).toEqual([]);
});

test('static English tool route renders English UI, hides Persian FAQ, and exposes localized SEO URLs', async ({ page }) => {
  const response = await page.goto('/en/tools/word-counter/');
  expect(response?.status()).toBe(200);

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page).toHaveTitle('Free Word & Character Counter Online | Text Counting Tool');
  await expect(page.locator('article h1').first()).toHaveText('Word & Character Counter');
  await expect(page.locator('#wc-input')).toHaveAttribute('placeholder', 'Maximum 1 million characters. Processed locally and never sent to the server.');
  await expect(page.locator('.tool-faq[data-lang-only="en"]')).toBeVisible();
  await expect(page.locator('.tool-faq[data-lang-only="en"]')).toContainText('How are words counted?');
  await expect(page.locator('.tool-faq[data-lang-only="fa"]')).toBeHidden();

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + '/en/tools/word-counter/');
  await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveAttribute('href', origin + '/tools/word-counter/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', origin + '/en/tools/word-counter/');
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', origin + '/tools/word-counter/');

  const internalLinks = await page.locator('a[href^="/"]').evaluateAll(links =>
    links.map(link => (link as HTMLAnchorElement).getAttribute('href') || '')
      .filter(href => !href.startsWith('/en/') && !href.startsWith('#'))
  );
  expect(internalLinks).toEqual([]);
});
