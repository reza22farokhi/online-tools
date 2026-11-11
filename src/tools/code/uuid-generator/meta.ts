import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'uuid-generator',
  category: 'code',
  name: { fa: 'تولید UUID', en: 'UUID Generator' },
  description: {
    fa: 'UUID نسخه ۴ (تصادفی و امن) بسازید. تولید دسته‌ای تا ۱۰۰۰ عدد، حروف بزرگ و بدون خط تیره.',
    en: 'Generate v4 (random, secure) UUIDs. Batch up to 1000, uppercase, and no-hyphen options.'
  },
  keywords: ['uuid', 'uuid v4', 'guid', 'uuid generator', 'تولید uuid', 'شناسه یکتا'],
  addedAt: '2026-11-11',
  related: ['base64']
};
