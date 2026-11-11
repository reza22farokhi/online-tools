import { describe, it, expect } from 'vitest';
import { toJalali, toGregorian, gregorianToHijri, hijriToGregorian, jalaliToHijri, hijriToJalali } from '../../src/lib/calendar';

describe('toJalali', () => {
  it('Nowruz 1403 = 2024-03-20', () => {
    const r = toJalali(2024, 3, 20);
    expect(r.jy).toBe(1403); expect(r.jm).toBe(1); expect(r.jd).toBe(1);
  });
  it('Nowruz 1400 = 2021-03-21', () => {
    const r = toJalali(2021, 3, 21);
    expect(r.jy).toBe(1400); expect(r.jm).toBe(1); expect(r.jd).toBe(1);
  });
  it('Nowruz 1399 = 2020-03-20', () => {
    const r = toJalali(2020, 3, 20);
    expect(r.jy).toBe(1399); expect(r.jm).toBe(1); expect(r.jd).toBe(1);
  });
});

describe('toGregorian', () => {
  it('1403/01/01 = 2024-03-20', () => {
    const r = toGregorian(1403, 1, 1);
    expect(r.gy).toBe(2024); expect(r.gm).toBe(3); expect(r.gd).toBe(20);
  });
  it('1400/01/01 = 2021-03-21', () => {
    const r = toGregorian(1400, 1, 1);
    expect(r.gy).toBe(2021); expect(r.gm).toBe(3); expect(r.gd).toBe(21);
  });
});

describe('round-trip', () => {
  it('gregorian → jalali → gregorian', () => {
    const dates = [[2024, 3, 20], [2024, 12, 31], [2000, 1, 1], [2030, 6, 15]];
    for (const [gy, gm, gd] of dates) {
      const j = toJalali(gy, gm, gd);
      const g = toGregorian(j.jy, j.jm, j.jd);
      expect(g).toEqual({ gy, gm, gd });
    }
  });
});

describe('Hijri conversion', () => {
  it('round-trip gregorian → hijri → gregorian', () => {
    const g = gregorianToHijri(2024, 6, 15);
    const back = hijriToGregorian(g.hy, g.hm, g.hd);
    expect(back).toEqual({ gy: 2024, gm: 6, gd: 15 });
  });
  it('jalali → hijri → jalali', () => {
    const h = jalaliToHijri(1403, 1, 1);
    const back = hijriToJalali(h.hy, h.hm, h.hd);
    expect(back).toEqual({ jy: 1403, jm: 1, jd: 1 });
  });
});
