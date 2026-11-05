import React, { useState, useEffect, useMemo } from 'react';
import { deliveryService } from '../../services/deliveryService';
import { DeliveryTable } from '../../components/deliveries/DeliveryTable';
import { DeliveryTimeline } from '../../components/deliveries/DeliveryTimeline';
import { ProofOfDeliveryModal } from '../../components/deliveries/ProofOfDeliveryModal';
import { StatusCorrectionModal } from '../../components/deliveries/StatusCorrectionModal';
import { CreateDeliveryModal } from '../../components/deliveries/CreateDeliveryModal';
import { Modal } from '../../components/common/Modal';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV } from '../../utils/exportCsv';
import { DELIVERY_STATUS, DELIVERY_PRIORITY } from '../../utils/constants';
import { Package, Plus, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('eta');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [podOpen, setPodOpen] = useState(false);
  const [podDelivery, setPodDelivery] = useState(null);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionDelivery, setCorrectionDelivery] = useState(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [timelineDelivery, setTimelineDelivery] = useState(null);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await deliveryService.getAll({
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder
      });
      setDeliveries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = async (formData) => {
    await deliveryService.create(formData);
    fetchDeliveries();
  };

  const handleConfirmPOD = async (deliveryId, proofData) => {
    await deliveryService.confirmProofOfDelivery(deliveryId, proofData);
    fetchDeliveries();
  };

  const handleConfirmCorrection = async (deliveryId, newStatus, options) => {
    await deliveryService.updateStatus(deliveryId, newStatus, options);
    fetchDeliveries();
  };

  const totalItems = deliveries.length;
  const paginatedDeliveries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return deliveries.slice(start, start + pageSize);
  }, [deliveries, currentPage, pageSize]);

  const activeFilters = [];
  if (statusFilter !== 'ALL') {
    activeFilters.push({ label: 'Status', value: statusFilter, onRemove: () => setStatusFilter('ALL') });
  }
  if (priorityFilter !== 'ALL') {
    activeFilters.push({ label: 'Priority', value: priorityFilter, onRemove: () => setPriorityFilter('ALL') });
  }

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setCurrentPage(1);
  };

  const handleExport = () => {
    exportToCSV(deliveries, `fleetflow-consignments-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Consignment & Delivery Fulfillment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor shipments, capture electronic proof-of-delivery (e-POD), and enforce delivery correction policies.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setCreateOpen(true)}
        >
          Book Consignment
        </Button>
      </div>

      {/* Search & Filters */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by tracking number, recipient, destination, or goods..."
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
          <option value="ALL">All Delivery Statuses</option>
          {Object.values(DELIVERY_STATUS).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
          className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Priorities</option>
          {Object.values(DELIVERY_PRIORITY).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </SearchFilterBar>

      {/* Main Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : deliveries.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No consignments found"
          description="Create a delivery waybill or adjust filter parameters."
          actionLabel="Book Consignment"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <DeliveryTable
          deliveries={paginatedDeliveries}
          onView={(del) => { setTimelineDelivery(del); setTimelineOpen(true); }}
          onRecordPOD={(del) => { setPodDelivery(del); setPodOpen(true); }}
          onCorrectStatus={(del) => { setCorrectionDelivery(del); setCorrectionOpen(true); }}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      )}

      {/* Pagination */}
      {!loading && deliveries.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      <CreateDeliveryModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <ProofOfDeliveryModal
        isOpen={podOpen}
        onClose={() => setPodOpen(false)}
        delivery={podDelivery}
        onConfirm={handleConfirmPOD}
      />

      <StatusCorrectionModal
        isOpen={correctionOpen}
        onClose={() => setCorrectionOpen(false)}
        delivery={correctionDelivery}
        onConfirmCorrection={handleConfirmCorrection}
      />

      {/* Delivery Milestone Timeline Modal */}
      <Modal
        isOpen={timelineOpen}
        onClose={() => setTimelineOpen(false)}
        title={`Waybill Milestones: ${timelineDelivery?.trackingId}`}
        subtitle={`Consignee: ${timelineDelivery?.recipient}`}
        maxWidth="max-w-xl"
        footer={<Button variant="secondary" onClick={() => setTimelineOpen(false)}>Close</Button>}
      >
        {timelineDelivery && (
          <DeliveryTimeline
            events={timelineDelivery.events}
            proofOfDelivery={timelineDelivery.proofOfDelivery}
            delayReason={timelineDelivery.delayReason}
          />
        )}
      </Modal>
    </div>
  );
}
