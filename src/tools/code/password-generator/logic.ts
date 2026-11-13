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

export function generatePassword(length: number, options: PasswordOptions): string {
  let charset = '';
  if (options.upper) charset += CHARSETS.upper;
  if (options.lower) charset += CHARSETS.lower;
  if (options.numbers) charset += CHARSETS.numbers;
  if (options.symbols) charset += CHARSETS.symbols;

  if (charset === '') {
    throw new Error('At least one character set must be selected.');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomBuffer = new Uint32Array(1);
    // Use Web Crypto API (Available in Node 20+ and Browsers)
    crypto.getRandomValues(randomBuffer);
    const randomIndex = randomBuffer[0] % charset.length;
    password += charset[randomIndex];
  }
  
  return password;
}
