import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'unix-timestamp',
  category: 'date',
  name: { fa: 'مبدل تایم‌استمپ یونیکس', en: 'Unix Timestamp Converter' },
  description: {
    fa: 'تایم‌استمپ یونیکس را به تاریخ (شمسی، میلادی، قمری) و برعکس تبدیل کنید. با نمایش خودکار زمان فعلی.',
    en: 'Convert Unix timestamp to dates (Jalali, Gregorian, Hijri) and vice versa.'
  },
  keywords: ['unix timestamp', 'timestamp converter', 'epoch', 'تایم استمپ', 'یونیکس تایم', 'epoch converter'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['multi-calendar-converter', 'date-diff']
};
