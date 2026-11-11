import { describe, it, expect } from 'vitest';
import { calculateAge, parseIsoDate } from '../../src/tools/calc/age/logic';

describe('parseIsoDate', () => {
  it('valid ISO parses', () => {
    const d = parseIsoDate('2000-01-15');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2000);
    expect(d!.getMonth()).toBe(0);
    expect(d!.getDate()).toBe(15);
  });
  it('invalid month rejected', () => {
    expect(parseIsoDate('2000-13-01')).toBeNull();
  });
  it('invalid day rejected', () => {
    expect(parseIsoDate('2000-02-30')).toBeNull();
  });
  it('empty rejected', () => expect(parseIsoDate('')).toBeNull());
});

describe('calculateAge', () => {
  it('exact one year', () => {
    const r = calculateAge(new Date(2020, 0, 1), new Date(2021, 0, 1));
    expect(r).not.toBeNull();
    expect(r!.years).toBe(1);
    expect(r!.months).toBe(0);
    expect(r!.days).toBe(0);
  });
  it('partial year', () => {
    const r = calculateAge(new Date(2020, 0, 15), new Date(2021, 0, 10));
    expect(r!.years).toBe(0);
    expect(r!.months).toBe(11);
  });
  it('exact 30 years', () => {
    const r = calculateAge(new Date(1995, 5, 15), new Date(2025, 5, 15));
    expect(r!.years).toBe(30);
    expect(r!.months).toBe(0);
    expect(r!.days).toBe(0);
  });
  it('future birth returns null', () => {
    const r = calculateAge(new Date(2030, 0, 1), new Date(2024, 0, 1));
    expect(r).toBeNull();
  });
  it('total days for 1 year', () => {
    const r = calculateAge(new Date(2023, 0, 1), new Date(2024, 0, 1));
    expect(r!.totalDays).toBe(365);
  });
  it('leap year total days 366', () => {
    const r = calculateAge(new Date(2024, 0, 1), new Date(2025, 0, 1));
    expect(r!.totalDays).toBe(366);
  });
  it('next birthday days works', () => {
    const r = calculateAge(new Date(1990, 0, 1), new Date(2025, 11, 25));
    expect(r!.nextBirthdayDays).toBe(7);
  });
});
