import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'remove-duplicates',
  category: 'text',
  name: { fa: 'حذف خطوط تکراری', en: 'Remove Duplicate Lines' },
  description: {
    fa: 'خطوط تکراری متن را با حفظ ترتیب اصلی حذف کنید. با گزینه‌های حساسیت به حروف بزرگ/کوچک و حذف خطوط خالی.',
    en: 'Remove duplicate lines while preserving original order. Case-sensitivity and empty-line options.'
  },
  keywords: ['remove duplicates', 'dedupe lines', 'unique lines', 'حذف تکراری', 'حذف خطوط تکراری', 'یکتا کردن متن'],
  addedAt: '2026-11-11',
  related: ['line-sorter', 'remove-extra-spaces', 'word-counter']
};
