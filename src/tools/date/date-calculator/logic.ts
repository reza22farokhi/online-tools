import { toJalali, gregorianToHijri } from '../../../lib/calendar';

export type OpUnit = 'days' | 'weeks' | 'months' | 'years';

export function addToDate(base: Date, amount: number, unit: OpUnit, subtract = false): Date {
  const d = new Date(base.getTime());
  const n = subtract ? -amount : amount;
  switch (unit) {
    case 'days': d.setDate(d.getDate() + n); break;
    case 'weeks': d.setDate(d.getDate() + n * 7); break;
    case 'months': d.setMonth(d.getMonth() + n); break;
    case 'years': d.setFullYear(d.getFullYear() + n); break;
  }
  return d;
}

export function getDateInfo(d: Date) {
  const j = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const h = gregorianToHijri(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return { j, h, g: { gy: d.getFullYear(), gm: d.getMonth() + 1, gd: d.getDate() } };
}
