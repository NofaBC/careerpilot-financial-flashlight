'use client';

interface Props {
  label: string;
  value: string;
  sub: string;
  numericValue?: number;
}

export default function MetricCard({ label, value, sub, numericValue }: Props) {
  let colorClass = '';
  if (numericValue !== undefined) {
    if (numericValue > 0) colorClass = 'positive';
    else if (numericValue < 0) colorClass = 'negative';
  }

  return (
    <div className="card metric">
      <div className="label">{label}</div>
      <div className={`value ${colorClass}`}>{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}
