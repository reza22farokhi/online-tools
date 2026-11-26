import { describe, expect, it } from 'vitest';
import { analyzeCsv, cleanCsvRows, filterCsvRows, rowsToCsv, sortCsvRows } from './logic';

describe('CSV analyzer', () => {
  const csv = 'name,age,city\nAda,36,London\nGrace,40,New York\nAda,36,London\n,28,Paris';
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
    const result = analyzeCsv('1,2\n3,4', ',', false);
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
    expect(rowsToCsv(['name', 'value'], [['Ada, L', '=1+1']])).toBe('name,value\n"Ada, L",\'=1+1');
  });
  it('handles empty input and rejects invalid filters', () => {
    expect(analyzeCsv('')).toMatchObject({ rowCount: 0, columnCount: 0 });
    expect(() => filterCsvRows([], -1, 'x')).toThrow();
  });
});

describe('CSV advanced quality and cleanup', () => {
  it('classifies columns and calculates missingness, quartiles, deviation and outliers', () => {
    const result = analyzeCsv('score,flag,when,label\\n1,true,2024-01-01,a\\n2,false,2024-01-02,b\\n3,true,2024-01-03,b\\n4,false,2024-01-04,\\n100,true,2024-01-05,c');
    expect(result.columns[0]).toMatchObject({ type: 'number', missingPercent: 0, q1: 2, q3: 4, outliers: 1 });
    expect(result.columns[1].type).toBe('boolean');
    expect(result.columns[2].type).toBe('date');
    expect(result.columns[3]).toMatchObject({ type: 'text', missingPercent: 20, mode: 'b' });
  });
  it('cleans whitespace, duplicate and empty rows without mutating input', () => {
    const rows = [[' Ada ', ' 1 '], ['Ada', '1'], ['', '  '], ['Grace', '2']];
    expect(cleanCsvRows(rows, { trim: true, removeDuplicates: true, removeEmptyRows: true })).toEqual([['Ada', '1'], ['Grace', '2']]);
    expect(rows[0]).toEqual([' Ada ', ' 1 ']);
  });
  it('fills missing cells with the exact replacement and preserves row order', () => {
    expect(cleanCsvRows([['Ada', ''], ['', '2']], { fillEmpty: 'N/A' })).toEqual([['Ada', 'N/A'], ['N/A', '2']]);
  });
});
