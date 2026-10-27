import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

export function Badge({ 
  children, 
  variant, 
  size = 'md',
  dot = false, 
  className = '' 
}) {
  const colorClass = STATUS_COLORS[variant] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${sizeClasses[size]} ${colorClass} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {children || variant}
    </span>
  );
}
