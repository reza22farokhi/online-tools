import { describe, it, expect } from 'vitest';
import { parseCSV, csvToJson, jsonToCsv, MAX_CSV_INPUT_BYTES, MAX_CSV_ROWS, MAX_CSV_COLUMNS } from '../../src/tools/file/csv-json-converter/logic';

describe('parseCSV', () => {
  it('simple', () => expect(parseCSV('a,b\n1,2')).toEqual([['a','b'],['1','2']]));
  it('quoted', () => expect(parseCSV('"a, b",c')).toEqual([['a, b','c']]));
  it('escaped', () => expect(parseCSV('"he said ""hi"""')).toEqual([['he said "hi"']]));
  it('delim', () => expect(parseCSV('a;b',';')).toEqual([['a','b']]));
  it('quoted multiline field', () => expect(parseCSV('name,note\r\nAli,"line 1\r\nline 2"')).toEqual([['name','note'],['Ali','line 1\r\nline 2']]));
  it('quoted empty field', () => expect(parseCSV('""')).toEqual([['']]));
  it('rejects unclosed quotes', () => expect(() => parseCSV('a,"b')).toThrow(/بسته نشده/));
  it('rejects quotes in the middle of unquoted fields', () => expect(() => parseCSV('ab"c,d')).toThrow(/ابتدای فیلد/));
  it('rejects text after a closing quote', () => expect(() => parseCSV('"a"x,b')).toThrow(/نویسه غیرمجاز/));
  it('rejects multi-character delimiters', () => expect(() => parseCSV('a||b','||')).toThrow(/جداکننده/));
  it('rejects input larger than the 2 MB processing limit', () => {
    expect(() => parseCSV('x'.repeat(MAX_CSV_INPUT_BYTES + 1))).toThrow(/۲ مگابایت/);
  });
  it('rejects excessive row counts', () => {
    expect(() => parseCSV(Array(MAX_CSV_ROWS + 1).fill('x').join('\n'))).toThrow(/ردیف‌ها/);
  });
  it('rejects excessive column counts', () => {
    expect(() => parseCSV(Array(MAX_CSV_COLUMNS + 1).fill('x').join(','))).toThrow(/ستون‌ها/);
  });
});

describe('csvToJson', () => {
  it('headers', () => {
    expect(JSON.parse(csvToJson('name,age\nAli,30',{delimiter:',',useHeaders:true})))
      .toEqual([{name:'Ali',age:'30'}]);
  });
  it('disambiguates duplicate headers and preserves extra columns', () => {
    expect(JSON.parse(csvToJson('name,name\nAli,30,Tehran',{delimiter:',',useHeaders:true})))
      .toEqual([{name:'Ali',name_2:'30',column_3:'Tehran'}]);
  });
  it('no headers', () => {
    expect(JSON.parse(csvToJson('Ali,30',{delimiter:',',useHeaders:false})))
      .toEqual([['Ali','30']]);
  });
});

describe('jsonToCsv', () => {
  it('basic', () => expect(jsonToCsv('[{"a":1,"b":2}]',',')).toBe('a,b\n1,2'));
  it('escape', () => expect(jsonToCsv('[{"a":"x, y"}]',',')).toContain('"x, y"'));
  it('non-array', () => expect(() => jsonToCsv('{"a":1}',',')).toThrow());
  it('empty', () => expect(jsonToCsv('[]',',')).toBe(''));
  it('rejects primitive array rows', () => expect(() => jsonToCsv('[1,2]',',')).toThrow(/هر ردیف/));
  it('serializes nested values as JSON', () => expect(jsonToCsv('[{"a":{"x":1}}]',',')).toContain('{""x"":1}'));
  it('neutralizes spreadsheet formula strings', () => expect(jsonToCsv('[{"value":"=HYPERLINK(\\"https://bad.example\\",\\"click\\")"}]',',')).toContain("'=HYPERLINK"));
  it('rejects JSON input larger than the 2 MB processing limit', () => {
    expect(() => jsonToCsv('x'.repeat(MAX_CSV_INPUT_BYTES + 1), ',')).toThrow(/۲ مگابایت/);
  });
  it('rejects excessive JSON row counts', () => {
    const json = JSON.stringify(Array(MAX_CSV_ROWS + 1).fill({ value: 'x' }));
    expect(() => jsonToCsv(json, ',')).toThrow(/ردیف‌ها/);
  });
  it('rejects excessive JSON column counts', () => {
    const row = Object.fromEntries(Array(MAX_CSV_COLUMNS + 1).fill(0).map((_, i) => ['column_' + i, 'x']));
    expect(() => jsonToCsv(JSON.stringify([row]), ',')).toThrow(/ستون‌ها/);
  });
});
