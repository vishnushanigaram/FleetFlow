import React, { useState, useEffect, useMemo } from 'react';
import { fuelService } from '../../services/fuelService';
import { vehicleService } from '../../services/vehicleService';
import { FuelTable } from '../../components/fuel/FuelTable';
import { CreateFuelModal } from '../../components/fuel/CreateFuelModal';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { exportToCSV } from '../../utils/exportCsv';
import { formatCurrency, formatFuel } from '../../utils/formatters';
import { Fuel, Plus, TrendingDown, DollarSign, Activity } from 'lucide-react';

export function FuelPage() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fList, vList, fMetrics] = await Promise.all([
        fuelService.getAll({ vehicleId: vehicleFilter, sortBy, sortOrder }),
        vehicleService.getAll(),
        fuelService.getFuelMetrics()
      ]);
      setRecords(fList);
      setVehicles(vList);
      setMetrics(fMetrics);
    } catch (err) {
      console.error('Failed to load fuel records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vehicleFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = async (formData) => {
    await fuelService.create(formData);
    fetchData();
  };

  const totalItems = records.length;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return records.slice(start, start + pageSize);
  }, [records, currentPage, pageSize]);

  const handleExport = () => {
    exportToCSV(records, `fleetflow-fuel-records-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Fuel Consumption & Energy Logistics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log fuel transactions, track average cost per liter/kWh, and audit vehicle consumption trends.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Log Fuel Receipt
        </Button>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Fuel Spend</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{formatCurrency(metrics.totalSpend)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Volume Dispensed</span>
              <p className="text-lg font-black text-emerald-600">{formatFuel(metrics.totalQuantity)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Fuel className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Average Unit Cost</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">${metrics.avgCostPerUnit.toFixed(2)} / L</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Vehicle-wise summary pills */}
      {metrics?.vehicleSummaries?.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Vehicle-Wise Fuel Consumption Summary
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {metrics.vehicleSummaries.map((vs, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200">{vs.vehicleReg}</span>
                <p className="text-slate-500 text-[11px] mt-0.5">{vs.fillCount} fills • {formatFuel(vs.totalQty)}</p>
                <span className="font-semibold text-brand-600">{formatCurrency(vs.totalCost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Vehicle Filter */}
      <SearchFilterBar
        search=""
        onSearchChange={() => {}}
        searchPlaceholder="Filter receipts..."
        onExportCsv={handleExport}
      >
        <select
          value={vehicleFilter}
          onChange={(e) => { setVehicleFilter(e.target.value); setCurrentPage(1); }}
          className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Fleet Vehicles</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.registrationNo} ({v.model})</option>
          ))}
        </select>
      </SearchFilterBar>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : records.length === 0 ? (
        <EmptyState
          icon={Fuel}
          title="No fuel transactions logged"
          description="Log refueling receipts to monitor fuel costs and energy consumption."
          actionLabel="Log Fuel Receipt"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <FuelTable
          records={paginatedRecords}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      )}

      {/* Pagination */}
      {!loading && records.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal */}
      <CreateFuelModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        vehicles={vehicles}
      />
    </div>
  );
}
