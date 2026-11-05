import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { tripService } from '../../services/tripService';
import { StatCard } from '../../components/analytics/StatCard';
import { UtilizationGauge } from '../../components/analytics/UtilizationGauge';
import { StatusBreakdownChart, TrendBarChart } from '../../components/analytics/MetricCharts';
import { LiveRouteMap } from '../../components/trips/LiveRouteMap';
import { MetricSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDistance } from '../../utils/formatters';
import { formatRelativeTime, formatDate } from '../../utils/dateUtils';
import { 
  Truck, 
  Users, 
  Compass, 
  Wrench, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Download,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ManagerDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [activeTrips, setActiveTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, trips] = await Promise.all([
        analyticsService.getDashboardMetrics(),
        tripService.getAll({ status: 'In Transit' })
      ]);
      setMetrics(m);
      setActiveTrips(trips);
      if (trips.length > 0) {
        setSelectedTrip(trips[0]);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <MetricSkeleton />
      </div>
    );
  }

  // Distribution chart data
  const vehicleDistribution = [
    { label: 'On Trip', count: metrics.vehicles.onTrip, color: 'bg-brand-600' },
    { label: 'Available', count: metrics.vehicles.available, color: 'bg-emerald-500' },
    { label: 'Assigned', count: metrics.vehicles.assigned, color: 'bg-purple-500' },
    { label: 'Maintenance', count: metrics.vehicles.underMaintenance, color: 'bg-amber-500' },
    { label: 'Inactive', count: metrics.vehicles.inactive, color: 'bg-slate-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Operational Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Fleet Operations Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time logistical telemetry, asset allocation & KPI metrics calculated dynamically from data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/analytics')}
          >
            Analytics & Reports
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/operations/planning')}
          >
            Dispatch Trip
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid (Section 8 Requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Fleet Vehicles"
          value={metrics.vehicles.total}
          subvalue={`${metrics.vehicles.available} Available • ${metrics.vehicles.onTrip} In Transit`}
          icon={Truck}
          color="brand"
          onClick={() => navigate('/vehicles')}
          trend="+4.2% YoY"
        />

        <StatCard
          title="Active Missions / Trips"
          value={metrics.trips.active}
          subvalue={`${metrics.trips.completed} Completed • ${metrics.trips.delayed} Delayed`}
          icon={Compass}
          color="emerald"
          onClick={() => navigate('/trips')}
          trend={`${metrics.deliveries.onTimeRate}% On-time`}
        />

        <StatCard
          title="Active Drivers Pool"
          value={metrics.drivers.total}
          subvalue={`${metrics.drivers.available} Available • ${metrics.drivers.onTrip} On Duty`}
          icon={Users}
          color="purple"
          onClick={() => navigate('/drivers')}
        />

        <StatCard
          title="Maintenance & Fuel"
          value={metrics.maintenance.pending}
          subvalue={`${metrics.maintenance.overdue} Overdue • ${formatCurrency(metrics.fuel.totalSpend)} Fuel`}
          icon={Wrench}
          color={metrics.maintenance.overdue > 0 ? 'rose' : 'amber'}
          onClick={() => navigate('/maintenance')}
        />
      </div>

      {/* Live Route Telemetry & Fleet Utilization Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Highway Telemetry & Active Vehicle Position
            </h3>
            <button
              onClick={() => navigate('/tracking')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Full Interactive Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <LiveRouteMap
            activeTrip={selectedTrip}
            allActiveTrips={activeTrips}
            onSelectTrip={(t) => setSelectedTrip(t)}
          />
        </div>

        <div className="space-y-6">
          <UtilizationGauge
            percentage={metrics.vehicles.utilizationPercentage}
            title="Operable Fleet Utilization"
          />

          {/* Quick Critical Alerts Widget */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Operational Alerts & Attention
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>

            <div className="space-y-2 text-xs">
              {metrics.maintenance.overdue > 0 && (
                <div 
                  onClick={() => navigate('/maintenance')}
                  className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> {metrics.maintenance.overdue} Service Overdue
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}

              {metrics.trips.delayed > 0 && (
                <div 
                  onClick={() => navigate('/trips')}
                  className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-4 h-4 text-amber-600" /> {metrics.trips.delayed} Active Trip Delayed
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}

              <div 
                onClick={() => navigate('/vehicles')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
              >
                <span>Document Expiry Watch (17d)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown & Recent Activities Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusBreakdownChart
          data={vehicleDistribution}
          title="Fleet Asset Allocation Status"
        />

        <TrendBarChart />
      </div>

      {/* Recent Operational Activity Feed (Section 8 Requirement) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Recent Operational Activity Log
          </h4>
          <span className="text-xs text-slate-400">Real-time Stream</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {metrics.recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  act.type === 'TRIP'
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400'
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                }`}>
                  {act.type === 'TRIP' ? <Compass className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{act.title}</p>
                  <p className="text-[11px] text-slate-400">{act.description}</p>
                </div>
              </div>

              <div className="text-right">
                <Badge variant={act.status} size="sm" dot />
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  {formatRelativeTime(act.time)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
