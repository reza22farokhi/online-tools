export interface EnglishBlogFaq {
  q: string;
  a: string;
}

export interface EnglishBlogTranslation {
  description: string;
  faqs: EnglishBlogFaq[];
  body: string;
}

/**
 * Human-reviewed English article content.
 * These strings are authored static HTML; never populate them from user input.
 */
export const blogTranslationsEn: Record<string, EnglishBlogTranslation> = {
  'base64-guide': {
    description: 'Learn how Base64 encoding works, how it differs from encryption, where it is used on the web, and how to encode or decode data safely.',
    faqs: [
      { q: 'What is Base64?', a: 'Base64 is an encoding scheme that converts binary data, such as images or files, into text characters so it can be transferred through systems that support text only.' },
      { q: 'Is Base64 secure?', a: 'No. Base64 is an encoding scheme, not encryption. Anyone can decode it. Use established encryption such as AES when confidentiality is required.' },
      { q: 'Why does Base64 increase data size?', a: 'Every three input bytes are represented by four Base64 characters, so the encoded output is about 33% larger. This overhead is often acceptable for small payloads.' },
      { q: 'Where is Base64 used?', a: 'Common uses include email attachments, Data URIs for embedding images in HTML or CSS, and carrying binary data in JSON APIs.' }
    ],
    body: String.raw`<p><strong>Base64</strong> is widely used in web development and data transfer. It is also frequently confused with encryption. This guide explains what Base64 does, why it exists, and when it is appropriate to use it.</p>
<h2>What is Base64?</h2>
<p>Base64 is an <strong>encoding scheme</strong> that represents binary data (bits and bytes) using a set of 64 printable characters: uppercase and lowercase English letters, digits, and the <code>+</code> and <code>/</code> symbols. Padding may be represented by <code>=</code>. Its purpose is to carry binary content through systems designed to handle text.</p>
<h2>Base64 is not encryption</h2>
<p>This distinction is essential: <strong>Base64 does not provide security or confidentiality.</strong> Anyone with a basic decoder can restore the original data. Never use Base64 to hide passwords, API keys, personal information, or other sensitive values. If confidentiality is required, use an appropriate, well-reviewed encryption design and manage its keys securely.</p>
<h2>Common uses of Base64 on the web</h2>
<ul>
<li><strong>Data URIs:</strong> Small images or other resources can be embedded directly in HTML or CSS. This can reduce separate network requests, although it may increase document size and reduce caching efficiency.</li>
<li><strong>Email:</strong> MIME uses Base64 to represent binary attachments in messages that pass through text-oriented email infrastructure.</li>
<li><strong>APIs:</strong> Applications sometimes encode binary payloads as text when exchanging JSON data.</li>
<li><strong>JWT:</strong> JSON Web Token header and payload segments use Base64URL encoding. This does not encrypt or validate the token.</li>
</ul>
<h2>Encode or decode Base64</h2>
<p>Use our <a href="/tools/base64/">Base64 tool</a> to encode text or decode a Base64 value. The tool runs in your browser, so the content you enter is processed locally rather than uploaded to our server.</p>
<h2>Summary</h2>
<p>Base64 is a practical way to represent binary data in text-based environments. It is useful for compatibility and transport, but it is not a security mechanism. Choose it for data representation—not for protecting secrets.</p>`
  },
  'what-is-json-guide': {
    description: 'Understand JSON, its object and array structures, syntax rules, differences from XML, common use cases, and safe validation practices.',
    faqs: [
      { q: 'Is JSON a programming language?', a: 'No. JSON stands for JavaScript Object Notation. It is a data-interchange format, not a programming language, although its syntax is derived from a subset of JavaScript object notation.' },
      { q: 'What is the difference between JSON and XML?', a: 'JSON is generally more compact and convenient for common web APIs. XML provides additional document-oriented features and may be preferable for some complex document and enterprise integration use cases.' },
      { q: 'Is JSON secure?', a: 'JSON is a text format; security depends on how an application handles it. Parse input as data, validate its structure, and never execute untrusted JSON as code.' },
      { q: 'How can I validate JSON?', a: 'Use a JSON validator or parse it with JSON.parse in JavaScript and handle parsing errors. Our tool reports syntax errors with useful line and column information.' }
    ],
    body: String.raw`<p>If you work in software development, web development, or with APIs, you have probably encountered <strong>JSON</strong>. But what exactly is JSON, and why has it become so important?</p>
<h2>What is JSON?</h2>
<p>If you already work with JSON files and need help formatting or troubleshooting them, see our <a href="/blog/json-guide/">guide to JSON formatting and validation</a>.</p>
<p>JSON (JavaScript Object Notation) is a <strong>lightweight data-interchange format</strong> designed to be easy for people to read and straightforward for machines to parse. It is not a programming language; it is a structured way to store and exchange information.</p>
<p>JSON became widely adopted in the early 2000s and is now a common format for web APIs, configuration files, and communication between applications.</p>
<h2>How is JSON structured?</h2>
<p>JSON is built around two primary structures:</p>
<h3>1. Objects</h3>
<p>An object is a collection of key-value pairs enclosed in curly braces (<code>{}</code>). Keys must be strings enclosed in double quotes.</p>
<pre><code>{
  "name": "Ali",
  "age": 30,
  "city": "Tehran"
}</code></pre>
<h3>2. Arrays</h3>
<p>An array is an ordered list of values enclosed in square brackets (<code>[]</code>).</p>
<pre><code>["Ali", "Sara", "Reza"]</code></pre>
<h2>Important JSON syntax rules</h2>
<ul>
<li>Object keys must use double quotation marks.</li>
<li>String values must also use double quotation marks.</li>
<li>Numbers are written without quotation marks.</li>
<li>A trailing comma after the final item is not allowed.</li>
<li>Comments are not part of the JSON standard.</li>
<li>Single-quoted strings are invalid JSON.</li>
</ul>
<h2>Why is JSON so widely used?</h2>
<ol>
<li><strong>Readable:</strong> Its structure is relatively easy to inspect and understand.</li>
<li><strong>Easy to process:</strong> Browsers and programming languages provide built-in or standard JSON parsers.</li>
<li><strong>Language independent:</strong> Most modern programming languages support JSON.</li>
<li><strong>Compact:</strong> JSON is often less verbose than equivalent XML.</li>
</ol>
<h2>JSON compared with XML</h2>
<p><strong>JSON representation:</strong></p>
<pre><code>{"name": "Ali", "age": 30}</code></pre>
<p><strong>The same data in XML:</strong></p>
<pre><code>&lt;person&gt;
  &lt;name&gt;Ali&lt;/name&gt;
  &lt;age&gt;30&lt;/age&gt;
&lt;/person&gt;</code></pre>
<p>For this simple example, JSON uses fewer characters. XML still has capabilities that can make it a better fit for document-centric workflows and some integration requirements.</p>
<h2>Common uses of JSON</h2>
<ul>
<li><strong>Web APIs:</strong> Many services use JSON for request and response bodies.</li>
<li><strong>Configuration:</strong> Files such as <code>package.json</code> define project metadata and scripts in Node.js projects.</li>
<li><strong>Browser storage:</strong> Applications often serialize structured data before storing it in local storage.</li>
<li><strong>System integration:</strong> JSON provides a widely supported format for exchanging data between services.</li>
<li><strong>Databases:</strong> Some NoSQL databases support JSON-like documents; MongoDB stores BSON, a binary representation with a JSON-like data model.</li>
</ul>
<h2>JSON tools on our website</h2>
<p>These tools can help with common JSON tasks:</p>
<ul>
<li><a href="/tools/json-formatter/">JSON Formatter</a> — format, minify, and validate JSON.</li>
<li><a href="/tools/base64/">Base64 Encoder and Decoder</a> — encode or decode text when a text-safe representation is needed.</li>
<li><a href="/tools/csv-json-converter/">CSV to JSON Converter</a> — convert tabular data between formats.</li>
</ul>
<h2>Common JSON mistakes</h2>
<ol>
<li><strong>Using single quotes:</strong> <code>{'name': 'Ali'}</code> is invalid JSON.</li>
<li><strong>Adding a trailing comma:</strong> <code>{"a": 1,}</code> is invalid JSON.</li>
<li><strong>Adding comments:</strong> <code>{"a": 1 /* comment */}</code> is invalid JSON.</li>
<li><strong>Failing to escape special characters:</strong> Use valid escape sequences such as <code>\\n</code>, <code>\\t</code>, and <code>\\"</code> inside strings.</li>
</ol>
<h2>Summary</h2>
<p>JSON is a compact, readable format for exchanging structured data. It is essential when working with APIs, web applications, and many modern software systems. Use our <a href="/tools/json-formatter/">JSON Formatter</a> to format and validate JSON locally in your browser.</p>`
  },
  'regex-guide': {
    description: 'Learn regular expression basics, character classes, quantifiers, practical validation examples, and techniques for safer pattern matching.',
    faqs: [
      { q: 'What is a regular expression (regex)?', a: 'A regular expression is a pattern language for searching, validating, extracting, and replacing parts of text.' },
      { q: 'Is regex syntax identical in every programming language?', a: 'The fundamentals are similar, but engines and language APIs differ. JavaScript, Python, and PHP, for example, do not support exactly the same features. Check the documentation for your target environment.' },
      { q: 'Why can regex be difficult for beginners?', a: 'Compact symbols can make patterns hard to read. Start with small expressions, test them against representative input, and add complexity gradually.' },
      { q: 'What is ReDoS?', a: 'Regular Expression Denial of Service (ReDoS) occurs when a vulnerable pattern causes excessive backtracking and consumes substantial processing time. Limit input size and avoid ambiguous, nested repetition.' }
    ],
    body: String.raw`<p><strong>Regular expressions (regex)</strong> are among the most powerful tools for working with text in software development. Their syntax can look intimidating at first, but a few core concepts make many text-processing tasks much easier.</p>
<h2>What is a regular expression?</h2>
<p>A regular expression describes a text pattern. You can use it to check whether a string matches a rule, find and extract parts of a string, or replace matching content.</p>
<h2>Useful regex characters</h2>
<ul>
<li><code>.</code> — matches any character except a line terminator in the usual default mode.</li>
<li><code>\\d</code> — matches a digit (0–9 in common JavaScript regex usage).</li>
<li><code>\\w</code> — matches a word character, typically a Latin letter, digit, or underscore in JavaScript.</li>
<li><code>\\s</code> — matches whitespace, including spaces, tabs, and line breaks.</li>
<li><code>^</code> — matches the beginning of the input (or line in multiline mode).</li>
<li><code>$</code> — matches the end of the input (or line in multiline mode).</li>
</ul>
<h2>Quantifiers</h2>
<ul>
<li><code>*</code> — zero or more repetitions; for example, <code>a*</code> matches zero or more consecutive <code>a</code> characters.</li>
<li><code>+</code> — one or more repetitions.</li>
<li><code>?</code> — zero or one repetition (optional).</li>
<li><code>{n}</code> — exactly <code>n</code> repetitions.</li>
<li><code>{n,m}</code> — between <code>n</code> and <code>m</code> repetitions.</li>
</ul>
<h2>Practical examples</h2>
<p><strong>A simple email-shaped pattern:</strong><br><code>^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$</code></p>
<p>This is only a basic format check, not a complete implementation of email-address validation.</p>
<p><strong>Iranian mobile number format:</strong><br><code>^09\\d{9}$</code></p>
<p><strong>Finding URL-like strings:</strong><br><code>https?://[^\\s]+</code></p>
<p>These examples are starting points. Real validation rules should reflect the actual requirements and accepted formats of your application.</p>
<h2>Test regex patterns online</h2>
<p>Use our <a href="/tools/regex-tester/">Regex Tester</a> to test and debug patterns against sample text. The tool uses a Web Worker to keep pattern evaluation away from the main page thread. This improves responsiveness, but it does not make every potentially expensive regular expression harmless.</p>
<h2>Safer regular-expression practices</h2>
<ul>
<li>Avoid unnecessarily complex patterns and ambiguous nested quantifiers.</li>
<li>Set reasonable length limits on user-supplied input.</li>
<li>When regex runs on a server, use execution limits or other safeguards appropriate to the runtime.</li>
<li>Test patterns with both expected input and adversarial edge cases.</li>
<li>Prefer a parser or dedicated validation library when the format is too complex for a maintainable regex.</li>
</ul>
<h2>Summary</h2>
<p>Regular expressions are a valuable skill for developers who search, validate, extract, or transform text. Learn the basic tokens and quantifiers, test patterns carefully, and keep performance and input limits in mind. Try the <a href="/tools/regex-tester/">online Regex Tester</a> to experiment with your own expressions.</p>`
  },
  'online-security-guide': {
    description: 'Learn practical ways to protect online accounts with unique passwords, multi-factor authentication, password managers, file integrity checks, and phishing awareness.',
    faqs: [
      { q: 'Should I enable two-factor authentication?', a: 'Yes. Multi-factor authentication adds a second check beyond your password. Prefer an authenticator app or a passkey where supported, and keep recovery codes in a safe place.' },
      { q: 'Why should I use a different password for every website?', a: 'A breach at one service can expose credentials that attackers then try on other services. Unique passwords prevent one compromised account from automatically putting your other accounts at risk.' },
      { q: 'Are password managers safe?', a: 'A reputable password manager encrypts your vault and helps create unique passwords. Protect it with a strong master passphrase and multi-factor authentication, and keep recovery options secure.' }
    ],
    body: String.raw`<p>Our photos, messages, financial details, and work accounts increasingly live online. That convenience also creates risk: attackers exploit reused passwords, phishing messages, compromised services, and outdated software. Online security is not a single setting; it is a set of habits that reduce the chance and impact of an account compromise.</p>
<h2>1. Use long, unique passwords</h2>
<p>A password should be difficult to guess and different for every account. Avoid names, birthdays, familiar phrases, and predictable substitutions. Long, randomly generated passwords or multi-word passphrases are generally more resistant to guessing. Use a reputable password manager so you do not have to memorize every credential.</p>
<p>You can create a random password with our <a href="/tools/password-generator/">Password Generator</a>. It runs in your browser. For more guidance, read our <a href="/blog/strong-password-guide/">guide to strong passwords</a>.</p>
<h2>2. Turn on multi-factor authentication</h2>
<p>Multi-factor authentication (MFA) requires an additional proof of identity after your password. A passkey or hardware security key is a strong option where available. Authenticator apps are also useful. SMS codes are better than having no second factor, but they can be exposed to SIM-swap and social-engineering attacks. Save recovery codes somewhere secure.</p>
<h2>3. Use a password manager</h2>
<p>A password manager stores credentials in an encrypted vault and can generate a different password for each service. Choose a reputable product, protect the vault with a strong master passphrase, enable MFA, and understand how account recovery works. Never share your master password or store it in an unprotected text file.</p>
<h2>4. Verify downloaded files</h2>
<p>When a software publisher provides a cryptographic checksum, compare it with a hash calculated from the file you downloaded. A matching SHA-256 digest helps detect accidental corruption or a file that differs from the publisher's copy. It does not, by itself, prove that the publisher or download source is trustworthy. Use our <a href="/tools/hash-generator/">Hash Generator</a> to calculate a file hash and compare it with a value published through an independently trusted channel.</p>
<h2>5. Recognize phishing attempts</h2>
<p>Phishing messages imitate banks, delivery companies, colleagues, and popular services to persuade you to reveal credentials or approve a transaction. Check the sender and the complete domain before signing in. Be suspicious of unexpected urgency, attachments, QR codes, and links that ask you to enter a password or recovery code. When in doubt, open the service using a bookmark or type its known address yourself.</p>
<h2>Keep devices and accounts up to date</h2>
<p>Install security updates for your operating system, browser, and applications. Remove software you no longer use, review account sessions and connected apps, and revoke access you do not recognize. Back up important files and test that you can restore them.</p>
<h2>Summary</h2>
<p>Build a layered defence: use unique passwords, enable MFA or passkeys, store credentials safely, verify downloads when trusted checksums are available, and treat unexpected requests with caution. No single measure guarantees safety, but these practices make common attacks much harder.</p>`
  },
  'csv-to-json-guide': {
    description: 'Learn how CSV and JSON differ, convert tabular data in both directions, handle headers, quotes, delimiters, and missing values, and avoid common data-conversion mistakes.',
    faqs: [
      { q: 'What is the difference between CSV and JSON?', a: 'CSV represents tabular data as rows and delimited fields. JSON represents structured values such as objects and arrays, so it can model nested data more naturally.' },
      { q: 'Why convert a CSV file to JSON?', a: 'Many web APIs and JavaScript applications exchange structured data as JSON. Converting a spreadsheet export to JSON can make its rows easier to consume in those systems.' },
      { q: 'Can conversion change or lose data?', a: 'It can. CSV has no built-in types or nested structure, so a converter must make choices about headers, empty cells, numbers, quoting, and nested values. Review the output before using it.' },
      { q: 'Is this converter suitable for private data?', a: 'The converter on this site is designed to process input locally in your browser. Avoid entering sensitive data into unfamiliar websites, and verify network behaviour if your workflow has strict confidentiality requirements.' }
    ],
    body: String.raw`<p>CSV and JSON are two common formats for storing and exchanging data. CSV is convenient for spreadsheets and flat tables, while JSON is widely used by web APIs and applications. Converting between them is straightforward for simple records, but details such as quoting, missing values, and nested objects deserve attention.</p>
<h2>What is CSV?</h2>
<p>CSV means Comma-Separated Values. It is a text format in which each line usually represents a row and delimiters separate the fields. The first row often contains column names.</p>
<pre><code>name,age,city
Ali,30,Tehran
Sara,25,Shiraz
Reza,28,Mashhad</code></pre>
<p>CSV is easy to export from spreadsheet applications, but it does not define a universal way to represent nested objects, arrays, or data types.</p>
<h2>What is JSON?</h2>
<p>JSON (JavaScript Object Notation) represents data using objects, arrays, strings, numbers, booleans, and null values. A table can be represented as an array of objects, with each row becoming one object.</p>
<pre><code>[
  {"name":"Ali","age":30,"city":"Tehran"},
  {"name":"Sara","age":25,"city":"Shiraz"},
  {"name":"Reza","age":28,"city":"Mashhad"}
]</code></pre>
<p>JSON is useful for APIs and application data because it can represent nested structures as well as flat records.</p>
<h2>Convert CSV to JSON</h2>
<ol>
<li>Identify the header row and use its values as object keys.</li>
<li>Read each subsequent row as a record.</li>
<li>Map each field to its corresponding header.</li>
<li>Check how empty cells and values that look like numbers or dates should be represented.</li>
</ol>
<p>Paste your data into our <a href="/tools/csv-json-converter/">CSV to JSON Converter</a> to create JSON in your browser.</p>
<h2>Convert JSON to CSV</h2>
<p>For a simple array of objects, collect the keys that should become columns, write them as the header row, and write each object's values in the same column order. Decide how to handle missing keys, null values, and nested objects before exporting. A nested value may need to be flattened or serialized into a single field.</p>
<h2>Quoting and delimiters</h2>
<p>A field containing a comma, quotation mark, or line break must be handled according to CSV quoting rules. For example:</p>
<pre><code>name,city
Ali,"Tehran, Iran"</code></pre>
<p>Inside a quoted CSV field, a literal double quote is commonly escaped by doubling it. Not every file uses a comma: semicolons and tab characters are also common delimiters. Select the delimiter that matches the source file rather than assuming all CSV files are identical.</p>
<h2>Missing values and data types</h2>
<p>CSV fields are text by default. A value such as <code>00123</code> might be an identifier, not the number 123; converting it to a number would remove leading zeroes. Dates and decimal separators can also be ambiguous. Decide on a schema and validate the converted output against it.</p>
<h2>Common uses</h2>
<ul>
<li><strong>Data migration:</strong> Move a spreadsheet export into an application or database.</li>
<li><strong>API integration:</strong> Convert tabular records into JSON request data.</li>
<li><strong>Analysis:</strong> Load spreadsheet data into JavaScript, Python, or another analysis environment.</li>
<li><strong>Exchange:</strong> Share flat records in a format supported by the receiving system.</li>
</ul>
<h2>Convert data in your browser</h2>
<p>Our <a href="/tools/csv-json-converter/">CSV/JSON Converter</a> supports conversion in both directions and common delimiters. The tool is designed for local browser processing; the data you paste is processed on your device rather than uploaded for conversion.</p>
<h2>Summary</h2>
<p>CSV is a practical format for flat tables, while JSON is better suited to structured application data. Before converting, check headers, quoting, delimiters, missing values, and data types. Always inspect the result and validate it against the requirements of the system that will consume it.</p>`
  },
  'age-calculation-guide': {
    description: 'Learn how to calculate exact age in years, months, and days, account for birthdays and leap years, and understand differences between calendar systems.',
    faqs: [
      { q: 'How do I calculate my exact age?', a: 'Compare your date of birth with the target date and account for whether the birthday has occurred yet in that year. An exact result is expressed in years, months, and days.' },
      { q: 'Can age differ between calendar systems?', a: 'Yes. Calendar systems have different month lengths and leap-year rules. For an official purpose, use the calendar and date convention required by the relevant authority.' },
      { q: 'Why do months and days matter?', a: 'Some eligibility rules and forms use a precise age rather than a simple difference between calendar years. The exact convention should be checked for legal, educational, or employment decisions.' },
      { q: 'Can an online age calculator handle leap years?', a: 'A calendar-aware calculator can account for month lengths and leap days. Check the selected calendar and target date before relying on the result for an official decision.' }
    ],
    body: String.raw`<p>“How old are you?” sounds like a simple question, but an exact answer can require more than subtracting birth years. The result depends on whether the birthday has passed, the length of each month, leap days, and the calendar system being used.</p>
<h2>Why subtracting years is not enough</h2>
<p>Suppose the current year is 2026 and someone was born in 1990. Subtracting the years gives 36, but if their birthday has not happened yet this year, their completed age is still 35. A precise calculation must compare the full birth date with the target date.</p>
<ul>
<li><strong>Birthday timing:</strong> The completed year count changes on the birthday, not on January 1.</li>
<li><strong>Month lengths:</strong> Calendar months contain different numbers of days.</li>
<li><strong>Leap years:</strong> February may contain an additional day in the Gregorian calendar.</li>
<li><strong>Calendar choice:</strong> The Persian and Gregorian calendars use different month structures and leap-year rules.</li>
</ul>
<h2>How exact age is calculated</h2>
<p>An age expressed in years, months, and days is calculated by comparing the birth date with a later target date. First determine the number of completed years. Then determine the remaining completed months, and finally count the remaining days. If borrowing is required, use the length of the relevant previous month rather than assuming every month has 30 days.</p>
<p>Manual calculations are easy to get wrong around month ends and leap days. Our <a href="/tools/age/">Age Calculator</a> performs the calendar calculation for you.</p>
<h2>When exact age matters</h2>
<ul>
<li><strong>School registration:</strong> Eligibility may depend on reaching a specific age by a defined cutoff date.</li>
<li><strong>Sports and employment:</strong> Some competitions and applications use precise age limits.</li>
<li><strong>Insurance and retirement:</strong> Age and service periods may be evaluated in months or days under specific rules.</li>
<li><strong>Forms and records:</strong> Medical, travel, and administrative forms may request age in years and months.</li>
</ul>
<p>For legal or official eligibility, do not rely on a generic calculator alone. Confirm the authority's cutoff date, calendar, and counting convention.</p>
<h2>Age in different calendar systems</h2>
<p>The Gregorian calendar and the Persian Solar Hijri calendar have different month lengths and leap-year rules. As a result, converting a birth date and calculating elapsed time in another calendar can produce a different displayed date or day count. Use one clearly identified calendar consistently for formal records.</p>
<p>If you need to compare dates across calendars, use our <a href="/tools/multi-calendar-converter/">Multi-Calendar Converter</a>.</p>
<h2>Other date calculations</h2>
<p>Sometimes you need the interval between two arbitrary dates rather than a person's age. Our <a href="/tools/date-diff/">Date Difference Calculator</a> is designed for that task. Check whether the result should include both endpoints and whether weekends or holidays matter for your use case.</p>
<h2>Practical tips</h2>
<ul>
<li>Use the date of birth as recorded in the relevant official document.</li>
<li>Confirm which calendar the form or authority expects.</li>
<li>Check the target date and time zone if the calculation is time-sensitive.</li>
<li>For legal, employment, or benefits decisions, verify the applicable rule with the responsible authority.</li>
</ul>
<h2>Summary</h2>
<p>Exact age is a calendar calculation, not simply the difference between two years. Birthday timing, month lengths, leap days, and calendar conventions all matter. Use our <a href="/tools/age/">Age Calculator</a> for a quick result, and verify the required convention before using it for an official decision.</p>`
  }
,
  'strong-password-guide': {
    description: 'Learn how to create and manage strong, unique passwords, use passphrases and password managers, and reduce the risk of account takeover.',
    faqs: [
      { q: 'How long should a strong password be?', a: 'Longer is generally better. Follow the service requirements and current security guidance; for a password used as the only factor, a long passphrase or randomly generated password is preferable to a short complex one.' },
      { q: 'Is it safe to reuse the same password on multiple sites?', a: 'No. A breach at one service can expose a password that attackers may try elsewhere. Use a unique password for every account.' },
      { q: 'Can I trust a password generator?', a: 'Use a reputable generator that relies on a cryptographically secure random number source. This site generates passwords in your browser; never enter an existing password into an unknown checker.' },
      { q: 'How can I remember many strong passwords?', a: 'Use a reputable password manager with a strong master passphrase and multi-factor authentication. You only need to remember the master passphrase and recovery method.' }
    ],
    body: String.raw`<p>A strong password helps protect email, financial, social, and work accounts. The most important principles are length, uniqueness, and secure storage. A password that is reused or easy to guess can expose several accounts at once.</p>
<h2>What makes a password strong?</h2>
<ul>
<li><strong>Length:</strong> Prefer a long password or passphrase. Longer secrets are generally harder to guess.</li>
<li><strong>Uniqueness:</strong> Use a different password for every service.</li>
<li><strong>Randomness:</strong> Avoid names, birthdays, keyboard patterns, quotations, and predictable substitutions.</li>
<li><strong>Secure storage:</strong> Keep passwords in a reputable password manager rather than an unprotected note or text file.</li>
</ul>
<h2>Why length matters</h2>
<p>A short password with symbols may still be predictable if it is based on a common word or pattern. A long randomly generated password or a passphrase made from unrelated words can provide much more resistance to guessing. Exact strength depends on how the secret was generated, how it is stored, and the attacker's capabilities; no fixed cracking-time estimate applies to every password.</p>
<h2>Generate a unique password</h2>
<p>Our <a href="/tools/password-generator/">Password Generator</a> uses browser cryptography to generate random passwords locally. Choose a length and character set that the target service supports, then save the result directly in your password manager. Do not send a password to someone else or reuse it on another website.</p>
<h2>Use a password manager</h2>
<p>A password manager creates and stores a unique credential for each account. Choose a reputable product, secure its vault with a strong master passphrase, enable multi-factor authentication where available, and keep recovery codes safe. Protect your devices and use the manager's official applications and browser extensions.</p>
<h2>Common password mistakes</h2>
<ol>
<li>Reusing one password across multiple websites.</li>
<li>Using personal information that others can discover.</li>
<li>Making predictable changes such as adding a digit or exclamation mark to a familiar word.</li>
<li>Sharing passwords through ordinary email or messages.</li>
<li>Storing credentials in plain text or screenshots.</li>
</ol>
<h2>Additional protection</h2>
<p>Enable multi-factor authentication or passkeys on important accounts. Keep recovery information current, review active sessions, and change a password promptly if a service reports a breach or you suspect compromise. Avoid routine password changes without a reason when the current password is unique and secure; change it when it may have been exposed.</p>
<h2>Related tools</h2>
<p>You can use our <a href="/tools/hash-generator/">Hash Generator</a> to calculate a file digest, or our <a href="/tools/uuid-generator/">UUID Generator</a> to create random identifiers. A hash or UUID is not a substitute for a password manager or a password-generation process.</p>
<h2>Summary</h2>
<p>Use long, unique passwords, generate them with a cryptographically secure source, and store them in a password manager. Add MFA or passkeys for important accounts. These layered practices are more effective than relying on character substitutions alone.</p>`
  },
  'jwt-security-guide': {
    description: 'Understand JWT security risks, the difference between decoding and signature verification, safe claim validation, token lifetimes, and secure storage.',
    faqs: [
      { q: 'Does decoding a JWT mean it has been hacked?', a: 'No. A typical signed JWT uses Base64URL encoding for its header and payload, so those parts can be read. Decoding does not reveal or break the signing key and does not verify authenticity.' },
      { q: 'Can I put sensitive information in a JWT payload?', a: 'Do not put secrets or sensitive personal data in an ordinary signed JWT. Its payload is readable by anyone who obtains the token unless a separate encryption standard is used.' },
      { q: 'Where should a JWT signature be verified?', a: 'Verify the signature on the trusted server or resource that makes the authorization decision. Use a maintained library and an explicit algorithm allowlist, and validate relevant claims.' },
      { q: 'Is a browser JWT decoder safe for production tokens?', a: 'Local decoding can avoid sending a token to a remote service, but production tokens are still credentials. Prefer test tokens and never paste a live bearer token into a tool unless your security policy explicitly permits it.' }
    ],
    body: String.raw`<p>JSON Web Tokens (JWTs) are often used to carry claims between an identity provider, an application, and an API. They are useful, but a common implementation mistake is to treat a decoded token as a trusted identity. A JWT is only trustworthy after the receiving system validates it correctly.</p>
<h2>JWT structure</h2>
<p>A compact signed JWT commonly contains three Base64URL-encoded segments separated by periods:</p>
<ul>
<li><strong>Header:</strong> identifies the token type and the signing algorithm.</li>
<li><strong>Payload:</strong> contains claims such as a subject, issuer, audience, and expiration time.</li>
<li><strong>Signature:</strong> allows a verifier with the appropriate key to detect unauthorized changes.</li>
</ul>
<h2>Decoding is not verification</h2>
<p>Base64URL is an encoding, not encryption. Anyone who obtains a typical signed JWT can read its header and payload. Decoding only displays those values; it does not prove who issued the token or whether the claims are valid. The signature must be verified using a trusted key and a maintained JWT library.</p>
<p>Our <a href="/tools/jwt-decoder/">JWT Decoder</a> can help inspect a token during development. It displays token content locally, but it does not establish that the token is authentic or authorized.</p>
<h2>Validate more than the signature</h2>
<p>After verifying the signature, validate the claims required by your application. Common checks include:</p>
<ul>
<li><strong>iss (issuer):</strong> confirm that the expected identity provider issued the token.</li>
<li><strong>aud (audience):</strong> confirm that the token was intended for your API or application.</li>
<li><strong>exp (expiration):</strong> reject expired tokens.</li>
<li><strong>nbf (not before):</strong> reject tokens that are not yet valid, when this claim is used.</li>
<li><strong>sub (subject):</strong> interpret the subject only within the expected issuer and application context.</li>
</ul>
<p>Use an explicit algorithm allowlist and follow the library's security guidance. Never accept an unsigned token merely because its header requests an algorithm such as <code>none</code>.</p>
<h2>Five common JWT security mistakes</h2>
<ol>
<li><strong>Putting secrets in the payload:</strong> signed JWT payloads are readable. Do not include passwords, payment details, private keys, or sensitive medical information.</li>
<li><strong>Skipping verification:</strong> decoding a token is not an authorization check.</li>
<li><strong>Ignoring claims:</strong> validate issuer, audience, expiry, and any application-specific claims.</li>
<li><strong>Using weak or exposed signing keys:</strong> generate keys securely, store them in a protected server-side secret store, and plan rotation.</li>
<li><strong>Choosing unsafe browser storage:</strong> consider the XSS and CSRF trade-offs of cookies and web storage. Use Secure, HttpOnly, and appropriate SameSite cookie settings when cookies are part of the design, and implement CSRF protection where required.</li>
</ol>
<h2>Token lifetime and revocation</h2>
<p>Keep access tokens no longer-lived than necessary. A short expiry limits the window in which a stolen token can be used, but applications also need a plan for refresh, revocation, key rotation, and logout. The right design depends on the threat model and identity provider.</p>
<h2>Inspect tokens carefully</h2>
<p>For development and debugging, our <a href="/tools/jwt-decoder/">JWT Decoder</a> displays the header and payload in your browser. Local processing reduces exposure to a third-party decoder, but it does not make a live production token safe to share. Use synthetic or test credentials whenever possible.</p>
<h2>Summary</h2>
<p>JWT security depends on verification and validation, not on hiding the payload. Verify signatures on the server, restrict accepted algorithms, validate claims, protect signing keys, and design token storage and lifetimes around your application's risks.</p>`
  },
  'what-is-jwt-guide': {
    description: 'Learn what JSON Web Tokens are, how headers, payloads, and signatures work, how JWTs compare with sessions, and what developers must validate.',
    faqs: [
      { q: 'Is a JWT encrypted?', a: 'A typical signed JWT is encoded, not encrypted. Its header and payload can be read by anyone who has the token. JWT also supports encrypted forms, but signed tokens alone do not provide confidentiality.' },
      { q: 'What is the difference between a JWT and a session?', a: 'A session commonly uses a server-side record referenced by a cookie. A JWT carries claims in a token. Both approaches have security and operational trade-offs; neither is automatically more secure.' },
      { q: 'Why are JWTs used?', a: 'JWTs provide a compact, standardized way to carry claims between systems. They are commonly used in APIs and distributed applications when their validation and lifecycle are designed carefully.' },
      { q: 'Is a JWT safe to use?', a: 'It can be used safely when signatures and claims are validated, keys are protected, tokens have appropriate lifetimes, and sensitive information is not exposed in readable payloads.' }
    ],
    body: String.raw`<p>JSON Web Token (JWT) is a compact format for representing claims that can be transferred between parties. It is commonly used in authentication and API authorization, but it is important to understand what a token proves—and what it does not prove.</p>
<h2>What is a JWT?</h2>
<p>JWT is defined by RFC 7519. A JWT can carry claims about a subject and the context in which the token should be used. A signed JWT allows a receiving system to detect changes to the token when it verifies the signature with a trusted key.</p>
<h2>The three parts of a compact signed JWT</h2>
<p>A common signed JWT has three segments separated by periods:</p>
<ol>
<li><strong>Header:</strong> describes the token type and the algorithm used to create the signature.</li>
<li><strong>Payload:</strong> contains claims such as subject, issuer, audience, and expiration time.</li>
<li><strong>Signature:</strong> provides integrity and issuer authenticity when correctly verified.</li>
</ol>
<p>The header and payload are typically Base64URL-encoded. Encoding is not encryption, so do not place secrets or sensitive personal information in a readable token payload.</p>
<h2>Why applications use JWTs</h2>
<ul>
<li><strong>Interoperability:</strong> JWT is a documented format supported by many programming languages and libraries.</li>
<li><strong>Compactness:</strong> a token can be transmitted in an HTTP header or another agreed transport.</li>
<li><strong>Distributed systems:</strong> services can validate tokens using trusted keys without looking up a session record for every request, if the architecture is designed for that model.</li>
</ul>
<p>These benefits do not mean JWT is always the best choice. Key management, revocation, token size, and the need for immediate permission changes all affect the design.</p>
<h2>JWT compared with server-side sessions</h2>
<p>With a traditional session, the server stores session state and the browser usually holds an opaque session identifier in a cookie. With a JWT-based design, the client sends a token containing claims that a service verifies. Sessions make centralized invalidation straightforward; self-contained tokens can simplify distributed validation but require careful expiry, revocation, and key-rotation planning. Choose based on your application's threat model and operational needs.</p>
<h2>Essential security practices</h2>
<ol>
<li>Never treat decoding as proof of authenticity; verify the signature.</li>
<li>Validate issuer, audience, expiry, and other claims required by your application.</li>
<li>Use a strict algorithm allowlist and a maintained JWT library.</li>
<li>Keep signing keys secret, high-entropy, and protected on trusted servers.</li>
<li>Keep tokens short-lived and design refresh and revocation deliberately.</li>
<li>Do not store passwords or other secrets in a readable payload.</li>
</ol>
<h2>Inspect a JWT during development</h2>
<p>Our <a href="/tools/jwt-decoder/">JWT Decoder</a> lets you inspect the header and payload locally in your browser. It is a debugging aid, not a signature verifier or an authorization service. Do not paste live production bearer tokens into tools unless your security policy explicitly allows it.</p>
<h2>Summary</h2>
<p>JWT is a standardized way to carry claims between systems. It can support distributed authentication architectures, but safe use requires signature verification, claim validation, key protection, and a deliberate token lifecycle. For a deeper security checklist, read our <a href="/blog/jwt-security-guide/">JWT security guide</a>.</p>`
  }

};
