import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه نوع گرادیانت‌هایی پشتیبانی می‌شوند؟', a: 'خطی با زاویه دلخواه و شعاعی. تا ۵ رنگ در هر گرادیانت.', qEn: 'Which gradient types are supported?', aEn: 'The generator supports linear gradients with an adjustable angle and radial gradients. You can use up to five color stops in a gradient.' },
    { q: 'آیا می‌توانم کد CSS را مستقیماً استفاده کنم؟', a: 'بله. دکمه کپی کد CSS معادل دقیق را در کلیپ‌بورد کپی می‌کند.', qEn: 'Can I use the generated CSS directly?', aEn: 'Yes. Copy the generated CSS declaration and paste it into your stylesheet or component. You can adjust the values later to match your design.' },
    { q: 'ترتیب رنگ‌ها چطور تعیین می‌شود؟', a: 'بر اساس موقعیت (position) هر رنگ. ابزار به‌طور خودکار رنگ‌ها را بر اساس موقعیت مرتب می‌کند.', qEn: 'How is the order of gradient colors determined?', aEn: 'Color stops are arranged by their position along the gradient. The generator sorts them by position when producing the CSS value.' },
];
