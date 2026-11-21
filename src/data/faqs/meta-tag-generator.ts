import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه تگ‌هایی تولید می‌شوند؟', a: 'متا تگ‌های استاندارد HTML، Open Graph (برای شبکه‌های اجتماعی) و Twitter Card.', qEn: 'Which metadata tags does the generator create?', aEn: 'It generates standard HTML metadata tags, Open Graph tags for social sharing, and Twitter Card metadata.' },
    { q: 'آیا مقادیر ورودی escape می‌شوند؟', a: 'بله. تمام مقادیر با escapeHtmlAttr امن می‌شوند تا از XSS جلوگیری شود.', qEn: 'Are input values escaped in the generated markup?', aEn: 'Yes. Attribute values are HTML-escaped before being inserted into the generated markup to reduce the risk of markup injection.' },
    { q: 'این کد را کجا قرار دهم؟', a: 'در بخش head صفحه HTML خود. کد تولیدی را کپی کرده و قبل از تگ بسته head قرار دهید.', qEn: 'Where should I place the generated tags?', aEn: 'Copy the generated tags into the head section of the HTML document, before the closing head tag.' },
];
