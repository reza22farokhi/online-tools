export type Theme = 'light' | 'dark';
export type Lang = 'fa' | 'en';

const THEME_KEY = 'pot.theme';
const LANG_KEY = 'pot.lang';
const FAV_KEY = 'pot.favorites';
const RECENT_KEY = 'pot.recent';
const RECENT_MAX = 6;

const TOOL_TEXT_EN: Record<string, string> = {
  'عملیات': 'Operations',
  'ورودی': 'Input',
  'خروجی:': 'Output:',
  'خروجی': 'Output',
  'پاک کردن': 'Clear',
  'کپی خروجی': 'Copy output',
  'کپی هش': 'Copy hash',
  'کپی': 'Copy',
  'کپی شد': 'Copied',
  'کپی نشد': 'Copy failed',
  'خطا:': 'Error:',
  'خطا': 'Error',
  'نامشخص': 'Unknown',
  'JSON ورودی': 'Input JSON',
  'JSON را جای‌گذاری کنید. حداکثر ۱۰۰ هزار کاراکتر. پردازش کاملاً محلی.': 'Paste JSON here. Maximum 100,000 characters. Processed entirely in your browser.',
  'تورفتگی:': 'Indentation:',
  '۲ فاصله': '2 spaces',
  '۴ فاصله': '4 spaces',
  'پس از جای‌گذاری JSON، خروجی اینجا نمایش داده می‌شود...': 'The formatted JSON will appear here...',
  'متن یا Base64 را اینجا وارد کنید...': 'Enter text or Base64 here...',
  'حداکثر ۱۰۰ هزار کاراکتر. پردازش کاملاً محلی.': 'Maximum 100,000 characters. Processed entirely in your browser.',
  'حالت URL-safe (بدون +/ و =، مناسب URL)': 'URL-safe mode (without +/ or =, suitable for URLs)',
  'خروجی اینجا نمایش داده می‌شود...': 'Output will appear here...',
  'متن ورودی': 'Input text',
  'متن خود را وارد کنید...': 'Enter your text...',
  'حداکثر ۱ میلیون کاراکتر. محاسبه محلی و امن. اتصال امن (HTTPS) لازم است.': 'Maximum 1 million characters. Computed locally and securely. A secure HTTPS connection is required.',
  'الگوریتم:': 'Algorithm:',
  'هش (hex):': 'Hash (hex):',
  'هش کپی شد': 'Hash copied',
  'Escape (تبدیل به entity)': 'Escape (convert to HTML entities)',
  'Unescape (بازگردانی)': 'Unescape (decode HTML entities)',
  'مثلاً: <a href="x">لینک</a>': 'Example: <a href="x">link</a>',
  'تاریخ تولد': 'Date of birth',
  'تاریخ مرجع (پیش‌فرض: امروز)': 'Reference date (default: today)',
  'سال': 'Years',
  'ماه': 'Months',
  'روز': 'Days',
  'کل روزها': 'Total days',
  'کل هفته‌ها': 'Total weeks',
  'کل ماه‌ها': 'Total months',
  'کل ساعت‌ها': 'Total hours',
  'کل دقیقه‌ها': 'Total minutes',
  'روز تا تولد بعدی': 'Days until next birthday',
  'تاریخ تولد نامعتبر است': 'Invalid date of birth',
  'تاریخ مرجع نامعتبر است': 'Invalid reference date',
  'تاریخ تولد نمی‌تواند بعد از تاریخ مرجع باشد': 'Date of birth cannot be after the reference date',
  'رمز عبور اینجا نمایش داده می‌شود': 'Your password will appear here',
  'تولید رمز عبور جدید': 'Generate new password',
  'طول رمز:': 'Password length:',
  'شامل حروف بزرگ (A-Z)': 'Include uppercase letters (A-Z)',
  'شامل حروف کوچک (a-z)': 'Include lowercase letters (a-z)',
  'شامل اعداد (0-9)': 'Include numbers (0-9)',
  'شامل نمادها (!@#$%)': 'Include symbols (!@#$%)',
  'حداقل یک گزینه را انتخاب کنید!': 'Select at least one option!',
  'الگوی Regex': 'Regex pattern',
  'متن تست:': 'Test text:',
  'متن خود را اینجا وارد کنید...': 'Enter your text here...',
  'نمایش هایلایت:': 'Highlighted preview:',
  'لیست تطابق‌ها:': 'Match list:',
  'خطا در اجرای Worker': 'Worker execution error',
  'الگو خالی است': 'Pattern is empty',
  'در حال اجرا...': 'Running...',
  'هیچ تطابقی پیدا نشد': 'No matches found',
  '(خالی)': '(empty)',
  'حالت:': 'Mode:',
  'encodeURIComponent (برای یک مقدار)': 'encodeURIComponent (for a single component)',
  'encodeURI (برای URL کامل)': 'encodeURI (for a complete URL)',
  'از تاریخ': 'From date',
  'تا تاریخ': 'To date',
  'روزهای کاری': 'Business days',
  'روزهای تعطیل': 'Weekend days (Friday/Saturday)',
  'تاریخ نامعتبر است': 'Invalid date',
  'خطا در محاسبه': 'Calculation error',
  'حالت محاسبه': 'Calculation mode',
  'تغییر درصدی': 'Percentage change',
  'مقدار (X)': 'Value (X)',
  'از مقدار (Y)': 'Of value (Y)',
  'کل (Y)': 'Total (Y)',
  'مقدار اولیه (X)': 'Initial value (X)',
  'مقدار نهایی (Y)': 'Final value (Y)',
  'تقسیم بر صفر ممکن نیست': 'Division by zero is not possible',
  'مقدار اولیه نمی‌تواند صفر باشد': 'The initial value cannot be zero',
  'افزایش': 'Increase',
  'کاهش': 'Decrease',
  'بدون تغییر': 'No change',
  'دسته:': 'Category:',
  'مقدار:': 'Value:',
  'نتیجه:': 'Result:',
  'از:': 'From:',
  'به:': 'To:',
  'تعداد:': 'Count:',
  'حروف بزرگ': 'Uppercase',
  'بدون خط تیره': 'No hyphens',
  'تولید': 'Generate',
  'UUIDها:': 'UUIDs:',
  'برای تولید، روی دکمه کلیک کنید...': 'Click Generate to create UUIDs...',
  'کپی همه': 'Copy all',
  'UUIDها کپی شد': 'UUIDs copied',
  'شمسی (جلالی)': 'Jalali',
  'میلادی (گرگوری)': 'Gregorian',
  'قمری (هجری)': 'Hijri',
  'همه فیلدها را پر کنید': 'Please fill in all fields',
  'تایم‌استمپ فعلی (Unix):': 'Current Unix timestamp:',
  'Timestamp → تاریخ': 'Timestamp → Date',
  'تاریخ → Timestamp': 'Date → Timestamp',
  'Timestamp (ثانیه):': 'Timestamp (seconds):',
  'Timestamp (میلی‌ثانیه):': 'Timestamp (milliseconds):',
  'عدد نامعتبر': 'Invalid number',
  'تایم‌استمپ نامعتبر': 'Invalid timestamp',
  'نمونه': 'Sample',
  'تبدیل': 'Convert',
  'پاک': 'Clear',
  'امروز': 'Today',
  'فایل:': 'File:',
  'برای انتخاب فایل کلیک کنید': 'Click to choose a file',
  'برای انتخاب فایل کلیک کنید یا آن را اینجا رها کنید': 'Click to choose a file or drop it here',
  'حداکثر حجم: ۵۰ مگابایت (پردازش محلی)': 'Maximum size: 50 MB (processed locally)',
  'حداکثر ۱۰ مگابایت (پردازش محلی)': 'Maximum size: 10 MB (processed locally)',
  'نام فایل': 'File name',
  'نوع (MIME)': 'Type (MIME)',
  'پسوند': 'Extension',
  'هش SHA-256:': 'SHA-256 hash:',
  'در حال محاسبه...': 'Calculating...',
  'در حال محاسبه هش...': 'Calculating hash...',
  'در حال تبدیل...': 'Converting...',
  'متن Base64 (Data URI):': 'Base64 text (Data URI):',
  'کپی متن Base64': 'Copy Base64 text',
  'Base64 کپی شد': 'Base64 copied',
  'یک پردازش در حال انجام است. لطفاً کمی صبر کنید.': 'A process is already running. Please wait.',
  'یک پردازش در حال انجام است.': 'A process is already running.',
  'خطای نامشخص در فایل.': 'Unknown file error.',
  'تاریخ پایه نامعتبر (مثل 1403/01/01)': 'Invalid base date (e.g. 1403/01/01)',
  'مقدار نامعتبر': 'Invalid amount',
  'تبدیل به میلادی': 'Convert to Gregorian',
  'تبدیل به شمسی': 'Convert to Jalali',
  'نمایش اطلاعات': 'Show information',
  'تاریخ نامعتبر': 'Invalid date',
  'تاریخ پایه (شمسی):': 'Base date (Jalali):',
  'واحد:': 'Unit:',
  'اضافه (+)': 'Add (+)',
  'کم کردن (−)': 'Subtract (−)',
  'روز هفته': 'Day of week',
  'شمسی': 'Jalali',
  'میلادی': 'Gregorian',
  'قمری': 'Hijri',
  'نوع تبدیل': 'Conversion type',
  'حروف کوچک': 'lowercase',
  'عنوان': 'Title Case',
  'جمله': 'Sentence case',
  'یک‌درمیان': 'Alternating case',
  'هر خط یک آیتم. مثال:': 'One item per line. Example:',
  'نوع مرتب‌سازی:': 'Sort order:',
  'گزینه‌ها:': 'Options:',
  'حذف فاصله ابتدا/انتهای هر خط': 'Trim whitespace at the start/end of each line',
  'حذف خطوط خالی': 'Remove empty lines',
  'حذف خطوط تکراری': 'Remove duplicate lines',
  'مقایسه بدون حساسیت به حروف بزرگ/کوچک': 'Case-insensitive comparison',
  'مرتب‌سازی عددی (برای اعداد)': 'Numeric sorting (for numbers)',
  'مقایسه بدون حساسیت به حروف (A = a)': 'Case-insensitive comparison (A = a)',
  'حذف فاصله ابتدا/انتهای هر خط پیش از مقایسه': 'Trim each line before comparison',
  'خطوط یکتا:': 'Unique lines:',
  'تکراری حذف‌شده:': 'Duplicates removed:',
  'حذف فاصله‌های تکراری (چند فاصله ← یک فاصله)': 'Collapse repeated spaces (multiple spaces → one)',
  'حذف فاصله ابتدا و انتهای هر خط': 'Trim each line',
  'حذف فاصله ابتدا و انتهای کل متن': 'Trim the entire text',
  'اصلاح حروف عربی (ي، ك)': 'Normalize Arabic characters (ي, ك)',
  'اصلاح نیم‌فاصله (می‌روم، کتاب‌ها)': 'Fix Persian half-spaces (می‌روم، کتاب‌ها)',
  'اصلاح علائم نگارشی': 'Normalize punctuation',
  'تبدیل اعداد به فارسی': 'Convert digits to Persian',
  'متن اصلاح شده...': 'Refined text...',
  'کپی متن': 'Copy text',
  'خطا در کپی': 'Copy failed',
  'عنوان صفحه (Title)': 'Page title (Title)',
  'توضیحات (Description)': 'Description',
  'آدرس سایت (URL)': 'Website URL',
  'نویسنده / برند (Author)': 'Author / brand',
  'آدرس تصویر (Image URL)': 'Image URL',
  'کد HTML تولید شده:': 'Generated HTML:',
  'کد متا کپی شد': 'Meta tags copied',
  'توضیح مختصر و جذاب...': 'A short, engaging description...',
  'مثلاً: ابزارهای آنلاین حرفه‌ای': 'e.g. Professional online tools',
  'مثلاً: تیم ما': 'e.g. Our team',
  'عنوان جذاب...': 'An engaging title...',
  'توضیحات کوتاه...': 'A short description...',
  'پیش‌نمایش در شبکه‌های اجتماعی:': 'Social media preview:',
  'تصویر پیش‌نمایش': 'Image preview',
  'عنوان لینک شما در اینجا نمایش داده می‌شود': 'Your link title will appear here',
  'توضیحات لینک شما در اینجا نمایش داده می‌شود. این متن از تگ‌های Open Graph خوانده می‌شود.': 'Your link description will appear here. This text is read from Open Graph tags.',
  'آدرس نقشه سایت (Sitemap URL)': 'Sitemap URL',
  'مسیرهای غیرمجاز (Disallow) - هر خط یک مسیر': 'Disallowed paths (Disallow) — one path per line',
  'مسیرهای مجاز (Allow - اختیاری) - هر خط یک مسیر': 'Allowed paths (Allow — optional) — one path per line',
  'محتوای فایل robots.txt:': 'robots.txt file contents',
  'محتوای robots.txt کپی شد': 'robots.txt content copied',
  'آدرس صفحه (URL)': 'Page URL',
  'عنوان جذاب برای گوگل...': 'An engaging title for Google...',
  'توضیحات متا...': 'Meta description...',
  'پیش‌نمایش در گوگل (دسکتاپ):': 'Google preview (desktop):',
  'عنوان صفحه شما در اینجا نمایش داده می‌شود': 'Your page title will appear here',
  'توضیحات متا شما در اینجا نمایش داده می‌شود. سعی کنید آن را جذاب و مرتبط با محتوای صفحه بنویسید تا کاربران روی لینک شما کلیک کنند.': 'Your meta description will appear here. Make it engaging and relevant to encourage users to click your link.',
  'کاراکتر': 'characters',
  'آدرس نقشه سایت باید از HTTP یا HTTPS استفاده کند.': 'Sitemap URL must use HTTP or HTTPS.',
  'آدرس نقشه سایت معتبر وارد کنید.': 'Enter a valid sitemap URL.',
  'آدرس نقشه سایت باید HTTP یا HTTPS باشد و نباید اطلاعات ورود داشته باشد.': 'Sitemap URL must use HTTP or HTTPS and must not contain credentials.',
  'آدرس نقشه سایت نباید شامل نویسه‌های کنترلی باشد.': 'Sitemap URL must not contain control characters.',
  'User-agent نباید شامل نویسه‌های کنترلی باشد.': 'User-agent must not contain control characters.',
  'مسیر غیرمجاز نباید شامل نویسه‌های کنترلی باشد.': 'Disallow path must not contain control characters.',
  'مسیر مجاز نباید شامل نویسه‌های کنترلی باشد.': 'Allow path must not contain control characters.',
  'مسیر غیرمجاز نباید فاصله داشته باشد.': 'Disallow path must not contain spaces.',
  'مسیر مجاز نباید فاصله داشته باشد.': 'Allow path must not contain spaces.',
  'مقدار User-agent شامل نویسه‌های پشتیبانی‌نشده است.': 'User-agent contains unsupported characters.',
  'این مرورگر اجرای ایمن Regex در Worker را پشتیبانی نمی‌کند': 'This browser does not support safe Regex execution in a Worker.',
  'امکان راه‌اندازی Worker برای اجرای ایمن Regex وجود ندارد': 'A Worker could not be started for safe Regex execution.',
  'صعودی (A→Z)': 'Ascending (A→Z)',
  'نزولی (Z→A)': 'Descending (Z→A)',
  'کوتاه به بلند': 'Shortest to longest',
  'بلند به کوتاه': 'Longest to shortest',
  'معکوس ترتیب اصلی': 'Reverse original order',
  'Slug کپی شد': 'Slug copied',
  'جداکننده:': 'Separator:',
  'خط تیره (-)': 'Hyphen (-)',
  'زیرخط (_)': 'Underscore (_)',
  'حداکثر طول:': 'Maximum length:',
  'حذف اعراب لاتین (é → e)': 'Remove Latin diacritics (é → e)',
  'تبدیل فارسی به لاتین (تقریبی)': 'Transliterate Persian to Latin (approximate)',
  'کلمه': 'Words',
  'بدون فاصله': 'Characters without spaces',
  'خط': 'Lines',
  'پاراگراف': 'Paragraphs',
  'دقیقه خواندن': 'Reading time (minutes)',
  'آمار کپی شد': 'Statistics copied',
  'کلمات:': 'Words:',
  'کاراکترها:': 'Characters:',
  'جمله‌ها:': 'Sentences:',
  'خطوط:': 'Lines:',
  'پاراگراف‌ها:': 'Paragraphs:',
  'زمان خواندن (دقیقه):': 'Reading time (minutes):',
  'متن اول (قدیمی)...': 'First text (original)...',
  'متن دوم (جدید)...': 'Second text (new)...',
  'مقایسه متن‌ها': 'Compare texts',
  'حداکثر ۱ میلیون کاراکتر. پردازش کاملاً محلی و بدون ارسال به سرور.': 'Maximum 1 million characters. Processed locally and never sent to the server.',
  'این ابزار برای اصلاح متن فارسی طراحی شده است؛ متن انگلیسی ممکن است تغییری نکند.': 'This tool is designed to refine Persian text; English text may remain unchanged.',
  'Encode (به Base64)': 'Encode to Base64',
  'Decode (از Base64)': 'Decode from Base64',
  'متن یا URL را اینجا وارد کنید...': 'Enter text or a URL here...',
  'رمز عبور کپی شد': 'Password copied',
  'تولید UUID امن در این مرورگر در دسترس نیست.': 'Secure UUID generation is not available in this browser.',
  'توکن JWT را اینجا جای‌گذاری کنید...': 'Paste a JWT here...',
  'پردازش ۱۰۰٪ محلی. امضای توکن تایید نمی‌شود (برای تایید، به کلید مخفی سرور نیاز است).': '100% local processing. The token signature is not verified (verification requires the server secret key).',
  'رمزگشایی': 'Decode',
  'توکن منقضی شده است؛ امضا بررسی نشده': 'Token has expired; signature not verified',
  'توکن منقضی نشده است؛ امضا بررسی نشده': 'Token has not expired; signature not verified',
  'تاریخ انقضا (exp) در توکن وجود ندارد؛ امضا بررسی نشده': 'No expiration (exp) claim is present; signature not verified',
  'امضا در مرورگر تایید نمی‌شود. برای تایید اصالت، آن را در سرور با کلید مخفی بررسی کنید.': 'The signature is not verified in the browser. Verify authenticity on the server using the secret key.',
  'صادر شده (iat)': 'Issued at (iat)',
  'معتبر از (nbf)': 'Not before (nbf)',
  'انقضا (exp)': 'Expires at (exp)',
  'طول توکن بیش از حد مجاز است (حداکثر ۱۰٬۰۰۰ نویسه).': 'Token exceeds the maximum allowed length (10,000 characters).',
  'متن یا لینک خود را وارد کنید:': 'Enter text or a link:',
  'اندازه تصویر (پیکسل):': 'Image size (pixels):',
  'تولید کد QR': 'Generate QR code',
  'دانلود تصویر': 'Download image',
  'لطفاً متنی برای تبدیل وارد کنید.': 'Please enter text to encode.',
  'حجم متن برای ساخت QR بیش از حد مجاز است (حداکثر ۲۰۰۰ بایت).': 'QR content is too large (maximum 2,000 bytes).',
  'خطایی در تولید کد QR رخ داد. متن کوتاه‌تری وارد کنید.': 'QR generation failed. Try a shorter input.',
  'برای انتخاب تصویر کلیک کنید یا آن را اینجا رها کنید': 'Click to choose an image or drop it here',
  'حداکثر ۲۰ مگابایت (پردازش محلی)': 'Maximum 20 MB (processed locally)',
  'روی هر نقطه از تصویر کلیک کنید تا کد رنگ آن را ببینید.': 'Click any point in the image to inspect its color.',
  'فرمت تصویر پشتیبانی نمی‌شود. PNG، JPEG، WebP، GIF، AVIF یا BMP انتخاب کنید.': 'Unsupported image format. Choose PNG, JPEG, WebP, GIF, AVIF, or BMP.',
  'حجم فایل باید بیشتر از صفر و حداکثر ۲۰ مگابایت باشد.': 'File size must be greater than zero and no more than 20 MB.',
  'ابعاد تصویر بیش از حد مجاز است (حداکثر ۲۰ مگاپیکسل).': 'Image dimensions exceed the limit (maximum 20 megapixels).',
  'بوم تصویر در دسترس نیست.': 'Image canvas is unavailable.',
  'امکان پردازش تصویر در این مرورگر وجود ندارد.': 'This browser cannot process the image.',
  'خواندن تصویر ناموفق بود. یک فایل تصویری معتبر انتخاب کنید.': 'Could not read the image. Choose a valid image file.',
  'خواندن پیکسل تصویر ممکن نشد.': 'Could not read the image pixel.',
  'HEX کپی شد': 'HEX copied',
  'RGB کپی شد': 'RGB copied',
  'X چند درصد Y است': 'What percentage of Y is X?',
  'تغییر از X به Y': 'Percentage change from X to Y',
  'درصد (X)': 'Percentage (X)',
  'ژانویه': 'January',
  'فوریه': 'February',
  'مارس': 'March',
  'آوریل': 'April',
  'مه': 'May',
  'ژوئن': 'June',
  'ژوئیه': 'July',
  'اوت': 'August',
  'سپتامبر': 'September',
  'اکتبر': 'October',
  'نوامبر': 'November',
  'دسامبر': 'December',
  'محرم': 'Muharram',
  'صفر': 'Safar',
  'ربیع‌الاول': 'Rabi al-Awwal',
  'ربیع‌الثانی': 'Rabi al-Thani',
  'جمادی‌الاول': 'Jumada al-Awwal',
  'جمادی‌الثانی': 'Jumada al-Thani',
  'رجب': 'Rajab',
  'شعبان': 'Shaban',
  'رمضان': 'Ramadan',
  'شوال': 'Shawwal',
  'ذی‌القعده': 'Dhu al-Qidah',
  'ذی‌الحجه': 'Dhu al-Hijjah',
  'تاریخ شمسی (مثل 1403/01/01):': 'Jalali date (e.g. 1403/01/01):',
  'تاریخ شمسی (مثل 1403/01/01)': 'Jalali date (e.g. 1403/01/01)'
  'جداکننده CSV باید دقیقاً یک نویسه معتبر باشد.': 'CSV delimiter must be exactly one valid character.',
  'پس از پایان فیلد نقل‌قول‌شده، نویسه غیرمجاز وجود دارد.': 'Unexpected character after a quoted CSV field.',
  'نقل‌قول باید در ابتدای فیلد CSV باشد.': 'A quote must appear at the beginning of a CSV field.',
  'فیلد نقل‌قول‌شده در CSV بسته نشده است.': 'A quoted CSV field was not closed.',
  'JSON باید آرایه‌ای از اشیا باشد.': 'JSON must be an array of objects.',
  'هر ردیف JSON باید یک شیء باشد.': 'Each JSON row must be an object.'
};
const TOOL_TEXT_PREFIX_EN: Array<[RegExp, string]> = [
  [/^خطا:\s*/, 'Error: '],
  [/^تایم‌اوت ۲ ثانیه — الگو ممکن است خطرناک باشد \(ReDoS\)$/, 'Timed out after 2 seconds — the pattern may be unsafe (ReDoS)'],
  [/^([0-9۰-۹,٬]+) تطابق پیدا شد$/, '$1 matches found'],
  [/^\.\.\. و ([0-9۰-۹,٬]+) نتیجه دیگر$/, '... and $1 more results'],
  [/^خطا در محاسبه هش:\s*/, 'Error calculating hash: '],
  [/^خطا در تبدیل فایل:\s*/, 'Error converting file: '],
  [/^تاریخ نامعتبر:\s*/, 'Invalid date: '],
  [/^خطوط یکتا:\s*([0-9۰-۹,٬]+)$/, 'Unique lines: $1'],
  [/^(.+)٪ از (.+) = (.+)$/, '$1% of $2 = $3'],
  [/^تکراری حذف‌شده:\s*([0-9۰-۹,٬]+)$/, 'Duplicates removed: $1'],
  [/^WCAG (AA|AAA) \\(متن (معمولی|بزرگ)\\) \\(حداقل ([0-9.]+):1\\)$/, 'WCAG $1 ($2 text, minimum $3:1)']
];
const TOOL_DATE_WORDS_EN: Record<string, string> = {
  'فروردین': 'Farvardin', 'اردیبهشت': 'Ordibehesht', 'خرداد': 'Khordad', 'تیر': 'Tir',
  'مرداد': 'Mordad', 'شهریور': 'Shahrivar', 'مهر': 'Mehr', 'آبان': 'Aban', 'آذر': 'Azar',
  'دی': 'Dey', 'بهمن': 'Bahman', 'اسفند': 'Esfand',
  'ژانویه': 'January', 'فوریه': 'February', 'مارس': 'March', 'آوریل': 'April',
  'مه': 'May', 'ژوئن': 'June', 'ژوئیه': 'July', 'اوت': 'August', 'سپتامبر': 'September',
  'اکتبر': 'October', 'نوامبر': 'November', 'دسامبر': 'December',
  'محرم': 'Muharram', 'صفر': 'Safar', 'ربیع‌الاول': 'Rabi al-Awwal',
  'ربیع‌الثانی': 'Rabi al-Thani', 'جمادی‌الاول': 'Jumada al-Awwal',
  'جمادی‌الثانی': 'Jumada al-Thani', 'رجب': 'Rajab', 'شعبان': 'Shaban',
  'رمضان': 'Ramadan', 'شوال': 'Shawwal', 'ذی‌القعده': 'Dhu al-Qidah',
  'ذی‌الحجه': 'Dhu al-Hijjah',
  'شنبه': 'Saturday', 'یکشنبه': 'Sunday', 'دوشنبه': 'Monday', 'سه‌شنبه': 'Tuesday',
  'چهارشنبه': 'Wednesday', 'پنجشنبه': 'Thursday', 'جمعه': 'Friday'
};

