import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const fallbackSite = 'https://reza22farokhi.github.io/online-tools';
  let siteUrl = site ? site.toString() : fallbackSite;
  
  // اطمینان از اینکه آدرس پایه با / تمام می‌شود تا new URL مسیر را درست بسازد
  if (!siteUrl.endsWith('/')) siteUrl += '/';
  
  const sitemapUrl = new URL('sitemap-index.xml', siteUrl).toString();
  
  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Disallow UI-only utility routes',
    'Disallow: /404/',
    '',
    `Sitemap: ${sitemapUrl}`,
    ''
  ];
  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
