import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  { q: 'کیفیت خروجی چقدر کاهش می‌یابد؟', a: 'به تنظیم اسلایدر بستگی دارد. کیفیت ۷۰-۸۰٪ معمولاً تفاوت بصری محسوسی ندارد اما حجم را تا ۷۰٪ کاهش می‌دهد.', qEn: 'How much image quality is lost?', aEn: 'The result depends on the quality setting and the source image. Lower settings usually produce smaller files but may introduce visible compression artifacts; preview the result before downloading.' },
  { q: 'چه فرمت‌هایی پشتیبانی می‌شوند؟', a: 'ورودی: JPG، PNG، WebP. خروجی: JPG یا WebP (WebP حجم کمتری دارد).', qEn: 'Which image formats are supported?', aEn: 'The tool accepts JPG, PNG, and WebP images. The available output formats are JPG and WebP; browser support and image transparency can affect the result.' },
  { q: 'آیا از فشرده‌سازی Lossless استفاده می‌کنید؟', a: 'خیر، از فشرده‌سازی Lossy (با افت کیفیت) استفاده می‌شود که برای وب استاندارد است.', qEn: 'Is the compression lossless?', aEn: 'No. This tool uses lossy canvas-based encoding for supported output formats. Keep the original file if you need a lossless copy or must preserve every pixel.' },
];
