const BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];

interface JalCal { leap: number; gy: number; march: number; }

function jalCal(jy: number, withoutLeap = false): JalCal {
  const bl = BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  let jm = 0, jump = 0, leap = 0, leapG = 0, march = 0;
  if (jy < jp || jy >= BREAKS[bl - 1]) throw new Error('Invalid Jalali year: ' + jy);
  for (let i = 1; i < bl; i++) {
    jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + Math.floor(jump / 33) * 8 + Math.floor((jump % 33) / 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ = leapJ + Math.floor(n / 33) * 8 + Math.floor(((n % 33) + 3) / 4);
  if (jump % 33 === 4 && jump - n === 4) leapJ++;
  leapG = Math.floor(gy / 4) - Math.floor(((Math.floor(gy / 100) + 1) * 3) / 4) - 150;
  march = 20 + leapJ - leapG;
  if (!withoutLeap) {
    if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;
    leap = (((n + 1) % 33) - 1) % 4;
    if (leap === -1) leap = 4;
  }
  return { leap, gy, march };
}

function assertInteger(value: number, name: string): void {
  if (!Number.isInteger(value)) throw new Error(`Invalid ${name}: ${value}`);
}

function isGregorianLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function assertGregorianDate(gy: number, gm: number, gd: number): void {
  assertInteger(gy, 'Gregorian year');
  assertInteger(gm, 'Gregorian month');
  assertInteger(gd, 'Gregorian day');
  if (gy < 1 || gy > 9999 || gm < 1 || gm > 12) throw new Error('Invalid Gregorian date.');
  const monthDays = [31, isGregorianLeapYear(gy) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (gd < 1 || gd > monthDays[gm - 1]) throw new Error('Invalid Gregorian date.');
}

function assertJalaliDate(jy: number, jm: number, jd: number): void {
  assertInteger(jy, 'Jalali year');
  assertInteger(jm, 'Jalali month');
  assertInteger(jd, 'Jalali day');
  if (jm < 1 || jm > 12) throw new Error('Invalid Jalali date.');
  const leap = jalCal(jy).leap === 0;
  const monthDays = jm <= 6 ? 31 : jm <= 11 ? 30 : leap ? 30 : 29;
  if (jd < 1 || jd > monthDays) throw new Error('Invalid Jalali date.');
}

function isHijriLeapYear(year: number): boolean {
  return (11 * year + 14) % 30 < 11;
}

function assertHijriDate(hy: number, hm: number, hd: number): void {
  assertInteger(hy, 'Hijri year');
  assertInteger(hm, 'Hijri month');
  assertInteger(hd, 'Hijri day');
  if (hy < 1 || hy > 9999 || hm < 1 || hm > 12) throw new Error('Invalid Hijri date.');
  const monthDays = hm === 12 ? (isHijriLeapYear(hy) ? 30 : 29) : hm % 2 === 1 ? 30 : 29;
  if (hd < 1 || hd > monthDays) throw new Error('Invalid Hijri date.');
}

function g2d(gy: number, gm: number, gd: number): number {
  let d = Math.floor(((gy + Math.trunc((gm - 8) / 6) + 100100) * 1461) / 4)
    + Math.floor((153 * ((gm + 9) % 12) + 2) / 5)
    + gd - 34840408;
  d = d - Math.floor((Math.floor((gy + 100100 + Math.trunc((gm - 8) / 6)) / 100) * 3) / 4) + 752;
  return d;
}

function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + Math.floor((Math.floor((4 * jdn + 183187720) / 146097) * 3) / 4) * 4 - 3908;
  const i = Math.floor((j % 1461) / 4) * 5 + 308;
  const gd = Math.floor((i % 153) / 5) + 1;
  const gm = (Math.floor(i / 153) % 12) + 1;
  const gy = Math.floor(j / 1461) - 100100 + Math.trunc((8 - gm) / 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy, true);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - Math.floor(jm / 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): { jy: number; jm: number; jd: number } {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy, false);
  const jdn1f = g2d(gy, 3, r.march);
  let jm, jd;
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + Math.floor(k / 31);
      jd = (k % 31) + 1;
      return { jy, jm, jd };
    } else {
      k -= 186;
    }
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k++;
  }
  jm = 7 + Math.floor(k / 30);
  jd = (k % 30) + 1;
  return { jy, jm, jd };
}

export function toJalali(gy: number, gm: number, gd: number): { jy: number; jm: number; jd: number } {
  assertGregorianDate(gy, gm, gd);
  return d2j(g2d(gy, gm, gd));
}

export function toGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  assertJalaliDate(jy, jm, jd);
  return d2g(j2d(jy, jm, jd));
}

export function gregorianToHijri(gy: number, gm: number, gd: number): { hy: number; hm: number; hd: number } {
  assertGregorianDate(gy, gm, gd);
  const jd = g2d(gy, gm, gd);
  if (jd < 1948440) throw new Error('Gregorian date predates the Hijri calendar.');
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719)
    + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hm = Math.floor((24 * l) / 709);
  const hd = l - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;
  return { hy, hm, hd };
}

export function hijriToGregorian(hy: number, hm: number, hd: number): { gy: number; gm: number; gd: number } {
  assertHijriDate(hy, hm, hd);
  const jd = Math.floor((11 * hy + 3) / 30) + 354 * hy + 30 * hm
    - Math.floor((hm - 1) / 2) + hd + 1948440 - 385;
  return d2g(jd);
}

export function jalaliToHijri(jy: number, jm: number, jd: number): { hy: number; hm: number; hd: number } {
  const g = toGregorian(jy, jm, jd);
  return gregorianToHijri(g.gy, g.gm, g.gd);
}

export function hijriToJalali(hy: number, hm: number, hd: number): { jy: number; jm: number; jd: number } {
  const g = hijriToGregorian(hy, hm, hd);
  return toJalali(g.gy, g.gm, g.gd);
}

export const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
export const HIJRI_MONTHS = ['محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه'];
export const GREGORIAN_MONTHS = ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'];
export const WEEKDAYS_FA = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

export function formatJalali(jy: number, jm: number, jd: number): string {
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}

export function formatGregorian(gy: number, gm: number, gd: number): string {
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

export function formatHijri(hy: number, hm: number, hd: number): string {
  return `${hy}/${String(hm).padStart(2, '0')}/${String(hd).padStart(2, '0')}`;
}
