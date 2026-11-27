import { parseCSV } from '../csv-json-converter/logic';

export type CsvColumnType = 'empty' | 'number' | 'boolean' | 'date' | 'text';
export interface CsvColumnStats {
  name: string;
  nonEmpty: number;
  empty: number;
  missingPercent: number;
  unique: number;
  type: CsvColumnType;
  numeric: boolean;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  q1?: number;
  q3?: number;
  standardDeviation?: number;
  outliers?: number;
  mode?: string;
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
function quartile(values: number[], fraction: number): number {
  if (values.length === 1) return values[0];
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}
function getMode(values: string[]): string | undefined {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  let mode: string | undefined;
  let max = 1;
  for (const [value, count] of counts) {
    if (count > max) { mode = value; max = count; }
  }
  return mode;
}
function emptyAnalysis(): CsvAnalysis {
  return { headers: [], rows: [], rowCount: 0, columnCount: 0, emptyCells: 0, duplicateRows: 0, columns: [] };
}

export function analyzeCsv(input: string, delimiter = ',', hasHeaders = true): CsvAnalysis {
  const parsed = parseCSV(input, delimiter);
  if (!parsed.length) return emptyAnalysis();
  const columnCount = parsed.reduce((max, row) => Math.max(max, row.length), 0);
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
    const boolean = nonEmptyValues.length > 0 && nonEmptyValues.every(value => /^(true|false)$/i.test(value.trim()));
    const date = !numeric && nonEmptyValues.length > 0 && nonEmptyValues.every(value => {
      const normalized = value.trim();
      return /^\d{4}-\d{2}-\d{2}(?:[T ][\d:.+-Z]+)?$/.test(normalized) && Number.isFinite(Date.parse(normalized));
    });
    const stats: CsvColumnStats = {
      name,
      nonEmpty: nonEmptyValues.length,
      empty: values.length - nonEmptyValues.length,
      missingPercent: values.length ? ((values.length - nonEmptyValues.length) / values.length) * 100 : 0,
      unique: new Set(nonEmptyValues).size,
      type: !nonEmptyValues.length ? 'empty' : numeric ? 'number' : boolean ? 'boolean' : date ? 'date' : 'text',
      numeric
    };
    if (numeric) {
      const count = numericValues.length;
      const sum = numericValues.reduce((total, value) => total + value, 0);
      const mean = sum / count;
      const q1 = quartile(numericValues, 0.25);
      const q3 = quartile(numericValues, 0.75);
      const iqr = q3 - q1;
      stats.min = numericValues.reduce((min, value) => Math.min(min, value), Infinity);
      stats.max = numericValues.reduce((max, value) => Math.max(max, value), -Infinity);
      stats.mean = mean;
      stats.median = median(numericValues);
      stats.q1 = q1;
      stats.q3 = q3;
      stats.standardDeviation = Math.sqrt(numericValues.reduce((total, value) => total + (value - mean) ** 2, 0) / count);
      stats.outliers = numericValues.filter(value => value < q1 - 1.5 * iqr || value > q3 + 1.5 * iqr).length;
    }
    stats.mode = getMode(nonEmptyValues);
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

export function cleanCsvRows(
  rows: string[][],
  options: { trim?: boolean; removeDuplicates?: boolean; removeEmptyRows?: boolean; fillEmpty?: string } = {}
): string[][] {
  const seen = new Set<string>();
  const output: string[][] = [];
  for (const original of rows) {
    const row = original.map(value => {
      let result = options.trim ? value.trim() : value;
      if (options.fillEmpty !== undefined && result.trim() === '') result = options.fillEmpty;
      return result;
    });
    if (options.removeEmptyRows && row.every(value => value.trim() === '')) continue;
    const key = JSON.stringify(row);
    if (options.removeDuplicates && seen.has(key)) continue;
    seen.add(key);
    output.push(row);
  }
  return output;
}

export function rowsToCsv(headers: string[], rows: string[][], delimiter = ','): string {
  if (delimiter.length !== 1 || delimiter === '"' || delimiter === '\n' || delimiter === '\r') throw new Error('جداکننده نامعتبر است.');
  const encode = (value: string) => {
    let safe = value;
    if (/^[\t\r\n ]*[=+@]/.test(safe) || (/^[\t\r\n ]*-/.test(safe) && ! /^-\d+(?:\.\d+)?$/.test(safe))) safe = "'" + safe;
    return safe.includes(delimiter) || /["\r\n]/.test(safe) ? '"' + safe.replace(/"/g, '""') + '"' : safe;
  };
  return [headers, ...rows].map(row => row.map(encode).join(delimiter)).join('\n');
}
