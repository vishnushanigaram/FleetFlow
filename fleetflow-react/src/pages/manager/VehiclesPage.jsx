import React, { useState, useEffect, useMemo } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { VehicleTable } from '../../components/vehicles/VehicleTable';
import { VehicleCard } from '../../components/vehicles/VehicleCard';
import { VehicleFormModal } from '../../components/vehicles/VehicleFormModal';
import { VehicleDetailsModal } from '../../components/vehicles/VehicleDetailsModal';
import { VehicleComparisonModal } from '../../components/vehicles/VehicleComparisonModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { TableSkeleton, CardSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV } from '../../utils/exportCsv';
import { VEHICLE_TYPES, FUEL_TYPES, VEHICLE_STATUS } from '../../utils/constants';
import { 
  Plus, 
  LayoutGrid, 
  List, 
  Truck, 
  Scale, 
  Download,
  Filter 
} from 'lucide-react';

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'

  // Search & Filter state (Section 20)
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [fuelFilter, setFuelFilter] = useState('ALL');

  // Sorting
  const [sortBy, setSortBy] = useState('registrationNo');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailVehicle, setDetailVehicle] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAll({
        search: debouncedSearch,
        status: statusFilter,
        type: typeFilter,
        fuelType: fuelFilter,
        sortBy,
        sortOrder
      });
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [debouncedSearch, statusFilter, typeFilter, fuelFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    if (selectedVehicle) {
      await vehicleService.update(selectedVehicle.id, formData);
    } else {
      await vehicleService.create(formData);
    }
    fetchVehicles();
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;
    setDeleteLoading(true);
    try {
      await vehicleService.delete(vehicleToDelete.id);
      setDeleteConfirmOpen(false);
      fetchVehicles();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddDocument = async (vehicleId, doc) => {
    await vehicleService.addDocument(vehicleId, doc);
    fetchVehicles();
    // Refresh detailed vehicle
    const updated = await vehicleService.getById(vehicleId);
    setDetailVehicle(updated);
  };

  // Pagination slicing
  const totalItems = vehicles.length;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return vehicles.slice(start, start + pageSize);
  }, [vehicles, currentPage, pageSize]);

  // Active filters list for filter chips
  const activeFilters = [];
  if (statusFilter !== 'ALL') {
    activeFilters.push({ label: 'Status', value: statusFilter, onRemove: () => setStatusFilter('ALL') });
  }
  if (typeFilter !== 'ALL') {
    activeFilters.push({ label: 'Type', value: typeFilter, onRemove: () => setTypeFilter('ALL') });
  }
  if (fuelFilter !== 'ALL') {
    activeFilters.push({ label: 'Fuel', value: fuelFilter, onRemove: () => setFuelFilter('ALL') });
  }

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setFuelFilter('ALL');
    setCurrentPage(1);
  };

  const handleExport = () => {
    exportToCSV(vehicles, `fleetflow-vehicles-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Vehicle & Fleet Asset Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Maintain transport inventory, track telematics, document compliance, and payload capacities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {vehicles.length >= 2 && (
            <Button
              variant="secondary"
              size="sm"
              icon={Scale}
              onClick={() => setComparisonOpen(true)}
              title="Side-by-side vehicle comparison"
            >
              Compare Assets
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setSelectedVehicle(null);
              setFormOpen(true);
            }}
          >
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Search, Filter Bar and View Controls */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by registration plate, model, or type..."
        filters={activeFilters}
        activeFiltersCount={activeFilters.length}
        onResetFilters={handleResetFilters}
        onExportCsv={handleExport}
      >
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Statuses</option>
          {Object.values(VEHICLE_STATUS).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Types</option>
          {VEHICLE_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Fuel Filter */}
        <select
          value={fuelFilter}
          onChange={(e) => { setFuelFilter(e.target.value); setCurrentPage(1); }}
          className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Fuels</option>
          {FUEL_TYPES.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* View mode toggle (Table / Card) */}
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

      {/* Main Content Area */}
      {loading ? (
        viewMode === 'table' ? <TableSkeleton rows={6} cols={8} /> : <CardSkeleton count={6} />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No vehicles found"
          description="Try adjusting your search criteria, clearing filter chips, or adding a new commercial vehicle."
          actionLabel="Add New Vehicle"
          onAction={() => {
            setSelectedVehicle(null);
            setFormOpen(true);
          }}
        />
      ) : viewMode === 'table' ? (
        <VehicleTable
          vehicles={paginatedVehicles}
          onView={(v) => { setDetailVehicle(v); setDetailsOpen(true); }}
          onEdit={(v) => { setSelectedVehicle(v); setFormOpen(true); }}
          onDelete={(v) => { setVehicleToDelete(v); setDeleteConfirmOpen(true); }}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedVehicles.map(v => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onView={(veh) => { setDetailVehicle(veh); setDetailsOpen(true); }}
              onEdit={(veh) => { setSelectedVehicle(veh); setFormOpen(true); }}
              onDelete={(veh) => { setVehicleToDelete(veh); setDeleteConfirmOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && vehicles.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Create / Edit Modal */}
      <VehicleFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
        vehicle={selectedVehicle}
        existingVehicles={vehicles}
      />

      {/* Vehicle Full Dossier & Compliance Document Modal */}
      <VehicleDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        vehicle={detailVehicle}
        onAddDocument={handleAddDocument}
      />

      {/* Side-by-side Vehicle Comparison Modal (Bonus Feature) */}
      <VehicleComparisonModal
        isOpen={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        vehicles={vehicles}
      />

      {/* Delete / Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Vehicle Decommissioning"
        message={`Are you sure you want to delete vehicle ${vehicleToDelete?.registrationNo}? Active on-trip vehicles cannot be deleted.`}
        confirmText="Confirm Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
