import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چرا از Web Worker استفاده می‌شود؟', a: 'برای جلوگیری از قفل شدن صفحه در صورت اجرای الگوهای پیچیده (ReDoS). Worker جدا از thread اصلی اجرا می‌شود.' },
    { q: 'ReDoS چیست و چگونه جلوگیری می‌شود؟', a: 'ReDoS حمله‌ای با الگوهای بدخیم است. این ابزار timeout ۲ ثانیه دارد و در صورت تجاوز، Worker را متوقف می‌کند.' },
    { q: 'چه flagهایی پشتیبانی می‌شوند؟', a: 'همه flagهای استاندارد جاوااسکریپت: g، i، m، s، u و y.' },
];
