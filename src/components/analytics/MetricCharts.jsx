import React from 'react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export function StatusBreakdownChart({ data, title = 'Fleet Status Distribution' }) {
  // data: [{ label, count, color, percentage }]
  const total = data.reduce((acc, d) => acc + d.count, 0) || 1;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        {title}
      </h4>

      {/* Multi-segment stacked bar */}
      <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mb-4">
        {data.map((item, idx) => {
          const width = Math.round((item.count / total) * 100);
          if (width === 0) return null;
          return (
            <div
              key={idx}
              className={`h-full ${item.color}`}
              style={{ width: `${width}%` }}
              title={`${item.label}: ${item.count} (${width}%)`}
            />
          );
        })}
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 dark:bg-slate-850/50">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {item.count} ({Math.round((item.count / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrendBarChart({ title = 'Monthly Operational Volume (Trips & Deliveries)', data = [] }) {
  // Mock monthly data points
  const points = data.length > 0 ? data : [
    { label: 'May', trips: 28, completed: 25 },
    { label: 'Jun', trips: 34, completed: 31 },
    { label: 'Jul', trips: 42, completed: 40 },
    { label: 'Aug', trips: 38, completed: 35 },
    { label: 'Sep', trips: 45, completed: 42 },
    { label: 'Oct', trips: 52, completed: 48 }
  ];

  const maxVal = Math.max(...points.map(p => p.trips)) || 50;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </h4>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" /> Total Trips
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Delivered On-Time
          </span>
        </div>
      </div>

      <div className="h-44 flex items-end gap-3 sm:gap-6 justify-between pt-4 border-b border-slate-100 dark:border-slate-800">
        {points.map((p, idx) => {
          const heightTrips = Math.round((p.trips / maxVal) * 100);
          const heightCompleted = Math.round((p.completed / maxVal) * 100);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1.5 h-full">
                <div
                  className="w-1/2 bg-brand-500 rounded-t-md hover:bg-brand-600 transition-all duration-300 relative group-hover:shadow-lg"
                  style={{ height: `${heightTrips}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-white px-1 rounded transition-opacity">
                    {p.trips}
                  </span>
                </div>
                <div
                  className="w-1/2 bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all duration-300 relative group-hover:shadow-lg"
                  style={{ height: `${heightCompleted}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-white px-1 rounded transition-opacity">
                    {p.completed}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-2">{p.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
