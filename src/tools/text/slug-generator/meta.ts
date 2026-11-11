import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'slug-generator',
  category: 'text',
  name: { fa: 'تبدیل متن به Slug', en: 'Slug Generator' },
  description: {
    fa: 'متن فارسی یا انگلیسی را به Slug خوانا و سئوپسند تبدیل کنید. نرمال‌سازی فارسی، حذف کاراکترهای غیرمجاز، طول قابل تنظیم.',
    en: 'Convert Persian or English text to SEO-friendly slugs. Persian normalization, invalid-char removal, configurable length.'
  },
  keywords: ['slug generator', 'url slug', 'permalink', 'تبدیل به slug', 'اسلاگ ساز', 'ساخت url'],
  addedAt: '2026-11-11',
  related: ['case-converter', 'word-counter']
};
