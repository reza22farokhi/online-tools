import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'regex-tester',
  category: 'code',
  name: { fa: 'تست Regex', en: 'Regex Tester' },
  description: {
    fa: 'الگوهای Regex را روی متن تست کنید. نمایش هایلایت، لیست تطابق‌ها، گروه‌های نام‌دار، با محافظت از ReDoS.',
    en: 'Test regex patterns against text. Highlighted matches, match list, named groups, with ReDoS protection.'
  },
  keywords: ['regex', 'regex tester', 'regexp', 'regex online', 'تست regex', 'تست الگو', 'عبارت منظم'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['html-escape', 'json-formatter', 'base64']
};
