import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'Base64 Data URI چیست؟', a: 'یک فرمت برای جاسازی فایل در HTML یا CSS به صورت متن. مثال: data:image/png;base64,iVBOR...' },
    { q: 'حداکثر حجم فایل چقدر است؟', a: 'حداکثر ۱۰ مگابایت. برای فایل‌های بزرگ‌تر، مرورگر ممکن است کند شود.' },
    { q: 'آیا می‌توانم از این برای تصاویر سایت استفاده کنم؟', a: 'برای تصاویر کوچک (آیکون، لوگو) بله. برای تصاویر بزرگ توصیه نمی‌شود چون حجم HTML را زیاد می‌کند.' },
    { qEn: 'What is a Base64 Data URL?', aEn: 'A Data URL represents file content as text and includes a media type and Base64 payload, for example data:image/png;base64,... . It can be embedded in HTML or CSS where a URL value is accepted.' },
    { qEn: 'What is the maximum file size?', aEn: 'The maximum supported file size is 10 MB. Large files can consume significant browser memory and may make processing slower.' },
    { qEn: 'Are my files uploaded to a server?', aEn: 'The conversion uses the browser FileReader API to read the selected file locally. The tool does not need to upload the file to a conversion server.' },
    { qEn: 'Should I use Base64 Data URLs for large website images?', aEn: 'Usually not. Base64 adds encoding overhead and can increase the size of HTML or CSS. Data URLs are generally more practical for small assets such as icons or compact images.' },
];
