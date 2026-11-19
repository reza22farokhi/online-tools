function assertDelimiter(delimiter: string): void {
  if (typeof delimiter !== 'string' || delimiter.length !== 1 || delimiter === '"' || delimiter === '\n' || delimiter === '\r') {
    throw new Error('جداکننده CSV باید دقیقاً یک نویسه معتبر باشد.');
  }
}

export function parseCSV(input: string, delimiter = ','): string[][] {
  assertDelimiter(delimiter);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let afterQuote = false;
  let fieldWasQuoted = false;

  const pushRow = () => {
    row.push(field);
    if (row.length > 1 || row[0] !== '' || fieldWasQuoted) rows.push(row);
    row = [];
    field = '';
    afterQuote = false;
    fieldWasQuoted = false;
  };

  for (let i = 0; i < input.length;) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          afterQuote = true;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
      continue;
    }

    if (afterQuote) {
      if (ch === delimiter) {
        row.push(field);
        field = '';
        afterQuote = false;
        fieldWasQuoted = false;
        i++;
      } else if (ch === '\n' || ch === '\r') {
        pushRow();
        if (ch === '\r' && input[i + 1] === '\n') i += 2;
        else i++;
      } else {
        throw new Error('پس از پایان فیلد نقل‌قول‌شده، نویسه غیرمجاز وجود دارد.');
      }
      continue;
    }

    if (ch === '"') {
      if (field !== '') throw new Error('نقل‌قول باید در ابتدای فیلد CSV باشد.');
      inQuotes = true;
      fieldWasQuoted = true;
      i++;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
      fieldWasQuoted = false;
      i++;
    } else if (ch === '\n' || ch === '\r') {
      pushRow();
      if (ch === '\r' && input[i + 1] === '\n') i += 2;
      else i++;
    } else {
      field += ch;
      i++;
    }
  }

  if (inQuotes) throw new Error('فیلد نقل‌قول‌شده در CSV بسته نشده است.');
  if (afterQuote || field !== '' || row.length > 0 || fieldWasQuoted) pushRow();
  return rows;
}

export interface CsvToJsonOptions { delimiter: string; useHeaders: boolean; }

function uniqueHeaders(rawHeaders: string[], columnCount: number): string[] {
  const used = new Set<string>();
  return Array.from({ length: columnCount }, (_, index) => {
    const base = rawHeaders[index]?.trim() || `column_${index + 1}`;
    let name = base;
    let suffix = 2;
    while (used.has(name)) name = `${base}_${suffix++}`;
    used.add(name);
    return name;
  });
}

export function csvToJson(csv: string, opts: CsvToJsonOptions): string {
  const rows = parseCSV(csv, opts.delimiter);
  if (rows.length === 0) return '[]';
  if (!opts.useHeaders) return JSON.stringify(rows, null, 2);

  const columnCount = Math.max(...rows.map(row => row.length));
  const headers = uniqueHeaders(rows[0], columnCount);
  const data = rows.slice(1).map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => { obj[header] = row[index] ?? ''; });
    return obj;
  });
  return JSON.stringify(data, null, 2);
}

function safeCsvCell(value: unknown, delimiter: string): string {
  let text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (typeof value === 'string' && /^[\t\r\n ]*[=+@]/.test(text)) text = "'" + text;
  if (typeof value === 'string' && /^[\t\r\n ]*-/.test(text) && !/^-\d+(?:\.\d+)?$/.test(text)) text = "'" + text;
  return text.includes(delimiter) || text.includes('"') || text.includes('\n') || text.includes('\r')
    ? '"' + text.replace(/"/g, '""') + '"'
    : text;
}

export function jsonToCsv(json: string, delimiter = ','): string {
  assertDelimiter(delimiter);
  const data: unknown = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error('JSON باید آرایه‌ای از اشیا باشد.');
  if (data.length === 0) return '';
  if (data.some(item => typeof item !== 'object' || item === null || Array.isArray(item))) {
    throw new Error('هر ردیف JSON باید یک شیء باشد.');
  }

  const headers = Array.from(new Set(data.flatMap((item) => Object.keys(item as Record<string, unknown>))));
  const header = headers.map(value => safeCsvCell(value, delimiter)).join(delimiter);
  const rows = data.map(item => {
    const record = item as Record<string, unknown>;
    return headers.map(key => safeCsvCell(record[key], delimiter)).join(delimiter);
  });
  return [header, ...rows].join('\n');
}
