export function parseCSV(input: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += ch; i++;
    } else {
      if (ch === '"') { inQuotes = true; i++; }
      else if (ch === delimiter) { row.push(field); field = ''; i++; }
      else if (ch === '\n' || ch === '\r') {
        row.push(field); field = '';
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
        if (ch === '\r' && input[i + 1] === '\n') i += 2; else i++;
      } else { field += ch; i++; }
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row[0] !== '') rows.push(row);
  }
  return rows;
}

export interface CsvToJsonOptions { delimiter: string; useHeaders: boolean; }

export function csvToJson(csv: string, opts: CsvToJsonOptions): string {
  const rows = parseCSV(csv, opts.delimiter);
  if (rows.length === 0) return '[]';
  if (!opts.useHeaders) return JSON.stringify(rows, null, 2);
  const headers = rows[0];
  const data = rows.slice(1).map(r => {
    const o: Record<string, string> = {};
    headers.forEach((h, i) => { o[h] = r[i] ?? ''; });
    return o;
  });
  return JSON.stringify(data, null, 2);
}

export function jsonToCsv(json: string, delimiter = ','): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error('JSON must be an array');
  if (data.length === 0) return '';
  const headers = Array.from(new Set(data.flatMap((o: any) =>
    typeof o === 'object' && o !== null ? Object.keys(o) : []
  ))) as string[];
  const esc = (v: any): string => {
    const s = v == null ? '' : String(v);
    return s.includes(delimiter) || s.includes('"') || s.includes('\n') || s.includes('\r')
      ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const header = headers.map(esc).join(delimiter);
  const rows = data.map((o: any) =>
    typeof o !== 'object' || o === null ? ''
      : headers.map(h => esc(o[h])).join(delimiter)
  );
  return [header, ...rows].join('\n');
}
