export interface RobotsOptions {
  userAgent: string;
  disallow: string;
  allow: string;
  sitemap: string;
}

export function generateRobotsTxt(opts: RobotsOptions): string {
  const lines: string[] = [];
  const ua = opts.userAgent.trim() || '*';
  
  lines.push(`User-agent: ${ua}`);
  
  const disallowPaths = opts.disallow.split('\n').map(p => p.trim()).filter(Boolean);
  if (disallowPaths.length === 0) {
    lines.push('Disallow:'); 
  } else {
    disallowPaths.forEach(path => {
      if (!path.startsWith('/')) path = '/' + path;
      lines.push(`Disallow: ${path}`);
    });
  }

  const allowPaths = opts.allow.split('\n').map(p => p.trim()).filter(Boolean);
  allowPaths.forEach(path => {
    if (!path.startsWith('/')) path = '/' + path;
    lines.push(`Allow: ${path}`);
  });

  if (opts.sitemap.trim()) {
    let site = opts.sitemap.trim();
    if (!site.startsWith('http')) site = 'https://' + site;
    lines.push('');
    lines.push(`Sitemap: ${site}`);
  }

  return lines.join('\n');
}
