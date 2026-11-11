import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'case-converter',
  category: 'text',
  name: {
    fa: 'تبدیل حروف کوچک و بزرگ',
    en: 'Case Converter'
  },
  description: {
    fa: 'متن را به حروف بزرگ، کوچک، عنوان، جمله، camelCase، PascalCase، snake_case یا kebab-case تبدیل کنید.',
    en: 'Convert text to UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, or kebab-case.'
  },
  keywords: [
    'case converter',
    'uppercase',
    'lowercase',
    'camelCase',
    'snake_case',
    'kebab-case',
    'تبدیل حروف',
    'حروف بزرگ',
    'حروف کوچک'
  ],
  addedAt: '2026-11-11',
  related: ['word-counter']
};
