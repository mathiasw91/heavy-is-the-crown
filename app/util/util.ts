export function formatDecimals(val: number): string {
  return val.toFixed(2).replace('.', ',');
}

export function formatWinrate(val: number): string {
  return (val*100).toFixed(0);
}

export function formatDate(date: Date): string {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
}