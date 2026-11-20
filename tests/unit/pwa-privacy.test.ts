import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8')) as Record<string, unknown>;
const bootstrap = readFileSync('public/scripts/site-bootstrap.js', 'utf8');

describe('PWA privacy', () => {
  it('does not advertise a GET share target that forwards shared text in the request URL', () => {
    expect(manifest.share_target).toBeUndefined();
  });
  it('hides inactive language-only content during the early bootstrap pass', () => {
    expect(bootstrap).toContain("document.querySelectorAll('[data-lang-only]')");
    expect(bootstrap).toContain("element.hidden = element.getAttribute('data-lang-only') !== lang");
  });

});
