import React from 'react';
import { Badge } from '../common/Badge';
import { formatDateTime, formatDate } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/formatters';
import { Eye, Edit3, ArrowRight, ArrowUpDown, AlertTriangle } from 'lucide-react';

export function TripTable({ trips, onView, onUpdateStatus, onSort, sortBy, sortOrder }) {
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
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('id')}
              >
                Trip ID {renderSortIndicator('id')}
              </th>
              <th className="py-3.5 px-4">Origin → Destination</th>
              <th className="py-3.5 px-4">Assigned Vehicle</th>
              <th className="py-3.5 px-4">Assigned Driver</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('plannedStart')}
              >
                Planned Start {renderSortIndicator('plannedStart')}
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('distanceKm')}
              >
                Distance {renderSortIndicator('distanceKm')}
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {trips.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                  {t.id}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{t.origin}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span>{t.destination}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{t.cargoLoad}</span>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                  {t.vehicleReg}
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                  {t.driverName}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {formatDateTime(t.plannedStart)}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                  {formatDistance(t.distanceKm)}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    <Badge variant={t.status} dot />
                    {t.isDelayed && (
                      <span title="Trip delayed" className="text-amber-500">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onView(t)}
                      className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Inspect Trip & Route"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onUpdateStatus(t)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Update Trip Status"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
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
