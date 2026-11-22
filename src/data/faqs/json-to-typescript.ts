import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  {
    q: 'چگونه از نمونه JSON، اینترفیس TypeScript بسازم؟',
    a: 'نمونه JSON را در کادر ورودی قرار دهید و روی تولید TypeScript بزنید. ابزار ساختار اشیا، ویژگی‌های تو‌در‌تو، آرایه‌ها و انواع داده را تشخیص می‌دهد و کد متناظر را تولید می‌کند.',
    qEn: 'How do I generate TypeScript interfaces from a JSON sample?',
    aEn: 'Paste a valid JSON sample into the input and select Generate TypeScript. The tool inspects objects, nested properties, arrays, and primitive values, then creates the corresponding TypeScript declarations.'
  },
  {
    q: 'چه زمانی باید از Type Alias به‌جای Interface استفاده کنم؟',
    a: 'هر دو برای تعریف ساختار داده مناسب‌اند. Interface برای قراردادهای شیء و قابلیت توسعه با extends رایج است؛ Type Alias انعطاف بیشتری برای union و ترکیب انواع دارد. این ابزار امکان انتخاب هر دو خروجی را می‌دهد.',
    qEn: 'When should I use a type alias instead of an interface?',
    aEn: 'Both can describe object shapes. Interfaces are commonly used for extensible object contracts, while type aliases are useful for unions and type compositions. Choose the output style that best matches your project conventions.'
  },
  {
    q: 'آیا JSON واردشده به سرور ارسال می‌شود؟',
    a: 'خیر. تبدیل در مرورگر شما انجام می‌شود و داده ورودی به سرور ارسال نمی‌شود. برای حفظ حریم خصوصی، از واردکردن اطلاعات محرمانه در دستگاه‌های عمومی نیز خودداری کنید.',
    qEn: 'Is my JSON uploaded to a server?',
    aEn: 'No. Type generation runs locally in your browser and the input is not uploaded. As a general precaution, avoid entering confidential data on shared or public devices.'
  }
];
