import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه تگ‌هایی تولید می‌شوند؟', a: 'متا تگ‌های استاندارد HTML، Open Graph (برای شبکه‌های اجتماعی) و Twitter Card.' },
    { q: 'آیا مقادیر ورودی escape می‌شوند؟', a: 'بله. تمام مقادیر با escapeHtmlAttr امن می‌شوند تا از XSS جلوگیری شود.' },
    { q: 'این کد را کجا قرار دهم؟', a: 'در بخش head صفحه HTML خود. کد تولیدی را کپی کرده و قبل از تگ بسته head قرار دهید.' },
];
