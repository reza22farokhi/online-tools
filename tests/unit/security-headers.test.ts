import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const headers = readFileSync('public/_headers', 'utf8');
const baseLayout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const yektanetLoader = readFileSync('public/scripts/yektanet-loader.js', 'utf8');
const csp = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1] ?? '';

function directive(name: string): string {
  return csp
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name} `))
    ?.slice(name.length)
    .trim() ?? '';
}

describe('Content Security Policy allowlist', () => {
  it('does not allow inline JavaScript execution', () => {
    const scriptSources = directive('script-src');

    expect(scriptSources).not.toContain("'unsafe-inline'");
    expect(scriptSources).toContain("'self'");
    expect(baseLayout).toContain('scripts/site-bootstrap.js');
    expect(baseLayout).toContain('scripts/yektanet-loader.js');
    expect(baseLayout).toContain('scripts/global-errors.js');
    expect(baseLayout).toContain('scripts/recent-tool-tracker.js');
  });

  it('guards the Yektanet publisher loader against duplicate injection', () => {
    expect(yektanetLoader).toContain('__yektanetPublisherLoaderStarted');
    expect(yektanetLoader).toContain('yektanet-publisher-loader');
  });
  it('allows only the observed Yektanet font directories', () => {
    const fontSources = directive('font-src');

    expect(fontSources).toContain('https://cdn.yektanet.com/fonts/');
    expect(fontSources).toContain('https://cdn.yektanet.com/assets/fonts/');
    expect(fontSources).not.toMatch(/(?:^|\s)https:(?:\s|$)/);
    expect(fontSources).not.toContain('*');
  });

  it('allows the observed impression endpoint but keeps the Triboon endpoint blocked', () => {
    const connectSources = directive('connect-src');

    expect(connectSources).toContain(
      'https://event.yektanet.com/api/viewed-impression/v1/collect'
    );
    expect(connectSources).not.toContain('native-removal.triboon.net');
    expect(connectSources).not.toContain('*');
  });
});
