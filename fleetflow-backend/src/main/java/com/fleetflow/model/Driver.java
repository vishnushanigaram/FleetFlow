package com.fleetflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String contact;
    private String email;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    private String licenseCategory;
    private String licenseExpiry;
    private Integer experienceYears;
    private String status; // Available, Assigned, On Trip, Leave, Inactive
    private Double rating;
    private Integer safetyScore;
    private Integer completedTrips;
    private Integer delayedTrips;
    private Double totalDistance;
    private String avatar;
    private String currentTripId;
    private String currentVehicleId;

    public Driver() {}

    public Driver(String id, String name, String contact, String email, String licenseNumber, String licenseCategory, String licenseExpiry, Integer experienceYears, String status, Double rating, Integer safetyScore, Integer completedTrips, Integer delayedTrips, Double totalDistance, String avatar) {
        this.id = id;
        this.name = name;
        this.contact = contact;
        this.email = email;
        this.licenseNumber = licenseNumber;
        this.licenseCategory = licenseCategory;
        this.licenseExpiry = licenseExpiry;
        this.experienceYears = experienceYears;
        this.status = status;
        this.rating = rating;
        this.safetyScore = safetyScore;
        this.completedTrips = completedTrips;
        this.delayedTrips = delayedTrips;
        this.totalDistance = totalDistance;
        this.avatar = avatar;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getLicenseCategory() { return licenseCategory; }
    public void setLicenseCategory(String licenseCategory) { this.licenseCategory = licenseCategory; }

    public String getLicenseExpiry() { return licenseExpiry; }
    public void setLicenseExpiry(String licenseExpiry) { this.licenseExpiry = licenseExpiry; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getSafetyScore() { return safetyScore; }
    public void setSafetyScore(Integer safetyScore) { this.safetyScore = safetyScore; }

    public Integer getCompletedTrips() { return completedTrips; }
    public void setCompletedTrips(Integer completedTrips) { this.completedTrips = completedTrips; }

    public Integer getDelayedTrips() { return delayedTrips; }
    public void setDelayedTrips(Integer delayedTrips) { this.delayedTrips = delayedTrips; }

    public Double getTotalDistance() { return totalDistance; }
    public void setTotalDistance(Double totalDistance) { this.totalDistance = totalDistance; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getCurrentTripId() { return currentTripId; }
    public void setCurrentTripId(String currentTripId) { this.currentTripId = currentTripId; }

    public String getCurrentVehicleId() { return currentVehicleId; }
    public void setCurrentVehicleId(String currentVehicleId) { this.currentVehicleId = currentVehicleId; }
}

