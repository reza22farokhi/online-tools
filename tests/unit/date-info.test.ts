import { describe, it, expect } from 'vitest';
import { isLeapYear, dayOfYear, daysInYear, daysRemainingInYear, isoWeekNumber, daysBetween } from '../../src/tools/date/date-info/logic';

describe('isLeapYear', () => {
  it('2024 is leap', () => expect(isLeapYear(2024)).toBe(true));
  it('2023 is not leap', () => expect(isLeapYear(2023)).toBe(false));
  it('2000 is leap', () => expect(isLeapYear(2000)).toBe(true));
  it('1900 is not leap', () => expect(isLeapYear(1900)).toBe(false));
});

describe('dayOfYear', () => {
  it('Jan 1 = 1', () => expect(dayOfYear(new Date(2024, 0, 1))).toBe(1));
  it('Dec 31 = 366 in leap year', () => expect(dayOfYear(new Date(2024, 11, 31))).toBe(366));
  it('Dec 31 = 365 in non-leap', () => expect(dayOfYear(new Date(2023, 11, 31))).toBe(365));
});

describe('daysInYear', () => {
  it('2024 = 366', () => expect(daysInYear(2024)).toBe(366));
  it('2023 = 365', () => expect(daysInYear(2023)).toBe(365));
});

describe('daysRemainingInYear', () => {
  it('Jan 1 = 365 in non-leap', () => expect(daysRemainingInYear(new Date(2023, 0, 1))).toBe(364));
  it('Dec 31 = 0', () => expect(daysRemainingInYear(new Date(2023, 11, 31))).toBe(0));
});

describe('isoWeekNumber', () => {
  it('Jan 4 2024 is week 1', () => expect(isoWeekNumber(new Date(2024, 0, 4))).toBe(1));
});

describe('daysBetween', () => {
  it('same day = 0', () => expect(daysBetween(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(0));
  it('1 day', () => expect(daysBetween(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(1));
  it('30 days', () => expect(daysBetween(new Date(2024, 0, 1), new Date(2024, 0, 31))).toBe(30));
});
