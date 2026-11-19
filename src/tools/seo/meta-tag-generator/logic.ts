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

function normalizeHttpUrl(value: string, label: string): string {
  const raw = value.trim();
  if (!raw) return '';
  if (/[\u0000-\u001f\u007f]/.test(raw)) throw new Error(label + ' نباید شامل نویسه‌های کنترلی باشد.');
  const scheme = raw.match(/^([a-z][a-z0-9+.-]*):/i)?.[1].toLowerCase();
  if (scheme && scheme !== 'http' && scheme !== 'https') throw new Error(label + ' باید از HTTP یا HTTPS استفاده کند.');
  const candidate = /^https?:\/\//i.test(raw) ? raw : 'https://' + raw;
  let url: URL;
  try { url = new URL(candidate); }
  catch { throw new Error(label + ' معتبر نیست.'); }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
    throw new Error(label + ' باید یک آدرس HTTP/HTTPS معتبر و بدون اطلاعات ورود باشد.');
  }
  return url.toString();
}

export function generateMetaTags(data: MetaData): string {
  const tags: string[] = [];
  const t = escapeHtmlAttr(data.title);
  const d = escapeHtmlAttr(data.description);
  const u = escapeHtmlAttr(normalizeHttpUrl(data.url, 'آدرس سایت'));
  const i = escapeHtmlAttr(normalizeHttpUrl(data.image, 'آدرس تصویر'));
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
