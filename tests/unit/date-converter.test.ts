import { describe, it, expect } from 'vitest';
import { toJalaali, toGregorian } from '../../src/tools/date/date-converter/logic';

describe('Date Converter Logic', () => {
  it('should convert Gregorian to Jalali (Nowruz 2024)', () => {
    // March 20, 2024 is 1 Farvardin 1403
    const res = toJalaali(2024, 3, 20);
    expect(res.jy).toBe(1403);
    expect(res.jm).toBe(1);
    expect(res.jd).toBe(1);
  });

  it('should convert Jalali to Gregorian (Nowruz 1403)', () => {
    const res = toGregorian(1403, 1, 1);
    expect(res.gy).toBe(2024);
    expect(res.gm).toBe(3);
    expect(res.gd).toBe(20);
  });

  it('should handle leap years correctly (1403 is a leap year)', () => {
    const res = toGregorian(1403, 12, 30);
    expect(res.gy).toBe(2025);
    expect(res.gm).toBe(3);
    expect(res.gd).toBe(20);
  });
});
