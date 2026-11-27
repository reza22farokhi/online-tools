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
  if (granularity === 'word') return text.match(/\\s+|[\\p{L}\\p{N}_]+|[^\\s\\p{L}\\p{N}_]/gu) ?? [];
  return text.split('\\n');
}

function normalizeDiffToken(token: string, options: AdvancedDiffOptions): string {
  let value = options.ignoreWhitespace ? token.replace(/\\s+/gu, '') : token;
  if (options.ignoreCase) value = value.toLocaleLowerCase();
  return value;
}

export function diffTextsAdvanced(
  oldText: string,
  newText: string,
  options: AdvancedDiffOptions = {}
): DiffResult[] {
  const granularity = options.granularity ?? 'line';
  if (oldText.length + newText.length > 200_000) {
    throw new Error('حجم متن برای مقایسه بیش از حد مجاز است (حداکثر ۲۰۰ هزار نویسه).');
  }

  const oldTokens = tokenizeDiffText(oldText, granularity);
  const newTokens = tokenizeDiffText(newText, granularity);
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

export function createUnifiedDiff(
  oldText: string,
  newText: string,
  options: { contextLines?: number; ignoreWhitespace?: boolean; ignoreCase?: boolean } = {}
): string {
  const contextLines = Math.max(0, Math.min(20, Math.floor(options.contextLines ?? 3)));
  const result = diffTextsAdvanced(oldText, newText, {
    granularity: 'line',
    ignoreWhitespace: options.ignoreWhitespace,
    ignoreCase: options.ignoreCase
  });

  const rows = result.map((item, index) => ({
    item,
    oldLine: result.slice(0, index + 1).filter(x => x.type !== 'added').length,
    newLine: result.slice(0, index + 1).filter(x => x.type !== 'removed').length
  }));

  const changed = rows.map((row, index) => row.item.type !== 'unchanged' ? index : -1).filter(index => index >= 0);
  if (!changed.length) return '--- original\\n+++ updated\\n(no changes)';

  const included = new Set<number>();
  for (const index of changed) {
    for (let i = Math.max(0, index - contextLines); i <= Math.min(rows.length - 1, index + contextLines); i++) included.add(i);
  }

  const output = ['--- original', '+++ updated'];
  let previous = -2;
  for (const index of [...included].sort((a, b) => a - b)) {
    if (previous >= 0 && index > previous + 1) output.push('@@ ... @@');
    const row = rows[index];
    const prefix = row.item.type === 'added' ? '+' : row.item.type === 'removed' ? '-' : ' ';
    output.push(prefix + row.item.value);
    previous = index;
  }
  return output.join('\\n');
}
