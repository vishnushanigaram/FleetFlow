import React, { useState, useEffect } from 'react';
import { tripService } from '../../services/tripService';
import { deliveryService } from '../../services/deliveryService';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { StatCard } from '../../components/analytics/StatCard';
import { LiveRouteMap } from '../../components/trips/LiveRouteMap';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDateTime } from '../../utils/dateUtils';
import { 
  Compass, 
  Truck, 
  Users, 
  Package, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  MapPin,
  Kanban 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OperationsDashboard() {
  const [activeTrips, setActiveTrips] = useState([]);
  const [delayedTrips, setDelayedTrips] = useState([]);
  const [availableVehiclesCount, setAvailableVehiclesCount] = useState(0);
  const [availableDriversCount, setAvailableDriversCount] = useState(0);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      tripService.getAll({ status: 'In Transit' }),
      tripService.getAll({ status: 'Delayed' }),
      vehicleService.getAll({ status: 'Available' }),
      driverService.getAll({ status: 'Available' })
    ]).then(([inTransit, delayed, vAvail, dAvail]) => {
      const allActive = [...inTransit, ...delayed];
      setActiveTrips(allActive);
      setDelayedTrips(delayed);
      setAvailableVehiclesCount(vAvail.length);
      setAvailableDriversCount(dAvail.length);
      if (allActive.length > 0) {
        setSelectedTrip(allActive[0]);
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Operations & Live Dispatch Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time highway movement, active trip telematics, route assignment & exceptions monitor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Kanban}
            onClick={() => navigate('/dispatch')}
          >
            Dispatch Board
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/operations/planning')}
          >
            New Trip Mission
          </Button>
        </div>
      </div>

      {/* Quick Ops Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Highway Missions"
          value={activeTrips.length}
          subvalue="GPS telematics streaming live"
          icon={Compass}
          color="brand"
          onClick={() => navigate('/tracking')}
        />

        <StatCard
          title="Delayed Transit Missions"
          value={delayedTrips.length}
          subvalue="Weather / Highway exceptions"
          icon={AlertTriangle}
          color={delayedTrips.length > 0 ? 'rose' : 'emerald'}
          onClick={() => navigate('/operations/planning')}
        />

        <StatCard
          title="Vehicles Ready to Dispatch"
          value={availableVehiclesCount}
          subvalue="In yard & pre-trip inspected"
          icon={Truck}
          color="emerald"
          onClick={() => navigate('/vehicles')}
        />

        <StatCard
          title="Drivers Ready for Assignment"
          value={availableDriversCount}
          subvalue="Active CDL & on standby"
          icon={Users}
          color="purple"
          onClick={() => navigate('/drivers')}
        />
      </div>

      {/* Live Route Telemetry Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Mission Telemetry Stream
          </h3>
          <button
            onClick={() => navigate('/tracking')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            Fullscreen Map <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <LiveRouteMap
          activeTrip={selectedTrip}
          allActiveTrips={activeTrips}
          onSelectTrip={(t) => setSelectedTrip(t)}
        />
      </div>

      {/* Attention Required & Delayed Trips Table */}
      {delayedTrips.length > 0 && (
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Delayed Shipments Requiring Dispatch Intervention
            </span>
            <span className="text-xs text-amber-700 font-semibold">{delayedTrips.length} Exceptions</span>
          </div>

          <div className="space-y-2 text-xs">
            {delayedTrips.map(t => (
              <div key={t.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-amber-600">{t.id}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 ml-2">{t.origin} → {t.destination}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pilot: {t.driverName} • Vehicle: {t.vehicleReg}</p>
                </div>
                <div className="text-right">
                  <Badge variant="Delayed" size="sm" dot />
                  <span className="block text-[10px] text-slate-400 mt-1">ETA: {formatDateTime(t.estimatedArrival)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
