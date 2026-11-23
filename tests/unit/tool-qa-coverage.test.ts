import { describe, expect, it } from 'vitest';
import { registry } from '../../src/tools/registry';

// Discover tool-specific tests across unit, colocated logic, and browser suites.
// A new registry entry without a matching behavioral test fails CI.
const discoveredToolTests = import.meta.glob([
  './**/*.test.ts',
  '../../src/tools/**/logic.test.ts',
  '../e2e/**/*.spec.ts'
]);

const testAliases: Record<string, string[]> = {
  'persian-text-refiner': ['persian-fixer']
};

describe('tool QA coverage contract', () => {
  it('requires every registered tool to have at least one tool-specific test suite', () => {
    const paths = Object.keys(discoveredToolTests);
    const uncovered = registry
      .filter((tool) => {
        const identifiers = [tool.slug, ...(testAliases[tool.slug] ?? [])];
        return !paths.some((path) =>
          identifiers.some((identifier) =>
            path.endsWith(`/${identifier}.test.ts`) ||
            path.endsWith(`/${identifier}.spec.ts`) ||
            path.endsWith(`/${identifier}/logic.test.ts`)
          )
        );
      })
      .map((tool) => tool.slug);

    expect(uncovered, `Missing tool-specific behavioral tests: ${uncovered.join(', ')}`).toEqual([]);
  });
});
