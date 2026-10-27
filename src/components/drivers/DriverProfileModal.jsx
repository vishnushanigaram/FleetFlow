import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { driverService } from '../../services/driverService';
import { formatDate, isExpiringSoon, isPastDate, getDaysRemaining } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/formatters';
import { 
  Star, 
  ShieldCheck, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle2, 
  Compass, 
  Clock 
} from 'lucide-react';

export function DriverProfileModal({ isOpen, onClose, driver }) {
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);

  useEffect(() => {
    if (driver && isOpen) {
      setLoadingTrips(true);
      driverService.getDriverTrips(driver.id)
        .then(res => setTrips(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingTrips(false));
    }
  }, [driver, isOpen]);

  if (!driver) return null;

  const isExpired = isPastDate(driver.licenseExpiry);
  const isExpiring = isExpiringSoon(driver.licenseExpiry);
  const daysLeft = getDaysRemaining(driver.licenseExpiry);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Driver Dossier & Performance Audit"
      maxWidth="max-w-3xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Dossier
        </Button>
      }
    >
      <div className="space-y-6 text-xs">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
          <img
            src={driver.avatar}
            alt={driver.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-brand-500/20"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {driver.name}
                </h4>
                <p className="text-slate-400 text-xs">
                  ID: {driver.id} • {driver.licenseCategory}
                </p>
              </div>
              <Badge variant={driver.status} size="lg" dot />
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {driver.contact}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {driver.email}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" /> {driver.rating} Rating
              </span>
            </div>
          </div>
        </div>

        {/* License Verification Card */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isExpired
            ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900'
            : isExpiring
            ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900'
            : 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-4 h-4 ${
                isExpired ? 'text-rose-600' : isExpiring ? 'text-amber-600' : 'text-emerald-600'
              }`} />
              <span className="font-bold text-slate-900 dark:text-white">
                Commercial Driver License (CDL)
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-mono mt-1">
              Number: <strong>{driver.licenseNumber}</strong> • Class: {driver.licenseCategory}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-slate-500 block">Valid Until: {formatDate(driver.licenseExpiry)}</span>
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

        {/* KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-slate-400">Completed Trips</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {driver.completedTrips}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-slate-400">Safety Score</span>
            <p className="text-lg font-bold text-emerald-600 mt-1">
              {driver.safetyScore}%
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-slate-400">Delayed Trips</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {driver.delayedTrips}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-slate-400">Logged Distance</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {formatDistance(driver.totalDistance || 0)}
            </p>
          </div>
        </div>

        {/* Assigned Trips History */}
        <div>
          <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-brand-600" /> Assignment & Trip Log ({trips.length})
          </h5>

          {loadingTrips ? (
            <p className="text-slate-400 py-3">Loading history...</p>
          ) : trips.length === 0 ? (
            <p className="text-slate-400 py-4 text-center italic">No trip missions assigned yet.</p>
          ) : (
            <div className="space-y-2">
              {trips.map(t => (
                <div key={t.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{t.id}</span>
                    <p className="text-slate-500 text-[11px]">{t.origin} → {t.destination}</p>
                    <span className="text-slate-400 text-[10px]">Vehicle: {t.vehicleReg}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant={t.status} size="sm" />
                    <span className="block text-[10px] text-slate-400 mt-1">{formatDate(t.plannedStart)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
