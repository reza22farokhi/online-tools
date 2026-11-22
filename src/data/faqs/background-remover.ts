import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  {
    q: 'آیا عکس من به سرور ارسال می‌شود؟',
    a: 'خیر. فایل تصویر در مرورگر شما پردازش می‌شود و به سرورهای این پلتفرم ارسال نمی‌شود. برای اجرای مدل هوش مصنوعی، فایل‌های مدل ممکن است از شبکه دریافت شوند.',
    qEn: 'Is my photo uploaded to a server?',
    aEn: 'No. Your image is processed in your browser and is not uploaded to this platform. The AI model files may be downloaded to your browser when processing starts.'
  },
  {
    q: 'چه فرمت‌ها و اندازه‌ای پشتیبانی می‌شوند؟',
    a: 'فرمت‌های JPG، PNG، WebP و AVIF با حجم حداکثر ۱۰ مگابایت پشتیبانی می‌شوند. برای جلوگیری از مصرف بیش از حد حافظه، تصویر باید حداکثر ۲۰ مگاپیکسل باشد.',
    qEn: 'Which image formats and sizes are supported?',
    aEn: 'JPG, PNG, WebP, and AVIF files up to 10 MB are supported. Images are limited to 20 megapixels to reduce excessive browser memory use.'
  },
  {
    q: 'چرا اجرای اولیه ممکن است زمان‌بر باشد؟',
    a: 'در اولین اجرا، مرورگر باید فایل‌های مدل هوش مصنوعی و موتور پردازش را دریافت و آماده کند. زمان پردازش به سرعت دستگاه، حافظه و اتصال اینترنت بستگی دارد.',
    qEn: 'Why can the first run take longer?',
    aEn: 'The browser may need to download and initialize the AI model and runtime on the first run. Processing time depends on your device, available memory, and network speed.'
  },
  {
    q: 'چگونه تصویر بدون پس‌زمینه را دانلود کنم؟',
    a: 'پس از پایان پردازش، پیش‌نمایش نتیجه را بررسی کنید و روی دکمه دانلود PNG بزنید. خروجی دارای پس‌زمینه شفاف است.',
    qEn: 'How do I download the transparent image?',
    aEn: 'When processing finishes, review the result and select Download PNG. The exported image preserves transparency.'
  }
];
