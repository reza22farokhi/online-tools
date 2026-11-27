export interface ValidationIssue { path: string; message: string; }
export interface ValidationResult { valid: boolean; issues: ValidationIssue[]; checked: number; }
const MAX_INPUT = 100_000;
const MAX_DEPTH = 30;
const MAX_ISSUES = 100;
type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
function typeMatches(value: Json, type: string): boolean {
  switch (type) {
    case 'null': return value === null;
    case 'object': return value !== null && typeof value === 'object' && !Array.isArray(value);
    case 'array': return Array.isArray(value);
    case 'string': return typeof value === 'string';
    case 'number': return typeof value === 'number' && Number.isFinite(value);
    case 'integer': return typeof value === 'number' && Number.isInteger(value);
    case 'boolean': return typeof value === 'boolean';
    default: return true;
  }
}
function escapePointerSegment(value: string): string { return value.replace(/~/g, '~0').replace(/\//g, '~1'); }
function stable(value: Json): string {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (value !== null && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stable(value[k])).join(',') + '}';
  return JSON.stringify(value) ?? 'undefined';
}
export function validateJsonSchema(dataText: string, schemaText: string): ValidationResult {
  if (dataText.length > MAX_INPUT || schemaText.length > MAX_INPUT) throw new Error('هر ورودی باید حداکثر ۱۰۰٬۰۰۰ کاراکتر باشد.');
  let data: Json; let schema: Json;
  try { data = JSON.parse(dataText) as Json; } catch { throw new Error('JSON ورودی معتبر نیست.'); }
  try { schema = JSON.parse(schemaText) as Json; } catch { throw new Error('JSON Schema معتبر نیست.'); }
  if (schema === null || Array.isArray(schema)) throw new Error('ریشه Schema باید یک شیء یا مقدار بولی باشد.');
  const issues: ValidationIssue[] = [];
  let checked = 0;
  const add = (path: string, message: string) => { if (issues.length < MAX_ISSUES) issues.push({ path, message }); };
  const visit = (value: Json, rule: Json, path: string, depth: number): void => {
    checked++;
    if (depth > MAX_DEPTH) { add(path, 'حداکثر عمق بررسی مجاز رد شد.'); return; }
    if (rule === true || rule === null) return;
    if (rule === false) { add(path, 'این مقدار با schema ممنوع شده است.'); return; }
    if (typeof rule !== 'object' || Array.isArray(rule)) { add(path, 'تعریف schema نامعتبر است.'); return; }
    const s = rule as Record<string, Json>;
    const types = Array.isArray(s.type) ? s.type : (typeof s.type === 'string' ? [s.type] : []);
    if (types.length && !types.some(t => typeof t === 'string' && typeMatches(value, t))) {
      add(path, 'نوع داده با type تعریف‌شده مطابقت ندارد.'); return;
    }
    if (Array.isArray(s.enum) && !s.enum.some(x => stable(x) === stable(value))) add(path, 'مقدار باید یکی از گزینه‌های enum باشد.');
    if ('const' in s && stable(s.const) !== stable(value)) add(path, 'مقدار با const تعریف‌شده برابر نیست.');
    if (typeof value === 'string') {
      if (typeof s.minLength === 'number' && [...value].length < s.minLength) add(path, 'طول متن کمتر از minLength است.');
      if (typeof s.maxLength === 'number' && [...value].length > s.maxLength) add(path, 'طول متن بیشتر از maxLength است.');
      if (typeof s.pattern === 'string') {
        try { if (!new RegExp(s.pattern, 'u').test(value)) add(path, 'متن با الگوی pattern مطابقت ندارد.'); }
        catch { add(path, 'عبارت منظم pattern نامعتبر است.'); }
      }
    }
    if (typeof value === 'number') {
      if (typeof s.minimum === 'number' && value < s.minimum) add(path, 'مقدار کمتر از minimum است.');
      if (typeof s.maximum === 'number' && value > s.maximum) add(path, 'مقدار بیشتر از maximum است.');
      if (typeof s.multipleOf === 'number') {
        if (s.multipleOf <= 0) add(path, 'تعریف multipleOf باید عددی بزرگ‌تر از صفر باشد.');
        else { const quotient = value / s.multipleOf; if (Math.abs(quotient - Math.round(quotient)) > 1e-10 * Math.max(1, Math.abs(quotient))) add(path, 'مقدار باید مضرب multipleOf باشد.'); }
      }
      if (typeof s.exclusiveMinimum === 'number' && value <= s.exclusiveMinimum) add(path, 'مقدار باید بزرگ‌تر از exclusiveMinimum باشد.');
      if (typeof s.exclusiveMaximum === 'number' && value >= s.exclusiveMaximum) add(path, 'مقدار باید کوچک‌تر از exclusiveMaximum باشد.');
    }
    if (Array.isArray(value)) {
      if (typeof s.minItems === 'number' && value.length < s.minItems) add(path, 'تعداد آیتم‌ها کمتر از minItems است.');
      if (typeof s.maxItems === 'number' && value.length > s.maxItems) add(path, 'تعداد آیتم‌ها بیشتر از maxItems است.');
      if (s.uniqueItems === true && new Set(value.map(stable)).size !== value.length) add(path, 'آرایه باید آیتم‌های یکتا داشته باشد.');
      if (s.items !== undefined) value.forEach((item, i) => visit(item, s.items!, path + '/' + i, depth + 1));
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const obj = value as Record<string, Json>;
      const keys = Object.keys(obj);
      if (typeof s.minProperties === 'number' && keys.length < s.minProperties) add(path, 'تعداد ویژگی‌ها کمتر از minProperties است.');
      if (typeof s.maxProperties === 'number' && keys.length > s.maxProperties) add(path, 'تعداد ویژگی‌ها بیشتر از maxProperties است.');
      if (Array.isArray(s.required)) for (const key of s.required) if (typeof key === 'string' && !Object.hasOwn(obj, key)) add(path + '/' + escapePointerSegment(key), 'ویژگی الزامی وجود ندارد.');
      const props = s.properties && typeof s.properties === 'object' && !Array.isArray(s.properties) ? s.properties as Record<string, Json> : {};
      const patternProps = s.patternProperties && typeof s.patternProperties === 'object' && !Array.isArray(s.patternProperties) ? s.patternProperties as Record<string, Json> : {};
      for (const [key, child] of Object.entries(obj)) {
        const childPath = path + '/' + escapePointerSegment(key);
        let matched = false;
        if (Object.hasOwn(props, key)) { matched = true; visit(child, props[key], childPath, depth + 1); }
        for (const [pattern, patternRule] of Object.entries(patternProps)) {
          try { if (new RegExp(pattern, 'u').test(key)) { matched = true; visit(child, patternRule, childPath, depth + 1); } }
          catch { add(path, 'عبارت منظم patternProperties نامعتبر است.'); }
        }
        if (!matched && s.additionalProperties === false) add(childPath, 'ویژگی اضافی مجاز نیست.');
        else if (!matched && s.additionalProperties && typeof s.additionalProperties === 'object') visit(child, s.additionalProperties, childPath, depth + 1);
      }
    }
    if (Array.isArray(s.allOf)) for (const child of s.allOf) visit(value, child, path, depth + 1);
    if (Array.isArray(s.anyOf)) {
      const matched = s.anyOf.some(child => validateSub(value, child, depth + 1));
      if (!matched) add(path, 'مقدار با هیچ‌یک از گزینه‌های anyOf مطابقت ندارد.');
    }
    if (Array.isArray(s.oneOf)) {
      const count = s.oneOf.filter(child => validateSub(value, child, depth + 1)).length;
      if (count !== 1) add(path, 'مقدار باید دقیقاً با یک گزینه oneOf مطابقت داشته باشد.');
    }
  };
  const validateSub = (value: Json, rule: Json, depth: number): boolean => {
    const before = issues.length;
    visit(value, rule, '', depth);
    const ok = issues.length === before;
    issues.splice(before);
    return ok;
  };
  visit(data, schema, '$', 0);
  return { valid: issues.length === 0, issues, checked };
}
