import { test, expect } from '@playwright/test';

const pages = ['/', '/tools/json-formatter/', '/blog/word-count-guide/'];

test.describe('hreflang declarations', () => {
  for (const route of pages) {
    test(`${route} advertises only the available Persian language variant`, async ({ page }) => {
      await page.goto(route);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();

      await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveAttribute('href', canonical!);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', canonical!);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(0);
    });
  }
});
