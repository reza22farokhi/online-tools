export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
export type DiffKind = 'added' | 'removed' | 'changed';
export interface JsonDiffEntry { path: string; kind: DiffKind; before?: JsonValue; after?: JsonValue; }
export interface JsonDiffResult { entries: JsonDiffEntry[]; total: number; truncated: boolean; }
const MAX_INPUT = 100_000;
const MAX_DEPTH = 40;
const MAX_ENTRIES = 500;
const MAX_WORK = 20_000;
const pointer = (key: string) => '/' + key.replace(/~/g, '~0').replace(/\//g, '~1');
export function compareJsonTexts(beforeText: string, afterText: string): JsonDiffResult {
  if (beforeText.length > MAX_INPUT || afterText.length > MAX_INPUT) throw new Error('هر ورودی باید حداکثر ۱۰۰٬۰۰۰ کاراکتر باشد.');
  let before: JsonValue; let after: JsonValue;
  try { before = JSON.parse(beforeText) as JsonValue; } catch { throw new Error('JSON اول معتبر نیست.'); }
  try { after = JSON.parse(afterText) as JsonValue; } catch { throw new Error('JSON دوم معتبر نیست.'); }
  const entries: JsonDiffEntry[] = [];
  let total = 0;
  let work = 0;
  const consumeWork = (amount = 1) => {
    work += amount;
    if (work > MAX_WORK) throw new Error('مقایسهٔ JSON از سقف پردازش مجاز (۲۰٬۰۰۰ گام) عبور کرد؛ ورودی کوچک‌تری استفاده کنید.');
  };
  const add = (entry: JsonDiffEntry) => { consumeWork(); total++; if (entries.length < MAX_ENTRIES) entries.push(entry); };
  const walk = (a: JsonValue, b: JsonValue, path: string, depth: number): void => {
    consumeWork();
    if (depth > MAX_DEPTH) throw new Error('عمق ساختار JSON از حد مجاز (۴۰) بیشتر است.');
    if (Object.is(a, b)) return;
    const aArray = Array.isArray(a); const bArray = Array.isArray(b);
    const aObject = a !== null && typeof a === 'object' && !aArray;
    const bObject = b !== null && typeof b === 'object' && !bArray;
    if (aArray && bArray) {
      const max = Math.max(a.length, b.length);
      for (let i = 0; i < max; i++) {
        consumeWork();
        const childPath = path + '/' + i;
        if (i >= a.length) add({ path: childPath, kind: 'added', after: b[i] });
        else if (i >= b.length) add({ path: childPath, kind: 'removed', before: a[i] });
        else walk(a[i], b[i], childPath, depth + 1);
      }
      return;
    }
    if (aObject && bObject) {
      const left = a as Record<string, JsonValue>; const right = b as Record<string, JsonValue>;
      const leftKeys = Object.keys(left); const rightKeys = Object.keys(right);
      consumeWork(leftKeys.length + rightKeys.length);
      const keys = [...new Set([...leftKeys, ...rightKeys])].sort();
      for (const key of keys) {
        consumeWork();
        const hasA = Object.prototype.hasOwnProperty.call(left, key);
        const hasB = Object.prototype.hasOwnProperty.call(right, key);
        const childPath = path + pointer(key);
        if (!hasA) add({ path: childPath, kind: 'added', after: right[key] });
        else if (!hasB) add({ path: childPath, kind: 'removed', before: left[key] });
        else walk(left[key], right[key], childPath, depth + 1);
      }
      return;
    }
    add({ path: path || '/', kind: 'changed', before: a, after: b });
  };
  walk(before, after, '$', 0);
  return { entries, total, truncated: total > MAX_ENTRIES };
}
