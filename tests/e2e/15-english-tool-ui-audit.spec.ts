import { test, expect } from '@playwright/test';
import { getAllSlugs } from '../../src/tools/registry';

test('every registered tool has English UI and loads without first-party runtime or resource failures', async ({ page }) => {
  test.setTimeout(240_000);
  const failures: Array<{
    slug: string;
    title: string;
    text: string[];
    attributes: string[];
    runtimeErrors: string[];
    failedRequests: string[];
    httpErrors: string[];
  }> = [];

  let runtimeErrors: string[] = [];
  let failedRequests: string[] = [];
  let httpErrors: string[] = [];

  page.on('pageerror', error => runtimeErrors.push(error.message));
  page.on('requestfailed', request => {
    try {
      if (new URL(request.url()).origin === new URL(page.url()).origin) {
        failedRequests.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText ?? 'request failed'}`);
      }
    } catch {
      // Ignore non-HTTP and malformed request URLs.
    }
  });
  page.on('response', response => {
    try {
      if (new URL(response.url()).origin === new URL(page.url()).origin && response.status() >= 400) {
        httpErrors.push(`${response.status()} ${response.url()}`);
      }
    } catch {
      // Ignore non-HTTP and malformed response URLs.
    }
  });

  for (const slug of getAllSlugs()) {
    runtimeErrors = [];
    failedRequests = [];
    httpErrors = [];

    const response = await page.goto(`/tools/${slug}/?lang=en`);
    if (response && response.status() >= 400) httpErrors.push(`${response.status()} route response`);

    await expect(page.locator('article[data-tool-slug]')).toHaveAttribute('data-tool-slug', slug);
    await expect(page.locator('article h1').first()).toBeVisible();

    const result = await page.evaluate(() => {
      const persian = /[\u0600-\u06FF]/;
      const skipSelector = 'script,style,[hidden],[aria-hidden="true"],.yn-bnr,.yn-notification,.yn-footer-sticky';
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
      document.querySelectorAll<HTMLElement>('[placeholder],[aria-label],[title],[alt],[value]').forEach(el => {
        if (el.closest(skipSelector)) return;
        for (const name of ['placeholder', 'aria-label', 'title', 'alt', 'value']) {
          const value = el.getAttribute(name);
          if (value && persian.test(value)) attributes.push(`${name}: ${value.slice(0, 100)}`);
        }
        if ((el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && persian.test(el.value)) {
          attributes.push(`current value: ${el.value.slice(0, 100)}`);
        }
      });

      return { title: document.title, text, attributes };
    });

    if (
      /[\u0600-\u06FF]/.test(result.title) ||
      result.text.length ||
      result.attributes.length ||
      runtimeErrors.length ||
      failedRequests.length ||
      httpErrors.length
    ) {
      failures.push({
        slug,
        title: result.title,
        text: result.text,
        attributes: result.attributes,
        runtimeErrors: [...runtimeErrors],
        failedRequests: [...failedRequests],
        httpErrors: [...httpErrors],
      });
    }
  }

  expect(failures, `English UI or first-party runtime/resource failures detected:\n${JSON.stringify(failures, null, 2)}`).toEqual([]);
});
