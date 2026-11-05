import React from 'react';
import { Badge } from '../common/Badge';
import { formatNumber, formatDistance } from '../../utils/formatters';
import { isExpiringSoon, isPastDate } from '../../utils/dateUtils';
import { Eye, Edit3, Trash2, AlertTriangle, ArrowUpDown } from 'lucide-react';

export function VehicleTable({ vehicles, onView, onEdit, onDelete, onSort, sortBy, sortOrder }) {
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
                onClick={() => onSort('registrationNo')}
              >
                Reg Number {renderSortIndicator('registrationNo')}
              </th>
              <th className="py-3.5 px-4">Model & Type</th>
              <th className="py-3.5 px-4">Status</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('capacity')}
              >
                Capacity {renderSortIndicator('capacity')}
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('odometer')}
              >
                Odometer {renderSortIndicator('odometer')}
              </th>
              <th className="py-3.5 px-4">Fuel</th>
              <th className="py-3.5 px-4">Driver Assigned</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {vehicles.map((v) => {
              const hasDocWarning = v.documents?.some(d => isExpiringSoon(d.expiryDate) || isPastDate(d.expiryDate));

              return (
                <tr 
                  key={v.id} 
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{v.registrationNo}</span>
                      {hasDocWarning && (
                        <span title="Documents require attention" className="text-amber-500">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{v.model}</div>
                    <div className="text-[11px] text-slate-400">{v.type}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={v.status} dot />
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {formatNumber(v.capacity)} kg
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {formatDistance(v.odometer)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {v.fuelType}
                  </td>
                  <td className="py-3.5 px-4">
                    {v.assignedDriverName ? (
                      <span className="font-medium text-brand-600 dark:text-brand-400">
                        {v.assignedDriverName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onView(v)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Vehicle Details & Documents"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(v)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Vehicle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(v)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
