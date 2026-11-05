import React from 'react';

export function UtilizationGauge({ percentage = 75, title = 'Fleet Capacity Utilization' }) {
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        {title}
      </h4>

      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-brand-600 transition-all duration-1000 ease-out"
            strokeWidth="10"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {percentage}%
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Fleet</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Calculated from operable trucks in transit & assigned to active missions.
      </p>
    </div>
  );
}
