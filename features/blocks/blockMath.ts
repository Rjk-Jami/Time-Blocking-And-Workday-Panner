export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function snapTo(minutes: number, step: number) {
  return Math.round(minutes / step) * step;
}

export function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) {
  return aStart < bEnd && bStart < aEnd;
}

export function fmtTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}
