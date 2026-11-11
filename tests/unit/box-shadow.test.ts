import { describe, it, expect } from 'vitest';
import { buildBoxShadow } from '../../src/tools/color/box-shadow/logic';

describe('buildBoxShadow', () => {
  it('builds basic shadow', () => {
    const css = buildBoxShadow({
      offsetX: 0, offsetY: 4, blur: 12, spread: 0,
      color: '#000000', opacity: 100, inset: false
    });
    expect(css).toBe('0px 4px 12px 0px rgba(0, 0, 0, 1)');
  });
  it('applies opacity correctly', () => {
    const css = buildBoxShadow({
      offsetX: 0, offsetY: 4, blur: 12, spread: 0,
      color: '#000000', opacity: 50, inset: false
    });
    expect(css).toContain('rgba(0, 0, 0, 0.5)');
  });
  it('handles inset', () => {
    const css = buildBoxShadow({
      offsetX: 0, offsetY: 2, blur: 8, spread: 0,
      color: '#000000', opacity: 20, inset: true
    });
    expect(css).toContain('inset');
  });
  it('handles custom colors', () => {
    const css = buildBoxShadow({
      offsetX: 0, offsetY: 10, blur: 20, spread: 0,
      color: '#ff0000', opacity: 100, inset: false
    });
    expect(css).toContain('rgba(255, 0, 0, 1)');
  });
  it('handles negative offsets', () => {
    const css = buildBoxShadow({
      offsetX: -5, offsetY: -3, blur: 8, spread: -2,
      color: '#000000', opacity: 30, inset: false
    });
    expect(css).toContain('-5px');
    expect(css).toContain('-3px');
    expect(css).toContain('-2px');
  });
});
