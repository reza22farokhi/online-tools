import { describe, it, expect } from 'vitest';
import { generateUuid, generateUuids } from '../../src/tools/code/uuid-generator/logic';
describe('generateUuid', () => {
  it('returns valid v4 UUID format', () => {
    expect(generateUuid()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
  it('two calls differ', () => {
    expect(generateUuid()).not.toBe(generateUuid());
  });
});
describe('generateUuids', () => {
  it('count=1 returns one line', () => {
    expect(generateUuids({ count: 1, uppercase: false, noHyphens: false }).split('\n').length).toBe(1);
  });
  it('count=5 returns five lines', () => {
    expect(generateUuids({ count: 5, uppercase: false, noHyphens: false }).split('\n').length).toBe(5);
  });
  it('uppercase option works', () => {
    const out = generateUuids({ count: 1, uppercase: true, noHyphens: false });
    expect(out).toBe(out.toUpperCase());
  });
  it('noHyphens option yields 32 chars', () => {
    const out = generateUuids({ count: 1, uppercase: false, noHyphens: true });
    expect(out).not.toContain('-');
    expect(out.length).toBe(32);
  });
  it('clamps count below 1', () => {
    expect(generateUuids({ count: 0, uppercase: false, noHyphens: false }).split('\n').length).toBe(1);
  });
  it('clamps count above 1000', () => {
    expect(generateUuids({ count: 5000, uppercase: false, noHyphens: false }).split('\n').length).toBe(1000);
  });
});
