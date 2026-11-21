import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  { q: 'شمارش کلمات چگونه انجام می‌شود؟', a: 'کلمات با تقسیم متن بر اساس فاصله، تب و خط جدید شمارش می‌شوند. اکثر ویرایشگرهای حرفه‌ای از همین روش استفاده می‌کنند.', qEn: 'How are words counted?', aEn: 'Words are counted by splitting the text at whitespace, including spaces, tabs, and line breaks. Punctuation remains attached to its word.' },
  { q: 'حداکثر متن قابل پردازش چقدر است؟', a: 'حداکثر ۱ میلیون کاراکتر. برای متون بسیار طولانی، مرورگر ممکن است کمی کند شود.', qEn: 'What is the maximum text length?', aEn: 'The tool accepts up to 1 million characters. Very large texts may take longer to process depending on your device and browser.' },
  { q: 'زمان مطالعه چگونه محاسبه می‌شود؟', a: 'بر اساس سرعت متوسط مطالعه ۲۰۰ کلمه در دقیقه. حداقل زمان نمایش ۱ دقیقه برای متن‌های غیرخالی است.', qEn: 'How is reading time estimated?', aEn: 'Reading time is estimated at 200 words per minute. Non-empty text has a minimum displayed reading time of one minute.' },
];
