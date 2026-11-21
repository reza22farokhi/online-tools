import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'آیا Base64 یک روش رمزنگاری است؟', a: 'خیر. Base64 فقط کدگذاری است و هر کسی می‌تواند آن را رمزگشایی کند. برای امنیت، از AES استفاده کنید.' },
    { q: 'حالت URL-safe چه تفاوتی دارد؟', a: 'در این حالت، کاراکترهای + و / با - و _ جایگزین می‌شوند تا در URL بدون escape استفاده شوند.' },
    { q: 'آیا متن فارسی پشتیبانی می‌شود؟', a: 'بله. این ابزار از UTF-8 کامل پشتیبانی می‌کند، پس تمام کاراکترهای یونیکد درست رمزگشایی می‌شوند.' },
    { qEn: 'Is Base64 encryption?', aEn: 'No. Base64 is an encoding format, not encryption. Anyone who has the encoded value can decode it, so never use Base64 to protect passwords, tokens, or confidential data.' },
    { qEn: 'What does URL-safe Base64 change?', aEn: 'URL-safe mode replaces + with - and / with _. It also removes trailing padding characters (=), making the output easier to place in URLs and filenames.' },
    { qEn: 'Does the Base64 tool support Unicode and non-English text?', aEn: 'Yes. Text is encoded as UTF-8 before Base64 conversion, so Persian and other Unicode characters can be encoded and decoded correctly when the input is valid UTF-8.' },
];
