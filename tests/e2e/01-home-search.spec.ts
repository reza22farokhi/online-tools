import { test, expect } from '@playwright/test';

test('home page loads and search filters tools', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ابزارهای آنلاین/);

  const searchBox = page.locator('#tool-search');
  await expect(searchBox).toBeVisible();

  await searchBox.fill('JSON');
  await page.waitForTimeout(300);

  const visibleCards = page.locator('#all-tools-grid .tool-card:visible');
  const count = await visibleCards.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(38);

  const titles = await visibleCards.allTextContents();
  const hasJson = titles.some(t => t.toLowerCase().includes('json'));
  expect(hasJson).toBe(true);
});

test('search shows no results message for gibberish', async ({ page }) => {
  await page.goto('/');
  await page.locator('#tool-search').fill('xyzzzzzz12345');
  await page.waitForTimeout(300);

  const noResults = page.locator('#no-results');
  await expect(noResults).toBeVisible();
});
