import { test, expect } from '@playwright/test';
import { getAllSlugs } from '../../src/tools/registry';

const routes = [
  ...getAllSlugs().map(slug => ({ slug, path: `/tools/${slug}/` })),
  { slug: 'jwt-inspector', path: '/tools/jwt-inspector/' }
];
const widths = [360, 390, 430];

test('all tool routes avoid document-level horizontal overflow in Persian and English on mobile', async ({ page }) => {
  test.setTimeout(300_000);
  const failures: Array<{
    slug: string;
    lang: string;
    width: number;
    status: number | null;
    viewportWidth: number;
    documentWidth: number;
    bodyWidth: number;
  }> = [];

  for (const route of routes) {
    for (const lang of ['fa', 'en']) {
      await page.setViewportSize({ width: widths[0], height: 844 });
      const response = await page.goto(`${route.path}?lang=${lang}`, {
        waitUntil: 'domcontentloaded'
      });

      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 });
        const dimensions = await page.evaluate(() => ({
          viewportWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth
        }));

        if (
          response?.status() !== 200 ||
          dimensions.documentWidth > dimensions.viewportWidth + 1 ||
          dimensions.bodyWidth > dimensions.viewportWidth + 1
        ) {
          failures.push({
            slug: route.slug,
            lang,
            width,
            status: response?.status() ?? null,
            ...dimensions
          });
        }
      }
    }
  }

  expect(
    failures,
    `Mobile route overflow or HTTP failures detected:\n${JSON.stringify(failures, null, 2)}`
  ).toEqual([]);
});
