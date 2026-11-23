import { test, expect } from '@playwright/test';

test('site doctor [tool:word-counter] calculates Persian text statistics and clears state', async ({ page }) => {
  await page.goto('/tools/word-counter/');
  const input = page.locator('#wc-input');

  await input.fill('سلام دنیا. خوب هستی؟');
  await expect(page.locator('#stat-words')).toHaveText('4');
  await expect(page.locator('#stat-sentences')).toHaveText('2');
  await expect(page.locator('#stat-lines')).toHaveText('1');
  await expect(page.locator('#stat-paragraphs')).toHaveText('1');
  await expect(page.locator('#stat-chars-nospace')).toHaveText('16');
  await expect(page.locator('#wc-copy')).toBeEnabled();

  await page.locator('#wc-clear').click();
  await expect(input).toHaveValue('');
  await expect(page.locator('#stat-words')).toHaveText('0');
  await expect(page.locator('#stat-chars')).toHaveText('0');
  await expect(page.locator('#wc-copy')).toBeDisabled();
});

test('site doctor [tool:word-counter] handles empty text and multiline paragraphs', async ({ page }) => {
  await page.goto('/en/tools/word-counter/');
  const input = page.locator('#wc-input');

  await expect(page.locator('#stat-words')).toHaveText('0');
  await expect(page.locator('#stat-paragraphs')).toHaveText('0');

  await input.fill('one two\n\nthree four five');
  await expect(page.locator('#stat-words')).toHaveText('5');
  await expect(page.locator('#stat-lines')).toHaveText('3');
  await expect(page.locator('#stat-nonexistent')).toHaveCount(0);
  await expect(page.locator('#stat-paragraphs')).toHaveText('2');
});
