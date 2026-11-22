import type { ToolFaqItem } from './types';
export const faqs: ToolFaqItem[] = [
  { q: 'چگونه YAML را به JSON تبدیل کنم؟', a: 'جهت تبدیل YAML به JSON را انتخاب کنید، محتوای YAML را وارد کنید و دکمه تبدیل را بزنید. خروجی JSON در کادر دوم نمایش داده می‌شود.', qEn: 'How do I convert YAML to JSON?', aEn: 'Select YAML to JSON, paste your YAML content, and click Convert. The JSON result appears in the output editor.' },
  { q: 'آیا تبدیل JSON به YAML هم امکان‌پذیر است؟', a: 'بله. جهت تبدیل را روی JSON به YAML قرار دهید و JSON معتبر را وارد کنید.', qEn: 'Can I convert JSON to YAML as well?', aEn: 'Yes. Switch the direction to JSON to YAML and provide valid JSON input.' },
  { q: 'کدام قابلیت‌های YAML پشتیبانی نمی‌شوند؟', a: 'این نسخه بر داده‌های سازگار با JSON تمرکز دارد. anchor، alias، tag و بلوک‌های چندخطی پشتیبانی نمی‌شوند؛ برای فایل‌های پیچیده YAML از ابزار اعتبارسنج کامل استفاده کنید.', qEn: 'Which YAML features are not supported?', aEn: 'This version focuses on JSON-compatible YAML. Anchors, aliases, tags, and multiline block scalars are not supported.' },
  { q: 'آیا اطلاعات من آپلود می‌شود؟', a: 'خیر. تبدیل در مرورگر انجام می‌شود و هر ورودی حداکثر ۱۰۰ هزار کاراکتر است.', qEn: 'Is my data uploaded?', aEn: 'No. Conversion runs in your browser. Each input is limited to 100,000 characters.' }
];