function translateToolDateText(value: string): string {
  let result = value;
  const dateWords = Object.entries(TOOL_DATE_WORDS_EN).sort((a, b) => b[0].length - a[0].length);
  for (const [fa, en] of dateWords) result = result.replaceAll(fa, en);
  return result.replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
}

const toolTextOriginal = new WeakMap<Text, string>();
const toolAttributeOriginal = new WeakMap<Element, Map<string, string>>();
let toolTranslationObserver: MutationObserver | null = null;
let toolTranslationObservedBody: HTMLElement | null = null;

function translatedToolText(value: string, lang: Lang): string {
  const trimmed = value.trim();
  if (lang === 'fa') return value;
  const exact = TOOL_TEXT_EN[trimmed];
  if (exact !== undefined) return value.replace(trimmed, exact);
  for (const [pattern, replacement] of TOOL_TEXT_PREFIX_EN) {
    if (pattern.test(trimmed)) {
      if (pattern.source.endsWith('\\s*')) {
        const match = trimmed.match(pattern);
        const suffix = match ? trimmed.slice(match[0].length) : '';
        const converted = replacement + translatedToolText(suffix, lang);
        return value.replace(trimmed, converted.replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))));
      }
      const converted = trimmed.replace(pattern, replacement);
      return value.replace(trimmed, converted.replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))));
    }
  }
  const dateResult = trimmed.match(/^(?:(\d+) سال و )?(?:(\d+) ماه و )?(\d+) روز$/);
  if (dateResult) {
    const parts: string[] = [];
    if (dateResult[1]) parts.push(dateResult[1] + ' years');
    if (dateResult[2]) parts.push(dateResult[2] + ' months');
    parts.push(dateResult[3] + ' days');
    return value.replace(trimmed, parts.join(', '));
  }
  const jalaliResult = trimmed.match(/^(\d{1,2}) (فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند) (\d{4})$/);
  if (jalaliResult) return value.replace(trimmed, jalaliResult[1] + ' ' + TOOL_TEXT_EN[jalaliResult[2]] + ' ' + jalaliResult[3]);
  const percentResult = trimmed.match(/^(.+) برابر است با (.+)٪ از (.+)$/);
  if (percentResult) return value.replace(trimmed, percentResult[1] + ' equals ' + percentResult[2] + '% of ' + percentResult[3]);
  const changeResult = trimmed.match(/^(افزایش|کاهش|بدون تغییر) (.+)٪ \(از (.+) به (.+)\)$/);
  if (changeResult) {
    const direction = TOOL_TEXT_EN[changeResult[1]];
    return value.replace(trimmed, direction + ' ' + changeResult[2] + '% (from ' + changeResult[3] + ' to ' + changeResult[4] + ')');
  }
  return value;
}

