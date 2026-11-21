import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'روزهای کاری چگونه محاسبه می‌شوند؟', a: 'روزهای شنبه تا چهارشنبه به عنوان روز کاری و پنجشنبه و جمعه به عنوان تعطیل (مطابق تقویم کاری ایران).', qEn: 'How are working days counted?', aEn: 'The working-day calculation follows the Iranian workweek: Saturday through Wednesday are working days, while Thursday and Friday are treated as non-working days.' },
    { q: 'آیا می‌توانم فاصله منفی داشته باشم؟', a: 'خیر. اگر تاریخ شروع بعد از پایان باشد، به‌طور خودکار جای‌ها عوض می‌شوند.', qEn: 'Can the date difference be negative?', aEn: 'The calculator normalizes the date order. If the start date is later than the end date, the dates are automatically swapped so the interval is non-negative.' },
    { q: 'تفاوت با محاسبه سن چیست؟', a: 'محاسبه سن برای یک تاریخ تولد تا امروز است. این ابزار برای فاصله بین هر دو تاریخ دلخواه.', qEn: 'How is this different from an age calculator?', aEn: 'An age calculator measures the time from a birth date to a reference date. This tool calculates the interval between any two dates you choose.' },
];
