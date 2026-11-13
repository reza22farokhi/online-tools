import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'فرق encodeURIComponent و encodeURI چیست؟', a: 'encodeURIComponent همه کاراکترهای خاص را escape می‌کند (برای پارامترها). encodeURI فقط ضروری‌ها را escape می‌کند (برای URL کامل).' },
    { q: 'چه زمانی از encodeURI استفاده کنم؟', a: 'وقتی می‌خواهید یک URL کامل را برای سرویس دیگر آماده کنید، اما ساختار آن (مثل ://) حفظ شود.' },
    { q: 'آیا متن فارسی پشتیبانی می‌شود؟', a: 'بله. متن فارسی به درصد کدگذاری UTF-8 تبدیل می‌شود و پس از decode دوباره فارسی می‌شود.' },
];
