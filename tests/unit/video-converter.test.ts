import { describe, expect, it } from 'vitest';
import { formatMediaBytes, getMediaExtension, isMemoryError, isSupportedMedia, outputFilename } from '../../src/tools/video/video-converter/logic';

describe('video converter helpers', () => {
  it('recognizes supported extensions even when MIME is missing', () => {
    expect(isSupportedMedia({ name: 'clip.MOV', type: '' })).toBe(true);
    expect(isSupportedMedia({ name: 'sound.mp3', type: 'application/octet-stream' })).toBe(true);
    expect(isSupportedMedia({ name: 'payload.bin', type: 'application/octet-stream' })).toBe(false);
  });
  it('formats media sizes', () => {
    expect(formatMediaBytes(1024)).toBe('1.0 KB');
    expect(formatMediaBytes(1024 * 1024)).toBe('1.0 MB');
    expect(formatMediaBytes(-1)).toBe('—');
  });
  it('creates safe output names', () => {
    expect(outputFilename('my clip.mov', 'mp4')).toBe('my clip.mp4');
    expect(outputFilename('../bad:name.mkv', 'webm')).toBe('.._bad_name.webm');
  });
  it('detects memory failures', () => {
    expect(isMemoryError(new Error('Cannot enlarge memory arrays'))).toBe(true);
    expect(isMemoryError(new Error('codec not found'))).toBe(false);
  });
  it('extracts extensions', () => {
    expect(getMediaExtension('FILE.MP4')).toBe('mp4');
  });
});
