import { test, expect } from '@playwright/test';

test('unit converter calculates length and temperature conversions in English', async ({ page }) => {
  await page.goto('/tools/unit-converter/?lang=en');

  await expect(page.locator('label[for="uc-cat"]')).toContainText('Category');
  await page.locator('#uc-value').fill('1000');
  await page.locator('#uc-from').selectOption('mm');
  await page.locator('#uc-to').selectOption('cm');
  await expect(page.locator('#uc-result')).toHaveValue('100');

  await page.locator('#uc-cat').selectOption('temperature');
  await page.locator('#uc-value').fill('0');
  await page.locator('#uc-from').selectOption('c');
  await page.locator('#uc-to').selectOption('f');
  await expect(page.locator('#uc-result')).toHaveValue('32');
  await expect(page.locator('#uc-from option[value="c"]')).toHaveText('Celsius (°C)');
});

test('file info reads local metadata and calculates the expected SHA-256 digest', async ({ page }) => {
  await page.goto('/tools/file-info/?lang=en');
  await page.locator('#fi-file').setInputFiles({
    name: 'file-info-e2e.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('hello')
  });

  await expect(page.locator('#fi-workspace')).toBeVisible();
  await expect(page.locator('#fi-name')).toHaveText('file-info-e2e.txt');
  await expect(page.locator('#fi-type')).toHaveText('text/plain');
  await expect(page.locator('#fi-ext')).toHaveText('TXT');
  await expect(page.locator('#fi-hash')).toHaveValue(
    '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    { timeout: 10_000 }
  );
  await expect(page.locator('#fi-copy-hash')).toBeEnabled();
});
