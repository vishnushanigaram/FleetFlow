import { mockStorage, STORAGE_KEYS } from './api/mockStorage';

export const fuelService = {
  async getAll({ vehicleId = '', sortBy = 'date', sortOrder = 'desc' } = {}) {
    await mockStorage.delay(200);
    let list = mockStorage.get(STORAGE_KEYS.FUEL);

    if (vehicleId && vehicleId !== 'ALL') {
      list = list.filter(f => f.vehicleId === vehicleId);
    }

    list.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return list;
  },

  async create(data) {
    await mockStorage.delay(280);
    const list = mockStorage.get(STORAGE_KEYS.FUEL);
    const vehicles = mockStorage.get(STORAGE_KEYS.VEHICLES);

    const vehicle = vehicles.find(v => v.id === data.vehicleId);
    if (!vehicle) throw new Error('Selected vehicle does not exist.');

    const newRecord = {
      id: `FUL-${Date.now().toString().slice(-4)}`,
      vehicleId: vehicle.id,
      vehicleReg: vehicle.registrationNo,
      date: data.date || new Date().toISOString().split('T')[0],
      quantity: Number(data.quantity),
      cost: Number(data.cost),
      odometer: Number(data.odometer || vehicle.odometer || 0),
      fuelType: data.fuelType || vehicle.fuelType,
      station: data.station || 'Regional Highway Fuel Depot',
      driverName: data.driverName || 'Fleet Operator'
    };

    // Update vehicle odometer if higher
    if (newRecord.odometer > vehicle.odometer) {
      vehicle.odometer = newRecord.odometer;
      mockStorage.set(STORAGE_KEYS.VEHICLES, vehicles);
    }

    list.unshift(newRecord);
    mockStorage.set(STORAGE_KEYS.FUEL, list);
    return newRecord;
  },

  async getFuelMetrics() {
    await mockStorage.delay(180);
    const records = mockStorage.get(STORAGE_KEYS.FUEL);

    const totalSpend = records.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
    const totalQuantity = records.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
    const avgCostPerUnit = totalQuantity > 0 ? (totalSpend / totalQuantity) : 0;

    // Group by vehicle
    const byVehicle = {};
    records.forEach(r => {
      if (!byVehicle[r.vehicleReg]) {
        byVehicle[r.vehicleReg] = { vehicleReg: r.vehicleReg, totalCost: 0, totalQty: 0, fillCount: 0 };
      }
      byVehicle[r.vehicleReg].totalCost += Number(r.cost) || 0;
      byVehicle[r.vehicleReg].totalQty += Number(r.quantity) || 0;
      byVehicle[r.vehicleReg].fillCount += 1;
    });

    return {
      totalSpend,
      totalQuantity,
      avgCostPerUnit,
      recordCount: records.length,
      vehicleSummaries: Object.values(byVehicle)
    };
  }
};
