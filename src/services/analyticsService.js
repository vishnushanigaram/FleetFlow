import { mockStorage, STORAGE_KEYS } from './api/mockStorage';
import { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS, DELIVERY_STATUS, MAINTENANCE_STATUS } from '../utils/constants';

export const analyticsService = {
  async getDashboardMetrics() {
    await mockStorage.delay(200);

    const vehicles = mockStorage.get(STORAGE_KEYS.VEHICLES);
    const drivers = mockStorage.get(STORAGE_KEYS.DRIVERS);
    const trips = mockStorage.get(STORAGE_KEYS.TRIPS);
    const deliveries = mockStorage.get(STORAGE_KEYS.DELIVERIES);
    const maintenance = mockStorage.get(STORAGE_KEYS.MAINTENANCE);
    const fuel = mockStorage.get(STORAGE_KEYS.FUEL);

    // Vehicle metrics
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === VEHICLE_STATUS.AVAILABLE).length;
    const vehiclesOnTrip = vehicles.filter(v => v.status === VEHICLE_STATUS.ON_TRIP).length;
    const vehiclesAssigned = vehicles.filter(v => v.status === VEHICLE_STATUS.ASSIGNED).length;
    const vehiclesUnderMaintenance = vehicles.filter(v => v.status === VEHICLE_STATUS.MAINTENANCE).length;
    const inactiveVehicles = vehicles.filter(v => v.status === VEHICLE_STATUS.INACTIVE).length;

    // Fleet utilization calculation (active usage vs operable fleet)
    const operableFleet = totalVehicles - inactiveVehicles;
    const fleetUtilization = operableFleet > 0 
      ? Math.round(((vehiclesOnTrip + vehiclesAssigned) / operableFleet) * 100)
      : 0;

    // Driver metrics
    const totalDrivers = drivers.length;
    const availableDrivers = drivers.filter(d => d.status === DRIVER_STATUS.AVAILABLE).length;
    const driversOnTrip = drivers.filter(d => d.status === DRIVER_STATUS.ON_TRIP).length;
    const driversOnLeave = drivers.filter(d => d.status === DRIVER_STATUS.LEAVE).length;

    // Trip metrics
    const activeTrips = trips.filter(t => t.status === TRIP_STATUS.IN_TRANSIT || t.status === TRIP_STATUS.DELAYED || t.status === TRIP_STATUS.ASSIGNED).length;
    const inTransitTrips = trips.filter(t => t.status === TRIP_STATUS.IN_TRANSIT).length;
    const completedTrips = trips.filter(t => t.status === TRIP_STATUS.COMPLETED).length;
    const delayedTrips = trips.filter(t => t.status === TRIP_STATUS.DELAYED).length;

    // Delivery metrics
    const totalDeliveries = deliveries.length;
    const deliveredCount = deliveries.filter(d => d.status === DELIVERY_STATUS.DELIVERED).length;
    const delayedDeliveries = deliveries.filter(d => d.status === DELIVERY_STATUS.DELAYED).length;
    const inTransitDeliveries = deliveries.filter(d => d.status === DELIVERY_STATUS.IN_TRANSIT || d.status === DELIVERY_STATUS.OUT_FOR_DELIVERY).length;
    const pendingDeliveries = deliveries.filter(d => d.status === DELIVERY_STATUS.PENDING).length;

    const onTimeDeliveryRate = totalDeliveries > 0
      ? Math.round(((totalDeliveries - delayedDeliveries) / totalDeliveries) * 100)
      : 100;

    // Maintenance metrics
    const pendingMaintenance = maintenance.filter(m => m.status === MAINTENANCE_STATUS.SCHEDULED || m.status === MAINTENANCE_STATUS.IN_PROGRESS || m.status === MAINTENANCE_STATUS.OVERDUE).length;
    const overdueMaintenance = maintenance.filter(m => m.status === MAINTENANCE_STATUS.OVERDUE).length;
    const totalMaintenanceCost = maintenance.reduce((acc, m) => acc + (Number(m.cost) || 0), 0);

    // Fuel metrics
    const totalFuelSpend = fuel.reduce((acc, f) => acc + (Number(f.cost) || 0), 0);
    const totalFuelQuantity = fuel.reduce((acc, f) => acc + (Number(f.quantity) || 0), 0);

    // Recent activities feed
    const activities = [
      ...trips.map(t => ({
        id: `ACT-T-${t.id}`,
        time: t.actualStart || t.plannedStart,
        type: 'TRIP',
        title: `Trip ${t.id} - ${t.status}`,
        description: `${t.origin} → ${t.destination} (${t.driverName})`,
        status: t.status
      })),
      ...maintenance.map(m => ({
        id: `ACT-M-${m.id}`,
        time: m.scheduledDate,
        type: 'MAINTENANCE',
        title: `${m.serviceType} (${m.status})`,
        description: `Vehicle ${m.vehicleReg} at ${m.serviceProvider}`,
        status: m.status
      }))
    ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 6);

    return {
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        onTrip: vehiclesOnTrip,
        assigned: vehiclesAssigned,
        underMaintenance: vehiclesUnderMaintenance,
        inactive: inactiveVehicles,
        utilizationPercentage: fleetUtilization
      },
      drivers: {
        total: totalDrivers,
        available: availableDrivers,
        onTrip: driversOnTrip,
        onLeave: driversOnLeave
      },
      trips: {
        total: trips.length,
        active: activeTrips,
        inTransit: inTransitTrips,
        completed: completedTrips,
        delayed: delayedTrips
      },
      deliveries: {
        total: totalDeliveries,
        delivered: deliveredCount,
        inTransit: inTransitDeliveries,
        pending: pendingDeliveries,
        delayed: delayedDeliveries,
        onTimeRate: onTimeDeliveryRate
      },
      maintenance: {
        pending: pendingMaintenance,
        overdue: overdueMaintenance,
        totalCost: totalMaintenanceCost
      },
      fuel: {
        totalSpend: totalFuelSpend,
        totalQuantity: totalFuelQuantity,
        avgPricePerUnit: totalFuelQuantity > 0 ? (totalFuelSpend / totalFuelQuantity).toFixed(2) : '0.00'
      },
      recentActivities: activities
    };
  },

  async getReportsData() {
    await mockStorage.delay(220);
    const metrics = await this.getDashboardMetrics();
    const vehicles = mockStorage.get(STORAGE_KEYS.VEHICLES);
    const drivers = mockStorage.get(STORAGE_KEYS.DRIVERS);
    const trips = mockStorage.get(STORAGE_KEYS.TRIPS);
    const deliveries = mockStorage.get(STORAGE_KEYS.DELIVERIES);
    const maintenance = mockStorage.get(STORAGE_KEYS.MAINTENANCE);
    const fuel = mockStorage.get(STORAGE_KEYS.FUEL);

    return {
      metrics,
      vehicles,
      drivers,
      trips,
      deliveries,
      maintenance,
      fuel
    };
  }
};
