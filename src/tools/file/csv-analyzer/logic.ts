import { parseCSV } from '../csv-json-converter/logic';

export interface CsvColumnStats {
  name: string;
  nonEmpty: number;
  empty: number;
  unique: number;
  numeric: boolean;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
}
export interface CsvAnalysis {
  headers: string[];
  rows: string[][];
  rowCount: number;
  columnCount: number;
  emptyCells: number;
  duplicateRows: number;
  columns: CsvColumnStats[];
}
const MAX_FILTER_LENGTH = 500;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function analyzeCsv(input: string, delimiter = ',', hasHeaders = true): CsvAnalysis {
  const parsed = parseCSV(input, delimiter);
  if (!parsed.length) return { headers: [], rows: [], rowCount: 0, columnCount: 0, emptyCells: 0, duplicateRows: 0, columns: [] };
  const columnCount = Math.max(...parsed.map(row => row.length));
  const headers = hasHeaders
    ? Array.from({ length: columnCount }, (_, i) => parsed[0][i]?.trim() || `column_${i + 1}`)
    : Array.from({ length: columnCount }, (_, i) => `column_${i + 1}`);
  const rows = (hasHeaders ? parsed.slice(1) : parsed).map(row =>
    Array.from({ length: columnCount }, (_, i) => row[i] ?? '')
  );
  const emptyCells = rows.reduce((total, row) => total + row.filter(value => value.trim() === '').length, 0);
  const seen = new Set<string>();
  let duplicateRows = 0;
  for (const row of rows) {
    const key = JSON.stringify(row);
    if (seen.has(key)) duplicateRows++;
    else seen.add(key);
  }
  const columns = headers.map((name, index): CsvColumnStats => {
    const values = rows.map(row => row[index] ?? '');
    const nonEmptyValues = values.filter(value => value.trim() !== '');
    const numericValues = nonEmptyValues.map(value => Number(value.trim()));
    const numeric = nonEmptyValues.length > 0 && numericValues.every(Number.isFinite);
    const stats: CsvColumnStats = {
      name,
      nonEmpty: nonEmptyValues.length,
      empty: values.length - nonEmptyValues.length,
      unique: new Set(nonEmptyValues).size,
      numeric
    };
    if (numeric) {
      stats.min = Math.min(...numericValues);
      stats.max = Math.max(...numericValues);
      stats.mean = numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
      stats.median = median(numericValues);
    }
    return stats;
  });
  return { headers, rows, rowCount: rows.length, columnCount, emptyCells, duplicateRows, columns };
}

export function filterCsvRows(rows: string[][], columnIndex: number, query: string): string[][] {
  if (!Number.isInteger(columnIndex) || columnIndex < 0) throw new Error('ستون انتخاب‌شده معتبر نیست.');
  if (query.length > MAX_FILTER_LENGTH) throw new Error('عبارت فیلتر بیش از حد طولانی است.');
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return rows.map(row => [...row]);
  return rows.filter(row => (row[columnIndex] ?? '').toLocaleLowerCase().includes(needle)).map(row => [...row]);
}

export function sortCsvRows(rows: string[][], columnIndex: number, direction: 'asc' | 'desc' = 'asc'): string[][] {
  if (!Number.isInteger(columnIndex) || columnIndex < 0) throw new Error('ستون انتخاب‌شده معتبر نیست.');
  const sign = direction === 'desc' ? -1 : 1;
  return rows.map((row, index) => ({ row: [...row], index })).sort((a, b) => {
    const left = a.row[columnIndex] ?? '';
    const right = b.row[columnIndex] ?? '';
    const ln = left.trim() === '' ? Number.NaN : Number(left);
    const rn = right.trim() === '' ? Number.NaN : Number(right);
    const bothNumeric = Number.isFinite(ln) && Number.isFinite(rn);
    const compared = bothNumeric ? ln - rn : left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
    return compared === 0 ? a.index - b.index : compared * sign;
  }).map(item => item.row);
}

export function rowsToCsv(headers: string[], rows: string[][], delimiter = ','): string {
  if (delimiter.length !== 1 || delimiter === '"' || delimiter === '\n' || delimiter === '\r') throw new Error('جداکننده نامعتبر است.');
  const encode = (value: string) => {
    let safe = value;
    if (/^[\t\r\n ]*[=+@]/.test(safe) || (/^[\t\r\n ]*-/.test(safe) && !/^-\d+(?:\.\d+)?$/.test(safe))) safe = "'" + safe;
    return safe.includes(delimiter) || /["\r\n]/.test(safe) ? '"' + safe.replace(/"/g, '""') + '"' : safe;
  };
  return [headers, ...rows].map(row => row.map(encode).join(delimiter)).join('\n');
}
