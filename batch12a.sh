#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd ~/online-tools

step() { echo ""; echo "════════════════════════════════════════"; echo "▶ $1"; echo "════════════════════════════════════════"; }
show() {
  local f="$1"
  if [ -f "$f" ]; then
    local n; n=$(wc -l < "$f")
    if [ "$n" -eq 0 ]; then echo "  ✗ EMPTY: $f"; exit 1; fi
    echo "  ✓ $n lines: $f"
  else
    echo "  ✗ MISSING: $f"; exit 1
  fi
}

step "[1/10] Creating directories"
mkdir -p src/tools/seo/meta-tag-generator src/tools/seo/serp-preview
echo "  ✓ Directories ready"

step "[2/10] meta-tag-generator/meta.ts"
cat > src/tools/seo/meta-tag-generator/meta.ts << 'FILE_END'
import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'meta-tag-generator',
  category: 'seo',
  name: { fa: 'تولیدکننده متا تگ', en: 'Meta Tag Generator' },
  description: {
    fa: 'تگ‌های HTML متا، Open Graph و Twitter Card را برای سئو و شبکه‌های اجتماعی تولید کنید.',
    en: 'Generate HTML meta tags, Open Graph, and Twitter Cards for SEO and social media.'
  },
  keywords: ['meta tag', 'og tags', 'twitter card', 'seo tags', 'متا تگ', 'تولید متا', 'تگ سئو'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['serp-preview', 'json-formatter']
};
FILE_END
show src/tools/seo/meta-tag-generator/meta.ts

step "[3/10] meta-tag-generator/logic.ts"
cat > src/tools/seo/meta-tag-generator/logic.ts << 'FILE_END'
export interface MetaData {
  title: string;
  description: string;
  url: string;
  image: string;
  author: string;
}

