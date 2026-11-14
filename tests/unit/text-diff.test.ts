import { describe, it, expect } from 'vitest';
import { diffTexts } from '../../src/tools/text/text-diff/logic';

describe('Text Diff', () => {
  it('should detect no changes', () => {
    const res = diffTexts('a\nb', 'a\nb');
    expect(res).toEqual([
      { type: 'unchanged', value: 'a' },
      { type: 'unchanged', value: 'b' }
    ]);
  });

  it('should detect additions', () => {
    const res = diffTexts('a', 'a\nb');
    expect(res).toEqual([
      { type: 'unchanged', value: 'a' },
      { type: 'added', value: 'b' }
    ]);
  });

  it('should detect removals', () => {
    const res = diffTexts('a\nb', 'a');
    expect(res).toEqual([
      { type: 'unchanged', value: 'a' },
      { type: 'removed', value: 'b' }
    ]);
  });

  it('should handle mixed changes', () => {
    const res = diffTexts('a\nb\nc', 'a\nx\nc');
    expect(res).toEqual([
      { type: 'unchanged', value: 'a' },
      { type: 'removed', value: 'b' },
      { type: 'added', value: 'x' },
      { type: 'unchanged', value: 'c' }
    ]);
  });
});
