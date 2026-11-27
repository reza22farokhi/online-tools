import { test, expect } from '@playwright/test';

test('text diff supports word and character granularity and unified diff download', async ({ page }) => {
  await page.goto('/tools/text-diff/?lang=en');

  await page.locator('#text-old').fill('hello world!');
  await page.locator('#text-new').fill('hello there!');
  await page.locator('#diff-granularity').selectOption('word');
  await page.locator('#btn-compare').click();

  const result = page.locator('#diff-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('- world');
  await expect(result).toContainText('+ there');

  await page.locator('#diff-granularity').selectOption('character');
  await page.locator('#text-old').fill('cat');
  await page.locator('#text-new').fill('car');
  await page.locator('#btn-compare').click();
  await expect(result).toContainText('- t');
  await expect(result).toContainText('+ r');

  await page.locator('#text-old').fill('first\nold line\nlast');
  await page.locator('#text-new').fill('first\nnew line\nlast');
  await page.locator('#btn-unified').click();
  const unified = page.locator('#diff-unified-output');
  await expect(unified).toBeVisible();
  await expect(unified).toHaveValue(/--- original/);
  await expect(unified).toHaveValue(/-old line/);
  await expect(unified).toHaveValue(/\+new line/);

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#btn-download-diff').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('text-diff.diff');
});
