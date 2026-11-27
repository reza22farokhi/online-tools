export type HtmlMode = 'escape' | 'unescape';
export const MAX_HTML_INPUT_LENGTH = 100_000;
const ESCAPE_MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00A0',
  copy: '©', reg: '®', trade: '™', hellip: '…', mdash: '—', ndash: '–',
  laquo: '«', raquo: '»'
};
function assertInputLength(input: string): void {
  if (input.length > MAX_HTML_INPUT_LENGTH) {
    throw new RangeError('ورودی باید حداکثر ۱۰۰٬۰۰۰ کاراکتر باشد.');
  }
}
export function escapeHtml(input: string): string {
  assertInputLength(input);
  return input.replace(/[&<>"']/g, ch => ESCAPE_MAP[ch] ?? ch);
}
export function unescapeHtml(input: string): string {
  assertInputLength(input);
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      const code = parseInt(entity.slice(2), 16);
      if (Number.isFinite(code) && code >= 0 && code <= 0x10FFFF) {
        try { return String.fromCodePoint(code); } catch { return match; }
      }
      return match;
    }
    if (entity.startsWith('#')) {
      const code = parseInt(entity.slice(1), 10);
      if (Number.isFinite(code) && code >= 0 && code <= 0x10FFFF) {
        try { return String.fromCodePoint(code); } catch { return match; }
      }
      return match;
    }
    return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, entity) ? NAMED_ENTITIES[entity] : match;
  });
}
export function processHtml(input: string, mode: HtmlMode): string {
  assertInputLength(input);
  if (input === '') return '';
  return mode === 'escape' ? escapeHtml(input) : unescapeHtml(input);
}
