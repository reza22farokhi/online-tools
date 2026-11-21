import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const siteOrigin = 'https://abzar-tools.ir';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function localizedPath(value, locale) {
  const url = new URL(value, siteOrigin);
  let pathname = url.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (locale === 'en') pathname = '/en' + (pathname === '/' ? '/' : pathname);
  url.pathname = pathname;
  url.searchParams.delete('lang');
  return url.toString();
}

function transformEnglishHtml(html) {
  let output = html.replace(/<html\b([^>]*)>/i, (_match, attrs) => {
    const clean = attrs.replace(/\s+lang=(["']).*?\1/i, '').replace(/\s+dir=(["']).*?\1/i, '');
    return '<html' + clean + ' lang="en" dir="ltr">';
  });
  output = output.replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>/i, tag => {
    const href = tag.match(/\bhref=(["'])(.*?)\1/i)?.[2];
    return href ? tag.replace(href, localizedPath(href, 'en')) : tag;
  });
  output = output.replace(/<link\b(?=[^>]*hreflang=["'](?:fa|en|x-default)["'])[^>]*>/gi, tag => {
    const locale = tag.match(/\bhreflang=["'](fa|en|x-default)["']/i)?.[1];
    const href = tag.match(/\bhref=(["'])(.*?)\1/i)?.[2];
    return locale && href ? tag.replace(href, localizedPath(href, locale === 'en' ? 'en' : 'fa')) : tag;
  });
  output = output.replace(/(<meta\b(?=[^>]*property=["']og:url["'])[^>]*content=["'])([^"']+)(["'][^>]*>)/i,
    (_match, before, href, after) => before + localizedPath(href, 'en') + after);
  output = output.replace(/(<meta\b(?=[^>]*property=["']og:locale["'])[^>]*content=["'])[^"']+(["'][^>]*>)/i, '$1en_US$2');
  output = output.replace(/<script\b[^>]*\bdata-jsonld-lang=["'](fa|en)["'][^>]*>/gi, tag => {
    const locale = tag.match(/data-jsonld-lang=["'](fa|en)["']/i)?.[1];
    const type = locale === 'en' ? 'application/ld+json' : 'application/json';
    return /\btype=["'][^"']+["']/i.test(tag)
      ? tag.replace(/\btype=["'][^"']+["']/i, 'type="' + type + '"')
      : tag.replace('<script', '<script type="' + type + '"');
  });
  return output;
}

const htmlFiles = (await walk(dist)).filter(file => file.endsWith('.html'));
let generated = 0;
for (const source of htmlFiles) {
  const relative = path.relative(dist, source).split(path.sep).join('/');
  if (relative.startsWith('en/') || /(^|\/)(404|offline)\/index\.html$/.test(relative)) continue;
  const original = await readFile(source, 'utf8');
  if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(original)) continue;
  const destination = path.join(dist, 'en', relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, transformEnglishHtml(original), 'utf8');
  generated++;
}

const sitemapFiles = (await walk(dist)).filter(file => /^sitemap-\d+\.xml$/.test(path.basename(file)));
for (const file of sitemapFiles) {
  let xml = await readFile(file, 'utf8');
  if (!xml.includes('xmlns:xhtml=')) {
    xml = xml.replace(/<urlset\b([^>]*)>/i, '<urlset$1 xmlns:xhtml="http://www.w3.org/1999/xhtml">');
  }
  const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => match[1]);
  const entries = new Map();
  for (const block of blocks) {
    const href = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
    if (!href) continue;
    const parsed = new URL(href);
    if (/\/(404|offline)\/?$/.test(parsed.pathname)) continue;
    const fa = localizedPath(href, 'fa');
    const en = localizedPath(href, 'en');
    const alternates = '<xhtml:link rel="alternate" hreflang="fa" href="' + fa + '"/>' +
      '<xhtml:link rel="alternate" hreflang="en" href="' + en + '"/>' +
      '<xhtml:link rel="alternate" hreflang="x-default" href="' + fa + '"/>';
    const clean = block.replace(/<xhtml:link\b[^>]*\/>/g, '');
    entries.set(fa, '<url>' + clean.replace('</url>', '') + alternates + '</url>');
    entries.set(en, '<url>' + clean.replace(href, en) + alternates + '</url>');
  }
  const empty = xml.replace(/<url>[\s\S]*?<\/url>/g, '');
  xml = empty.replace('</urlset>', Array.from(entries.values()).join('') + '</urlset>');
  await writeFile(file, xml, 'utf8');
}
console.log('Generated ' + generated + ' English HTML routes and updated ' + sitemapFiles.length + ' sitemap file(s).');
