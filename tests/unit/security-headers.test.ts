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
  it('allows only the site, required modules, the Yektanet loader, and verified inline script hashes', () => {
    expect(directive('script-src')).toBe(
      "'self' https://cdn.yektanet.ir https://cdn.yektanet.com https://native-scripts.yektanet.com https://cdn.jsdelivr.net 'wasm-unsafe-eval' 'sha256-feMt1N4YpWxmeS0EtHyuyChvwWkgbfB5LJvGAma7jzo=' 'sha256-PaqSNyGFkkCfhNK7zr4Zdw/6ul3MbCJFJwnC2lSES7A='"
    );
    expect(csp).not.toMatch(/mediaad|triboon/i);
    expect(baseLayout.split('https://cdn.yektanet.ir/superscript-v2/Cg1anVr4/native-49280/yn_pub.js')).toHaveLength(2);
    expect(baseLayout.split('<AdSlot id="ynpos-21471" />')).toHaveLength(2);
    expect(baseLayout.split('<AdSlot id="ynpos-21470" />')).toHaveLength(2);
    expect(baseLayout).toContain('ynpos-21471');
    expect(baseLayout).toContain('ynpos-21470');
    expect(toolLayout).not.toMatch(/AdSlot|pos-article-display-card|data-ad-id/i);
    expect(blogLayout).not.toMatch(/pos-article-display-card|yektanet|ynpos/i);
  });

  it('allows the observed Yektanet API and fingerprint frame endpoints without wildcards', () => {
    expect(directive('connect-src')).toBe("'self' https://staticimgly.com https://cdn.jsdelivr.net https://jamssp.yektanet.com https://audience.yektanet.com https://ua.yektanet.com");
    expect(directive('frame-src')).toBe('blob: https://cdn.yektanet.com');
    expect(directive('img-src')).toBe("'self' data: blob:");
    expect(directive('font-src')).toBe("'self' data:");
    expect(csp).not.toContain('*');
  });

  it('enforces HTTPS transport for one year without assuming all subdomains are HTTPS', () => {
    expect(headers).toMatch(/^\s*Strict-Transport-Security: max-age=31536000$/m);
    expect(headers).not.toMatch(/^\s*Strict-Transport-Security:.*includeSubDomains/m);
  });

  it('does not ship inline blog scripts blocked by script-src self', () => {
    expect(blogLayout).not.toMatch(/<script\s+is:inline(?:\s|>)/i);
  });

  it('keeps restrictive baseline directives', () => {
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).not.toContain('*');
    expect(directive('script-src')).not.toContain("'unsafe-inline'");
    expect(directive('script-src')).not.toContain("'unsafe-eval'");
    expect(directive('style-src')).toBe("'self' 'unsafe-inline'");
  });

  it('keeps the offline retry action compatible with the strict script CSP', () => {
    expect(offlinePage).not.toMatch(/\son[a-z]+\s*=/i);
    expect(offlinePage).toContain('<a href="/"');
  });
});
