import { describe, it, expect } from 'vitest';
import { parseCSV, csvToJson, jsonToCsv } from '../../src/tools/file/csv-json-converter/logic';

describe('parseCSV', () => {
  it('simple', () => expect(parseCSV('a,b\n1,2')).toEqual([['a','b'],['1','2']]));
  it('quoted', () => expect(parseCSV('"a, b",c')).toEqual([['a, b','c']]));
  it('escaped', () => expect(parseCSV('"he said ""hi"""')).toEqual([['he said "hi"']]));
  it('delim', () => expect(parseCSV('a;b',';')).toEqual([['a','b']]));
});

describe('csvToJson', () => {
  it('headers', () => {
    expect(JSON.parse(csvToJson('name,age\nAli,30',{delimiter:',',useHeaders:true})))
      .toEqual([{name:'Ali',age:'30'}]);
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
});
