import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'remove-extra-spaces',
  category: 'text',
  name: {
    fa: 'حذف فاصله‌های اضافی',
    en: 'Remove Extra Spaces'
  },
  description: { fa: "فاصله‌های تکراری، فاصله ابتدا و انتهای خطوط و سطرهای خالی را از متن حذف کنید تا نوشته‌ای مرتب و آماده کپی داشته باشید، بدون تغییر واژه‌ها.", en: "Clean up repeated spaces, leading and trailing whitespace, and empty lines to make text easier to read, reuse, and paste into other applications." },
  keywords: [
    'remove spaces',
    'trim spaces',
    'collapse whitespace',
    'حذف فاصله',
    'حذف فاصله اضافی',
    'تمیز کردن متن'
  ],
  addedAt: '2026-11-11',
  related: ['word-counter', 'case-converter', 'line-sorter']
};
