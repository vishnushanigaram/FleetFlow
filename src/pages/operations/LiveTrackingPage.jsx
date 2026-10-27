import React, { useState, useEffect } from 'react';
import { tripService } from '../../services/tripService';
import { LiveRouteMap } from '../../components/trips/LiveRouteMap';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDistance } from '../../utils/formatters';
import { formatDateTime } from '../../utils/dateUtils';
import { MapPin, Navigation, Compass, Truck, User, ArrowRight } from 'lucide-react';

export function LiveTrackingPage() {
  const [activeTrips, setActiveTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.getAll().then(all => {
      const active = all.filter(t => t.status === 'In Transit' || t.status === 'Delayed' || t.status === 'Assigned');
      setActiveTrips(active);
      if (active.length > 0) {
        setSelectedTrip(active[0]);
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Live GPS Highway Tracking & Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time simulated vehicle movements, highway velocity, and corridor waypoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            {activeTrips.length} Active Vehicles Streaming
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Connecting to vehicle GPS telematics gateways...
        </div>
      ) : (
        <div className="space-y-6">
          <LiveRouteMap
            activeTrip={selectedTrip}
            allActiveTrips={activeTrips}
            onSelectTrip={(t) => setSelectedTrip(t)}
          />

          {/* Active Missions Selector Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Active Transit Missions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTrips.map(t => {
                const isSelected = selectedTrip?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrip(t)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                        {t.id} • {t.vehicleReg}
                      </span>
                      <Badge variant={t.status} size="sm" dot />
                    </div>

                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {t.origin.split('(')[0]} → {t.destination.split('(')[0]}
                    </p>

                    <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Pilot: {t.driverName}</span>
                      <span>{t.progressPercent || 50}% progress</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
