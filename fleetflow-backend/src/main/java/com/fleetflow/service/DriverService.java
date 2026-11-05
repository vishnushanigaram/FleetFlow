package com.fleetflow.service;

import com.fleetflow.model.Driver;
import com.fleetflow.repository.DriverRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DriverService {
    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> getAll(String search, String status) {
        return driverRepository.findAll().stream()
                .filter(d -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.trim().toLowerCase();
                        boolean match = d.getName().toLowerCase().contains(q) ||
                                d.getLicenseNumber().toLowerCase().contains(q) ||
                                (d.getContact() != null && d.getContact().toLowerCase().contains(q));
                        if (!match) return false;
                    }
                    if (status != null && !status.equalsIgnoreCase("ALL")) {
                        if (!d.getStatus().equalsIgnoreCase(status)) return false;
                    }
                    return true;
                })
                .toList();
    }

    public Driver getById(String id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver with ID " + id + " not found."));
    }

    public Driver create(Driver driver) {
        String cleanLic = driver.getLicenseNumber().trim().toUpperCase();
        if (driverRepository.existsByLicenseNumberIgnoreCase(cleanLic)) {
            throw new IllegalArgumentException("Driver license \"" + cleanLic + "\" is already registered to another driver.");
        }

        driver.setLicenseNumber(cleanLic);
        if (driver.getId() == null) {
            driver.setId("DRV-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        if (driver.getStatus() == null) {
            driver.setStatus("Available");
        }
        if (driver.getRating() == null) driver.setRating(5.0);
        if (driver.getSafetyScore() == null) driver.setSafetyScore(100);
        if (driver.getCompletedTrips() == null) driver.setCompletedTrips(0);
        if (driver.getDelayedTrips() == null) driver.setDelayedTrips(0);
        if (driver.getTotalDistance() == null) driver.setTotalDistance(0.0);
        if (driver.getAvatar() == null) {
            driver.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");
        }

        return driverRepository.save(driver);
    }

    public Driver update(String id, Driver updated) {
        Driver existing = getById(id);

        if (updated.getLicenseNumber() != null) {
            String cleanLic = updated.getLicenseNumber().trim().toUpperCase();
            if (!existing.getLicenseNumber().equalsIgnoreCase(cleanLic) && driverRepository.existsByLicenseNumberIgnoreCase(cleanLic)) {
                throw new IllegalArgumentException("Driver license \"" + cleanLic + "\" is already registered to another driver.");
            }
            existing.setLicenseNumber(cleanLic);
        }

        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getContact() != null) existing.setContact(updated.getContact());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getLicenseCategory() != null) existing.setLicenseCategory(updated.getLicenseCategory());
        if (updated.getLicenseExpiry() != null) existing.setLicenseExpiry(updated.getLicenseExpiry());
        if (updated.getExperienceYears() != null) existing.setExperienceYears(updated.getExperienceYears());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        return driverRepository.save(existing);
    }

    public Driver deactivate(String id) {
        Driver driver = getById(id);
        if ("On Trip".equalsIgnoreCase(driver.getStatus())) {
            throw new IllegalStateException("Cannot deactivate a driver who is currently active on a trip.");
        }
        driver.setStatus("Inactive");
        return driverRepository.save(driver);
    }
}

