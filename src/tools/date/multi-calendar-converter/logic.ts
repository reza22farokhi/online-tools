export { toJalali, toGregorian, gregorianToHijri, hijriToGregorian, jalaliToHijri, hijriToJalali, JALALI_MONTHS, HIJRI_MONTHS, GREGORIAN_MONTHS } from '../../../lib/calendar';

export function todayInAll(): { jy: number; jm: number; jd: number; gy: number; gm: number; gd: number; hy: number; hm: number; hd: number } {
  const now = new Date();
  const gy = now.getFullYear();
  const gm = now.getMonth() + 1;
  const gd = now.getDate();
  const { toJalali, gregorianToHijri } = require('../../../lib/calendar');
  const j = toJalali(gy, gm, gd);
  const h = gregorianToHijri(gy, gm, gd);
  return { jy: j.jy, jm: j.jm, jd: j.jd, gy, gm, gd, hy: h.hy, hm: h.hm, hd: h.hd };
}