export function escapeHtmlAttr(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function generateMetaTags(data: MetaData): string {
  const tags: string[] = [];
  const t = escapeHtmlAttr(data.title);
  const d = escapeHtmlAttr(data.description);
  const u = escapeHtmlAttr(data.url);
  const i = escapeHtmlAttr(data.image);
  const a = escapeHtmlAttr(data.author);

  tags.push('<!-- Primary Meta Tags -->');
  if (t) tags.push(`<title>${t}</title>`);
  if (d) tags.push(`<meta name="description" content="${d}">`);
  if (a) tags.push(`<meta name="author" content="${a}">`);
  if (u) tags.push(`<link rel="canonical" href="${u}">`);

  tags.push('');
  tags.push('<!-- Open Graph / Facebook -->');
  tags.push('<meta property="og:type" content="website">');
  if (u) tags.push(`<meta property="og:url" content="${u}">`);
  if (t) tags.push(`<meta property="og:title" content="${t}">`);
  if (d) tags.push(`<meta property="og:description" content="${d}">`);
  if (i) tags.push(`<meta property="og:image" content="${i}">`);

  tags.push('');
  tags.push('<!-- Twitter -->');
  tags.push('<meta property="twitter:card" content="summary_large_image">');
  if (u) tags.push(`<meta property="twitter:url" content="${u}">`);
  if (t) tags.push(`<meta property="twitter:title" content="${t}">`);
  if (d) tags.push(`<meta property="twitter:description" content="${d}">`);
  if (i) tags.push(`<meta property="twitter:image" content="${i}">`);

  return tags.join('\n').trim();
}
FILE_END
show src/tools/seo/meta-tag-generator/logic.ts

step "[4/10] meta-tag-generator/Tool.astro"
cat > src/tools/seo/meta-tag-generator/Tool.astro << 'FILE_END'
---
---
<div class="mtg-tool">
  <div class="mtg-form">
    <div class="mtg-field">
      <label for="mtg-title">عنوان صفحه (Title)</label>
      <input id="mtg-title" type="text" class="input" placeholder="مثلاً: ابزارهای آنلاین حرفه‌ای" />
    </div>
    <div class="mtg-field">
      <label for="mtg-desc">توضیحات (Description)</label>
      <textarea id="mtg-desc" class="textarea" rows="2" placeholder="توضیح مختصر و جذاب..."></textarea>
    </div>
    <div class="mtg-row">
      <div class="mtg-field">
        <label for="mtg-url">آدرس سایت (URL)</label>
        <input id="mtg-url" type="url" class="input" placeholder="https://example.com" dir="ltr" />
      </div>
      <div class="mtg-field">
        <label for="mtg-author">نویسنده / برند (Author)</label>
        <input id="mtg-author" type="text" class="input" placeholder="مثلاً: تیم ما" />
      </div>
    </div>
    <div class="mtg-field">
      <label for="mtg-image">آدرس تصویر (Image URL)</label>
      <input id="mtg-image" type="url" class="input" placeholder="https://example.com/og.jpg" dir="ltr" />
    </div>
  </div>
  
  <div class="mtg-output-wrap">
    <label for="mtg-output" class="mtg-label">کد HTML تولید شده:</label>
    <textarea id="mtg-output" class="textarea mtg-output" readonly></textarea>
    <div class="mtg-actions">
      <button type="button" class="btn btn-primary" id="mtg-copy"><span aria-hidden="true">📋</span> کپی کد</button>
    </div>
  </div>
</div>

<script>
  import { generateMetaTags } from './logic';
  import { copyText, toast } from '../../../lib/ui';

  const inputIds = ['mtg-title', 'mtg-desc', 'mtg-url', 'mtg-image', 'mtg-author'];
  const output = document.getElementById('mtg-output') as HTMLTextAreaElement | null;
  const copyBtn = document.getElementById('mtg-copy') as HTMLButtonElement | null;

  function refresh() {
    if (!output) return;
    const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value || '';
    
    output.value = generateMetaTags({
      title: getVal('mtg-title'),
      description: getVal('mtg-desc'),
      url: getVal('mtg-url'),
      image: getVal('mtg-image'),
      author: getVal('mtg-author')
    });
  }

  for (const id of inputIds) {
    document.getElementById(id)?.addEventListener('input', refresh);
  }

  copyBtn?.addEventListener('click', async () => {
    if (!output || !output.value) return;
    const ok = await copyText(output.value);
    if (ok) toast('کد متا کپی شد', 'success'); else toast('کپی نشد', 'error');
  });

  refresh();
</script>

<style>
  .mtg-tool { display: flex; flex-direction: column; gap: var(--space-4); }
  .mtg-form { display: flex; flex-direction: column; gap: var(--space-3); }
  .mtg-row { display: flex; flex-wrap: wrap; gap: var(--space-3); }
  .mtg-row > .mtg-field { flex: 1; min-width: 200px; }
  .mtg-field { display: flex; flex-direction: column; gap: var(--space-1); }
  .mtg-field label { font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); }
  .mtg-label { font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); margin-top: var(--space-2); }
  .mtg-output { background: var(--color-surface-2); font-family: var(--font-mono); height: 220px; font-size: 0.85rem; }
  .mtg-actions { display: flex; justify-content: flex-end; margin-top: var(--space-2); }
</style>
FILE_END
show src/tools/seo/meta-tag-generator/Tool.astro

step "[5/10] tests/unit/meta-tag-generator.test.ts"
cat > tests/unit/meta-tag-generator.test.ts << 'FILE_END'
import { describe, it, expect } from 'vitest';
import { generateMetaTags, escapeHtmlAttr } from '../../src/tools/seo/meta-tag-generator/logic';

describe('escapeHtmlAttr', () => {
  it('escapes quotes and ampersands', () => {
    expect(escapeHtmlAttr('A & B "C" <D>')).toBe('A &amp; B &quot;C&quot; &lt;D&gt;');
  });
});

