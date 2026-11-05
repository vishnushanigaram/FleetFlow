import React, { useState, useEffect, useMemo } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import { vehicleService } from '../../services/vehicleService';
import { MaintenanceTable } from '../../components/maintenance/MaintenanceTable';
import { CreateMaintenanceModal } from '../../components/maintenance/CreateMaintenanceModal';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV } from '../../utils/exportCsv';
import { MAINTENANCE_STATUS, SERVICE_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Wrench, Plus, AlertTriangle, CheckCircle2, Clock, DollarSign } from 'lucide-react';

export function MaintenancePage() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('ALL');

  // Sorting
  const [sortBy, setSortBy] = useState('scheduledDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mList, vList] = await Promise.all([
        maintenanceService.getAll({
          search: debouncedSearch,
          status: statusFilter,
          serviceType: serviceTypeFilter,
          sortBy,
          sortOrder
        }),
        vehicleService.getAll()
      ]);
      setRecords(mList);
      setVehicles(vList);
    } catch (err) {
      console.error('Failed to load maintenance records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, statusFilter, serviceTypeFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreateRecord = async (formData) => {
    await maintenanceService.create(formData);
    fetchData();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await maintenanceService.updateStatus(id, newStatus);
    fetchData();
  };

  const totalCost = records.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  const overdueCount = records.filter(r => r.status === MAINTENANCE_STATUS.OVERDUE).length;
  const inProgressCount = records.filter(r => r.status === MAINTENANCE_STATUS.IN_PROGRESS).length;

  const totalItems = records.length;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return records.slice(start, start + pageSize);
  }, [records, currentPage, pageSize]);

  const activeFilters = [];
  if (statusFilter !== 'ALL') {
    activeFilters.push({ label: 'Status', value: statusFilter, onRemove: () => setStatusFilter('ALL') });
  }
  if (serviceTypeFilter !== 'ALL') {
    activeFilters.push({ label: 'Type', value: serviceTypeFilter, onRemove: () => setServiceTypeFilter('ALL') });
  }

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setServiceTypeFilter('ALL');
    setCurrentPage(1);
  };

  const handleExport = () => {
    exportToCSV(records, `fleetflow-maintenance-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Preventive Maintenance & Service Records
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Keep fleet roadworthy. Vehicles placed in maintenance are automatically barred from trip dispatch.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Book Work Order
        </Button>
      </div>

      {/* Metric Mini Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Service Spend</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">{formatCurrency(totalCost)}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Work Orders In Progress</span>
            <p className="text-lg font-black text-blue-600">{inProgressCount} vehicles</p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Overdue Service Notice</span>
            <p className="text-lg font-black text-rose-600">{overdueCount} critical</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search maintenance tickets by vehicle, service type, or provider..."
        filters={activeFilters}
        activeFiltersCount={activeFilters.length}
        onResetFilters={handleResetFilters}
        onExportCsv={handleExport}
      >
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Statuses</option>
          {Object.values(MAINTENANCE_STATUS).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={serviceTypeFilter}
          onChange={(e) => { setServiceTypeFilter(e.target.value); setCurrentPage(1); }}
          className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Service Types</option>
          {SERVICE_TYPES.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </SearchFilterBar>

      {/* Main Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={8} />
      ) : records.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No maintenance records found"
          description="Schedule a preventive inspection or oil change to track servicing history."
          actionLabel="Book Service Record"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <MaintenanceTable
          records={paginatedRecords}
          onUpdateStatus={handleUpdateStatus}
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

      {/* Create Modal */}
      <CreateMaintenanceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateRecord}
        vehicles={vehicles}
      />
    </div>
  );
}
