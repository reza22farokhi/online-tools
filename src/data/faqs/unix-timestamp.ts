import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'Timestamp یونیکس چیست؟', a: 'تعداد ثانیه‌های گذشته از ۱ ژانویه ۱۹۷۰ (UTC). یک استاندارد جهانی برای نمایش زمان در سیستم‌های کامپیوتری.' },
    { q: 'آیا Timestamp منطقه زمانی دارد؟', a: 'Timestamp یونیکس همیشه UTC است. تبدیل به زمان محلی بر اساس منطقه زمانی مرورگر شما انجام می‌شود.' },
    { q: 'چرا Timestamp من میلی‌ثانیه است؟', a: 'جاوااسکریپت از میلی‌ثانیه استفاده می‌کند (Date.now())، اما Unix استاندارد از ثانیه. این ابزار هر دو را پشتیبانی می‌کند.' },
    { qEn: 'What is a Unix timestamp?', aEn: 'A Unix timestamp represents the time elapsed since 00:00:00 UTC on January 1, 1970. Standard Unix timestamps are expressed in seconds, although many programming environments also use milliseconds.' },
    { qEn: 'Does a Unix timestamp depend on my time zone?', aEn: 'No. A Unix timestamp represents an absolute point in time and is not tied to a time zone. The displayed calendar date and clock time can vary according to the browser’s local time zone.' },
    { qEn: 'How can I tell whether a timestamp is in seconds or milliseconds?', aEn: 'Second-based timestamps are typically around 10 digits, while millisecond-based JavaScript timestamps are typically around 13 digits. This converter detects the unit using the input magnitude and supports both.' },
    { qEn: 'Why is the displayed time different from UTC?', aEn: 'The timestamp itself is UTC-based. A difference in the displayed clock time usually means the result is being formatted in your device’s local time zone.' },
];