function translateToolNode(node: Node, lang: Lang): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const textNode = node as Text;
    const parent = textNode.parentElement;
    if (!parent || parent.closest('script,style,textarea,input,code,pre,[contenteditable="true"],[data-user-content]')) return;
    const original = toolTextOriginal.get(textNode);
    const isDateOutput = Boolean(parent.closest('[data-date-output]'));
    const localize = (value: string) => {
      const translated = translatedToolText(value, lang);
      return lang === 'en' && isDateOutput ? translateToolDateText(translated) : translated;
    };
    if (lang === 'fa') {
      if (original !== undefined && textNode.data !== original) textNode.data = original;
      return;
    }
    if (original !== undefined) {
      textNode.data = localize(original);
    } else {
      const translated = localize(textNode.data);
      if (translated !== textNode.data) {
        toolTextOriginal.set(textNode, textNode.data);
        textNode.data = translated;
      }
    }
    return;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    if (el.matches('script,style,code,pre,[contenteditable="true"],[data-user-content]')) return;
    if (el.matches('[data-lang-placeholder-fa][data-lang-placeholder-en],[data-i18n-placeholder],[data-i18n-aria-label]')) return;
    for (const attr of ['placeholder', 'title', 'aria-label', 'alt']) {
      const value = el.getAttribute(attr);
      if (value === null) continue;
      let originals = toolAttributeOriginal.get(el);
      if (!originals) { originals = new Map(); toolAttributeOriginal.set(el, originals); }
      if (lang === 'fa') {
        const original = originals.get(attr);
        if (original !== undefined && value !== original) el.setAttribute(attr, original);
      } else {
        if (!originals.has(attr)) originals.set(attr, value);
        const translated = translatedToolText(originals.get(attr)!, lang);
        if (translated !== value) el.setAttribute(attr, translated);
      }
    }
  }
}

