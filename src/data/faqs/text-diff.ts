import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  {
    q: 'مقایسه‌گر متن چگونه تفاوت‌ها را پیدا می‌کند؟',
    a: 'این ابزار دو متن را خط‌به‌خط مقایسه می‌کند و خطوط اضافه‌شده، حذف‌شده و بدون تغییر را مشخص می‌کند.',
    qEn: 'How does the text diff tool find changes?',
    aEn: 'The tool compares two text inputs line by line and highlights lines that were added, removed, or left unchanged.'
  },
  {
    q: 'آیا ترتیب خطوط در مقایسه اهمیت دارد؟',
    a: 'بله. الگوریتم مقایسه بر اساس ترتیب خطوط کار می‌کند؛ بنابراین جابه‌جایی خطوط نیز می‌تواند به‌عنوان تفاوت نمایش داده شود.',
    qEn: 'Does line order matter when comparing text?',
    aEn: 'Yes. The comparison takes line order into account, so moving a line to another position can appear as a deletion and an addition.'
  }
];
