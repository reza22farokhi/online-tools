import { describe, it, expect } from 'vitest';
import { addToDate } from '../../src/tools/date/date-calculator/logic';

describe('addToDate', () => {
  it('adds 1 day', () => {
    const r = addToDate(new Date(2024, 0, 1), 1, 'days');
    expect(r.getDate()).toBe(2);
  });
  it('subtracts 1 day', () => {
    const r = addToDate(new Date(2024, 0, 2), 1, 'days', true);
    expect(r.getDate()).toBe(1);
  });
  it('adds 1 week (7 days)', () => {
    const r = addToDate(new Date(2024, 0, 1), 1, 'weeks');
    expect(r.getDate()).toBe(8);
  });
  it('adds 1 month', () => {
    const r = addToDate(new Date(2024, 0, 15), 1, 'months');
    expect(r.getMonth()).toBe(1);
  });
  it('adds 1 year', () => {
    const r = addToDate(new Date(2024, 5, 15), 1, 'years');
    expect(r.getFullYear()).toBe(2025);
  });
  it('subtracts 1 year', () => {
    const r = addToDate(new Date(2024, 5, 15), 1, 'years', true);
    expect(r.getFullYear()).toBe(2023);
  });
  it('clamps month addition to the last valid day', () => {
    expect(addToDate(new Date(2024, 0, 31), 1, 'months')).toEqual(new Date(2024, 1, 29));
    expect(addToDate(new Date(2023, 0, 31), 1, 'months')).toEqual(new Date(2023, 1, 28));
  });
  it('clamps leap-day year addition', () => {
    expect(addToDate(new Date(2024, 1, 29), 1, 'years')).toEqual(new Date(2025, 1, 28));
  });
  it('rejects fractional and excessive amounts', () => {
    expect(() => addToDate(new Date(2024, 0, 1), 1.5, 'days')).toThrow();
    expect(() => addToDate(new Date(2024, 0, 1), 100001, 'days')).toThrow();
  });
  it('crosses month boundary', () => {
    const r = addToDate(new Date(2024, 0, 31), 1, 'days');
    expect(r.getMonth()).toBe(1);
    expect(r.getDate()).toBe(1);
  });
});
