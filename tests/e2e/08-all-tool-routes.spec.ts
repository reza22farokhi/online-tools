import { test, expect } from '@playwright/test';
import { registry } from '../../src/tools/registry';

test.describe('registered tool route smoke tests', () => {
  for (const tool of registry) {
    test(`/${tool.slug}/ loads with a primary heading`, async ({ page }) => {
      const response = await page.goto(`/tools/${tool.slug}/`, { waitUntil: 'domcontentloaded' });
      expect(response, `No document response for ${tool.slug}`).not.toBeNull();
      expect(response!.status(), `Unexpected HTTP status for ${tool.slug}`).toBe(200);
      await expect(page.locator('main h1').first(), `Missing H1 for ${tool.slug}`).toBeVisible();
      await expect(page).toHaveTitle(/.+/);
    });
  }
});
