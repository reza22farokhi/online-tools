export interface ShadowConfig {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export function buildBoxShadow(cfg: ShadowConfig): string {
  const rgb = hexToRgb(cfg.color);
  if (!rgb) return '';
  const alpha = Math.max(0, Math.min(1, cfg.opacity / 100));
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  const inset = cfg.inset ? 'inset ' : '';
  return `${inset}${cfg.offsetX}px ${cfg.offsetY}px ${cfg.blur}px ${cfg.spread}px ${rgba}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

export const PRESETS: { name: string; cfg: ShadowConfig }[] = [
  { name: 'ملایم', cfg: { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: '#000000', opacity: 10, inset: false } },
  { name: 'معمولی', cfg: { offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: '#000000', opacity: 15, inset: false } },
  { name: 'برجسته', cfg: { offsetX: 0, offsetY: 10, blur: 25, spread: -5, color: '#000000', opacity: 25, inset: false } },
  { name: 'داخلی', cfg: { offsetX: 0, offsetY: 2, blur: 8, spread: 0, color: '#000000', opacity: 20, inset: true } },
  { name: 'رنگی', cfg: { offsetX: 0, offsetY: 8, blur: 20, spread: 0, color: '#6366f1', opacity: 40, inset: false } }
];
