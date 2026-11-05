import React from 'react';
import { Badge } from '../common/Badge';
import { formatDate, isExpiringSoon, isPastDate } from '../../utils/dateUtils';
import { Eye, Edit3, UserX, Star, AlertTriangle, ArrowUpDown } from 'lucide-react';

export function DriverTable({ drivers, onView, onEdit, onDeactivate, onSort, sortBy, sortOrder }) {
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
                onClick={() => onSort('name')}
              >
                Driver Name {renderSortIndicator('name')}
              </th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">License / Class</th>
              <th className="py-3.5 px-4">Status</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('rating')}
              >
                Rating {renderSortIndicator('rating')}
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('completedTrips')}
              >
                Completed Trips {renderSortIndicator('completedTrips')}
              </th>
              <th className="py-3.5 px-4">Safety Score</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {drivers.map((d) => {
              const isAlert = isExpiringSoon(d.licenseExpiry) || isPastDate(d.licenseExpiry);

              return (
                <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={d.avatar} alt={d.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                          <span>{d.name}</span>
                          {isAlert && (
                            <span title="License expiring or expired" className="text-amber-500">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{d.id} • {d.experienceYears}y exp</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <div>{d.contact}</div>
                    <div className="text-[10px] text-slate-400">{d.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-800 dark:text-slate-200 font-medium">{d.licenseNumber}</div>
                    <div className={`text-[10px] ${isAlert ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                      Exp: {formatDate(d.licenseExpiry)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={d.status} dot />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" /> {d.rating}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {d.completedTrips}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-600">{d.safetyScore}%</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onView(d)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(d)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Driver"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeactivate(d)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Deactivate Driver"
                      >
                        <UserX className="w-4 h-4" />
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
