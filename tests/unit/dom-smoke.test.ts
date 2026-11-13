import { describe, it, expect } from 'vitest';

describe('DOM Environment Smoke Test', () => {
  it('should have access to document and window', () => {
    const div = document.createElement('div');
    div.textContent = 'Titan X';
    expect(div.innerHTML).toBe('Titan X');
    expect(typeof window).toBe('object');
  });
});
