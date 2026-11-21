import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه دسته‌های واحدی پشتیبانی می‌شوند؟', a: 'طول، وزن، دما، حجم و مساحت. هر دسته شامل واحدهای متریک و انگلیسی است.', qEn: 'Which unit categories are supported?', aEn: 'The converter supports length, weight, temperature, volume, and area, with commonly used metric and imperial units.' },
    { q: 'آیا تبدیل دما دقیق است؟', a: 'بله. تبدیل سلسیوس و فارنهایت و کلوین با فرمول دقیق و بدون افت دقت انجام می‌شود.', qEn: 'Are temperature conversions accurate?', aEn: 'Yes. Celsius, Fahrenheit, and Kelvin conversions use their standard mathematical formulas. Display rounding may affect the number of decimal places shown.' },
    { q: 'دقت تبدیل چقدر است؟', a: 'تا ۶ رقم اعشار. اعداد بسیار بزرگ یا کوچک ممکن است دقت خود را از دست بدهند.', qEn: 'How many decimal places are displayed?', aEn: 'Results are displayed with up to six decimal places. Extremely large or small values may be affected by the numeric precision available in JavaScript.' },
];
