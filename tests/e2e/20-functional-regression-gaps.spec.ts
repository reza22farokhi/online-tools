import { test, expect } from '@playwright/test';

test('word counter calculates live statistics and resets every metric', async ({ page }) => {
  await page.goto('/tools/word-counter/?lang=en');

  const input = page.locator('#wc-input');
  await input.fill('Hello world.\nSecond line!');

  await expect(page.locator('#stat-words')).toHaveText('4');
  await expect(page.locator('#stat-chars')).toHaveText('25');
  await expect(page.locator('#stat-chars-nospace')).toHaveText('23');
  await expect(page.locator('#stat-sentences')).toHaveText('2');
  await expect(page.locator('#stat-lines')).toHaveText('2');
  await expect(page.locator('#stat-paragraphs')).toHaveText('1');
  await expect(page.locator('#stat-reading')).toHaveText('1');
  await expect(page.locator('#wc-copy')).toBeEnabled();

  await page.locator('#wc-clear').click();
  await expect(input).toHaveValue('');
  await expect(page.locator('#stat-words')).toHaveText('0');
  await expect(page.locator('#stat-chars')).toHaveText('0');
  await expect(page.locator('#stat-sentences')).toHaveText('0');
  await expect(page.locator('#wc-copy')).toBeDisabled();
});

test('date calculator adds and subtracts days with deterministic Gregorian results', async ({ page }) => {
  await page.goto('/tools/date-calculator/?lang=fa');

  await page.locator('#dc-base').fill('1403/01/01');
  await page.locator('#dc-amount').fill('30');
  await page.locator('#dc-unit').selectOption('days');
  await page.locator('#dc-op').selectOption('add');
  await page.locator('#dc-calc').click();

  await expect(page.locator('#dc-results')).toBeVisible();
  await expect(page.locator('#dc-g')).toHaveText('2024-04-19');
  await expect(page.locator('#dc-j')).toContainText('1403');

  await page.locator('#dc-op').selectOption('sub');
  await page.locator('#dc-calc').click();
  await expect(page.locator('#dc-g')).toHaveText('2024-02-19');

  await page.locator('#dc-base').fill('not-a-date');
  await page.locator('#dc-calc').click();
  await expect(page.locator('#dc-error')).toBeVisible();
  await expect(page.locator('#dc-results')).toBeHidden();
});

test('multi-calendar converter converts Jalali and Gregorian dates and clears stale results on invalid input', async ({ page }) => {
  await page.goto('/tools/multi-calendar-converter/?lang=fa');

  await expect(page.locator('#mcc-results')).toBeVisible();
  await expect(page.locator('#mcc-gregorian-val')).toContainText('2024-03-20');
  await expect(page.locator('#mcc-jalali-val')).toContainText('1403/01/01');

  await page.locator('.mcc-tab[data-source="gregorian"]').click();
  await page.locator('#mcc-year').fill('2024');
  await page.locator('#mcc-month').selectOption('3');
  await page.locator('#mcc-day').fill('20');
  await page.locator('#mcc-convert').click();

  await expect(page.locator('#mcc-results')).toBeVisible();
  await expect(page.locator('#mcc-jalali-val')).toContainText('1403/01/01');
  await expect(page.locator('#mcc-gregorian-val')).toContainText('2024-03-20');

  await page.locator('#mcc-year').fill('');
  await page.locator('#mcc-convert').click();
  await expect(page.locator('#mcc-error')).toBeVisible();
  await expect(page.locator('#mcc-results')).toBeHidden();
});
