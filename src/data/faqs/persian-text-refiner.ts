import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  { q: 'این ابزار چه کاری انجام می‌دهد؟', a: 'این ابزار به صورت خودکار حروف عربی (مثل ي و ك) را به فارسی (ی و ک) تبدیل می‌کند، نیم‌فاصله‌ها را اصلاح کرده و فاصله‌های اضافی قبل و بعد از علائم نگارشی را حذف می‌کند.', qEn: 'What does the Persian Text Refiner do?', aEn: 'It normalizes common Arabic characters to their Persian equivalents, helps correct half-spaces (zero-width non-joiners), and removes unnecessary spaces around punctuation.' },
  { q: 'آیا متن من به سرور ارسال می‌شود؟', a: 'خیر، تمام پردازش‌ها ۱۰۰٪ محلی در مرورگر شما انجام می‌شود و هیچ داده‌ای ارسال نمی‌گردد.', qEn: 'Is my text uploaded to a server?', aEn: 'No. Text cleanup runs locally in your browser. The text you enter is not uploaded to our server for processing.' },
  { q: 'چرا نیم‌فاصله مهم است؟', a: 'استفاده صحیح از نیم‌فاصله، خوانایی متن فارسی را افزایش می‌دهد و برای سئو و ظاهر حرفه‌ای محتوا بسیار اهمیت دارد.', qEn: 'Why are half-spaces important in Persian text?', aEn: 'A half-space, also called a zero-width non-joiner, separates word components where Persian writing conventions require it without inserting a full visible space. Correct use improves readability and typographic consistency.' }
];
