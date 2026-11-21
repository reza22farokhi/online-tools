import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'persian-text-refiner',
  category: 'text',
  name: {
    fa: 'پالایشگر متن فارسی',
    en: 'Persian Text Refiner'
  },
  description: { fa: "متن فارسی را با تبدیل حروف عربی، اصلاح نیم‌فاصله‌ها، یکدست‌سازی اعداد و تنظیم علائم نگارشی پاک‌سازی کنید تا نوشته‌ای خواناتر داشته باشید.", en: "Clean Persian text by normalizing Arabic characters, fixing half-spaces, standardizing digits, and correcting punctuation for more consistent writing." },
  keywords: [
    'persian text refiner',
    'fix persian text',
    'arabic to persian',
    'half space fixer',
    'پالایش متن فارسی',
    'اصلاح حروف عربی',
    'اصلاح نیم‌فاصله',
    'تبدیل اعداد به فارسی'
  ],
  popular: false,
  addedAt: '2026-11-14',
  related: ['remove-extra-spaces', 'case-converter', 'word-counter']
};
