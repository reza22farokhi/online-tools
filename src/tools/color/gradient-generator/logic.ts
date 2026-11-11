export type GradientType = 'linear' | 'radial';

export interface ColorStop {
  color: string;
  position: number;
}

export interface GradientConfig {
  type: GradientType;
  angle: number;
  stops: ColorStop[];
}

export function buildCssGradient(cfg: GradientConfig): string {
  const stops = cfg.stops
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  if (cfg.type === 'linear') {
    return `linear-gradient(${cfg.angle}deg, ${stops})`;
  }
  return `radial-gradient(circle, ${stops})`;
}
