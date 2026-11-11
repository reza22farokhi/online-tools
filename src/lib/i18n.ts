import fa from '../i18n/fa.json';
import en from '../i18n/en.json';

export type Lang = 'fa' | 'en';

const dicts = { fa, en } as const;

export function t(
  key: string,
  lang: Lang = 'fa',
  vars?: Record<string, string | number>
): string {
  const dict = dicts[lang] as Record<string, string>;
  let out = dict[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.split(`{${k}}`).join(String(v));
    }
  }
  return out;
}

export function getDicts() {
  return dicts;
}
