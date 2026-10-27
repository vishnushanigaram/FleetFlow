import { apiClient } from './api/apiClient';
import { mockStorage, STORAGE_KEYS } from './api/mockStorage';
import { DRIVER_STATUS } from '../utils/constants';

export const driverService = {
  async getAll({ search = '', status = '', sortBy = 'name', sortOrder = 'asc' } = {}) {
    if (apiClient.isBackendActive()) {
      try {
        let list = await apiClient.get('/drivers', { search, status });
        list.sort((a, b) => {
          let valA = a[sortBy] ?? '';
          let valB = b[sortBy] ?? '';
          if (typeof valA === 'string') {
            const comp = valA.localeCompare(valB);
            return sortOrder === 'asc' ? comp : -comp;
          }
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        });
        return list;
      } catch (err) {
        console.warn('[driverService] Spring Boot API failed, falling back to mock:', err.message);
      }
    }

    await mockStorage.delay(200);
    let list = mockStorage.get(STORAGE_KEYS.DRIVERS);

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q) ||
        (d.contact && d.contact.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (status && status !== 'ALL') {
      list = list.filter(d => d.status === status);
    }

    // Sorting
    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB);
        return sortOrder === 'asc' ? comp : -comp;
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  },

  async getById(id) {
    if (apiClient.isBackendActive()) {
      try {
        return await apiClient.get(`/drivers/${id}`);
      } catch (err) {
        console.warn('[driverService] Spring Boot API failed, falling back to mock:', err.message);
      }
    }

    await mockStorage.delay(180);
    const list = mockStorage.get(STORAGE_KEYS.DRIVERS);
    const item = list.find(d => d.id === id);
    if (!item) throw new Error(`Driver with ID ${id} not found.`);
    return item;
  },

  async create(data) {
    if (apiClient.isBackendActive()) {
      try {
        return await apiClient.post('/drivers', data);
      } catch (err) {
        console.warn('[driverService] Spring Boot API failed, falling back to mock:', err.message);
        throw err;
      }
    }

    await mockStorage.delay(300);
    const list = mockStorage.get(STORAGE_KEYS.DRIVERS);

    // Validate license uniqueness
    const licClean = data.licenseNumber.trim().toUpperCase();
    const exists = list.some(d => d.licenseNumber.toUpperCase() === licClean);
    if (exists) {
      throw new Error(`Driver license "${licClean}" is already registered to another driver.`);
    }

    const newDriver = {
      id: `DRV-${Date.now().toString().slice(-4)}`,
      name: data.name.trim(),
      contact: data.contact.trim(),
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@fleetflow.io`,
      licenseNumber: licClean,
      licenseCategory: data.licenseCategory || 'Heavy Commercial (HMV)',
      licenseExpiry: data.licenseExpiry,
      experienceYears: Number(data.experienceYears || 3),
      status: data.status || DRIVER_STATUS.AVAILABLE,
      rating: 5.0,
      safetyScore: 100,
      completedTrips: 0,
      delayedTrips: 0,
      totalDistance: 0,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      currentTripId: null,
      currentVehicleId: null
    };

    list.unshift(newDriver);
    mockStorage.set(STORAGE_KEYS.DRIVERS, list);
    return newDriver;
  },

  async update(id, data) {
    if (apiClient.isBackendActive()) {
      try {
        return await apiClient.put(`/drivers/${id}`, data);
      } catch (err) {
        console.warn('[driverService] Spring Boot API failed, falling back to mock:', err.message);
        throw err;
      }
    }

    await mockStorage.delay(250);
    const list = mockStorage.get(STORAGE_KEYS.DRIVERS);
    const index = list.findIndex(d => d.id === id);
    if (index === -1) throw new Error(`Driver ${id} not found.`);

    if (data.licenseNumber) {
      const licClean = data.licenseNumber.trim().toUpperCase();
      const duplicate = list.find(d => d.id !== id && d.licenseNumber.toUpperCase() === licClean);
      if (duplicate) {
        throw new Error(`Driver license "${licClean}" is already registered to another driver.`);
      }
      data.licenseNumber = licClean;
    }

    list[index] = { ...list[index], ...data };
    mockStorage.set(STORAGE_KEYS.DRIVERS, list);
    return list[index];
  },

  async deactivate(id) {
    if (apiClient.isBackendActive()) {
      try {
        return await apiClient.patch(`/drivers/${id}/deactivate`);
      } catch (err) {
        console.warn('[driverService] Spring Boot API failed, falling back to mock:', err.message);
        throw err;
      }
    }

    await mockStorage.delay(200);
    const list = mockStorage.get(STORAGE_KEYS.DRIVERS);
    const driver = list.find(d => d.id === id);
    if (!driver) throw new Error(`Driver ${id} not found.`);

    if (driver.status === DRIVER_STATUS.ON_TRIP) {
      throw new Error('Cannot deactivate a driver who is currently on an active trip.');
    }

    driver.status = DRIVER_STATUS.INACTIVE;
    mockStorage.set(STORAGE_KEYS.DRIVERS, list);
    return driver;
  },

  async getDriverTrips(driverId) {
    if (apiClient.isBackendActive()) {
      try {
        return await apiClient.get('/trips', { driverId });
      } catch (err) {
        console.warn('[driverService] Spring Boot API failed, falling back to mock:', err.message);
      }
    }

    await mockStorage.delay(180);
    const trips = mockStorage.get(STORAGE_KEYS.TRIPS);
    return trips.filter(t => t.driverId === driverId);
  }
};
