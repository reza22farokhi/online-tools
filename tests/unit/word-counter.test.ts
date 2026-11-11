import { describe, it, expect } from 'vitest';
import { analyzeText, MAX_INPUT_LENGTH } from '../../src/tools/text/word-counter/logic';

describe('analyzeText', () => {
  it('returns zero stats for empty string', () => {
    const s = analyzeText('');
    expect(s.words).toBe(0);
    expect(s.characters).toBe(0);
    expect(s.charactersNoSpaces).toBe(0);
    expect(s.sentences).toBe(0);
    expect(s.lines).toBe(0);
    expect(s.nonEmptyLines).toBe(0);
    expect(s.paragraphs).toBe(0);
    expect(s.readingTimeMin).toBe(0);
  });

  it('counts simple English words', () => {
    const s = analyzeText('hello world');
    expect(s.words).toBe(2);
    expect(s.characters).toBe(11);
    expect(s.charactersNoSpaces).toBe(10);
  });

  it('counts Persian words', () => {
    const s = analyzeText('سلام دنیا');
    expect(s.words).toBe(2);
  });

  it('counts sentences with Latin punctuation', () => {
    const s = analyzeText('Hello. World! How are you?');
    expect(s.sentences).toBe(3);
  });

  it('counts sentences with Persian punctuation', () => {
    const s = analyzeText('سلام. خوبی؟ بله!');
    expect(s.sentences).toBe(3);
  });

  it('counts lines', () => {
    const s = analyzeText('line1\nline2\nline3');
    expect(s.lines).toBe(3);
    expect(s.nonEmptyLines).toBe(3);
  });

  it('separates empty lines from non-empty', () => {
    const s = analyzeText('a\n\n\nb');
    expect(s.lines).toBe(4);
    expect(s.nonEmptyLines).toBe(2);
  });

  it('counts paragraphs split by blank line', () => {
    const s = analyzeText('para1\n\npara2\n\npara3');
    expect(s.paragraphs).toBe(3);
  });

  it('treats single newlines inside paragraph as same paragraph', () => {
    const s = analyzeText('line a\nline b\n\nnew para');
    expect(s.paragraphs).toBe(2);
  });

  it('calculates reading time at 200 wpm', () => {
    const words = new Array(400).fill('word').join(' ');
    const s = analyzeText(words);
    expect(s.readingTimeMin).toBe(2);
  });

  it('returns minimum 1 minute for short non-empty text', () => {
    const s = analyzeText('hello');
    expect(s.readingTimeMin).toBe(1);
  });

  it('truncates input beyond MAX_INPUT_LENGTH', () => {
    const huge = 'a'.repeat(MAX_INPUT_LENGTH + 500);
    const s = analyzeText(huge);
    expect(s.characters).toBe(MAX_INPUT_LENGTH);
  });

  it('treats whitespace-only input as empty', () => {
    const s = analyzeText('   \n\n\t  ');
    expect(s.words).toBe(0);
    expect(s.sentences).toBe(0);
    expect(s.paragraphs).toBe(0);
    expect(s.nonEmptyLines).toBe(0);
  });
});
