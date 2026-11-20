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
    body: String.raw\`<p><strong>Base64</strong> is widely used in web development and data transfer. It is also frequently confused with encryption. This guide explains what Base64 does, why it exists, and when it is appropriate to use it.</p>
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
<p>Base64 is a practical way to represent binary data in text-based environments. It is useful for compatibility and transport, but it is not a security mechanism. Choose it for data representation—not for protecting secrets.</p>\`
  },
  'what-is-json-guide': {
    description: 'Understand JSON, its object and array structures, syntax rules, differences from XML, common use cases, and safe validation practices.',
    faqs: [
      { q: 'Is JSON a programming language?', a: 'No. JSON stands for JavaScript Object Notation. It is a data-interchange format, not a programming language, although its syntax is derived from a subset of JavaScript object notation.' },
      { q: 'What is the difference between JSON and XML?', a: 'JSON is generally more compact and convenient for common web APIs. XML provides additional document-oriented features and may be preferable for some complex document and enterprise integration use cases.' },
      { q: 'Is JSON secure?', a: 'JSON is a text format; security depends on how an application handles it. Parse input as data, validate its structure, and never execute untrusted JSON as code.' },
      { q: 'How can I validate JSON?', a: 'Use a JSON validator or parse it with JSON.parse in JavaScript and handle parsing errors. Our tool reports syntax errors with useful line and column information.' }
    ],
    body: String.raw\`<p>If you work in software development, web development, or with APIs, you have probably encountered <strong>JSON</strong>. But what exactly is JSON, and why has it become so important?</p>
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
<p>JSON is a compact, readable format for exchanging structured data. It is essential when working with APIs, web applications, and many modern software systems. Use our <a href="/tools/json-formatter/">JSON Formatter</a> to format and validate JSON locally in your browser.</p>\`
  },
  'regex-guide': {
    description: 'Learn regular expression basics, character classes, quantifiers, practical validation examples, and techniques for safer pattern matching.',
    faqs: [
      { q: 'What is a regular expression (regex)?', a: 'A regular expression is a pattern language for searching, validating, extracting, and replacing parts of text.' },
      { q: 'Is regex syntax identical in every programming language?', a: 'The fundamentals are similar, but engines and language APIs differ. JavaScript, Python, and PHP, for example, do not support exactly the same features. Check the documentation for your target environment.' },
      { q: 'Why can regex be difficult for beginners?', a: 'Compact symbols can make patterns hard to read. Start with small expressions, test them against representative input, and add complexity gradually.' },
      { q: 'What is ReDoS?', a: 'Regular Expression Denial of Service (ReDoS) occurs when a vulnerable pattern causes excessive backtracking and consumes substantial processing time. Limit input size and avoid ambiguous, nested repetition.' }
    ],
    body: String.raw\`<p><strong>Regular expressions (regex)</strong> are among the most powerful tools for working with text in software development. Their syntax can look intimidating at first, but a few core concepts make many text-processing tasks much easier.</p>
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
<p>Regular expressions are a valuable skill for developers who search, validate, extract, or transform text. Learn the basic tokens and quantifiers, test patterns carefully, and keep performance and input limits in mind. Try the <a href="/tools/regex-tester/">online Regex Tester</a> to experiment with your own expressions.</p>\`
  }
};
