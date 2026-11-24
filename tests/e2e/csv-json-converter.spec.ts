import { test, expect } from '@playwright/test';

test('CSV to JSON converts quoted fields, commas and embedded newlines', async ({ page }) => {
  await page.goto('/tools/csv-json-converter/');
  const input = page.locator('#cjc-in');
  const output = page.locator('#cjc-out');

  await input.fill('name,note\nAli,"Tehran, Iran"\nSara,"line one\nline two"');
  await page.locator('#cjc-run').click();

  const parsed = JSON.parse(await output.inputValue());
  expect(parsed).toEqual([
    { name: 'Ali', note: 'Tehran, Iran' },
    { name: 'Sara', note: 'line one\nline two' }
  ]);
  await expect(page.locator('#cjc-copy')).toBeEnabled();
  await expect(page.locator('#cjc-err')).toBeHidden();
});

test('JSON to CSV escapes cells and neutralizes spreadsheet formulas', async ({ page }) => {
  await page.goto('/tools/csv-json-converter/');
  await page.locator('[data-mode="json2csv"]').click();
  await page.locator('#cjc-in').fill(JSON.stringify([
    { name: 'Ali, Jr.', note: 'says "hello"', formula: '=1+1' },
    { name: 'Sara', note: 'two\nlines', formula: '+SUM(A1:A2)' }
  ]));
  await page.locator('#cjc-run').click();

  const csv = await page.locator('#cjc-out').inputValue();
  expect(csv).toContain('"Ali, Jr."');
  expect(csv).toContain('"says ""hello"""');
  expect(csv).toContain("'=1+1");
  expect(csv).toContain("'+SUM(A1:A2)");
  expect(csv).toContain('"two\nlines"');
  await expect(page.locator('#cjc-copy')).toBeEnabled();
  await expect(page.locator('#cjc-err')).toBeHidden();
});

test('CSV converter reports malformed CSV and invalid JSON without stale output', async ({ page }) => {
  await page.goto('/tools/csv-json-converter/');
  const input = page.locator('#cjc-in');
  const output = page.locator('#cjc-out');
  const error = page.locator('#cjc-err');

  await input.fill('name,note\nAli,"unclosed');
  await page.locator('#cjc-run').click();
  await expect(error).toBeVisible();
  await expect(output).toHaveValue('');
  await expect(page.locator('#cjc-copy')).toBeDisabled();

  await page.locator('[data-mode="json2csv"]').click();
  await input.fill('{invalid json');
  await page.locator('#cjc-run').click();
  await expect(error).toBeVisible();
  await expect(output).toHaveValue('');
  await expect(page.locator('#cjc-copy')).toBeDisabled();
});

test('CSV converter sample and clear controls update the real conversion output', async ({ page }) => {
  await page.goto('/tools/csv-json-converter/');
  const input = page.locator('#cjc-in');
  const output = page.locator('#cjc-out');

  await page.locator('#cjc-sample').click();
  expect(JSON.parse(await output.inputValue())).toEqual([
    { name: 'Ali', age: '30', city: 'Tehran' },
    { name: 'Sara', age: '25', city: 'Shiraz' }
  ]);

  await page.locator('#cjc-clear').click();
  await expect(input).toHaveValue('');
  await expect(output).toHaveValue('');
  await expect(page.locator('#cjc-copy')).toBeDisabled();
});
