import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const headers = readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8');
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
