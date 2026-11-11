import type { ToolMeta } from '../../types';
export const meta: ToolMeta = {
  slug: 'date-calculator',
  category: 'date',
  name: { fa: 'ماشین حساب تاریخ', en: 'Date Calculator' },
  description: {
    fa: 'روز، هفته، ماه یا سال به یک تاریخ اضافه یا کم کنید. نتیجه در سه تقویم شمسی، میلادی و قمری نمایش داده می‌شود.',
    en: 'Add or subtract days, weeks, months, or years from any date. Result in Jalali, Gregorian, and Hijri.'
  },
  keywords: ['date calculator', 'add days', 'subtract days', 'ماشین حساب تاریخ', 'اضافه روز', 'کم کردن روز'],
  popular: true,
  addedAt: '2026-11-12',
  related: ['date-info', 'date-diff', 'multi-calendar-converter']
};
