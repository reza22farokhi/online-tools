import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'کدام فاصله‌ها حذف می‌شوند؟', a: 'بر اساس گزینه‌های انتخابی: فاصله‌های تکراری، فاصله ابتدا/انتهای خطوط، و اختیاراً خطوط خالی.', qEn: 'Which spaces does the tool remove?', aEn: 'Depending on the selected options, it can collapse repeated spaces, trim leading and trailing whitespace on lines, and optionally remove blank lines.' },
    { q: 'آیا فاصله‌های داخل کلمات حذف می‌شوند؟', a: 'خیر. فقط فاصله‌های تکراری به یک فاصله تبدیل می‌شوند. کلمات جدا حفظ می‌شوند.', qEn: 'Does it remove spaces between words?', aEn: 'No. Normal single spaces between words are preserved. Repeated spaces are reduced to one space when that cleanup option is enabled.' },
    { q: 'تب و NBSP چه می‌شوند؟', a: 'هر دو به عنوان فاصله در نظر گرفته می‌شوند و در حالت فعال بودن گزینه، به فاصله ساده تبدیل می‌شوند.', qEn: 'How are tabs and non-breaking spaces handled?', aEn: 'Tabs and non-breaking spaces are treated as whitespace. When the relevant cleanup option is enabled, they can be normalized to regular spaces.' },
];
