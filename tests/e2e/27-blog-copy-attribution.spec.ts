import { test, expect } from '@playwright/test';

test('blog copy attribution works under the strict same-origin script CSP', async ({ page }) => {
  await page.goto('/blog/word-count-guide/');

  const result = await page.evaluate(() => {
    const content = document.querySelector('.post-content p');
    if (!content) return null;

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(content);
    selection?.removeAllRanges();
    selection?.addRange(range);

    const clipboardData = new DataTransfer();
    const event = new ClipboardEvent('copy', {
      bubbles: true,
      cancelable: true,
      clipboardData,
    });
    const dispatchResult = document.dispatchEvent(event);

    return {
      prevented: !dispatchResult,
      copiedText: clipboardData.getData('text/plain'),
    };
  });

  expect(result).not.toBeNull();
  expect(result?.prevented).toBe(true);
  expect(result?.copiedText).toContain('منبع:');
  expect(result?.copiedText).toContain('/blog/word-count-guide/');
});
