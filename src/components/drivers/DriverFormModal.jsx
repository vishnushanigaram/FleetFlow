import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { DRIVER_STATUS } from '../../utils/constants';
import { validateDriver } from '../../utils/validators';

export function DriverFormModal({ isOpen, onClose, onSubmit, driver = null, existingDrivers = [] }) {
  const isEditing = Boolean(driver);

  const initialForm = {
    name: '',
    contact: '',
    email: '',
    licenseNumber: '',
    licenseCategory: 'Heavy Commercial (HMV)',
    licenseExpiry: '',
    experienceYears: 5,
    status: DRIVER_STATUS.AVAILABLE
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        contact: driver.contact || '',
        email: driver.email || '',
        licenseNumber: driver.licenseNumber || '',
        licenseCategory: driver.licenseCategory || 'Heavy Commercial (HMV)',
        licenseExpiry: driver.licenseExpiry || '',
        experienceYears: driver.experienceYears || 5,
        status: driver.status || DRIVER_STATUS.AVAILABLE
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [driver, isOpen]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateDriver(formData, existingDrivers, driver?.id);
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
      title={isEditing ? `Edit Driver (${driver?.name})` : 'Register Professional Driver'}
      subtitle="Ensure active CDL/commercial licensing with verified validity."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEditing ? 'Save Changes' : 'Register Driver'}
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
            label="Full Legal Name"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Ajay Kumar"
            error={errors.name}
          />

          <Input
            label="Mobile Phone"
            required
            value={formData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            placeholder="e.g. +1 (555) 234-5678"
            error={errors.contact}
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g. ajay.kumar@fleetflow.io"
            helper="Optional operational login email"
          />

          <Input
            label="Commercial License (CDL)"
            required
            value={formData.licenseNumber}
            onChange={(e) => handleChange('licenseNumber', e.target.value.toUpperCase())}
            placeholder="e.g. DL-908234-HMV"
            error={errors.licenseNumber}
          />

          <Select
            label="License Category"
            value={formData.licenseCategory}
            onChange={(e) => handleChange('licenseCategory', e.target.value)}
            options={[
              'Heavy Commercial (HMV)',
              'Light Commercial (LCV)',
              'Hazardous Materials (HAZMAT)',
              'Multi-Axle Articulated'
            ]}
          />

          <Input
            label="License Expiration Date"
            type="date"
            required
            value={formData.licenseExpiry}
            onChange={(e) => handleChange('licenseExpiry', e.target.value)}
            error={errors.licenseExpiry}
          />

          <Input
            label="Years of Experience"
            type="number"
            value={formData.experienceYears}
            onChange={(e) => handleChange('experienceYears', e.target.value)}
          />

          <Select
            label="Availability Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: DRIVER_STATUS.AVAILABLE, label: 'Available (Ready for assignment)' },
              { value: DRIVER_STATUS.LEAVE, label: 'On Leave' },
              { value: DRIVER_STATUS.INACTIVE, label: 'Inactive' }
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
