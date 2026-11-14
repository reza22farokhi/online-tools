import { test, expect } from '@playwright/test';

test('theme toggle switches dark/light', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const initial = await html.getAttribute('data-theme');
  await page.locator('[data-theme-toggle]').click();
  await page.waitForTimeout(200);
  const next = await html.getAttribute('data-theme');
  expect(next).not.toBe(initial);
});

test('language toggle switches fa/en', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const initial = await html.getAttribute('lang');
  await page.locator('[data-lang-toggle]').click();
  await page.waitForTimeout(200);
  const next = await html.getAttribute('lang');
  expect(next).not.toBe(initial);
  expect(['fa', 'en']).toContain(next);
});
