import React from 'react';
import { Badge } from '../common/Badge';
import { formatDateTime, formatDate } from '../../utils/dateUtils';
import { Eye, CheckCircle2, ShieldAlert, ArrowUpDown, ArrowRight, Package } from 'lucide-react';

export function DeliveryTable({
  deliveries,
  onView,
  onRecordPOD,
  onCorrectStatus,
  onSort,
  sortBy,
  sortOrder
}) {
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
                onClick={() => onSort('trackingId')}
              >
                Tracking Number {renderSortIndicator('trackingId')}
              </th>
              <th className="py-3.5 px-4">Recipient & Goods</th>
              <th className="py-3.5 px-4">Route Corridors</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('priority')}
              >
                Priority {renderSortIndicator('priority')}
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('eta')}
              >
                ETA {renderSortIndicator('eta')}
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {deliveries.map((del) => {
              const isDelivered = del.status === 'Delivered';

              return (
                <tr key={del.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      {del.trackingId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{del.recipient}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{del.itemsDescription}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <span>{del.origin.split(',')[0]}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>{del.destination.split(',')[0]}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={del.priority} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={del.status} dot />
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {formatDateTime(del.eta)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onView(del)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Delivery Timeline & History"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {!isDelivered ? (
                        <button
                          onClick={() => onRecordPOD(del)}
                          className="px-2.5 py-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg hover:bg-emerald-100 transition-colors font-medium flex items-center gap-1"
                          title="Record Proof of Delivery"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> POD
                        </button>
                      ) : (
                        <button
                          onClick={() => onCorrectStatus(del)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Authorized Status Correction Protocol"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      )}
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
