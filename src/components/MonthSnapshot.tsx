'use client';

import type { MonthMetrics } from '@/types/financial';
import { currency, formatPercent } from '@/lib/format';

interface Props {
  metrics: MonthMetrics;
}

export default function MonthSnapshot({ metrics }: Props) {
  return (
    <div className="card">
      <h2>Month Snapshot</h2>
      <div className="grid grid-2">
        <div className="metric">
          <div className="label">Month Revenue</div>
          <div className={`value ${metrics.netRevenue > 0 ? 'positive' : metrics.netRevenue < 0 ? 'negative' : ''}`}>
            {currency(metrics.netRevenue)}
          </div>
          <div className="sub">Net of refunds</div>
        </div>
        <div className="metric">
          <div className="label">Month Cost</div>
          <div className={`value ${metrics.totalCost > 0 ? 'negative' : ''}`}>
            {currency(metrics.totalCost)}
          </div>
          <div className="sub">All tracked expenses</div>
        </div>
        <div className="metric">
          <div className="label">Month New Subs</div>
          <div className="value">{metrics.newSubs}</div>
          <div className="sub">Current month</div>
        </div>
        <div className="metric">
          <div className="label">Month Renewals</div>
          <div className="value">{metrics.renewals}</div>
          <div className="sub">Current month</div>
        </div>
        <div className="metric">
          <div className="label">Revenue per Subscriber</div>
          <div className="value">{currency(metrics.revenuePerSubscriber)}</div>
          <div className="sub">Month net revenue / total subs</div>
        </div>
        <div className="metric">
          <div className="label">Cost % of Revenue</div>
          <div className="value">{formatPercent(metrics.costPercentage)}</div>
          <div className="sub">Healthy under control</div>
        </div>
      </div>
    </div>
  );
}
