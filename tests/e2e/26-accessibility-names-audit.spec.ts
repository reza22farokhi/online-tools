import { test, expect } from '@playwright/test';
import { getAllSlugs } from '../../src/tools/registry';

const routes = [
  ...getAllSlugs().map(slug => ({ slug, path: `/tools/${slug}/` })),
  { slug: 'jwt-inspector', path: '/tools/jwt-inspector/' }
];

test('all tool routes expose accessible names for visible controls and alternative text for images', async ({ page }) => {
  test.setTimeout(240_000);
  const issues: Array<{ slug: string; lang: string; issue: string; selector: string }> = [];

  for (const route of routes) {
    for (const lang of ['fa', 'en']) {
      const response = await page.goto(`${route.path}?lang=${lang}`, { waitUntil: 'domcontentloaded' });
      if (response?.status() !== 200) {
        issues.push({ slug: route.slug, lang, issue: `HTTP ${response?.status() ?? 'no response'}`, selector: route.path });
        continue;
      }

      const pageIssues = await page.evaluate(() => {
        const visible = (element: Element) => {
          const node = element as HTMLElement;
          return node.getClientRects().length > 0 &&
            !node.closest('[hidden], [aria-hidden="true"]') &&
            getComputedStyle(node).visibility !== 'hidden';
        };
        const hasName = (element: Element) => {
          const node = element as HTMLElement;
          const labelledBy = node.getAttribute('aria-labelledby');
          const referencedText = labelledBy
            ? labelledBy.split(/\s+/).map(id => document.getElementById(id)?.textContent ?? '').join(' ').trim()
            : '';
          const imageAlt = Array.from(node.querySelectorAll('img[alt]')).map(img => img.getAttribute('alt') ?? '').join(' ').trim();
          return Boolean(
            node.getAttribute('aria-label')?.trim() ||
            referencedText ||
            node.getAttribute('title')?.trim() ||
            node.textContent?.trim() ||
            imageAlt ||
            (node instanceof HTMLInputElement && ['button', 'submit', 'reset'].includes(node.type) && node.value.trim())
          );
        };

        const missingInputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, select'))
          .filter(visible)
          .filter(element => {
            const node = element as HTMLInputElement;
            return !node.labels?.length && !hasName(element);
          })
          .map(element => ({
            issue: 'form control has no accessible name',
            selector: element.id ? `#${element.id}` : element.tagName.toLowerCase()
          }));

        const unnamedButtons = Array.from(document.querySelectorAll('button, [role="button"]'))
          .filter(visible)
          .filter(element => !hasName(element))
          .map(element => ({
            issue: 'button has no accessible name',
            selector: element.id ? `#${element.id}` : element.tagName.toLowerCase()
          }));

        const unnamedLinks = Array.from(document.querySelectorAll('a[href]'))
          .filter(visible)
          .filter(element => !hasName(element))
          .map(element => ({
            issue: 'link has no accessible name',
            selector: element.id ? `#${element.id}` : element.getAttribute('href') ?? 'a[href]'
          }));

        const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])'))
          .filter(visible)
          .map(element => ({
            issue: 'image has no alt attribute',
            selector: element.id ? `#${element.id}` : (element as HTMLImageElement).src
          }));

        return [...missingInputs, ...unnamedButtons, ...unnamedLinks, ...imagesWithoutAlt];
      });

      issues.push(...pageIssues.map(item => ({ slug: route.slug, lang, ...item })));
    }
  }

  expect(
    issues,
    `Accessibility naming issues detected:\n${JSON.stringify(issues, null, 2)}`
  ).toEqual([]);
});
