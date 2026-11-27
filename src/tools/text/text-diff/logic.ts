export type DiffResult = { type: 'added' | 'removed' | 'unchanged'; value: string };

export function diffTexts(oldText: string, newText: string): DiffResult[] {
  if (oldText.length + newText.length > 200_000) throw new Error('حجم متن برای مقایسه بیش از حد مجاز است (حداکثر ۲۰۰ هزار نویسه).');
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  if (oldLines.length > 2_000 || newLines.length > 2_000 || oldLines.length * newLines.length > 1_000_000) {
    throw new Error('تعداد خطوط برای مقایسه بیش از حد مجاز است (حداکثر ۱ میلیون خانه مقایسه).');
  }
  const dp = Array(oldLines.length + 1).fill(0).map(() => Array(newLines.length + 1).fill(0));

  for (let i = 1; i <= oldLines.length; i++) {
    for (let j = 1; j <= newLines.length; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffResult[] = [];
  let i = oldLines.length;
  let j = newLines.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: 'unchanged', value: oldLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', value: newLines[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({ type: 'removed', value: oldLines[i - 1] });
      i--;
    }
  }
  return result;
}

export type DiffGranularity = 'line' | 'word' | 'character';

export interface AdvancedDiffOptions {
  granularity?: DiffGranularity;
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
}

function tokenizeDiffText(text: string, granularity: DiffGranularity): string[] {
  if (granularity === 'character') return Array.from(text);
  if (granularity === 'word') return text.match(/\s+|[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu) ?? [];
  return text.split('\n');
}

function normalizeDiffToken(token: string, options: AdvancedDiffOptions): string {
  let value = options.ignoreWhitespace ? token.replace(/\s+/gu, '') : token;
  if (options.ignoreCase) value = value.toLowerCase();
  return value;
}

function diffTokenSequences(
  oldTokens: string[],
  newTokens: string[],
  options: AdvancedDiffOptions = {}
): DiffResult[] {
  if (oldTokens.length > 20_000 || newTokens.length > 20_000 || oldTokens.length * newTokens.length > 1_000_000) {
    throw new Error('تعداد قطعه‌ها برای مقایسه بیش از حد مجاز است (حداکثر ۱ میلیون خانه مقایسه).');
  }

  const oldNormalized = oldTokens.map(token => normalizeDiffToken(token, options));
  const newNormalized = newTokens.map(token => normalizeDiffToken(token, options));
  const dp = Array.from({ length: oldTokens.length + 1 }, () => new Uint32Array(newTokens.length + 1));

  for (let i = 1; i <= oldTokens.length; i++) {
    for (let j = 1; j <= newTokens.length; j++) {
      dp[i][j] = oldNormalized[i - 1] === newNormalized[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const reversed: DiffResult[] = [];
  let i = oldTokens.length;
  let j = newTokens.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldNormalized[i - 1] === newNormalized[j - 1]) {
      reversed.push({ type: 'unchanged', value: oldTokens[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      reversed.push({ type: 'added', value: newTokens[j - 1] });
      j--;
    } else {
      reversed.push({ type: 'removed', value: oldTokens[i - 1] });
      i--;
    }
  }
  return reversed.reverse();
}

export function diffTextsAdvanced(
  oldText: string,
  newText: string,
  options: AdvancedDiffOptions = {}
): DiffResult[] {
  if (oldText.length + newText.length > 200_000) {
    throw new Error('حجم متن برای مقایسه بیش از حد مجاز است (حداکثر ۲۰۰ هزار نویسه).');
  }

  const granularity = options.granularity ?? 'line';
  return diffTokenSequences(
    tokenizeDiffText(oldText, granularity),
    tokenizeDiffText(newText, granularity),
    options
  );
}

function tokenizeUnifiedLines(text: string): string[] {
  if (text.length === 0) return [];
  const lines = text.split('\n');
  if (text.endsWith('\n')) lines.pop();
  return lines;
}

export function createUnifiedDiff(
  oldText: string,
  newText: string,
  options: { contextLines?: number; ignoreWhitespace?: boolean; ignoreCase?: boolean } = {}
): string {
  if (oldText.length + newText.length > 200_000) {
    throw new Error('حجم متن برای مقایسه بیش از حد مجاز است (حداکثر ۲۰۰ هزار نویسه).');
  }

  const contextLines = Math.max(0, Math.min(20, Math.floor(options.contextLines ?? 3)));
  const oldLines = tokenizeUnifiedLines(oldText);
  const newLines = tokenizeUnifiedLines(newText);
  const oldHasNoFinalNewline = oldText.length > 0 && !oldText.endsWith('\n');
  const newHasNoFinalNewline = newText.length > 0 && !newText.endsWith('\n');
  const result = diffTokenSequences(oldLines, newLines, {
    ignoreWhitespace: options.ignoreWhitespace,
    ignoreCase: options.ignoreCase
  });

  // A final-newline-only change must remain visible in a unified diff.
  if (oldHasNoFinalNewline !== newHasNoFinalNewline && oldLines.length > 0 && newLines.length > 0) {
    const last = result[result.length - 1];
    if (last?.type === 'unchanged' && last.value === oldLines[oldLines.length - 1] && last.value === newLines[newLines.length - 1]) {
      result.splice(result.length - 1, 1,
        { type: 'removed', value: oldLines[oldLines.length - 1] },
        { type: 'added', value: newLines[newLines.length - 1] }
      );
    }
  }

  let oldLine = 1;
  let newLine = 1;
  const rows = result.map(item => {
    const row = { item, oldLine, newLine };
    if (item.type !== 'added') oldLine++;
    if (item.type !== 'removed') newLine++;
    return row;
  });

  const changed = rows.map((row, index) => row.item.type !== 'unchanged' ? index : -1).filter(index => index >= 0);
  if (!changed.length) return '--- original\n+++ updated\n(no changes)';

  const included = new Set<number>();
  for (const index of changed) {
    for (let i = Math.max(0, index - contextLines); i <= Math.min(rows.length - 1, index + contextLines); i++) included.add(i);
  }

  const sorted = [...included].sort((a, b) => a - b);
  const hunks: number[][] = [];
  for (const index of sorted) {
    const current = hunks[hunks.length - 1];
    if (!current || index > current[current.length - 1] + 1) hunks.push([index]);
    else current.push(index);
  }

  const output = ['--- original', '+++ updated'];
  for (const hunk of hunks) {
    const first = rows[hunk[0]];
    const oldCount = hunk.filter(index => rows[index].item.type !== 'added').length;
    const newCount = hunk.filter(index => rows[index].item.type !== 'removed').length;
    const oldStart = oldCount === 0 ? Math.max(0, first.oldLine - 1) : first.oldLine;
    const newStart = newCount === 0 ? Math.max(0, first.newLine - 1) : first.newLine;
    output.push('@@ -' + oldStart + ',' + oldCount + ' +' + newStart + ',' + newCount + ' @@');
    for (const index of hunk) {
      const row = rows[index];
      const item = row.item;
      const prefix = item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' ';
      output.push(prefix + item.value);
      if (item.type === 'removed' && oldHasNoFinalNewline && row.oldLine === oldLines.length) {
        output.push('\\ No newline at end of file');
      }
      if (item.type === 'added' && newHasNoFinalNewline && row.newLine === newLines.length) {
        output.push('\\ No newline at end of file');
      }
    }
  }
  return output.join('\n');
}
