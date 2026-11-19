export const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

export interface PasswordOptions {
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}

function secureRandomInt(max: number): number {
  if (!Number.isInteger(max) || max < 1 || max > 0x100000000) {
    throw new RangeError('Invalid random range.');
  }
  if (typeof crypto === 'undefined' || typeof crypto.getRandomValues !== 'function') {
    throw new Error('Secure random generation is not available in this browser.');
  }
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

export function generatePassword(length: number, options: PasswordOptions): string {
  if (!Number.isInteger(length) || length < 1 || length > 256) {
    throw new RangeError('Password length must be between 1 and 256.');
  }
  const sets: string[] = [];
  if (options.upper) sets.push(CHARSETS.upper);
  if (options.lower) sets.push(CHARSETS.lower);
  if (options.numbers) sets.push(CHARSETS.numbers);
  if (options.symbols) sets.push(CHARSETS.symbols);

  if (sets.length === 0) {
    throw new Error('At least one character set must be selected.');
  }
  if (length < sets.length) {
    throw new Error('Password length is too short for the selected character sets.');
  }

  const charset = sets.join('');
  const chars = sets.map(set => set[secureRandomInt(set.length)]);
  while (chars.length < length) chars.push(charset[secureRandomInt(charset.length)]);

  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
