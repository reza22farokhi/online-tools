import { test, expect } from '@playwright/test';
import { registry, categories, getToolsByCategory } from '../../src/tools/registry';

// Registry-driven contract: every newly registered tool is automatically required
// to provide both localized pages and a usable interactive surface.
for (const tool of registry) {
  test(`site doctor [tool:${tool.slug}] validates localized pages and interaction surface`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    for (const route of [`/tools/${tool.slug}/`, `/en/tools/${tool.slug}/`]) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `${route} should return HTTP 200`).toBe(200);
      const article = page.locator(`article[data-tool-slug="${tool.slug}"]`);
      await expect(article).toBeVisible();
      await expect(article.locator('h1')).toBeVisible();
      await expect(article.locator('.tool-body')).toBeVisible();
      await expect(article.locator('.tool-privacy')).toBeVisible();

      const controls = article.locator('.tool-body input:not([type="hidden"]), .tool-body textarea, .tool-body select, .tool-body button');
      expect(await controls.count(), `${tool.slug} must expose at least one interactive control`).toBeGreaterThan(0);
      await expect(controls.first()).toBeVisible();
      expect(pageErrors, `${route} should not throw browser runtime errors`).toEqual([]);
      pageErrors.length = 0;
    }
  });
}

// Category discovery is also registry-driven; adding a category automatically
// adds both locale checks without maintaining a second static list.
for (const category of categories) {
  test(`site doctor [category:${category.slug}] validates category page`, async ({ page }) => {
    const expectedTools = getToolsByCategory(category.slug);
    expect(expectedTools.length, `${category.slug} must not be an empty category`).toBeGreaterThan(0);

    for (const route of [`/categories/${category.slug}/`, `/en/categories/${category.slug}/`]) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `${route} should return HTTP 200`).toBe(200);
      await expect(page.locator('main h1, .container h1').first()).toBeVisible();
      for (const tool of expectedTools) {
        await expect(page.locator(`a[href*="/tools/${tool.slug}/"]`).first(), `${tool.slug} should be listed in ${category.slug}`).toBeVisible();
      }
    }
  });
}
