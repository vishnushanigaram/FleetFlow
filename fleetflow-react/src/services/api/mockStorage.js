import {
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_DELIVERIES,
  INITIAL_MAINTENANCE,
  INITIAL_FUEL_RECORDS,
  INITIAL_NOTIFICATIONS
} from '../../data/mockData';

const STORAGE_KEYS = {
  USERS: 'fleetflow_users',
  VEHICLES: 'fleetflow_vehicles',
  DRIVERS: 'fleetflow_drivers',
  TRIPS: 'fleetflow_trips',
  DELIVERIES: 'fleetflow_deliveries',
  MAINTENANCE: 'fleetflow_maintenance',
  FUEL: 'fleetflow_fuel',
  NOTIFICATIONS: 'fleetflow_notifications',
  SIMULATE_ERROR: 'fleetflow_simulate_api_error'
};

class MockStorage {
  constructor() {
    this.init();
  }

  init(force = false) {
    if (force || !localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.DRIVERS)) {
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(INITIAL_DRIVERS));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.TRIPS)) {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(INITIAL_TRIPS));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.DELIVERIES)) {
      localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(INITIAL_DELIVERIES));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.MAINTENANCE)) {
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(INITIAL_MAINTENANCE));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.FUEL)) {
      localStorage.setItem(STORAGE_KEYS.FUEL, JSON.stringify(INITIAL_FUEL_RECORDS));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }

  resetAll() {
    this.init(true);
  }

  get(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }

  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async delay(ms = 220) {
    // Check if intentional API error simulation is enabled
    if (localStorage.getItem(STORAGE_KEYS.SIMULATE_ERROR) === 'true') {
      await new Promise(r => setTimeout(r, ms));
      throw new Error('Simulated Network Error: Failed to reach FleetFlow API Server (503 Service Unavailable).');
    }
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  toggleSimulatedError(enable) {
    if (enable !== undefined) {
      localStorage.setItem(STORAGE_KEYS.SIMULATE_ERROR, enable ? 'true' : 'false');
    } else {
      const current = localStorage.getItem(STORAGE_KEYS.SIMULATE_ERROR) === 'true';
      localStorage.setItem(STORAGE_KEYS.SIMULATE_ERROR, current ? 'false' : 'true');
    }
  }

  isSimulatedErrorActive() {
    return localStorage.getItem(STORAGE_KEYS.SIMULATE_ERROR) === 'true';
  }
}

export const mockStorage = new MockStorage();
export { STORAGE_KEYS };
