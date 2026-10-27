import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { validateFuel } from '../../utils/validators';

export function CreateFuelModal({ isOpen, onClose, onSubmit, vehicles = [] }) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    quantity: 150,
    cost: 210,
    odometer: '',
    station: 'Shell Commercial Terminal #14',
    driverName: 'Ajay Kumar'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        vehicleId: vehicles.length > 0 ? vehicles[0].id : '',
        date: new Date().toISOString().split('T')[0],
        quantity: 150,
        cost: 210,
        odometer: vehicles.length > 0 ? vehicles[0].odometer : '',
        station: 'Shell Commercial Terminal #14',
        driverName: vehicles.length > 0 && vehicles[0].assignedDriverName ? vehicles[0].assignedDriverName : 'Operations Fleet Driver'
      });
      setErrors({});
    }
  }, [isOpen, vehicles]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (field === 'vehicleId') {
      const v = vehicles.find(item => item.id === val);
      if (v) {
        setFormData(prev => ({
          ...prev,
          odometer: v.odometer,
          driverName: v.assignedDriverName || 'Operations Fleet Driver'
        }));
      }
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateFuel(formData);
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
      title="Record Fuel & Energy Consumption"
      subtitle="Logs fuel quantity and calculates cost per kilometer efficiency."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Log Refueling
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
              label: `${v.registrationNo} — ${v.fuelType} (${v.model})`
            }))}
            error={errors.vehicleId}
          />

          <Input
            label="Transaction Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />

          <Input
            label="Volume Dispensed (Liters or kWh)"
            type="number"
            required
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            error={errors.quantity}
          />

          <Input
            label="Total Amount Paid ($)"
            type="number"
            required
            value={formData.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            error={errors.cost}
          />

          <Input
            label="Odometer at Pump (km)"
            type="number"
            required
            value={formData.odometer}
            onChange={(e) => handleChange('odometer', e.target.value)}
            error={errors.odometer}
          />

          <Input
            label="Fuel Station / Terminal"
            value={formData.station}
            onChange={(e) => handleChange('station', e.target.value)}
            placeholder="e.g. Love's Travel Stop #182"
          />
        </div>

        <Input
          label="Authorizing Driver / Operator"
          value={formData.driverName}
          onChange={(e) => handleChange('driverName', e.target.value)}
        />
      </form>
    </Modal>
  );
}
