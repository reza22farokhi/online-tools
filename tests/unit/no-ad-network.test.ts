import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { describe, expect, it } from 'vitest';

const roots = ['src', 'public'];
const textExtensions = new Set(['.astro', '.css', '.html', '.js', '.json', '.md', '.svg', '.ts', '.txt', '.xml']);
const retiredThirdPartyMarkers = /yektanet|triboon|ynpos|yn-bnr|yn_pub|ad-slot-wrap|pos-article-display-card|cdn\.yektanet|counterapi\.dev|live-count|VisitorCounter/i;

function collectTextFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTextFiles(path);
    return textExtensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
  });
}

describe('retired third-party integrations', () => {
  it('leaves no advertising provider or visitor-counter code in shipped source and assets', () => {
    const matches = roots.flatMap(root => collectTextFiles(root)).flatMap(path => {
      const content = readFileSync(path, 'utf8');
      return retiredThirdPartyMarkers.test(content) ? [path] : [];
    });

    expect(matches).toEqual([]);
  });

  it('limits browser connections to the site and the explicitly required AI model hosts', () => {
    const headers = readFileSync('public/_headers', 'utf8');
    const policy = headers.match(/Content-Security-Policy:\s*([^\r\n]+)/)?.[1] ?? '';
    const connectSources = policy.match(/(?:^|;\s*)connect-src\s+([^;]+)/)?.[1]?.trim();

    expect(connectSources).toBe("'self' https://staticimgly.com https://cdn.jsdelivr.net");
    expect(connectSources).not.toMatch(/yektanet|triboon|counterapi|\*/i);
  });
  it('denies framing, cross-origin document isolation escapes, and unsafe script sources', () => {
    const headers = readFileSync('public/_headers', 'utf8');
    const policy = headers.match(/Content-Security-Policy:\s*([^\r\n]+)/)?.[1] ?? '';
    const scriptSources = policy.match(/(?:^|;)\s*script-src\s+([^;]+)/)?.[1] ?? '';
    const scriptTokens = scriptSources.split(/\s+/);
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain('upgrade-insecure-requests');
    expect(scriptTokens).not.toContain("'unsafe-inline'");
    expect(scriptTokens).not.toContain("'unsafe-eval'");
    expect(scriptTokens).not.toContain('*');
    expect(headers).toContain('Cross-Origin-Opener-Policy: same-origin');
    expect(headers).toContain('Cross-Origin-Resource-Policy: same-origin');
    expect(headers).toContain('Origin-Agent-Cluster: ?1');
  });

});
