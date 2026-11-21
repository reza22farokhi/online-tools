import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه تقویم‌هایی پشتیبانی می‌شوند؟', a: 'سه تقویم: شمسی (جلالی)، میلادی (گرگوری) و قمری (هجری). تبدیل بین هر سه به صورت لحظه‌ای.', qEn: 'Which calendars are supported?', aEn: 'The converter supports Persian (Jalali), Gregorian, and Hijri calendar dates, with conversion between the three calendar systems.' },
    { q: 'دقت تبدیل تاریخ چقدر است؟', a: 'الگوریتم Jalaali برای شمسی و الگوریتم Kuwaiti برای قمری. دقت برای بازه ۱۳۰۰ تا ۱۵۰۰ شمسی بالاست.', qEn: 'How accurate are the calendar conversions?', aEn: 'The converter uses a Jalali algorithm for Persian dates and a Kuwaiti algorithm for Hijri dates. Results are intended for common modern date ranges; Hijri dates can vary by regional convention.' },
    { q: 'چرا ممکن است قمری ۱ روز اختلاف داشته باشد؟', a: 'تقویم قمری بر اساس رؤیت هلال است و ممکن است ۱ روز با تقویم رسمی هر کشور اختلاف داشته باشد.', qEn: 'Why can a Hijri date differ by one day?', aEn: 'Hijri calendar dates may be based on local moon sighting or a calculated calendar convention. As a result, a date can differ by one day between countries or published calendars.' },
];
