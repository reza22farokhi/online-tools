import { test, expect } from '@playwright/test';

const tinyText = Buffer.from('cross-browser-file-e2e');

test('home and tool pages render without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/?lang=en');
  await expect(page.locator('main h1').first()).toBeVisible();
  await page.goto('/tools/word-counter/?lang=en');
  await expect(page.locator('main h1').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('password generator creates a non-empty cryptographic password', async ({ page }) => {
  await page.goto('/tools/password-generator/?lang=en');
  const output = page.locator('#pass-output');
  await expect(output).toBeVisible();
  const initial = await output.inputValue();
  expect(initial.length).toBeGreaterThanOrEqual(8);

  await page.locator('#generate-btn').click();
  await expect(output).not.toHaveValue(initial);
});

test('date converter preserves Jalali and Gregorian conversion results', async ({ page }) => {
  await page.goto('/tools/date-converter/?lang=en');
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
});

test('file-to-Base64 reads local files consistently', async ({ page }) => {
  await page.goto('/tools/file-to-base64/?lang=en');
  await page.locator('#fb-file').setInputFiles({
    name: 'cross-browser.txt',
    mimeType: 'text/plain',
    buffer: tinyText
  });
  await expect(page.locator('#fb-output')).toHaveValue(
    'data:text/plain;base64,' + tinyText.toString('base64')
  );
});

test('JWT Inspector safely renders untrusted claims without creating HTML elements', async ({ page }) => {
  await page.goto('/tools/jwt-inspector/?lang=en');
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ name: '<img src=x onerror=alert(1)>' })).toString('base64url');
  await page.locator('#jwt-input').fill(`${header}.${payload}.signature`);

  await expect(page.locator('#jwt-result')).toBeVisible();
  await expect(page.locator('#jwt-payload-pre')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('#jwt-result img')).toHaveCount(0);
});
