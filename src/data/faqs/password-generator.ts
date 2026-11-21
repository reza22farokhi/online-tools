import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  { q: 'آیا رمزهای تولید شده امن هستند؟', a: 'بله، این ابزار از الگوریتم رمزنگاری Web Crypto API مرورگر شما استفاده می‌کند. هیچ داده‌ای به سرور ارسال نمی‌شود و رمزها فقط روی دستگاه شما تولید می‌شوند.', qEn: 'Are the generated passwords secure?', aEn: 'Passwords are generated locally with the browser’s Web Crypto API. They are not sent to our servers. Security also depends on choosing a sufficiently long, unique password and storing it safely.' },
  { q: 'طول مناسب برای یک رمز عبور چقدر است؟', a: 'به طور کلی، هرچه رمز طولانی‌تر باشد امن‌تر است. ما حداقل ۱۲ تا ۱۶ کاراکتر را توصیه می‌کنیم که شامل ترکیبی از حروف بزرگ، کوچک، اعداد و نمادها باشد.', qEn: 'How long should a password be?', aEn: 'Use a long, unique password. A passphrase or a randomly generated password of 16 or more characters is a strong practical choice; avoid reusing passwords across accounts.' },
  { q: 'آیا استفاده از نمادها الزامی است؟', a: 'خیر، اما استفاده از نمادها (مانند !@#$%) فضای جستجو برای هکرها را بسیار بزرگ‌تر کرده و شکستن رمز را دشوارتر می‌کند.', qEn: 'Do passwords have to include symbols?', aEn: 'No. Length and randomness matter more than forcing a particular mix of character types. Symbols can increase the search space when they are selected randomly.' },
];
