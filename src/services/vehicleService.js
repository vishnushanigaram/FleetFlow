import { mockStorage, STORAGE_KEYS } from './api/mockStorage';
import { VEHICLE_STATUS } from '../utils/constants';

export const vehicleService = {
  async getAll({ search = '', status = '', type = '', fuelType = '', sortBy = 'registrationNo', sortOrder = 'asc' } = {}) {
    await mockStorage.delay(200);
    let list = mockStorage.get(STORAGE_KEYS.VEHICLES);

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(v =>
        v.registrationNo.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (status && status !== 'ALL') {
      list = list.filter(v => v.status === status);
    }

    // Filter by type
    if (type && type !== 'ALL') {
      list = list.filter(v => v.type === type);
    }

    // Filter by fuelType
    if (fuelType && fuelType !== 'ALL') {
      list = list.filter(v => v.fuelType === fuelType);
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
    await mockStorage.delay(180);
    const list = mockStorage.get(STORAGE_KEYS.VEHICLES);
    const item = list.find(v => v.id === id);
    if (!item) throw new Error(`Vehicle with ID ${id} not found.`);
    return item;
  },

  async create(data) {
    await mockStorage.delay(300);
    const list = mockStorage.get(STORAGE_KEYS.VEHICLES);

    // Validate unique registration number
    const regClean = data.registrationNo.trim().toUpperCase();
    const exists = list.some(v => v.registrationNo.toUpperCase() === regClean);
    if (exists) {
      throw new Error(`Vehicle registration number "${regClean}" is already registered.`);
    }

    const newVehicle = {
      id: `VEH-${Date.now().toString().slice(-4)}`,
      registrationNo: regClean,
      type: data.type,
      model: data.model,
      capacity: Number(data.capacity),
      fuelType: data.fuelType,
      status: data.status || VEHICLE_STATUS.AVAILABLE,
      odometer: Number(data.odometer || 0),
      year: Number(data.year || new Date().getFullYear()),
      fuelCapacity: Number(data.fuelCapacity || 100),
      currentFuelLevel: 100,
      assignedDriverId: null,
      assignedDriverName: null,
      currentTripId: null,
      documents: data.documents || []
    };

    list.unshift(newVehicle);
    mockStorage.set(STORAGE_KEYS.VEHICLES, list);
    return newVehicle;
  },

  async update(id, data) {
    await mockStorage.delay(250);
    const list = mockStorage.get(STORAGE_KEYS.VEHICLES);
    const index = list.findIndex(v => v.id === id);
    if (index === -1) throw new Error(`Vehicle ${id} not found.`);

    if (data.registrationNo) {
      const regClean = data.registrationNo.trim().toUpperCase();
      const duplicate = list.find(v => v.id !== id && v.registrationNo.toUpperCase() === regClean);
      if (duplicate) {
        throw new Error(`Vehicle registration number "${regClean}" is already used by another vehicle.`);
      }
      data.registrationNo = regClean;
    }

    list[index] = { ...list[index], ...data };
    mockStorage.set(STORAGE_KEYS.VEHICLES, list);
    return list[index];
  },

  async delete(id) {
    await mockStorage.delay(250);
    let list = mockStorage.get(STORAGE_KEYS.VEHICLES);
    const vehicle = list.find(v => v.id === id);
    if (!vehicle) throw new Error(`Vehicle ${id} not found.`);

    if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
      throw new Error('Cannot delete or archive a vehicle currently active on a trip.');
    }

    list = list.filter(v => v.id !== id);
    mockStorage.set(STORAGE_KEYS.VEHICLES, list);
    return { success: true, id };
  },

  async addDocument(vehicleId, doc) {
    await mockStorage.delay(200);
    const list = mockStorage.get(STORAGE_KEYS.VEHICLES);
    const vehicle = list.find(v => v.id === vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');

    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      type: doc.type,
      number: doc.number,
      expiryDate: doc.expiryDate
    };

    vehicle.documents = vehicle.documents || [];
    vehicle.documents.push(newDoc);
    mockStorage.set(STORAGE_KEYS.VEHICLES, list);
    return newDoc;
  },

  async getVehicleFullHistory(vehicleId) {
    await mockStorage.delay(200);
    const trips = mockStorage.get(STORAGE_KEYS.TRIPS).filter(t => t.vehicleId === vehicleId);
    const maintenance = mockStorage.get(STORAGE_KEYS.MAINTENANCE).filter(m => m.vehicleId === vehicleId);
    const fuel = mockStorage.get(STORAGE_KEYS.FUEL).filter(f => f.vehicleId === vehicleId);

    return { trips, maintenance, fuel };
  }
};
