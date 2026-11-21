import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { test, expect } from '@playwright/test';

const distDirectory = join(process.cwd(), 'dist');

function findHtmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(path);
    return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
  });
}

function toRoute(file: string): string {
  const path = relative(distDirectory, file).split(sep).join('/');
  if (path === 'index.html') return '/';
  if (path.endsWith('/index.html')) return `/${path.slice(0, -'index.html'.length)}`;
  return `/${path}`;
}

test('every generated public HTML route has complete English navigation, copy, and metadata', async ({ page }) => {
  test.setTimeout(300_000);

  const routes = findHtmlFiles(distDirectory)
    .filter(file => {
      const path = relative(distDirectory, file).split(sep).join('/');
      return (path === 'index.html' || path.endsWith('/index.html')) && !path.startsWith('en/');
    })
    .map(toRoute)
    .sort();

  expect(routes.length, 'Route discovery must include the complete built site').toBeGreaterThanOrEqual(80);

  const failures: Array<{
    route: string;
    status: number | null;
    title: string;
    description: string;
    lang: string | null;
    dir: string | null;
    text: string[];
    attributes: string[];
  }> = [];

  for (const route of routes) {
    const response = await page.goto(`${route}?lang=en`, { waitUntil: 'domcontentloaded' });
    const result = await page.evaluate(() => {
      const persian = /[\u0600-\u06FF]/;
      const isHidden = (element: Element): boolean => {
        if (element.closest('script, style, noscript, template, [hidden], [aria-hidden="true"]')) return true;
        let current: Element | null = element;
        while (current && current !== document.body) {
          const style = window.getComputedStyle(current);
          if (style.display === 'none' || style.visibility === 'hidden') return true;
          current = current.parentElement;
        }
        return false;
      };

      const text: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        const value = node.textContent?.trim() ?? '';
        if (value && parent && !isHidden(parent) && persian.test(value)) {
          text.push(value.slice(0, 120));
        }
      }

      const attributes: string[] = [];
      document.querySelectorAll<HTMLElement>('[placeholder],[aria-label],[title],[alt],[value]').forEach(element => {
        if (isHidden(element)) return;
        for (const name of ['placeholder', 'aria-label', 'title', 'alt', 'value']) {
          const value = element.getAttribute(name);
          if (value && persian.test(value)) attributes.push(`${name}: ${value.slice(0, 120)}`);
        }
      });

      const title = document.title;
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? '';
      const socialMetadata = Array.from(document.querySelectorAll<HTMLMetaElement>(
        'meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]'
      )).map(element => element.content).filter(value => persian.test(value));

      attributes.push(...socialMetadata.map(value => `social metadata: ${value.slice(0, 120)}`));

      return {
        title,
        description,
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? '',
        ogUrl: document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.content ?? '',
        hreflangFa: document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="fa"]')?.href ?? '',
        hreflangEn: document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="en"]')?.href ?? '',
        hreflangDefault: document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="x-default"]')?.href ?? '',
        text,
        attributes
      };
    });

    if (
      (response?.status() ?? 0) >= 400 ||
      result.lang !== 'en' ||
      result.dir !== 'ltr' ||
      result.canonical !== new URL(route, 'https://abzar-tools.ir').toString().replace(/\/$/, '') + '/?lang=en' ||
      result.ogUrl !== result.canonical ||
      result.hreflangFa !== new URL(route, 'https://abzar-tools.ir').toString() ||
      result.hreflangEn !== result.canonical ||
      result.hreflangDefault !== new URL(route, 'https://abzar-tools.ir').toString() ||
      /[\u0600-\u06FF]/.test(result.title) ||
      /[\u0600-\u06FF]/.test(result.description) ||
      result.text.length > 0 ||
      result.attributes.length > 0
    ) {
      failures.push({
        route,
        status: response?.status() ?? null,
        ...result
      });
    }
  }

  expect(
    failures,
    `English localization leaks or route failures detected:\n${JSON.stringify(failures, null, 2)}`
  ).toEqual([]);
});


test('translated technical blog articles render complete English bodies and FAQs', async ({ page }) => {
  const slugs = ['base64-guide', 'what-is-json-guide', 'regex-guide', 'online-security-guide', 'csv-to-json-guide', 'age-calculation-guide', 'strong-password-guide', 'jwt-security-guide', 'what-is-jwt-guide', 'image-compression-guide', 'word-count-guide', 'image-optimization-guide', 'percentage-calculation-guide', 'date-calculation-guide', 'date-conversion-guide', 'website-speed-optimization', 'image-formats-comparison', 'slug-generation-guide', 'seo-meta-tags-guide', 'why-client-side-tools-matter', 'qr-code-guide', 'best-online-tools-2026', 'color-palette-selection-guide', 'hashing-vs-base64', 'json-guide', 'color-palette-guide', 'color-picker-guide', 'mastering-date-and-time', 'unit-converter-guide'];

  for (const slug of slugs) {
    await page.goto(`/blog/${slug}/?lang=en`, { waitUntil: 'domcontentloaded' });

    const body = page.locator('.post-content[data-lang-only="en"]');
    await expect(body).toBeVisible();
    await expect(body.locator('p, h2, h3, li').first()).toBeVisible();

    const visibleText = await body.innerText();
    expect(visibleText.trim().length, `${slug} should contain translated article content`).toBeGreaterThan(500);
    expect(visibleText).not.toMatch(/[\u0600-\u06FF]/);

    const faq = page.locator('.blog-faq[data-lang-only="en"]');
    await expect(faq).toBeVisible();
    expect(await faq.locator('.faq-item').count()).toBeGreaterThan(0);
    expect(await faq.innerText()).not.toMatch(/[\u0600-\u06FF]/);
  }
});


test('every generated /en/ route is indexable, English, and self-canonical', async ({ page }) => {
  test.setTimeout(300_000);
  const routes = findHtmlFiles(distDirectory)
    .filter(file => {
      const path = relative(distDirectory, file).split(sep).join('/');
      return path.startsWith('en/') && path.endsWith('/index.html');
    })
    .map(toRoute)
    .sort();
  expect(routes.length, 'English route generation must mirror all public Persian routes').toBeGreaterThanOrEqual(80);

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://abzar-tools.ir' + route);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://abzar-tools.ir' + route);
    const faRoute = route.replace(/^\/en(?=\/|$)/, '') || '/';
    await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveAttribute('href', 'https://abzar-tools.ir' + faRoute);
    const internalLinks = await page.locator('a[href^="/"]').evaluateAll(links => links.map(link => (link as HTMLAnchorElement).getAttribute('href') || ''));
    expect(internalLinks.filter(href => !href.startsWith('/en/') && href !== '/en/'), route).toEqual([]);
  }
});
