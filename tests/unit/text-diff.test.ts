import { describe, it, expect } from 'vitest';
import { diffTexts, diffTextsAdvanced, createUnifiedDiff } from '../../src/tools/text/text-diff/logic';

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

  it('rejects inputs that exceed the safe character limit', () => {
    expect(() => diffTexts('a'.repeat(100_001), 'b'.repeat(100_001))).toThrow(/۲۰۰ هزار/);
  });

  it('rejects excessive line-matrix sizes', () => {
    const lines = Array.from({ length: 1_001 }, (_, i) => String(i)).join('\n');
    expect(() => diffTexts(lines, lines)).toThrow(/۱ میلیون/);
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

describe('Advanced Text Diff', () => {
  it('detects word-level edits without collapsing punctuation', () => {
    const result = diffTextsAdvanced('hello world!', 'hello there!', { granularity: 'word' });
    expect(result).toEqual([
      { type: 'unchanged', value: 'hello' },
      { type: 'unchanged', value: ' ' },
      { type: 'removed', value: 'world' },
      { type: 'added', value: 'there' },
      { type: 'unchanged', value: '!' }
    ]);
  });

  it('detects character-level changes', () => {
    const result = diffTextsAdvanced('cat', 'car', { granularity: 'character' });
    expect(result).toEqual([
      { type: 'unchanged', value: 'c' },
      { type: 'unchanged', value: 'a' },
      { type: 'removed', value: 't' },
      { type: 'added', value: 'r' }
    ]);
  });

  it('supports ignoring case and whitespace for matching', () => {
    const result = diffTextsAdvanced('Hello  World', 'hello world', {
      granularity: 'word',
      ignoreCase: true,
      ignoreWhitespace: true
    });
    expect(result.every(item => item.type === 'unchanged')).toBe(true);
  });

  it('creates a line-accurate unified diff without a phantom trailing line', () => {
    const output = createUnifiedDiff('one\ntwo\n', 'one\nthree\n');
    expect(output).toContain('--- original');
    expect(output).toContain('+++ updated');
    expect(output).toContain('@@ -1,2 +1,2 @@');
    expect(output).not.toContain('@@ -1,3 +1,3 @@');
    expect(output).toContain('-two');
    expect(output).toContain('+three');
  });

  it('marks a missing final newline on the updated side', () => {
    const output = createUnifiedDiff('same\n', 'same');
    expect(output).toContain('@@ -1,1 +1,1 @@');
    expect(output).toContain('-same\n+same\n\\ No newline at end of file');
  });

  it('marks a missing final newline on the original side', () => {
    const output = createUnifiedDiff('same', 'same\n');
    expect(output).toContain('-same\n\\ No newline at end of file\n+same');
  });

  it('returns a no-changes unified diff for identical text', () => {
    expect(createUnifiedDiff('same', 'same')).toContain('(no changes)');
  });

  it('rejects oversized token matrices before allocation', () => {
    const text = Array.from({ length: 1_100 }, (_, i) => String(i)).join(' ');
    expect(() => diffTextsAdvanced(text, text, { granularity: 'word' })).toThrow(/۱ میلیون/);
  });
});
