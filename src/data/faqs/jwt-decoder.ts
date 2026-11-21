import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  { q: 'آیا JWT Decoder امنیت JWT را تایید می‌کند؟', a: 'خیر. این ابزار فقط محتوا را رمزگشایی می‌کند. تایید امضا باید در سرور با کلید مخفی انجام شود.', qEn: 'Does decoding a JWT verify that it is valid?', aEn: 'No. Decoding only reveals the header and payload; it does not verify the signature or establish that the token is trustworthy. Verify signatures on a trusted server.' },
  { q: 'چرا رمزگشایی JWT هک کردن نیست؟', a: 'چون JWT ذاتاً Base64URL است و هر کسی می‌تواند آن را بخواند. امنیت JWT به امضا بستگی دارد، نه به مخفی بودن محتوا.', qEn: 'Why is decoding a JWT not the same as hacking it?', aEn: 'A typical signed JWT payload is Base64URL-encoded, not encrypted. Anyone who has the token can decode its contents; integrity is provided by signature verification, not secrecy.' },
  { q: 'آیا می‌توانم توکن واقعی اینجا بررسی کنم؟', a: 'بله، چون پردازش ۱۰۰٪ محلی است. اما توکن‌های حساس Production را در اینترنت وارد نکنید.', qEn: 'Can I inspect a real access token here?', aEn: 'The decoder processes the token in your browser, but avoid pasting live production credentials into websites. Treat bearer tokens as secrets and revoke any token that may have been exposed.' },
];
