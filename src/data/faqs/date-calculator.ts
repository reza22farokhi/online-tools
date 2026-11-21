import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'آیا می‌توانم تاریخ را به عقب ببرم؟', a: 'بله. با انتخاب کم کردن می‌توانید روز، هفته، ماه یا سال از تاریخ کم کنید.', qEn: 'Can I subtract time from a date?', aEn: 'Yes. Choose the subtract operation to move backward by a selected number of days, weeks, months, or years.' },
    { q: 'ماه‌ها چگونه محاسبه می‌شوند؟', a: 'افزودن ۱ ماه به ۳۱ ژانویه، به ۲۸ یا ۲۹ فوریه (بسته به سال کبیسه) منتهی می‌شود.', qEn: 'How are calendar months handled?', aEn: 'Calendar arithmetic respects the length of each month. For example, adding one month to January 31 results in a date at the end of February, with the day depending on whether the year is a leap year.' },
    { q: 'آیا نتیجه در تقویم شمسی نمایش داده می‌شود؟', a: 'بله. نتیجه هم در شمسی، هم میلادی، هم قمری نمایش داده می‌شود.', qEn: 'Can I view the result in different calendars?', aEn: 'Yes. The result is available in Persian (Jalali), Gregorian, and Hijri calendar formats.' },
];
