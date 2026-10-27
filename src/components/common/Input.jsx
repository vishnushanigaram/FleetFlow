import React from 'react';

export function Input({
  label,
  error,
  helper,
  icon: Icon,
  className = '',
  containerClassName = '',
  required = false,
  ...props
}) {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm transition-colors
            ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5
            ${error 
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-950/60' 
              : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-200 dark:focus:ring-brand-950/60'}
            focus:outline-none focus:ring-2 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      {!error && helper && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p>}
    </div>
  );
}
