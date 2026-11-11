import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'date-diff',
  category: 'calc',
  name: { fa: 'محاسبه اختلاف تاریخ', en: 'Date Difference Calculator' },
  description: {
    fa: 'اختلاف بین دو تاریخ را بر حسب سال، ماه، روز، هفته، ساعت و دقیقه محاسبه کنید. با محاسبه روزهای کاری.',
    en: 'Calculate the difference between two dates in years, months, days, weeks, hours, and minutes. Includes business days.'
  },
  keywords: ['date difference', 'days between dates', 'age between', 'اختلاف تاریخ', 'فاصله تاریخ', 'روزهای بین دو تاریخ'],
  addedAt: '2026-11-11',
  related: ['age', 'percentage']
};
