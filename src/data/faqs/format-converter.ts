import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه فرمت‌هایی پشتیبانی می‌شوند؟', a: 'ورودی: هر فرمت تصویری که مرورگر پشتیبانی می‌کند. خروجی: JPG، PNG یا WebP.', qEn: 'Which image formats are supported?', aEn: 'The converter accepts image formats supported by your browser. Available output formats are JPG, PNG, and WebP.' },
    { q: 'آیا شفافیت حفظ می‌شود؟', a: 'تبدیل به PNG و WebP شفافیت را حفظ می‌کند. تبدیل به JPG شفافیت را حذف و پس‌زمینه سفید می‌کند.', qEn: 'Is image transparency preserved?', aEn: 'PNG and WebP can preserve transparency. JPG does not support transparency, so transparent areas are flattened against a solid background.' },
    { q: 'تبدیل به WebP چه مزیتی دارد؟', a: 'WebP معمولاً ۲۵-۳۴٪ کمتر از JPG/PNG حجم دارد، با همان کیفیت بصری.', qEn: 'Why convert an image to WebP?', aEn: 'WebP often produces smaller files than comparable JPEG or PNG images at similar visual quality. Actual savings depend on the image and encoding settings.' },
];
