import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = new URL(site?.toString() ?? 'https://abzar-tools.ir/');
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

  return new Response(lines.join('\\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
