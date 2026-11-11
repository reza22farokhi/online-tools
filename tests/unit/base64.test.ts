import { describe, it, expect } from 'vitest';
import { processBase64 } from '../../src/tools/code/base64/logic';
describe('processBase64', () => {
  it('encodes simple ASCII', () => {
    expect(processBase64('hello', 'encode', { urlSafe: false }).output).toBe('aGVsbG8=');
  });
  it('decodes simple ASCII', () => {
    expect(processBase64('aGVsbG8=', 'decode', { urlSafe: false }).output).toBe('hello');
  });
  it('Persian text round-trips', () => {
    const r = processBase64('سلام', 'encode', { urlSafe: false });
    expect(r.ok).toBe(true);
    const d = processBase64(r.output, 'decode', { urlSafe: false });
    expect(d.ok).toBe(true);
    expect(d.output).toBe('سلام');
  });
  it('URL-safe encode has no +/=', () => {
    const r = processBase64('>>>???', 'encode', { urlSafe: true });
    expect(r.ok).toBe(true);
    expect(r.output).not.toMatch(/[+/=]/);
  });
  it('URL-safe round-trips', () => {
    const enc = processBase64('test', 'encode', { urlSafe: true });
    const dec = processBase64(enc.output, 'decode', { urlSafe: true });
    expect(dec.output).toBe('test');
  });
  it('empty input returns error', () => {
    expect(processBase64('', 'encode', { urlSafe: false }).ok).toBe(false);
  });
  it('invalid base64 returns error', () => {
    expect(processBase64('not@@base64', 'decode', { urlSafe: false }).ok).toBe(false);
  });
  it('unicode round-trip', () => {
    const text = 'Hello 世界 🎉';
    const enc = processBase64(text, 'encode', { urlSafe: false });
    const dec = processBase64(enc.output, 'decode', { urlSafe: false });
    expect(dec.output).toBe(text);
  });
});
