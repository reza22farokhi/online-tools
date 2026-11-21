import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'word-counter',
  category: 'text',
  name: {
    fa: 'شمارش کلمات و کاراکترها',
    en: 'Word & Character Counter'
  },
  description: { fa: "تعداد واژه‌ها، نویسه‌ها، جمله‌ها، خطوط و پاراگراف‌های متن را لحظه‌ای بشمارید و آمار دقیق را هنگام ویرایش یا آماده‌سازی محتوا ببینید.", en: "Count words, characters, sentences, lines, and paragraphs as you type, with live statistics to support writing, editing, and preparing content." },
  seoTitle: {
    fa: 'شمارش کلمات و کاراکترها آنلاین | ابزار رایگان شمارش متن',
    en: 'Free Word & Character Counter Online | Text Counting Tool'
  },
  keywords: [
    'word count',
    'character count',
    'text counter',
    'شمارش کلمه',
    'شمارش کاراکتر',
    'شمارش خط'
  ],
  popular: true,
  addedAt: '2026-11-11',
  related: ['case-converter', 'remove-extra-spaces', 'text-diff']
};
