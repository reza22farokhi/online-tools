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
    await expect(page.locator('.tool-faq[data-lang-only="en"]')).toBeVisible();
    await expect(page.locator('.tool-faq[data-lang-only="en"]')).toContainText('Frequently asked questions');
    await expect(page.locator('.tool-faq[data-lang-only="fa"]')).toBeHidden();
    await expect(page.locator('.faq-translation-note, .tool-translation-note')).toHaveCount(0);

    const result = await page.evaluate(() => {
      const persian = /[\u0600-\u06FF]/;
      const skipSelector = 'script,style,[hidden],[aria-hidden="true"]';
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


test('English homepage localizes search and percentage statistics', async ({ page }) => {
  await page.goto('/?lang=en');
  await expect(page.locator('#tool-search')).toHaveAttribute('placeholder', 'Search tools...');
  await expect(page.locator('.stat-num').filter({ hasText: '100%' })).toBeVisible();
});

test('empty JSON and Regex tools do not display validation errors before input', async ({ page }) => {
  await page.goto('/tools/json-formatter/?lang=en');
  await expect(page.locator('#jf-error')).toBeHidden();
  await expect(page.locator('#jf-output')).toHaveValue('');

  await page.goto('/tools/regex-tester/?lang=en');
  await expect(page.locator('#rt-status')).toBeEmpty();
  await expect(page.locator('#rt-error')).toBeHidden();
});

test('JWT decoder presents sample results and warnings in English', async ({ page }) => {
  await page.goto('/tools/jwt-decoder/?lang=en');
  await page.locator('#jwt-sample').click();
  await expect(page.locator('#jwt-results')).toBeVisible();
  await expect(page.locator('.jwt-sig-note')).toContainText('The signature is not verified in this browser');
  await expect(page.locator('#jwt-results')).not.toContainText(/[\u0600-\u06FF]/);
});

test('file information tool computes a real SHA-256 digest from a local file', async ({ page }) => {
  await page.goto('/tools/file-info/?lang=en');
  await page.locator('#fi-file').setInputFiles({
    name: 'e2e.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('file-info-e2e')
  });
  await expect(page.locator('#fi-name')).toHaveText('e2e.txt');
  await expect(page.locator('#fi-hash')).toHaveValue('1e1f86514a7c86baf6f0f7c7f9a20a40bc1de5a109074b48225358f14cde61ee');
  await expect(page.locator('#fi-copy-hash')).toBeEnabled();
});

test('Unix timestamp converter renders English calendar labels and converts timestamps', async ({ page }) => {
  await page.goto('/tools/unix-timestamp/?lang=en');
  await page.locator('#uts-input-ts').fill('1700000000');
  await page.locator('#uts-convert-ts').click();
  await expect(page.locator('#uts-results-ts')).toBeVisible();
  await expect(page.locator('#uts-results-ts')).toContainText('Gregorian:');
  await expect(page.locator('#uts-results-ts')).toContainText('Jalali:');
  await expect(page.locator('#uts-results-ts')).toContainText('Hijri:');
  await expect(page.locator('#uts-results-ts')).not.toContainText(/[\u0600-\u06FF]/);
});


test('tool FAQ switches between English and Persian without mixing languages', async ({ page }) => {
  await page.goto('/tools/word-counter/?lang=en');
  const englishFaq = page.locator('.tool-faq[data-lang-only="en"]');
  const persianFaq = page.locator('.tool-faq[data-lang-only="fa"]');
  await expect(englishFaq).toBeVisible();
  await expect(englishFaq).not.toContainText(/[\u0600-\u06FF]/);
  await expect(persianFaq).toBeHidden();

  await page.goto('/tools/word-counter/?lang=fa');
  await expect(persianFaq).toBeVisible();
  await expect(persianFaq).toContainText('سوالات متداول');
  await expect(englishFaq).toBeHidden();
});

test('JWT decoder rejects malformed payloads and safely renders untrusted claims', async ({ page }) => {
  await page.goto('/tools/jwt-decoder/?lang=en');

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const invalidPayload = Buffer.from('not-json').toString('base64url');
  const input = page.locator('#jwt-input');

  await input.fill(`${header}.${invalidPayload}.signature`);
  await expect(page.locator('#jwt-error')).toContainText('Invalid payload');
  await expect(page.locator('#jwt-results')).toBeHidden();

  const untrustedClaim = '<img src=x onerror=alert(1)>';
  const payload = Buffer.from(JSON.stringify({ sub: 'e2e', name: untrustedClaim })).toString('base64url');
  await input.fill(`${header}.${payload}.signature`);

  await expect(page.locator('#jwt-results')).toBeVisible();
  await expect(page.locator('#jwt-payload')).toContainText(untrustedClaim);
  await expect(page.locator('#jwt-results img')).toHaveCount(0);
});

test('file information tool rejects empty files without exposing stale results', async ({ page }) => {
  await page.goto('/tools/file-info/?lang=en');
  await page.locator('#fi-file').setInputFiles({
    name: 'empty.txt',
    mimeType: 'text/plain',
    buffer: Buffer.alloc(0)
  });

  await expect(page.locator('#fi-error')).toContainText('The file is empty and cannot be processed.');
  await expect(page.locator('#fi-workspace')).toBeHidden();
  await expect(page.locator('#fi-copy-hash')).toBeDisabled();
});


test('public informational pages have complete English copy and metadata', async ({ page }) => {
  const routes = ['/about/', '/contact/', '/privacy/', '/blog/'];
  const failures: Array<{ route: string; title: string; text: string[]; attributes: string[] }> = [];

  for (const route of routes) {
    await page.goto(`${route}?lang=en`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    const result = await page.evaluate(() => {
      const persian = /[\u0600-\u06FF]/;
      const skip = 'script,style,[hidden],[aria-hidden="true"]';
      const text: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        const value = node.textContent?.trim() ?? '';
        if (value && parent && !parent.closest(skip) && persian.test(value)) {
          text.push(value.slice(0, 120));
        }
      }

      const attributes: string[] = [];
      document.querySelectorAll<HTMLElement>('[placeholder],[aria-label],[title],[alt],[value]').forEach(el => {
        if (el.closest(skip)) return;
        for (const name of ['placeholder', 'aria-label', 'title', 'alt', 'value']) {
          const value = el.getAttribute(name);
          if (value && persian.test(value)) attributes.push(`${name}: ${value.slice(0, 120)}`);
        }
      });
      return { title: document.title, text, attributes };
    });

    if (/[\u0600-\u06FF]/.test(result.title) || result.text.length || result.attributes.length) {
      failures.push({ route, ...result });
    }
  }

  expect(failures, `Persian content leaked into English informational pages:\\n${JSON.stringify(failures, null, 2)}`).toEqual([]);
});