function translateToolUi(lang: Lang): void {
  if (typeof document === 'undefined' || !document.body) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node: Node | null = document.body;
  while (node) {
    translateToolNode(node, lang);
    node = walker.nextNode();
  }
  if (!toolTranslationObserver) {
    toolTranslationObserver = new MutationObserver(records => {
      const current = (document.documentElement.lang as Lang) || 'fa';
      for (const record of records) {
        if (record.type === 'characterData') translateToolNode(record.target, current);
        for (const added of Array.from(record.addedNodes)) {
          translateToolNode(added, current);
          if (added.nodeType === Node.ELEMENT_NODE) {
            const walker = document.createTreeWalker(added, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
            let child = walker.nextNode();
            while (child) { translateToolNode(child, current); child = walker.nextNode(); }
          }
        }
        if (record.type === 'attributes') translateToolNode(record.target, current);
      }
    });
  }
  if (toolTranslationObservedBody !== document.body && toolTranslationObserver) {
    toolTranslationObserver.disconnect();
    toolTranslationObserver.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] });
    toolTranslationObservedBody = document.body;
  }
}

export function getStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch { return null; }
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function setTheme(theme: Theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
  applyTheme(theme);
}

export function toggleTheme() {
  const cur = (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
  setTheme(cur === 'light' ? 'dark' : 'light');
}

export function getStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === 'fa' || v === 'en' ? v : null;
  } catch { return null; }
}

