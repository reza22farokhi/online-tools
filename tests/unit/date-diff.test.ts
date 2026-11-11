import { describe, it, expect } from 'vitest';
import { calculateDateDiff, parseIsoDate } from '../../src/tools/calc/date-diff/logic';

describe('calculateDateDiff', () => {
  it('same day returns zeros', () => {
    const r = calculateDateDiff(new Date(2025, 0, 1), new Date(2025, 0, 1));
    expect(r!.years).toBe(0);
    expect(r!.months).toBe(0);
    expect(r!.days).toBe(0);
    expect(r!.totalDays).toBe(0);
  });
  it('one year exact', () => {
    const r = calculateDateDiff(new Date(2024, 0, 1), new Date(2025, 0, 1));
    expect(r!.years).toBe(1);
    expect(r!.months).toBe(0);
    expect(r!.days).toBe(0);
  });
  it('swaps if from > to', () => {
    const r = calculateDateDiff(new Date(2025, 0, 1), new Date(2024, 0, 1));
    expect(r!.years).toBe(1);
  });
  it('total days correct for 1 year leap', () => {
    const r = calculateDateDiff(new Date(2024, 0, 1), new Date(2025, 0, 1));
    expect(r!.totalDays).toBe(366);
  });
  it('total days correct for 1 year non-leap', () => {
    const r = calculateDateDiff(new Date(2023, 0, 1), new Date(2024, 0, 1));
    expect(r!.totalDays).toBe(365);
  });
  it('30 days exact', () => {
    const r = calculateDateDiff(new Date(2025, 0, 1), new Date(2025, 0, 31));
    expect(r!.totalDays).toBe(30);
  });
  it('business days computed', () => {
    const r = calculateDateDiff(new Date(2025, 0, 4), new Date(2025, 0, 11));
    expect(r!.businessDays + r!.weekendDays).toBe(8);
  });
  it('total hours', () => {
    const r = calculateDateDiff(new Date(2025, 0, 1), new Date(2025, 0, 2));
    expect(r!.totalHours).toBe(24);
  });
});

describe('parseIsoDate', () => {
  it('valid ISO', () => {
    const d = parseIsoDate('2024-06-15');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2024);
  });
  it('invalid month', () => expect(parseIsoDate('2024-13-01')).toBeNull());
  it('invalid day', () => expect(parseIsoDate('2024-02-30')).toBeNull());
  it('empty', () => expect(parseIsoDate('')).toBeNull());
});
