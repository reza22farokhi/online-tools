import { test, expect } from '@playwright/test';
import { registry } from '../../src/tools/registry';

for (const tool of registry) {
  test(`site doctor [tool:${tool.slug}] checks Persian and English pages`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    for (const route of [`/tools/${tool.slug}/`, `/en/tools/${tool.slug}/`]) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `${route} should return HTTP 200`).toBe(200);
      await expect(page.locator(`article[data-tool-slug="${tool.slug}"]`)).toBeVisible();
      await expect(page.locator('article h1')).toBeVisible();
      await expect(page.locator('article .tool-body')).toBeVisible();
      await expect(page.locator('.tool-privacy')).toBeVisible();
      expect(pageErrors, `${route} should not throw browser runtime errors`).toEqual([]);
      pageErrors.length = 0;
    }
  });
}
