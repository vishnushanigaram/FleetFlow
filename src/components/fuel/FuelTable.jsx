import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency, formatDistance, formatFuel } from '../../utils/formatters';
import { Fuel, ArrowUpDown } from 'lucide-react';

export function FuelTable({ records, onSort, sortBy, sortOrder }) {
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
              <th className="py-3.5 px-4">Receipt / ID</th>
              <th className="py-3.5 px-4">Vehicle</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('date')}
              >
                Refuel Date {renderSortIndicator('date')}
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('quantity')}
              >
                Volume (L / kWh) {renderSortIndicator('quantity')}
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => onSort('cost')}
              >
                Total Cost {renderSortIndicator('cost')}
              </th>
              <th className="py-3.5 px-4">Odometer</th>
              <th className="py-3.5 px-4">Fuel Station Terminal</th>
              <th className="py-3.5 px-4">Logged Driver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                  {f.id}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {f.vehicleReg}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {formatDate(f.date)}
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                  {formatFuel(f.quantity)} ({f.fuelType})
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {formatCurrency(f.cost)}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {formatDistance(f.odometer)}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {f.station}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {f.driverName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
