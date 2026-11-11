import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'remove-extra-spaces',
  category: 'text',
  name: {
    fa: 'حذف فاصله‌های اضافی',
    en: 'Remove Extra Spaces'
  },
  description: {
    fa: 'فاصله‌های تکراری، فاصله ابتدا/انتهای خطوط و خطوط خالی را با یک کلیک حذف کنید.',
    en: 'Remove duplicate spaces, trim leading/trailing whitespace, and delete empty lines.'
  },
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
