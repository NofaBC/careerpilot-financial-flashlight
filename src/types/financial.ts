export interface FinancialEntry {
  id: string;
  date: string; // YYYY-MM-DD
  newSubs: number;
  renewals: number;
  revenue: number;
  refunds: number;
  aiCost: number;
  jobsCost: number;
  hostingCost: number;
  otherCost: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ComputedEntry extends FinancialEntry {
  netRevenue: number;
  totalCost: number;
  profit: number;
}

export interface PeriodMetrics {
  netRevenue: number;
  totalCost: number;
  profit: number;
}

export interface MonthMetrics extends PeriodMetrics {
  newSubs: number;
  renewals: number;
  revenuePerSubscriber: number;
  costPercentage: number;
}

export type EntryFormData = Omit<FinancialEntry, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
