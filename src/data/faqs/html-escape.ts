import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'کدام کاراکترها escape می‌شوند؟', a: 'پنج کاراکتر خطرناک HTML: <، >، &، "، و تک‌کوتیشن که به فرم entity تبدیل می‌شوند.', qEn: 'Which characters are escaped in HTML?', aEn: 'The tool escapes the key HTML-sensitive characters: less-than (<), greater-than (>), ampersand (&), double quotation mark ("), and apostrophe (\'). They are converted to their corresponding character references.' },
    { q: 'Unescape چه کار می‌کند؟', a: 'عکس عمل Escape. entityها را به کاراکتر اصلی تبدیل می‌کند (هم entityهای نام‌دار و هم عددی).', qEn: 'What does HTML unescape do?', aEn: 'Unescape performs the reverse operation by converting supported named and numeric character references back into their corresponding characters.' },
    { q: 'آیا این ابزار XSS را جلوگیری می‌کند؟', a: 'Escape کردن خروجی یکی از راه‌های جلوگیری از XSS است، اما برای امنیت کامل باید در سرور هم اعتبارسنجی شود.', qEn: 'Does HTML escaping prevent XSS?', aEn: 'Context-aware output encoding is an important XSS defense, but escaping alone is not a complete security solution. Validate input and use the correct encoding for the context where data is inserted.' },
];
