import React from 'react';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency, formatDistance } from '../../utils/formatters';
import { Wrench, CheckCircle2, Clock, ArrowUpDown, Play, Check } from 'lucide-react';
import { MAINTENANCE_STATUS } from '../../utils/constants';

export function MaintenanceTable({ records, onUpdateStatus, onSort, sortBy, sortOrder }) {
  const renderSortIndicator = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 inline ml-1" />;
    return <span className="text-brand-600 font-bold ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/75 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Work Order / ID</th>
              <th className="py-3.5 px-4">Vehicle</th>
              <th className="py-3.5 px-4">Service Type & Notes</th>
              <th className="py-3.5 px-4">Service Provider</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('scheduledDate')}
              >
                Scheduled Date {renderSortIndicator('scheduledDate')}
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('cost')}
              >
                Cost {renderSortIndicator('cost')}
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {m.id}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                  {m.vehicleReg}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">{m.serviceType}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs">{m.notes}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {m.serviceProvider}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {formatDate(m.scheduledDate)}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(m.cost)}
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant={m.status} dot />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    {m.status !== MAINTENANCE_STATUS.COMPLETED && m.status !== MAINTENANCE_STATUS.IN_PROGRESS && (
                      <button
                        onClick={() => onUpdateStatus(m.id, MAINTENANCE_STATUS.IN_PROGRESS)}
                        className="px-2 py-1 rounded text-blue-600 bg-blue-50 dark:bg-blue-950/40 text-[10px] font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                        title="Commence Maintenance Work"
                      >
                        <Play className="w-3 h-3" /> Start Service
                      </button>
                    )}

                    {m.status === MAINTENANCE_STATUS.IN_PROGRESS && (
                      <button
                        onClick={() => onUpdateStatus(m.id, MAINTENANCE_STATUS.COMPLETED)}
                        className="px-2 py-1 rounded text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                        title="Mark Completed and return vehicle to Available pool"
                      >
                        <Check className="w-3 h-3" /> Complete
                      </button>
                    )}

                    {m.status === MAINTENANCE_STATUS.COMPLETED && (
                      <span className="text-[11px] text-slate-400 italic">Closed</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
