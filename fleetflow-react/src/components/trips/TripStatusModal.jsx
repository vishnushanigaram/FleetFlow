import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TRIP_STATUS } from '../../utils/constants';

export function TripStatusModal({ isOpen, onClose, trip, onUpdateStatus, userRole = 'Dispatcher' }) {
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (trip) {
      setNewStatus(trip.status);
      setNote('');
      setError('');
    }
  }, [trip, isOpen]);

  if (!trip) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newStatus === trip.status) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onUpdateStatus(trip.id, newStatus, note, `${userRole} Console`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = trip.status === TRIP_STATUS.COMPLETED;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Trip Status — ${trip.id}`}
      subtitle={`${trip.origin} → ${trip.destination}`}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={isCompleted && newStatus !== TRIP_STATUS.COMPLETED}
          >
            Confirm Status Transition
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">Current Status</span>
            <div className="mt-1">
              <Badge variant={trip.status} dot />
            </div>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Assigned Asset</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{trip.vehicleReg}</span>
          </div>
        </div>

        {isCompleted ? (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300">
            <strong>Notice:</strong> This trip is completed. Vehicle and driver availability have already been released to the fleet pool.
          </div>
        ) : (
          <>
            <Select
              label="Select Next Lifecycle Stage"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={[
                { value: TRIP_STATUS.ASSIGNED, label: 'Assigned (Vehicle & Driver ready)' },
                { value: TRIP_STATUS.IN_TRANSIT, label: 'In Transit (On Highway)' },
                { value: TRIP_STATUS.PAUSED, label: 'Paused (Driver Break / Waypoint Stop)' },
                { value: TRIP_STATUS.DELAYED, label: 'Delayed (Weather / Traffic exception)' },
                { value: TRIP_STATUS.COMPLETED, label: 'Completed (Mission finished, release assets)' },
                { value: TRIP_STATUS.CANCELLED, label: 'Cancelled (Abort trip, release assets)' }
              ]}
            />

            <Input
              label="Status Change Note & Remarks"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Cleared tollway checkpoint, smooth road conditions."
              helper="Logged into chronological audit trail"
            />
          </>
        )}
      </form>
    </Modal>
  );
}
