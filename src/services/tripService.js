import { apiClient } from './api/apiClient';
import { mockStorage, STORAGE_KEYS } from './api/mockStorage';
import { TRIP_STATUS, VEHICLE_STATUS, DRIVER_STATUS, DELIVERY_STATUS } from '../utils/constants';

export const tripService = {
  async getAll({ search = '', status = '', vehicleId = '', driverId = '', sortBy = 'plannedStart', sortOrder = 'desc' } = {}) {
    if (apiClient.isBackendActive()) {
      try {
        let list = await apiClient.get('/trips', { search, status, vehicleId, driverId });
        list.sort((a, b) => {
          let valA = a[sortBy] ?? '';
          let valB = b[sortBy] ?? '';
          if (typeof valA === 'string') {
            return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        });
        return list;
      } catch (err) {
        console.warn('[tripService] Spring Boot API failed, falling back to mock:', err.message);
      }
    }

    await mockStorage.delay(220);
    let list = mockStorage.get(STORAGE_KEYS.TRIPS);

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        (t.driverName && t.driverName.toLowerCase().includes(q)) ||
        (t.vehicleReg && t.vehicleReg.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (status && status !== 'ALL') {
      list = list.filter(t => t.status === status);
    }

    // Vehicle filter
    if (vehicleId && vehicleId !== 'ALL') {
      list = list.filter(t => t.vehicleId === vehicleId);
    }

    // Driver filter
    if (driverId && driverId !== 'ALL') {
      list = list.filter(t => t.driverId === driverId);
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  },

  async getById(id) {
    if (apiClient.isBackendActive()) {
      try {
        return await apiClient.get(`/trips/${id}`);
      } catch (err) {
        console.warn('[tripService] Spring Boot API failed, falling back to mock:', err.message);
      }
    }

    await mockStorage.delay(180);
    const list = mockStorage.get(STORAGE_KEYS.TRIPS);
    const trip = list.find(t => t.id === id);
    if (!trip) throw new Error(`Trip ${id} not found.`);
    return trip;
  },

  async create(data, createdByName = 'Sarah Jenkins') {
    if (apiClient.isBackendActive()) {
      try {
        return await apiClient.post('/trips', data, { createdBy: createdByName });
      } catch (err) {
        console.warn('[tripService] Spring Boot API failed, falling back to mock:', err.message);
        throw err;
      }
    }

    await mockStorage.delay(350);

    const vehicles = mockStorage.get(STORAGE_KEYS.VEHICLES);
    const drivers = mockStorage.get(STORAGE_KEYS.DRIVERS);
    const trips = mockStorage.get(STORAGE_KEYS.TRIPS);

    // 1. Business rule validation: Vehicle availability check
    const vehicle = vehicles.find(v => v.id === data.vehicleId);
    if (!vehicle) {
      throw new Error('Assigned vehicle not found.');
    }
    if (vehicle.status !== VEHICLE_STATUS.AVAILABLE) {
      throw new Error(`Vehicle ${vehicle.registrationNo} is currently "${vehicle.status}". Only Available vehicles can be assigned.`);
    }

    // 2. Business rule validation: Driver availability check
    const driver = drivers.find(d => d.id === data.driverId);
    if (!driver) {
      throw new Error('Assigned driver not found.');
    }
    if (driver.status !== DRIVER_STATUS.AVAILABLE) {
      throw new Error(`Driver ${driver.name} is currently "${driver.status}". Only Available drivers can be assigned.`);
    }

    // 3. Driver license expiry check
    if (new Date(driver.licenseExpiry) < new Date()) {
      throw new Error(`Driver ${driver.name} has an expired commercial license and cannot be assigned to new trips.`);
    }

    const tripId = `TRP-${Date.now().toString().slice(-4)}`;
    const status = data.status || TRIP_STATUS.ASSIGNED;

    const newTrip = {
      id: tripId,
      vehicleId: vehicle.id,
      vehicleReg: vehicle.registrationNo,
      driverId: driver.id,
      driverName: driver.name,
      origin: data.origin.trim(),
      destination: data.destination.trim(),
      plannedStart: data.plannedStart,
      actualStart: status === TRIP_STATUS.IN_TRANSIT ? new Date().toISOString() : null,
      estimatedArrival: data.estimatedArrival || new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      distanceKm: Number(data.distanceKm || 350),
      currentSpeed: status === TRIP_STATUS.IN_TRANSIT ? 60 : 0,
      cargoLoad: data.cargoLoad || 'General Commercial Cargo',
      notes: data.notes || '',
      status: status,
      isDelayed: false,
      progressPercent: status === TRIP_STATUS.IN_TRANSIT ? 10 : 0,
      originCoords: data.originCoords || { lat: 41.8781, lng: -87.6298, city: data.origin },
      destCoords: data.destCoords || { lat: 42.3314, lng: -83.0458, city: data.destination },
      currentCoords: data.originCoords || { lat: 41.8781, lng: -87.6298 },
      statusHistory: [
        {
          id: `SH-${Date.now()}`,
          status: status,
          timestamp: new Date().toISOString(),
          note: `Trip created and assigned to ${driver.name} with vehicle ${vehicle.registrationNo}`,
          updatedBy: createdByName
        }
      ]
    };

    // Update vehicle status
    vehicle.status = status === TRIP_STATUS.IN_TRANSIT ? VEHICLE_STATUS.ON_TRIP : VEHICLE_STATUS.ASSIGNED;
    vehicle.assignedDriverId = driver.id;
    vehicle.assignedDriverName = driver.name;
    vehicle.currentTripId = tripId;

    // Update driver status
    driver.status = status === TRIP_STATUS.IN_TRANSIT ? DRIVER_STATUS.ON_TRIP : DRIVER_STATUS.ASSIGNED;
    driver.currentTripId = tripId;
    driver.currentVehicleId = vehicle.id;

    // Save all updated collections
    trips.unshift(newTrip);
    mockStorage.set(STORAGE_KEYS.TRIPS, trips);
    mockStorage.set(STORAGE_KEYS.VEHICLES, vehicles);
    mockStorage.set(STORAGE_KEYS.DRIVERS, drivers);

    return newTrip;
  },

  async updateStatus(tripId, newStatus, note = '', updatedBy = 'Operations Dispatcher') {
    if (apiClient.isBackendActive()) {
      try {
        return await apiClient.patch(`/trips/${tripId}/status`, { status: newStatus, note, updatedBy });
      } catch (err) {
        console.warn('[tripService] Spring Boot API failed, falling back to mock:', err.message);
        throw err;
      }
    }

    await mockStorage.delay(280);

    const trips = mockStorage.get(STORAGE_KEYS.TRIPS);
    const vehicles = mockStorage.get(STORAGE_KEYS.VEHICLES);
    const drivers = mockStorage.get(STORAGE_KEYS.DRIVERS);
    const deliveries = mockStorage.get(STORAGE_KEYS.DELIVERIES);

    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error(`Trip ${tripId} not found.`);

    // Business rule: Completed trip cannot accept in-transit updates
    if (trip.status === TRIP_STATUS.COMPLETED && newStatus !== TRIP_STATUS.COMPLETED) {
      throw new Error('This trip is already marked as COMPLETED. Completed trips cannot be reverted to active transit.');
    }

    const previousStatus = trip.status;
    trip.status = newStatus;

    if (newStatus === TRIP_STATUS.DELAYED) {
      trip.isDelayed = true;
    } else if (newStatus === TRIP_STATUS.COMPLETED) {
      trip.progressPercent = 100;
      trip.currentSpeed = 0;
      trip.isDelayed = false;
    } else if (newStatus === TRIP_STATUS.IN_TRANSIT && !trip.actualStart) {
      trip.actualStart = new Date().toISOString();
      trip.currentSpeed = 65;
    }

    // Add status history entry
    trip.statusHistory = trip.statusHistory || [];
    trip.statusHistory.push({
      id: `SH-${Date.now()}`,
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status changed from ${previousStatus} to ${newStatus}`,
      updatedBy: updatedBy
    });

    // Update vehicle and driver status based on trip status
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    const driver = drivers.find(d => d.id === trip.driverId);

    if (newStatus === TRIP_STATUS.COMPLETED || newStatus === TRIP_STATUS.CANCELLED) {
      if (vehicle) {
        vehicle.status = VEHICLE_STATUS.AVAILABLE;
        vehicle.currentTripId = null;
        vehicle.assignedDriverId = null;
        vehicle.assignedDriverName = null;
        if (newStatus === TRIP_STATUS.COMPLETED) {
          vehicle.odometer = (vehicle.odometer || 0) + (trip.distanceKm || 0);
        }
      }
      if (driver) {
        driver.status = DRIVER_STATUS.AVAILABLE;
        driver.currentTripId = null;
        driver.currentVehicleId = null;
        if (newStatus === TRIP_STATUS.COMPLETED) {
          driver.completedTrips = (driver.completedTrips || 0) + 1;
          driver.totalDistance = (driver.totalDistance || 0) + (trip.distanceKm || 0);
        }
      }

      // Also update linked deliveries if trip completed
      if (newStatus === TRIP_STATUS.COMPLETED) {
        deliveries.forEach(del => {
          if (del.tripId === trip.id && del.status !== DELIVERY_STATUS.DELIVERED) {
            del.status = DELIVERY_STATUS.DELIVERED;
            del.events.push({
              time: new Date().toISOString().replace('T', ' ').slice(0, 16),
              title: 'Delivered',
              desc: `Trip ${trip.id} completed. Delivery fulfilled.`,
              status: DELIVERY_STATUS.DELIVERED
            });
          }
        });
        mockStorage.set(STORAGE_KEYS.DELIVERIES, deliveries);
      }
    } else if (newStatus === TRIP_STATUS.IN_TRANSIT) {
      if (vehicle) vehicle.status = VEHICLE_STATUS.ON_TRIP;
      if (driver) driver.status = DRIVER_STATUS.ON_TRIP;
    }

    mockStorage.set(STORAGE_KEYS.TRIPS, trips);
    mockStorage.set(STORAGE_KEYS.VEHICLES, vehicles);
    mockStorage.set(STORAGE_KEYS.DRIVERS, drivers);

    return trip;
  },

  async updateProgress(tripId, progressPercent, currentSpeed, currentCoords) {
    const trips = mockStorage.get(STORAGE_KEYS.TRIPS);
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return null;

    trip.progressPercent = Math.min(100, Math.max(0, progressPercent));
    if (currentSpeed !== undefined) trip.currentSpeed = currentSpeed;
    if (currentCoords) trip.currentCoords = currentCoords;

    mockStorage.set(STORAGE_KEYS.TRIPS, trips);
    return trip;
  }
};
