import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { describe, expect, it } from 'vitest';

const roots = ['src', 'public'];
const textExtensions = new Set(['.astro', '.css', '.html', '.js', '.json', '.md', '.svg', '.ts', '.txt', '.xml']);
const retiredAdMarkers = /yektanet|triboon|ynpos|yn-bnr|yn_pub|ad-slot-wrap|pos-article-display-card|cdn\.yektanet/i;

function collectTextFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTextFiles(path);
    return textExtensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
  });
}

describe('retired advertising integration', () => {
  it('leaves no provider scripts, slots, domains, or identifiers in shipped source and assets', () => {
    const matches = roots.flatMap(root => collectTextFiles(root)).flatMap(path => {
      const content = readFileSync(path, 'utf8');
      return retiredAdMarkers.test(content) ? [path] : [];
    });

    expect(matches).toEqual([]);
  });
});
