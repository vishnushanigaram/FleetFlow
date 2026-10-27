import React from 'react';
import { Badge } from '../common/Badge';
import { Truck, Gauge, Fuel, ShieldCheck, AlertTriangle, ArrowRight, Eye, Edit3, Trash2 } from 'lucide-react';
import { formatNumber, formatDistance } from '../../utils/formatters';
import { isExpiringSoon, isPastDate } from '../../utils/dateUtils';

export function VehicleCard({ vehicle, onView, onEdit, onDelete }) {
  // Check if any document has an expiry alert
  const hasDocWarning = vehicle.documents?.some(d => isExpiringSoon(d.expiryDate) || isPastDate(d.expiryDate));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-wide">
                {vehicle.registrationNo}
              </span>
              {hasDocWarning && (
                <span title="Document expiring soon or past expiry" className="text-amber-500">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {vehicle.model} • {vehicle.year || 2023}
            </p>
          </div>
          <Badge variant={vehicle.status} dot />
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-100 dark:border-slate-800/80 my-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{vehicle.type}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Gauge className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{formatDistance(vehicle.odometer)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Fuel className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{vehicle.fuelType} ({vehicle.currentFuelLevel || 80}%)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{formatNumber(vehicle.capacity)} kg max</span>
          </div>
        </div>

        {/* Assignment info */}
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Driver: </span>
          {vehicle.assignedDriverName ? (
            <span className="text-brand-600 dark:text-brand-400 font-medium">
              {vehicle.assignedDriverName}
            </span>
          ) : (
            <span className="italic text-slate-400">Unassigned</span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onView(vehicle)}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1 group-hover:underline"
        >
          <Eye className="w-3.5 h-3.5" /> Full Details & Docs
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(vehicle)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Vehicle"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(vehicle)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Vehicle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
