import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatDateTime, formatDate } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/formatters';
import { 
  MapPin, 
  Truck, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  History,
  Package
} from 'lucide-react';

export function TripDetailsModal({ isOpen, onClose, trip }) {
  if (!trip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trip Dossier & Route Audit: ${trip.id}`}
      subtitle={`${trip.origin} → ${trip.destination}`}
      maxWidth="max-w-3xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Route Dossier
        </Button>
      }
    >
      <div className="space-y-6 text-xs">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                {trip.id}
              </span>
              <Badge variant={trip.status} size="lg" dot />
              {trip.isDelayed && <Badge variant="Delayed" size="sm" />}
            </div>
            <p className="text-slate-500 mt-1">
              Cargo: <strong className="text-slate-800 dark:text-slate-200">{trip.cargoLoad}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-slate-400 block text-[11px]">Total Distance</span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {formatDistance(trip.distanceKm)}
            </span>
          </div>
        </div>

        {/* Assigned Assets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Vehicle</span>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm">{trip.vehicleReg}</h5>
              <span className="text-slate-400 text-[11px]">ID: {trip.vehicleId}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Driver</span>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm">{trip.driverName}</h5>
              <span className="text-slate-400 text-[11px]">Driver ID: {trip.driverId}</span>
            </div>
          </div>
        </div>

        {/* Route Timings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-slate-400 block">Planned Departure</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {formatDateTime(trip.plannedStart)}
            </p>
          </div>
          <div>
            <span className="text-slate-400 block">Actual Departure</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {trip.actualStart ? formatDateTime(trip.actualStart) : 'Pending Departure'}
            </p>
          </div>
          <div>
            <span className="text-slate-400 block">Estimated Arrival (ETA)</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {formatDateTime(trip.estimatedArrival)}
            </p>
          </div>
        </div>

        {/* Status History & Chronological Timeline */}
        <div>
          <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
            <History className="w-4 h-4 text-brand-600" /> Chronological Event Timeline
          </h5>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
            {(!trip.statusHistory || trip.statusHistory.length === 0) ? (
              <p className="text-slate-400 italic">No timeline entries recorded.</p>
            ) : (
              trip.statusHistory.map((item, idx) => (
                <div key={item.id || idx} className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-white dark:ring-slate-900" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Stage: {item.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDateTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    {item.note}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Authorized by: {item.updatedBy || 'Operations Executive'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
