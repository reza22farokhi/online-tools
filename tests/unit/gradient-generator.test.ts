import { describe, it, expect } from 'vitest';
import { buildCssGradient } from '../../src/tools/color/gradient-generator/logic';

describe('buildCssGradient', () => {
  it('builds linear gradient', () => {
    const css = buildCssGradient({
      type: 'linear',
      angle: 90,
      stops: [{ color: '#ff0000', position: 0 }, { color: '#0000ff', position: 100 }]
    });
    expect(css).toBe('linear-gradient(90deg, #ff0000 0%, #0000ff 100%)');
  });
  it('builds radial gradient', () => {
    const css = buildCssGradient({
      type: 'radial',
      angle: 0,
      stops: [{ color: '#fff', position: 0 }, { color: '#000', position: 100 }]
    });
    expect(css).toContain('radial-gradient');
    expect(css).toContain('circle');
  });
  it('sorts stops by position', () => {
    const css = buildCssGradient({
      type: 'linear',
      angle: 45,
      stops: [{ color: '#00ff00', position: 100 }, { color: '#ff0000', position: 0 }]
    });
    expect(css).toBe('linear-gradient(45deg, #ff0000 0%, #00ff00 100%)');
  });
  it('handles three stops', () => {
    const css = buildCssGradient({
      type: 'linear',
      angle: 180,
      stops: [
        { color: '#ff0000', position: 0 },
        { color: '#00ff00', position: 50 },
        { color: '#0000ff', position: 100 }
      ]
    });
    expect(css).toContain('#ff0000 0%');
    expect(css).toContain('#00ff00 50%');
    expect(css).toContain('#0000ff 100%');
  });
});
