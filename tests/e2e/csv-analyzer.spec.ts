import { test, expect } from '@playwright/test';

test('CSV analyzer calculates row, column, empty, duplicate and numeric statistics', async ({ page }) => {
  await page.goto('/tools/csv-analyzer/?lang=en');

  await expect(page.locator('#csa-results')).toBeVisible();
  await expect(page.locator('#csa-summary')).toContainText('4');
  await expect(page.locator('#csa-columns')).toContainText('name');
  await expect(page.locator('#csa-columns')).toContainText('age');
  await expect(page.locator('#csa-stats')).toContainText('28');
  await expect(page.locator('#csa-stats')).toContainText('40');
  await expect(page.locator('#csa-stats')).toContainText('34.67');
});

test('CSV analyzer filters and sorts the displayed rows', async ({ page }) => {
  await page.goto('/tools/csv-analyzer/?lang=en');
  await page.locator('#csa-column').selectOption('2');
  await page.locator('#csa-query').fill('New York');

  await expect(page.locator('#csa-preview')).toContainText('Grace');
  await expect(page.locator('#csa-preview')).not.toContainText('Ada');
  await expect(page.locator('#csa-visible')).toContainText('1');

  await page.locator('#csa-query').fill('');
  await page.locator('#csa-column').selectOption('1');
  await page.locator('#csa-sort').selectOption('asc');
  const ages = await page.locator('#csa-preview tr').evaluateAll(rows =>
    rows.map(row => row.querySelectorAll('td')[1]?.textContent ?? '')
  );
  expect(ages).toEqual(['28', '36', '36', '40']);
});

test('CSV analyzer honors delimiter and header settings', async ({ page }) => {
  await page.goto('/tools/csv-analyzer/?lang=en');
  await page.locator('#csa-input').fill('Ada;36\nGrace;40');
  await page.locator('#csa-delimiter').selectOption(';');
  await page.locator('#csa-headers').uncheck();
  await page.locator('#csa-analyze').click();

  await expect(page.locator('#csa-results')).toBeVisible();
  await expect(page.locator('#csa-columns')).toContainText('column_1');
  await expect(page.locator('#csa-preview')).toContainText('Ada');
  await expect(page.locator('#csa-preview')).toContainText('Grace');
  await expect(page.locator('#csa-summary')).toContainText('2');
});

test('CSV analyzer rejects malformed CSV and removes stale results', async ({ page }) => {
  await page.goto('/tools/csv-analyzer/?lang=en');
  await expect(page.locator('#csa-results')).toBeVisible();

  await page.locator('#csa-input').fill('name,note\nAli,"unclosed');
  await page.locator('#csa-analyze').click();

  await expect(page.locator('#csa-error')).toBeVisible();
  await expect(page.locator('#csa-results')).toBeHidden();
});

test('CSV analyzer exports filtered rows and neutralizes spreadsheet formulas', async ({ page }) => {
  await page.goto('/tools/csv-analyzer/?lang=en');
  await page.locator('#csa-input').fill('name,formula\nAda,=1+1\nGrace,+SUM(A1:A2)');
  await page.locator('#csa-analyze').click();
  await page.locator('#csa-column').selectOption('0');
  await page.locator('#csa-query').fill('Ada');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#csa-export').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('csv-analysis-export.csv');
  const stream = await download.createReadStream();
  expect(stream).not.toBeNull();
  let csv = '';
  for await (const chunk of stream!) csv += chunk.toString('utf8');
  expect(csv).toContain('name,formula');
  expect(csv).toContain("Ada,'=1+1");
  expect(csv).not.toContain('Grace');
});

test('CSV analyzer renders untrusted cell values as text rather than HTML', async ({ page }) => {
  await page.goto('/tools/csv-analyzer/?lang=en');
  await page.locator('#csa-input').fill('name\n<img src=x onerror=alert(1)>');
  await page.locator('#csa-analyze').click();

  await expect(page.locator('#csa-preview')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('#csa-preview img')).toHaveCount(0);
});
