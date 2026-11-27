import { test, expect } from '@playwright/test';

test('CSV analyzer exposes advanced data-quality stats and local cleanup actions', async ({ page }) => {
  await page.goto('/tools/csv-analyzer/?lang=en');
  const input = page.locator('#csa-input');
  await input.fill('name,value\n Ada ,1\nAda,1\n,\n,2\nGrace,3');
  await page.locator('#csa-analyze').click();

  await expect(page.locator('#csa-stats')).toContainText('25.0%');
  await expect(page.locator('#csa-stats')).toContainText('number');
  await expect(page.locator('#csa-stats')).toContainText('Q1');

  await page.locator('#csa-trim').click();
  await expect(page.locator('#csa-summary div').nth(3).locator('strong')).toHaveText('1');
  await page.locator('#csa-deduplicate').click();
  await expect(page.locator('#csa-summary div').nth(3).locator('strong')).toHaveText('0');
  await expect(page.locator('#csa-summary div').nth(0).locator('strong')).toHaveText('4');

  await page.locator('#csa-remove-empty').click();
  await expect(page.locator('#csa-summary div').nth(0).locator('strong')).toHaveText('3');

  await input.fill('name,value\nAda,\nGrace,3');
  await page.locator('#csa-analyze').click();
  await page.locator('#csa-fill-value').fill('N/A');
  await page.locator('#csa-fill').click();
  expect(await input.inputValue()).toContain('N/A');
});
