import { mockStorage, STORAGE_KEYS } from './api/mockStorage';
import { MAINTENANCE_STATUS, VEHICLE_STATUS } from '../utils/constants';

export const maintenanceService = {
  async getAll({ search = '', status = '', serviceType = '', vehicleId = '', sortBy = 'scheduledDate', sortOrder = 'desc' } = {}) {
    await mockStorage.delay(200);
    let list = mockStorage.get(STORAGE_KEYS.MAINTENANCE);

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(m =>
        m.vehicleReg.toLowerCase().includes(q) ||
        m.serviceType.toLowerCase().includes(q) ||
        (m.notes && m.notes.toLowerCase().includes(q)) ||
        (m.serviceProvider && m.serviceProvider.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'ALL') {
      list = list.filter(m => m.status === status);
    }

    if (serviceType && serviceType !== 'ALL') {
      list = list.filter(m => m.serviceType === serviceType);
    }

    if (vehicleId && vehicleId !== 'ALL') {
      list = list.filter(m => m.vehicleId === vehicleId);
    }

    list.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return list;
  },

  async getById(id) {
    await mockStorage.delay(180);
    const list = mockStorage.get(STORAGE_KEYS.MAINTENANCE);
    const item = list.find(m => m.id === id);
    if (!item) throw new Error(`Maintenance record ${id} not found.`);
    return item;
  },

  async create(data) {
    await mockStorage.delay(300);
    const maintenanceList = mockStorage.get(STORAGE_KEYS.MAINTENANCE);
    const vehicles = mockStorage.get(STORAGE_KEYS.VEHICLES);

    const vehicle = vehicles.find(v => v.id === data.vehicleId);
    if (!vehicle) throw new Error('Selected vehicle not found.');

    const newRecord = {
      id: `MNT-${Date.now().toString().slice(-4)}`,
      vehicleId: vehicle.id,
      vehicleReg: vehicle.registrationNo,
      serviceType: data.serviceType,
      status: data.status || MAINTENANCE_STATUS.SCHEDULED,
      scheduledDate: data.scheduledDate,
      completedDate: data.completedDate || null,
      odometer: Number(data.odometer || vehicle.odometer || 0),
      cost: Number(data.cost || 0),
      notes: data.notes || '',
      serviceProvider: data.serviceProvider || 'Authorized Fleet Service Hub',
      technicianName: data.technicianName || 'Assigned Tech'
    };

    // Business rule: If maintenance is Scheduled or In Progress, update vehicle status if desired
    if (newRecord.status === MAINTENANCE_STATUS.IN_PROGRESS) {
      vehicle.status = VEHICLE_STATUS.MAINTENANCE;
      mockStorage.set(STORAGE_KEYS.VEHICLES, vehicles);
    }

    maintenanceList.unshift(newRecord);
    mockStorage.set(STORAGE_KEYS.MAINTENANCE, maintenanceList);
    return newRecord;
  },

  async updateStatus(id, newStatus, completedDate = null) {
    await mockStorage.delay(220);
    const maintenanceList = mockStorage.get(STORAGE_KEYS.MAINTENANCE);
    const vehicles = mockStorage.get(STORAGE_KEYS.VEHICLES);

    const record = maintenanceList.find(m => m.id === id);
    if (!record) throw new Error(`Maintenance record ${id} not found.`);

    record.status = newStatus;
    if (newStatus === MAINTENANCE_STATUS.COMPLETED) {
      record.completedDate = completedDate || new Date().toISOString().split('T')[0];
    }

    // Update vehicle status
    const vehicle = vehicles.find(v => v.id === record.vehicleId);
    if (vehicle) {
      if (newStatus === MAINTENANCE_STATUS.IN_PROGRESS) {
        vehicle.status = VEHICLE_STATUS.MAINTENANCE;
      } else if (newStatus === MAINTENANCE_STATUS.COMPLETED && vehicle.status === VEHICLE_STATUS.MAINTENANCE) {
        vehicle.status = VEHICLE_STATUS.AVAILABLE;
      }
      mockStorage.set(STORAGE_KEYS.VEHICLES, vehicles);
    }

    mockStorage.set(STORAGE_KEYS.MAINTENANCE, maintenanceList);
    return record;
  }
};