describe('generateMetaTags', () => {
  it('generates correct tags for full data', () => {
    const html = generateMetaTags({
      title: 'Test Title',
      description: 'Test Desc',
      url: 'https://test.com',
      image: 'https://test.com/img.jpg',
      author: 'Me'
    });
    expect(html).toContain('<title>Test Title</title>');
    expect(html).toContain('<meta name="description" content="Test Desc">');
    expect(html).toContain('<meta property="og:title" content="Test Title">');
    expect(html).toContain('<meta property="twitter:image" content="https://test.com/img.jpg">');
  });

  it('escapes malicious input', () => {
    const html = generateMetaTags({
      title: '"><script>alert(1)</script>',
      description: '', url: '', image: '', author: ''
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&quot;&gt;&lt;script&gt;');
  });

  it('omits empty tags', () => {
    const html = generateMetaTags({ title: '', description: '', url: '', image: '', author: '' });
    expect(html).not.toContain('<title>');
    expect(html).toContain('<meta property="og:type"');
  });
});
FILE_END
show tests/unit/meta-tag-generator.test.ts

step "[6/10] serp-preview/meta.ts"
cat > src/tools/seo/serp-preview/meta.ts << 'FILE_END'
import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'serp-preview',
  category: 'seo',
  name: { fa: 'پیش‌نمایش نتایج گوگل (SERP)', en: 'SERP Preview' },
  description: {
    fa: 'نحوه نمایش سایت خود را در نتایج جستجوی گوگل مشاهده کنید و طول عنوان و توضیحات را بهینه کنید.',
    en: 'See how your site appears in Google search results and optimize title and description length.'
  },
  keywords: ['serp', 'google preview', 'seo preview', 'پیش نمایش گوگل', 'سئو'],
  addedAt: '2026-11-11',
  related: ['meta-tag-generator']
};
FILE_END
show src/tools/seo/serp-preview/meta.ts

step "[7/10] serp-preview/logic.ts"
cat > src/tools/seo/serp-preview/logic.ts << 'FILE_END'
export const MAX_TITLE_LEN = 60;
export const MAX_DESC_LEN = 160;

export function truncate(text: string, max: number): string {
  if (!text) return '';
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1).trimEnd();
  return cut + '…';
}

export function formatUrlForSerp(url: string): string {
  if (!url) return 'example.com';
  let clean = url.trim();
  if (!clean.startsWith('http')) clean = 'https://' + clean;
  try {
    const u = new URL(clean);
    const parts = u.pathname.split('/').filter(Boolean);
    const domain = u.hostname.replace(/^www\./, '');
    return [domain, ...parts].join(' › ');
  } catch {
    return url;
  }
}
FILE_END
show src/tools/seo/serp-preview/logic.ts

step "[8/10] serp-preview/Tool.astro"
cat > src/tools/seo/serp-preview/Tool.astro << 'FILE_END'
---
---
<div class="serp-tool">
  <div class="serp-form">
    <div class="serp-field">
      <label for="serp-url">آدرس صفحه (URL)</label>
      <input id="serp-url" type="url" class="input" placeholder="https://example.com/page" dir="ltr" />
    </div>
    <div class="serp-field">
      <label for="serp-title">عنوان (Title)</label>
      <input id="serp-title" type="text" class="input" placeholder="عنوان جذاب برای گوگل..." />
      <div class="serp-hint"><span id="serp-title-count">0</span> / 60 کاراکتر</div>
    </div>
    <div class="serp-field">
      <label for="serp-desc">توضیحات (Description)</label>
      <textarea id="serp-desc" class="textarea" rows="3" placeholder="توضیحات متا..."></textarea>
      <div class="serp-hint"><span id="serp-desc-count">0</span> / 160 کاراکتر</div>
    </div>
  </div>

  <div class="serp-preview-wrap">
    <div class="serp-label">پیش‌نمایش در گوگل (دسکتاپ):</div>
    <div class="serp-card">
      <div class="serp-url" id="prev-url">example.com</div>
      <div class="serp-title" id="prev-title">عنوان صفحه شما در اینجا نمایش داده می‌شود</div>
      <div class="serp-desc" id="prev-desc">توضیحات متا شما در اینجا نمایش داده می‌شود. سعی کنید آن را جذاب و مرتبط با محتوای صفحه بنویسید تا کاربران روی لینک شما کلیک کنند.</div>
    </div>
  </div>
