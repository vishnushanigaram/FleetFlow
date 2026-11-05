package com.fleetflow.service;

import com.fleetflow.model.Maintenance;
import com.fleetflow.model.Vehicle;
import com.fleetflow.repository.MaintenanceRepository;
import com.fleetflow.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class MaintenanceService {
    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository, VehicleRepository vehicleRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<Maintenance> getAll(String search, String status, String serviceType, String vehicleId) {
        return maintenanceRepository.findAll().stream()
                .filter(m -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.trim().toLowerCase();
                        boolean match = m.getVehicleReg().toLowerCase().contains(q) ||
                                m.getServiceType().toLowerCase().contains(q) ||
                                (m.getNotes() != null && m.getNotes().toLowerCase().contains(q));
                        if (!match) return false;
                    }
                    if (status != null && !status.equalsIgnoreCase("ALL")) {
                        if (!m.getStatus().equalsIgnoreCase(status)) return false;
                    }
                    if (serviceType != null && !serviceType.equalsIgnoreCase("ALL")) {
                        if (!m.getServiceType().equalsIgnoreCase(serviceType)) return false;
                    }
                    if (vehicleId != null && !vehicleId.equalsIgnoreCase("ALL")) {
                        if (!m.getVehicleId().equalsIgnoreCase(vehicleId)) return false;
                    }
                    return true;
                })
                .toList();
    }

    public Maintenance getById(String id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance record with ID " + id + " not found."));
    }

    @Transactional
    public Maintenance create(Maintenance maintenance) {
        Vehicle vehicle = vehicleRepository.findById(maintenance.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Selected vehicle not found."));

        if (maintenance.getId() == null) {
            maintenance.setId("MNT-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        maintenance.setVehicleReg(vehicle.getRegistrationNo());
        if (maintenance.getStatus() == null) {
            maintenance.setStatus("Scheduled");
        }
        if (maintenance.getOdometer() == null) {
            maintenance.setOdometer(vehicle.getOdometer());
        }

        // Business rule: Vehicle under maintenance cannot be assigned
        if ("In Progress".equalsIgnoreCase(maintenance.getStatus())) {
            vehicle.setStatus("Maintenance");
            vehicleRepository.save(vehicle);
        }

        return maintenanceRepository.save(maintenance);
    }

    @Transactional
    public Maintenance updateStatus(String id, String newStatus) {
        Maintenance record = getById(id);
        record.setStatus(newStatus);

        if ("Completed".equalsIgnoreCase(newStatus)) {
            record.setCompletedDate(LocalDate.now().toString());
        }

        Vehicle vehicle = vehicleRepository.findById(record.getVehicleId()).orElse(null);
        if (vehicle != null) {
            if ("In Progress".equalsIgnoreCase(newStatus)) {
                vehicle.setStatus("Maintenance");
                vehicleRepository.save(vehicle);
            } else if ("Completed".equalsIgnoreCase(newStatus) && "Maintenance".equalsIgnoreCase(vehicle.getStatus())) {
                vehicle.setStatus("Available");
                vehicleRepository.save(vehicle);
            }
        }

        return maintenanceRepository.save(record);
    }
}

