import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = site
    ? new URL('sitemap-index.xml', site).toString()
    : '';
  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Disallow UI-only utility routes',
    'Disallow: /404/',
    '',
    sitemapUrl ? `Sitemap: ${sitemapUrl}` : '',
    ''
  ];
  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
