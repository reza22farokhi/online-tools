import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'دقت انتخاب رنگ چقدر است؟', a: 'دقت تا ۱ پیکسل. با کلیک روی هر نقطه از تصویر، رنگ دقیق آن پیکسل استخراج می‌شود.', qEn: 'How precise is the color picker?', aEn: 'The picker samples the selected image pixel. Click the point you want to inspect to retrieve its color value.' },
    { q: 'آیا می‌توانم رنگ‌ها را در قالب‌های دیگر دریافت کنم؟', a: 'بله، هم HEX (مثل #FF0000) و هم RGB (مثل rgb(255,0,0)) را می‌بینید و می‌توانید کپی کنید.', qEn: 'Which color formats are available?', aEn: 'The tool displays the selected color in HEX (for example, #FF0000) and RGB (for example, rgb(255, 0, 0)) formats, which you can copy.' },
    { q: 'حداکثر حجم تصویر چقدر است؟', a: 'حداکثر ۲۰ مگابایت. برای تصاویر بزرگ‌تر، ابتدا با ابزار تغییر اندازه کوچک کنید.', qEn: 'What is the maximum image size?', aEn: 'The maximum supported input file size is 20 MB. If your image is larger, resize or compress it before uploading it to the picker.' },
];
