package com.fleetflow.service;

import com.fleetflow.model.Vehicle;
import com.fleetflow.model.VehicleDocument;
import com.fleetflow.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAll(String search, String status, String type, String fuelType) {
        List<Vehicle> list = vehicleRepository.findAll();

        return list.stream()
                .filter(v -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.trim().toLowerCase();
                        boolean match = v.getRegistrationNo().toLowerCase().contains(q) ||
                                (v.getModel() != null && v.getModel().toLowerCase().contains(q)) ||
                                (v.getType() != null && v.getType().toLowerCase().contains(q));
                        if (!match) return false;
                    }
                    if (status != null && !status.equalsIgnoreCase("ALL")) {
                        if (!v.getStatus().equalsIgnoreCase(status)) return false;
                    }
                    if (type != null && !type.equalsIgnoreCase("ALL")) {
                        if (!v.getType().equalsIgnoreCase(type)) return false;
                    }
                    if (fuelType != null && !fuelType.equalsIgnoreCase("ALL")) {
                        if (!v.getFuelType().equalsIgnoreCase(fuelType)) return false;
                    }
                    return true;
                })
                .toList();
    }

    public Vehicle getById(String id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle with ID " + id + " not found."));
    }

    public Vehicle create(Vehicle vehicle) {
        String cleanReg = vehicle.getRegistrationNo().trim().toUpperCase();
        if (vehicleRepository.existsByRegistrationNoIgnoreCase(cleanReg)) {
            throw new IllegalArgumentException("Vehicle registration number \"" + cleanReg + "\" is already registered.");
        }

        vehicle.setRegistrationNo(cleanReg);
        if (vehicle.getId() == null) {
            vehicle.setId("VEH-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        if (vehicle.getStatus() == null) {
            vehicle.setStatus("Available");
        }
        if (vehicle.getCurrentFuelLevel() == null) {
            vehicle.setCurrentFuelLevel(100);
        }

        return vehicleRepository.save(vehicle);
    }

    public Vehicle update(String id, Vehicle updated) {
        Vehicle existing = getById(id);

        if (updated.getRegistrationNo() != null) {
            String cleanReg = updated.getRegistrationNo().trim().toUpperCase();
            if (!existing.getRegistrationNo().equalsIgnoreCase(cleanReg) && vehicleRepository.existsByRegistrationNoIgnoreCase(cleanReg)) {
                throw new IllegalArgumentException("Vehicle registration number \"" + cleanReg + "\" is already used by another vehicle.");
            }
            existing.setRegistrationNo(cleanReg);
        }

        if (updated.getModel() != null) existing.setModel(updated.getModel());
        if (updated.getType() != null) existing.setType(updated.getType());
        if (updated.getCapacity() != null) existing.setCapacity(updated.getCapacity());
        if (updated.getFuelType() != null) existing.setFuelType(updated.getFuelType());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getOdometer() != null) existing.setOdometer(updated.getOdometer());
        if (updated.getYear() != null) existing.setYear(updated.getYear());

        return vehicleRepository.save(existing);
    }

    public void delete(String id) {
        Vehicle vehicle = getById(id);
        if ("On Trip".equalsIgnoreCase(vehicle.getStatus())) {
            throw new IllegalStateException("Cannot delete or archive a vehicle currently active on a trip.");
        }
        vehicleRepository.delete(vehicle);
    }

    public Vehicle addDocument(String vehicleId, VehicleDocument doc) {
        Vehicle vehicle = getById(vehicleId);
        if (doc.getId() == null) {
            doc.setId("DOC-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        vehicle.getDocuments().add(doc);
        return vehicleRepository.save(vehicle);
    }
}

