package com.fleetflow.service;

import com.fleetflow.model.*;
import com.fleetflow.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final DeliveryRepository deliveryRepository;

    public TripService(TripRepository tripRepository, VehicleRepository vehicleRepository, DriverRepository driverRepository, DeliveryRepository deliveryRepository) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.deliveryRepository = deliveryRepository;
    }

    public List<Trip> getAll(String search, String status, String vehicleId, String driverId) {
        return tripRepository.findAll().stream()
                .filter(t -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.trim().toLowerCase();
                        boolean match = t.getId().toLowerCase().contains(q) ||
                                t.getOrigin().toLowerCase().contains(q) ||
                                t.getDestination().toLowerCase().contains(q) ||
                                (t.getDriverName() != null && t.getDriverName().toLowerCase().contains(q)) ||
                                (t.getVehicleReg() != null && t.getVehicleReg().toLowerCase().contains(q));
                        if (!match) return false;
                    }
                    if (status != null && !status.equalsIgnoreCase("ALL")) {
                        if (!t.getStatus().equalsIgnoreCase(status)) return false;
                    }
                    if (vehicleId != null && !vehicleId.equalsIgnoreCase("ALL")) {
                        if (!t.getVehicleId().equalsIgnoreCase(vehicleId)) return false;
                    }
                    if (driverId != null && !driverId.equalsIgnoreCase("ALL")) {
                        if (!t.getDriverId().equalsIgnoreCase(driverId)) return false;
                    }
                    return true;
                })
                .toList();
    }

    public Trip getById(String id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Trip with ID " + id + " not found."));
    }

    @Transactional
    public Trip create(Trip trip, String createdBy) {
        // 1. Validate Vehicle Availability
        Vehicle vehicle = vehicleRepository.findById(trip.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Assigned vehicle not found."));

        if (!"Available".equalsIgnoreCase(vehicle.getStatus())) {
            throw new IllegalStateException("Vehicle " + vehicle.getRegistrationNo() + " is currently \"" + vehicle.getStatus() + "\". Only Available vehicles can be assigned.");
        }

        // 2. Validate Driver Availability
        Driver driver = driverRepository.findById(trip.getDriverId())
                .orElseThrow(() -> new IllegalArgumentException("Assigned driver not found."));

        if (!"Available".equalsIgnoreCase(driver.getStatus())) {
            throw new IllegalStateException("Driver " + driver.getName() + " is currently \"" + driver.getStatus() + "\". Only Available drivers can be assigned.");
        }

        String tripId = "TRP-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        trip.setId(tripId);
        trip.setVehicleReg(vehicle.getRegistrationNo());
        trip.setDriverName(driver.getName());

        String status = trip.getStatus() != null ? trip.getStatus() : "Assigned";
        trip.setStatus(status);
        trip.setIsDelayed(false);
        trip.setProgressPercent("In Transit".equalsIgnoreCase(status) ? 10 : 0);
        trip.setCurrentSpeed("In Transit".equalsIgnoreCase(status) ? 60 : 0);

        // Add history entry
        TripStatusHistory history = new TripStatusHistory(
                "SH-" + System.currentTimeMillis(),
                status,
                Instant.now().toString(),
                "Trip authorized and assigned to " + driver.getName() + " with vehicle " + vehicle.getRegistrationNo(),
                createdBy != null ? createdBy : "Operations Dispatcher"
        );
        trip.getStatusHistory().add(history);

        // Update vehicle and driver status
        String assignedVehicleStatus = "In Transit".equalsIgnoreCase(status) ? "On Trip" : "Assigned";
        String assignedDriverStatus = "In Transit".equalsIgnoreCase(status) ? "On Trip" : "Assigned";

        vehicle.setStatus(assignedVehicleStatus);
        vehicle.setCurrentTripId(tripId);
        vehicle.setAssignedDriverId(driver.getId());
        vehicle.setAssignedDriverName(driver.getName());
        vehicleRepository.save(vehicle);

        driver.setStatus(assignedDriverStatus);
        driver.setCurrentTripId(tripId);
        driver.setCurrentVehicleId(vehicle.getId());
        driverRepository.save(driver);

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip updateStatus(String id, String newStatus, String note, String updatedBy) {
        Trip trip = getById(id);

        // Prevent updating completed trip
        if ("Completed".equalsIgnoreCase(trip.getStatus()) && !"Completed".equalsIgnoreCase(newStatus)) {
            throw new IllegalStateException("This trip is already marked as COMPLETED. Completed trips cannot be reverted to active transit.");
        }

        String prevStatus = trip.getStatus();
        trip.setStatus(newStatus);

        if ("Delayed".equalsIgnoreCase(newStatus)) {
            trip.setIsDelayed(true);
        } else if ("Completed".equalsIgnoreCase(newStatus)) {
            trip.setProgressPercent(100);
            trip.setCurrentSpeed(0);
            trip.setIsDelayed(false);
        } else if ("In Transit".equalsIgnoreCase(newStatus) && trip.getActualStart() == null) {
            trip.setActualStart(Instant.now().toString());
            trip.setCurrentSpeed(65);
        }

        // Add history
        trip.getStatusHistory().add(new TripStatusHistory(
                "SH-" + System.currentTimeMillis(),
                newStatus,
                Instant.now().toString(),
                note != null && !note.isEmpty() ? note : "Status transitioned from " + prevStatus + " to " + newStatus,
                updatedBy != null ? updatedBy : "Operations Console"
        ));

        // Release or update assets
        Vehicle vehicle = vehicleRepository.findById(trip.getVehicleId()).orElse(null);
        Driver driver = driverRepository.findById(trip.getDriverId()).orElse(null);

        if ("Completed".equalsIgnoreCase(newStatus) || "Cancelled".equalsIgnoreCase(newStatus)) {
            if (vehicle != null) {
                vehicle.setStatus("Available");
                vehicle.setCurrentTripId(null);
                vehicle.setAssignedDriverId(null);
                vehicle.setAssignedDriverName(null);
                if ("Completed".equalsIgnoreCase(newStatus) && trip.getDistanceKm() != null) {
                    vehicle.setOdometer((vehicle.getOdometer() != null ? vehicle.getOdometer() : 0) + trip.getDistanceKm());
                }
                vehicleRepository.save(vehicle);
            }

            if (driver != null) {
                driver.setStatus("Available");
                driver.setCurrentTripId(null);
                driver.setCurrentVehicleId(null);
                if ("Completed".equalsIgnoreCase(newStatus)) {
                    driver.setCompletedTrips((driver.getCompletedTrips() != null ? driver.getCompletedTrips() : 0) + 1);
                    if (trip.getDistanceKm() != null) {
                        driver.setTotalDistance((driver.getTotalDistance() != null ? driver.getTotalDistance() : 0) + trip.getDistanceKm());
                    }
                }
                driverRepository.save(driver);
            }

            // Also complete linked deliveries
            if ("Completed".equalsIgnoreCase(newStatus)) {
                List<Delivery> deliveries = deliveryRepository.findByTripId(trip.getId());
                for (Delivery d : deliveries) {
                    if (!"Delivered".equalsIgnoreCase(d.getStatus())) {
                        d.setStatus("Delivered");
                        deliveryRepository.save(d);
                    }
                }
            }
        } else if ("In Transit".equalsIgnoreCase(newStatus)) {
            if (vehicle != null) {
                vehicle.setStatus("On Trip");
                vehicleRepository.save(vehicle);
            }
            if (driver != null) {
                driver.setStatus("On Trip");
                driverRepository.save(driver);
            }
        }

        return tripRepository.save(trip);
    }
}