export function applyLang(lang: Lang, dicts?: Record<Lang, Record<string, string>>) {
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
  document.documentElement.dataset.activeLang = lang;
  document.querySelectorAll<HTMLElement>('[data-lang-only]').forEach(el => {
    el.hidden = el.dataset.langOnly !== lang;
  });
  document.querySelectorAll<HTMLElement>('[data-lang-fa][data-lang-en]').forEach(el => {
    const value = lang === 'en' ? el.dataset.langEn : el.dataset.langFa;
    if (value !== undefined) el.textContent = value;
  });
  document.querySelectorAll<HTMLMetaElement>('meta[data-lang-fa][data-lang-en]').forEach(el => {
    const value = lang === 'en' ? el.dataset.langEn : el.dataset.langFa;
    if (value !== undefined) el.content = value;
  });
  document.querySelectorAll<HTMLElement>('title[data-lang-fa][data-lang-en]').forEach(el => {
    const value = lang === 'en' ? el.dataset.langEn : el.dataset.langFa;
    if (value !== undefined) document.title = value;
  });
  if (!dicts) return;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key && dicts[lang][key]) el.textContent = dicts[lang][key];
  });
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (key && dicts[lang][key]) el.placeholder = dicts[lang][key];
  });
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-lang-placeholder-fa][data-lang-placeholder-en]').forEach(el => {
    const value = lang === 'en' ? el.dataset.langPlaceholderEn : el.dataset.langPlaceholderFa;
    if (value !== undefined) el.placeholder = value;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]').forEach(el => {
    const key = el.dataset.i18nAriaLabel;
    if (key && dicts[lang][key]) el.setAttribute('aria-label', dicts[lang][key]);
  });
  translateToolUi(lang);
  document.dispatchEvent(new Event('app:languagechange'));
}

