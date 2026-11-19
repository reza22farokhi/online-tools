import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8')) as Record<string, unknown>;

describe('PWA privacy', () => {
  it('does not advertise a GET share target that forwards shared text in the request URL', () => {
    expect(manifest.share_target).toBeUndefined();
  });
});
