import { describe, it, expect } from 'vitest';
import { percentOf, whatPercent, percentChange, formatNumber } from '../../src/tools/calc/percentage/logic';

describe('percentOf', () => {
  it('20% of 500 = 100', () => expect(percentOf(20, 500)).toBe(100));
  it('50% of 200 = 100', () => expect(percentOf(50, 200)).toBe(100));
  it('0% of 100 = 0', () => expect(percentOf(0, 100)).toBe(0));
  it('100% of 50 = 50', () => expect(percentOf(100, 50)).toBe(50));
  it('150% of 200 = 300', () => expect(percentOf(150, 200)).toBe(300));
  it('negative percent works', () => expect(percentOf(-10, 100)).toBe(-10));
});

describe('whatPercent', () => {
  it('25 of 200 = 12.5', () => expect(whatPercent(25, 200)).toBe(12.5));
  it('100 of 100 = 100', () => expect(whatPercent(100, 100)).toBe(100));
  it('0 of 100 = 0', () => expect(whatPercent(0, 100)).toBe(0));
  it('division by zero returns NaN', () => expect(whatPercent(10, 0)).toBeNaN());
});

describe('percentChange', () => {
  it('100 to 150 = +50', () => expect(percentChange(100, 150)).toBe(50));
  it('100 to 50 = -50', () => expect(percentChange(100, 50)).toBe(-50));
  it('same returns 0', () => expect(percentChange(100, 100)).toBe(0));
  it('from zero returns NaN', () => expect(percentChange(0, 100)).toBeNaN());
  it('negative from -100 to -50 = +50 (increase)', () => {
    expect(percentChange(-100, -50)).toBe(50);
  });
});

describe('formatNumber', () => {
  it('integer unchanged', () => expect(formatNumber(42)).toBe('42'));
  it('decimal trimmed', () => expect(formatNumber(12.50)).toBe('12.5'));
  it('two decimals', () => expect(formatNumber(12.3456)).toBe('12.35'));
  it('NaN returns dash', () => expect(formatNumber(NaN)).toBe('—'));
});
