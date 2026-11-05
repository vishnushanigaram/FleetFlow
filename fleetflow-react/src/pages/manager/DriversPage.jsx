import React, { useState, useEffect, useMemo } from 'react';
import { driverService } from '../../services/driverService';
import { DriverTable } from '../../components/drivers/DriverTable';
import { DriverCard } from '../../components/drivers/DriverCard';
import { DriverFormModal } from '../../components/drivers/DriverFormModal';
import { DriverProfileModal } from '../../components/drivers/DriverProfileModal';
import { DriverLeaderboard } from '../../components/analytics/DriverLeaderboard';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { TableSkeleton, CardSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV } from '../../utils/exportCsv';
import { DRIVER_STATUS } from '../../utils/constants';
import { Plus, LayoutGrid, List, Users, Trophy } from 'lucide-react';

export function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'

  // Search & Filter
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sorting
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDriver, setProfileDriver] = useState(null);
  const [deactivateConfirmOpen, setDeactivateConfirmOpen] = useState(false);
  const [driverToDeactivate, setDriverToDeactivate] = useState(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data = await driverService.getAll({
        search: debouncedSearch,
        status: statusFilter,
        sortBy,
        sortOrder
      });
      setDrivers(data);
    } catch (err) {
      console.error('Failed to load drivers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [debouncedSearch, statusFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    if (selectedDriver) {
      await driverService.update(selectedDriver.id, formData);
    } else {
      await driverService.create(formData);
    }
    fetchDrivers();
  };

  const handleDeactivateConfirm = async () => {
    if (!driverToDeactivate) return;
    setDeactivateLoading(true);
    try {
      await driverService.deactivate(driverToDeactivate.id);
      setDeactivateConfirmOpen(false);
      fetchDrivers();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeactivateLoading(false);
    }
  };

  const totalItems = drivers.length;
  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return drivers.slice(start, start + pageSize);
  }, [drivers, currentPage, pageSize]);

  const activeFilters = [];
  if (statusFilter !== 'ALL') {
    activeFilters.push({ label: 'Status', value: statusFilter, onRemove: () => setStatusFilter('ALL') });
  }

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const handleExport = () => {
    exportToCSV(drivers, `fleetflow-drivers-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Commercial Driver Pool & Compliance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor commercial driver license (CDL) validity, safety indices, and mission assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Trophy}
            onClick={() => setShowLeaderboard(!showLeaderboard)}
          >
            {showLeaderboard ? 'Hide Leaderboard' : 'Safety Leaderboard'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setSelectedDriver(null);
              setFormOpen(true);
            }}
          >
            Register Driver
          </Button>
        </div>
      </div>

      {/* Driver Leaderboard Drawer */}
      {showLeaderboard && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <DriverLeaderboard drivers={drivers} />
        </div>
      )}

      {/* Search & Filter Bar */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search drivers by full name, license number, or phone..."
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
          <option value="ALL">All Availability</option>
          {Object.values(DRIVER_STATUS).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white dark:bg-slate-900 shadow-xs text-brand-600' : 'text-slate-500'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-1.5 rounded-md ${viewMode === 'card' ? 'bg-white dark:bg-slate-900 shadow-xs text-brand-600' : 'text-slate-500'}`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </SearchFilterBar>

      {/* Main List Area */}
      {loading ? (
        viewMode === 'table' ? <TableSkeleton rows={6} cols={8} /> : <CardSkeleton count={6} />
      ) : drivers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No drivers matching criteria"
          description="Try broadening your search or registering a new commercial driver."
          actionLabel="Register New Driver"
          onAction={() => {
            setSelectedDriver(null);
            setFormOpen(true);
          }}
        />
      ) : viewMode === 'table' ? (
        <DriverTable
          drivers={paginatedDrivers}
          onView={(d) => { setProfileDriver(d); setProfileOpen(true); }}
          onEdit={(d) => { setSelectedDriver(d); setFormOpen(true); }}
          onDeactivate={(d) => { setDriverToDeactivate(d); setDeactivateConfirmOpen(true); }}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedDrivers.map(d => (
            <DriverCard
              key={d.id}
              driver={d}
              onView={(drv) => { setProfileDriver(drv); setProfileOpen(true); }}
              onEdit={(drv) => { setSelectedDriver(drv); setFormOpen(true); }}
              onDeactivate={(drv) => { setDriverToDeactivate(drv); setDeactivateConfirmOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && drivers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Create / Edit Modal */}
      <DriverFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
        driver={selectedDriver}
        existingDrivers={drivers}
      />

      {/* Driver Profile Dossier Modal */}
      <DriverProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        driver={profileDriver}
      />

      {/* Deactivate Driver Confirmation */}
      <ConfirmDialog
        isOpen={deactivateConfirmOpen}
        onClose={() => setDeactivateConfirmOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Confirm Driver Deactivation"
        message={`Are you sure you want to deactivate ${driverToDeactivate?.name}? Drivers currently on active trips cannot be deactivated.`}
        confirmText="Deactivate Driver"
        loading={deactivateLoading}
      />
    </div>
  );
}
