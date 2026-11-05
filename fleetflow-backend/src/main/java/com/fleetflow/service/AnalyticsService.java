package com.fleetflow.service;

import com.fleetflow.model.*;
import com.fleetflow.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final DeliveryRepository deliveryRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final FuelRecordRepository fuelRecordRepository;

    public AnalyticsService(VehicleRepository vehicleRepository, DriverRepository driverRepository, TripRepository tripRepository, DeliveryRepository deliveryRepository, MaintenanceRepository maintenanceRepository, FuelRecordRepository fuelRecordRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
        this.deliveryRepository = deliveryRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.fuelRecordRepository = fuelRecordRepository;
    }

    public Map<String, Object> getDashboardMetrics() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Driver> drivers = driverRepository.findAll();
        List<Trip> trips = tripRepository.findAll();
        List<Delivery> deliveries = deliveryRepository.findAll();
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        List<FuelRecord> fuelList = fuelRecordRepository.findAll();

        // 1. Vehicle Metrics
        int totalVehicles = vehicles.size();
        long availableVehicles = vehicles.stream().filter(v -> "Available".equalsIgnoreCase(v.getStatus())).count();
        long onTripVehicles = vehicles.stream().filter(v -> "On Trip".equalsIgnoreCase(v.getStatus())).count();
        long assignedVehicles = vehicles.stream().filter(v -> "Assigned".equalsIgnoreCase(v.getStatus())).count();
        long underMaintenance = vehicles.stream().filter(v -> "Maintenance".equalsIgnoreCase(v.getStatus())).count();
        long inactiveVehicles = vehicles.stream().filter(v -> "Inactive".equalsIgnoreCase(v.getStatus())).count();

        long operableFleet = totalVehicles - inactiveVehicles;
        int utilizationPercentage = operableFleet > 0
                ? (int) Math.round(((double) (onTripVehicles + assignedVehicles) / operableFleet) * 100)
                : 0;

        Map<String, Object> vehicleMap = new HashMap<>();
        vehicleMap.put("total", totalVehicles);
        vehicleMap.put("available", availableVehicles);
        vehicleMap.put("onTrip", onTripVehicles);
        vehicleMap.put("assigned", assignedVehicles);
        vehicleMap.put("underMaintenance", underMaintenance);
        vehicleMap.put("inactive", inactiveVehicles);
        vehicleMap.put("utilizationPercentage", utilizationPercentage);

        // 2. Driver Metrics
        int totalDrivers = drivers.size();
        long availableDrivers = drivers.stream().filter(d -> "Available".equalsIgnoreCase(d.getStatus())).count();
        long onTripDrivers = drivers.stream().filter(d -> "On Trip".equalsIgnoreCase(d.getStatus())).count();
        long onLeaveDrivers = drivers.stream().filter(d -> "Leave".equalsIgnoreCase(d.getStatus())).count();

        Map<String, Object> driverMap = new HashMap<>();
        driverMap.put("total", totalDrivers);
        driverMap.put("available", availableDrivers);
        driverMap.put("onTrip", onTripDrivers);
        driverMap.put("onLeave", onLeaveDrivers);

        // 3. Trip Metrics
        long activeTrips = trips.stream().filter(t -> "In Transit".equalsIgnoreCase(t.getStatus()) || "Assigned".equalsIgnoreCase(t.getStatus()) || "Delayed".equalsIgnoreCase(t.getStatus())).count();
        long completedTrips = trips.stream().filter(t -> "Completed".equalsIgnoreCase(t.getStatus())).count();
        long delayedTrips = trips.stream().filter(t -> Boolean.TRUE.equals(t.getIsDelayed()) || "Delayed".equalsIgnoreCase(t.getStatus())).count();

        Map<String, Object> tripMap = new HashMap<>();
        tripMap.put("total", trips.size());
        tripMap.put("active", activeTrips);
        tripMap.put("completed", completedTrips);
        tripMap.put("delayed", delayedTrips);

        // 4. Delivery Metrics
        int totalDeliveries = deliveries.size();
        long deliveredCount = deliveries.stream().filter(d -> "Delivered".equalsIgnoreCase(d.getStatus())).count();
        long delayedDeliveries = deliveries.stream().filter(d -> "Delayed".equalsIgnoreCase(d.getStatus())).count();
        int onTimeRate = totalDeliveries > 0 ? (int) Math.round(((double) (totalDeliveries - delayedDeliveries) / totalDeliveries) * 100) : 100;

        Map<String, Object> deliveryMap = new HashMap<>();
        deliveryMap.put("total", totalDeliveries);
        deliveryMap.put("delivered", deliveredCount);
        deliveryMap.put("delayed", delayedDeliveries);
        deliveryMap.put("onTimeRate", onTimeRate);

        // 5. Maintenance & Fuel
        long pendingMaintenance = maintenanceList.stream().filter(m -> !"Completed".equalsIgnoreCase(m.getStatus())).count();
        long overdueMaintenance = maintenanceList.stream().filter(m -> "Overdue".equalsIgnoreCase(m.getStatus())).count();
        double totalMaintenanceCost = maintenanceList.stream().mapToDouble(m -> m.getCost() != null ? m.getCost() : 0.0).sum();

        Map<String, Object> maintenanceMap = new HashMap<>();
        maintenanceMap.put("pending", pendingMaintenance);
        maintenanceMap.put("overdue", overdueMaintenance);
        maintenanceMap.put("totalCost", totalMaintenanceCost);

        double totalFuelSpend = fuelList.stream().mapToDouble(f -> f.getCost() != null ? f.getCost() : 0.0).sum();
        double totalFuelQty = fuelList.stream().mapToDouble(f -> f.getQuantity() != null ? f.getQuantity() : 0.0).sum();

        Map<String, Object> fuelMap = new HashMap<>();
        fuelMap.put("totalSpend", totalFuelSpend);
        fuelMap.put("totalQuantity", totalFuelQty);
        fuelMap.put("avgPricePerUnit", totalFuelQty > 0 ? String.format("%.2f", totalFuelSpend / totalFuelQty) : "0.00");

        Map<String, Object> result = new HashMap<>();
        result.put("vehicles", vehicleMap);
        result.put("drivers", driverMap);
        result.put("trips", tripMap);
        result.put("deliveries", deliveryMap);
        result.put("maintenance", maintenanceMap);
        result.put("fuel", fuelMap);

        return result;
    }
}

