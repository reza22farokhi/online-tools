import { describe, it, expect } from 'vitest';
import { generatePassword } from '../../src/tools/code/password-generator/logic';

describe('generatePassword', () => {
  it('should generate a string of the correct length', () => {
    const pass = generatePassword(16, { upper: true, lower: true, numbers: true, symbols: true });
    expect(pass).toHaveLength(16);
  });

  it('should only contain specified character sets', () => {
    // Only lowercase
    const pass = generatePassword(10, { upper: false, lower: true, numbers: false, symbols: false });
    expect(pass).toMatch(/^[a-z]{10}$/);
  });

  it('should generate numbers only when only numbers are selected', () => {
    const pass = generatePassword(8, { upper: false, lower: false, numbers: true, symbols: false });
    expect(pass).toMatch(/^\d{8}$/);
  });

  it('should throw an error if no character sets are selected', () => {
    expect(() => {
      generatePassword(12, { upper: false, lower: false, numbers: false, symbols: false });
    }).toThrow('At least one character set must be selected.');
  });

  it('should generate different passwords on consecutive calls', () => {
    const pass1 = generatePassword(20, { upper: true, lower: true, numbers: true, symbols: true });
    const pass2 = generatePassword(20, { upper: true, lower: true, numbers: true, symbols: true });
    expect(pass1).not.toBe(pass2);
  });
});
