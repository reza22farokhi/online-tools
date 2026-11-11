export function percentOf(percent: number, of: number): number {
  return (percent / 100) * of;
}

export function whatPercent(part: number, whole: number): number {
  if (whole === 0) return NaN;
  return (part / whole) * 100;
}

export function percentChange(from: number, to: number): number {
  if (from === 0) return NaN;
  return ((to - from) / Math.abs(from)) * 100;
}

export function formatNumber(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '—';
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(decimals).replace(/\.?0+$/, '');
}
