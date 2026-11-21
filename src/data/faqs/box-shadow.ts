import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'پارامترهای box-shadow چیست؟', a: 'offset-x (افقی)، offset-y (عمودی)، blur (محو)، spread (گسترش)، رنگ و inset (داخلی).', qEn: 'Which parameters make up a CSS box shadow?', aEn: 'A box shadow can include horizontal and vertical offsets, blur radius, spread radius, color, and the optional inset keyword for an inner shadow.' },
    { q: 'سایه inset چه تفاوتی دارد؟', a: 'سایه معمولی بیرون از عنصر ظاهر می‌شود، inset داخل. برای ایجاد عمق یا حالت فشرده مناسب است.', qEn: 'What is the difference between an inset and a regular shadow?', aEn: 'A regular box shadow is drawn outside the element, while an inset shadow is drawn inside its border. Inset shadows can create recessed or pressed effects.' },
    { q: 'چند سایه می‌توانم روی یک عنصر داشته باشم؟', a: 'در این ابزار یکی. برای چند سایه، کد تولیدی را دستی گسترش دهید (با کاما از هم جدا کنید).', qEn: 'Can an element have multiple box shadows?', aEn: 'Yes. CSS supports comma-separated shadow layers. This generator currently creates one shadow at a time; you can combine multiple generated values in the box-shadow declaration.' },
];
