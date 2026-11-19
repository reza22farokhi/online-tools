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
