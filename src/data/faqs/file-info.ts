import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'حداکثر حجم فایل چقدر است؟', a: 'حداکثر ۵۰ مگابایت. برای فایل‌های بزرگ‌تر، محاسبه هش ممکن است حافظه مرورگر را پر کند.', qEn: 'What is the maximum file size?', aEn: 'The maximum supported file size is 50 MB. Hashing very large files can require substantial browser memory, so use a smaller file if your device struggles.' },
    { q: 'هش SHA-256 چه کاربردی دارد؟', a: 'برای بررسی اصالت فایل. اگر هش محاسبه‌شده با هش رسمی مطابقت داشته باشد، فایل دستکاری نشده است.', qEn: 'What is a SHA-256 hash used for?', aEn: 'A SHA-256 digest can help check whether a file matches a trusted reference. Matching hashes indicate the file contents are identical, assuming the reference hash is authentic.' },
    { q: 'آیا فایل به سرور ارسال می‌شود؟', a: 'خیر. تمام محاسبات با FileReader و Web Crypto API در مرورگر شما انجام می‌شود.', qEn: 'Is my file uploaded to a server?', aEn: 'No. The file is read in your browser and its digest is calculated locally with the Web Crypto API. The file contents are not uploaded for hashing.' },
];
