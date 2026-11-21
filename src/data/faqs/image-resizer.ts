import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'آیا کاهش اندازه کیفیت را کم می‌کند؟', a: 'کاهش ابعاد کیفیت را حفظ می‌کند (چون پیکسل‌ها حذف می‌شوند). افزایش ابعاد کیفیت را کم می‌کند (چون پیکسل‌ها تکرار می‌شوند).', qEn: 'Does resizing an image reduce its quality?', aEn: 'Reducing dimensions removes pixels and may preserve the perceived sharpness at the smaller size. Enlarging an image requires interpolation and can make it look softer or pixelated.' },
    { q: 'حداکثر ابعاد خروجی چقدر است؟', a: 'حداکثر ۱۰۰۰۰×۱۰۰۰۰ پیکسل. برای تصاویر بسیار بزرگ، محدودیت حافظه مرورگر ممکن است رخ دهد.', qEn: 'What is the maximum output dimension?', aEn: 'The configured maximum output dimension is 10,000 by 10,000 pixels. Very large images can still exceed available browser memory, depending on the device.' },
    { q: 'چه فرمت‌هایی پشتیبانی می‌شوند؟', a: 'همه فرمت‌های تصویری که مرورگر پشتیبانی می‌کند: JPG، PNG، WebP، GIF، BMP و SVG (به صورت رستر).', qEn: 'Which image formats can I resize?', aEn: 'The tool can process image formats supported by your browser, such as JPG, PNG, WebP, GIF, BMP, and SVG. Vector images are rasterized for resizing.' },
];
