import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'line-sorter',
  category: 'text',
  name: {
    fa: 'مرتب‌سازی خطوط',
    en: 'Line Sorter'
  },
  description: {
    fa: 'خطوط متن را به‌صورت الفبایی، عددی، بر اساس طول یا برعکس مرتب کنید. با گزینه‌های حذف خطوط تکراری و خالی.',
    en: 'Sort lines alphabetically, numerically, by length, or reverse. With dedupe and empty-line removal.'
  },
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
