import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'multi-calendar-converter',
  category: 'date',
  name: { fa: 'مبدل تاریخ شمسی، میلادی و قمری', en: 'Multi-Calendar Converter' },
  description: {
    fa: 'تاریخ را بین سه تقویم شمسی (جلالی)، میلادی (گرگوری) و قمری (هجری) به صورت لحظه‌ای تبدیل کنید.',
    en: 'Convert dates between Jalali (Persian), Gregorian, and Hijri calendars instantly.'
  },
  keywords: ['تبدیل تاریخ', 'شمسی به میلادی', 'میلادی به شمسی', 'تاریخ قمری', 'jalali converter', 'persian calendar'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['unix-timestamp', 'age']
};
