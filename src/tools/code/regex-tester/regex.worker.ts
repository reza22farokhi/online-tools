import { testRegex } from './logic';

type WorkerContext = {
  onmessage: ((event: MessageEvent) => void) | null;
  postMessage: (msg: unknown) => void;
};

const ctx = self as unknown as WorkerContext;

ctx.onmessage = (event: MessageEvent) => {
  try {
    const data = event.data as { pattern: string; flags: string; input: string };
    const result = testRegex(data.pattern, data.flags, data.input);
    ctx.postMessage(result);
  } catch (e) {
    ctx.postMessage({ ok: false, error: e instanceof Error ? e.message : 'Worker error', matches: [] });
  }
};
