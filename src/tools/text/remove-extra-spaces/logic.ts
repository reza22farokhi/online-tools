export interface SpaceOptions {
  collapseSpaces: boolean;
  removeEmptyLines: boolean;
  trimLines: boolean;
  trimText: boolean;
}

export const DEFAULT_OPTIONS: SpaceOptions = {
  collapseSpaces: true,
  removeEmptyLines: false,
  trimLines: true,
  trimText: true
};

export function cleanSpaces(input: string, opts: SpaceOptions): string {
  if (input === '') return '';
  let result = input;

  if (opts.trimText) {
    result = result.trim();
  }

  let lines = result.split(/\r\n|\r|\n/);

  if (opts.trimLines) {
    lines = lines.map(l => l.trim());
  }

  if (opts.collapseSpaces) {
    lines = lines.map(l => l.replace(/[ \t\u00A0]+/g, ' '));
  }

  if (opts.removeEmptyLines) {
    lines = lines.filter(l => l.trim() !== '');
  }

  return lines.join('\n');
}
