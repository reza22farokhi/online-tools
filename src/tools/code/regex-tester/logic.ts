export interface MatchResult {
  value: string;
  index: number;
  length: number;
  groups?: Record<string, string | undefined>;
}

export interface RegexResult {
  ok: boolean;
  error?: string;
  matches: MatchResult[];
}

export const MAX_PATTERN_LENGTH = 500;
export const MAX_INPUT_LENGTH = 100_000;
export const MAX_MATCHES = 1000;

export function testRegex(pattern: string, flags: string, input: string): RegexResult {
  if (pattern === '') return { ok: false, error: 'الگو خالی است', matches: [] };
  if (pattern.length > MAX_PATTERN_LENGTH) {
    return { ok: false, error: `الگو بیش از حد طولانی است (حداکثر ${MAX_PATTERN_LENGTH})`, matches: [] };
  }
  if (input.length > MAX_INPUT_LENGTH) {
    return { ok: false, error: `متن ورودی بیش از حد طولانی است (حداکثر ${MAX_INPUT_LENGTH})`, matches: [] };
  }

  const allowedFlags = 'gimsuyd';
  const uniqueFlags = Array.from(new Set(flags.split('').filter(f => allowedFlags.includes(f)))).join('');

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, uniqueFlags);
  } catch (e) {
    return { ok: false, error: 'الگوی نامعتبر: ' + (e instanceof Error ? e.message : String(e)), matches: [] };
  }

  const matches: MatchResult[] = [];

  if (uniqueFlags.includes('g')) {
    let m: RegExpExecArray | null;
    while ((m = regex.exec(input)) !== null) {
      matches.push({
        value: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.groups ? { ...m.groups } : undefined
      });
      if (m[0] === '') regex.lastIndex++;
      if (matches.length >= MAX_MATCHES) break;
    }
  } else {
    const m = regex.exec(input);
    if (m) {
      matches.push({
        value: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.groups ? { ...m.groups } : undefined
      });
    }
  }

  return { ok: true, matches };
}

export function killWorker(): void {
  const cancel = pendingResolve;
  pendingResolve = null;
  if (worker) worker.terminate();
  worker = null;
  if (timeoutHandle !== null) window.clearTimeout(timeoutHandle);
  timeoutHandle = null;
  cancel?.({ ok: false, error: 'اجرای قبلی لغو شد', matches: [] });
}
export function runInWorker(pattern: string, flags: string, text: string): Promise<RegexResult> {
  return new Promise((resolve) => {
    if (typeof Worker === 'undefined') {
      resolve({ ok: false, error: 'مرورگر از Web Worker پشتیبانی نمی‌کند', matches: [] });
      return;
    }

    let currentWorker: Worker;
    try {
      currentWorker = new Worker(new URL('./regex.worker.ts', import.meta.url), { type: 'module' });
    } catch {
      resolve({ ok: false, error: 'ساخت Worker ناموفق بود', matches: [] });
      return;
    }

    let settled = false;
    let localTimeout: number | null = null;
    const finish = (result: RegexResult) => {
      if (settled) return;
      settled = true;
      if (localTimeout !== null) window.clearTimeout(localTimeout);
      if (timeoutHandle === localTimeout) timeoutHandle = null;
      if (worker === currentWorker) {
        currentWorker.terminate();
        worker = null;
      }
      if (pendingResolve === finish) pendingResolve = null;
      resolve(result);
    };

    worker = currentWorker;
    pendingResolve = finish;
    localTimeout = window.setTimeout(() => {
      finish({ ok: false, error: 'زمان اجرای الگو بیش از حد مجاز شد (۲ ثانیه)', matches: [] });
    }, 2000);
    timeoutHandle = localTimeout;

    currentWorker.onmessage = (e: MessageEvent<RegexResult>) => finish(e.data);
    currentWorker.onerror = () => finish({ ok: false, error: 'خطا در اجرای الگو', matches: [] });
    try {
      currentWorker.postMessage({ pattern, flags, text });
    } catch {
      finish({ ok: false, error: 'ارسال داده به Worker ناموفق بود', matches: [] });
    }
  });
}

export function testRegex(pattern: string, flags: string, input: string): RegexResult {
  if (pattern === '') return { ok: false, error: 'الگو خالی است', matches: [] };
  if (pattern.length > MAX_PATTERN_LENGTH) {
    return { ok: false, error: `الگو بیش از حد طولانی است (حداکثر ${MAX_PATTERN_LENGTH})`, matches: [] };
  }
  if (input.length > MAX_INPUT_LENGTH) {
    return { ok: false, error: `متن ورودی بیش از حد طولانی است (حداکثر ${MAX_INPUT_LENGTH})`, matches: [] };
  }

  const allowedFlags = 'gimsuyd';
  const uniqueFlags = Array.from(new Set(flags.split('').filter(f => allowedFlags.includes(f)))).join('');

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, uniqueFlags);
  } catch (e) {
    return { ok: false, error: 'الگوی نامعتبر: ' + (e instanceof Error ? e.message : String(e)), matches: [] };
  }

  const matches: MatchResult[] = [];

  if (uniqueFlags.includes('g')) {
    let m: RegExpExecArray | null;
    while ((m = regex.exec(input)) !== null) {
      matches.push({
        value: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.groups ? { ...m.groups } : undefined
      });
      if (m[0] === '') regex.lastIndex++;
      if (matches.length >= MAX_MATCHES) break;
    }
  } else {
    const m = regex.exec(input);
    if (m) {
      matches.push({
        value: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.groups ? { ...m.groups } : undefined
      });
    }
  }

  return { ok: true, matches };
}export function killWorker(): void {
  const cancel = pendingResolve;
  pendingResolve = null;
  if (worker) worker.terminate();
  worker = null;
  if (timeoutHandle !== null) window.clearTimeout(timeoutHandle);
  timeoutHandle = null;
  cancel?.({ ok: false, error: 'اجرای قبلی لغو شد', matches: [] });
}

