import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'date-converter',
  category: 'date',
  name: { fa: 'مبدل تاریخ شمسی و میلادی', en: 'Jalali/Gregorian Date Converter' },
  description: {
    fa: 'تاریخ شمسی (جلالی) و میلادی را با دقت بالا و کاملاً آفلاین به یکدیگر تبدیل کنید.',
    en: 'Convert Jalali (Persian) and Gregorian dates with high precision and fully offline.'
  },
  keywords: ['date converter', 'jalali to gregorian', 'تبدیل تاریخ', 'شمسی به میلادی', 'میلادی به شمسی', 'مبدل تاریخ'],
  addedAt: '2026-11-13',
  related: ['age', 'date-diff']
};
