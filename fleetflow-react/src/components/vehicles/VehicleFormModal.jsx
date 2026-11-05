import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { VEHICLE_TYPES, FUEL_TYPES, VEHICLE_STATUS } from '../../utils/constants';
import { validateVehicle } from '../../utils/validators';

export function VehicleFormModal({ isOpen, onClose, onSubmit, vehicle = null, existingVehicles = [] }) {
  const isEditing = Boolean(vehicle);

  const initialForm = {
    registrationNo: '',
    model: '',
    type: VEHICLE_TYPES[0],
    fuelType: FUEL_TYPES[0],
    capacity: '',
    odometer: '',
    year: new Date().getFullYear(),
    status: VEHICLE_STATUS.AVAILABLE
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNo: vehicle.registrationNo || '',
        model: vehicle.model || '',
        type: vehicle.type || VEHICLE_TYPES[0],
        fuelType: vehicle.fuelType || FUEL_TYPES[0],
        capacity: vehicle.capacity || '',
        odometer: vehicle.odometer || '',
        year: vehicle.year || new Date().getFullYear(),
        status: vehicle.status || VEHICLE_STATUS.AVAILABLE
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [vehicle, isOpen]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateVehicle(formData, existingVehicles, vehicle?.id);
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
      title={isEditing ? `Edit Vehicle (${vehicle?.registrationNo})` : 'Register New Fleet Vehicle'}
      subtitle="Ensure accurate commercial registration details and payload capacity."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEditing ? 'Save Changes' : 'Register Vehicle'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Registration Number"
            required
            value={formData.registrationNo}
            onChange={(e) => handleChange('registrationNo', e.target.value.toUpperCase())}
            placeholder="e.g. DL 1L AB 1234"
            error={errors.registrationNo}
            helper="State RTO or commercial transit plate ID"
          />

          <Input
            label="Model & Manufacturer"
            required
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="e.g. Volvo FH16 540"
            error={errors.model}
          />

          <Select
            label="Vehicle Category"
            required
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            options={VEHICLE_TYPES}
            error={errors.type}
          />

          <Select
            label="Powertrain / Fuel Type"
            required
            value={formData.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            options={FUEL_TYPES}
            error={errors.fuelType}
          />

          <Input
            label="Payload Capacity (kg)"
            type="number"
            required
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            placeholder="e.g. 24000"
            error={errors.capacity}
          />

          <Input
            label="Current Odometer (km)"
            type="number"
            required
            value={formData.odometer}
            onChange={(e) => handleChange('odometer', e.target.value)}
            placeholder="e.g. 45000"
            error={errors.odometer}
          />

          <Input
            label="Manufacturing Year"
            type="number"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
          />

          <Select
            label="Operational Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: VEHICLE_STATUS.AVAILABLE, label: 'Available (Ready for Dispatch)' },
              { value: VEHICLE_STATUS.MAINTENANCE, label: 'Maintenance (Under Service)' },
              { value: VEHICLE_STATUS.INACTIVE, label: 'Inactive (Decommissioned)' }
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
