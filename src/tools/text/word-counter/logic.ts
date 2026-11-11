export const MAX_INPUT_LENGTH = 1_000_000;

export interface WordStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  lines: number;
  nonEmptyLines: number;
  paragraphs: number;
  readingTimeMin: number;
}

export function analyzeText(input: string): WordStats {
  const text = input.length > MAX_INPUT_LENGTH
    ? input.slice(0, MAX_INPUT_LENGTH)
    : input;

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/gu, '').length;

  const trimmed = text.trim();

  const words = trimmed === ''
    ? 0
    : trimmed.split(/\s+/u).filter(Boolean).length;

  const sentences = trimmed === ''
    ? 0
    : trimmed
        .split(/[.!?؟…。！？।]+/u)
        .map(s => s.trim())
        .filter(Boolean).length;

  const lineParts = text === '' ? [] : text.split(/\r\n|\r|\n/);
  const lines = lineParts.length;
  const nonEmptyLines = lineParts.filter(l => l.trim() !== '').length;

  const paragraphs = trimmed === ''
    ? 0
    : trimmed
        .split(/\n\s*\n+/u)
        .map(p => p.trim())
        .filter(Boolean).length;

  const readingTimeMin = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    lines,
    nonEmptyLines,
    paragraphs,
    readingTimeMin
  };
}
