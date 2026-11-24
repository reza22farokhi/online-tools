import { test, expect } from '@playwright/test';

const vectors = [
  {
    algorithm: 'SHA-1',
    digest: 'a9993e364706816aba3e25717850c26c9cd0d89d'
  },
  {
    algorithm: 'SHA-256',
    digest: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
  },
  {
    algorithm: 'SHA-384',
    digest: 'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7'
  },
  {
    algorithm: 'SHA-512',
    digest: 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'
  }
];

test('hash generator computes the standard digest for every supported algorithm', async ({ page }) => {
  await page.goto('/tools/hash-generator/?lang=en');
  await page.locator('#hg-input').fill('abc');

  for (const vector of vectors) {
    await page.locator('#hg-algo').selectOption(vector.algorithm);
    await expect(page.locator('#hg-output')).toHaveValue(vector.digest);
    await expect(page.locator('#hg-copy')).toBeEnabled();
  }

  await expect(page.locator('#hg-error')).toBeHidden();
});

test('hash generator updates live for Unicode input and clears output state', async ({ page }) => {
  await page.goto('/tools/hash-generator/?lang=fa');
  const input = page.locator('#hg-input');
  const output = page.locator('#hg-output');

  await input.fill('سلام');
  await expect(output).toHaveValue(/^[0-9a-f]{64}$/);
  const firstDigest = await output.inputValue();

  await input.fill('درود');
  await expect(output).toHaveValue(/^[0-9a-f]{64}$/);
  await expect.poll(() => output.inputValue()).not.toBe(firstDigest);

  await page.locator('#hg-clear').click();
  await expect(input).toHaveValue('');
  await expect(output).toHaveValue('');
  await expect(page.locator('#hg-copy')).toBeDisabled();
  await expect(page.locator('#hg-error')).toBeHidden();
});

test('hash generation stays client-side and does not send the input to a server', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => {
    if (['POST', 'PUT', 'PATCH'].includes(request.method())) requests.push(request.url());
  });

  await page.goto('/tools/hash-generator/?lang=en');
  await page.locator('#hg-input').fill('private text that must remain in this browser');
  await expect(page.locator('#hg-output')).toHaveValue(/^[0-9a-f]{64}$/);
  expect(requests).toEqual([]);
});
