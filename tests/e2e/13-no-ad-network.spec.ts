import { test, expect } from '@playwright/test';

const AD_NETWORK_MARKERS = /yektanet|tapsell|mediaad|ynpos-/i;

test('site loads without advertising placements, loaders, or third-party ad requests', async ({ page }) => {
  const externalScripts: string[] = [];
  page.on('request', request => {
    if (request.resourceType() !== 'script') return;
    try {
      if (new URL(request.url()).origin !== 'http://localhost:4321') {
        externalScripts.push(request.url());
      }
    } catch {
      externalScripts.push(request.url());
    }
  });

  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/?lang=fa');
  await expect(page.locator('body')).toBeVisible();

  await expect(page.locator('[id*="ynpos"], [class*="yektanet"], [class*="tapsell"], [class*="mediaad"]')).toHaveCount(0);
  await expect(page.locator('script[src], iframe[src]')).toHaveCount(await page.locator('script[src], iframe[src]').evaluateAll(nodes => nodes.filter(node => AD_NETWORK_MARKERS.test(node.getAttribute('src') ?? '')).length === 0 ? nodes.length : -1).then(count => count === -1 ? -1 : count));

  const adNetworkReferences = await page.locator('script[src], iframe[src], [id], [class]').evaluateAll(nodes =>
    nodes.flatMap(node => ['src', 'id', 'class'].map(attribute => node.getAttribute(attribute) ?? ''))
      .filter(value => AD_NETWORK_MARKERS.test(value))
  );
  expect(adNetworkReferences).toEqual([]);
  expect(externalScripts.filter(url => AD_NETWORK_MARKERS.test(url))).toEqual([]);

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
});

test('English and Persian layouts remain usable without advertising integrations', async ({ page }) => {
  await page.goto('/?lang=en');
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('[data-lang-toggle]').first()).toBeVisible();
  await expect(page.locator('[id*="ynpos"], [class*="yektanet"], [class*="tapsell"], [class*="mediaad"]')).toHaveCount(0);

  await page.locator('[data-lang-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator('[id*="ynpos"], [class*="yektanet"], [class*="tapsell"], [class*="mediaad"]')).toHaveCount(0);
});
