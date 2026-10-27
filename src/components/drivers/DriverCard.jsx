import React from 'react';
import { Badge } from '../common/Badge';
import { Phone, Award, ShieldAlert, Star, AlertTriangle, Eye, Edit3, UserX, Compass } from 'lucide-react';
import { formatDate, isExpiringSoon, isPastDate } from '../../utils/dateUtils';
import { formatDistance, formatNumber } from '../../utils/formatters';

export function DriverCard({ driver, onView, onEdit, onDeactivate }) {
  const isLicenseAlert = isExpiringSoon(driver.licenseExpiry) || isPastDate(driver.licenseExpiry);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {driver.name}
                </span>
                {isLicenseAlert && (
                  <span title="License expiring or expired" className="text-amber-500">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {driver.licenseCategory} • {driver.experienceYears}y exp
              </p>
            </div>
          </div>
          <Badge variant={driver.status} dot />
        </div>

        {/* Contact & License Info */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 my-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-slate-400">License:</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{driver.licenseNumber}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-slate-400">Expiry:</span>
            <span className={`font-medium ${isLicenseAlert ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}>
              {formatDate(driver.licenseExpiry)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-slate-400">Contact:</span>
            <span>{driver.contact}</span>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-current" /> {driver.rating}
            </div>
            <span className="text-[10px] text-slate-400">Rating</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/40">
            <p className="font-bold text-slate-800 dark:text-slate-200">{driver.completedTrips}</p>
            <span className="text-[10px] text-slate-400">Completed</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/40">
            <p className="font-bold text-emerald-600">{driver.safetyScore}%</p>
            <span className="text-[10px] text-slate-400">Safety</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
        <button
          onClick={() => onView(driver)}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1 group-hover:underline"
        >
          <Eye className="w-3.5 h-3.5" /> Full Dossier
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(driver)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Driver Profile"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeactivate(driver)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Deactivate Driver"
          >
            <UserX className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
