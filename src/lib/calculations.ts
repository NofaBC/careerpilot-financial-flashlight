import type { FinancialEntry, ComputedEntry, PeriodMetrics, MonthMetrics } from '@/types/financial';

/**
 * All financial calculations are deterministic and code-based.
 * AI is NEVER used to compute these numbers.
 */

export function computeEntry(entry: FinancialEntry): ComputedEntry {
  const netRevenue = (entry.revenue || 0) - (entry.refunds || 0);
  const totalCost =
    (entry.aiCost || 0) +
    (entry.jobsCost || 0) +
    (entry.hostingCost || 0) +
    (entry.otherCost || 0);
  const profit = netRevenue - totalCost;
  return { ...entry, netRevenue, totalCost, profit };
}

export function todayLocalDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function startOfWeek(dateStr: string): Date {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return d;
}

function endOfWeek(dateStr: string): Date {
  const d = startOfWeek(dateStr);
  d.setDate(d.getDate() + 6);
  return d;
}

function isInRange(dateStr: string, start: Date, end: Date): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  return d >= start && d <= end;
}

function sumMetrics(entries: ComputedEntry[]): PeriodMetrics {
  return {
    netRevenue: entries.reduce((s, e) => s + e.netRevenue, 0),
    totalCost: entries.reduce((s, e) => s + e.totalCost, 0),
    profit: entries.reduce((s, e) => s + e.profit, 0),
  };
}

export function computeTodayMetrics(entries: ComputedEntry[], today: string): PeriodMetrics {
  const todayEntries = entries.filter((e) => e.date === today);
  return sumMetrics(todayEntries);
}

export function computeWeekMetrics(entries: ComputedEntry[], today: string): PeriodMetrics {
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const weekEntries = entries.filter((e) => isInRange(e.date, weekStart, weekEnd));
  return sumMetrics(weekEntries);
}

export function computeMonthMetrics(entries: ComputedEntry[], today: string): MonthMetrics {
  const monthPrefix = today.slice(0, 7); // YYYY-MM
  const monthEntries = entries.filter((e) => e.date.startsWith(monthPrefix));
  const base = sumMetrics(monthEntries);

  const newSubs = monthEntries.reduce((s, e) => s + (e.newSubs || 0), 0);
  const renewals = monthEntries.reduce((s, e) => s + (e.renewals || 0), 0);
  const totalSubs = newSubs + renewals;

  return {
    ...base,
    newSubs,
    renewals,
    revenuePerSubscriber: totalSubs > 0 ? base.netRevenue / totalSubs : 0,
    costPercentage: base.netRevenue > 0 ? (base.totalCost / base.netRevenue) * 100 : 0,
  };
}