</div>

<script>
  import { truncate, formatUrlForSerp, MAX_TITLE_LEN, MAX_DESC_LEN } from './logic';

  const urlInput = document.getElementById('serp-url') as HTMLInputElement | null;
  const titleInput = document.getElementById('serp-title') as HTMLInputElement | null;
  const descInput = document.getElementById('serp-desc') as HTMLTextAreaElement | null;

  const prevUrl = document.getElementById('prev-url');
  const prevTitle = document.getElementById('prev-title');
  const prevDesc = document.getElementById('prev-desc');
  
  const titleCount = document.getElementById('serp-title-count');
  const descCount = document.getElementById('serp-desc-count');

  function refresh() {
    if (!urlInput || !titleInput || !descInput) return;

    const urlVal = urlInput.value;
    const titleVal = titleInput.value;
    const descVal = descInput.value;

    if (titleCount) titleCount.textContent = String(titleVal.length);
    if (descCount) descCount.textContent = String(descVal.length);

    if (prevUrl) prevUrl.textContent = formatUrlForSerp(urlVal);
    if (prevTitle) prevTitle.textContent = titleVal ? truncate(titleVal, MAX_TITLE_LEN) : 'عنوان صفحه شما در اینجا نمایش داده می‌شود';
    if (prevDesc) prevDesc.textContent = descVal ? truncate(descVal, MAX_DESC_LEN) : 'توضیحات متا شما در اینجا نمایش داده می‌شود. سعی کنید آن را جذاب و مرتبط با محتوای صفحه بنویسید تا کاربران روی لینک شما کلیک کنند.';
  }

  urlInput?.addEventListener('input', refresh);
  titleInput?.addEventListener('input', refresh);
  descInput?.addEventListener('input', refresh);

  refresh();
</script>

