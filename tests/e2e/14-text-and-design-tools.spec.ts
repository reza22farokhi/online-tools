import { test, expect } from '@playwright/test';

test('box shadow generator updates CSS and exposes English controls', async ({ page }) => {
  await page.goto('/tools/box-shadow/?lang=en');
  await expect(page.locator('.bs-presets')).toContainText('Soft');
  await expect(page.locator('label[for="bs-x"]')).toContainText('Horizontal (X)');
  await page.locator('#bs-x').fill('10');
  await expect(page.locator('#bs-css')).toContainText('10px');
  await page.locator('.bs-preset[data-idx="0"]').click();
  await expect(page.locator('#bs-css')).toContainText('box-shadow:');
});

test('gradient generator changes type and adds color stops', async ({ page }) => {
  await page.goto('/tools/gradient-generator/?lang=en');
  await expect(page.locator('label[for="gg-type"]')).toContainText('Gradient type');
  await page.locator('#gg-type').selectOption('radial');
  await expect(page.locator('#gg-css')).toContainText('radial-gradient');
  await page.locator('#gg-add-stop').click();
  await expect(page.locator('.gg-stop-row')).toHaveCount(3);
});

test('palette generator produces a five-color harmony in English', async ({ page }) => {
  await page.goto('/tools/palette-generator/?lang=en');
  await expect(page.locator('label[for="pg-color"]')).toContainText('Base color');
  await page.locator('#pg-type').selectOption('complementary');
  await expect(page.locator('#pg-type option:checked')).toHaveText('Complementary');
  await expect(page.locator('.pg-swatch')).toHaveCount(5);
});

test('case converter converts text using the selected case mode', async ({ page }) => {
  await page.goto('/tools/case-converter/?lang=en');
  await expect(page.locator('#cc-help')).toContainText('Maximum 100,000 characters');
  await page.locator('#cc-input').fill('Hello World');
  await page.locator('.cc-mode[data-mode="upper"]').click();
  await expect(page.locator('#cc-output')).toHaveValue('HELLO WORLD');
});

test('line sorter sorts lines and localizes sorting modes', async ({ page }) => {
  await page.goto('/tools/line-sorter/?lang=en');
  await expect(page.locator('#ls-mode option').first()).toHaveText('Ascending (A→Z)');
  await page.locator('#ls-input').fill('banana\napple\ncherry');
  await expect(page.locator('#ls-output')).toHaveValue('apple\nbanana\ncherry');
  await page.locator('#ls-mode').selectOption('desc');
  await expect(page.locator('#ls-output')).toHaveValue('cherry\nbanana\napple');
});

test('duplicate remover returns unique lines and correct counts', async ({ page }) => {
  await page.goto('/tools/remove-duplicates/?lang=en');
  await expect(page.locator('#rd-help')).toContainText('Maximum 100,000 characters');
  await page.locator('#rd-input').fill('apple\napple\nbanana');
  await expect(page.locator('#rd-output')).toHaveValue('apple\nbanana');
  await expect(page.locator('#rd-kept')).toHaveText('2');
  await expect(page.locator('#rd-removed')).toHaveText('1');
});

test('extra spaces tool collapses repeated spaces', async ({ page }) => {
  await page.goto('/tools/remove-extra-spaces/?lang=en');
  await expect(page.locator('#res-help')).toContainText('Maximum 100,000 characters');
  await page.locator('#res-input').fill('hello   world');
  await expect(page.locator('#res-output')).toHaveValue('hello world');
});

test('slug generator creates a slug and supports a custom separator', async ({ page }) => {
  await page.goto('/tools/slug-generator/?lang=en');
  await expect(page.locator('#sg-help')).toContainText('Maximum 500 characters');
  await page.locator('#sg-input').fill('Hello World');
  await expect(page.locator('#sg-output')).toHaveValue('hello-world');
  await page.locator('#sg-sep').selectOption('_');
  await expect(page.locator('#sg-output')).toHaveValue('hello_world');
});
