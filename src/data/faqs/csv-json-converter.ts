import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه جداکننده‌هایی پشتیبانی می‌شوند؟', a: 'کاما، نقطه‌ویرگول و Tab. اگر فایل شما از جداکننده دیگری استفاده می‌کند، ابتدا با جایگزینی متن تبدیل کنید.', qEn: 'Which CSV delimiters are supported?', aEn: 'The converter supports commas, semicolons, and tab characters as delimiters. If your file uses another delimiter, replace it before converting.' },
    { q: 'آیا کاما درون سلول‌ها مشکل ایجاد می‌کند؟', a: 'خیر، اگر سلول‌ها در کوتیشن دوتایی باشند. این ابزار استاندارد RFC 4180 را پیاده‌سازی می‌کند.', qEn: 'Can a CSV cell contain a comma?', aEn: 'Yes. A comma inside a field is treated as part of the value when the field is enclosed in double quotes, as specified by the common CSV quoting convention.' },
    { q: 'تبدیل JSON به CSV چه محدودیتی دارد؟', a: 'فقط آرایه‌ای از آبجکت‌ها پشتیبانی می‌شود. ساختارهای تو در تو به صورت [object Object] نمایش داده می‌شوند.', qEn: 'What are the limitations when converting JSON to CSV?', aEn: 'The JSON-to-CSV conversion expects an array of objects. Nested objects are not flattened into separate columns and may be represented as string values.' },
];
