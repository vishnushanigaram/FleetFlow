import { VEHICLE_STATUS, DRIVER_STATUS } from './constants';

export function validateVehicle(formData, existingVehicles = [], currentId = null) {
  const errors = {};

  if (!formData.registrationNo || !formData.registrationNo.trim()) {
    errors.registrationNo = 'Registration number is mandatory';
  } else {
    const regClean = formData.registrationNo.trim().toUpperCase();
    const duplicate = existingVehicles.find(
      v => v.id !== currentId && v.registrationNo.toUpperCase() === regClean
    );
    if (duplicate) {
      errors.registrationNo = `Registration number ${regClean} already exists`;
    }
  }

  if (!formData.model || !formData.model.trim()) {
    errors.model = 'Vehicle model is required';
  }

  if (!formData.type) {
    errors.type = 'Vehicle type is required';
  }

  if (!formData.fuelType) {
    errors.fuelType = 'Fuel type is required';
  }

  if (!formData.capacity || Number(formData.capacity) <= 0) {
    errors.capacity = 'Capacity must be greater than 0';
  }

  if (formData.odometer === undefined || formData.odometer === '' || Number(formData.odometer) < 0) {
    errors.odometer = 'Valid odometer reading is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateDriver(formData, existingDrivers = [], currentId = null) {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Driver full name is required';
  }

  if (!formData.licenseNumber || !formData.licenseNumber.trim()) {
    errors.licenseNumber = 'Commercial driving license number is required';
  } else {
    const licClean = formData.licenseNumber.trim().toUpperCase();
    const duplicate = existingDrivers.find(
      d => d.id !== currentId && d.licenseNumber.toUpperCase() === licClean
    );
    if (duplicate) {
      errors.licenseNumber = `License number ${licClean} is already registered`;
    }
  }

  if (!formData.licenseExpiry) {
    errors.licenseExpiry = 'License expiration date is required';
  } else {
    const expiry = new Date(formData.licenseExpiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiry < today) {
      errors.licenseExpiry = 'License is expired! Driver cannot be active with expired license.';
    }
  }

  if (!formData.contact || !formData.contact.trim()) {
    errors.contact = 'Contact phone number is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateTrip(formData, availableVehicles = [], availableDrivers = []) {
  const errors = {};

  if (!formData.origin || !formData.origin.trim()) {
    errors.origin = 'Origin departure hub is required';
  }

  if (!formData.destination || !formData.destination.trim()) {
    errors.destination = 'Destination destination is required';
  }

  if (!formData.plannedStart) {
    errors.plannedStart = 'Planned start date and time are required';
  }

  if (!formData.vehicleId) {
    errors.vehicleId = 'Vehicle assignment is mandatory';
  } else {
    const vehicle = availableVehicles.find(v => v.id === formData.vehicleId);
    if (!vehicle) {
      errors.vehicleId = 'Selected vehicle does not exist';
    } else if (vehicle.status !== VEHICLE_STATUS.AVAILABLE) {
      errors.vehicleId = `Vehicle is currently "${vehicle.status}" and cannot be assigned.`;
    }
  }

  if (!formData.driverId) {
    errors.driverId = 'Driver assignment is mandatory';
  } else {
    const driver = availableDrivers.find(d => d.id === formData.driverId);
    if (!driver) {
      errors.driverId = 'Selected driver does not exist';
    } else if (driver.status !== DRIVER_STATUS.AVAILABLE) {
      errors.driverId = `Driver is currently "${driver.status}" and cannot be assigned.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateMaintenance(formData, vehicles = []) {
  const errors = {};

  if (!formData.vehicleId) {
    errors.vehicleId = 'Vehicle selection is required';
  }

  if (!formData.serviceType) {
    errors.serviceType = 'Service type is required';
  }

  if (!formData.scheduledDate) {
    errors.scheduledDate = 'Scheduled maintenance date is required';
  }

  if (formData.cost !== undefined && formData.cost !== '' && Number(formData.cost) < 0) {
    errors.cost = 'Cost cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateFuel(formData) {
  const errors = {};

  if (!formData.vehicleId) {
    errors.vehicleId = 'Vehicle is required';
  }

  if (!formData.quantity || Number(formData.quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than 0';
  }

  if (!formData.cost || Number(formData.cost) <= 0) {
    errors.cost = 'Total fuel cost must be greater than 0';
  }

  if (!formData.odometer || Number(formData.odometer) <= 0) {
    errors.odometer = 'Valid odometer reading at refueling is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
