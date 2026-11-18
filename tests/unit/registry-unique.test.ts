import { describe, expect, it } from 'vitest';
import { registry } from '../../src/tools/registry';

describe('tool registry', () => {
  it('contains unique tool slugs', () => {
    const slugs = registry.map((tool) => tool.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
