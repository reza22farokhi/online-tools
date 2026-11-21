import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'طول ایده‌آل عنوان چقدر است؟', a: 'حداکثر ۶۰ کاراکتر. بیشتر از این، در نتایج گوگل با ... بریده می‌شود.', qEn: 'How long should an SEO title be?', aEn: 'There is no fixed character limit guaranteed by Google. Keep titles concise and descriptive; this preview provides an approximate visual guide rather than a ranking rule.' },
    { q: 'طول ایده‌آل توضیحات چقدر است؟', a: 'حداکثر ۱۶۰ کاراکتر برای موبایل و ۱۵۵ کاراکتر برای دسکتاپ.', qEn: 'How long should a meta description be?', aEn: 'Search engines may truncate snippets based on available display width and query context. Write a useful, page-specific description and treat character counts in this preview as guidance, not a strict limit.' },
    { q: 'آیا این پیش‌نمایش دقیقاً همان گوگل است؟', a: 'از نظر محدودیت کاراکتر بله. اما گوگل گاهی متن را بازنویسی می‌کند، بنابراین این پیش‌نمایش قطعی نیست.', qEn: 'Will Google display this exact preview?', aEn: 'Not necessarily. Search engines may rewrite title links or generate snippets from page content, so this preview is an approximation and cannot guarantee the final search result.' },
];
