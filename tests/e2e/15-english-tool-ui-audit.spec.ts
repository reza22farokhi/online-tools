import { test, expect } from '@playwright/test';
import { getAllSlugs } from '../../src/tools/registry';

test('every registered tool has English visible UI, placeholders and accessibility labels', async ({ page }) => {
  test.setTimeout(180_000);
  const failures: Array<{ slug: string; title: string; text: string[]; attributes: string[] }> = [];

  for (const slug of getAllSlugs()) {
    await page.goto(`/tools/${slug}/?lang=en`);
    const result = await page.evaluate(() => {
      const persian = /[\u0600-\u06FF]/;
      const skipSelector = 'script,style,textarea,input,code,pre,[hidden],[aria-hidden="true"],.yn-bnr,.yn-notification,.yn-footer-sticky';
      const text: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        const value = node.textContent?.trim() ?? '';
        if (!value || !parent || parent.closest(skipSelector)) continue;
        if (persian.test(value)) text.push(value.slice(0, 100));
      }

      const attributes: string[] = [];
      document.querySelectorAll<HTMLElement>('[placeholder],[aria-label],[title]').forEach(el => {
        if (el.closest('script,style,[hidden],[aria-hidden="true"],.yn-bnr,.yn-notification,.yn-footer-sticky')) return;
        for (const name of ['placeholder', 'aria-label', 'title']) {
          const value = el.getAttribute(name);
          if (value && persian.test(value)) attributes.push(`${name}: ${value.slice(0, 100)}`);
        }
      });

      return { title: document.title, text, attributes };
    });

    if (/[\u0600-\u06FF]/.test(result.title) || result.text.length || result.attributes.length) {
      failures.push({ slug, title: result.title, text: result.text, attributes: result.attributes });
    }
  }

  expect(failures, `Persian content remains in English-mode tool UI:\n${JSON.stringify(failures, null, 2)}`).toEqual([]);
});
