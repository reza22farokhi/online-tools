export type YamlJson = null | boolean | number | string | YamlJson[] | { [key: string]: YamlJson };
interface Line { indent: number; text: string; number: number; }
const MAX_INPUT = 100_000;
const MAX_DEPTH = 40;
export const MAX_YAML_NODES = 20_000;
function setOwn(target: Record<string, YamlJson>, key: string, value: YamlJson): void {
  Object.defineProperty(target, key, { value, enumerable: true, configurable: true, writable: true });
}
function stripComment(line: string): string {
  let quote = ''; let escaped = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\' && quote === '"') { escaped = true; continue; }
    if ((c === '"' || c === "'") && (!quote || quote === c)) { quote = quote ? '' : c; continue; }
    if (c === '#' && !quote && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i).trimEnd();
  }
  return line.trimEnd();
}
function scalar(raw: string, line: number): YamlJson {
  const value = raw.trim();
  if (!value) return '';
  if (value.startsWith('"')) { try { return JSON.parse(value) as YamlJson; } catch { throw new Error('رشته نقل‌قول‌شده در خط ' + line + ' معتبر نیست.'); } }
  if (value.startsWith("'")) {
    if (!value.endsWith("'") || value.length < 2) throw new Error('رشته نقل‌قول‌شده در خط ' + line + ' بسته نشده است.');
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value)) {
    const n = Number(value); if (Number.isFinite(n)) return n;
  }
  if (/^[\[{]/.test(value)) {
    try { return JSON.parse(value) as YamlJson; } catch { throw new Error('ساختار درون‌خطی خط ' + line + ' باید JSON معتبر باشد.'); }
  }
  if (/^(?:!|&|\*|\||>|%|---|\.\.\.)/.test(value)) throw new Error('این قابلیت YAML در نسخه فعلی پشتیبانی نمی‌شود (خط ' + line + ').');
  return value;
}
export function parseYaml(text: string): YamlJson {
  if (text.length > MAX_INPUT) throw new Error('ورودی باید حداکثر ۱۰۰٬۰۰۰ کاراکتر باشد.');
  const lines: Line[] = [];
  text.replace(/^\uFEFF/, '').split(/\r?\n/).forEach((raw, i) => {
    if (/\t/.test(raw.match(/^\s*/)?.[0] ?? '')) throw new Error('در تورفتگی YAML از Tab استفاده نکنید (خط ' + (i + 1) + ').');
    const clean = stripComment(raw);
    if (!clean.trim() || clean.trim() === '---' || clean.trim() === '...') return;
    const indent = clean.length - clean.trimStart().length;
    if (indent % 2 !== 0) throw new Error('تورفتگی باید مضربی از دو فاصله باشد (خط ' + (i + 1) + ').');
    lines.push({ indent, text: clean.trim(), number: i + 1 });
  });
  if (lines.length > MAX_YAML_NODES) throw new Error('ساختار YAML از سقف ۲۰٬۰۰۰ گره عبور کرده است.');
  if (!lines.length) return null;
  let index = 0;
  const pair = (text: string, line: number): [string, string] => {
    let quote = ''; let escaped = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (escaped) { escaped = false; continue; }
      if (c === '\\' && quote === '"') { escaped = true; continue; }
      if ((c === '"' || c === "'") && (!quote || quote === c)) { quote = quote ? '' : c; continue; }
      if (c === ':' && !quote && (i === text.length - 1 || /\s/.test(text[i + 1]))) {
        const keyValue = text.slice(0, i).trim();
        const key = scalar(keyValue, line);
        if (typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'boolean') throw new Error('کلید نامعتبر در خط ' + line + '.');
        return [String(key), text.slice(i + 1).trim()];
      }
    }
    throw new Error('ساختار کلید و مقدار نامعتبر در خط ' + line + '.');
  };
  const block = (indent: number, depth: number): YamlJson => {
    if (depth > MAX_DEPTH) throw new Error('عمق ساختار از ۴۰ سطح بیشتر است.');
    const sequence = lines[index].text === '-' || lines[index].text.startsWith('- ');
    if (sequence) {
      const out: YamlJson[] = [];
      while (index < lines.length && lines[index].indent === indent && (lines[index].text === '-' || lines[index].text.startsWith('- '))) {
        const current = lines[index++];
        const rest = current.text.slice(1).trim();
        if (!rest) {
          if (index < lines.length && lines[index].indent > indent) out.push(block(lines[index].indent, depth + 1));
          else out.push(null);
        } else if (/^[^:[\]{}]+:\s|^[^:[\]{}]+:$/.test(rest)) {
          const [key, value] = pair(rest, current.number);
          const obj: Record<string, YamlJson> = {};
          if (value) setOwn(obj, key, scalar(value, current.number));
          else if (index < lines.length && lines[index].indent > indent + 1) setOwn(obj, key, block(lines[index].indent, depth + 1));
          else setOwn(obj, key, null);
          if (index < lines.length && lines[index].indent > indent) {
            const extra = block(lines[index].indent, depth + 1);
            if (extra === null || Array.isArray(extra) || typeof extra !== 'object') throw new Error('ادامه شیء در خط ' + lines[index - 1].number + ' معتبر نیست.');
            for (const [extraKey, extraValue] of Object.entries(extra)) setOwn(obj, extraKey, extraValue);
          }
          out.push(obj);
        } else out.push(scalar(rest, current.number));
      }
      return out;
    }
    const out: Record<string, YamlJson> = {};
    while (index < lines.length && lines[index].indent === indent && !lines[index].text.startsWith('- ' ) && lines[index].text !== '-') {
      const current = lines[index++];
      const [key, value] = pair(current.text, current.number);
      if (Object.prototype.hasOwnProperty.call(out, key)) throw new Error('کلید تکراری "' + key + '" در خط ' + current.number + '.');
      if (value) setOwn(out, key, scalar(value, current.number));
      else if (index < lines.length && lines[index].indent > indent) {
        if (lines[index].indent !== indent + 2) throw new Error('تورفتگی نامعتبر در خط ' + lines[index].number + '.');
        setOwn(out, key, block(lines[index].indent, depth + 1));
      } else setOwn(out, key, null);
    }
    return out;
  };
  const result = block(lines[0].indent, 0);
  if (index !== lines.length) throw new Error('ساختار YAML در خط ' + lines[index].number + ' قابل پردازش نیست.');
  return result;
}
function keyText(key: string): string { return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(key) ? key : JSON.stringify(key); }
export function stringifyYaml(value: YamlJson, depth = 0): string {
  if (depth === 0) {
    const pending: unknown[] = [value];
    let count = 0;
    while (pending.length) {
      const current = pending.pop();
      count += 1;
      if (count > MAX_YAML_NODES) throw new Error('ساختار از سقف ۲۰٬۰۰۰ گره عبور کرده است.');
      if (current !== null && typeof current === 'object') {
        for (const child of Array.isArray(current) ? current : Object.values(current as Record<string, unknown>)) pending.push(child);
      }
    }
  }
  if (depth > MAX_DEPTH) throw new Error('عمق ساختار از ۴۰ سطح بیشتر است.');
  const scalarText = (v: YamlJson): string => {
    if (v === null) return 'null';
    if (typeof v === 'string') return JSON.stringify(v);
    return String(v);
  };
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return value.map(item => {
      if (item !== null && typeof item === 'object') return '-\n' + stringifyYaml(item, depth + 1).split('\n').map(line => '  ' + line).join('\n');
      return '- ' + scalarText(item);
    }).join('\n');
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value);
    if (!entries.length) return '{}';
    return entries.map(([key, item]) => {
      const prefix = keyText(key) + ':';
      if (item !== null && typeof item === 'object') return prefix + '\n' + stringifyYaml(item, depth + 1).split('\n').map(line => '  ' + line).join('\n');
      return prefix + ' ' + scalarText(item);
    }).join('\n');
  }
  return scalarText(value);
}
export function jsonToYaml(jsonText: string): string {
  if (jsonText.length > MAX_INPUT) throw new Error('ورودی باید حداکثر ۱۰۰٬۰۰۰ کاراکتر باشد.');
  let value: YamlJson;
  try { value = JSON.parse(jsonText) as YamlJson; } catch { throw new Error('JSON ورودی معتبر نیست.'); }
  return stringifyYaml(value);
}
