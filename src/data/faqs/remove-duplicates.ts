import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'ترتیب خطوط حفظ می‌شود؟', a: 'بله. اولین تکرار هر خط نگه داشته می‌شود و ترتیب اصلی خطوط یکتا حفظ می‌گردد.', qEn: 'Is the original line order preserved?', aEn: 'Yes. The first occurrence of each unique line is kept, and the relative order of the remaining lines is preserved.' },
    { q: 'مقایسه حساس به حروف است؟', a: 'به صورت پیش‌فرض حساس است. می‌توانید گزینه مقایسه بدون حساسیت را فعال کنید.', qEn: 'Is duplicate detection case-sensitive?', aEn: 'Comparison is case-sensitive by default. Enable the case-insensitive option if you want lines such as “Apple” and “apple” to be treated as duplicates.' },
    { q: 'خطوط خالی چگونه مدیریت می‌شوند؟', a: 'به صورت پیش‌فرض حذف می‌شوند. می‌توانید گزینه حذف خطوط خالی را خاموش کنید.', qEn: 'How are blank lines handled?', aEn: 'Blank lines are removed by default. You can turn off the remove-empty-lines option if you want to keep them in the output.' },
];