export function setLang(lang: Lang, dicts?: Record<Lang, Record<string, string>>) {
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  } catch {}
  applyLang(lang, dicts);
}

export function toggleLang(dicts?: Record<Lang, Record<string, string>>) {
  const cur = (document.documentElement.getAttribute('lang') as Lang) || 'fa';
  setLang(cur === 'fa' ? 'en' : 'fa', dicts);
}

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch { return []; }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  const set = new Set(getFavorites());
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...set])); } catch {}
  return set.has(slug);
}

export function getRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch { return []; }
}

export function pushRecent(slug: string) {
  const list = getRecent().filter(s => s !== slug);
  list.unshift(slug);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX))); } catch {}
}

export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}

let toastContainer: HTMLElement | null = null;
function ensureToastContainer(): HTMLElement {
  if (toastContainer && document.body.contains(toastContainer)) return toastContainer;
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.setAttribute('role', 'status');
  toastContainer.setAttribute('aria-live', 'polite');
  toastContainer.setAttribute('aria-atomic', 'true');
  document.body.appendChild(toastContainer);
  return toastContainer;
}

export function toast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 2500) {
  if (!message) return;
  const container = ensureToastContainer();
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = message;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));
  setTimeout(() => {
    el.classList.remove('visible');
    setTimeout(() => el.remove(), 250);
  }, duration);
}

