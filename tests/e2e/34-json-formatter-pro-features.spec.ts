import { test, expect } from '@playwright/test';

test('JSON formatter supports safe cleanup transformations and JSONPath extraction', async ({ page }) => {
  await page.goto('/tools/json-formatter/?lang=en');
  const input = page.locator('#jf-input');
  const output = page.locator('#jf-output');

  await input.fill('{"z":1,"a":null,"nested":{"b":"","a":2},"empty":[]}');
  await page.locator('#jf-sort-keys').check();
  await page.locator('#jf-remove-nulls').check();
  await page.locator('#jf-remove-empty').check();
  await page.locator('#jf-transform').click();

  await expect(output).toHaveValue(/"nested"/);
  expect(JSON.parse(await output.inputValue())).toEqual({ nested: { a: 2 }, z: 1 });

  await input.fill('{"users":[{"name":"Ada"},{"name":"Grace"}],"odd-key":[{"id":1},{"id":2}]}');
  await page.locator('#jf-path').fill('$.users[1].name');
  await page.locator('#jf-path-extract').click();
  await expect(page.locator('#jf-path-output')).toHaveValue('"Grace"');

  await page.locator('#jf-path').fill('$["odd-key"][*].id');
  await page.locator('#jf-path-extract').click();
  expect(JSON.parse(await page.locator('#jf-path-output').inputValue())).toEqual([1, 2]);

  await page.locator('#jf-path').fill('$.__proto__');
  await page.locator('#jf-path-extract').click();
  await expect(page.locator('#jf-path-error')).toBeVisible();
});
