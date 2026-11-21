import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه محاسباتی پشتیبانی می‌شوند؟', a: 'سه حالت: X% از Y، X چند درصد Y است، و تغییر درصدی از X به Y.', qEn: 'Which percentage calculations are supported?', aEn: 'The calculator supports three operations: finding X percent of Y, finding what percentage X is of Y, and calculating the percentage change from X to Y.' },
    { q: 'درصد منفی چه معنایی دارد؟', a: 'درصد منفی نشان‌دهنده کاهش است. مثلاً ۱۰٪- از ۱۰۰ = ۱۰- (کاهش ۱۰ واحدی).', qEn: 'What does a negative percentage mean?', aEn: 'A negative percentage change indicates a decrease. For example, a change of -10% from 100 represents a decrease of 10, resulting in 90.' },
    { q: 'آیا اعداد اعشاری پشتیبانی می‌شوند؟', a: 'بله. می‌توانید اعداد اعشاری مانند ۱۲.۵٪ یا ۳.۱۴ را وارد کنید.', qEn: 'Can I enter decimal numbers?', aEn: 'Yes. Decimal values such as 12.5% or 3.14 are supported by the calculator.' },
];
