type Table = [number, number][];
export const LISTENING: Table = [[39,9],[37,8.5],[35,8],[32,7.5],[30,7],[26,6.5],[23,6],[18,5.5],[16,5],[13,4.5],[11,4],[0,3.5]];
export const ACADEMIC: Table = [[39,9],[37,8.5],[35,8],[33,7.5],[30,7],[27,6.5],[23,6],[19,5.5],[15,5],[13,4.5],[10,4],[0,3.5]];
export const GENERAL: Table = [[40,9],[39,8.5],[37,8],[36,7.5],[34,7],[32,6.5],[30,6],[27,5.5],[23,5],[19,4.5],[15,4],[0,3.5]];

export function band(t: Table, n: number) {
  for (const [min, b] of t) if (n >= min) return b;
  return 3.5;
}
export function roundOverall(sum: number) {
  const a = sum / 4, f = Math.floor(a), r = a - f;
  return r < 0.25 ? f : r < 0.75 ? f + 0.5 : f + 1;
}
