import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const headers = readFileSync('public/_headers', 'utf8');
const baseLayout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const toolLayout = readFileSync('src/layouts/ToolLayout.astro', 'utf8');
const blogLayout = readFileSync('src/layouts/BlogLayout.astro', 'utf8');
const offlinePage = readFileSync('src/pages/offline.astro', 'utf8');
const csp = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1] ?? '';

function directive(name: string): string {
  return csp.split(';').map(part => part.trim())
    .find(part => part.startsWith(name + ' '))
    ?.slice(name.length).trim() ?? '';
}

describe('Content Security Policy allowlist', () => {
  it('keeps scripts same-origin and excludes retired ad network origins', () => {
    expect(directive('script-src')).toBe("'self'");
    expect(csp).not.toMatch(/yektanet|triboon/i);
    expect(baseLayout).not.toMatch(/yektanet|ynpos|yn-bnr|yn_pub/i);
    expect(toolLayout).not.toMatch(/AdSlot|pos-article-display-card|data-ad-id/i);
    expect(blogLayout).not.toMatch(/pos-article-display-card|yektanet|ynpos/i);
  });

  it('retains only required same-origin and counter API connections', () => {
    expect(directive('connect-src')).toBe("'self' https://api.counterapi.dev");
    expect(directive('img-src')).toBe("'self' data: blob:");
    expect(directive('font-src')).toBe("'self' data:");
    expect(directive('frame-src')).toBe('blob:');
  });

  it('enforces HTTPS transport for one year without assuming all subdomains are HTTPS', () => {
    expect(headers).toMatch(/^\s*Strict-Transport-Security: max-age=31536000$/m);
    expect(headers).not.toMatch(/^\s*Strict-Transport-Security:.*includeSubDomains/m);
  });

  it('keeps restrictive baseline directives', () => {
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).not.toContain('*');
  });
  it('keeps the offline retry action compatible with the strict script CSP', () => {
    expect(offlinePage).not.toMatch(/\\son[a-z]+\\s*=/i);
    expect(offlinePage).toContain('<a href="/"');
  });
});
