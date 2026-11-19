import { test, expect } from '@playwright/test';

test('JWT Inspector headings, labels, placeholder, and Clear button remain accessible in light and dark themes', async ({ page }) => {
  await page.goto('/tools/jwt-inspector/?lang=en');

  const inspectTheme = () => page.evaluate(() => {
    const readColor = (selector: string, property = 'color') =>
      getComputedStyle(document.querySelector(selector)!).getPropertyValue(property).trim();

    const rgb = (value: string) => {
      const channels = value.match(/[\\d.]+/g);
      if (!channels || channels.length < 3) throw new Error(`Unsupported computed color: ${value}`);
      return channels.slice(0, 3).map(Number);
    };

    const luminance = (value: string) => {
      const [r, g, b] = rgb(value).map(channel => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const contrast = (foreground: string, background: string) => {
      const a = luminance(foreground);
      const b = luminance(background);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };

    const body = readColor('body', 'background-color');
    const clearColor = readColor('#jwt-clear');
    const clearBackground = readColor('#jwt-clear', 'background-color');
    return {
      body,
      title: readColor('.jwt-header h1'),
      subtitle: readColor('.jwt-subtitle'),
      label: readColor('.jwt-label'),
      placeholder: readColor('#jwt-placeholder'),
      clearContrast: contrast(clearColor, clearBackground),
      clearBackground,
    };
  });

  const light = await inspectTheme();
  expect(light.title).not.toBe(light.body);
  expect(light.subtitle).not.toBe(light.body);
  expect(light.label).not.toBe(light.body);
  expect(light.placeholder).not.toBe(light.body);
  expect(light.clearBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(light.clearContrast).toBeGreaterThanOrEqual(4.5);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  const dark = await inspectTheme();

  expect(dark.title).not.toBe(dark.body);
  expect(dark.subtitle).not.toBe(dark.body);
  expect(dark.label).not.toBe(dark.body);
  expect(dark.placeholder).not.toBe(dark.body);
  expect(dark.clearBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(dark.clearContrast).toBeGreaterThanOrEqual(4.5);
  expect(dark.title).not.toBe(light.title);
  expect(dark.subtitle).not.toBe(light.subtitle);
  expect(dark.label).not.toBe(light.label);
  expect(dark.placeholder).not.toBe(light.placeholder);
});

test('language toggle accessible name includes its visible language code', async ({ page }) => {
  await page.goto('/tools/jwt-inspector/?lang=en');
  const toggle = page.locator('[data-lang-toggle]');

  await expect(toggle).toContainText('FA');
  await expect(toggle).toHaveAttribute('aria-label', /FA/);

  await toggle.click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(toggle).toContainText('EN');
  await expect(toggle).toHaveAttribute('aria-label', /EN/);
});
