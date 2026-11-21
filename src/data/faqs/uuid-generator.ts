import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'UUID نسخه ۴ چه ویژگی دارد؟', a: 'کاملاً تصادفی و مبتنی بر اعداد تصادفی امن (crypto.randomUUID). احتمال تکرار عملاً صفر است.' },
    { q: 'آیا برای شناسه دیتابیس مناسب است؟', a: 'بله. برای شناسه‌های یکتا در دیتابیس بسیار مناسب است، اما حجم بیشتری نسبت به اعداد سریالی دارد.' },
    { q: 'حداکثر چند UUID می‌توانم تولید کنم؟', a: 'در هر بار حداکثر ۱۰۰۰ عدد. برای تعداد بیشتر، چند بار متوالی اجرا کنید.' },
    { qEn: 'What is a version 4 UUID?', aEn: 'A UUID v4 is a 128-bit identifier generated using random values. This tool uses the browser cryptographic random API when available and sets the version and variant bits required by the UUID format.' },
    { qEn: 'Can I use generated UUIDs as database IDs?', aEn: 'Yes. UUIDs are commonly used as unique identifiers across databases and distributed systems. They are longer than sequential integer IDs, so consider your database indexing and storage requirements.' },
    { qEn: 'How many UUIDs can I generate at once?', aEn: 'You can generate up to 1,000 UUIDs in one operation. The output can also be formatted in uppercase or without hyphens.' },
    { qEn: 'Are UUIDs guaranteed never to collide?', aEn: 'No identifier scheme can provide an absolute mathematical guarantee of uniqueness. UUID v4 has an extremely large random space, making accidental collisions extraordinarily unlikely when generated with a cryptographically secure random source.' },
];
