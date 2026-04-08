'use client';

import { useState } from 'react';
import type { PeriodMetrics, MonthMetrics } from '@/types/financial';

interface Props {
  todayMetrics: PeriodMetrics;
  weekMetrics: PeriodMetrics;
  monthMetrics: MonthMetrics;
}

export default function InsightPanel({ todayMetrics, weekMetrics, monthMetrics }: Props) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchInsight() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todayRevenue: todayMetrics.netRevenue,
          todayCost: todayMetrics.totalCost,
          todayProfit: todayMetrics.profit,
          weekRevenue: weekMetrics.netRevenue,
          weekCost: weekMetrics.totalCost,
          weekProfit: weekMetrics.profit,
          monthRevenue: monthMetrics.netRevenue,
          monthCost: monthMetrics.totalCost,
          monthProfit: monthMetrics.profit,
          monthNewSubs: monthMetrics.newSubs,
          monthRenewals: monthMetrics.renewals,
          costPercentage: monthMetrics.costPercentage,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setInsight(data.insight);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ marginTop: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ margin: 0 }}>AI Insights</h2>
        <button
          type="button"
          className="secondary"
          onClick={fetchInsight}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Insight'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'var(--danger)', fontSize: '14px', marginBottom: '8px' }}>
          {error}
        </div>
      )}

      {insight ? (
        <div style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>
          {insight}
        </div>
      ) : !loading && !error ? (
        <div className="empty" style={{ fontSize: '13px' }}>
          Click &quot;Generate Insight&quot; to get AI-powered observations based on your current metrics.
          AI does not compute numbers — it only comments on the data.
        </div>
      ) : null}
    </section>
  );
}
