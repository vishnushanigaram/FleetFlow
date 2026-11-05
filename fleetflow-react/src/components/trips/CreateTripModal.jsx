import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { validateTrip } from '../../utils/validators';
import { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS } from '../../utils/constants';

export function CreateTripModal({ isOpen, onClose, onSubmit }) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  const initialForm = {
    origin: '',
    destination: '',
    plannedStart: '',
    distanceKm: 350,
    cargoLoad: '',
    notes: '',
    vehicleId: '',
    driverId: '',
    status: TRIP_STATUS.ASSIGNED
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingResources(true);
      Promise.all([vehicleService.getAll(), driverService.getAll()])
        .then(([vList, dList]) => {
          setVehicles(vList);
          setDrivers(dList);

          // Preselect first available vehicle and driver
          const firstAvailV = vList.find(v => v.status === VEHICLE_STATUS.AVAILABLE);
          const firstAvailD = dList.find(d => d.status === DRIVER_STATUS.AVAILABLE);

          setFormData(prev => ({
            ...initialForm,
            vehicleId: firstAvailV ? firstAvailV.id : '',
            driverId: firstAvailD ? firstAvailD.id : ''
          }));
        })
        .finally(() => setLoadingResources(false));
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateTrip(formData, vehicles, drivers);
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

  const availableVehicles = vehicles.filter(v => v.status === VEHICLE_STATUS.AVAILABLE);
  const availableDrivers = drivers.filter(d => d.status === DRIVER_STATUS.AVAILABLE);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plan New Transport Mission / Trip"
      subtitle="Verify resource availability. Unavailable vehicles or drivers cannot be assigned."
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Authorize & Dispatch Trip
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

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Origin Departure Hub"
            required
            value={formData.origin}
            onChange={(e) => handleChange('origin', e.target.value)}
            placeholder="e.g. Chicago Central Hub (IL)"
            error={errors.origin}
          />

          <Input
            label="Destination Facility"
            required
            value={formData.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            placeholder="e.g. Detroit Logistics Yard (MI)"
            error={errors.destination}
          />
        </div>

        {/* Schedule & Distance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Planned Departure Date & Time"
            type="datetime-local"
            required
            value={formData.plannedStart}
            onChange={(e) => handleChange('plannedStart', e.target.value)}
            error={errors.plannedStart}
          />

          <Input
            label="Calculated Distance (km)"
            type="number"
            required
            value={formData.distanceKm}
            onChange={(e) => handleChange('distanceKm', e.target.value)}
            placeholder="e.g. 450"
          />
        </div>

        {/* Resource Assignment with Availability Validation */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Asset & Driver Allocation
            </span>
            <span className="text-[11px] text-slate-500">
              {availableVehicles.length} vehicles & {availableDrivers.length} drivers available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select
                label="Assign Vehicle"
                required
                value={formData.vehicleId}
                onChange={(e) => handleChange('vehicleId', e.target.value)}
                options={[
                  { value: '', label: '-- Select Available Vehicle --' },
                  ...vehicles.map(v => ({
                    value: v.id,
                    label: `${v.registrationNo} (${v.model} - ${v.status})`
                  }))
                ]}
                error={errors.vehicleId}
                helper={availableVehicles.length === 0 ? 'No vehicles currently Available' : ''}
              />
            </div>

            <div>
              <Select
                label="Assign Driver"
                required
                value={formData.driverId}
                onChange={(e) => handleChange('driverId', e.target.value)}
                options={[
                  { value: '', label: '-- Select Available Driver --' },
                  ...drivers.map(d => ({
                    value: d.id,
                    label: `${d.name} (${d.status} - Rating ${d.rating})`
                  }))
                ]}
                error={errors.driverId}
                helper={availableDrivers.length === 0 ? 'No drivers currently Available' : ''}
              />
            </div>
          </div>
        </div>

        {/* Cargo & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Cargo / Load Description"
            value={formData.cargoLoad}
            onChange={(e) => handleChange('cargoLoad', e.target.value)}
            placeholder="e.g. 6 Pallets Medical Diagnostics (3,200 kg)"
          />

          <Select
            label="Initial Dispatch Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: TRIP_STATUS.ASSIGNED, label: 'Assigned (Pre-departure)' },
              { value: TRIP_STATUS.IN_TRANSIT, label: 'Immediate In Transit' },
              { value: TRIP_STATUS.PLANNED, label: 'Planned (Scheduled queue)' }
            ]}
          />
        </div>

        <Input
          label="Operational Notes & Instructions"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Special handling, dock instructions, temperature range..."
        />
      </form>
    </Modal>
  );
}
