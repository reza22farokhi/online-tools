export const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
export const LARGE_VIDEO_WARNING_SIZE = 100 * 1024 * 1024;

const SUPPORTED_EXTENSIONS = new Set([
  'mp4', 'mov', 'm4v', 'webm', 'mkv', 'avi', '3gp', 'ogv',
  'mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'
]);

export function getMediaExtension(name: string): string {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

export function isSupportedMedia(file: Pick<File, 'name' | 'type'>): boolean {
  return SUPPORTED_EXTENSIONS.has(getMediaExtension(file.name)) ||
    /^(video|audio)\//i.test(file.type);
}

export function formatMediaBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return bytes + ' B';
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }
  return value.toFixed(value >= 100 ? 0 : 1) + ' ' + units[index];
}

export function outputFilename(inputName: string, extension: 'mp4' | 'webm' | 'mp3'): string {
  const base = inputName.replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]/g, '_').slice(0, 100) || 'converted-media';
  return base + '.' + extension;
}

export function isMemoryError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /out of memory|memory access out of bounds|allocation failed|cannot enlarge memory|oom|wasm memory/i.test(message);
}
