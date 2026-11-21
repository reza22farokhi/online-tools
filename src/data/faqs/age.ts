import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'آیا سال‌های کبیسه لحاظ می‌شوند؟', a: 'بله. محاسبه بر اساس تاریخ واقعی انجام می‌شود و سال‌های کبیسه خودکار در محاسبه روزها لحاظ می‌شوند.', qEn: 'Are leap years included?', aEn: 'Yes. The calculator uses actual calendar dates, so leap days are included automatically when calculating the difference between dates.' },
    { q: 'تاریخ مرجع چیست؟', a: 'تاریخی که می‌خواهید سن را نسبت به آن محاسبه کنید. پیش‌فرض امروز است، اما می‌توانید تاریخ دلخواه وارد کنید.', qEn: 'What is the reference date?', aEn: 'The reference date is the date used to calculate your age. It defaults to today, but you can choose another date to calculate your age at that point in time.' },
    { q: 'آیا می‌توانم سن را بر اساس تقویم شمسی محاسبه کنم؟', a: 'این ابزار از تقویم میلادی برای محاسبه استفاده می‌کند. برای تبدیل، از ابزار مبدل تقویم استفاده کنید.', qEn: 'Can I calculate age using the Persian calendar?', aEn: 'This calculator performs its date calculations using the Gregorian calendar. You can convert a Persian calendar date with the calendar converter before entering it.' },
];
