import React, { useState, useEffect } from 'react';
import { tripService } from '../../services/tripService';
import { DispatchBoard } from '../../components/trips/DispatchBoard';
import { CreateTripModal } from '../../components/trips/CreateTripModal';
import { TripDetailsModal } from '../../components/trips/TripDetailsModal';
import { Button } from '../../components/common/Button';
import { Plus, Compass, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DispatchBoardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await tripService.getAll();
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleUpdateStatus = async (tripId, newStatus, note) => {
    await tripService.updateStatus(tripId, newStatus, note, 'Kanban Dispatcher');
    fetchTrips();
  };

  const handleCreateTrip = async (formData) => {
    await tripService.create(formData, 'Kanban Dispatcher');
    fetchTrips();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Live Dispatch Kanban Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive drag-and-drop workflow to stage, dispatch, and fulfill fleet freight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/operations/planning')}
          >
            Table View
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setCreateOpen(true)}
          >
            Plan Trip
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Loading dispatch board telemetry...
        </div>
      ) : (
        <DispatchBoard
          trips={trips}
          onUpdateStatus={handleUpdateStatus}
          onCreateTrip={() => setCreateOpen(true)}
          onViewTrip={(t) => { setSelectedTrip(t); setDetailsOpen(true); }}
        />
      )}

      <CreateTripModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateTrip}
      />

      <TripDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        trip={selectedTrip}
      />
    </div>
  );
}
