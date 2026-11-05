import React, { useState, useEffect } from 'react';
import { tripService } from '../../services/tripService';
import { useAuth } from '../../hooks/useAuth';
import { TripTable } from '../../components/trips/TripTable';
import { TripDetailsModal } from '../../components/trips/TripDetailsModal';
import { TripStatusModal } from '../../components/trips/TripStatusModal';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Compass } from 'lucide-react';

export function DriverTripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTrip, setDetailsTrip] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusTrip, setStatusTrip] = useState(null);

  const driverId = user?.driverId || 'DRV-1001';

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await tripService.getAll({ driverId });
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [driverId]);

  const handleUpdateStatus = async (tripId, newStatus, note) => {
    await tripService.updateStatus(tripId, newStatus, note, user?.name || 'Driver');
    fetchTrips();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          My Assigned Transport Missions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          History of all freight journeys, origin hubs, and destination delivery waypoints.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={7} />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No assigned missions"
          description="You currently have no historical or active trips logged."
        />
      ) : (
        <TripTable
          trips={trips}
          onView={(t) => { setDetailsTrip(t); setDetailsOpen(true); }}
          onUpdateStatus={(t) => { setStatusTrip(t); setStatusOpen(true); }}
          onSort={() => {}}
          sortBy="plannedStart"
          sortOrder="desc"
        />
      )}

      <TripDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        trip={detailsTrip}
      />

      <TripStatusModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        trip={statusTrip}
        onUpdateStatus={handleUpdateStatus}
        userRole="Driver"
      />
    </div>
  );
}
