import { test, expect } from '@playwright/test';

test('Base64 tool encodes and decodes text in English', async ({ page }) => {
  await page.goto('/tools/base64/?lang=en');
  await expect(page.locator('#b64-help')).toContainText('Maximum 100,000 characters');
  await page.locator('#b64-input').fill('hello');
  await expect(page.locator('#b64-output')).toHaveValue('aGVsbG8=');
  await page.locator('.b64-mode[data-mode="decode"]').click();
  await page.locator('#b64-input').fill('aGVsbG8=');
  await expect(page.locator('#b64-output')).toHaveValue('hello');
});

test('Hash generator computes a real SHA-256 digest', async ({ page }) => {
  await page.goto('/tools/hash-generator/?lang=en');
  await expect(page.locator('#hg-help')).toContainText('Hashing runs locally');
  await page.locator('#hg-input').fill('hello');
  await expect(page.locator('#hg-output')).toHaveValue('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
});

test('HTML escape tool escapes and unescapes markup', async ({ page }) => {
  await page.goto('/tools/html-escape/?lang=en');
  await expect(page.locator('#he-help')).toContainText('Maximum 100,000 characters');
  await page.locator('#he-input').fill('<b>Hello</b>');
  await expect(page.locator('#he-output')).toHaveValue('&lt;b&gt;Hello&lt;/b&gt;');
  await page.locator('.he-mode[data-mode="unescape"]').click();
  await expect(page.locator('#he-output')).toHaveValue('<b>Hello</b>');
});

test('JSON formatter formats, minifies and reports invalid JSON in English', async ({ page }) => {
  await page.goto('/tools/json-formatter/?lang=en');
  await expect(page.locator('#jf-help')).toContainText('Paste JSON here');
  await page.locator('#jf-input').fill('{"a":1}');
  await expect(page.locator('#jf-output')).toHaveValue(/"a": 1/);
  await page.locator('.jf-mode[data-mode="minify"]').click();
  await expect(page.locator('#jf-output')).toHaveValue('{"a":1}');
  await page.locator('#jf-input').fill('{"a":');
  await expect(page.locator('#jf-error')).toContainText('Invalid JSON');
});

test('URL encoder encodes and decodes a URL component', async ({ page }) => {
  await page.goto('/tools/url-encoder/?lang=en');
  await expect(page.locator('label[for="ue-kind"]')).toContainText('Encoding type');
  await page.locator('#ue-input').fill('hello world');
  await expect(page.locator('#ue-output')).toHaveValue('hello%20world');
  await page.locator('.ue-mode[data-mode="decode"]').click();
  await page.locator('#ue-input').fill('hello%20world');
  await expect(page.locator('#ue-output')).toHaveValue('hello world');
});

test('percentage calculator localizes dynamic results when language changes', async ({ page }) => {
  await page.goto('/tools/percentage/?lang=en');
  await page.locator('#pc-of-x').fill('20');
  await page.locator('#pc-of-y').fill('500');
  await expect(page.locator('#pc-of-result')).toHaveText('20% of 500 = 100');
  await page.locator('[data-lang-toggle]').first().click();
  await expect(page.locator('#pc-of-result')).toHaveText('20٪ از 500 = 100');
});
