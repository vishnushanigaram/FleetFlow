import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { tripService } from '../../services/tripService';
import { DELIVERY_PRIORITY } from '../../utils/constants';

export function CreateDeliveryModal({ isOpen, onClose, onSubmit }) {
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    recipient: '',
    recipientContact: '',
    origin: '',
    destination: '',
    itemsDescription: '',
    weightKg: 500,
    priority: DELIVERY_PRIORITY.NORMAL,
    tripId: '',
    eta: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      tripService.getAll().then(list => setTrips(list)).catch(console.error);
      setFormData({
        recipient: '',
        recipientContact: '',
        origin: '',
        destination: '',
        itemsDescription: '',
        weightKg: 500,
        priority: DELIVERY_PRIORITY.NORMAL,
        tripId: '',
        eta: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipient.trim() || !formData.destination.trim() || !formData.origin.trim()) {
      setErrors({ form: 'Recipient, origin, and destination are required.' });
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Delivery Consignment"
      subtitle="Generates unique barcode tracking number & manifest"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Issue Delivery Waybill
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errors.form && (
          <div className="p-3 text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 rounded-lg">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Recipient Company / Consignee"
            required
            value={formData.recipient}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
            placeholder="e.g. Apex Precision Works"
          />

          <Input
            label="Recipient Phone / Dock Bay"
            value={formData.recipientContact}
            onChange={(e) => setFormData({ ...formData, recipientContact: e.target.value })}
            placeholder="e.g. Receiving Dock Gate 4, +1 313-555-0199"
          />

          <Input
            label="Origin City / Terminal"
            required
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            placeholder="e.g. Chicago Hub, IL"
          />

          <Input
            label="Destination City / Facility"
            required
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="e.g. Detroit Plant, MI"
          />

          <Input
            label="Cargo & Item Manifest"
            value={formData.itemsDescription}
            onChange={(e) => setFormData({ ...formData, itemsDescription: e.target.value })}
            placeholder="e.g. 4 Heavy Pallets Industrial Bearings"
          />

          <Input
            label="Gross Weight (kg)"
            type="number"
            value={formData.weightKg}
            onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
          />

          <Select
            label="Consignment Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            options={[DELIVERY_PRIORITY.NORMAL, DELIVERY_PRIORITY.HIGH, DELIVERY_PRIORITY.URGENT]}
          />

          <Select
            label="Assign to Active Trip (Optional)"
            value={formData.tripId}
            onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
            options={[
              { value: '', label: '-- Unassigned (Staged in Hub) --' },
              ...trips.map(t => ({
                value: t.id,
                label: `${t.id}: ${t.origin.slice(0, 14)} → ${t.destination.slice(0, 14)} (${t.vehicleReg})`
              }))
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
