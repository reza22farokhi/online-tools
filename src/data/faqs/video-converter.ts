import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  {
    q: 'آیا فایل ویدیویی من به سرور ارسال می‌شود؟',
    a: 'خیر. فایل ورودی با FFmpeg.wasm در حافظه مرورگر پردازش می‌شود و به سرور سایت آپلود نمی‌شود. برای اجرای موتور، فایل‌های JavaScript و WebAssembly از CDN دریافت می‌شوند.',
    qEn: 'Is my video uploaded to a server?',
    aEn: 'No. FFmpeg.wasm processes the selected media in browser memory; the media file is not uploaded to this website. The FFmpeg JavaScript and WebAssembly runtime is downloaded from a CDN.'
  },
  {
    q: 'چه فرمت‌هایی برای خروجی وجود دارد؟',
    a: 'می‌توانید خروجی MP4 با کدک H.264، خروجی WebM با VP9 یا استخراج صدای MP3 را انتخاب کنید. پشتیبانی واقعی به کدک موجود در فایل ورودی و نسخه موتور بستگی دارد.',
    qEn: 'Which output formats are available?',
    aEn: 'Choose MP4 with H.264, WebM with VP9, or extract audio as MP3. Actual compatibility depends on the source codecs and the FFmpeg runtime build.'
  },
  {
    q: 'حداکثر حجم فایل چقدر است؟',
    a: 'سقف انتخاب فایل ۵۰۰ مگابایت است؛ با این حال، پردازش ویدیو به حافظه آزاد دستگاه نیاز دارد. فایل‌های بزرگ ممکن است در گوشی‌ها یا مرورگرهای کم‌حافظه با خطای کمبود حافظه مواجه شوند.',
    qEn: 'What is the maximum file size?',
    aEn: 'The upload-selection limit is 500 MB. Video transcoding still needs substantial device memory, so large files may fail on phones or memory-constrained browsers.'
  }
];