export function initFavoriteButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>(".fav-btn").forEach(btn => {
    const slug = btn.dataset.favSlug;
    if (!slug) return;
    const fav = isFavorite(slug);
    btn.classList.toggle("favorited", fav);
    btn.setAttribute("aria-pressed", fav ? "true" : "false");
    const isEnglish = document.documentElement.lang === 'en';
    const label = isEnglish
      ? (fav ? "Remove from favorites" : "Add to favorites")
      : (fav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها");
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  });
}

let __favDelegationSetup = false;
export function setupFavoriteDelegation(): void {
  if (__favDelegationSetup) return;
  __favDelegationSetup = true;
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const btn = target.closest(".fav-btn") as HTMLButtonElement | null;
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const slug = btn.dataset.favSlug;
    if (!slug) return;
    toggleFavorite(slug);
    initFavoriteButtons(document);
    populateHomeSections();
  });
}

export function populateHomeSections(): void {
  if (typeof document === "undefined") return;
  const populate = (sectionId: string, gridId: string, slugs: string[]): void => {
    const section = document.getElementById(sectionId);
    const grid = document.getElementById(gridId);
    if (!section || !grid) return;
    grid.textContent = "";
    let count = 0;
    for (const slug of slugs) {
      const link = document.querySelector<HTMLElement>(`#all-tools-grid [data-slug="${slug}"]`);
      if (link) {
        const wrapper = link.closest(".tool-card-wrap");
        if (wrapper) {
          const clone = wrapper.cloneNode(true) as HTMLElement;
          grid.appendChild(clone);
          count++;
        }
      }
    }
    section.hidden = count === 0;
    if (count > 0) initFavoriteButtons(grid);
  };
  populate("favorites-section", "favorites-grid", getFavorites());
  populate("recent-section", "recent-grid", getRecent());
}

export function initUI(dicts?: Record<Lang, Record<string, string>>) {
  setupFavoriteDelegation();
  initFavoriteButtons();
  const queryLang = new URLSearchParams(window.location.search).get('lang');
  const initialLang: Lang = queryLang === 'fa' || queryLang === 'en' ? queryLang : (getStoredLang() ?? 'fa');
  if (queryLang === 'fa' || queryLang === 'en') {
    try { localStorage.setItem(LANG_KEY, queryLang); } catch {}
  }
  applyLang(initialLang, dicts);
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => toggleTheme());
  });
  document.querySelectorAll<HTMLButtonElement>('[data-lang-toggle]').forEach(btn => {
    btn.addEventListener('click', () => toggleLang(dicts));
  });
}

