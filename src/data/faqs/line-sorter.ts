import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه حالت‌های مرتب‌سازی وجود دارد؟', a: 'صعودی، نزولی، بر اساس طول، و معکوس ترتیب اصلی.', qEn: 'Which line-sorting modes are available?', aEn: 'You can sort lines in ascending or descending order, sort by line length, or reverse the original order.' },
    { q: 'آیا ترتیب اولیه خطوط تکراری حفظ می‌شود؟', a: 'اگر گزینه حذف تکراری خاموش باشد، ترتیب اصلی حفظ می‌شود. با فعال بودن، اولین تکرار نگه داشته می‌شود.', qEn: 'Is the original order preserved when lines are duplicated?', aEn: 'When duplicate removal is off, sorting follows the selected sort mode. When duplicate removal is enabled, the first occurrence of each unique line is retained.' },
    { q: 'مرتب‌سازی عددی چه تفاوتی دارد؟', a: 'در حالت عددی، 10 بعد از 2 می‌آید. در حالت متنی، 10 قبل از 2 قرار می‌گیرد.', qEn: 'How is numeric sorting different from text sorting?', aEn: 'Numeric sorting compares values as numbers, so 10 comes after 2. Lexicographic text sorting compares characters, so strings beginning with “1” can appear before strings beginning with “2”.' },
];
