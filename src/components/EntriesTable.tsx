'use client';

import type { ComputedEntry } from '@/types/financial';
import { currency } from '@/lib/format';

interface Props {
  entries: ComputedEntry[];
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

export default function EntriesTable({ entries, onDelete, onDeleteAll }: Props) {
  return (
    <section className="card" style={{ marginTop: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
        <h2 style={{ margin: 0 }}>Saved Entries</h2>
        <div className="btn-row" style={{ marginTop: 0 }}>
          <span className="pill">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
          <button type="button" className="danger" onClick={onDeleteAll}>
            Delete All Entries
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="empty">No entries yet. Add your first daily financial record above.</div>
      ) : (
        <div style={{ overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>New Subs</th>
                <th>Renewals</th>
                <th>Net Revenue</th>
                <th>Total Cost</th>
                <th>Profit</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td>{e.newSubs}</td>
                  <td>{e.renewals}</td>
                  <td>{currency(e.netRevenue)}</td>
                  <td>{currency(e.totalCost)}</td>
                  <td className={e.profit >= 0 ? 'positive' : 'negative'}>
                    {currency(e.profit)}
                  </td>
                  <td>
                    <div>{e.notes || <span className="small">—</span>}</div>
                  </td>
                  <td>
                    <button type="button" className="secondary" onClick={() => onDelete(e.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
