export function currency(n: number): string {
  return `$${Number(n || 0).toFixed(2)}`;
}

export function formatPercent(n: number): string {
  return `${Number(n || 0).toFixed(1)}%`;
}
