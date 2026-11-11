import type { ToolMeta } from '../../types';
export const meta: ToolMeta = {
  slug: 'date-info',
  category: 'date',
  name: { fa: 'اطلاعات کامل تاریخ', en: 'Date Info' },
  description: {
    fa: 'تمام اطلاعات یک تاریخ: روز هفته، شماره روز سال، شماره هفته، سال کبیسه، روزهای باقیمانده تا پایان سال.',
    en: 'Full date details: weekday, day-of-year, week number, leap year, days remaining in year.'
  },
  keywords: ['date info', 'day of week', 'week number', 'leap year', 'اطلاعات تاریخ', 'روز هفته', 'کبیسه'],
  addedAt: '2026-11-12',
  related: ['date-calculator', 'date-diff']
};
