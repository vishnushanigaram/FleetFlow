import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/analytics/StatCard';
import { StatusBreakdownChart, TrendBarChart } from '../../components/analytics/MetricCharts';
import { UtilizationGauge } from '../../components/analytics/UtilizationGauge';
import { DriverLeaderboard } from '../../components/analytics/DriverLeaderboard';
import { Button } from '../../components/common/Button';
import { exportToCSV } from '../../utils/exportCsv';
import { formatCurrency, formatDistance, formatNumber } from '../../utils/formatters';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  TrendingUp, 
  Truck, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Layers 
} from 'lucide-react';

export function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d'); // '7d' | '30d' | '90d' | '1y'

  useEffect(() => {
    analyticsService.getReportsData()
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [dateRange]);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
        Aggregating operational analytics and KPI signals...
      </div>
    );
  }

  const { metrics, vehicles, drivers, trips, deliveries, maintenance, fuel } = data;

  const handleExportFullReport = () => {
    const reportSummary = [
      { Metric: 'Total Operable Vehicles', Value: metrics.vehicles.total },
      { Metric: 'Active Fleet Utilization Rate', Value: `${metrics.vehicles.utilizationPercentage}%` },
      { Metric: 'Total Active Trips', Value: metrics.trips.active },
      { Metric: 'On-Time Delivery Success Rate', Value: `${metrics.deliveries.onTimeRate}%` },
      { Metric: 'Total Fuel Spend ($)', Value: metrics.fuel.totalSpend },
      { Metric: 'Total Maintenance Spend ($)', Value: metrics.maintenance.totalCost },
      { Metric: 'Commercial Drivers on Duty', Value: metrics.drivers.onTrip }
    ];
    exportToCSV(reportSummary, `fleetflow-executive-kpi-${dateRange}-${Date.now()}.csv`);
  };

  const deliveryStatusData = [
    { label: 'Delivered', count: metrics.deliveries.delivered, color: 'bg-emerald-500' },
    { label: 'In Transit', count: metrics.deliveries.inTransit, color: 'bg-blue-500' },
    { label: 'Pending', count: metrics.deliveries.pending, color: 'bg-amber-500' },
    { label: 'Delayed', count: metrics.deliveries.delayed, color: 'bg-rose-500' }
  ];

  const tripStatusData = [
    { label: 'Completed', count: metrics.trips.completed, color: 'bg-emerald-500' },
    { label: 'In Transit', count: metrics.trips.inTransit, color: 'bg-blue-500' },
    { label: 'Delayed', count: metrics.trips.delayed, color: 'bg-amber-500' },
    { label: 'Planned / Assigned', count: metrics.trips.active - metrics.trips.inTransit, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Operational Intelligence & KPI Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holistic performance breakdown across vehicles, fuel economy, driver ratings, and SLA delivery benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range picker filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  dateRange === range
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportFullReport}
          >
            Export Report CSV
          </Button>
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="On-Time Delivery Rate"
          value={`${metrics.deliveries.onTimeRate}%`}
          subvalue={`${metrics.deliveries.delivered} fulfilled • ${metrics.deliveries.delayed} delayed`}
          icon={CheckCircle2}
          color="emerald"
          trend="+2.1% SLA"
        />

        <StatCard
          title="Fleet Utilization Rate"
          value={`${metrics.vehicles.utilizationPercentage}%`}
          subvalue={`${metrics.vehicles.onTrip + metrics.vehicles.assigned} active of ${metrics.vehicles.total} units`}
          icon={Truck}
          color="brand"
          trend="+5.4% efficiency"
        />

        <StatCard
          title="Total Operating Fuel Spend"
          value={formatCurrency(metrics.fuel.totalSpend)}
          subvalue={`Avg $${metrics.fuel.avgPricePerUnit} / Liter dispensed`}
          icon={TrendingUp}
          color="amber"
        />

        <StatCard
          title="Service & Maintenance Costs"
          value={formatCurrency(metrics.maintenance.totalCost)}
          subvalue={`${metrics.maintenance.pending} open work orders`}
          icon={ShieldAlert}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TrendBarChart title="Historical Trip & Consignment Throughput" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatusBreakdownChart
              data={deliveryStatusData}
              title="Deliveries by SLA Stage"
            />
            <StatusBreakdownChart
              data={tripStatusData}
              title="Transport Missions by Status"
            />
          </div>
        </div>

        <div className="space-y-6">
          <UtilizationGauge
            percentage={metrics.vehicles.utilizationPercentage}
            title="Capacity Utilization Gauge"
          />

          <DriverLeaderboard drivers={drivers} />
        </div>
      </div>
    </div>
  );
}
