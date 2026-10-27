import React, { useState, useEffect, useMemo } from 'react';
import { tripService } from '../../services/tripService';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { TripTable } from '../../components/trips/TripTable';
import { TripCard } from '../../components/trips/TripCard';
import { CreateTripModal } from '../../components/trips/CreateTripModal';
import { TripStatusModal } from '../../components/trips/TripStatusModal';
import { TripDetailsModal } from '../../components/trips/TripDetailsModal';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { TableSkeleton, CardSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV } from '../../utils/exportCsv';
import { TRIP_STATUS } from '../../utils/constants';
import { Plus, LayoutGrid, List, Compass, Kanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TripPlanningPage() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('plannedStart');
  const [sortOrder, setSortOrder] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusTrip, setStatusTrip] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTrip, setDetailsTrip] = useState(null);

  const navigate = useNavigate();

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const [tList, vList, dList] = await Promise.all([
        tripService.getAll({
          search: debouncedSearch,
          status: statusFilter,
          sortBy,
          sortOrder
        }),
        vehicleService.getAll(),
        driverService.getAll()
      ]);
      setTrips(tList);
      setVehicles(vList);
      setDrivers(dList);
    } catch (err) {
      console.error('Failed to load trips', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [debouncedSearch, statusFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreateTrip = async (formData) => {
    await tripService.create(formData, 'Operations Dispatcher');
    fetchTrips();
  };

  const handleUpdateStatus = async (tripId, newStatus, note) => {
    await tripService.updateStatus(tripId, newStatus, note, 'Operations Dispatcher');
    fetchTrips();
  };

  const totalItems = trips.length;
  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return trips.slice(start, start + pageSize);
  }, [trips, currentPage, pageSize]);

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
    exportToCSV(trips, `fleetflow-trips-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Trip Planning & Mission Dispatch
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Plan highway routes, pair available vehicles and drivers, and manage mission lifecycle transitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Kanban}
            onClick={() => navigate('/dispatch')}
          >
            Kanban Board
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setCreateOpen(true)}
          >
            Plan New Trip
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search trips by ID, origin, destination, vehicle, or driver..."
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
          <option value="ALL">All Mission Statuses</option>
          {Object.values(TRIP_STATUS).map(s => (
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

      {/* Main Content */}
      {loading ? (
        viewMode === 'table' ? <TableSkeleton rows={6} cols={8} /> : <CardSkeleton count={6} />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No transport missions found"
          description="Plan a new highway transit mission and assign an available vehicle and driver."
          actionLabel="Plan New Trip"
          onAction={() => setCreateOpen(true)}
        />
      ) : viewMode === 'table' ? (
        <TripTable
          trips={paginatedTrips}
          onView={(t) => { setDetailsTrip(t); setDetailsOpen(true); }}
          onUpdateStatus={(t) => { setStatusTrip(t); setStatusOpen(true); }}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedTrips.map(t => (
            <TripCard
              key={t.id}
              trip={t}
              onView={(tr) => { setDetailsTrip(tr); setDetailsOpen(true); }}
              onUpdateStatus={(tr) => { setStatusTrip(tr); setStatusOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && trips.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      <CreateTripModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateTrip}
      />

      <TripStatusModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        trip={statusTrip}
        onUpdateStatus={handleUpdateStatus}
        userRole="Operations Dispatcher"
      />

      <TripDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        trip={detailsTrip}
      />
    </div>
  );
}
