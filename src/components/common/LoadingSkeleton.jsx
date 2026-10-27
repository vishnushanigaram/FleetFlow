import React from 'react';

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-pulse">
      <div className="h-11 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800" />
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-slate-200 dark:bg-slate-800 rounded"
                style={{ width: `${Math.floor(60 + ((c * 17) % 40))}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-8 w-full bg-slate-100 dark:bg-slate-800/80 rounded" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
          <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  );
}
