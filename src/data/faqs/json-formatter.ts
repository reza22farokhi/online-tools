import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  { q: 'تفاوت Format، Minify و Validate چیست؟', a: 'Format ساختار را با تورفتگی مرتب می‌کند، Minify حجم را با حذف فاصله‌ها کم می‌کند، و Validate فقط صحت را بررسی می‌کند.', qEn: 'What is the difference between Format, Minify, and Validate?', aEn: 'Format adds indentation for readability, Minify removes unnecessary whitespace to reduce the output size, and Validate checks whether the input is valid JSON.' },
  { q: 'آیا کامنت JSON پشتیبانی می‌شود؟', a: 'خیر. استاندارد JSON کامنت را مجاز نمی‌داند و این ابزار از JSON.parse استاندارد استفاده می‌کند.', qEn: 'Does JSON support comments?', aEn: 'No. Standard JSON does not allow comments, and this tool uses the browser’s native JSON parser.' },
  { q: 'حداکثر طول ورودی چقدر است؟', a: 'حداکثر ۱۰۰ هزار کاراکتر. برای فایل‌های حجیم‌تر، از ویرایشگر دسکتاپ استفاده کنید.', qEn: 'What is the maximum input length?', aEn: 'The input limit is 100,000 characters. For larger documents, use a dedicated desktop editor.' },
];
