import React, { useState, useEffect } from 'react';
import { driverService } from '../../services/driverService';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { formatDate, isExpiringSoon, isPastDate, getDaysRemaining } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/formatters';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Award, 
  Star, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2,
  Truck 
} from 'lucide-react';

export function DriverProfilePage() {
  const { user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const driverId = user?.driverId || 'DRV-1001';

  useEffect(() => {
    driverService.getById(driverId)
      .then(d => setDriver(d))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [driverId]);

  if (loading || !driver) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading driver credentials...</div>;
  }

  const isExpired = isPastDate(driver.licenseExpiry);
  const isExpiring = isExpiringSoon(driver.licenseExpiry);
  const daysLeft = getDaysRemaining(driver.licenseExpiry);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Driver Profile & Commercial Licensing
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Verified Commercial Driver License (CDL), safety records, and telematics scorecard.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={driver.avatar}
          alt={driver.name}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-brand-500/20"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {driver.name}
              </h2>
              <p className="text-xs text-slate-400">
                Driver Badge: {driver.id} • {driver.experienceYears} Years Commercial Experience
              </p>
            </div>
            <Badge variant={driver.status} size="lg" dot />
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {driver.contact}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {driver.email}
            </span>
            <span className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" /> {driver.rating} Rating
            </span>
          </div>
        </div>
      </div>

      {/* Commercial License Status Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isExpired
          ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900'
          : isExpiring
          ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900'
          : 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-5 h-5 ${
              isExpired ? 'text-rose-600' : isExpiring ? 'text-amber-600' : 'text-emerald-600'
            }`} />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Commercial Driver License (CDL) Credentials
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
            License Number: <strong>{driver.licenseNumber}</strong> • Class: {driver.licenseCategory}
          </p>
        </div>

        <div className="text-left sm:text-right text-xs">
          <span className="text-slate-500 block">Expiration Date: {formatDate(driver.licenseExpiry)}</span>
          {isExpired && (
            <span className="text-rose-600 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5" /> EXPIRED LICENSE
            </span>
          )}
          {!isExpired && isExpiring && (
            <span className="text-amber-600 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Renew within {daysLeft} days
            </span>
          )}
          {!isExpired && !isExpiring && (
            <span className="text-emerald-600 font-medium flex items-center sm:justify-end gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Active
            </span>
          )}
        </div>
      </div>

      {/* Safety & Performance Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Completed Missions</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{driver.completedTrips}</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Safety Index</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{driver.safetyScore}%</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Distance Logged</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{formatDistance(driver.totalDistance || 0)}</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Delayed Shipments</span>
          <p className="text-xl font-black text-slate-700 dark:text-slate-300 mt-1">{driver.delayedTrips}</p>
        </div>
      </div>
    </div>
  );
}
