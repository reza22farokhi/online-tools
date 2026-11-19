export interface RobotsOptions {
  userAgent: string;
  disallow: string;
  allow: string;
  sitemap: string;
}

function assertSingleLine(value: string, field: string): string {
  const trimmed = value.trim();
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) {
    throw new Error(field + ' must not contain control characters.');
  }
  return trimmed;
}

function normalizeSitemap(value: string): string {
  const raw = assertSingleLine(value, 'Sitemap URL');
  if (!raw) return '';
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : 'https://' + raw;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('Enter a valid sitemap URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
    throw new Error('Sitemap URL must use HTTP or HTTPS and must not contain credentials.');
  }
  return url.toString();
}

function normalizePathLines(value: string, field: string): string[] {
  return value.split(/\r?\n/).map(line => assertSingleLine(line, field)).filter(Boolean).map(path => {
    if (/\s/.test(path)) throw new Error(field + ' must not contain spaces.');
    return path.startsWith('/') ? path : '/' + path;
  });
}

export function generateRobotsTxt(opts: RobotsOptions): string {
  const lines: string[] = [];
  const ua = assertSingleLine(opts.userAgent || '*', 'User-agent') || '*';
  if (!/^(?:\*|[A-Za-z0-9_-]+)$/.test(ua)) {
    throw new Error('User-agent contains unsupported characters.');
  }

  lines.push(`User-agent: ${ua}`);

  const disallowPaths = normalizePathLines(opts.disallow, 'Disallow path');
  if (disallowPaths.length === 0) {
    lines.push('Disallow:');
  } else {
    disallowPaths.forEach(path => lines.push(`Disallow: ${path}`));
  }

  const allowPaths = normalizePathLines(opts.allow, 'Allow path');
  allowPaths.forEach(path => lines.push(`Allow: ${path}`));

  const sitemap = normalizeSitemap(opts.sitemap);
  if (sitemap) {
    lines.push('');
    lines.push(`Sitemap: ${sitemap}`);
  }

  return lines.join('\n');
}
