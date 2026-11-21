import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'فرق encodeURIComponent و encodeURI چیست؟', a: 'encodeURIComponent همه کاراکترهای خاص را escape می‌کند (برای پارامترها). encodeURI فقط ضروری‌ها را escape می‌کند (برای URL کامل).' },
    { q: 'چه زمانی از encodeURI استفاده کنم؟', a: 'وقتی می‌خواهید یک URL کامل را برای سرویس دیگر آماده کنید، اما ساختار آن (مثل ://) حفظ شود.' },
    { q: 'آیا متن فارسی پشتیبانی می‌شود؟', a: 'بله. متن فارسی به درصد کدگذاری UTF-8 تبدیل می‌شود و پس از decode دوباره فارسی می‌شود.' },
    { qEn: 'What is the difference between encodeURI and encodeURIComponent?', aEn: 'encodeURI is intended for a complete URI and preserves structural characters such as colons and slashes. encodeURIComponent is intended for an individual component, such as a query parameter value, and escapes a wider set of reserved characters.' },
    { qEn: 'Should I encode a full URL or a query parameter?', aEn: 'Use the full-URL mode when encoding a complete URI while preserving its structure. Use the component mode for individual values, such as search terms or query parameter values, so reserved characters inside the value do not change the URL structure.' },
    { qEn: 'Can I encode and decode Persian or other Unicode text?', aEn: 'Yes. The browser URI functions encode Unicode text as UTF-8 percent-encoded sequences and decode valid sequences back to their original characters.' },
    { qEn: 'Why does decoding sometimes return an error?', aEn: 'Decoding fails when percent escapes are incomplete or the encoded byte sequence is not valid UTF-8. Check that the input was copied completely and use the matching URI or component mode.' },
];
