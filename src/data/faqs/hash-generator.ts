import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه الگوریتم‌هایی پشتیبانی می‌شوند؟', a: 'SHA-1، SHA-256، SHA-384 و SHA-512 از طریق Web Crypto API مرورگر.' },
    { q: 'چرا MD5 پشتیبانی نمی‌شود؟', a: 'MD5 از نظر امنیتی شکسته شده است. Web Crypto استاندارد آن را ارائه نمی‌دهد.' },
    { q: 'آیا هش برگشت‌پذیر است؟', a: 'خیر. توابع هش یک‌طرفه هستند. برای بازگشت، از رمزنگاری (مثل AES) استفاده کنید، نه هش.' },
    { qEn: 'Which hash algorithms can I generate?', aEn: 'The tool supports SHA-1, SHA-256, SHA-384, and SHA-512 through the browser Web Crypto API. The output is shown as a hexadecimal digest.' },
    { qEn: 'Can I use a SHA hash to store passwords?', aEn: 'No. General-purpose SHA hashes are not suitable for password storage. Use a password-hashing function designed for that purpose, such as Argon2id, scrypt, or bcrypt, with a unique salt.' },
    { qEn: 'Is a hash reversible or decryptable?', aEn: 'No. A cryptographic hash is designed to be one-way; it does not contain a decryption key. If you need to recover the original data, use encryption rather than hashing.' },
    { qEn: 'Is SHA-1 safe for security-sensitive uses?', aEn: 'No. SHA-1 has known collision weaknesses and should not be selected for new security-sensitive applications. Prefer SHA-256 or a stronger supported SHA-2 algorithm.' },
];