<style>
  .serp-tool { display: flex; flex-direction: column; gap: var(--space-4); }
  .serp-form { display: flex; flex-direction: column; gap: var(--space-3); }
  .serp-field { display: flex; flex-direction: column; gap: var(--space-1); }
  .serp-field label { font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); }
  .serp-hint { font-size: 0.75rem; color: var(--color-text-muted); text-align: left; }
  .serp-preview-wrap { padding: var(--space-3); background: var(--color-surface-2); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
  .serp-label { font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: var(--space-2); }
  .serp-card { background: #fff; padding: 16px; border-radius: 8px; font-family: arial, sans-serif; text-align: left; }
  [data-theme="dark"] .serp-card { background: #202124; }
  .serp-url { color: #202124; font-size: 14px; margin-bottom: 4px; }
  [data-theme="dark"] .serp-url { color: #bdc1c6; }
  .serp-title { color: #1a0dab; font-size: 20px; line-height: 1.3; margin-bottom: 4px; cursor: pointer; }
  .serp-title:hover { text-decoration: underline; }
  [data-theme="dark"] .serp-title { color: #8ab4f8; }
  .serp-desc { color: #4d5156; font-size: 14px; line-height: 1.58; }
  [data-theme="dark"] .serp-desc { color: #bdc1c6; }
</style>
FILE_END
show src/tools/seo/serp-preview/Tool.astro

step "[9/10] tests/unit/serp-preview.test.ts"
cat > tests/unit/serp-preview.test.ts << 'FILE_END'
import { describe, it, expect } from 'vitest';
import { truncate, formatUrlForSerp } from '../../src/tools/seo/serp-preview/logic';

describe('truncate', () => {
  it('returns short text unchanged', () => {
    expect(truncate('Short', 10)).toBe('Short');
  });
  it('truncates and adds ellipsis', () => {
    expect(truncate('This is a very long text', 10)).toBe('This is a…');
  });
  it('empty returns empty', () => {
    expect(truncate('', 10)).toBe('');
  });
});

describe('formatUrlForSerp', () => {
  it('formats simple domain', () => {
    expect(formatUrlForSerp('https://example.com')).toBe('example.com');
  });
  it('formats with path', () => {
    expect(formatUrlForSerp('https://www.example.com/foo/bar')).toBe('example.com › foo › bar');
  });
  it('adds https if missing', () => {
    expect(formatUrlForSerp('example.com/test')).toBe('example.com › test');
  });
  it('handles invalid URL gracefully', () => {
    expect(formatUrlForSerp('not a url')).toBe('not a url');
  });
});
FILE_END
show tests/unit/serp-preview.test.ts

step "[10/10] Updating registry and index, testing, building"
cat > src/tools/registry.ts << 'FILE_END'
import type { ToolMeta, ToolCategory, CategoryMeta } from './types';
import { meta as wordCounterMeta } from './text/word-counter/meta';
import { meta as caseConverterMeta } from './text/case-converter/meta';
import { meta as removeExtraSpacesMeta } from './text/remove-extra-spaces/meta';
import { meta as lineSorterMeta } from './text/line-sorter/meta';
import { meta as removeDuplicatesMeta } from './text/remove-duplicates/meta';
import { meta as slugGeneratorMeta } from './text/slug-generator/meta';
import { meta as jsonFormatterMeta } from './code/json-formatter/meta';
import { meta as base64Meta } from './code/base64/meta';
import { meta as htmlEscapeMeta } from './code/html-escape/meta';
import { meta as urlEncoderMeta } from './code/url-encoder/meta';
import { meta as uuidGeneratorMeta } from './code/uuid-generator/meta';
import { meta as hashGeneratorMeta } from './code/hash-generator/meta';
import { meta as regexTesterMeta } from './code/regex-tester/meta';
import { meta as percentageMeta } from './calc/percentage/meta';
import { meta as ageMeta } from './calc/age/meta';
import { meta as dateDiffMeta } from './calc/date-diff/meta';
import { meta as unitConverterMeta } from './calc/unit-converter/meta';
import { meta as metaTagMeta } from './seo/meta-tag-generator/meta';
import { meta as serpPreviewMeta } from './seo/serp-preview/meta';

export const categories: CategoryMeta[] = [
  { slug: 'text', fa: 'متن', en: 'Text', icon: '📝' },
  { slug: 'code', fa: 'برنامه‌نویسی', en: 'Code', icon: '💻' },
  { slug: 'calc', fa: 'محاسبات', en: 'Calculators', icon: '🧮' },
  { slug: 'seo', fa: 'سئو', en: 'SEO', icon: '📈' },
  { slug: 'image', fa: 'تصویر', en: 'Image', icon: '🖼️' },
  { slug: 'file', fa: 'فایل', en: 'File', icon: '📁' }
];

export const registry: ToolMeta[] = [
  wordCounterMeta, caseConverterMeta, removeExtraSpacesMeta, lineSorterMeta,
  removeDuplicatesMeta, slugGeneratorMeta,
  jsonFormatterMeta, base64Meta, htmlEscapeMeta, urlEncoderMeta, uuidGeneratorMeta,
  hashGeneratorMeta, regexTesterMeta,
  percentageMeta, ageMeta, dateDiffMeta, unitConverterMeta,
  metaTagMeta, serpPreviewMeta
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return registry.find(t => t.slug === slug);
}
export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return registry.filter(t => t.category === category);
}
export function getPopular(): ToolMeta[] {
  return registry.filter(t => t.popular);
}
export function getCategoryMeta(slug: ToolCategory): CategoryMeta | undefined {
  return categories.find(c => c.slug === slug);
}
export function getRelated(slug: string): ToolMeta[] {
  const tool = getToolBySlug(slug);
  if (!tool?.related?.length) return [];
  return tool.related.map(getToolBySlug).filter((x): x is ToolMeta => Boolean(x));
}
export function getAllSlugs(): string[] {
  return registry.map(t => t.slug);
}
FILE_END
show src/tools/registry.ts

cat > src/tools/index.ts << 'FILE_END'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import WordCounterTool from './text/word-counter/Tool.astro';
import CaseConverterTool from './text/case-converter/Tool.astro';
import RemoveExtraSpacesTool from './text/remove-extra-spaces/Tool.astro';
import LineSorterTool from './text/line-sorter/Tool.astro';
import RemoveDuplicatesTool from './text/remove-duplicates/Tool.astro';
import SlugGeneratorTool from './text/slug-generator/Tool.astro';
import JsonFormatterTool from './code/json-formatter/Tool.astro';
import Base64Tool from './code/base64/Tool.astro';
import HtmlEscapeTool from './code/html-escape/Tool.astro';
import UrlEncoderTool from './code/url-encoder/Tool.astro';
import UuidGeneratorTool from './code/uuid-generator/Tool.astro';
import HashGeneratorTool from './code/hash-generator/Tool.astro';
import RegexTesterTool from './code/regex-tester/Tool.astro';
import PercentageTool from './calc/percentage/Tool.astro';
import AgeTool from './calc/age/Tool.astro';
import DateDiffTool from './calc/date-diff/Tool.astro';
import UnitConverterTool from './calc/unit-converter/Tool.astro';
import MetaTagTool from './seo/meta-tag-generator/Tool.astro';
import SerpPreviewTool from './seo/serp-preview/Tool.astro';

export const toolComponents: Record<string, AstroComponentFactory> = {
  'word-counter': WordCounterTool,
  'case-converter': CaseConverterTool,
  'remove-extra-spaces': RemoveExtraSpacesTool,
  'line-sorter': LineSorterTool,
  'remove-duplicates': RemoveDuplicatesTool,
  'slug-generator': SlugGeneratorTool,
  'json-formatter': JsonFormatterTool,
  'base64': Base64Tool,
  'html-escape': HtmlEscapeTool,
  'url-encoder': UrlEncoderTool,
  'uuid-generator': UuidGeneratorTool,
  'hash-generator': HashGeneratorTool,
  'regex-tester': RegexTesterTool,
  'percentage': PercentageTool,
  'age': AgeTool,
  'date-diff': DateDiffTool,
  'unit-converter': UnitConverterTool,
  'meta-tag-generator': MetaTagTool,
  'serp-preview': SerpPreviewTool
};

export function getToolComponent(slug: string): AstroComponentFactory | null {
  return toolComponents[slug] ?? null;
}
FILE_END
show src/tools/index.ts

echo ""
echo "--- New files ---"
wc -l \
  src/tools/seo/meta-tag-generator/meta.ts src/tools/seo/meta-tag-generator/logic.ts src/tools/seo/meta-tag-generator/Tool.astro tests/unit/meta-tag-generator.test.ts \
  src/tools/seo/serp-preview/meta.ts src/tools/seo/serp-preview/logic.ts src/tools/seo/serp-preview/Tool.astro tests/unit/serp-preview.test.ts \
  src/tools/registry.ts src/tools/index.ts

echo ""
echo "--- Stray delimiters ---"
if grep -rqE "FILE_END" src/ tests/ 2>/dev/null; then
  echo "✗ STRAY FOUND"; exit 1
else
  echo "✓ Clean"
fi

echo ""
echo "--- Unit tests ---"
if ! npx vitest run 2>&1 | tail -10; then
  echo "✗ Tests failed"; exit 1
fi

echo ""
echo "--- Build ---"
if ! npm run build 2>&1 | tail -8; then
  echo "✗ Build failed"; exit 1
fi

echo ""
echo "════════════════════════════════════════"
echo "  ✅ BATCH 12A COMPLETE"
echo "════════════════════════════════════════"
