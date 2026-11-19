import { test, expect } from '@playwright/test';

const HS256_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

test('JWT verification state is cleared when token, key, or algorithm changes', async ({ page }) => {
  await page.goto('/tools/jwt-inspector/?lang=fa');

  const token = page.locator('#jwt-input');
  const key = page.locator('#jwt-key');
  const algorithm = page.locator('#jwt-alg');
  const verifyButton = page.locator('#jwt-verify');
  const result = page.locator('#jwt-verify-result');

  await token.fill(HS256_TOKEN);
  await key.fill('your-256-bit-secret');
  await verifyButton.click();
  await expect(result).toContainText('امضا معتبر است');

  await key.fill('wrong-secret');
  await expect(result).toBeHidden();

  await key.fill('your-256-bit-secret');
  await verifyButton.click();
  await expect(result).toContainText('امضا معتبر است');

  await algorithm.selectOption('HS512');
  await expect(result).toBeHidden();
  await verifyButton.click();
  await expect(result).toContainText('مطابقت ندارد');

  await algorithm.selectOption('');
  await verifyButton.click();
  await expect(result).toContainText('امضا معتبر است');

  await token.fill(HS256_TOKEN + 'x');
  await expect(result).toBeHidden();
});
