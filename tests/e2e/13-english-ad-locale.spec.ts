import { test, expect } from '@playwright/test';

test('Persian Yektanet ad containers are hidden only in English mode', async ({ page }) => {
  await page.goto('/?lang=en');
  await page.evaluate(() => {
    for (const className of ['yn-bnr', 'yn-notification', 'yn-footer-sticky']) {
      const el = document.createElement('div');
      el.className = className;
      el.id = 'qa-' + className;
      el.textContent = 'Persian ad creative';
      document.body.appendChild(el);
    }
  });

  for (const id of ['#qa-yn-bnr', '#qa-yn-notification', '#qa-yn-footer-sticky']) {
    await expect(page.locator(id)).toBeHidden();
  }

  await page.locator('[data-lang-toggle]').first().click();
  await expect(page.locator('#qa-yn-bnr')).toBeVisible();
  await expect(page.locator('#qa-yn-notification')).toBeVisible();
  await expect(page.locator('#qa-yn-footer-sticky')).toBeVisible();
});
