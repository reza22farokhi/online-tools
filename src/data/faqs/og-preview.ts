import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'Open Graph چیست؟', a: 'استانداردی برای کنترل نحوه نمایش لینک سایت در شبکه‌های اجتماعی مانند تلگرام، واتساپ و فیسبوک.', qEn: 'What is Open Graph?', aEn: 'Open Graph is a metadata protocol that helps social platforms generate link previews using information such as a page title, description, and preview image.' },
    { q: 'تصویر پیش‌نمایش چه ابعادی باید داشته باشد؟', a: 'بهترین ابعاد: ۱۲۰۰×۶۳۰ پیکسل (نسبت ۱.۹۱:۱). حداقل ۶۰۰×۳۱۵ برای عملکرد قابل قبول.', qEn: 'What size should an Open Graph image be?', aEn: 'A common recommended size is 1200 × 630 pixels, with an aspect ratio close to 1.91:1. Use a clear image and keep important content away from the edges.' },
    { q: 'چرا تصویر پیش‌نمایش نشان داده نمی‌شود؟', a: 'ممکن است URL نامعتبر باشد یا شبکه اجتماعی هنوز کش کرده باشد. از Debugger شبکه اجتماعی، کش را پاک کنید.', qEn: 'Why is my social preview image not appearing?', aEn: 'Check that the image URL is publicly reachable and that the page contains the expected Open Graph metadata. A social platform may also be showing a cached preview; use its sharing debugger or cache refresh tool.' },
];
