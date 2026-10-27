import React, { useState } from 'react';
import { TRIP_STATUS } from '../../utils/constants';
import { Badge } from '../common/Badge';
import { Truck, User, ArrowRight, Clock, Plus, MoveRight } from 'lucide-react';
import { formatDistance, formatNumber } from '../../utils/formatters';
import { formatDateTime } from '../../utils/dateUtils';
import { Button } from '../common/Button';

export function DispatchBoard({ trips, onUpdateStatus, onCreateTrip, onViewTrip }) {
  const [draggedTripId, setDraggedTripId] = useState(null);

  const columns = [
    { id: TRIP_STATUS.PLANNED, label: 'Planned & Queued', color: 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50' },
    { id: TRIP_STATUS.ASSIGNED, label: 'Assigned & Staged', color: 'border-purple-300 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20' },
    { id: TRIP_STATUS.IN_TRANSIT, label: 'Active Transit', color: 'border-blue-300 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20' },
    { id: TRIP_STATUS.COMPLETED, label: 'Fulfillment Completed', color: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20' }
  ];

  const handleDragStart = (e, tripId) => {
    e.dataTransfer.setData('text/plain', tripId);
    setDraggedTripId(tripId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const tripId = e.dataTransfer.getData('text/plain') || draggedTripId;
    if (!tripId) return;

    const trip = trips.find(t => t.id === tripId);
    if (trip && trip.status !== targetStatus) {
      await onUpdateStatus(tripId, targetStatus, `Moved via Dispatch Kanban Board to ${targetStatus}`);
    }
    setDraggedTripId(null);
  };

  return (
    <div className="space-y-4">
      {/* Board Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Operations Dispatch Kanban Board
          </h3>
          <p className="text-xs text-slate-500">
            Drag cards across columns to advance dispatch workflows and synchronize driver/vehicle availability.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={onCreateTrip}>
          Create New Trip
        </Button>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTrips = trips.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl border ${col.color} p-3.5 min-h-[480px] flex flex-col transition-colors`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {colTrips.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-3">
                {colTrips.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                    Drop trips here
                  </div>
                ) : (
                  colTrips.map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, t.id)}
                      onClick={() => onViewTrip(t)}
                      className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                          {t.id}
                        </span>
                        <Badge variant={t.status} size="sm" dot />
                      </div>

                      <div className="text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {t.origin.split('(')[0]}
                        </p>
                        <div className="flex items-center text-slate-400 text-[10px] my-0.5">
                          <ArrowRight className="w-3 h-3 mx-1 text-slate-300" />
                          <span className="truncate">{t.destination.split('(')[0]}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <Truck className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{t.vehicleReg}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{t.driverName}</span>
                        </div>
                      </div>

                      {/* Quick stage transition button */}
                      {col.id === TRIP_STATUS.ASSIGNED && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(t.id, TRIP_STATUS.IN_TRANSIT, 'Departed staging hub');
                          }}
                          className="w-full mt-1 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                        >
                          Start Transit <MoveRight className="w-3 h-3" />
                        </button>
                      )}

                      {col.id === TRIP_STATUS.IN_TRANSIT && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(t.id, TRIP_STATUS.COMPLETED, 'Delivered and verified');
                          }}
                          className="w-full mt-1 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
                        >
                          Complete Trip <MoveRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
