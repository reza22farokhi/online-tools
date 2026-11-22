import type { ToolFaqItem } from './types';
export const faqs: ToolFaqItem[] = [
  { q: 'چگونه دو فایل JSON را مقایسه کنم؟', a: 'محتوای JSON اول و دوم را در دو کادر قرار دهید و روی «مقایسه JSON» بزنید. ابزار موارد افزوده‌شده، حذف‌شده و تغییرکرده را همراه مسیر دقیق نمایش می‌دهد.', qEn: 'How do I compare two JSON documents?', aEn: 'Paste the first and second JSON documents into the editors and select Compare JSON. Added, removed, and changed values are listed with their exact paths.' },
  { q: 'آیا ترتیب کلیدهای JSON در مقایسه اهمیت دارد؟', a: 'خیر. ترتیب کلیدهای اشیای JSON نادیده گرفته می‌شود؛ اما اعضای آرایه بر اساس شماره موقعیت مقایسه می‌شوند.', qEn: 'Does JSON object key order matter?', aEn: 'No. Object key order is ignored. Array items are compared by their index.' },
  { q: 'آیا داده‌های من به سرور ارسال می‌شوند؟', a: 'خیر. مقایسه در مرورگر انجام می‌شود. هر ورودی حداکثر ۱۰۰ هزار کاراکتر است و حداکثر ۵۰۰ تفاوت نمایش داده می‌شود.', qEn: 'Is my JSON uploaded?', aEn: 'No. Comparison runs in your browser. Each input is limited to 100,000 characters and up to 500 differences are displayed.' }
];
