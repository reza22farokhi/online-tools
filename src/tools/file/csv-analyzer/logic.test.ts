import { describe, expect, it } from 'vitest';
import { analyzeCsv, filterCsvRows, rowsToCsv, sortCsvRows } from './logic';

describe('CSV analyzer', () => {
  const csv = 'name,age,city\\nAda,36,London\\nGrace,40,New York\\nAda,36,London\\n,28,Paris';
  it('calculates row, column, empty, duplicate and unique statistics', () => {
    const result = analyzeCsv(csv);
    expect(result.rowCount).toBe(4);
    expect(result.columnCount).toBe(3);
    expect(result.emptyCells).toBe(1);
    expect(result.duplicateRows).toBe(1);
    expect(result.columns[0].unique).toBe(2);
    expect(result.columns[1]).toMatchObject({ numeric: true, min: 28, max: 40, mean: 35, median: 36 });
  });
  it('supports CSV without headers', () => {
    const result = analyzeCsv('1,2\\n3,4', ',', false);
    expect(result.headers).toEqual(['column_1', 'column_2']);
    expect(result.rowCount).toBe(2);
  });
  it('filters case-insensitively without mutating rows', () => {
    const rows = [['London'], ['New York']];
    expect(filterCsvRows(rows, 0, 'lon')).toEqual([['London']]);
    expect(rows).toEqual([['London'], ['New York']]);
  });
  it('sorts numeric values numerically and keeps stable ties', () => {
    expect(sortCsvRows([['10'], ['2'], ['2']], 0)).toEqual([['2'], ['2'], ['10']]);
  });
  it('exports safely quoted CSV and protects formula-like cells', () => {
    expect(rowsToCsv(['name', 'value'], [['Ada, L', '=1+1']])).toBe('name,value\\n"Ada, L",\'=1+1');
  });
  it('handles empty input and rejects invalid filters', () => {
    expect(analyzeCsv('')).toMatchObject({ rowCount: 0, columnCount: 0 });
    expect(() => filterCsvRows([], -1, 'x')).toThrow();
  });
});
