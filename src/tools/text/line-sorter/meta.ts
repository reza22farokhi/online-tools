import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'line-sorter',
  category: 'text',
  name: {
    fa: 'مرتب‌سازی خطوط',
    en: 'Line Sorter'
  },
  seoTitle: { fa: "مرتب‌سازی خطوط متن و حذف تکراری‌ها | ابزارهای آنلاین", en: "Text Line Sorter and Duplicate Cleaner | Online Tools" },

  description: { fa: "خطوط متن را الفبایی، عددی، بر اساس طول یا به ترتیب معکوس مرتب کنید و در صورت نیاز خطوط خالی و موارد تکراری را حذف کنید و خروجی را کپی کنید.", en: "Sort text lines alphabetically, numerically, by length, or in reverse order, with options to remove blank lines and duplicates from the result." },
  keywords: [
    'sort lines',
    'line sorter',
    'alphabetical sort',
    'مرتب‌سازی خطوط',
    'مرتب کردن متن',
    'حذف خطوط تکراری'
  ],
  addedAt: '2026-11-11',
  related: ['remove-extra-spaces', 'word-counter']
};
