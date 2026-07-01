export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;

export function normalize360(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

export function sinDeg(deg: number): number {
  return Math.sin(deg * DEG);
}

export function cosDeg(deg: number): number {
  return Math.cos(deg * DEG);
}

export function tanDeg(deg: number): number {
  return Math.tan(deg * DEG);
}

export function asinDeg(x: number): number {
  return Math.asin(x) * RAD;
}

export function acosDeg(x: number): number {
  return Math.acos(x) * RAD;
}

export function atan2Deg(y: number, x: number): number {
  return Math.atan2(y, x) * RAD;
}
