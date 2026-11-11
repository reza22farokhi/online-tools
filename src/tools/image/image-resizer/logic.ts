export function calculateDimensions(oW: number, oH: number, tW: number, tH: number, maintain: boolean) {
  if (!oW || !oH) return { width: 0, height: 0 };
  if (maintain) {
    const ratio = Math.min(tW / oW, tH / oH);
    return { width: Math.round(oW * ratio), height: Math.round(oH * ratio) };
  }
  return { width: tW, height: tH };
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
