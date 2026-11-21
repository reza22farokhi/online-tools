import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'فایل robots.txt چه کاری انجام می‌دهد؟', a: 'به خزنده‌های موتور جستجو می‌گوید کدام بخش‌های سایت را می‌توانند بخزند و کدام را نه.', qEn: 'What does a robots.txt file do?', aEn: 'A robots.txt file gives compliant crawlers instructions about which paths on a website they may or may not request. It is a crawl-control mechanism, not an access-control system.' },
    { q: 'آیا robots.txt مانع ایندکس می‌شود؟', a: 'نه لزوماً. robots.txt از خزش جلوگیری می‌کند اما گاهی صفحات با لینک خارجی همچنان ایندکس می‌شوند. برای جلوگیری کامل از noindex استفاده کنید.', qEn: 'Does robots.txt prevent a page from being indexed?', aEn: 'Not reliably. Blocking crawling does not guarantee that a URL will stay out of search results. If you need a page excluded, allow crawlers to access an appropriate noindex directive or use another supported removal method.' },
    { q: 'آیا باید در ریشه سایت باشد؟', a: 'بله، دقیقاً در آدرس yourdomain.com/robots.txt (نه در زیرپوشه).', qEn: 'Where should robots.txt be published?', aEn: 'Publish it at the root of the host, for example https://example.com/robots.txt. A file placed in a subdirectory does not control crawling for the entire host.' },
];
