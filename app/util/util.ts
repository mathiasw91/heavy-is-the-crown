export function formatDecimals(val: number): string {
  return val.toFixed(2).replace('.', ',');
}

export function formatWinrate(val: number): string {
  return (val*100).toFixed(0);
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}