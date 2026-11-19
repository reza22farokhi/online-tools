import { test, expect } from '@playwright/test';

test('JWT Inspector headings, labels, and placeholder remain visible in light and dark themes', async ({ page }) => {
  await page.goto('/tools/jwt-inspector/?lang=en');

  const light = await page.evaluate(() => {
    const body = getComputedStyle(document.body).backgroundColor;
    const title = getComputedStyle(document.querySelector('.jwt-header h1')!).color;
    const subtitle = getComputedStyle(document.querySelector('.jwt-subtitle')!).color;
    const label = getComputedStyle(document.querySelector('.jwt-label')!).color;
    const placeholder = getComputedStyle(document.querySelector('#jwt-placeholder')!).color;
    return { body, title, subtitle, label, placeholder };
  });

  expect(light.title).not.toBe(light.body);
  expect(light.subtitle).not.toBe(light.body);
  expect(light.label).not.toBe(light.body);
  expect(light.placeholder).not.toBe(light.body);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  const dark = await page.evaluate(() => {
    const body = getComputedStyle(document.body).backgroundColor;
    const title = getComputedStyle(document.querySelector('.jwt-header h1')!).color;
    const subtitle = getComputedStyle(document.querySelector('.jwt-subtitle')!).color;
    const label = getComputedStyle(document.querySelector('.jwt-label')!).color;
    const placeholder = getComputedStyle(document.querySelector('#jwt-placeholder')!).color;
    return { body, title, subtitle, label, placeholder };
  });

  expect(dark.title).not.toBe(dark.body);
  expect(dark.subtitle).not.toBe(dark.body);
  expect(dark.label).not.toBe(dark.body);
  expect(dark.placeholder).not.toBe(dark.body);
  expect(dark.title).not.toBe(light.title);
  expect(dark.subtitle).not.toBe(light.subtitle);
  expect(dark.label).not.toBe(light.label);
  expect(dark.placeholder).not.toBe(light.placeholder);
});
