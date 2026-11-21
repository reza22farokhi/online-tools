import { test, expect } from '@playwright/test';

test('case converter supports every conversion mode with deterministic output', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/tools/case-converter/?lang=en');

  const input = page.locator('#cc-input');
  const output = page.locator('#cc-output');
  await input.fill('Hello World');

  const cases = [
    ['lower', 'hello world'],
    ['upper', 'HELLO WORLD'],
    ['title', 'Hello World'],
    ['sentence', 'Hello world'],
    ['camel', 'helloWorld'],
    ['pascal', 'HelloWorld'],
    ['snake', 'hello_world'],
    ['kebab', 'hello-world'],
    ['alternating', 'hElLo WoRlD'],
  ] as const;

  for (const [mode, expected] of cases) {
    const button = page.locator(`.cc-mode[data-mode="${mode}"]`);
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(output).toHaveValue(expected);
  }

  await page.locator('#cc-clear').click();
  await expect(input).toHaveValue('');
  await expect(output).toHaveValue('');
  await expect(page.locator('#cc-copy')).toBeDisabled();
});

test('case converter mode controls keep a stable three-column mobile grid', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/tools/case-converter/?lang=en');

  const layout = await page.locator('.cc-modes').evaluate(element => {
    const style = getComputedStyle(element);
    const buttons = Array.from(element.querySelectorAll('button'));
    const rows = new Set(buttons.map(button => Math.round(button.getBoundingClientRect().top)));
    return {
      columns: style.gridTemplateColumns.split(' ').length,
      rows: rows.size,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      buttonCount: buttons.length,
    };
  });

  expect(layout).toEqual({
    columns: 3,
    rows: 3,
    overflow: false,
    buttonCount: 9,
  });
});

test('case converter enforces its 100,000-character input limit', async ({ page }) => {
  await page.goto('/tools/case-converter/?lang=en');
  const input = page.locator('#cc-input');
  await input.fill('x'.repeat(100_001));
  await expect(input).toHaveValue('x'.repeat(100_000));
  await expect(page.locator('#cc-output')).toHaveValue('x'.repeat(100_000));
});
