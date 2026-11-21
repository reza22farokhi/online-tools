import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'Slug برای چه کاری استفاده می‌شود؟', a: 'برای ساخت URL خوانا و سئوپسند از عنوان مقاله یا صفحه. مثال: ۱۰ نکته سئو به 10-nokte-seo تبدیل می‌شود.', qEn: 'What is a URL slug used for?', aEn: 'A slug is the readable part of a URL that identifies a page, often derived from its title. Descriptive, concise slugs help people understand a link before opening it.' },
    { q: 'تبدیل فارسی به لاتین دقیق است؟', a: 'تقریبی است. برای اسلاگ‌های حساس، متن لاتین دستی وارد کنید. این گزینه اختیاری است.', qEn: 'Is Persian-to-Latin transliteration exact?', aEn: 'No. Transliteration is approximate and can have multiple valid spellings. Review important slugs manually, especially when consistency with an existing URL structure matters.' },
    { q: 'چه کاراکترهایی حذف می‌شوند؟', a: 'همه علائم نگارشی، فاصله‌ها (به خط تیره) و کاراکترهای غیرمجاز URL. حروف فارسی و اعداد حفظ می‌شوند.', qEn: 'Which characters are removed from a slug?', aEn: 'Punctuation and characters that are unsuitable for a URL slug are removed or normalized. Spaces are converted to hyphens, while supported letters and numbers are retained.' },
];
