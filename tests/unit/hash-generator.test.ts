import { describe, it, expect } from 'vitest';
import { computeHash } from '../../src/tools/code/hash-generator/logic';

describe('computeHash', () => {
  it('SHA-256 of empty string', async () => {
    expect(await computeHash('', 'SHA-256'))
      .toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
  it('SHA-256 of "abc"', async () => {
    expect(await computeHash('abc', 'SHA-256'))
      .toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
  it('SHA-1 of "abc"', async () => {
    expect(await computeHash('abc', 'SHA-1'))
      .toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
  });
  it('SHA-384 of "abc"', async () => {
    expect(await computeHash('abc', 'SHA-384'))
      .toBe('cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7');
  });
  it('SHA-512 of "abc"', async () => {
    expect(await computeHash('abc', 'SHA-512'))
      .toBe('ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f');
  });
  it('produces 64-char hex for SHA-256', async () => {
    const h = await computeHash('test', 'SHA-256');
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });
  it('unicode input works', async () => {
    const a = await computeHash('سلام', 'SHA-256');
    const b = await computeHash('سلام', 'SHA-256');
    expect(a).toBe(b);
    expect(a.length).toBe(64);
  });
  it('different inputs different hashes', async () => {
    const a = await computeHash('a', 'SHA-256');
    const b = await computeHash('b', 'SHA-256');
    expect(a).not.toBe(b);
  });
});
