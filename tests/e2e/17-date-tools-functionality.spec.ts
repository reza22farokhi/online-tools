import { test, expect } from '@playwright/test';

test('date converter converts both directions and keeps month names localized', async ({ page }) => {
  await page.goto('/tools/date-converter/?lang=en');
  await expect(page.locator('.date-col').first()).toContainText('Jalali to Gregorian');
  await page.locator('#j-year').fill('1403');
  await page.locator('#j-month').fill('1');
  await page.locator('#j-day').fill('1');
  await page.locator('#btn-to-g').click();
  await expect(page.locator('#result-g')).toContainText('2024 March 20');

  await page.locator('#g-year').fill('2024');
  await page.locator('#g-month').fill('3');
  await page.locator('#g-day').fill('20');
  await page.locator('#btn-to-j').click();
  await expect(page.locator('#result-j')).toContainText('1 Farvardin 1403');
  await expect(page.locator('.date-tool')).not.toContainText(/[\u0600-\u06FF]/);

  await page.locator('[data-lang-toggle]').first().click();
  await expect(page.locator('#result-j')).toContainText('1 فروردین 1403');
});

test('age calculator renders correct English results and validation', async ({ page }) => {
  await page.goto('/tools/age/?lang=en');
  await page.locator('#age-birth').fill('2000-01-01');
  await page.locator('#age-ref').fill('2020-01-01');
  await expect(page.locator('#age-results')).toBeVisible();
  await expect(page.locator('#age-main')).toHaveText('20 years, 0 months, 0 days');
  await expect(page.locator('.age-grid')).toContainText('Total days');
  await expect(page.locator('.age-grid')).not.toContainText(/[\u0600-\u06FF]/);

  await page.locator('#age-ref').fill('1999-01-01');
  await expect(page.locator('#age-error')).toContainText('Date of birth cannot be after the reference date.');
  await expect(page.locator('#age-results')).toBeHidden();
});

test('date difference calculator computes and localizes its result', async ({ page }) => {
  await page.goto('/tools/date-diff/?lang=en');
  await page.locator('#dd-from').fill('2024-01-01');
  await page.locator('#dd-to').fill('2024-01-11');
  await expect(page.locator('#dd-results')).toBeVisible();
  await expect(page.locator('#dd-main')).toContainText('10 days');
  await expect(page.locator('.dd-grid')).toContainText('Business days');
  await expect(page.locator('.dd-grid')).not.toContainText(/[\u0600-\u06FF]/);

  await page.locator('[data-lang-toggle]').first().click();
  await expect(page.locator('#dd-main')).toContainText('10 روز');
});
