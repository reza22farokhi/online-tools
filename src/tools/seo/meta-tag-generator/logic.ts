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
