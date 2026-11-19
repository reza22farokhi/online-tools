export interface RobotsOptions {
  userAgent: string;
  disallow: string;
  allow: string;
  sitemap: string;
}

function assertSingleLine(value: string, field: string): string {
  const trimmed = value.trim();
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) {
    throw new Error(field + ' نباید شامل نویسه‌های کنترلی باشد.');
  }
  return trimmed;
}

function normalizeSitemap(value: string): string {
  const raw = assertSingleLine(value, 'آدرس نقشه سایت');
  if (!raw) return '';
  const explicitScheme = raw.match(/^([a-z][a-z0-9+.-]*):/i)?.[1].toLowerCase();
  if (explicitScheme && explicitScheme !== 'http' && explicitScheme !== 'https') {
    throw new Error('آدرس نقشه سایت باید از HTTP یا HTTPS استفاده کند.');
  }
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : 'https://' + raw;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('آدرس نقشه سایت معتبر وارد کنید.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
    throw new Error('آدرس نقشه سایت باید HTTP یا HTTPS باشد و نباید اطلاعات ورود داشته باشد.');
  }
  return url.toString();
}

function normalizePathLines(value: string, field: string): string[] {
  return value.split(/\r?\n/).map(line => assertSingleLine(line, field)).filter(Boolean).map(path => {
    if (/\s/.test(path)) throw new Error(field + ' نباید فاصله داشته باشد.');
    return path.startsWith('/') ? path : '/' + path;
  });
}

export function generateRobotsTxt(opts: RobotsOptions): string {
  const lines: string[] = [];
  const ua = assertSingleLine(opts.userAgent || '*', 'User-agent') || '*';
  if (!/^(?:\*|[A-Za-z0-9_-]+)$/.test(ua)) {
    throw new Error('مقدار User-agent شامل نویسه‌های پشتیبانی‌نشده است.');
  }

  lines.push(`User-agent: ${ua}`);

  const disallowPaths = normalizePathLines(opts.disallow, 'مسیر غیرمجاز');
  if (disallowPaths.length === 0) {
    lines.push('Disallow:');
  } else {
    disallowPaths.forEach(path => lines.push(`Disallow: ${path}`));
  }

  const allowPaths = normalizePathLines(opts.allow, 'مسیر مجاز');
  allowPaths.forEach(path => lines.push(`Allow: ${path}`));

  const sitemap = normalizeSitemap(opts.sitemap);
  if (sitemap) {
    lines.push('');
    lines.push(`Sitemap: ${sitemap}`);
  }

  return lines.join('\n');
}
