import React from 'react';
import { Badge } from '../common/Badge';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/formatters';
import { 
  MapPin, 
  Truck, 
  User, 
  Calendar, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  Navigation, 
  Edit3, 
  Eye 
} from 'lucide-react';

export function TripCard({ trip, onView, onUpdateStatus }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
              {trip.id}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {trip.cargoLoad}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {trip.isDelayed && (
              <Badge variant="Delayed" size="sm" dot />
            )}
            <Badge variant={trip.status} dot />
          </div>
        </div>

        {/* Origin / Destination Stepper */}
        <div className="relative pl-6 space-y-3 my-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          <div className="relative">
            <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-brand-100 dark:ring-brand-950" />
            <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
              {trip.origin}
            </p>
            <span className="text-[10px] text-slate-400">Planned: {formatDateTime(trip.plannedStart)}</span>
          </div>

          <div className="relative">
            <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-950" />
            <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
              {trip.destination}
            </p>
            <span className="text-[10px] text-slate-400">ETA: {formatDateTime(trip.estimatedArrival)}</span>
          </div>
        </div>

        {/* Progress Bar (if in transit) */}
        {trip.status === 'In Transit' || trip.status === 'Delayed' ? (
          <div className="my-3">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-brand-500 animate-pulse" /> {trip.currentSpeed || 60} km/h
              </span>
              <span className="font-bold text-brand-600">{trip.progressPercent || 50}% completed</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  trip.isDelayed ? 'bg-amber-500' : 'bg-brand-600'
                }`}
                style={{ width: `${trip.progressPercent || 50}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* Vehicle & Driver Pairing */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 my-2 text-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Vehicle</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                {trip.vehicleReg}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Driver</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                {trip.driverName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
        <button
          onClick={() => onView(trip)}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1 group-hover:underline"
        >
          <Eye className="w-3.5 h-3.5" /> Route Details
        </button>

        <button
          onClick={() => onUpdateStatus(trip)}
          className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
        >
          <Edit3 className="w-3 h-3" /> Update Status
        </button>
      </div>
    </div>
  );
}
