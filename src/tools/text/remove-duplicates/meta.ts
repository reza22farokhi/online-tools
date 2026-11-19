import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'remove-duplicates',
  category: 'text',
  name: { fa: 'حذف خطوط تکراری', en: 'Remove Duplicate Lines' },
  description: { fa: "خطوط تکراری را از متن حذف کنید و ترتیب اصلی را نگه دارید؛ حساسیت به حروف بزرگ و کوچک و حذف خطوط خالی را نیز کنترل کنید و خروجی را کپی کنید.", en: "Remove duplicate lines while preserving their original order, choose case-sensitive matching, and optionally clear blank lines from the text." },
  keywords: ['remove duplicates', 'dedupe lines', 'unique lines', 'حذف تکراری', 'حذف خطوط تکراری', 'یکتا کردن متن'],
  addedAt: '2026-11-11',
  related: ['line-sorter', 'remove-extra-spaces', 'word-counter']
};
