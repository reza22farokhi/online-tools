import { toJalali, gregorianToHijri } from '../../../lib/calendar';

export type OpUnit = 'days' | 'weeks' | 'months' | 'years';

export function addToDate(base: Date, amount: number, unit: OpUnit, subtract = false): Date {
  if (Number.isNaN(base.getTime())) throw new Error('تاریخ پایه نامعتبر است.');
  if (!Number.isInteger(amount) || amount < 0 || amount > 100_000) {
    throw new Error('مقدار باید یک عدد صحیح بین صفر تا ۱۰۰٬۰۰۰ باشد.');
  }
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  const n = subtract ? -amount : amount;
  if (unit === 'days') d.setDate(d.getDate() + n);
  else if (unit === 'weeks') d.setDate(d.getDate() + n * 7);
  else {
    const originalDay = d.getDate();
    d.setDate(1);
    if (unit === 'months') d.setMonth(d.getMonth() + n);
    else if (unit === 'years') d.setFullYear(d.getFullYear() + n);
    else throw new Error('واحد محاسبه نامعتبر است.');
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(originalDay, lastDay));
  }
  return d;
}

export function getDateInfo(d: Date) {
  const j = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const h = gregorianToHijri(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return { j, h, g: { gy: d.getFullYear(), gm: d.getMonth() + 1, gd: d.getDate() } };
}
