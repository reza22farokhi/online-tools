import { describe, it, expect, beforeEach } from 'vitest';

const store: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => { for (const k in store) delete store[k]; },
};

import { getFavorites, isFavorite, toggleFavorite, getRecent, pushRecent } from '../../src/lib/ui';

describe('favorites', () => {
  beforeEach(() => { (globalThis as any).localStorage.clear(); });
  it('starts empty', () => expect(getFavorites()).toEqual([]));
  it('adds a favorite', () => {
    toggleFavorite('word-counter');
    expect(getFavorites()).toContain('word-counter');
    expect(isFavorite('word-counter')).toBe(true);
  });
  it('removes a favorite on second toggle', () => {
    toggleFavorite('word-counter');
    toggleFavorite('word-counter');
    expect(getFavorites()).not.toContain('word-counter');
  });
  it('handles multiple', () => {
    toggleFavorite('a');
    toggleFavorite('b');
    expect(getFavorites().length).toBe(2);
  });
});

describe('recent', () => {
  beforeEach(() => { (globalThis as any).localStorage.clear(); });
  it('starts empty', () => expect(getRecent()).toEqual([]));
  it('adds to recent', () => {
    pushRecent('a');
    expect(getRecent()).toContain('a');
  });
  it('most recent first', () => {
    pushRecent('a'); pushRecent('b'); pushRecent('c');
    expect(getRecent()).toEqual(['c', 'b', 'a']);
  });
  it('moves existing to top without duplicating', () => {
    pushRecent('a'); pushRecent('b'); pushRecent('a');
    expect(getRecent()).toEqual(['a', 'b']);
  });
  it('limits to 6', () => {
    for (let i = 0; i < 10; i++) pushRecent('tool-' + i);
    expect(getRecent().length).toBe(6);
    expect(getRecent()[0]).toBe('tool-9');
  });
});
