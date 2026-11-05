import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SERVICE_TYPES, MAINTENANCE_STATUS } from '../../utils/constants';
import { validateMaintenance } from '../../utils/validators';

export function CreateMaintenanceModal({ isOpen, onClose, onSubmit, vehicles = [] }) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: SERVICE_TYPES[0],
    scheduledDate: new Date().toISOString().split('T')[0],
    cost: 250,
    odometer: '',
    notes: '',
    serviceProvider: 'Continental Fleet Tech Services',
    status: MAINTENANCE_STATUS.SCHEDULED
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        vehicleId: vehicles.length > 0 ? vehicles[0].id : '',
        serviceType: SERVICE_TYPES[0],
        scheduledDate: new Date().toISOString().split('T')[0],
        cost: 250,
        odometer: vehicles.length > 0 ? vehicles[0].odometer : '',
        notes: '',
        serviceProvider: 'Continental Fleet Tech Services',
        status: MAINTENANCE_STATUS.SCHEDULED
      });
      setErrors({});
    }
  }, [isOpen, vehicles]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (field === 'vehicleId') {
      const v = vehicles.find(item => item.id === val);
      if (v) {
        setFormData(prev => ({ ...prev, odometer: v.odometer }));
      }
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateMaintenance(formData, vehicles);
    if (!validation.isValid) {
      setErrors(validation.errors);
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
      title="Schedule Preventive / Corrective Maintenance"
      subtitle="Ensures fleet roadworthiness and updates vehicle availability."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Book Service Work Order
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
          <Select
            label="Target Fleet Vehicle"
            required
            value={formData.vehicleId}
            onChange={(e) => handleChange('vehicleId', e.target.value)}
            options={vehicles.map(v => ({
              value: v.id,
              label: `${v.registrationNo} — ${v.model} (${v.status})`
            }))}
            error={errors.vehicleId}
          />

          <Select
            label="Service / Repair Category"
            required
            value={formData.serviceType}
            onChange={(e) => handleChange('serviceType', e.target.value)}
            options={SERVICE_TYPES}
            error={errors.serviceType}
          />

          <Input
            label="Scheduled Date"
            type="date"
            required
            value={formData.scheduledDate}
            onChange={(e) => handleChange('scheduledDate', e.target.value)}
            error={errors.scheduledDate}
          />

          <Input
            label="Estimated Cost ($)"
            type="number"
            value={formData.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            error={errors.cost}
          />

          <Input
            label="Current Odometer at Intake (km)"
            type="number"
            value={formData.odometer}
            onChange={(e) => handleChange('odometer', e.target.value)}
          />

          <Input
            label="Authorized Service Provider"
            value={formData.serviceProvider}
            onChange={(e) => handleChange('serviceProvider', e.target.value)}
            placeholder="e.g. Goodyear Commercial Tire Center"
          />

          <Select
            label="Intake Service Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: MAINTENANCE_STATUS.SCHEDULED, label: 'Scheduled (Upcoming)' },
              { value: MAINTENANCE_STATUS.IN_PROGRESS, label: 'In Progress (Vehicle taken off duty)' }
            ]}
          />
        </div>

        <Input
          label="Technician Notes / Defect Details"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="e.g. Front axle brake pad wear, scheduled synthetic lube..."
        />
      </form>
    </Modal>
  );
}
