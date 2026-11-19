import { test, expect } from '@playwright/test';

test('Unix timestamp input rows fit narrow Persian and English viewports', async ({ page }) => {
  for (const lang of ['fa', 'en']) {
    await page.goto(`/tools/unix-timestamp/?lang=${lang}`);
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: 844 });
      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
      }));
      expect(dimensions.document, `${lang} document overflows at ${width}px`).toBeLessThanOrEqual(width + 1);
      expect(dimensions.body, `${lang} body overflows at ${width}px`).toBeLessThanOrEqual(width + 1);
    }
  }
});
