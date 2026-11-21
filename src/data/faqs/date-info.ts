import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'شماره هفته ISO چیست؟', a: 'استاندارد ISO 8601 که هفته را از دوشنبه شروع می‌کند و هفته اول سال را هفته‌ای می‌داند که پنجشنبه در آن قرار دارد.', qEn: 'What is an ISO week number?', aEn: 'ISO 8601 numbers weeks starting on Monday. Week 1 is the first week that contains a Thursday, which means it is the week containing January 4.' },
    { q: 'سال کبیسه چگونه تعیین می‌شود؟', a: 'سال‌های بخش‌پذیر بر ۴ کبیسه‌اند، مگر بخش‌پذیر بر ۱۰۰ که کبیسه نیستند، مگر بخش‌پذیر بر ۴۰۰.', qEn: 'How is a Gregorian leap year determined?', aEn: 'A Gregorian year is a leap year if it is divisible by 4, except century years must also be divisible by 400. This keeps the calendar aligned with the solar year.' },
    { q: 'اطلاعات تاریخ بر اساس کدام تقویم محاسبه می‌شود؟', a: 'همه محاسبات بر اساس تقویم میلادی انجام می‌شود. تاریخ شمسی ورودی فقط برای نمایش است.', qEn: 'Which calendar is used for date calculations?', aEn: 'Date information and calculations use the Gregorian calendar. A Persian calendar date may be provided for display, but the underlying calculations are Gregorian.' },
];
